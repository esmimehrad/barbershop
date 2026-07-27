import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetPasswordForm } from "@/features/auth/SetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password",
};

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl">New password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a new password for your staff account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Set password</CardTitle>
        </CardHeader>
        <CardContent>
          <SetPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
