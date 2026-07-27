export const PENDING_PHONE_COOKIE = "fadehouse_pending_phone";
export const AUTH_RETURN_TO_COOKIE = "fadehouse_auth_return_to";

export type IdentityKind = "client" | "staff" | "needs_profile";

export function sanitizeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";

  try {
    const url = new URL(value, "https://fadehouse.local");
    if (url.origin !== "https://fadehouse.local") return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function destinationForIdentity(
  kind: Exclude<IdentityKind, "needs_profile">,
  requestedPath: string,
): string {
  const path = sanitizeRedirectPath(requestedPath);

  if (kind === "staff") {
    return path.startsWith("/dashboard") ? path : "/dashboard";
  }

  if (path.startsWith("/dashboard") || path === "/") return "/account";
  return path;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 3)} ••• ••${phone.slice(-2)}`;
}

