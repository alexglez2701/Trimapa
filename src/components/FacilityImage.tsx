import type { Facility } from "@/data/types";
import { Cover } from "./Cover";

/** Foto real de la instalación si la hay; si no, la ilustración de su tipo. */
export function FacilityImage({ facility, id, className = "" }: { facility: Facility; id: string; className?: string }) {
  if (facility.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={facility.photo.src} alt={facility.photo.alt} loading="lazy" decoding="async" className={`object-cover ${className}`} />
    );
  }
  return <Cover kind={facility.kinds[0]} id={id} className={className} />;
}
