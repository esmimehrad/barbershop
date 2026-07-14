import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/field";
import { createPromotion, togglePromotion } from "@/lib/actions/admin";
import type { PromotionRow, Service } from "@/lib/data/admin";
import { ActionForm, SubmitButton } from "./action-form";

const TRIGGERS = [
  ["first_completed_service", "After 1st completed service"],
  ["nth_visit", "On Nth visit"],
  ["manual", "Manual grant"],
] as const;

const REWARDS = [
  ["free_addon", "Free add-on"],
  ["fixed_credit", "Fixed credit ($)"],
  ["percent_off", "Percent off (0–1)"],
] as const;

/** Promotion builder (FS-14 / Flow 12) → promotion. Create + activate/pause. */
export function PromotionsTab({
  promotions,
  services,
}: {
  promotions: PromotionRow[];
  services: Service[];
}) {
  const addons = services.filter((s) => s.is_addon);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">New promotion</h3>
        <Card>
          <CardContent className="py-3">
            <ActionForm action={createPromotion} className="flex flex-col gap-3">
              <Field label="Name" htmlFor="promo-name">
                <Input id="promo-name" name="name" required placeholder="First-cut beard trim" />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Trigger" htmlFor="promo-trigger">
                  <Select id="promo-trigger" name="triggerType" defaultValue="first_completed_service">
                    {TRIGGERS.map(([v, label]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Trigger service (optional)" htmlFor="promo-trigger-svc">
                  <Select id="promo-trigger-svc" name="triggerServiceId" defaultValue="">
                    <option value="">Any</option>
                    {services
                      .filter((s) => !s.is_addon)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </Select>
                </Field>
                <Field label="Reward" htmlFor="promo-reward">
                  <Select id="promo-reward" name="rewardType" defaultValue="free_addon">
                    {REWARDS.map(([v, label]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Free add-on" htmlFor="promo-reward-svc" hint="For 'Free add-on'">
                  <Select id="promo-reward-svc" name="rewardServiceId" defaultValue="">
                    <option value="">—</option>
                    {addons.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Amount" htmlFor="promo-amount" hint="For credit / percent">
                  <Input id="promo-amount" name="rewardAmount" type="number" step="0.01" min="0" />
                </Field>
                <Field label="Expires (optional)" htmlFor="promo-exp">
                  <Input id="promo-exp" name="expiresAt" type="date" />
                </Field>
              </div>
              <SubmitButton className="self-start">Create promotion</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Existing promotions</h3>
        <ul className="flex flex-col gap-2">
          {promotions.map((p) => (
            <li key={p.id}>
              <Card>
                <CardContent className="flex items-center justify-between gap-2 py-3 text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.trigger_type.replace(/_/g, " ")}
                      {p.trigger_service ? ` · ${p.trigger_service.name}` : ""} →{" "}
                      {p.reward_type.replace(/_/g, " ")}
                      {p.reward_service ? ` · ${p.reward_service.name}` : ""}
                      {p.reward_amount != null ? ` · ${p.reward_amount}` : ""}
                    </div>
                  </div>
                  <ActionForm action={togglePromotion} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="active" value={p.is_active ? "false" : "true"} />
                    <Badge tone={p.is_active ? "success" : "neutral"}>
                      {p.is_active ? "active" : "paused"}
                    </Badge>
                    <SubmitButton variant="ghost" pendingLabel="…">
                      {p.is_active ? "Pause" : "Activate"}
                    </SubmitButton>
                  </ActionForm>
                </CardContent>
              </Card>
            </li>
          ))}
          {promotions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No promotions yet.</p>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
