"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const DEV_PASSWORD = "barbershop123";

/**
 * DEV-ONLY sign-in (real Supabase email/password session). Replaced by phone
 * OTP in the hardening pass. Reads email + redirectTo from the submitted form.
 */
export async function devSignIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: DEV_PASSWORD,
  });

  if (error) {
    redirect(`/auth/dev?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/dev");
}
