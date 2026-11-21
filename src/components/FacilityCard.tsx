import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Facility } from "@/data/types";
import { FacilityImage } from "./FacilityImage";
import { KindTag } from "./kinds";
import { FacilityStatus } from "./Badges";
import { PriceSummary } from "./PriceSummary";
import { SaveButton } from "./SaveButton";

export function FacilityCard({
  facility,
  selected = false,
  onHover,
}: {
  facility: Facility;
  selected?: boolean;
  onHover?: (slug: string | null) => void;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)] ring-1 transition ${selected ? "ring-2 ring-accent" : "ring-line hover:ring-line-strong"}`}
      onMouseEnter={() => onHover?.(facility.slug)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="relative h-32 overflow-hidden">
        <FacilityImage facility={facility} id={facility.slug} className="h-full w-full transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <FacilityStatus facility={facility} />
        </div>
        <div className="absolute right-3 top-3">
          <SaveButton slug={facility.slug} compact />
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-[17px] font-bold leading-snug">
            <Link href={`/${facility.city}/${facility.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {facility.name}
            </Link>
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} /> {facility.zone}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {facility.kinds.map((k) => (
            <KindTag key={k} kind={k} />
          ))}
        </div>
        <PriceSummary facility={facility} />
      </div>
    </article>
  );
}
