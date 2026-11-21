export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { APP } from "@/config";
import { CITIES, FACILITIES } from "@/data/facilities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP.siteUrl;
  return [
    { url: base },
    ...CITIES.flatMap((c) => [{ url: `${base}/${c.id}` }, { url: `${base}/${c.id}/calculadora` }]),
    ...FACILITIES.map((f) => ({ url: `${base}/${f.city}/${f.slug}`, lastModified: f.reviewedAt })),
  ];
}
