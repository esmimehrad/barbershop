"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Fixed bottom "Book Now" bar, mobile only, shown once the hero has scrolled out of view. */
export function MobileBookBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "-10% 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background p-3 shadow-md transition-transform duration-base ease-bds md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!visible}
    >
      <Link href="/book?track=haircut" tabIndex={visible ? 0 : -1}>
        <Button className="w-full">Book Now</Button>
      </Link>
    </div>
  );
}
