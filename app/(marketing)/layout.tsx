import type { Metadata } from "next";
import { Preloader } from "@/features/marketing/Preloader";
import { Nav } from "@/features/marketing/Nav";
import { MobileBookBar } from "@/features/marketing/MobileBookBar";
import { Footer } from "@/features/marketing/Footer";
import { StructuredData } from "@/features/marketing/StructuredData";
import { SmoothScrollProvider } from "@/features/marketing/SmoothScrollProvider";
import { CustomCursor } from "@/features/marketing/CustomCursor";
import { businessInfo } from "@/features/marketing/business-info";

export const metadata: Metadata = {
  title: "Fadehouse — Barbershop & Lash Studio",
  description:
    "Book a precision haircut or lash appointment at Fadehouse. Real time slots, no waiting room, no guesswork.",
  openGraph: {
    title: "Fadehouse — Barbershop & Lash Studio",
    description: businessInfo.tagline,
    images: ["/images/og-cover.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fadehouse — Barbershop & Lash Studio",
    description: businessInfo.tagline,
  },
  alternates: {
    canonical: businessInfo.domain,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <StructuredData />
      <CustomCursor />
      <Preloader />
      <Nav />
      <div className="flex-1">{children}</div>
      <MobileBookBar />
      <Footer />
    </SmoothScrollProvider>
  );
}
