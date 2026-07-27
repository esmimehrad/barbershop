import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { setBookingAlertPhone } from "@/lib/actions/admin";
import { ActionForm, SubmitButton } from "./action-form";

/** Owner-only: the phone that gets a text whenever a customer books. */
export function NotificationsTab({
  bookingAlertPhone,
}: {
  bookingAlertPhone: string | null;
}) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Every booking texts a confirmation to the customer and an alert to this
        number. Leave it blank to turn alerts off. Owner-only.
      </p>
      <Card>
        <CardContent className="py-4">
          <ActionForm
            action={setBookingAlertPhone}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="booking-alert-phone"
                className="text-sm font-medium"
              >
                New-booking alert number
              </label>
              <Input
                id="booking-alert-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+1 416 555 0123"
                defaultValue={bookingAlertPhone ?? ""}
              />
              <p className="text-xs text-muted-foreground">
                International format, e.g. +14165550123.
              </p>
            </div>
            <SubmitButton variant="secondary" className="self-start">
              Save
            </SubmitButton>
          </ActionForm>
        </CardContent>
      </Card>
    </section>
  );
}
