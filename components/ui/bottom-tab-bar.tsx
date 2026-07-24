"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scissors, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared customer app-shell navigation.
 *
 * A fixed thumb-zone bar (mobile only) that makes the marketing + booking
 * surfaces read as one installable app: flat Home/Account tabs flanking a
 * raised center "Book" FAB. Persistent (no scroll trigger) and safe-area
 * padded so it clears the home indicator when launched from the home screen.
 * Hidden at `md`, where each surface's own top nav/header takes over.
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const bookActive = pathname.startsWith("/book");

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background md:hidden"
      style={{ paddingBottom: "max(var(--bds-space-2), env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-3 items-end px-2 pt-2">
        <TabLink href="/" label="Home" icon={Home} active={pathname === "/"} />

        {/* Book — raised center FAB */}
        <div className="flex flex-col items-center gap-1">
          <Link
            href="/book"
            aria-label="Book an appointment"
            aria-current={bookActive ? "page" : undefined}
            className={cn(
              "-mt-6 flex size-14 items-center justify-center rounded-[var(--bds-radius-pill)]",
              "bg-primary text-primary-foreground shadow-md ring-4 ring-background",
              "transition-transform duration-fast ease-bds [touch-action:manipulation]",
              "hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
            )}
          >
            <Scissors className="size-6" aria-hidden />
          </Link>
          <span
            className={cn(
              "text-xs font-semibold leading-none",
              bookActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            Book
          </span>
        </div>

        <TabLink
          href="/account"
          label="Account"
          icon={User}
          active={pathname.startsWith("/account")}
        />
      </div>
    </nav>
  );
}

function TabLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 flex-col items-center justify-end gap-1 rounded-[var(--radius)] pb-1",
        "text-xs font-medium leading-none transition-colors duration-fast ease-bds [touch-action:manipulation]",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-5" aria-hidden />
      <span>{label}</span>
    </Link>
  );
}
