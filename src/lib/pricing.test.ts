import { describe, expect, it } from "vitest";
import { getFacilities } from "@/data/facilities";
import { cheapestPlan, headlinePrice, perUse } from "./pricing";

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
