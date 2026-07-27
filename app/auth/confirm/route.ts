import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectPath } from "@/lib/auth-flow";
import { createClient } from "@/lib/supabase/server";

/**
 * Establishes a session from an email link (password recovery / confirmation),
 * then forwards to `next`. Supabase appends `code` (PKCE) or `token_hash`+`type`
 * to the configured redirect URL; we exchange whichever is present.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = sanitizeRedirectPath(searchParams.get("next") ?? "/auth/reset");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "recovery",
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(new URL("/auth/staff?error=reset_link", origin));
}
