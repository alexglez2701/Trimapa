"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import type { City, Facility, Kind } from "@/data/types";
import { headlinePrice } from "@/lib/pricing";
import { CitySwitch } from "./CitySwitch";
import { FacilityCard } from "./FacilityCard";
import { KIND_META } from "./kinds";
import { LogoMark } from "./Logo";
import { MapView } from "./MapView";
import { PriceStatus } from "./Badges";

const FILTERS: (Kind | "all")[] = ["all", "swim", "track", "gym", "club", "runclub", "cycling", "free"];

export function ExploreView({ city, facilities }: { city: City; facilities: Facility[] }) {
  const [filter, setFilter] = useState<Kind | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return facilities.filter(
      (f) =>
        (filter === "all" || f.kinds.includes(filter)) &&
        (!q || f.name.toLowerCase().includes(q) || f.zone.toLowerCase().includes(q)),
    );
  }, [facilities, filter, query]);

  const preview = facilities.find((f) => f.slug === selected);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: facilities.length };
    for (const f of facilities) for (const k of f.kinds) c[k] = (c[k] ?? 0) + 1;
    return c;
  }, [facilities]);

  return (
    <div className="lg:grid lg:h-dvh lg:grid-cols-[minmax(440px,520px)_1fr] lg:pt-16">
      {/* Panel de lista */}
      <section className="lg:overflow-y-auto lg:border-r lg:border-line lg:bg-canvas">
        <div className="mx-auto max-w-2xl px-4 pt-[max(16px,env(safe-area-inset-top))] lg:px-6 lg:pt-6">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <LogoMark size={32} />
            <CitySwitch current={city.id} />
          </div>
          <div className="hidden lg:block">
            <CitySwitch current={city.id} />
          </div>

          <h1 className="mt-5 text-[28px] font-extrabold leading-tight lg:text-[32px]">Entrenar en {city.name}</h1>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{city.intro}</p>

          <label className="mt-5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-card)] ring-1 ring-line focus-within:ring-2 focus-within:ring-accent">
            <Search size={18} className="text-muted" />
            <span className="sr-only">Buscar</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca una piscina, pista o barrio"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda" className="text-muted">
                <X size={18} />
              </button>
            ) : null}
          </label>

          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Filtrar por tipo">
            {FILTERS.filter((k) => k === "all" || counts[k]).map((k) => {
              const on = filter === k;
              const meta = k === "all" ? null : KIND_META[k];
              const Icon = meta?.icon;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  aria-pressed={on}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                    on ? "bg-ink text-white ring-ink" : "bg-surface text-ink-2 ring-line hover:ring-line-strong"
                  }`}
                >
                  {Icon ? <Icon size={15} style={{ color: on ? "#fff" : meta!.color }} /> : null}
                  {k === "all" ? "Todo" : meta!.plural}
                  <span className={`tabular text-xs ${on ? "text-white/70" : "text-muted"}`}>{counts[k]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mapa en móvil */}
        <div className="relative mx-4 mt-4 lg:hidden">
          <MapView city={city} facilities={visible} selected={selected} onSelect={setSelected} className="h-[44vh] min-h-[300px] rounded-[24px] ring-1 ring-line" />
          {preview ? <Preview facility={preview} onClose={() => setSelected(null)} /> : null}
        </div>

        <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 lg:px-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">
              {visible.length} {visible.length === 1 ? "lugar" : "lugares"}
            </h2>
            <span className="text-sm text-muted">Precio más bajo por sesión</span>
          </div>
          {visible.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {visible.map((f) => (
                <FacilityCard key={f.slug} facility={f} selected={selected === f.slug || hovered === f.slug} onHover={setHovered} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-surface p-6 text-center text-muted ring-1 ring-line">No hay resultados. Prueba con otra búsqueda o filtro.</p>
          )}
          <p className="mt-6 text-center text-xs leading-relaxed text-muted">
            Precios recopilados de fuentes oficiales y prensa. Cada ficha indica la fuente y el año de la tarifa.
          </p>
        </div>
      </section>

      {/* Mapa en escritorio */}
      <div className="relative hidden lg:block">
        <MapView city={city} facilities={visible} selected={hovered ?? selected} onSelect={setSelected} className="h-full w-full" />
        {preview ? (
          <div className="absolute bottom-6 left-1/2 w-[380px] -translate-x-1/2">
            <Preview facility={preview} onClose={() => setSelected(null)} floating />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Preview({ facility, onClose, floating = false }: { facility: Facility; onClose: () => void; floating?: boolean }) {
  const h = headlinePrice(facility);
  const meta = KIND_META[facility.kinds[0]];
  const Icon = meta.icon;
  return (
    <div className={`${floating ? "" : "absolute inset-x-3 bottom-3"} flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-[var(--shadow-float)] ring-1 ring-line`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: meta.soft, color: meta.color }}>
        <Icon size={22} />
      </span>
      <Link href={`/${facility.city}/${facility.slug}`} className="min-w-0 flex-1">
        <p className="truncate font-bold">{facility.name}</p>
        {facility.group ? (
          <p className="truncate text-sm text-muted">{facility.group.schedule.map((x) => x.when).join(" · ")}</p>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span className="tabular font-semibold text-ink">{h.value}</span>
            {h.caption}
          </p>
        )}
      </Link>
      <div className="flex flex-col items-end gap-1">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-muted">
          <X size={16} />
        </button>
        <Link href={`/${facility.city}/${facility.slug}`} aria-label={`Ver ${facility.name}`} className="text-accent">
          <ChevronRight size={20} />
        </Link>
      </div>
      <span className="sr-only">
        <PriceStatus price={h.price} />
      </span>
    </div>
  );
}
