import { redirect } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { getSessionContext } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();
  if (session.kind !== "staff") redirect("/auth/dev");

  return (
    <>
      <AppHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 p-4">{children}</div>
    </>
  );
}
