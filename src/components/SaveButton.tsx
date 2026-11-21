"use client";

import { Heart } from "lucide-react";
import { useSaved } from "@/lib/useSaved";

export function SaveButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Quitar de guardados" : "Guardar"}
      className={`relative z-10 inline-flex items-center justify-center gap-2 rounded-full font-semibold backdrop-blur transition ${
        compact ? "h-9 w-9 bg-white/90 shadow-sm" : "h-11 bg-surface px-4 ring-1 ring-line hover:ring-line-strong"
      }`}
    >
      <Heart size={compact ? 17 : 18} className={saved ? "fill-[#e0603f] text-[#e0603f]" : "text-ink"} />
      {compact ? null : saved ? "Guardado" : "Guardar"}
    </button>
  );
}
