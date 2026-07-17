import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";
import { setServiceStaff } from "@/lib/actions/admin";
import type { Service, StaffWithContact } from "@/lib/data/admin";
import { ActionForm, SubmitButton } from "./action-form";
import { ProviderPicker } from "./provider-picker";

type ServiceType = Service["type"];

/** Service-first assignment flow for large service catalogs. */
export function StaffServicesTab({
  staff,
  services,
  matrix,
  selectedServiceId,
  serviceQuery = "",
  serviceType,
}: {
  staff: StaffWithContact[];
  services: Service[];
  matrix: Map<string, Set<string>>;
  selectedServiceId?: string;
  serviceQuery?: string;
  serviceType?: string;
}) {
  const gated = services.filter((service) => !service.is_addon);
  const selected = gated.find((service) => service.id === selectedServiceId);

  if (selected) {
    return (
      <ServiceAssignmentEditor
        service={selected}
        staff={staff}
        matrix={matrix}
        backHref={directoryHref({ serviceQuery, serviceType })}
      />
    );
  }

  const query = serviceQuery.trim().toLocaleLowerCase();
  const selectedType = isServiceType(serviceType) ? serviceType : "all";
  const filtered = gated.filter(
    (service) =>
      (selectedType === "all" || service.type === selectedType) &&
      (!query || service.name.toLocaleLowerCase().includes(query)),
  );

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold">Assign providers by service</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Find a service, then choose the providers who can be booked for it.
        </p>
      </div>

      <form action="/dashboard/settings" className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_11rem_auto]">
        <input type="hidden" name="tab" value="staff" />
        <Input
          name="serviceQuery"
          type="search"
          defaultValue={serviceQuery}
          placeholder="Search services"
          aria-label="Search services"
        />
        <Select name="serviceType" defaultValue={selectedType} aria-label="Filter services by track">
          <option value="all">All tracks</option>
          <option value="haircut">Haircut</option>
          <option value="eyelash">Eyelash</option>
        </Select>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filtered.length} service{filtered.length === 1 ? "" : "s"}</span>
        {query || selectedType !== "all" ? (
          <Link href="/dashboard/settings?tab=staff" className="underline">
            Clear filters
          </Link>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No services match those filters.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((service) => {
            const eligible = staff.filter((member) => member.role === service.allowed_role);
            const assigned = eligible.filter((member) => matrix.get(member.id)?.has(service.id));
            return (
              <li key={service.id}>
                <Link
                  href={directoryHref({ serviceId: service.id, serviceQuery, serviceType })}
                  className="block rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                          <span>{service.name}</span>
                          {service.is_package ? <Badge>package</Badge> : null}
                          {!service.is_active ? <Badge tone="neutral">inactive</Badge> : null}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {roleLabel(service.allowed_role)} · {assigned.length} of {eligible.length} providers assigned
                        </p>
                      </div>
                      <span className="text-sm underline">Manage</span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ServiceAssignmentEditor({
  service,
  staff,
  matrix,
  backHref,
}: {
  service: Service;
  staff: StaffWithContact[];
  matrix: Map<string, Set<string>>;
  backHref: string;
}) {
  const eligibleStaff = staff.filter((member) => member.role === service.allowed_role);
  const assignedStaff = eligibleStaff.filter((member) => matrix.get(member.id)?.has(service.id));

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{service.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select the {roleLabel(service.allowed_role)} who can be booked. {assignedStaff.length} of {eligibleStaff.length} currently assigned.
          </p>
        </div>
        <Link href={backHref} className="text-sm underline">
          Back to services
        </Link>
      </div>

      {eligibleStaff.length === 0 ? (
        <p className="text-sm text-muted-foreground">No providers have the required role.</p>
      ) : (
        <Card>
          <CardContent className="py-3">
            <ActionForm action={setServiceStaff} className="flex flex-col gap-3">
              <input type="hidden" name="serviceId" value={service.id} />
              <ProviderPicker
                providers={eligibleStaff.map((member) => ({
                  id: member.id,
                  name: member.name,
                  first_name: member.first_name,
                  last_name: member.last_name,
                  email: member.email,
                  phone: member.phone,
                  isActive: member.is_active,
                }))}
                assignedStaffIds={assignedStaff.map((member) => member.id)}
              />
              <SubmitButton className="self-start">Save providers</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function directoryHref({
  serviceId,
  serviceQuery,
  serviceType,
}: {
  serviceId?: string;
  serviceQuery?: string;
  serviceType?: string;
}) {
  const params = new URLSearchParams({ tab: "staff" });
  if (serviceId) params.set("serviceId", serviceId);
  if (serviceQuery) params.set("serviceQuery", serviceQuery);
  if (isServiceType(serviceType)) params.set("serviceType", serviceType);
  return `/dashboard/settings?${params.toString()}`;
}

function isServiceType(value: string | undefined): value is ServiceType {
  return value === "haircut" || value === "eyelash";
}

function roleLabel(role: StaffWithContact["role"]): string {
  return role === "lash_specialist" ? "lash specialists" : "barbers";
}
