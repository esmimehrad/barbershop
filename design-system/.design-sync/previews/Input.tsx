import { Input } from 'barbershop-design-system';

export const WithHint = () => (
  <div style={{ maxWidth: 320 }}>
    <Input
      id="phone"
      label="Phone number"
      type="tel"
      defaultValue="+1 (555) 019-2231"
      hint="We'll text your reminders here."
    />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 320 }}>
    <Input id="email" label="Email address" type="email" placeholder="you@example.com" />
  </div>
);
