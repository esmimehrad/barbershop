import Link from "next/link";
import { getSessionContext } from "@/lib/auth";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

/** Shared low-fi top bar: wordmark, primary links, session state. */
export async function AppHeader() {
  const session = await getSessionContext();
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 p-3">
        <Link href="/" className="font-bold">
          Barbershop
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/book" className="rounded-[var(--radius)] px-2 py-1 hover:bg-muted">
            Book
          </Link>
          {session.kind === "client" ? (
            <Link href="/account" className="rounded-[var(--radius)] px-2 py-1 hover:bg-muted">
              Account
            </Link>
          ) : null}
          {session.kind === "staff" ? (
            <Link href="/dashboard" className="rounded-[var(--radius)] px-2 py-1 hover:bg-muted">
              Dashboard
            </Link>
          ) : null}
          {session.userId ? (
            <form action={signOut}>
              <Button variant="ghost" className="h-8 min-h-0 px-2 text-sm">
                Sign out
              </Button>
            </form>
          ) : (
            <Link href="/auth/dev" className="rounded-[var(--radius)] px-2 py-1 hover:bg-muted">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
