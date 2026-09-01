import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function BookingCalendar({
  bookings = [],
  selectedRange,
  onSelectRange,
}) {
 const disabledRanges = bookings
  .filter((booking) => booking.status !== "CANCELLED")
  .map((booking) => ({
    from: parseDate(booking.startDate),
    to: parseDate(booking.endDate),
  }));
  const today = new Date();
today.setHours(0, 0, 0, 0);

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={onSelectRange}
      disabled={[
  { before: today },
  ...disabledRanges,
]}
      excludeDisabled
      showOutsideDays
      modifiersClassNames={{
        disabled: "booking-date-disabled",
      }}
    />
  );
}