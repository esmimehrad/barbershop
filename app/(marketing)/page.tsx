import { listBookableServices, listFeaturedServices } from "@/lib/data/services";
import { listActiveStaff } from "@/lib/data/staff";
import { listGalleryImages } from "@/lib/data/gallery";
import { Hero } from "@/features/marketing/Hero";
import { Services } from "@/features/marketing/Services";
import { Marquee } from "@/features/marketing/Marquee";
import { SloganMoment } from "@/features/marketing/SloganMoment";
import { About } from "@/features/marketing/About";
import { MeetTheTeam } from "@/features/marketing/MeetTheTeam";
import { EyelashShowcase } from "@/features/marketing/EyelashShowcase";
import { Gallery } from "@/features/marketing/Gallery";
import { Testimonials } from "@/features/marketing/Testimonials";
import { FAQAccordion } from "@/features/marketing/FAQAccordion";
import { Contact } from "@/features/marketing/Contact";

// Marketing content is largely static → cache it.
export const revalidate = 3600;

export default async function LandingPage() {
  const [featuredHaircuts, haircuts, eyelash, staff, galleryWork, gallerySpace] =
    await Promise.all([
      listFeaturedServices("haircut"),
      listBookableServices("haircut"),
      listBookableServices("eyelash"),
      listActiveStaff(),
      listGalleryImages("work"),
      listGalleryImages("space"),
    ]);

  // Fall back to the cheapest haircuts if nothing is flagged featured yet.
  const heroServices = featuredHaircuts.length > 0 ? featuredHaircuts : haircuts.slice(0, 3);

  return (
    <main>
      <Hero services={heroServices} />
      <Services services={haircuts} />
      <Marquee />
      <SloganMoment />
      <About />
      <MeetTheTeam staff={staff} />
      <EyelashShowcase services={eyelash} />
      <Gallery work={galleryWork} space={gallerySpace} />
      <Testimonials />
      {/* Referral strip slots in here once the referral feature ships. */}
      <FAQAccordion />
      <Contact />
    </main>
  );
}
