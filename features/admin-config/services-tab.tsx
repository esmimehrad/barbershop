import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/field";
import { formatMoney } from "@/lib/utils";
import { saveService, toggleService } from "@/lib/actions/admin";
import type { Service } from "@/lib/data/admin";
import { ActionForm, SubmitButton } from "./action-form";

const TYPES = ["haircut", "eyelash"] as const;
const ROLES = ["barber", "lash_specialist"] as const;

/** Services, packages & pricing (FS-11.4) → service. Create + edit + activate. */
export function ServicesTab({ services }: { services: Service[] }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Add a service</h3>
        <Card>
          <CardContent className="py-3">
            <ServiceFields action={saveService} submitLabel="Add service" />
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          Package price is set directly here. (Deriving it from child services is an open
          product decision — FS-1.3.)
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Existing services</h3>
        <ul className="flex flex-col gap-2">
          {services.map((s) => (
            <li key={s.id}>
              <Card>
                <CardContent className="flex flex-col gap-3 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {s.name}{" "}
                      {s.is_addon ? <Badge>add-on</Badge> : null}
                      {s.is_package ? <Badge>package</Badge> : null}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {s.duration_minutes}m · {formatMoney(s.price)}
                    </span>
                  </div>
                  <ServiceFields action={saveService} submitLabel="Save" service={s} compact />
                  <ActionForm action={toggleService} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="active" value={s.is_active ? "false" : "true"} />
                    <Badge tone={s.is_active ? "success" : "neutral"}>
                      {s.is_active ? "active" : "inactive"}
                    </Badge>
                    <SubmitButton variant="ghost" pendingLabel="…">
                      {s.is_active ? "Deactivate" : "Activate"}
                    </SubmitButton>
                  </ActionForm>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ServiceFields({
  action,
  submitLabel,
  service,
  compact,
}: {
  action: typeof saveService;
  submitLabel: string;
  service?: Service;
  compact?: boolean;
}) {
  return (
    <ActionForm action={action} className="flex flex-col gap-3">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}
      <div className="grid grid-cols-2 gap-2">
        <Field label="Name" htmlFor={`svc-name-${service?.id ?? "new"}`}>
          <Input
            id={`svc-name-${service?.id ?? "new"}`}
            name="name"
            required
            defaultValue={service?.name ?? ""}
          />
        </Field>
        <Field label="Price ($)" htmlFor={`svc-price-${service?.id ?? "new"}`}>
          <Input
            id={`svc-price-${service?.id ?? "new"}`}
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={service ? String(service.price) : ""}
          />
        </Field>
        <Field label="Duration (min)" htmlFor={`svc-dur-${service?.id ?? "new"}`}>
          <Input
            id={`svc-dur-${service?.id ?? "new"}`}
            name="durationMinutes"
            type="number"
            min="5"
            required
            defaultValue={service ? String(service.duration_minutes) : "30"}
          />
        </Field>
        <Field label="Track" htmlFor={`svc-type-${service?.id ?? "new"}`}>
          <Select
            id={`svc-type-${service?.id ?? "new"}`}
            name="type"
            defaultValue={service?.type ?? "haircut"}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Performed by" htmlFor={`svc-role-${service?.id ?? "new"}`}>
          <Select
            id={`svc-role-${service?.id ?? "new"}`}
            name="allowedRole"
            defaultValue={service?.allowed_role ?? "barber"}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {!compact ? (
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isAddon" className="size-4" /> Add-on
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPackage" className="size-4" /> Package
          </label>
        </div>
      ) : (
        <>
          <input type="hidden" name="isAddon" value={service?.is_addon ? "on" : ""} />
          <input type="hidden" name="isPackage" value={service?.is_package ? "on" : ""} />
        </>
      )}
      <SubmitButton variant={compact ? "secondary" : "primary"} className="self-start">
        {submitLabel}
      </SubmitButton>
    </ActionForm>
  );
}
