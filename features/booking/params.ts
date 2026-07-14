import type { Track } from "@/lib/data/services";

export type BookingParams = {
  track: Track;
  serviceId?: string;
  addons: string[];
  staffId?: string;
  start?: string;
};

type RawSearch = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseBooking(sp: RawSearch): BookingParams {
  const track = one(sp.track) === "eyelash" ? "eyelash" : "haircut";
  const addonsRaw = sp.addons;
  const addons = Array.isArray(addonsRaw)
    ? addonsRaw
    : addonsRaw
      ? [addonsRaw]
      : [];
  return {
    track,
    serviceId: one(sp.serviceId),
    addons,
    staffId: one(sp.staffId),
    start: one(sp.start),
  };
}

/** Build a wizard href for `step`, merging current params with overrides. */
export function buildHref(
  step: "" | "addons" | "provider" | "time" | "review",
  params: BookingParams,
  overrides: Partial<BookingParams> = {},
): string {
  const merged = { ...params, ...overrides };
  const qs = new URLSearchParams();
  qs.set("track", merged.track);
  if (merged.serviceId) qs.set("serviceId", merged.serviceId);
  if (merged.staffId) qs.set("staffId", merged.staffId);
  if (merged.start) qs.set("start", merged.start);
  for (const a of merged.addons) qs.append("addons", a);
  const path = step ? `/book/${step}` : "/book";
  return `${path}?${qs.toString()}`;
}

export const STEPS = ["service", "add-ons", "provider", "time", "review"] as const;
