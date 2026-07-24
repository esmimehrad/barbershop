import { AppHeader } from "@/components/ui/app-header";
import { BottomTabBar } from "@/components/ui/bottom-tab-bar";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {/* Bottom padding clears the fixed BottomTabBar (mobile only). */}
      <div className="mx-auto w-full max-w-md flex-1 p-4 pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-4">
        {children}
      </div>
      <BottomTabBar />
    </>
  );
}
