"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/field";
import { staffDisplayName, staffSearchHaystack } from "@/lib/staff-name";

export type ProviderOption = {
  id: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
};

/** Searchable, selection-preserving provider list for a service assignment form. */
export function ProviderPicker({
  providers,
  assignedStaffIds,
}: {
  providers: ProviderOption[];
  assignedStaffIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => new Set(assignedStaffIds));
  const visibleProviders = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return providers;
    // Search first name, last name, full name, email, and phone.
    return providers.filter((provider) =>
      staffSearchHaystack(provider).includes(normalizedQuery),
    );
  }, [providers, query]);

  function toggleProvider(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name, email, or phone"
        aria-label="Search eligible providers by name, email, or phone"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{selectedIds.size} selected</span>
        <span>{visibleProviders.length} shown</span>
      </div>
      <fieldset className="max-h-80 overflow-y-auto rounded-[var(--radius)] border border-border p-2">
        <legend className="px-1 text-sm font-medium">Eligible providers</legend>
        <div className="flex flex-col">
          {visibleProviders.map((provider) => (
            <label key={provider.id} className="flex min-h-11 items-center gap-3 px-1 text-sm">
              <input
                type="checkbox"
                checked={selectedIds.has(provider.id)}
                onChange={() => toggleProvider(provider.id)}
                className="size-4"
              />
              <span className="min-w-0">
                <span className="block truncate">{staffDisplayName(provider)}</span>
                {provider.email || provider.phone ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    {[provider.email, provider.phone].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </span>
              {!provider.isActive ? (
                <span className="text-xs text-muted-foreground">inactive</span>
              ) : null}
            </label>
          ))}
          {visibleProviders.length === 0 ? (
            <p className="px-1 py-2 text-sm text-muted-foreground">No providers match that search.</p>
          ) : null}
        </div>
      </fieldset>
      {[...selectedIds].map((staffId) => (
        <input key={staffId} type="hidden" name="staffIds" value={staffId} />
      ))}
    </div>
  );
}
