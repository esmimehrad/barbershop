import Link from "next/link";
import { ArrowLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { saveService } from "@/lib/actions/admin";
import type { Service } from "@/lib/data/admin";
import { formatMoney } from "@/lib/utils";
import { ActionForm, SubmitButton } from "./action-form";
import { ServiceStatusControl } from "./service-status-control";

const TYPES = ["haircut", "eyelash"] as const;
const ROLES = ["barber", "lash_specialist"] as const;

type ServiceType = Service["type"];
type CatalogStatus = "all" | "active" | "inactive";

/** Service catalog with focused create and edit flows for large menus. */
export function ServicesTab({
  services,
  selectedServiceId,
  catalogQuery = "",
  catalogType,
  catalogStatus,
  mode,
}: {
  services: Service[];
  selectedServiceId?: string;
  catalogQuery?: string;
  catalogType?: string;
  catalogStatus?: string;
  mode?: string;
}) {
  const selectedService = services.find((service) => service.id === selectedServiceId);

  if (mode === "new") {
    return <ServiceEditor backHref={directoryHref({ catalogQuery, catalogType, catalogStatus })} />;
  }

  if (selectedService) {
    return (
      <ServiceEditor
        service={selectedService}
        backHref={directoryHref({ catalogQuery, catalogType, catalogStatus })}
      />
    );
  }

  return (
    <ServiceDirectory
      services={services}
      catalogQuery={catalogQuery}
      catalogType={catalogType}
      catalogStatus={catalogStatus}
    />
  );
}

function ServiceDirectory({
  services,
  catalogQuery,
  catalogType,
  catalogStatus,
}: {
  services: Service[];
  catalogQuery: string;
  catalogType?: string;
  catalogStatus?: string;
}) {
  const query = catalogQuery.trim().toLocaleLowerCase();
  const selectedType = isServiceType(catalogType) ? catalogType : "all";
  const selectedStatus = isCatalogStatus(catalogStatus) ? catalogStatus : "all";
  const filteredServices = services.filter(
    (service) =>
      (selectedType === "all" || service.type === selectedType) &&
      (selectedStatus === "all" ||
        (selectedStatus === "active" && service.is_active) ||
        (selectedStatus === "inactive" && !service.is_active)) &&
      (!query || service.name.toLocaleLowerCase().includes(query)),
  );
  const filtersApplied = Boolean(query || selectedType !== "all" || selectedStatus !== "all");

  return (
    <section className="flex flex-col gap-4" aria-labelledby="service-catalog-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="service-catalog-heading" className="text-base font-semibold">Services & pricing</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage the services customers can book.</p>
        </div>
        <Link
          href={directoryHref({ catalogQuery, catalogType, catalogStatus, mode: "new" })}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add service
        </Link>
      </div>

      <form
        key={`${catalogQuery}-${selectedType}-${selectedStatus}`}
        action="/dashboard/settings"
        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]"
      >
        <input type="hidden" name="tab" defaultValue="services" />
        <Input
          name="catalogQuery"
          type="search"
          defaultValue={catalogQuery}
          placeholder="Search services"
          aria-label="Search services"
        />
        <Select name="catalogType" defaultValue={selectedType} aria-label="Filter services by track">
          <option value="all">All tracks</option>
          <option value="haircut">Haircut</option>
          <option value="eyelash">Eyelash</option>
        </Select>
        <Select name="catalogStatus" defaultValue={selectedStatus} aria-label="Filter services by status">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <Button type="submit" variant="secondary">
          <Search className="size-4" aria-hidden="true" />
          Filter
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filteredServices.length} service{filteredServices.length === 1 ? "" : "s"}</span>
        {filtersApplied ? (
          <Link href="/dashboard/settings?tab=services" className="underline">Clear filters</Link>
        ) : null}
      </div>

      {filteredServices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No services match those filters.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredServices.map((service) => (
            <li key={service.id}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex min-h-16 flex-wrap items-center justify-between gap-3 p-3 sm:flex-nowrap">
                  <Link
                    href={directoryHref({
                      catalogServiceId: service.id,
                      catalogQuery,
                      catalogType,
                      catalogStatus,
                    })}
                    className="min-w-0 flex-1 rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">{service.name}</h3>
                        {service.is_addon ? <Badge>add-on</Badge> : null}
                        {service.is_package ? <Badge>package</Badge> : null}
                        <Badge tone={service.is_active ? "success" : "neutral"}>
                          {service.is_active ? "active" : "inactive"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {trackLabel(service.type)} · {roleLabel(service.allowed_role)} · {service.duration_minutes} min
                      </p>
                    </div>
                  </Link>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums">{formatMoney(service.price)}</span>
                    <ServiceStatusControl
                      serviceId={service.id}
                      serviceName={service.name}
                      isActive={service.is_active}
                    />
                    <Link
                      href={directoryHref({
                        catalogServiceId: service.id,
                        catalogQuery,
                        catalogType,
                        catalogStatus,
                      })}
                      aria-label={`Edit ${service.name}`}
                      className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ChevronRight className="size-5" aria-hidden="true" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ServiceEditor({ service, backHref }: { service?: Service; backHref: string }) {
  const isNew = !service;
  const heading = isNew ? "Add service" : service.name;

  return (
    <section className="flex flex-col gap-5" aria-labelledby="service-editor-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="service-editor-heading" className="text-base font-semibold">{heading}</h2>
          {!isNew ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatMoney(service.price)} · {service.duration_minutes} min · {trackLabel(service.type)}
            </p>
          ) : null}
        </div>
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 px-3 text-sm underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to services
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <ServiceFields service={service} submitLabel={isNew ? "Create service" : "Save changes"} />
        </CardContent>
      </Card>

      {service ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <div>
            <h3 className="text-sm font-semibold">Availability</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {service.is_active ? "Active for booking" : "Not available for booking"}
            </p>
          </div>
          <ServiceStatusControl
            serviceId={service.id}
            serviceName={service.name}
            isActive={service.is_active}
          />
        </div>
      ) : null}
    </section>
  );
}

function ServiceFields({
  service,
  submitLabel,
}: {
  service?: Service;
  submitLabel: string;
}) {
  const fieldId = service?.id ?? "new";
  return (
    <ActionForm action={saveService} className="flex flex-col gap-4">
      {service ? <input type="hidden" name="id" defaultValue={service.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" htmlFor={`service-name-${fieldId}`}>
          <Input
            id={`service-name-${fieldId}`}
            name="name"
            required
            defaultValue={service?.name ?? ""}
          />
        </Field>
        <Field label="Price" htmlFor={`service-price-${fieldId}`}>
          <Input
            id={`service-price-${fieldId}`}
            name="price"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            required
            defaultValue={service ? String(service.price) : ""}
          />
        </Field>
        <Field label="Duration (minutes)" htmlFor={`service-duration-${fieldId}`}>
          <Input
            id={`service-duration-${fieldId}`}
            name="durationMinutes"
            type="number"
            inputMode="numeric"
            min="5"
            required
            defaultValue={service ? String(service.duration_minutes) : "30"}
          />
        </Field>
        <Field label="Track" htmlFor={`service-track-${fieldId}`}>
          <Select
            id={`service-track-${fieldId}`}
            name="type"
            defaultValue={service?.type ?? "haircut"}
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>{trackLabel(type)}</option>
            ))}
          </Select>
        </Field>
        <Field label="Performed by" htmlFor={`service-role-${fieldId}`}>
          <Select
            id={`service-role-${fieldId}`}
            name="allowedRole"
            defaultValue={service?.allowed_role ?? "barber"}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>{roleLabel(role)}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            name="isAddon"
            defaultChecked={service?.is_addon ?? false}
            className="size-4"
          />
          Add-on
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            name="isPackage"
            defaultChecked={service?.is_package ?? false}
            className="size-4"
          />
          Package
        </label>
      </div>

      <SubmitButton className="self-start">{submitLabel}</SubmitButton>
    </ActionForm>
  );
}

function directoryHref({
  catalogServiceId,
  catalogQuery,
  catalogType,
  catalogStatus,
  mode,
}: {
  catalogServiceId?: string;
  catalogQuery?: string;
  catalogType?: string;
  catalogStatus?: string;
  mode?: "new";
}) {
  const params = new URLSearchParams({ tab: "services" });
  if (catalogServiceId) params.set("catalogServiceId", catalogServiceId);
  if (catalogQuery) params.set("catalogQuery", catalogQuery);
  if (isServiceType(catalogType)) params.set("catalogType", catalogType);
  if (isCatalogStatus(catalogStatus)) params.set("catalogStatus", catalogStatus);
  if (mode === "new") params.set("mode", "new");
  return `/dashboard/settings?${params.toString()}`;
}

function isServiceType(value: string | undefined): value is ServiceType {
  return value === "haircut" || value === "eyelash";
}

function isCatalogStatus(value: string | undefined): value is CatalogStatus {
  return value === "all" || value === "active" || value === "inactive";
}

function trackLabel(type: ServiceType): string {
  return type === "eyelash" ? "Eyelash" : "Haircut";
}

function roleLabel(role: Service["allowed_role"]): string {
  return role === "lash_specialist" ? "Lash specialist" : "Barber";
}
