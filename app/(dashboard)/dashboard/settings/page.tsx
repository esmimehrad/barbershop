import Link from "next/link";
import { canSee, getSessionContext } from "@/lib/auth";
import {
  getStaffServiceMatrix,
  listAllServices,
  listAllStaff,
  listAllStaffWithContact,
  listAvailability,
  listHolidays,
  listPromotions,
} from "@/lib/data/admin";
import { AccessLevelsTab } from "@/features/admin-config/access-levels-tab";
import { StaffServicesTab } from "@/features/admin-config/staff-services-tab";
import { ScheduleTab } from "@/features/admin-config/schedule-tab";
import { ServicesTab } from "@/features/admin-config/services-tab";
import { PromotionsTab } from "@/features/admin-config/promotions-tab";

type TabKey = "access" | "staff" | "schedule" | "services" | "promotions";

const TABS: { key: TabKey; label: string; ownerOnly?: boolean }[] = [
  { key: "access", label: "Access levels", ownerOnly: true },
  { key: "staff", label: "Service assignments" },
  { key: "schedule", label: "Schedule & holidays" },
  { key: "services", label: "Services & pricing" },
  { key: "promotions", label: "Promotions" },
];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    serviceId?: string;
    serviceQuery?: string;
    serviceType?: string;
    staffId?: string;
    scheduleQuery?: string;
    view?: string;
    closureQuery?: string;
    closureStaffId?: string;
    catalogServiceId?: string;
    catalogQuery?: string;
    catalogType?: string;
    catalogStatus?: string;
    mode?: string;
  }>;
}) {
  const session = await getSessionContext();

  if (!canSee(session.accessLevel, "config_admin")) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configuration is limited to owner and manager access.
        </p>
        <Link href="/dashboard" className="text-sm underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const isOwner = canSee(session.accessLevel, "access_admin");
  const visibleTabs = TABS.filter((t) => !t.ownerOnly || isOwner);

  const {
    tab,
    serviceId,
    serviceQuery,
    serviceType,
    staffId,
    scheduleQuery,
    view,
    closureQuery,
    closureStaffId,
    catalogServiceId,
    catalogQuery,
    catalogType,
    catalogStatus,
    mode,
  } = await searchParams;
  const active: TabKey =
    visibleTabs.find((t) => t.key === tab)?.key ?? "services";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Settings</h1>
        <Link href="/dashboard" className="text-sm underline">
          Back
        </Link>
      </div>

      <nav className="flex flex-wrap gap-2 text-sm">
        {visibleTabs.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/settings?tab=${t.key}`}
            aria-current={t.key === active ? "page" : undefined}
            className={`rounded-[var(--radius)] px-3 py-2 ${
              t.key === active
                ? "bg-primary text-primary-foreground"
                : "border border-border"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <TabContent
        active={active}
        staffServiceState={{ serviceId, serviceQuery, serviceType }}
        scheduleState={{ staffId, scheduleQuery, view, closureQuery, closureStaffId }}
        serviceCatalogState={{ catalogServiceId, catalogQuery, catalogType, catalogStatus, mode }}
      />
    </div>
  );
}

async function TabContent({
  active,
  staffServiceState,
  scheduleState,
  serviceCatalogState,
}: {
  active: TabKey;
  staffServiceState: {
    serviceId?: string;
    serviceQuery?: string;
    serviceType?: string;
  };
  scheduleState: {
    staffId?: string;
    scheduleQuery?: string;
    view?: string;
    closureQuery?: string;
    closureStaffId?: string;
  };
  serviceCatalogState: {
    catalogServiceId?: string;
    catalogQuery?: string;
    catalogType?: string;
    catalogStatus?: string;
    mode?: string;
  };
}) {
  switch (active) {
    case "access": {
      const staff = await listAllStaff();
      return <AccessLevelsTab staff={staff} />;
    }
    case "staff": {
      const [staff, services, matrix] = await Promise.all([
        listAllStaffWithContact(),
        listAllServices(),
        getStaffServiceMatrix(),
      ]);
      return (
        <StaffServicesTab
          staff={staff}
          services={services}
          matrix={matrix}
          selectedServiceId={staffServiceState.serviceId}
          serviceQuery={staffServiceState.serviceQuery}
          serviceType={staffServiceState.serviceType}
        />
      );
    }
    case "schedule": {
      const [staff, availability, holidays] = await Promise.all([
        listAllStaffWithContact(),
        listAvailability(),
        listHolidays(),
      ]);
      return (
        <ScheduleTab
          staff={staff}
          availability={availability}
          holidays={holidays}
          selectedStaffId={scheduleState.staffId}
          scheduleQuery={scheduleState.scheduleQuery}
          view={scheduleState.view}
          closureQuery={scheduleState.closureQuery}
          closureStaffId={scheduleState.closureStaffId}
        />
      );
    }
    case "services": {
      const services = await listAllServices();
      return (
        <ServicesTab
          services={services}
          selectedServiceId={serviceCatalogState.catalogServiceId}
          catalogQuery={serviceCatalogState.catalogQuery}
          catalogType={serviceCatalogState.catalogType}
          catalogStatus={serviceCatalogState.catalogStatus}
          mode={serviceCatalogState.mode}
        />
      );
    }
    case "promotions": {
      const [promotions, services] = await Promise.all([
        listPromotions(),
        listAllServices(),
      ]);
      return <PromotionsTab promotions={promotions} services={services} />;
    }
  }
}
