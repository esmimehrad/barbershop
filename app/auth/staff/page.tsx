import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffLoginForm } from "@/features/auth/StaffLoginForm";
import { getSessionContext } from "@/lib/auth";
import { destinationForIdentity, sanitizeRedirectPath } from "@/lib/auth-flow";

export const metadata: Metadata = {
  title: "Staff sign in",
};

export default async function StaffSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const safeReturnTo = sanitizeRedirectPath(returnTo);
  const session = await getSessionContext();

  if (session.kind === "staff") {
    redirect(destinationForIdentity("staff", safeReturnTo));
  }

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
        <h1 className="font-display text-3xl">Staff &amp; owner</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to the dashboard with your work email.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffLoginForm returnTo={safeReturnTo} />
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Booking as a customer?{" "}
        <Link href="/auth" className="underline underline-offset-4">
          Sign in with your phone
        </Link>
      </p>
    </main>
  );
}
