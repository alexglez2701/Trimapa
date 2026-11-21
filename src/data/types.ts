export type Discipline = "swim" | "track" | "gym";
export type Kind = Discipline | "club" | "free";

/**
 * Estado de verificación de un precio:
 * - "verified": comprobado recientemente (fuente o llamada)
 * - "official": sacado de una tarifa oficial de un año concreto; puede haber cambiado
 * - "unknown": todavía no tenemos el precio
 */
export type PriceStatus = "verified" | "official" | "unknown";

export type PriceType = "entrada" | "bono" | "abono" | "alta" | "cuota";

export interface Price {
  type: PriceType;
  label: string;
  /** Disciplinas que cubre este precio (no aplica a alta ni cuota). */
  covers?: Discipline[];
  /** Euros. En abonos, euros al mes. null = desconocido. */
  amount: number | null;
  /** Número de usos de un bono. */
  uses?: number;
  /** Identificador compartido cuando un mismo abono vale en varias instalaciones. */
  abonoId?: string;
  status: PriceStatus;
  /** Año de la tarifa, por ejemplo "2022" o "2019-20". */
  year?: string;
  sourceUrl?: string;
  note?: string;
}

export interface Source {
  label: string;
  url: string;
}

export interface Photo {
  /** Ruta dentro de /public (por ejemplo "/fotos/piscina-san-amaro.jpg") o URL completa. */
  src: string;
  alt: string;
  /** Autor o propietario de la foto. Obligatorio si no es propia. */
  credit?: string;
  /** Licencia o permiso (por ejemplo "Foto propia", "Cedida por el Concello", "CC BY-SA 4.0"). */
  license?: string;
  sourceUrl?: string;
}

export interface Facility {
  slug: string;
  city: CityId;
  name: string;
  zone: string;
  address?: string;
  kinds: Kind[];
  /** null si no tiene una ubicación fija (por ejemplo, un club). */
  location: { lat: number; lng: number } | null;
  highlights: string[];
  /** Foto real de la instalación. Si no hay, se muestra una ilustración. */
  photo?: Photo;
  status?: "open" | "works" | "intermittent" | "seasonal";
  statusNote?: string;
  prices: Price[];
  sources: Source[];
  /** Fecha de la última revisión de la ficha (AAAA-MM-DD). */
  reviewedAt: string;
}

export type CityId = "vigo" | "a-coruna";

export interface City {
  id: CityId;
  name: string;
  center: [number, number];
  zoom: number;
  intro: string;
  tips: { text: string; sources: Source[] }[];
}
