import type { Metadata } from "next";
import { bevan, archivo } from "@/lib/fonts";
import { businessInfo } from "@/features/marketing/business-info";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(businessInfo.domain),
  title: {
    default: "Fadehouse — Barbershop & Lash Studio",
    template: "%s — Fadehouse",
  },
  description: "Precision cuts and lash artistry. Book your seat at Fadehouse.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${bevan.variable} ${archivo.variable}`}
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
