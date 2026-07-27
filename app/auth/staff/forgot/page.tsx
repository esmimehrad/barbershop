import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-4">
      <Link
        href="/auth/staff"
        aria-label="Back to staff sign in"
        className="absolute left-4 top-4 inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius)] px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-5" aria-hidden />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your work email and we will send a link to set a new password.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
