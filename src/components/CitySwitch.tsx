import Link from "next/link";
import { CITIES } from "@/data/facilities";
import type { CityId } from "@/data/types";

export function CitySwitch({ current, suffix = "" }: { current: CityId; suffix?: string }) {
  return (
    <div role="group" aria-label="Ciudad" className="inline-flex rounded-full bg-white/90 p-1 shadow-[var(--shadow-card)] ring-1 ring-line backdrop-blur">
      {CITIES.map((c) => {
        const on = c.id === current;
        return (
          <Link
            key={c.id}
            href={`/${c.id}${suffix}`}
            aria-current={on ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${on ? "bg-ink text-white" : "text-ink-2 hover:text-ink"}`}
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
