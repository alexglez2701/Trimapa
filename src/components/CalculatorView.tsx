"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Info, Minus, Plus, Sparkles } from "lucide-react";
import type { City, Discipline, Facility } from "@/data/types";
import { cheapestPlan, DISCIPLINE_LABEL, formatEuro, type Need } from "@/lib/pricing";
import { CitySwitch } from "./CitySwitch";
import { KIND_META } from "./kinds";
import { LogoMark } from "./Logo";

const ROWS: { d: Discipline; title: string; hint: string; max: number }[] = [
  { d: "swim", title: "Natación en piscina", hint: "Sesiones por semana", max: 7 },
  { d: "track", title: "Series en pista", hint: "Sesiones por semana", max: 4 },
  { d: "gym", title: "Gimnasio y fuerza", hint: "Sesiones por semana", max: 7 },
];

const PRESETS: { label: string; need: Need }[] = [
  { label: "Empezando", need: { swim: 2, track: 1, gym: 1 } },
  { label: "Distancia olímpica", need: { swim: 3, track: 1, gym: 2 } },
  { label: "Larga distancia", need: { swim: 4, track: 2, gym: 2 } },
];

export function CalculatorView({ city, facilities }: { city: City; facilities: Facility[] }) {
  const [need, setNeed] = useState<Need>({ swim: 3, track: 1, gym: 2 });
  const result = useMemo(() => cheapestPlan(facilities, need), [facilities, need]);
  const sessions = need.swim + need.track + need.gym;
  const best = result.best;

  const compare = [
    best ? { label: "Tu mejor opción", value: best.monthly, best: true } : null,
    result.withoutAbonos && result.withoutAbonos !== best ? { label: "Sin abonos", value: result.withoutAbonos.monthly, best: false } : null,
    result.bestWithAbono && result.bestWithAbono !== best ? { label: "Con abono", value: result.bestWithAbono.monthly, best: false } : null,
  ].filter(Boolean) as { label: string; value: number; best: boolean }[];
  const max = Math.max(...compare.map((c) => c.value), 1);
  const saving = compare.length > 1 ? Math.max(...compare.map((c) => c.value)) - (best?.monthly ?? 0) : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-[max(16px,env(safe-area-inset-top))] lg:pt-24">
      <div className="flex items-center justify-between gap-3">
        <span className="lg:invisible"><LogoMark size={32} /></span>
        <CitySwitch current={city.id} suffix="/calculadora" />
      </div>
      <h1 className="mt-6 text-[30px] font-extrabold leading-tight lg:text-[38px]">¿Qué te sale más barato en {city.name}?</h1>
      <p className="mt-2 max-w-xl text-[15.5px] leading-relaxed text-ink-2">
        Dinos cuánto entrenas cada semana y comparamos entradas, bonos y abonos de todas las instalaciones de la ciudad.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <section aria-label="Tu semana" className="space-y-3">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {PRESETS.map((p) => {
              const on = p.need.swim === need.swim && p.need.track === need.track && p.need.gym === need.gym;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setNeed(p.need)}
                  aria-pressed={on}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${on ? "bg-ink text-white ring-ink" : "bg-surface text-ink-2 ring-line hover:ring-line-strong"}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          {ROWS.map(({ d, title, hint, max }) => {
            const meta = KIND_META[d];
            const Icon = meta.icon;
            const v = need[d];
            return (
              <div key={d} className="flex items-center gap-4 rounded-[var(--radius-card)] bg-surface p-4 shadow-[var(--shadow-card)] ring-1 ring-line">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: meta.soft, color: meta.color }}>
                  <Icon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p id={`l-${d}`} className="font-bold">
                    {title}
                  </p>
                  <p className="text-sm text-muted">{hint}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-canvas p-1 ring-1 ring-line" role="group" aria-labelledby={`l-${d}`}>
                  <button
                    type="button"
                    aria-label={`Menos sesiones de ${DISCIPLINE_LABEL[d]}`}
                    disabled={v === 0}
                    onClick={() => setNeed({ ...need, [d]: v - 1 })}
                    className="grid h-9 w-9 place-items-center rounded-full bg-surface shadow-sm disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <output aria-live="polite" className="tabular w-8 text-center text-lg font-extrabold">
                    {v}
                  </output>
                  <button
                    type="button"
                    aria-label={`Más sesiones de ${DISCIPLINE_LABEL[d]}`}
                    disabled={v === max}
                    onClick={() => setNeed({ ...need, [d]: v + 1 })}
                    className="grid h-9 w-9 place-items-center rounded-full bg-surface shadow-sm disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section aria-live="polite" aria-label="Resultado" className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-float)] ring-1 ring-line lg:sticky lg:top-24">
          {sessions === 0 ? (
            <p className="text-ink-2">Añade alguna sesión para ver qué te conviene.</p>
          ) : result.missing.length ? (
            <p className="text-ink-2">
              Todavía no tenemos precios de {result.missing.map((d) => DISCIPLINE_LABEL[d]).join(" ni de ")} en {city.name}. Estamos completando los datos.
            </p>
          ) : best ? (
            <>
              <p className="flex items-center gap-2 text-sm font-semibold text-accent">
                <Sparkles size={16} /> Tu plan más barato
              </p>
              <p className="mt-2">
                <span className="tabular text-[52px] font-extrabold leading-none tracking-tight">{formatEuro(best.monthly).replace(/\s?€/, "")}</span>
                <span className="ml-1.5 text-lg font-semibold text-muted">€/mes</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                {sessions} {sessions === 1 ? "sesión" : "sesiones"} a la semana · {best.abonos ? `${best.abonos} ${best.abonos === 1 ? "abono" : "abonos"}` : "sin abonos"}
              </p>

              <ul className="mt-5 space-y-3 border-t border-line pt-4">
                {best.lines.map((l) => (
                  <li key={l.title + l.facilitySlug} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold">{l.title}</p>
                      <Link href={`/${city.id}/${l.facilitySlug}`} className="text-sm text-muted hover:text-accent hover:underline">
                        {l.detail}
                      </Link>
                    </div>
                    <span className="tabular shrink-0 font-bold">{formatEuro(l.monthly)}</span>
                  </li>
                ))}
              </ul>

              {compare.length > 1 ? (
                <div className="mt-5 space-y-2.5 border-t border-line pt-4">
                  {compare.map((c) => (
                    <div key={c.label} className="grid grid-cols-[110px_1fr_56px] items-center gap-3 text-sm">
                      <span className={c.best ? "font-semibold" : "text-muted"}>{c.label}</span>
                      <span className="h-2.5 overflow-hidden rounded-full bg-canvas">
                        <span className={`block h-full rounded-full ${c.best ? "bg-accent" : "bg-line-strong"}`} style={{ width: `${Math.max(4, (c.value / max) * 100)}%` }} />
                      </span>
                      <span className="tabular text-right font-semibold">{Math.round(c.value)} €</span>
                    </div>
                  ))}
                  {saving >= 1 ? (
                    <p className="pt-1 text-sm font-semibold text-ok">Ahorras {formatEuro(saving)} al mes frente a la opción más cara.</p>
                  ) : null}
                </div>
              ) : null}

              {best.oneOff ? <p className="mt-4 text-sm text-ink-2">Además, el alta del abono cuesta {formatEuro(best.oneOff)} una sola vez.</p> : null}
              {best.usesOutdatedPrices ? (
                <p className="mt-4 flex gap-2 rounded-2xl bg-warn-soft p-3 text-[13px] leading-relaxed text-warn">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  Calculado con tarifas oficiales de años anteriores. Confírmalas en la instalación antes de pagar.
                </p>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
      <p className="mt-6 text-xs text-muted">No incluye instalaciones en obras ni de temporada de verano. Mes de 4,33 semanas.</p>
    </main>
  );
}
