# TriMapa

Web app (PWA) para encontrar dónde entrenar triatlón en Galicia y cuánto cuesta: piscinas, pistas de atletismo, gimnasios y clubes de Vigo y A Coruña, con precios comparados y una calculadora que recomienda la combinación más barata de entradas, bonos y abonos.

## Qué incluye

- **Explorar** (`/vigo`, `/a-coruna`): mapa real, filtros por tipo, buscador y tarjetas de cada instalación.
- **Ficha** (`/vigo/piscina-as-travesas`…): una página por instalación, con precios, fuente y año de cada tarifa, mapa, "Cómo llegar" y botón para corregir datos. Cada ficha es una URL propia que Google puede indexar.
- **Calculadora** (`/vigo/calculadora`): compara todas las combinaciones de abonos, bonos y entradas de la ciudad.
- **Guardados**: favoritos en el dispositivo.
- Instalable en el móvil (manifest PWA), `sitemap.xml` y `robots.txt`.

## Tecnología

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS 4
- [MapLibre GL](https://maplibre.org) con el mapa base gratuito de [OpenFreeMap](https://openfreemap.org) (sin clave). Si el mapa no carga, se muestra un mapa de respaldo con los contornos municipales del IGN.
- Iconos [Lucide](https://lucide.dev), tipografía Plus Jakarta Sans (autoalojada).
- Tests con Vitest.

## Arrancar en tu ordenador

Necesitas [Node.js 20 o superior](https://nodejs.org).

```bash
npm install
npm run dev        # abre http://localhost:3000
npm test           # tests de la calculadora
npm run build      # build de producción
```

## Verla publicada en 2 minutos (sin instalar nada)

```bash
STATIC_EXPORT=1 npx next build   # genera la carpeta "out" con la web estática
```

Arrastra la carpeta `out` (o un zip con su contenido) a [app.netlify.com/drop](https://app.netlify.com/drop). Para conservarla, crea una cuenta gratuita y reclama el sitio en menos de una hora.

## Publicarla en internet (Vercel, gratis)

1. Sube esta carpeta a un repositorio de GitHub.
2. Entra en [vercel.com](https://vercel.com), inicia sesión con GitHub y pulsa **Add New → Project**.
3. Elige el repositorio y pulsa **Deploy**. No hace falta configurar nada.
4. Cuando tengas dominio, añádelo en Vercel y cambia `siteUrl` en `src/config.ts`.

## Dónde está cada cosa

```
src/
  config.ts              nombre de la app, email de contacto, dominio, estilo del mapa
  data/facilities.ts     ciudades e instalaciones (aquí se añaden y corrigen datos)
  data/types.ts          modelo de datos
  lib/pricing.ts         lógica de precios y calculadora (+ pricing.test.ts)
  components/            mapa, tarjetas, calculadora, barra de navegación…
  app/                   páginas (rutas)
```

### Añadir o corregir una instalación

Edita `src/data/facilities.ts`. Cada precio lleva:

- `status`: `"verified"` (comprobado hace poco), `"official"` (tarifa oficial de un año, indicar `year`) o `"unknown"`.
- `sourceUrl`: enlace a la fuente.
- En abonos, `covers` indica qué disciplinas incluye y `abonoId` sirve para que un abono válido en varias instalaciones cuente una sola vez.

## Pendiente

- [ ] Cambiar `contactEmail` y `siteUrl` en `src/config.ts`.
- [ ] Verificar precios: los de A Coruña son de la ordenanza de 2022, los de piscinas de Vigo de 2013 y los de la UVigo del curso 2019-20.
- [ ] Fotos reales de las instalaciones (con permiso) en lugar de las ilustraciones.
- [ ] Base de datos (Supabase) para editar datos sin tocar código, cuentas de usuario y correcciones de la comunidad.
- [ ] Modo sin conexión (service worker).
- [ ] Más ciudades: Santiago, Ourense, Lugo, Pontevedra y Ferrol.
