import { describe, expect, it } from "vitest";
import { getFacilities } from "@/data/facilities";
import { cheapestPlan, headlinePrice, perUse, priceSummary } from "./pricing";

describe("perUse", () => {
  it("divide el bono entre sus usos", () => {
    expect(perUse({ type: "bono", label: "", amount: 22.32, uses: 20, status: "official" })).toBeCloseTo(1.116);
  });
});

describe("cheapestPlan en A Coruña", () => {
  const coruna = getFacilities("a-coruna");

  it("con 3 natación, 1 pista y 2 gimnasio recomienda el abono de San Diego y el bono de pista", () => {
    const r = cheapestPlan(coruna, { swim: 3, track: 1, gym: 2 });
    expect(r.best?.monthly).toBeCloseTo(32.39 + 4.33 * (15.45 / 20), 2);
    expect(r.best?.abonos).toBe(1);
    expect(r.best?.oneOff).toBeCloseTo(29.48);
    expect(r.withoutAbonos!.monthly).toBeGreaterThan(r.best!.monthly);
  });

  it("con 1 sesión de natación prefiere el bono de San Amaro", () => {
    const r = cheapestPlan(coruna, { swim: 1, track: 0, gym: 0 });
    expect(r.best?.abonos).toBe(0);
    expect(r.best?.monthly).toBeCloseTo(4.33 * 1.116, 2);
  });
});

describe("cheapestPlan en Vigo", () => {
  const vigo = getFacilities("vigo");

  it("combina el abono municipal de piscinas con el abono mUVer", () => {
    const r = cheapestPlan(vigo, { swim: 3, track: 1, gym: 2 });
    expect(r.best?.monthly).toBeCloseTo(11.25 + 15, 2);
    expect(r.best?.abonos).toBe(2);
  });

  it("no cuenta dos veces el mismo abono compartido por varias piscinas", () => {
    const r = cheapestPlan(vigo, { swim: 2, track: 0, gym: 0 });
    expect(r.best?.monthly).toBeCloseTo(11.25, 2);
  });

  it("ignora instalaciones en obras", () => {
    const r = cheapestPlan(vigo, { swim: 5, track: 0, gym: 0 });
    expect(r.best?.lines.every((l) => !l.facilitySlug.includes("teis"))).toBe(true);
  });
});

describe("headlinePrice", () => {
  it("muestra el precio por uso más bajo con bono", () => {
    const pista = getFacilities("a-coruna").find((f) => f.slug === "pista-cubierta-riazor")!;
    expect(headlinePrice(pista).caption).toBe("por uso con bono");
  });

  it("solo incluye instalaciones de entrenamiento (sin piscinas de ocio)", () => {
    expect(getFacilities("vigo").some((f) => f.slug.includes("samil"))).toBe(false);
  });
});

describe("priceSummary", () => {
  const get = (city: "vigo" | "a-coruna", slug: string) => getFacilities(city).find((f) => f.slug === slug)!;

  it("San Amaro: diario, mensual y bono con precio", () => {
    const s = priceSummary(get("a-coruna", "piscina-san-amaro"));
    expect(s.daily.value).toContain("3,42");
    expect(s.monthly.value).toContain("28,02");
    expect(s.bono.detail).toContain("20 usos");
  });

  it("Pista de Riazor: sin abono mensual en la tarifa", () => {
    const s = priceSummary(get("a-coruna", "pista-cubierta-riazor"));
    expect(s.monthly.state).toBe("none");
    expect(s.bono.state).toBe("price");
  });

  it("Piscinas de Vigo: entrada y bono existen pero sin precio", () => {
    const s = priceSummary(get("vigo", "piscina-lavadores"));
    expect(s.daily.state).toBe("unknown");
    expect(s.bono.state).toBe("unknown");
    expect(s.monthly.value).toContain("11,25");
  });
});

describe("priceSummary diario por disciplina principal", () => {
  it("San Diego muestra la entrada de piscina, no la de gimnasio", () => {
    const f = getFacilities("a-coruna").find((x) => x.slug === "complejo-san-diego")!;
    const s = priceSummary(f);
    expect(s.daily.value).toContain("4,97");
    expect(s.daily.detail).toContain("natación");
  });
});
