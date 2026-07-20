"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/features/marketing/SmoothScrollProvider";

const HEADER_OFFSET = 84;

/** Hamburger toggle + slide-down panel for the mobile nav. Server-rendered links pass through as children. */
export function MobileMenuToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const lenis = useSmoothScroll();

  // Smooth-scroll in-page anchors (leave real routes like /book to Next). Then close.
  const handlePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (anchor && lenis) {
      const id = anchor.getAttribute("href")?.slice(1) ?? "";
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1.1 });
        history.replaceState(null, "", `#${id}`);
      }
    }
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <div
        id="mobile-nav-panel"
        className={cn(
          "absolute inset-x-0 top-full border-b border-border bg-background shadow-md",
          "overflow-hidden transition-[max-height] duration-base ease-bds",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-1 p-4" onClick={handlePanelClick}>
          {children}
        </div>
      </div>
    </div>
  );
}
