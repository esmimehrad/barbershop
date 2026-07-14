import { AppHeader } from "@/components/ui/app-header";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="mx-auto w-full max-w-md flex-1 p-4">{children}</div>
    </>
  );
}
