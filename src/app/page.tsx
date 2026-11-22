import Link from "next/link";
import { ArrowRight, Calculator, MapPinned, ReceiptEuro } from "lucide-react";
import { APP } from "@/config";
import { CITIES, getFacilities } from "@/data/facilities";
import { Cover } from "@/components/Cover";
import { LogoMark } from "@/components/Logo";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-[max(20px,env(safe-area-inset-top))] lg:pt-28">
      <div className="flex items-center gap-2.5 lg:hidden">
        <LogoMark size={32} />
        <span className="text-lg font-extrabold tracking-tight">{APP.name}</span>
      </div>

      <section className="mt-8 max-w-2xl lg:mt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Triatlón en Galicia</p>
        <h1 className="mt-3 text-[38px] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Dónde entrenar, y cuánto te va a costar.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          Piscinas, pistas de atletismo, gimnasios, clubes, run clubs y salidas en bici en un solo mapa, con precios de entrada, bono y abono, y una calculadora que te dice qué combinación sale más barata.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Ciudades">
        {CITIES.map((c, i) => {
          const n = getFacilities(c.id).length;
          return (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className="group overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-card)] ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
            >
              <div className="h-40 overflow-hidden">
                <Cover kind={i === 0 ? "swim" : "track"} id={`home-${c.id}`} className="h-full w-full transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex items-end justify-between gap-4 p-5">
                <div>
                  <h2 className="text-2xl font-extrabold">{c.name}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{c.intro}</p>
                  <p className="mt-3 text-sm font-semibold text-muted">{n} lugares para entrenar</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition group-hover:bg-accent">
                  <ArrowRight size={20} />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3" aria-label="Qué puedes hacer">
        {[
          { icon: MapPinned, title: "Todo en un mapa", text: "Piscinas, pistas, gimnasios, clubes y quedadas para correr o rodar en grupo si estás de paso." },
          { icon: ReceiptEuro, title: "Precios con fuente", text: "Cada precio enlaza a su origen e indica el año de la tarifa, para que sepas cuánto fiarte." },
          { icon: Calculator, title: "Paga lo justo", text: "Dinos cuántas sesiones haces a la semana y te decimos si te compensa abono, bono o entrada." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
              <Icon size={21} />
            </span>
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{text}</p>
          </div>
        ))}
      </section>

      <p className="mt-14 text-sm text-muted">Pronto: Santiago, Ourense, Lugo, Pontevedra y Ferrol.</p>
    </main>
  );
}
