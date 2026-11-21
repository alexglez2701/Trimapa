"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { FACILITIES } from "@/data/facilities";
import { FacilityCard } from "@/components/FacilityCard";
import { LogoMark } from "@/components/Logo";
import { useSaved } from "@/lib/useSaved";

export default function SavedPage() {
  const { saved } = useSaved();
  const items = FACILITIES.filter((f) => saved.includes(f.slug));
  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-[max(16px,env(safe-area-inset-top))] lg:pt-24">
      <span className="lg:hidden"><LogoMark size={32} /></span>
      <h1 className="mt-6 text-[30px] font-extrabold lg:text-[38px]">Guardados</h1>
      <p className="mt-1.5 text-ink-2">Tus sitios para entrenar, a mano. Se guardan en este dispositivo.</p>
      {items.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <FacilityCard key={f.slug} facility={f} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-[24px] bg-surface px-6 py-12 text-center ring-1 ring-line">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
            <Heart size={24} />
          </span>
          <p className="mt-4 font-bold">Aún no has guardado nada</p>
          <p className="mt-1 max-w-xs text-sm text-muted">Toca el corazón en cualquier piscina, pista o club para tenerlo aquí.</p>
          <Link href="/vigo" className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
            Explorar
          </Link>
        </div>
      )}
    </main>
  );
}
