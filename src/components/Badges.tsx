import { BadgeCheck, Clock3, HelpCircle } from "lucide-react";
import type { Facility, Price } from "@/data/types";

export function PriceStatus({ price }: { price?: Price }) {
  if (!price || price.status === "unknown")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-[11.5px] font-semibold text-muted">
        <HelpCircle size={12} /> Por confirmar
      </span>
    );
  if (price.status === "verified")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-2 py-0.5 text-[11.5px] font-semibold text-ok">
        <BadgeCheck size={12} /> Verificado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warn-soft px-2 py-0.5 text-[11.5px] font-semibold text-warn" title="Tarifa oficial de ese año: puede haber cambiado">
      <Clock3 size={12} /> Tarifa {price.year}
    </span>
  );
}

export function FacilityStatus({ facility }: { facility: Facility }) {
  if (!facility.statusNote) return null;
  const tone =
    facility.status === "works" || facility.status === "intermittent"
      ? "bg-[#fdecea] text-[#b4372a]"
      : "bg-warn-soft text-warn";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{facility.statusNote}</span>;
}
