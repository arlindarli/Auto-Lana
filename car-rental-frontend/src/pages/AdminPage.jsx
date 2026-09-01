import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getBookings,
} from "../api/api";

const emptyCar = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  category: "Economy",
  dailyPrice: "",
  description: "",
  imageUrl: "",
  imageUrls: [],
  active: true,
};

function CarForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || emptyCar);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial && initial.id);
  const allImages = [
  form.imageUrl,
  ...(form.imageUrls || []),
]
  .filter(Boolean)
  .filter((url, index, array) => array.indexOf(url) === index);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...form,
      year: Number(form.year),
      dailyPrice: Number(form.dailyPrice),
    };
    try {
      if (isEdit) {
        await updateCar(initial.id, payload);
      } else {
        await createCar(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || "Ruajtja dështoi.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl bg-mist-card p-6 ring-1 ring-mist-dim sm:grid-cols-2"
    >
      <h3 className="col-span-full font-display text-lg text-ink">
        {isEdit ? "Modifiko makinën" : "Shto makinë të re"}
      </h3>

      <label className="flex flex-col gap-1 text-sm text-steel">
        Marka
        <input
          required
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
          className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-steel">
        Modeli
        <input
          required
          value={form.model}
          onChange={(e) => update("model", e.target.value)}
          className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-steel">
        Viti
        <input
          required
          type="number"
          value={form.year}
          onChange={(e) => update("year", e.target.value)}
          className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-steel">
        Kategoria
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
        >
          <option value="Economy">Economy</option>
          <option value="SUV">SUV</option>
          <option value="Luxury">Luxury</option>
          <option value="Van">Van</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-steel">
        Çmimi/ditë (Lek)
        <input
          required
          type="number"
          min="0"
          value={form.dailyPrice}
          onChange={(e) => update("dailyPrice", e.target.value)}
          className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
        />
        </label>
      <label className="flex flex-col gap-1 text-sm text-steel">
  Foto e makinës

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={async (e) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  try {
    const token = localStorage.getItem("adminToken");
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "http://localhost:8080/api/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Gabim ${res.status}`);
      }

      const data = await res.json();
      uploadedUrls.push(data.imageUrl);
    }

  setForm((f) => ({
  ...f,
  imageUrl: uploadedUrls[0],
  imageUrls: uploadedUrls.slice(1),
}));
  } catch (err) {
    alert(err.message || "Fotot nuk u ngarkuan.");
  }
}}
    className="rounded-lg border border-mist-dim px-3 py-2 text-ink"
  />

  {allImages.length > 0 && (
  <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
    {allImages.map((url, index) => (
      <div
        key={url}
        className="relative overflow-hidden rounded-xl border border-mist-dim"
      >
        <img
          src={
            url.startsWith("/uploads/")
              ? `http://localhost:8080${url}`
              : url
          }
          alt={`Foto ${index + 1}`}
          className="h-28 w-full object-cover"
        />

        <button
          type="button"
          onClick={() =>
            setForm((f) => {
              const remaining = allImages.filter((_, i) => i !== index);

              return {
                ...f,
                imageUrl: remaining[0] || "",
                imageUrls: remaining.slice(1),
              };
            })
          }
          className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-red-600 shadow"
        >
          Hiq
        </button>

        <button
          type="button"
          onClick={() =>
            setForm((f) => ({
              ...f,
              imageUrl: url,
              imageUrls: allImages.filter((img) => img !== url),
            }))
          }
          className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-bold shadow"
        >
          Bëje kryesore
        </button>
      </div>
    ))}
  </div>
)}
</label>

      <label className="col-span-full flex flex-col gap-1 text-sm text-steel">
        Përshkrimi
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={2}
          className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-steel">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => update("active", e.target.checked)}
          className="h-4 w-4 accent-highway"
        />
        Aktive (e dukshme për klientët)
      </label>

      {error && <p className="col-span-full text-sm font-medium text-red-600">{error}</p>}

      <div className="col-span-full flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-amber px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-amber-dark disabled:opacity-50"
        >
          {saving ? "Duke ruajtur…" : isEdit ? "Ruaj ndryshimet" : "Shto makinën"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-mist-dim px-5 py-2.5 text-sm font-semibold text-steel transition hover:border-ink hover:text-ink"
        >
          Anulo
        </button>
      </div>
    </form>
  );
}

function CarsAdmin() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | 'new' | car
  const [deletingId, setDeletingId] = useState(null);

  function refresh() {
    setLoading(true);
    getCars()
      .then(setCars)
      .catch((err) => setError(err.message || "S'u ngarkua lista."))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Të fshihet kjo makinë?")) return;
    setDeletingId(id);
    try {
      await deleteCar(id);
      refresh();
    } catch (err) {
      alert(err.message || "Fshirja dështoi.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Makinat ({cars.length})</h2>
        {editing !== "new" && (
          <button
            onClick={() => setEditing("new")}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-mist transition hover:bg-ink-soft"
          >
            + Shto makinë
          </button>
        )}
      </div>

      {editing === "new" && (
        <div className="mb-8">
          <CarForm
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              refresh();
            }}
          />
        </div>
      )}

      {editing && editing !== "new" && (
        <div className="mb-8">
          <CarForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              refresh();
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-mist-dim" />
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl ring-1 ring-mist-dim">
          <table className="w-full min-w-[640px] border-collapse bg-mist-card text-sm">
            <thead>
              <tr className="border-b border-mist-dim text-left text-steel">
                <th className="px-4 py-3 font-medium">Makina</th>
                <th className="px-4 py-3 font-medium">Kategoria</th>
                <th className="px-4 py-3 font-medium">Viti</th>
                <th className="px-4 py-3 font-medium">Çmimi/ditë</th>
                <th className="px-4 py-3 font-medium">Statusi</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-mist-dim last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">
                    {car.brand} {car.model}
                  </td>
                  <td className="px-4 py-3 text-steel">{car.category}</td>
                  <td className="px-4 py-3 text-steel">{car.year}</td>
                  <td className="px-4 py-3 font-mono text-ink">{car.dailyPrice} Lek</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        car.active === false
                          ? "bg-red-50 text-red-600"
                          : "bg-highway/10 text-highway-dark"
                      }`}
                    >
                      {car.active === false ? "Jo aktive" : "Aktive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(car)}
                        className="rounded-lg border border-mist-dim px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink"
                      >
                        Modifiko
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        disabled={deletingId === car.id}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-400 disabled:opacity-50"
                      >
                        {deletingId === car.id ? "…" : "Fshi"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-steel">
                    Ende s'ka makina. Shto të parën më lart.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BookingsAdmin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");


    async function handleStatusChange(bookingId, status) {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(
      `http://localhost:8080/api/bookings/${bookingId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gabim ${res.status}`);
    }

    const updatedBooking = await res.json();

    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId ? updatedBooking : booking
      )
    );
  } catch (err) {
    setError(err.message || "Statusi nuk u ndryshua.");
  }
}
useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((err) => setError(err.message || "S'u ngarkuan rezervimet."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 animate-pulse rounded-2xl bg-mist-dim" />;
  if (error)
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;
  const filteredBookings =
  statusFilter === "ALL"
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
  <h2 className="font-display text-2xl text-ink">
    Rezervimet ({filteredBookings.length})
  </h2>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="rounded-lg border border-mist-dim px-3 py-2 text-sm text-ink"
  >
    <option value="ALL">Të gjitha</option>
    <option value="PENDING">Në pritje</option>
    <option value="CONFIRMED">Të konfirmuara</option>
    <option value="CANCELLED">Të anuluara</option>
  </select>
</div>
      <div className="overflow-x-auto rounded-2xl ring-1 ring-mist-dim">
        <table className="w-full min-w-[720px] border-collapse bg-mist-card text-sm">
          <thead>
            <tr className="border-b border-mist-dim text-left text-steel">
              <th className="px-4 py-3 font-medium">Klienti</th>
              <th className="px-4 py-3 font-medium">Kontakt</th>
              <th className="px-4 py-3 font-medium">Makina</th>
              <th className="px-4 py-3 font-medium">Marrja</th>
              <th className="px-4 py-3 font-medium">Kthimi</th>
              <th className="px-4 py-3 font-medium">Statusi</th>
              <th className="px-4 py-3 font-medium">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id} className="border-b border-mist-dim last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{b.customerName}</td>
                <td className="px-4 py-3 text-steel">
                  <div>{b.customerPhone}</div>
                  <div className="text-xs">{b.customerEmail}</div>
                </td>
                <td className="px-4 py-3 text-steel">
                  {b.car ? `${b.car.brand} ${b.car.model}` : b.carId ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-ink">{b.startDate}</td>
                <td className="px-4 py-3 font-mono text-ink">{b.endDate}</td>
               <td className="px-4 py-3">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      b.status === "CONFIRMED"
        ? "bg-green-100 text-green-700"
        : b.status === "CANCELLED"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {b.status === "CONFIRMED"
      ? "Konfirmuar"
      : b.status === "CANCELLED"
      ? "Anuluar"
      : "Në pritje"}
  </span>
</td>

<td className="px-4 py-3">
  {b.status === "PENDING" ? (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => handleStatusChange(b.id, "CONFIRMED")}
        className="rounded-lg border px-3 py-2 text-xs font-semibold"
      >
        Konfirmo
      </button>

      <button
        type="button"
        onClick={() => handleStatusChange(b.id, "CANCELLED")}
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
      >
        Anulo
      </button>
    </div>
  ) : (
    <span className="text-xs font-semibold">
      {b.status === "CONFIRMED" ? "Konfirmuar" : "Anuluar"}
    </span>
  )}
</td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-steel">
                  Ende s'ka rezervime.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("cars");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-2 flex items-center gap-3">
        <span className="route-line w-10 text-amber" />
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-dark">
          Paneli i administrimit
        </p>
      </div>
      <div className="flex items-center justify-between">
  <h1 className="font-display text-4xl text-ink">Admin</h1>

  <button
    type="button"
    onClick={handleLogout}
    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400"
  >
    Dil
  </button>
</div>

      <div className="mt-8 flex gap-2 border-b border-mist-dim">
        <button
          onClick={() => setTab("cars")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "cars"
              ? "border-b-2 border-ink text-ink"
              : "text-steel hover:text-ink"
          }`}
        >
          Makinat
        </button>
        <button
          onClick={() => setTab("bookings")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "bookings"
              ? "border-b-2 border-ink text-ink"
              : "text-steel hover:text-ink"
          }`}
        >
          Rezervimet
        </button>
      </div>

      <div className="mt-8">{tab === "cars" ? <CarsAdmin /> : <BookingsAdmin />}</div>
    </div>
  );
}
