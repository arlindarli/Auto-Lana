import { useEffect, useState } from "react";
import {
  getAvailability,
  createBooking,
  countRentalDays,
  isCarAvailable,
  getBookingsForCar
} from "../api/api";
import BookingCalendar from "./BookingCalendar";

const emptyForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  startDate: "",
  endDate: "",
};

export default function BookingForm({ carId, dailyPrice }) {
  const [form, setForm] = useState(emptyForm);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null); // null | true | false
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);


  useEffect(() => {
  getBookingsForCar(carId)
    .then((data) => {
      setBookings(data);
    })
    .catch((err) => {
      console.error("Failed to load bookings:", err);
    });
}, [carId]);

  // Backend-i numëron të dyja ditët (15–18 gusht = 4 ditë), jo diferencën e thjeshtë.
  const days = countRentalDays(form.startDate, form.endDate);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setAvailability(null);
    setSuccess(false);
  }

  async function handleCheckAvailability() {
    setError("");
    if (!form.startDate || !form.endDate) {
      setError("Zgjidh datën e marrjes dhe të kthimit.");
      return;
    }
    if (form.endDate < form.startDate) {
      setError("Data e kthimit s'mund të jetë para datës së marrjes.");
      return;
    }
    setChecking(true);
    try {
      const res = await getAvailability(carId, form.startDate, form.endDate);
      setAvailability(isCarAvailable(res));
    } catch (err) {
      setError(err.message || "Nuk u arrit të kontrollohej disponueshmëria.");
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.customerName || !form.customerPhone || !form.customerEmail) {
      setError("Plotëso emrin, telefonin dhe email-in.");
      return;
    }
    if (!form.startDate || !form.endDate || form.endDate < form.startDate) {
      setError("Kontrollo datat e rezervimit.");
      return;
    }
      const today = new Date().toISOString().split("T")[0];

if (form.startDate < today) {
  setError("Data e marrjes nuk mund të jetë në të kaluarën.");
  return;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(form.customerEmail)) {
  setError("Vendos një adresë email-i të vlefshme.");
  return;
}
    const phonePattern = /^[0-9+\s()-]{8,20}$/;

if (!phonePattern.test(form.customerPhone)) {
  setError("Vendos një numër telefoni të vlefshëm.");
  return;
}


    setSubmitting(true);
    try {
     const result = await createBooking(carId, form);

setConfirmedBooking(result);
setSuccess(true);
      setForm(emptyForm);
      setAvailability(null);
    } catch (err) {
      setError(err.message || "Rezervimi dështoi. Provo përsëri.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl bg-mist-card p-6 ring-1 ring-mist-dim"
    >
      <div className="flex items-baseline justify-between border-b border-mist-dim pb-4">
        <h3 className="font-display text-xl text-ink">Rezervo</h3>
        <div className="font-mono text-lg font-bold text-ink">
          {dailyPrice} <span className="text-sm font-normal text-steel">Lek/ditë</span>
        </div>
      </div>

<BookingCalendar
  bookings={bookings}
  selectedRange={{
    from: form.startDate
      ? new Date(form.startDate + "T00:00:00")
      : undefined,
    to: form.endDate
      ? new Date(form.endDate + "T00:00:00")
      : undefined,
  }}
  onSelectRange={(range) => {
    if (!range) return;

    const formatDate = (date) => {
      if (!date) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    setForm((current) => ({
      ...current,
      startDate: formatDate(range.from),
      endDate: formatDate(range.to),
    }));

    setAvailability(null);
    setSuccess(false);
  }}
/>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-steel">
          Marrja
          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-steel">
          Kthimi
          <input
            type="date"
            required
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
          />
        </label>
      </div>

      {days > 0 && (
        <p className="text-sm text-steel">
          {days} ditë · total{" "}
          <span className="font-mono font-semibold text-ink">{days * dailyPrice} Lek</span>
        </p>
      )}

      {availability === true && (
        <p className="rounded-lg bg-highway/10 px-3 py-2 text-sm font-medium text-highway-dark">
          E lirë për këto data.
        </p>
      )}
      {availability === false && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          E zënë për këto data. Provo data të tjera.
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-mist-dim pt-4">
        <label className="flex flex-col gap-1 text-sm text-steel">
          Emri i plotë
          <input
            required
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            placeholder="p.sh. Arlind Krasniqi"
            className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-steel">
          Telefoni
          <input
            required
            value={form.customerPhone}
            onChange={(e) => update("customerPhone", e.target.value)}
            placeholder="+355 6X XXX XXXX"
            className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-steel">
          Email
          <input
            type="email"
            required
            value={form.customerEmail}
            onChange={(e) => update("customerEmail", e.target.value)}
            placeholder="ti@example.com"
            className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
          />
        </label>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      {success && confirmedBooking && (
  <div className="rounded-lg bg-highway/10 px-3 py-3 text-sm text-highway-dark">
    <p className="font-bold">Rezervimi u krye me sukses!</p>
    <p>Emri: {confirmedBooking.customerName}</p>
    <p>Marrja: {confirmedBooking.startDate}</p>
    <p>Kthimi: {confirmedBooking.endDate}</p>
    <p>Totali: {confirmedBooking.totalPrice} Lek</p>
  </div>
)}

     {!success ? (
  <button
    type="submit"
    disabled={submitting}
    className="rounded-full bg-amber px-4 py-3 text-sm font-bold text-ink transition hover:bg-amber-dark disabled:opacity-50"
  >
    {submitting ? "Duke dërguar..." : "Konfirmo rezervimin"}
  </button>
) : (
  <button
    type="button"
    onClick={() => {
      setSuccess(false);
      setConfirmedBooking(null);
      setAvailability(null);
      setForm(emptyForm);
    }}
    className="rounded-full bg-amber px-4 py-3 text-sm font-bold text-ink transition hover:bg-amber-dark"
  >
    Bëj një rezervim tjetër
  </button>
)}
    </form>
  );
}
