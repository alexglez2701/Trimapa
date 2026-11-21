import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { APP } from "@/config";
import { TabBar } from "@/components/TabBar";

export const metadata: Metadata = {
  title: { default: `${APP.name} · ${APP.tagline}`, template: `%s · ${APP.name}` },
  description: APP.description,
  applicationName: APP.name,
  appleWebApp: { capable: true, title: APP.name, statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#f4f6f7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">
        <div className="pb-[calc(76px+env(safe-area-inset-bottom))] lg:pb-0">{children}</div>
        <TabBar />
      </body>
    </html>
  );
}
