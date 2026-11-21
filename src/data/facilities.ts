import type { City, CityId, Facility } from "./types";

const SRC = {
  coruOF15: "https://www.coruna.es/descarga/1453811413965/OF15--2022-1.pdf",
  coruPista: "https://www.paxinasgalegas.es/pistas-de-atletismo-estadio-riazor-2525ep_61di.html",
  coruNada: "https://www.paxinasgalegas.es/fiestas/nada-e-corre_pr53066.pdf",
  coruElvina:
    "https://www.udc.es/export/sites/udc/deportes/_galeria_down/PROTOCOLO-REAPERTURA-ESTADIO-ELVINA.pdf_2063069299.pdf",
  coruClub: "https://www.paxinasgalegas.es/fiestas/triatlon-cidade-da-coru%c3%b1a_pr46756.pdf",
  vigoAbono:
    "https://atlantico.net/articulo/vigo/piscinas-municipales-mas-baratas-empadronados/20130119091101210412.html",
  vigoVerano:
    "https://vigoe.es/vigo/local/este-verano-solo-estaran-abiertas-las-piscinas-municipales-de-lavadores-y-valadares-denuncia-el-bng",
  vigoTeis: "https://ted.europa.eu/es/notice/-/detail/361919-2025",
  vigoBalaidos:
    "https://www.elespanol.com/treintayseis/deporte/tu-deporte/20260504/decenas-afectados-protestan-cierre-pista-atletismo-balaidos-no-alternativas/1003744233101_0.amp.html",
  vigoIfevi:
    "https://www.xunta.gal/notas-de-prensa/-/nova/023985/modulo-atletismo-del-ifevi-que-xunta-invirtio-cerca-millon-euros-recibio-mas",
  uvigo:
    "https://secretaria.uvigo.gal/uv/web/normativa/public/normativa/documento/downloadbyhash/238f0658e11b1f91afa135dfa1525000dbe0aa04540168ad1964db5a37d52aed",
  marVigo: "https://fegatri.org/wp-content/uploads/2023/11/Regulamento-TRI-MENORES-CONCELLO-DE-VIGO-2024-1.pdf",
};

const REVIEWED = "2026-11-21";

const vigoMunicipalAbono = {
  type: "abono" as const,
  label: "Abono municipal de piscinas",
  covers: ["swim" as const],
  amount: 11.25,
  abonoId: "vigo-piscinas-municipales",
  status: "official" as const,
  year: "2013",
  sourceUrl: SRC.vigoAbono,
  note: "Empadronados. Vale en As Travesas, Lavadores, Teis y Valadares",
};

export const CITIES: City[] = [
  {
    id: "vigo",
    name: "Vigo",
    center: [-8.715, 42.215],
    zoom: 12,
    intro: "Cuatro piscinas municipales cubiertas y la pista y el gimnasio de la UVigo, abiertos también al público.",
    tips: [
      {
        text: "El abono municipal de piscinas vale en las cuatro piscinas cubiertas de la ciudad.",
        sources: [{ label: "Atlántico", url: SRC.vigoAbono }],
      },
      {
        text: "En el campus de la UVigo, las personas externas pueden usar la pista y las salas de fitness con la tarifa D.",
        sources: [{ label: "UVigo", url: SRC.uvigo }],
      },
    ],
  },
  {
    id: "a-coruna",
    name: "A Coruña",
    center: [-8.405, 43.36],
    zoom: 12.4,
    intro: "Bonos municipales muy baratos para la piscina de San Amaro y la pista cubierta de Riazor.",
    tips: [
      {
        text: "Con bono, nadar en San Amaro sale a 1,12 € por uso y correr en la pista cubierta de Riazor a 0,77 €.",
        sources: [{ label: "Ordenanza fiscal 15", url: SRC.coruOF15 }],
      },
      {
        text: "Los abonos mensuales tienen una cuota de alta única de 29,48 €.",
        sources: [{ label: "Ordenanza fiscal 15", url: SRC.coruOF15 }],
      },
    ],
  },
];

// Criterio: solo instalaciones donde se puede entrenar (piscinas con calles para nadar largos,
// pistas de atletismo, gimnasios y clubes). No se incluyen piscinas de ocio o de baño.
export const FACILITIES: Facility[] = [
  // ---------------- VIGO ----------------
  {
    slug: "piscina-as-travesas",
    city: "vigo",
    name: "Piscina Municipal As Travesas",
    zone: "As Travesas",
    kinds: ["swim"],
    location: { lat: 42.2235, lng: -8.7275 },
    highlights: ["Piscina cubierta municipal", "El abono municipal vale en las cuatro piscinas cubiertas de Vigo"],
    status: "open",
    prices: [vigoMunicipalAbono],
    sources: [{ label: "Atlántico (2013)", url: SRC.vigoAbono }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "piscina-lavadores",
    city: "vigo",
    name: "Piscina Municipal de Lavadores",
    zone: "Lavadores",
    kinds: ["swim"],
    location: { lat: 42.221, lng: -8.6935 },
    highlights: ["Piscina cubierta municipal", "Abierta también en verano", "Los usuarios han denunciado saturación y goteras"],
    status: "open",
    prices: [vigoMunicipalAbono],
    sources: [
      { label: "Atlántico (2013)", url: SRC.vigoAbono },
      { label: "Vigo-É", url: SRC.vigoVerano },
    ],
    reviewedAt: REVIEWED,
  },
  {
    slug: "piscina-valadares",
    city: "vigo",
    name: "Piscina Municipal de Valadares",
    zone: "Valadares",
    kinds: ["swim"],
    location: { lat: 42.1885, lng: -8.702 },
    highlights: ["Piscina cubierta municipal", "Abierta también en verano"],
    status: "open",
    prices: [vigoMunicipalAbono],
    sources: [
      { label: "Atlántico (2013)", url: SRC.vigoAbono },
      { label: "Vigo-É", url: SRC.vigoVerano },
    ],
    reviewedAt: REVIEWED,
  },
  {
    slug: "piscina-teis",
    city: "vigo",
    name: "Piscina Municipal de Teis",
    zone: "Teis",
    kinds: ["swim"],
    location: { lat: 42.2545, lng: -8.689 },
    highlights: ["Obras de mejora adjudicadas en 2025", "Sus 1.500 usuarios se han repartido entre otras piscinas"],
    status: "works",
    statusNote: "En obras",
    prices: [],
    sources: [
      { label: "Contrato de obras (TED)", url: SRC.vigoTeis },
      { label: "Vigo-É", url: SRC.vigoVerano },
    ],
    reviewedAt: REVIEWED,
  },
  {
    slug: "pistas-balaidos",
    city: "vigo",
    name: "Pistas de atletismo de Balaídos",
    zone: "Balaídos",
    kinds: ["track"],
    location: { lat: 42.2118, lng: -8.7398 },
    highlights: ["Única pista de atletismo al aire libre de Vigo", "Más de 600 niños entrenan cada semana", "Reforma pendiente"],
    status: "intermittent",
    statusNote: "Cierres frecuentes",
    prices: [{ type: "entrada", label: "Uso libre", covers: ["track"], amount: null, status: "unknown" }],
    sources: [{ label: "Treintayseis, mayo de 2026", url: SRC.vigoBalaidos }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "modulo-atletismo-ifevi",
    city: "vigo",
    name: "Módulo de atletismo del Ifevi",
    zone: "Cotogrande",
    kinds: ["track"],
    location: { lat: 42.206, lng: -8.664 },
    highlights: ["Pista cubierta de la Xunta en el pabellón 5 del Ifevi", "Funciona desde 2023"],
    status: "open",
    prices: [{ type: "entrada", label: "Uso libre", covers: ["track"], amount: null, status: "unknown" }],
    sources: [{ label: "Xunta, abril de 2026", url: SRC.vigoIfevi }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "instalaciones-uvigo",
    city: "vigo",
    name: "Instalaciones deportivas UVigo",
    zone: "Campus de Vigo",
    kinds: ["track", "gym"],
    location: { lat: 42.169, lng: -8.686 },
    highlights: ["Abiertas a personas externas con la tarifa D", "Pista de atletismo, salas de cardio-fitness y rocódromo"],
    status: "open",
    prices: [
      { type: "entrada", label: "Entrada a la pista (2 h)", covers: ["track"], amount: 2, status: "official", year: "2019-20", sourceUrl: SRC.uvigo },
      { type: "bono", label: "Bono pista, 10 usos", covers: ["track"], amount: 14, uses: 10, status: "official", year: "2019-20", sourceUrl: SRC.uvigo },
      { type: "entrada", label: "Entrada a fitness (2 h)", covers: ["gym"], amount: 4, status: "official", year: "2019-20", sourceUrl: SRC.uvigo },
      { type: "bono", label: "Bono fitness, 10 usos", covers: ["gym"], amount: 28, uses: 10, status: "official", year: "2019-20", sourceUrl: SRC.uvigo },
      { type: "abono", label: "Abono Básico (pista)", covers: ["track"], amount: 2.5, abonoId: "uvigo-basico", status: "official", year: "2019-20", sourceUrl: SRC.uvigo, note: "30 € al año" },
      { type: "abono", label: "Abono mUVer (salas y pistas)", covers: ["gym", "track"], amount: 15, abonoId: "uvigo-muver", status: "official", year: "2019-20", sourceUrl: SRC.uvigo, note: "180 € al año" },
    ],
    sources: [{ label: "Tarifas UVigo 2019-20", url: SRC.uvigo }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "club-triatlon-mar-de-vigo",
    city: "vigo",
    name: "Club Triatlón Mar de Vigo",
    zone: "Vigo",
    kinds: ["club"],
    location: null,
    highlights: ["Club de triatlón de la ciudad", "Organiza el Triatlón de Menores Concello de Vigo y el Duatlón Cros Candeán"],
    prices: [{ type: "cuota", label: "Cuota de socio", amount: null, status: "unknown" }],
    sources: [{ label: "FEGATRI", url: SRC.marVigo }],
    reviewedAt: REVIEWED,
  },

  // ---------------- A CORUÑA ----------------
  {
    slug: "piscina-san-amaro",
    city: "a-coruna",
    name: "Piscina Municipal de San Amaro",
    zone: "Monte Alto",
    kinds: ["swim"],
    location: { lat: 43.3836, lng: -8.4033 },
    highlights: ["Piscina municipal junto a la playa de San Amaro", "Abono familiar con convenio con el Club do Mar"],
    status: "open",
    prices: [
      { type: "entrada", label: "Entrada (1 hora)", covers: ["swim"], amount: 3.42, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
      { type: "bono", label: "Bono 20 usos de 1 hora", covers: ["swim"], amount: 22.32, uses: 20, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
      { type: "abono", label: "Abono mensual sin límite de horario", covers: ["swim"], amount: 28.02, abonoId: "san-amaro", status: "official", year: "2022", sourceUrl: SRC.coruOF15, note: "Mañanas de lunes a viernes: 17,69 €" },
      { type: "alta", label: "Cuota de alta del abono (una vez)", amount: 29.48, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
    ],
    sources: [{ label: "Ordenanza fiscal 15 (2022)", url: SRC.coruOF15 }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "complejo-san-diego",
    city: "a-coruna",
    name: "Complejo Deportivo Municipal de San Diego",
    zone: "San Diego",
    kinds: ["swim", "gym"],
    location: { lat: 43.37, lng: -8.3905 },
    highlights: ["Piscina y sala de musculación", "La musculación está incluida en el abono"],
    status: "open",
    prices: [
      { type: "entrada", label: "Entrada a la piscina (45 min)", covers: ["swim"], amount: 4.97, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
      { type: "entrada", label: "Entrada a musculación (60 min)", covers: ["gym"], amount: 4.91, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
      { type: "abono", label: "Abono mensual individual", covers: ["swim", "gym"], amount: 32.39, abonoId: "san-diego", status: "official", year: "2022", sourceUrl: SRC.coruOF15, note: "Solo mañanas: 21,77 €" },
      { type: "alta", label: "Matrícula (una vez)", amount: 29.48, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
    ],
    sources: [{ label: "Ordenanza fiscal 15 (2022)", url: SRC.coruOF15 }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "pista-cubierta-riazor",
    city: "a-coruna",
    name: "Pista cubierta de Riazor",
    zone: "Riazor",
    address: "Rúa Manuel Murguía, s/n",
    kinds: ["track"],
    location: { lat: 43.3686, lng: -8.4182 },
    highlights: ["Pista sintética cubierta de 160 m y 6 calles", "En el Palacio de los Deportes, Ciudad Deportiva de Riazor"],
    status: "open",
    prices: [
      { type: "entrada", label: "Entrada diaria (1 calle)", covers: ["track"], amount: 1.55, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
      { type: "bono", label: "Bono 20 usos", covers: ["track"], amount: 15.45, uses: 20, status: "official", year: "2022", sourceUrl: SRC.coruOF15 },
    ],
    sources: [
      { label: "Ordenanza fiscal 15 (2022)", url: SRC.coruOF15 },
      { label: "Páxinas Galegas", url: SRC.coruPista },
    ],
    reviewedAt: REVIEWED,
  },
  {
    slug: "piscina-riazor",
    city: "a-coruna",
    name: "Piscina Municipal de Riazor",
    zone: "Riazor",
    kinds: ["swim"],
    location: { lat: 43.3666, lng: -8.4158 },
    highlights: ["Sede del Nada e Corre Cidade da Coruña (14 de noviembre de 2026)", "Prueba organizada por el Club Triatlón Coruña"],
    status: "open",
    prices: [{ type: "entrada", label: "Entrada", covers: ["swim"], amount: null, status: "unknown" }],
    sources: [{ label: "Reglamento del Nada e Corre", url: SRC.coruNada }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "pista-elvina-udc",
    city: "a-coruna",
    name: "Pista de atletismo de Elviña (UDC)",
    zone: "Elviña",
    kinds: ["track"],
    location: { lat: 43.3328, lng: -8.4112 },
    highlights: ["Estadio universitario con pista de 400 m", "El acceso se solicita a través de los clubes de atletismo"],
    status: "open",
    prices: [{ type: "entrada", label: "Uso", covers: ["track"], amount: null, status: "unknown" }],
    sources: [{ label: "UDC", url: SRC.coruElvina }],
    reviewedAt: REVIEWED,
  },
  {
    slug: "club-triatlon-coruna",
    city: "a-coruna",
    name: "Club Triatlón Coruña",
    zone: "A Coruña",
    kinds: ["club"],
    location: null,
    highlights: ["Club con escuela de triatlón", "Organiza el Triatlón de Menores Cidade da Coruña y el Nada e Corre"],
    prices: [{ type: "cuota", label: "Cuota de socio", amount: null, status: "unknown" }],
    sources: [{ label: "Reglamento del triatlón", url: SRC.coruClub }],
    reviewedAt: REVIEWED,
  },
];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

export function getFacilities(city: CityId): Facility[] {
  return FACILITIES.filter((f) => f.city === city);
}

export function getFacility(city: string, slug: string): Facility | undefined {
  return FACILITIES.find((f) => f.city === city && f.slug === slug);
}
