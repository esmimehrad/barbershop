"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_RETURN_TO_COOKIE,
  destinationForIdentity,
  PENDING_PHONE_COOKIE,
  sanitizeRedirectPath,
  type IdentityKind,
} from "@/lib/auth-flow";
import { getSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  clientProfileInput,
  passwordResetRequestInput,
  passwordUpdateInput,
  phoneOtpRequestInput,
  phoneOtpVerifyInput,
  staffLoginInput,
} from "@/lib/validation/auth";

export type AuthActionState = {
  error?: string;
  fieldErrors?: {
    phone?: string;
    token?: string;
    name?: string;
    email?: string;
    password?: string;
  };
  message?: string;
};

// The reset email lands on the confirm route, which establishes the recovery
// session and then forwards to the set-password page.
const PASSWORD_RESET_REDIRECT_PATH = "/auth/confirm?next=/auth/reset";

const PENDING_COOKIE_MAX_AGE = 10 * 60;
const DEV_PASSWORD = "barbershop123";

const pendingCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/auth",
  maxAge: PENDING_COOKIE_MAX_AGE,
};

/**
 * Temporary fallback while the first real OTP is verified. Production builds
 * cannot use this action; remove it with app/auth/dev at cutover.
 */
export async function devSignIn(formData: FormData) {
  if (process.env.NODE_ENV === "production") redirect("/auth");

  const email = String(formData.get("email") ?? "");
  const redirectTo = sanitizeRedirectPath(
    String(formData.get("redirectTo") ?? "/"),
  );
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: DEV_PASSWORD,
  });

  if (error) {
    const qs = new URLSearchParams({ error: error.message });
    if (redirectTo !== "/") qs.set("returnTo", redirectTo);
    redirect(`/auth/dev?${qs.toString()}`);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

/**
 * Staff / owner email + password sign-in. Staff are pre-provisioned by an
 * owner; a successful password login must resolve to a staff identity, or the
 * session is discarded. Customers never use this entrance.
 */
export async function staffSignIn(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = staffLoginInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    returnTo: formData.get("returnTo"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  const session = await getSessionContext();
  if (session.kind !== "staff") {
    await supabase.auth.signOut();
    return { error: "This account does not have staff access." };
  }

  revalidatePath("/", "layout");
  redirect(destinationForIdentity("staff", sanitizeRedirectPath(parsed.data.returnTo)));
}

/**
 * Emails a password-reset link to a staff member. Always reports success so the
 * response cannot be used to probe which emails exist.
 */
export async function requestPasswordReset(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = passwordResetRequestInput.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: {
        email: parsed.error.flatten().fieldErrors.email?.[0],
      },
    };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: origin ? `${origin}${PASSWORD_RESET_REDIRECT_PATH}` : undefined,
  });

  return {
    message: "If that email belongs to a staff account, a reset link is on its way.",
  };
}

/**
 * Sets a new password for the user in the active recovery session (established
 * by following the reset link), then routes them to the dashboard.
 */
export async function updateStaffPassword(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = passwordUpdateInput.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: {
        password: parsed.error.flatten().fieldErrors.password?.[0],
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your reset link has expired. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: friendlyAuthError(error.message) };
  }

  const session = await getSessionContext();
  revalidatePath("/", "layout");
  redirect(session.kind === "staff" ? "/dashboard" : "/auth/staff");
}

export async function requestPhoneOtp(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = phoneOtpRequestInput.safeParse({
    phone: formData.get("phone"),
    returnTo: formData.get("returnTo"),
    captchaToken: formData.get("captchaToken"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: {
        phone: parsed.error.flatten().fieldErrors.phone?.[0],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone: parsed.data.phone,
    options: {
      shouldCreateUser: true,
      captchaToken: parsed.data.captchaToken || undefined,
    },
  });

  if (error) {
    return { error: friendlyAuthError(error.message) };
  }

  const cookieStore = await cookies();
  cookieStore.set(PENDING_PHONE_COOKIE, parsed.data.phone, pendingCookieOptions);
  cookieStore.set(
    AUTH_RETURN_TO_COOKIE,
    sanitizeRedirectPath(parsed.data.returnTo),
    pendingCookieOptions,
  );

  redirect("/auth/verify");
}

export async function verifyPhoneOtp(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = phoneOtpVerifyInput.safeParse({
    token: formData.get("token"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: {
        token: parsed.error.flatten().fieldErrors.token?.[0],
      },
    };
  }

  const cookieStore = await cookies();
  const phone = cookieStore.get(PENDING_PHONE_COOKIE)?.value;
  if (!phone) {
    return { error: "Your sign-in attempt expired. Request a new code." };
  }

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    phone,
    token: parsed.data.token,
    type: "sms",
  });

  if (verifyError) {
    return { error: friendlyAuthError(verifyError.message) };
  }

  const { data, error: identityError } = await supabase.rpc(
    "resolve_phone_identity",
  );

  if (identityError || !isIdentityKind(data)) {
    await supabase.auth.signOut();
    return {
      error:
        identityError?.message ??
        "We could not connect this phone number to an account.",
    };
  }

  cookieStore.delete(PENDING_PHONE_COOKIE);

  if (data === "needs_profile") {
    redirect("/auth/complete-profile");
  }

  const returnTo = cookieStore.get(AUTH_RETURN_TO_COOKIE)?.value ?? "/";
  cookieStore.delete(AUTH_RETURN_TO_COOKIE);
  revalidatePath("/", "layout");
  redirect(destinationForIdentity(data, returnTo));
}

export async function resendPhoneOtp(
  _previous: AuthActionState,
  _formData: FormData,
): Promise<AuthActionState> {
  void _previous;
  void _formData;

  const cookieStore = await cookies();
  const phone = cookieStore.get(PENDING_PHONE_COOKIE)?.value;
  if (!phone) {
    return { error: "Your sign-in attempt expired. Start again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: true },
  });

  if (error) {
    return { error: friendlyAuthError(error.message) };
  }

  cookieStore.set(PENDING_PHONE_COOKIE, phone, pendingCookieOptions);
  return { message: "A new code was sent." };
}

export async function completeClientProfile(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = clientProfileInput.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: {
        name: parsed.error.flatten().fieldErrors.name?.[0],
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data, error } = await supabase.rpc("create_client_profile", {
    p_name: parsed.data.name,
  });

  if (error || data !== "client") {
    return {
      error: error?.message ?? "We could not create your customer profile.",
    };
  }

  const cookieStore = await cookies();
  const returnTo = cookieStore.get(AUTH_RETURN_TO_COOKIE)?.value ?? "/account";
  cookieStore.delete(AUTH_RETURN_TO_COOKIE);
  revalidatePath("/", "layout");
  redirect(destinationForIdentity("client", returnTo));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete(PENDING_PHONE_COOKIE);
  cookieStore.delete(AUTH_RETURN_TO_COOKIE);

  revalidatePath("/", "layout");
  redirect("/auth");
}

function isIdentityKind(value: unknown): value is IdentityKind {
  return value === "client" || value === "staff" || value === "needs_profile";
}

function friendlyAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("rate limit") || normalized.includes("security purposes")) {
    return "Please wait before requesting another code.";
  }
  if (
    normalized.includes("expired") ||
    normalized.includes("invalid") ||
    normalized.includes("token")
  ) {
    return "That code is invalid or expired. Try again or request a new one.";
  }

  return "We could not complete sign-in. Please try again.";
}
