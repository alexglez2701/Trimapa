import { APP } from "@/config";

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0a7ea4" />
      <path d="M7 11.5c2.2 0 2.2-1.5 4.5-1.5s2.3 1.5 4.5 1.5 2.3-1.5 4.5-1.5 2.3 1.5 4.5 1.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M7 17c2.2 0 2.2-1.5 4.5-1.5s2.3 1.5 4.5 1.5 2.3-1.5 4.5-1.5 2.3 1.5 4.5 1.5" stroke="#fff" strokeOpacity=".7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M7 22.5c2.2 0 2.2-1.5 4.5-1.5s2.3 1.5 4.5 1.5 2.3-1.5 4.5-1.5 2.3 1.5 4.5 1.5" stroke="#fff" strokeOpacity=".45" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[19px] font-extrabold tracking-tight text-ink">{APP.name}</span>
    </span>
  );
}
