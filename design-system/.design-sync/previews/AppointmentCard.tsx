import { AppointmentCard } from 'barbershop-design-system';

export const Booked = () => (
  <div style={{ maxWidth: 380 }}>
    <AppointmentCard
      service="Fade & Line-Up"
      provider="David"
      location="Chair 2"
      startLabel="Today, 2:30 PM – 3:00 PM"
      status="booked"
      amountDue={27.5}
    />
  </div>
);

export const CompletedNoBalance = () => (
  <div style={{ maxWidth: 380 }}>
    <AppointmentCard
      service="Lash Fill"
      provider="Ana"
      location="Room 1"
      startLabel="Today, 3:00 PM – 3:45 PM"
      status="completed"
    />
  </div>
);

export const Waitlisted = () => (
  <div style={{ maxWidth: 380 }}>
    <AppointmentCard
      service="Beard Trim (add-on)"
      provider="David"
      startLabel="Tomorrow, 1:00 PM – 1:20 PM"
      status="waitlisted"
      amountDue={12}
    />
  </div>
);
