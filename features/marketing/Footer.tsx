import Link from "next/link";
import { businessInfo, formatAddress } from "@/features/marketing/business-info";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--bds-paper-deep)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <span className="font-display text-2xl tracking-wide text-foreground">
            {businessInfo.name}
          </span>
          <p className="mt-3 text-sm text-muted-foreground">{businessInfo.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><a href="#services" className="hover:text-primary">Services</a></li>
              <li><a href="#team" className="hover:text-primary">Team</a></li>
              <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Book
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><Link href="/book?track=haircut" className="hover:text-primary">Haircut</Link></li>
              <li><Link href="/book?track=eyelash" className="hover:text-primary">Eyelash</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Visit
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>{formatAddress()}</li>
              <li>
                <a href={`tel:${businessInfo.phone}`} className="hover:text-primary">
                  {businessInfo.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
      </div>
    </footer>
  );
}
