import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileMenuToggle } from "@/features/marketing/MobileMenuToggle";
import { NavLinks, type NavLink } from "@/features/marketing/NavLinks";
import { ScissorsMark } from "@/components/ui/scissors-mark";

const LINKS: NavLink[] = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#team", label: "Team" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

/** Sticky landing nav — replaces the shared AppHeader for the marketing surface only. */
export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ScissorsMark className="h-6 w-6" />
          <span className="font-display text-xl tracking-wide text-foreground">Fadehouse</span>
        </Link>

        <NavLinks links={LINKS} />

        <div className="hidden md:block">
          <Link href="/book?track=haircut">
            <Button>Book Now</Button>
          </Link>
        </div>

        <MobileMenuToggle>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius)] px-2 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link href="/book?track=haircut" className="mt-2">
            <Button className="w-full">Book Now</Button>
          </Link>
        </MobileMenuToggle>
      </div>
    </header>
  );
}
