"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Hamburger toggle + slide-down panel for the mobile nav. Server-rendered links pass through as children. */
export function MobileMenuToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

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
        <div className="flex flex-col gap-1 p-4" onClick={() => setOpen(false)}>
          {children}
        </div>
      </div>
    </div>
  );
}
