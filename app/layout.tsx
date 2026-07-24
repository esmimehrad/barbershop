import type { Metadata, Viewport } from "next";
import { displayFont, bodyFont } from "@/lib/fonts";
import { businessInfo } from "@/features/marketing/business-info";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(businessInfo.domain),
  title: {
    default: "Fadehouse — Barbershop & Lash Studio",
    template: "%s — Fadehouse",
  },
  description: "Precision cuts and lash artistry. Book your seat at Fadehouse.",
  // Launch chrome-less from the iOS home screen (Add to Home Screen).
  // Next emits the modern `mobile-web-app-capable`; the legacy apple meta in
  // `other` extends standalone launch to iOS < 16.4.
  appleWebApp: {
    capable: true,
    title: "Fadehouse",
    statusBarStyle: "black-translucent",
  },
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Let content extend under the notch/home indicator so env(safe-area-inset-*)
  // reports real values — the BottomTabBar pads against them.
  viewportFit: "cover",
  themeColor: "#121110", // = --bds-paper
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-dvh flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
