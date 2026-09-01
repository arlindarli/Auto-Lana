// Një vend i vetëm për bazën e API-t.
// Kur backend-i të shkojë online, ndrysho VETËM këtë vlerë.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  },
});

  if (!res.ok) {
    let message = `Gabim ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch (_) {
      // pergjigje pa trup JSON, injoro
    }
    throw new Error(message);
  }

  // DELETE zakonisht kthen 204 No Content
  const text = await res.text();

if (!text) {
  return null;
}

return JSON.parse(text);
}

/* ---------- Cars ---------- */

export function getCars() {
  return request("/api/cars");
}

export function getCar(id) {
  return request(`/api/cars/${id}`);
}

export function createCar(car) {
  const token = localStorage.getItem("adminToken");

  return request("/api/cars", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(car),
  });
}

export function updateCar(id, car) {
  const token = localStorage.getItem("adminToken");

  return request(`/api/cars/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(car),
  });
}

export function deleteCar(id) {
  const token = localStorage.getItem("adminToken");

  return request(`/api/cars/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* ---------- Bookings ---------- */

export function getBookings() {
  return request("/api/bookings");
}

export function getBookingsForCar(carId) {
  return request(`/api/bookings/car/${carId}`);
}

export function createBooking(carId, booking) {
  return request(`/api/bookings/car/${carId}`, {
    method: "POST",
    body: JSON.stringify(booking),
  });
}

export function getAvailability(carId, startDate, endDate) {
  const params = new URLSearchParams({ startDate, endDate });
  return request(`/api/bookings/car/${carId}/availability?${params.toString()}`);
}

/* ---------- Helpers të përbashkëta (të lidhura me logjikën e backend-it) ---------- */

// Backend-i numëron TË DYJA ditët (15–18 gusht = 4 ditë), pra +1 mbi diferencën.
export function countRentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const diff = Math.round(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );
  return diff >= 0 ? diff + 1 : 0;
}

// Përgjigja e /availability mund të vijë si boolean, si { available }, ose si listë
// datash/rezervimesh të zëna. E trajtojmë në mënyrë fleksibël në një vend të vetëm.
export function isCarAvailable(res) {
  if (typeof res === "boolean") return res;
  if (res && typeof res === "object" && "available" in res) return Boolean(res.available);
  if (Array.isArray(res)) return res.length === 0;
  return true;
}
