import { Bike, Dumbbell, Footprints, Gift, Route, Users, Waves, type LucideIcon } from "lucide-react";
import type { Kind } from "@/data/types";

export const KIND_META: Record<Kind, { label: string; plural: string; color: string; soft: string; icon: LucideIcon }> = {
  swim: { label: "Piscina", plural: "Piscinas", color: "#0a7ea4", soft: "#e6f3f7", icon: Waves },
  track: { label: "Pista", plural: "Pistas", color: "#e0603f", soft: "#fcece7", icon: Footprints },
  gym: { label: "Gimnasio", plural: "Gimnasios", color: "#5a55d2", soft: "#eeedfb", icon: Dumbbell },
  club: { label: "Club de triatlón", plural: "Clubes", color: "#2e9e6b", soft: "#e7f5ee", icon: Users },
  runclub: { label: "Run club", plural: "Run clubs", color: "#d6457a", soft: "#fcebf1", icon: Route },
  cycling: { label: "Ciclismo", plural: "Ciclismo", color: "#c97a12", soft: "#fbf2e2", icon: Bike },
  free: { label: "Gratis", plural: "Gratis", color: "#c98a12", soft: "#fbf2e2", icon: Gift },
};

export function KindTag({ kind }: { kind: Kind }) {
  const m = KIND_META[kind];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: m.soft, color: m.color }}>
      <Icon size={13} strokeWidth={2.2} />
      {m.label}
    </span>
  );
}
