"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/features/marketing/SmoothScrollProvider";

export type NavLink = { href: string; label: string };

/** Approx. sticky-header height to stop above so the section isn't hidden under the nav. */
const HEADER_OFFSET = 84;

/**
 * Desktop nav links with (1) inertia smooth-scroll to the target section on
 * click (via the shared Lenis instance), (2) scroll-spy that marks the section
 * currently in view, and (3) an underline indicator that slides from one item
 * to the next as the active/hovered link changes — the "moving between items"
 * transition. Falls back to native anchor jumps when Lenis is absent (reduced
 * motion / no-JS), and the indicator is pure CSS-transition polish on top.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
  const lenis = useSmoothScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const [activeId, setActiveId] = useState(links[0]?.href.slice(1) ?? "");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const shownId = hoverId ?? activeId;

  // Slide the underline under the shown link. Direct DOM writes (not state) so a
  // resize/scroll re-measure never causes a re-render; the CSS transition animates it.
  const measure = useCallback(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    const el = linkRefs.current[shownId];
    if (!indicator || !container) return;
    if (!el) {
      indicator.style.opacity = "0";
      return;
    }
    const c = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    indicator.style.left = `${r.left - c.left}px`;
    indicator.style.width = `${r.width}px`;
    indicator.style.opacity = "1";
  }, [shownId]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Scroll-spy: mark the section whose band sits across the viewport middle.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((s): s is HTMLElement => s !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveId(top.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [links]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.slice(1);
    setActiveId(id);
    if (!lenis) return; // reduced motion / no-JS → let the native anchor jump happen
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1.1 });
    history.replaceState(null, "", href);
  };

  return (
    <nav
      ref={containerRef}
      onMouseLeave={() => setHoverId(null)}
      className="relative hidden items-center gap-1 text-sm font-medium md:flex"
    >
      {links.map((link) => {
        const id = link.href.slice(1);
        const active = activeId === id;
        return (
          <a
            key={link.href}
            href={link.href}
            ref={(el) => {
              linkRefs.current[id] = el;
            }}
            onClick={(e) => handleClick(e, link.href)}
            onMouseEnter={() => setHoverId(id)}
            className={`rounded-[var(--bds-radius-pill)] px-3 py-1.5 transition-colors ${
              active ? "text-primary" : "text-foreground/80 hover:text-primary"
            }`}
          >
            {link.label}
          </a>
        );
      })}
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary opacity-0 transition-[left,width,opacity] duration-300 ease-bds"
      />
    </nav>
  );
}
