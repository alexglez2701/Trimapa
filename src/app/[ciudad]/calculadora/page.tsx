import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES, getCity, getFacilities } from "@/data/facilities";
import { CalculatorView } from "@/components/CalculatorView";

export function generateStaticParams() {
  return CITIES.map((c) => ({ ciudad: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ ciudad: string }> }): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCity(ciudad);
  return city ? { title: `Calculadora: entrenar triatlón en ${city.name} al menor coste` } : {};
}

export default async function CalculatorPage({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params;
  const city = getCity(ciudad);
  if (!city) notFound();
  return <CalculatorView city={city} facilities={getFacilities(city.id)} />;
}
