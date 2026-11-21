import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES, getCity, getFacilities } from "@/data/facilities";
import { ExploreView } from "@/components/ExploreView";

export function generateStaticParams() {
  return CITIES.map((c) => ({ ciudad: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ ciudad: string }> }): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCity(ciudad);
  if (!city) return {};
  return {
    title: `Dónde entrenar triatlón en ${city.name}: piscinas, pistas y precios`,
    description: `Piscinas, pistas de atletismo, gimnasios y clubes de triatlón en ${city.name}, con precios de entrada, bono y abono.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params;
  const city = getCity(ciudad);
  if (!city) notFound();
  return <ExploreView city={city} facilities={getFacilities(city.id)} />;
}
