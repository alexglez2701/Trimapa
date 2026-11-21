export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { APP } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${APP.siteUrl}/sitemap.xml` };
}
