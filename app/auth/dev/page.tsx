import { devSignIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SendTestEmailButton } from "./SendTestEmailButton";
import { SendTestSmsButton } from "./SendTestSmsButton";
import { SendTestWhatsAppButton } from "./SendTestWhatsAppButton";

type DevUser = {
  email: string;
  label: string;
  role: string;
  redirectTo: string;
};

const DEV_USERS: DevUser[] = [
  { email: "ray@dev.local", label: "Ray Ortiz", role: "Customer", redirectTo: "/book" },
  { email: "marco@dev.local", label: "Marco", role: "Staff · owner", redirectTo: "/dashboard" },
  { email: "sami@dev.local", label: "Sami", role: "Staff · staff", redirectTo: "/dashboard" },
];

export default async function DevSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; returnTo?: string }>;
}) {
  const { error, returnTo } = await searchParams;
  const customerRedirect = sanitizeReturnTo(returnTo) ?? "/book";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 p-4">
      <div>
        <h1 className="text-xl font-bold">Dev sign-in</h1>
        <p className="text-sm text-muted-foreground">
          Low-fi placeholder for phone OTP. Pick a seeded user.
        </p>
      </div>

      {error ? (
        <p className="rounded-[var(--radius)] border border-destructive p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Seeded users</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {DEV_USERS.map((u) => (
            <form key={u.email} action={devSignIn}>
              <input type="hidden" name="email" value={u.email} />
              <input
                type="hidden"
                name="redirectTo"
                value={u.role === "Customer" ? customerRedirect : u.redirectTo}
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full justify-between"
              >
                <span>{u.label}</span>
                <span className="text-xs text-muted-foreground">{u.role}</span>
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Requires the Email auth provider enabled in Supabase. Password is shared
        for all dev users.
      </p>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Integration checks (sign in first, then return here):
        </p>
        <SendTestEmailButton />
        <SendTestSmsButton />
        <SendTestWhatsAppButton />
      </div>
    </main>
  );
}

function sanitizeReturnTo(value: string | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}
