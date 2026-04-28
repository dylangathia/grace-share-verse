import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Palette, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ShareVerseDialogProps {
  open: boolean;
  onClose: () => void;
  verse: { reference: string; text: string } | null;
}

type Theme = "parchment" | "indigo" | "rose" | "forest";

const themes: Record<Theme, { bg: string[]; text: string; accent: string; label: string }> = {
  parchment: {
    bg: ["#F5EFE0", "#EDE2C8"],
    text: "#3A3528",
    accent: "#B89B5E",
    label: "Parchment",
  },
  indigo: {
    bg: ["#1E2746", "#2E3A6B"],
    text: "#F2EBD8",
    accent: "#E2B864",
    label: "Indigo Night",
  },
  rose: {
    bg: ["#F4D9D0", "#E8A89E"],
    text: "#4A2A2A",
    accent: "#8E3A50",
    label: "Rose Dawn",
  },
  forest: {
    bg: ["#2A3D2E", "#3F5944"],
    text: "#EFE6CF",
    accent: "#D4B36A",
    label: "Forest Vesper",
  },
};

const SIZE = 1080;

const drawCard = async (
  canvas: HTMLCanvasElement,
  verse: { reference: string; text: string },
  theme: Theme
) => {
  const t = themes[theme];
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = SIZE;
  canvas.height = SIZE;

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, t.bg[0]);
  grad.addColorStop(1, t.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle texture (dot pattern)
  ctx.fillStyle = t.text;
  ctx.globalAlpha = 0.03;
  for (let x = 0; x < SIZE; x += 20) {
    for (let y = 0; y < SIZE; y += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Decorative top ornament
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - 60, 140);
  ctx.lineTo(SIZE / 2 + 60, 140);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(SIZE / 2, 140, 6, 0, Math.PI * 2);
  ctx.fillStyle = t.accent;
  ctx.fill();

  // Verse text — wrap with proper measurement
  ctx.fillStyle = t.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Choose font size based on text length
  const len = verse.text.length;
  const fontSize = len > 280 ? 42 : len > 180 ? 50 : len > 100 ? 60 : 70;
  ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`;

  const maxWidth = SIZE - 200;
  const words = verse.text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const lineHeight = fontSize * 1.4;
  const totalHeight = lines.length * lineHeight;
  const startY = SIZE / 2 - totalHeight / 2 + lineHeight / 2;

  // Opening quote mark
  ctx.font = `italic ${fontSize * 1.4}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = t.accent;
  ctx.globalAlpha = 0.5;
  ctx.fillText("\u201C", SIZE / 2, startY - lineHeight);
  ctx.globalAlpha = 1;

  // Verse lines
  ctx.fillStyle = t.text;
  ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`;
  lines.forEach((l, i) => {
    ctx.fillText(l, SIZE / 2, startY + i * lineHeight);
  });

  // Closing quote
  ctx.font = `italic ${fontSize * 1.4}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = t.accent;
  ctx.globalAlpha = 0.5;
  ctx.fillText("\u201D", SIZE / 2, startY + totalHeight + lineHeight * 0.2);
  ctx.globalAlpha = 1;

  // Reference
  ctx.fillStyle = t.accent;
  ctx.font = `600 32px "Inter", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(verse.reference.toUpperCase(), SIZE / 2, SIZE - 180);

  // Bottom ornament
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - 100, SIZE - 130);
  ctx.lineTo(SIZE / 2 + 100, SIZE - 130);
  ctx.stroke();

  // Branding
  ctx.fillStyle = t.text;
  ctx.globalAlpha = 0.5;
  ctx.font = `400 22px "Inter", system-ui, sans-serif`;
  ctx.fillText("SANCTUARY", SIZE / 2, SIZE - 90);
  ctx.globalAlpha = 1;
};

const ShareVerseDialog = ({ open, onClose, verse }: ShareVerseDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<Theme>("parchment");
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!open || !verse || !canvasRef.current) return;
    setRendering(true);
    // Wait a frame so fonts are loaded
    const t = setTimeout(async () => {
      // Try to load Playfair Display before drawing
      try {
        if ("fonts" in document) {
          await (document as any).fonts.load("italic 60px 'Playfair Display'");
        }
      } catch {}
      if (canvasRef.current && verse) {
        await drawCard(canvasRef.current, verse, theme);
      }
      setRendering(false);
    }, 50);
    return () => clearTimeout(t);
  }, [open, verse, theme]);

  if (!verse) return null;

  const filename = `verse-${verse.reference.replace(/[^\w]+/g, "-").toLowerCase()}.png`;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Verse card downloaded");
    });
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], filename, { type: "image/png" });
      const shareData: ShareData = {
        title: verse.reference,
        text: `"${verse.text}" — ${verse.reference}`,
        files: [file],
      };
      const nav: any = navigator;
      if (nav.canShare && nav.canShare(shareData) && nav.share) {
        try {
          await nav.share(shareData);
        } catch (e) {
          // user cancelled
        }
      } else {
        handleDownload();
      }
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold">Share Verse</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Preview */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-4">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block"
                  style={{ imageRendering: "auto" }}
                />
                {rendering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-accent" size={24} />
                  </div>
                )}
              </div>

              {/* Theme picker */}
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-widest font-body font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Palette size={12} /> Theme
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(themes) as Theme[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        theme === key
                          ? "border-accent scale-95"
                          : "border-transparent hover:border-border"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${themes[key].bg[0]}, ${themes[key].bg[1]})`,
                      }}
                      aria-label={themes[key].label}
                    >
                      <span
                        className="absolute inset-x-0 bottom-0 text-[8px] font-body font-medium py-1 text-center"
                        style={{ color: themes[key].text, background: `${themes[key].bg[1]}cc` }}
                      >
                        {themes[key].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  disabled={rendering}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-body font-medium text-sm px-4 py-2.5 rounded-lg hover:brightness-95 disabled:opacity-50 transition-all"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={handleShare}
                  disabled={rendering}
                  className="flex-1 gold-button text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareVerseDialog;
