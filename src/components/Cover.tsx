import type { Kind } from "@/data/types";

/** Portada ilustrada para cada tipo de instalación (sustituye a las fotos hasta tener las reales). */
export function Cover({ kind, id, className = "" }: { kind: Kind; id: string; className?: string }) {
  const g = `cv-${id}`;
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {kind === "swim" || kind === "free" ? <Pool g={g} warm={kind === "free"} /> : null}
      {kind === "track" ? <Track g={g} /> : null}
      {kind === "gym" ? <Gym g={g} /> : null}
      {kind === "club" ? <Club g={g} /> : null}
    </svg>
  );
}

function Pool({ g, warm }: { g: string; warm: boolean }) {
  const lanes = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <defs>
        <linearGradient id={`${g}-w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={warm ? "#8fd3e8" : "#5cc4e4"} />
          <stop offset="1" stopColor={warm ? "#2a9fc4" : "#0a6f93"} />
        </linearGradient>
        <radialGradient id={`${g}-l`} cx="0.25" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${g}-w)`} />
      {lanes.map((i) => (
        <g key={i}>
          <line x1="-10" x2="410" y1={16 + i * 34} y2={16 + i * 34} stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" />
          <rect x="40" y={31 + i * 34} width="320" height="3" rx="1.5" fill="#063a50" fillOpacity="0.22" />
          <rect x="40" y={26 + i * 34} width="3" height="13" rx="1.5" fill="#063a50" fillOpacity="0.22" />
          <rect x="357" y={26 + i * 34} width="3" height="13" rx="1.5" fill="#063a50" fillOpacity="0.22" />
        </g>
      ))}
      <rect width="400" height="200" fill={`url(#${g}-l)`} />
      {warm ? <circle cx="350" cy="44" r="22" fill="#ffd66b" fillOpacity="0.9" /> : null}
    </>
  );
}

function Track({ g }: { g: string }) {
  const lanes = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <defs>
        <linearGradient id={`${g}-t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ef7d5d" />
          <stop offset="1" stopColor="#c2482b" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${g}-t)`} />
      <rect x="120" y="70" width="400" height="200" rx="100" fill="#4f9d62" />
      <rect x="120" y="70" width="400" height="200" rx="100" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" />
      {lanes.map((i) => (
        <rect key={i} x={120 - 14 * (i + 1)} y={70 - 14 * (i + 1)} width={400 + 28 * (i + 1)} height={200 + 28 * (i + 1)} rx={100 + 14 * (i + 1)} fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.5" />
      ))}
      <line x1="40" x2="40" y1="0" y2="200" stroke="#fff" strokeWidth="3" strokeOpacity="0.9" />
    </>
  );
}

function Gym({ g }: { g: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${g}-y`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b87ea" />
          <stop offset="1" stopColor="#4540b8" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${g}-y)`} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <line key={i} x1={i * 48 - 40} x2={i * 48 + 60} y1="200" y2="0" stroke="#fff" strokeOpacity="0.07" strokeWidth="18" />
      ))}
      <g transform="translate(200 104)" fill="#fff" fillOpacity="0.92">
        <rect x="-90" y="-4" width="180" height="8" rx="4" />
        <rect x="-78" y="-34" width="18" height="68" rx="6" />
        <rect x="-102" y="-24" width="18" height="48" rx="6" />
        <rect x="60" y="-34" width="18" height="68" rx="6" />
        <rect x="84" y="-24" width="18" height="48" rx="6" />
      </g>
    </>
  );
}

function Club({ g }: { g: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${g}-c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5cc296" />
          <stop offset="1" stopColor="#1f7d53" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${g}-c)`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M-10 ${150 - i * 26} C 80 ${120 - i * 26}, 160 ${180 - i * 26}, 250 ${140 - i * 26} S 380 ${110 - i * 26}, 420 ${130 - i * 26}`} fill="none" stroke="#fff" strokeOpacity={0.18 + i * 0.1} strokeWidth="3" />
      ))}
      <g fill="#fff">
        <circle cx="170" cy="70" r="12" />
        <circle cx="205" cy="62" r="14" />
        <circle cx="240" cy="70" r="12" />
      </g>
    </>
  );
}
