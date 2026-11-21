import { APP } from "@/config";
import type { Discipline, Facility, Price } from "@/data/types";

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  swim: "natación",
  track: "pista",
  gym: "gimnasio",
};

export function formatEuro(value: number): string {
  return value.toLocaleString("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
}

/** Precio por uso de una entrada o un bono. */
export function perUse(p: Price): number | null {
  if (p.amount == null) return null;
  if (p.type === "bono" && p.uses) return p.amount / p.uses;
  return p.amount;
}

export interface Headline {
  value: string;
  caption: string;
  price?: Price;
}

/** Precio destacado de una instalación para las tarjetas. */
export function headlinePrice(f: Facility): Headline {
  let best: Price | undefined;
  for (const p of f.prices) {
    if (p.type !== "entrada" && p.type !== "bono") continue;
    const u = perUse(p);
    if (u == null) continue;
    if (!best || u < (perUse(best) ?? Infinity)) best = p;
  }
  if (best) {
    const u = perUse(best)!;
    if (u === 0) return { value: "Gratis", caption: "", price: best };
    return { value: formatEuro(u), caption: best.type === "bono" ? "por uso con bono" : "entrada", price: best };
  }
  const abono = f.prices.find((p) => p.type === "abono" && p.amount != null);
  if (abono) return { value: formatEuro(abono.amount!), caption: "al mes", price: abono };
  return { value: "Por confirmar", caption: "", price: undefined };
}

export type Need = Record<Discipline, number>;

export interface PlanLine {
  title: string;
  detail: string;
  monthly: number;
  facilitySlug: string;
  price: Price;
}

export interface Plan {
  monthly: number;
  abonos: number;
  lines: PlanLine[];
  oneOff: number;
  usesOutdatedPrices: boolean;
}

export interface CalcResult {
  best: Plan | null;
  withoutAbonos: Plan | null;
  bestWithAbono: Plan | null;
  missing: Discipline[];
}

const DISCIPLINES: Discipline[] = ["swim", "track", "gym"];

/**
 * Busca la combinación más barata de abonos, bonos y entradas para cubrir
 * las sesiones semanales de cada disciplina.
 */
export function cheapestPlan(facilities: Facility[], need: Need, weeks = APP.weeksPerMonth): CalcResult {
  const usable = facilities.filter((f) => f.status !== "works" && f.status !== "seasonal");

  // Abonos únicos (un mismo abono puede aparecer en varias instalaciones).
  const abonoMap = new Map<string, { price: Price; facility: Facility }>();
  for (const f of usable) {
    for (const p of f.prices) {
      if (p.type !== "abono" || p.amount == null) continue;
      const key = p.abonoId ?? `${f.slug}:${p.label}`;
      if (!abonoMap.has(key)) abonoMap.set(key, { price: p, facility: f });
    }
  }
  const abonos = [...abonoMap.values()];

  const needed = DISCIPLINES.filter((d) => need[d] > 0);
  const missing = needed.filter(
    (d) =>
      !usable.some((f) =>
        f.prices.some((p) => p.covers?.includes(d) && p.amount != null && p.type !== "alta" && p.type !== "cuota"),
      ),
  );
  if (needed.length === 0 || missing.length) return { best: null, withoutAbonos: null, bestWithAbono: null, missing };

  const plans: Plan[] = [];
  for (let mask = 0; mask < 1 << abonos.length; mask++) {
    const chosen = abonos.filter((_, i) => mask & (1 << i));
    // Descarta abonos que no aportan nada.
    const useless = chosen.some((a) => {
      const useful = (a.price.covers ?? []).filter((d) => need[d] > 0);
      if (!useful.length) return true;
      return useful.every((d) => chosen.some((o) => o !== a && o.price.covers?.includes(d)));
    });
    if (useless) continue;

    const covered = new Set<Discipline>(chosen.flatMap((a) => a.price.covers ?? []));
    const lines: PlanLine[] = chosen.map((a) => ({
      title: a.price.label,
      detail: `${a.facility.name} · incluye ${(a.price.covers ?? []).map((d) => DISCIPLINE_LABEL[d]).join(" y ")}`,
      monthly: a.price.amount!,
      facilitySlug: a.facility.slug,
      price: a.price,
    }));
    let ok = true;
    for (const d of needed) {
      if (covered.has(d)) continue;
      let best: { p: Price; f: Facility; u: number } | null = null;
      for (const f of usable) {
        for (const p of f.prices) {
          if ((p.type !== "entrada" && p.type !== "bono") || !p.covers?.includes(d)) continue;
          const u = perUse(p);
          if (u == null) continue;
          if (!best || u < best.u) best = { p, f, u };
        }
      }
      if (!best) {
        ok = false;
        break;
      }
      lines.push({
        title: `${best.p.type === "bono" ? "Bono" : "Entradas"} de ${DISCIPLINE_LABEL[d]}`,
        detail: `${best.f.name} · ${need[d]} por semana a ${formatEuro(best.u)} por uso`,
        monthly: need[d] * weeks * best.u,
        facilitySlug: best.f.slug,
        price: best.p,
      });
    }
    if (!ok) continue;
    const oneOff = chosen.reduce((sum, a) => {
      const alta = a.facility.prices.find((p) => p.type === "alta" && p.amount != null);
      return sum + (alta?.amount ?? 0);
    }, 0);
    plans.push({
      monthly: lines.reduce((s, l) => s + l.monthly, 0),
      abonos: chosen.length,
      lines,
      oneOff,
      usesOutdatedPrices: lines.some((l) => l.price.status !== "verified"),
    });
  }
  plans.sort((a, b) => a.monthly - b.monthly || a.abonos - b.abonos);
  return {
    best: plans[0] ?? null,
    withoutAbonos: plans.find((p) => p.abonos === 0) ?? null,
    bestWithAbono: plans.find((p) => p.abonos > 0) ?? null,
    missing: [],
  };
}
