import { Card, CardContent } from "@/components/ui/card";
import { setStaffServices } from "@/lib/actions/admin";
import type { Service, Staff } from "@/lib/data/admin";
import { ActionForm, SubmitButton } from "./action-form";

/**
 * Per-staff "can perform" checklist (FS-11.2) → staff_service.
 * PLACEHOLDER: only base services + packages are gated here, not add-ons
 * (whether add-ons are gated by staff_service is an [OPEN] product decision).
 */
export function StaffServicesTab({
  staff,
  services,
  matrix,
}: {
  staff: Staff[];
  services: Service[];
  matrix: Map<string, Set<string>>;
}) {
  const gated = services.filter((s) => !s.is_addon);

  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Check the services each provider can perform. Narrows who a customer can book.
      </p>
      {staff.map((member) => {
        const assigned = matrix.get(member.id) ?? new Set<string>();
        return (
          <Card key={member.id}>
            <CardContent className="py-3">
              <ActionForm action={setStaffServices} className="flex flex-col gap-3">
                <input type="hidden" name="staffId" value={member.id} />
                <div className="text-sm font-medium">
                  {member.name}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {member.role}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {gated.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="serviceIds"
                        value={s.id}
                        defaultChecked={assigned.has(s.id)}
                        className="size-4"
                      />
                      {s.name}
                      {s.is_package ? " · package" : ""}
                    </label>
                  ))}
                </div>
                <SubmitButton variant="secondary" className="self-start">
                  Save assignments
                </SubmitButton>
              </ActionForm>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
