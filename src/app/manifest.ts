export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { APP } from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP.name}: entrena triatlón en Galicia`,
    short_name: APP.name,
    description: APP.description,
    start_url: "/vigo",
    display: "standalone",
    background_color: "#f4f6f7",
    theme_color: "#f4f6f7",
    lang: "es",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
