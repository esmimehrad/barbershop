import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { setAccessLevel } from "@/lib/actions/admin";
import type { Staff } from "@/lib/data/admin";
import { staffDisplayName } from "@/lib/staff-name";
import { ActionForm, SubmitButton } from "./action-form";

const LEVELS = ["staff", "manager", "owner"] as const;

/** Owner-only: set each staff member's dashboard access level (FS-11.1). */
export function AccessLevelsTab({ staff }: { staff: Staff[] }) {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Access level gates which dashboard sections each person sees. Owner-only.
      </p>
      {staff.map((member) => (
        <Card key={member.id}>
          <CardContent className="py-3">
            <ActionForm action={setAccessLevel} className="flex items-end gap-2">
              <input type="hidden" name="staffId" value={member.id} />
              <div className="flex-1">
                <div className="text-sm font-medium">{staffDisplayName(member)}</div>
                <div className="text-xs text-muted-foreground">{member.role}</div>
              </div>
              <Select
                name="level"
                defaultValue={member.access_level}
                aria-label={`Access level for ${staffDisplayName(member)}`}
                className="w-32"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
              <SubmitButton variant="secondary">Save</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
