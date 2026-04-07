
CREATE TABLE public.bible_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  translation TEXT NOT NULL DEFAULT 'kjv',
  verses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (book, chapter, translation)
);

ALTER TABLE public.bible_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached Bible chapters"
  ON public.bible_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert Bible cache"
  ON public.bible_cache
  FOR INSERT
  TO service_role
  WITH CHECK (true);
