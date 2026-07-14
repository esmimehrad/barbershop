import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getService,
  getServicesByIds,
  listAddons,
  listBookableServices,
} from "@/lib/data/services";
import { getStaff, listProvidersForService } from "@/lib/data/staff";
import { getAvailableSlots } from "@/lib/data/availability";
import { getClientCreditBalance, getCreditPolicy, maxCreditApplicable } from "@/lib/data/credit";
import { getSessionContext } from "@/lib/auth";
import { bookAppointment } from "@/lib/actions/booking";
import { buildHref, type BookingParams } from "./params";

type Raw = Record<string, string | string[] | undefined>;
const oneOf = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export async function ServiceStep({ params }: { params: BookingParams }) {
  const services = await listBookableServices(params.track);
  const session = await getSessionContext();
  return (
    <div className="flex flex-col gap-4">
      {session.kind !== "client" ? (
        <p className="rounded-[var(--radius)] border border-border p-3 text-xs text-muted-foreground">
          You can browse freely. <Link className="underline" href="/auth/dev">Sign in</Link> as a customer to confirm a booking.
        </p>
      ) : null}
      <div className="flex gap-2 text-sm">
        {(["haircut", "eyelash"] as const).map((t) => (
          <Link
            key={t}
            href={`/book?track=${t}`}
            className={`rounded-[var(--radius)] px-3 py-2 ${
              params.track === t ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {t === "haircut" ? "Haircut" : "Eyelash"}
          </Link>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {services.map((s) => (
          <li key={s.id}>
            <Link href={buildHref("addons", params, { serviceId: s.id, addons: [] })}>
              <Card className="hover:bg-muted">
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">
                      {s.name} {s.is_package ? <Badge>package</Badge> : null}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.duration_minutes} min</div>
                  </div>
                  <div className="tabular-nums">{formatMoney(s.price)}</div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
        {services.length === 0 ? <Empty>No services in this track yet.</Empty> : null}
      </ul>
    </div>
  );
}

export async function AddonsStep({ params }: { params: BookingParams }) {
  if (!params.serviceId) return <Empty>Pick a service first.</Empty>;
  const [addons, service] = await Promise.all([
    listAddons(params.track),
    getService(params.serviceId),
  ]);
  return (
    <form method="get" action="/book/provider" className="flex flex-col gap-4">
      <input type="hidden" name="track" value={params.track} />
      <input type="hidden" name="serviceId" value={params.serviceId} />
      <div className="text-sm text-muted-foreground">
        {service?.name} · add extras (optional)
      </div>
      <ul className="flex flex-col gap-2">
        {addons.map((a) => (
          <li key={a.id}>
            <label className="flex items-center justify-between rounded-[var(--radius)] border border-border p-3">
              <span className="flex items-center gap-2">
                <input type="checkbox" name="addons" value={a.id} className="size-4" />
                {a.name}
              </span>
              <span className="tabular-nums text-sm">+{formatMoney(a.price)}</span>
            </label>
          </li>
        ))}
        {addons.length === 0 ? <Empty>No add-ons available.</Empty> : null}
      </ul>
      <Button type="submit">Continue</Button>
    </form>
  );
}

export async function ProviderStep({ params }: { params: BookingParams }) {
  if (!params.serviceId) return <Empty>Pick a service first.</Empty>;
  const providers = await listProvidersForService(params.serviceId);
  return (
    <ul className="flex flex-col gap-2">
      {providers.map((p) => (
        <li key={p.id}>
          <Link href={buildHref("time", params, { staffId: p.id })}>
            <Card className="hover:bg-muted">
              <CardContent className="py-3">
                <div className="font-medium">{p.name}</div>
                {p.specialty ? (
                  <div className="text-xs text-muted-foreground">{p.specialty}</div>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
      {providers.length === 0 ? (
        <Empty>No provider is assigned to this service yet.</Empty>
      ) : null}
    </ul>
  );
}

function nextDays(count: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    out.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return out;
}

export async function TimeStep({ params, sp }: { params: BookingParams; sp: Raw }) {
  if (!params.staffId || !params.serviceId) return <Empty>Pick a provider first.</Empty>;
  const service = await getService(params.serviceId);
  if (!service) return <Empty>Service not found.</Empty>;

  const days = nextDays(5);
  const dateISO = oneOf(sp.date) ?? days[0];
  const slots = await getAvailableSlots(params.staffId, service.duration_minutes, dateISO);
  const base = buildHref("time", params);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {days.map((d) => {
          const label = new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
          });
          const active = d === dateISO;
          return (
            <Link
              key={d}
              href={`${base}&date=${d}`}
              className={`rounded-[var(--radius)] px-3 py-2 text-sm ${
                active ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <Link
            key={slot.startISO}
            href={buildHref("review", params, { start: slot.startISO })}
            className="min-h-11 rounded-[var(--radius)] border border-border px-3 py-2 text-sm tabular-nums hover:bg-muted"
          >
            {slot.label}
          </Link>
        ))}
        {slots.length === 0 ? <Empty>No open times that day.</Empty> : null}
      </div>
    </div>
  );
}

export async function ReviewStep({ params, sp }: { params: BookingParams; sp: Raw }) {
  const { serviceId, staffId, start, addons } = params;
  if (!serviceId || !staffId || !start) return <Empty>Booking details incomplete.</Empty>;

  const [service, addonRows, staff, session] = await Promise.all([
    getService(serviceId),
    getServicesByIds(addons),
    getStaff(staffId),
    getSessionContext(),
  ]);
  if (!service) return <Empty>Service not found.</Empty>;

  const addonsTotal = addonRows.reduce((s, a) => s + a.price, 0);
  const subtotal = service.price + addonsTotal;

  let credit = 0;
  if (session.clientId) {
    const [policy, balance] = await Promise.all([
      getCreditPolicy(),
      getClientCreditBalance(session.clientId),
    ]);
    credit = maxCreditApplicable(balance, service.price, policy?.redemption_cap_pct ?? 0);
  }
  const error = oneOf(sp.error);
  const when = new Date(start).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <p className="rounded-[var(--radius)] border border-destructive p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Card>
        <CardContent className="flex flex-col gap-2 py-4 text-sm">
          <Row label={service.name} value={formatMoney(service.price)} />
          {addonRows.map((a) => (
            <Row key={a.id} label={`+ ${a.name}`} value={formatMoney(a.price)} muted />
          ))}
          <Row label={`${staff?.name ?? "Provider"} · ${when}`} value="" muted />
          <hr className="border-border" />
          <Row label="Subtotal" value={formatMoney(subtotal)} />
          {credit > 0 ? <Row label="Credit available" value={`−${formatMoney(credit)}`} muted /> : null}
        </CardContent>
      </Card>

      {session.clientId ? (
        <form action={bookAppointment} className="flex flex-col gap-3">
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="staffId" value={staffId} />
          <input type="hidden" name="startISO" value={start} />
          <input type="hidden" name="addonIds" value={addons.join(",")} />
          {credit > 0 ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="applyCredit" className="size-4" />
              Apply {formatMoney(credit)} credit
            </label>
          ) : null}
          <Button type="submit">Confirm booking</Button>
        </form>
      ) : (
        <Link href="/auth/dev">
          <Button className="w-full">Sign in to confirm</Button>
        </Link>
      )}
    </div>
  );
}

export async function ConfirmedStep({ sp }: { sp: Raw }) {
  const id = oneOf(sp.id);
  if (!id) return <Empty>No booking reference.</Empty>;
  const summary = await fetchAppointmentSummary(id);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge tone="success">booked</Badge>
        <span className="text-sm">Your appointment is confirmed.</span>
      </div>
      {summary ? (
        <Card>
          <CardContent className="flex flex-col gap-2 py-4 text-sm">
            <Row label={summary.service} value={summary.when} muted />
            <Row label="Amount due at the shop" value={formatMoney(summary.amountDue)} />
          </CardContent>
        </Card>
      ) : null}
      <div className="flex gap-2">
        <Link href="/account"><Button variant="secondary">My account</Button></Link>
        <Link href="/book"><Button variant="ghost">Book another</Button></Link>
      </div>
    </div>
  );
}

async function fetchAppointmentSummary(id: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointment")
    .select("amount_due, starts_at, service:service_id(name)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  return {
    service: (data.service as { name: string } | null)?.name ?? "Appointment",
    amountDue: data.amount_due,
    when: new Date(data.starts_at).toLocaleString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
