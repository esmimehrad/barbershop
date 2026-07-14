import { AppHeader } from "@/components/ui/app-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="flex-1">{children}</div>
    </>
  );
}
