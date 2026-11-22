"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, Marker } from "maplibre-gl";
import { APP } from "@/config";
import { LAND } from "@/data/geo";
import type { City, Facility, Kind } from "@/data/types";
import { KIND_META } from "./kinds";

// Iconos pequeños para los pines (SVG en línea para no depender de React dentro del mapa).
const GLYPH: Record<Kind, string> = {
  swim: '<path d="M2 9c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1M2 13c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />',
  track: '<path d="M4 13c0-3 1-5 3-5s2 3 1 5M11 11c0-3 1-5 3-5" /><circle cx="6" cy="14.5" r="0.6"/><circle cx="13" cy="12.5" r="0.6"/>',
  gym: '<path d="M3 10h12M5 6.5v7M13 6.5v7M2.5 8v4M15.5 8v4" />',
  club: '<circle cx="6" cy="7" r="2"/><circle cx="12" cy="7" r="2"/><path d="M2.5 14c.5-2.5 2-3.5 3.5-3.5s3 1 3.5 3.5M8.5 14c.5-2.5 2-3.5 3.5-3.5s3 1 3.5 3.5" />',
  runclub: '<path d="M3 14c2-1 3-4 6-4s3 3 6 2M5 6.5a1.6 1.6 0 1 0 0-.1M12 4.5a1.6 1.6 0 1 0 0-.1" />',
  cycling: '<circle cx="4.5" cy="12" r="3"/><circle cx="13.5" cy="12" r="3"/><path d="M4.5 12l3-5h4l2 5M7.5 7l2 5" />',
  free: '<path d="M3 8h12v7H3zM2 5.5h14V8H2zM9 5.5V15M9 5.5C7 2 4.5 3.5 6 5.5M9 5.5c2-3.5 4.5-2 3-0" />',
};

function pinHtml(kind: Kind) {
  const m = KIND_META[kind];
  return `<span style="background:${m.color}"><svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${GLYPH[kind]}</svg></span>`;
}

export function MapView({
  city,
  facilities,
  selected,
  onSelect,
  className = "",
  interactive = true,
}: {
  city: City;
  facilities: Facility[];
  selected?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
  interactive?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const markers = useRef<Map<string, { marker: Marker; el: HTMLElement }>>(new Map());
  const [fallback, setFallback] = useState(false);
  const fitted = useRef(false);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const located = useMemo(() => facilities.filter((f) => f.location), [facilities]);

  // Crear el mapa
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const pins = markers.current;
    (async () => {
      const ml = await import("maplibre-gl");
      if (cancelled || !box.current) return;
      try {
        const m = new ml.Map({
          container: box.current,
          style: APP.mapStyle,
          center: city.center,
          zoom: city.zoom,
          attributionControl: { compact: true },
          interactive,
          cooperativeGestures: false,
        });
        map.current = m;
        if (interactive) m.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
        timer = setTimeout(() => {
          if (!m.isStyleLoaded()) setFallback(true);
        }, 6000);
        m.on("error", () => {
          if (!m.isStyleLoaded()) setFallback(true);
        });
        m.on("load", () => clearTimeout(timer));
      } catch {
        setFallback(true);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      pins.forEach(({ marker }) => marker.remove());
      pins.clear();
      map.current?.remove();
      map.current = null;
    };
  }, [city, interactive]);

  // Pines
  useEffect(() => {
    let alive = true;
    (async () => {
      const ml = await import("maplibre-gl");
      const m = map.current;
      if (!alive || !m) return;
      const keep = new Set(located.map((f) => f.slug));
      markers.current.forEach((v, k) => {
        if (!keep.has(k)) {
          v.marker.remove();
          markers.current.delete(k);
        }
      });
      for (const f of located) {
        if (markers.current.has(f.slug)) continue;
        const el = document.createElement("button");
        el.type = "button";
        el.className = "tm-pin";
        el.setAttribute("aria-label", f.name);
        el.innerHTML = pinHtml(f.kinds[0]);
        if (f.status === "works") el.dataset.muted = "true";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current?.(f.slug);
        });
        const marker = new ml.Marker({ element: el }).setLngLat([f.location!.lng, f.location!.lat]).addTo(m);
        markers.current.set(f.slug, { marker, el });
      }
      // Encuadre: que se vean todas las instalaciones visibles.
      if (interactive && located.length) {
        const b = new ml.LngLatBounds();
        located.forEach((f) => b.extend([f.location!.lng, f.location!.lat]));
        m.fitBounds(b, { padding: { top: 56, bottom: 56, left: 48, right: 56 }, maxZoom: 14.5, duration: fitted.current ? 600 : 0 });
        fitted.current = true;
      }
    })();
    return () => {
      alive = false;
    };
  }, [located, interactive]);

  // Selección
  useEffect(() => {
    markers.current.forEach(({ el }, slug) => (el.dataset.selected = String(slug === selected)));
    const f = located.find((x) => x.slug === selected);
    if (f && map.current && interactive) map.current.easeTo({ center: [f.location!.lng, f.location!.lat], duration: 500 });
  }, [selected, located, interactive]);

  return (
    <div className={`relative overflow-hidden bg-[#e8eef1] ${className}`}>
      {/* h-full en vez de absolute: la hoja de estilos de MapLibre fuerza position: relative en el contenedor */}
      <div ref={box} className="h-full w-full" />
      {fallback ? <FallbackMap city={city} facilities={located} selected={selected} onSelect={onSelect} /> : null}
    </div>
  );
}

/** Mapa de respaldo dibujado con los contornos municipales si no carga el mapa base. */
function FallbackMap({
  city,
  facilities,
  selected,
  onSelect,
}: {
  city: City;
  facilities: Facility[];
  selected?: string | null;
  onSelect?: (slug: string) => void;
}) {
  const W = 800,
    H = 600;
  // Encuadre que incluye todas las instalaciones, con margen.
  const lngs = facilities.map((f) => f.location!.lng);
  const lats = facilities.map((f) => f.location!.lat);
  const cx = lngs.length ? (Math.min(...lngs) + Math.max(...lngs)) / 2 : city.center[0];
  const cy = lats.length ? (Math.min(...lats) + Math.max(...lats)) / 2 : city.center[1];
  const k = Math.cos((cy * Math.PI) / 180);
  const spanLng = lngs.length ? (Math.max(...lngs) - Math.min(...lngs)) * k : 0;
  const spanLat = lats.length ? Math.max(...lats) - Math.min(...lats) : 0;
  const span = Math.max(spanLng * 1.6, spanLat * 1.6 * (W / H), 0.03);
  const sx = W / span;
  const x = (lng: number) => (lng - cx) * sx * k + W / 2;
  const y = (lat: number) => (cy - lat) * sx + H / 2;
  const land = LAND[city.id] ?? [];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full bg-[#d7e8ef]">
      {land.map((m, i) => (
        <path
          key={i}
          d={m.rings.map((r) => "M" + r.map(([a, b]) => `${x(a).toFixed(1)},${y(b).toFixed(1)}`).join("L") + "Z").join(" ")}
          fill={m.name === city.name || (city.id === "a-coruna" && m.name === "A Coruña") ? "#fbfcfc" : "#f0f3f4"}
          stroke="#d3dde2"
          strokeWidth="1.5"
        />
      ))}
      {facilities.map((f) => {
        const meta = KIND_META[f.kinds[0]];
        const sel = f.slug === selected;
        return (
          <g key={f.slug} transform={`translate(${x(f.location!.lng)} ${y(f.location!.lat)})`} onClick={() => onSelect?.(f.slug)} style={{ cursor: "pointer" }} opacity={f.status === "works" ? 0.55 : 1}>
            {sel ? <circle r="24" fill={meta.color} fillOpacity="0.2" /> : null}
            <circle r={sel ? 16 : 13} fill="#fff" />
            <circle r={sel ? 12 : 10} fill={meta.color} />
          </g>
        );
      })}
    </svg>
  );
}
