import { Button } from 'barbershop-design-system';

export const Primary = () => <Button variant="primary">Confirm booking</Button>;

export const Secondary = () => <Button variant="secondary">Reschedule</Button>;

export const Ghost = () => <Button variant="ghost">View details</Button>;

export const Critical = () => <Button variant="critical">Cancel appointment</Button>;

export const Disabled = () => (
  <Button variant="primary" disabled>
    Disabled
  </Button>
);
