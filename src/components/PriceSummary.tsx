import { CalendarDays, CalendarRange, Ticket } from "lucide-react";
import type { Facility } from "@/data/types";
import { priceSummary, type SummaryItem } from "@/lib/pricing";

const ROWS = [
  { key: "daily", label: "Diario", icon: CalendarDays },
  { key: "monthly", label: "Mensual", icon: CalendarRange },
  { key: "bono", label: "Bono", icon: Ticket },
] as const;

function tone(item: SummaryItem) {
  if (item.state === "price") return "text-ink";
  return "text-muted";
}

/** Precio diario, mensual y bono de un vistazo. `size="lg"` para la ficha. */
export function PriceSummary({ facility, size = "sm" }: { facility: Facility; size?: "sm" | "lg" }) {
  if (facility.status === "works") {
    return <p className="rounded-2xl bg-canvas px-3 py-2.5 text-sm text-muted">Cerrada por obras: sin precios hasta que reabra.</p>;
  }
  if (facility.kinds.length === 1 && facility.kinds[0] === "club") {
    const cuota = facility.prices.find((p) => p.type === "cuota");
    return (
      <p className="rounded-2xl bg-canvas px-3 py-2.5 text-sm">
        <span className="text-muted">Cuota de socio: </span>
        <span className="font-semibold">{cuota?.amount != null ? `${cuota.amount} €` : "por confirmar"}</span>
      </p>
    );
  }
  const s = priceSummary(facility);
  const lg = size === "lg";
  return (
    <dl className={`grid grid-cols-3 overflow-hidden rounded-2xl bg-canvas ${lg ? "ring-1 ring-line" : ""}`}>
      {ROWS.map(({ key, label, icon: Icon }, i) => {
        const item = s[key];
        return (
          <div key={key} className={`min-w-0 ${lg ? "p-4" : "px-3 py-2.5"} ${i ? "border-l border-line" : ""}`}>
            <dt className={`flex items-center gap-1.5 font-semibold text-muted ${lg ? "text-sm" : "text-[11.5px]"}`}>
              <Icon size={lg ? 15 : 13} /> {label}
            </dt>
            <dd className={`tabular mt-1 font-extrabold leading-tight tracking-tight ${tone(item)} ${item.state === "price" ? (lg ? "text-xl" : "text-[15px]") : lg ? "text-sm font-semibold" : "text-[12.5px] font-semibold"}`}>
              {item.value}
            </dd>
            {item.detail ? <dd className={`mt-0.5 leading-snug text-muted ${lg ? "text-xs" : "text-[11px]"}`}>{item.detail}</dd> : null}
          </div>
        );
      })}
    </dl>
  );
}
