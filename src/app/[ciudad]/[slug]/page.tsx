import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, MapPin, Navigation, PencilLine } from "lucide-react";
import { APP } from "@/config";
import { FACILITIES, getCity, getFacilities, getFacility } from "@/data/facilities";
import type { Price } from "@/data/types";
import { DISCIPLINE_LABEL, formatEuro, perUse } from "@/lib/pricing";
import { FacilityImage } from "@/components/FacilityImage";
import { KindTag } from "@/components/kinds";
import { FacilityStatus, PriceStatus } from "@/components/Badges";
import { SaveButton } from "@/components/SaveButton";
import { PriceSummary } from "@/components/PriceSummary";
import { MapView } from "@/components/MapView";

type Params = { params: Promise<{ ciudad: string; slug: string }> };

export function generateStaticParams() {
  return FACILITIES.map((f) => ({ ciudad: f.city, slug: f.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { ciudad, slug } = await params;
  const f = getFacility(ciudad, slug);
  if (!f) return {};
  return {
    title: `${f.name}: precios y horarios para entrenar`,
    description: `${f.name} (${f.zone}). ${f.highlights.join(". ")}.`,
  };
}

function priceDetail(p: Price): string {
  const parts: string[] = [];
  if (p.type === "bono" && p.amount != null && p.uses) parts.push(`${formatEuro(p.amount / p.uses)} por uso`);
  if (p.type === "abono" && p.covers) parts.push(`Incluye ${p.covers.map((d) => DISCIPLINE_LABEL[d]).join(" y ")}`);
  if (p.note) parts.push(p.note);
  return parts.join(" · ");
}

function priceValue(p: Price): string {
  if (p.amount == null) return "—";
  if (p.amount === 0) return "Gratis";
  return formatEuro(p.amount) + (p.type === "abono" ? "/mes" : "");
}

export default async function FacilityPage({ params }: Params) {
  const { ciudad, slug } = await params;
  const f = getFacility(ciudad, slug);
  const city = getCity(ciudad);
  if (!f || !city) notFound();

  const entrada = f.prices.filter((p) => (p.type === "entrada" || p.type === "bono") && p.amount).sort((a, b) => (perUse(a) ?? 0) - (perUse(b) ?? 0))[0];
  const abono = f.prices.find((p) => p.type === "abono" && p.amount);
  const breakEven = entrada && abono ? Math.ceil(abono.amount! / perUse(entrada)!) : null;
  const directions = f.location ? `https://www.google.com/maps/dir/?api=1&destination=${f.location.lat},${f.location.lng}` : null;
  const reviewed = new Date(f.reviewedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const mailto = `mailto:${APP.contactEmail}?subject=${encodeURIComponent(`Corrección: ${f.name}`)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: f.name,
    address: { "@type": "PostalAddress", addressLocality: city.name, streetAddress: f.address ?? f.zone, addressCountry: "ES" },
    ...(f.location ? { geo: { "@type": "GeoCoordinates", latitude: f.location.lat, longitude: f.location.lng } } : {}),
  };

  return (
    <main className="lg:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative h-[260px] overflow-hidden lg:mx-auto lg:mt-6 lg:h-[320px] lg:max-w-5xl lg:rounded-[28px]">
        <FacilityImage facility={f} id={`hero-${f.slug}`} className="h-full w-full" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-[max(16px,env(safe-area-inset-top))]">
          <Link href={`/${city.id}`} aria-label={`Volver a ${city.name}`} className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur">
            <ArrowLeft size={19} />
          </Link>
          <SaveButton slug={f.slug} compact />
        </div>
      </div>

      <div className="relative -mt-7 rounded-t-[28px] bg-canvas lg:mx-auto lg:mt-0 lg:max-w-5xl lg:rounded-none lg:bg-transparent">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 pt-6 lg:grid-cols-[1fr_360px] lg:px-0 lg:pt-8">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              {f.kinds.map((k) => (
                <KindTag key={k} kind={k} />
              ))}
              <FacilityStatus facility={f} />
            </div>
            <h1 className="mt-3 text-[30px] font-extrabold leading-tight lg:text-[38px]">{f.name}</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-ink-2">
              <MapPin size={16} className="text-muted" />
              {f.address ? `${f.address} · ` : ""}
              {f.zone}, {city.name}
            </p>

            <ul className="mt-6 space-y-3">
              {f.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[15.5px] leading-relaxed">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>

            <section className="mt-8" aria-labelledby="precios">
              <h2 id="precios" className="text-xl font-bold">
                Precios
              </h2>
              <div className="mt-3">
                <PriceSummary facility={f} size="lg" />
              </div>
              {f.prices.length ? (
                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">Todas las tarifas</h3>
              ) : null}
              {f.prices.length ? (
                <ul className="mt-3 divide-y divide-line overflow-hidden rounded-[var(--radius-card)] bg-surface ring-1 ring-line">
                  {f.prices.map((p) => (
                    <li key={p.label} className="flex items-start justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <p className="font-semibold">{p.label}</p>
                        {priceDetail(p) ? <p className="mt-0.5 text-sm text-muted">{priceDetail(p)}</p> : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="tabular text-lg font-extrabold">{priceValue(p)}</span>
                        {p.sourceUrl ? (
                          <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver la fuente de este precio">
                            <PriceStatus price={p} />
                          </a>
                        ) : (
                          <PriceStatus price={p} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
              {breakEven ? (
                <p className="mt-3 rounded-2xl bg-accent-soft p-4 text-[15px] text-accent-strong">
                  El abono compensa a partir de <strong>{breakEven} sesiones al mes</strong>, unas {Math.ceil(breakEven / APP.weeksPerMonth)} por semana.{" "}
                  <Link href={`/${city.id}/calculadora`} className="font-semibold underline underline-offset-2">
                    Calcula tu caso
                  </Link>
                </p>
              ) : null}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {f.location ? (
              <div className="overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)] ring-1 ring-line">
                <MapView city={{ ...city, center: [f.location.lng, f.location.lat], zoom: 14.5 }} facilities={[f]} selected={f.slug} interactive={false} className="h-48" />
                {directions ? (
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3.5 font-semibold text-accent">
                    <Navigation size={17} /> Cómo llegar
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="rounded-[var(--radius-card)] bg-surface p-4 ring-1 ring-line">
              <h2 className="font-bold">Fuentes</h2>
              <ul className="mt-2 space-y-1.5">
                {f.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
                      {s.label} <ExternalLink size={13} />
                    </a>
                  </li>
                ))}
              </ul>
              {f.photo?.credit ? (
                <p className="mt-3 text-xs text-muted">
                  Foto: {f.photo.sourceUrl ? <a href={f.photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{f.photo.credit}</a> : f.photo.credit}
                  {f.photo.license ? ` (${f.photo.license})` : ""}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-muted">Ficha revisada el {reviewed}.</p>
              <a href={mailto} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-canvas px-4 py-2.5 text-sm font-semibold ring-1 ring-line hover:ring-line-strong">
                <PencilLine size={16} /> Corregir un dato
              </a>
            </div>

            <div className="text-sm text-muted">
              Más en{" "}
              <Link href={`/${city.id}`} className="font-semibold text-accent">
                {city.name}
              </Link>{" "}
              · {getFacilities(city.id).length} lugares
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
