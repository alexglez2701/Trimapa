"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Heart, Map } from "lucide-react";
import { APP } from "@/config";
import { Logo } from "./Logo";

function cityFromPath(path: string): string {
  const seg = path.split("/")[1];
  return seg === "vigo" || seg === "a-coruna" ? seg : "vigo";
}

export function TabBar() {
  const path = usePathname();
  const city = cityFromPath(path);
  const tabs = [
    { href: `/${city}`, label: "Explorar", icon: Map, active: path === "/" || (/^\/(vigo|a-coruna)(\/(?!calculadora).*)?$/.test(path)) },
    { href: `/${city}/calculadora`, label: "Calculadora", icon: Calculator, active: path.endsWith("/calculadora") },
    { href: "/guardados", label: "Guardados", icon: Heart, active: path.startsWith("/guardados") },
  ];

  return (
    <>
      {/* Móvil: barra inferior */}
      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3">
          {tabs.map(({ href, label, icon: Icon, active }) => (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11.5px] font-semibold ${active ? "text-accent" : "text-muted"}`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Escritorio: barra superior */}
      <header className="fixed inset-x-0 top-0 z-40 hidden h-16 items-center justify-between border-b border-line bg-white/90 px-6 backdrop-blur-xl lg:flex">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${APP.name}, inicio`}>
          <Logo />
        </Link>
        <nav aria-label="Secciones" className="flex items-center gap-1">
          {tabs.map(({ href, label, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-accent-soft text-accent-strong" : "text-ink-2 hover:bg-canvas"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
