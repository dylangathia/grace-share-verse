import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.3";
import { corsHeaders } from "@supabase/supabase-js/cors";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RequestSchema = z.object({
  book: z.string().min(1).max(50),
  chapter: z.number().int().min(1).max(150),
  translation: z.string().min(2).max(10).default("kjv"),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { book, chapter, translation } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check cache
    const { data: cached } = await supabase
      .from("bible_cache")
      .select("verses")
      .eq("book", book.toLowerCase())
      .eq("chapter", chapter)
      .eq("translation", translation)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({ book, chapter, translation, verses: cached.verses, source: "cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch from bible-api.com
    const apiUrl = `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${translation}`;
    const apiRes = await fetch(apiUrl);

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`Bible API error [${apiRes.status}]: ${errText}`);
    }

    const apiData = await apiRes.json();

    if (!apiData.verses || !Array.isArray(apiData.verses)) {
      throw new Error("Invalid response from Bible API");
    }

    const verses = apiData.verses.map((v: { verse: number; text: string }) => ({
      number: v.verse,
      text: v.text.trim(),
    }));

    // 3. Cache in database
    await supabase.from("bible_cache").upsert({
      book: book.toLowerCase(),
      chapter,
      translation,
      verses,
    }, { onConflict: "book,chapter,translation" });

    return new Response(JSON.stringify({ book, chapter, translation, verses, source: "api" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Bible fetch error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
