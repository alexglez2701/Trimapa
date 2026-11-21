import type { NextConfig } from "next";

// STATIC_EXPORT=1 genera una versión 100% estática en la carpeta "out"
// (para subirla a cualquier hosting estático, por ejemplo Netlify Drop).
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
