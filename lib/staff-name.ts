/**
 * Staff identity display helpers. The DB now carries first_name / last_name /
 * email / phone; the legacy single `name` column is kept for compatibility and
 * used as a safe fallback while incomplete rows await admin completion.
 */

export type StaffNameParts = {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
};

/** Full display name: "First Last", falling back to the legacy `name`. */
export function staffDisplayName(staff: StaffNameParts): string {
  const full = [staff.first_name, staff.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  return full || staff.name?.trim() || "Unnamed";
}

/** True when first or last name is missing — the "needs completion" signal. */
export function hasIncompleteName(staff: StaffNameParts): boolean {
  return !staff.first_name?.trim() || !staff.last_name?.trim();
}

/** Lowercased haystack of every searchable identity field for a staff member. */
export function staffSearchHaystack(staff: {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}): string {
  return [
    staff.first_name,
    staff.last_name,
    staffDisplayName(staff),
    staff.email,
    staff.phone,
  ]
    .map((part) => part?.trim().toLocaleLowerCase())
    .filter(Boolean)
    .join(" ");
}
