import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OtpForm } from "@/features/auth/OtpForm";
import { maskPhone, PENDING_PHONE_COOKIE } from "@/lib/auth-flow";

export const metadata: Metadata = {
  title: "Verify your phone",
};

export default async function VerifyPhonePage() {
  const cookieStore = await cookies();
  const phone = cookieStore.get(PENDING_PHONE_COOKIE)?.value;
  if (!phone) redirect("/auth");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Fadehouse
        </p>
        <h1 className="font-display text-3xl">Check your messages</h1>
        <p className="text-sm text-muted-foreground">
          Enter the code sent to <span className="text-foreground">{maskPhone(phone)}</span>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verify your phone</CardTitle>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
      </Card>

      <Link
        href="/auth"
        className="min-h-11 text-center text-sm text-muted-foreground underline underline-offset-4"
      >
        Use a different number
      </Link>
    </main>
  );
}

