import { notFound } from "next/navigation";
import { parseBooking } from "@/features/booking/params";
import { Stepper } from "@/features/booking/Stepper";
import {
  AddonsStep,
  ConfirmedStep,
  ProviderStep,
  ReviewStep,
  ServiceStep,
  TimeStep,
} from "@/features/booking/steps";

type Raw = Record<string, string | string[] | undefined>;

const STEP_INDEX: Record<string, number> = {
  service: 0,
  addons: 1,
  provider: 2,
  time: 3,
  review: 4,
};

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ step?: string[] }>;
  searchParams: Promise<Raw>;
}) {
  const { step } = await params;
  const sp = await searchParams;
  const current = step?.[0] ?? "service";
  const booking = parseBooking(sp);

  if (current === "confirmed") {
    return <ConfirmedStep sp={sp} />;
  }

  const index = STEP_INDEX[current];
  if (index === undefined) notFound();

  const body =
    current === "service" ? (
      <ServiceStep params={booking} />
    ) : current === "addons" ? (
      <AddonsStep params={booking} />
    ) : current === "provider" ? (
      <ProviderStep params={booking} />
    ) : current === "time" ? (
      <TimeStep params={booking} sp={sp} />
    ) : (
      <ReviewStep params={booking} sp={sp} />
    );

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={index} />
      {body}
    </div>
  );
}
