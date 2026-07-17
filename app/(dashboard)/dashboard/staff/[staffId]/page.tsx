import { notFound, redirect } from "next/navigation";
import { StaffDashboard } from "@/features/schedule/ProviderColumns";
import { getSessionContext } from "@/lib/auth";
import { listTodayAppointments } from "@/lib/data/appointments";
import { listActiveStaffWithContact } from "@/lib/data/staff";

export default async function StaffDashboardPage({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const session = await getSessionContext();
  if (session.accessLevel !== "owner") redirect("/dashboard");

  const { staffId } = await params;
  const [staff, appointments] = await Promise.all([
    listActiveStaffWithContact(),
    listTodayAppointments(),
  ]);
  const member = staff.find((item) => item.id === staffId);
  if (!member) notFound();

  return (
    <StaffDashboard
      member={member}
      appointments={appointments.filter((appointment) => appointment.staff_id === member.id)}
    />
  );
}
