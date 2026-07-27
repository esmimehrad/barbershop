import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompleteProfileForm } from "@/features/auth/CompleteProfileForm";
import { getSessionContext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Complete your profile",
};

export default async function CompleteProfilePage() {
  const session = await getSessionContext();
  if (!session.userId) redirect("/auth");
  if (session.kind === "staff") redirect("/dashboard");
  if (session.kind === "client") redirect("/account");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          One last step
        </p>
        <h1 className="font-display text-3xl">Tell us your name</h1>
        <p className="text-sm text-muted-foreground">
          Your phone is verified. Add your name to finish creating your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your customer profile</CardTitle>
        </CardHeader>
        <CardContent>
          <CompleteProfileForm />
        </CardContent>
      </Card>
    </main>
  );
}
