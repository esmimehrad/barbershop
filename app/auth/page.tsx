import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneLoginForm } from "@/features/auth/PhoneLoginForm";
import { getSessionContext } from "@/lib/auth";
import { destinationForIdentity, sanitizeRedirectPath } from "@/lib/auth-flow";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const safeReturnTo = sanitizeRedirectPath(returnTo);
  const session = await getSessionContext();

  if (session.kind === "staff" || session.kind === "client") {
    redirect(destinationForIdentity(session.kind, safeReturnTo));
  }
  if (session.userId) redirect("/auth/complete-profile");

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-4">
      <Link
        href="/"
        aria-label="Back to homepage"
        className="absolute left-4 top-4 inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius)] px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-5" aria-hidden />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Fadehouse
        </p>
        <h1 className="font-display text-3xl">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in or create an account with your mobile number.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Continue with your phone</CardTitle>
        </CardHeader>
        <CardContent>
          <PhoneLoginForm
            returnTo={safeReturnTo}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </CardContent>
      </Card>

      <Link
        href="/"
        className="min-h-11 text-center text-sm text-muted-foreground underline underline-offset-4"
      >
        Cancel and return to homepage
      </Link>

      <p className="text-center text-xs text-muted-foreground">
        Standard message and data rates may apply.
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Staff or owner?{" "}
        <Link href="/auth/staff" className="underline underline-offset-4">
          Sign in with email
        </Link>
      </p>
    </main>
  );
}

