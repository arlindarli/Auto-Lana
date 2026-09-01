import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCars, getAvailability, isCarAvailable } from "../api/api";
import CarCard from "../components/CarCard";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const hasDateFilter = Boolean(startDate && endDate);

  // Set id → e disponueshme (true/false) për datat e zgjedhura aktualisht.
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCars()
      .then(setCars)
      .catch((err) => setError(err.message || "S'u arrit të ngarkohej flota."))
      .finally(() => setLoading(false));
  }, []);

  // Kur ka data të zgjedhura, kontrollo disponueshmërinë e çdo makine paralelisht
  // duke thirrur endpoint-in që backend-i tashmë ofron.
  useEffect(() => {
    if (!hasDateFilter || cars.length === 0) {
      setAvailabilityMap({});
      return;
    }
    let cancelled = false;
    setCheckingAvailability(true);

    Promise.all(
      cars.map((car) =>
        getAvailability(car.id, startDate, endDate)
          .then((res) => [car.id, isCarAvailable(res)])
          .catch(() => [car.id, true]) // nëse kontrolli dështon, mos e fshih makinën
      )
    ).then((entries) => {
      if (cancelled) return;
      setAvailabilityMap(Object.fromEntries(entries));
      setCheckingAvailability(false);
    });

    return () => {
      cancelled = true;
    };
  }, [hasDateFilter, startDate, endDate, cars]);

  const categories = useMemo(
    () => Array.from(new Set(cars.map((c) => c.category).filter(Boolean))),
    [cars]
  );

  const visibleCars = useMemo(() => {
    let list = cars.filter((c) => c.active !== false);
    if (category) list = list.filter((c) => c.category === category);
    if (hasDateFilter) list = list.filter((c) => availabilityMap[c.id] !== false);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.dailyPrice - b.dailyPrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.dailyPrice - a.dailyPrice);
    return list;
  }, [cars, category, sort, hasDateFilter, availabilityMap]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  function clearDates() {
    const next = new URLSearchParams(searchParams);
    next.delete("startDate");
    next.delete("endDate");
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-2 flex items-center gap-3">
        <span className="route-line w-10 text-highway" />
        <p className="text-sm font-semibold uppercase tracking-widest text-highway-dark">
          Flota jonë
        </p>
      </div>
      <h1 className="font-display text-4xl text-ink">Të gjitha makinat</h1>

      <div className="mt-8 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-steel">
          Marrja
          <input
            type="date"
            value={startDate}
            onChange={(e) => updateParam("startDate", e.target.value)}
            className="rounded-lg border border-mist-dim bg-mist-card px-3 py-2 text-sm text-ink outline-none focus:border-highway"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-steel">
          Kthimi
          <input
            type="date"
            value={endDate}
            onChange={(e) => updateParam("endDate", e.target.value)}
            className="rounded-lg border border-mist-dim bg-mist-card px-3 py-2 text-sm text-ink outline-none focus:border-highway"
          />
        </label>
        {hasDateFilter && (
          <button
            onClick={clearDates}
            className="rounded-lg px-2 py-2 text-xs font-semibold text-steel underline decoration-dotted hover:text-ink"
          >
            Hiq datat
          </button>
        )}

        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="rounded-lg border border-mist-dim bg-mist-card px-3 py-2 text-sm text-ink outline-none focus:border-highway"
        >
          <option value="">Të gjitha kategoritë</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-lg border border-mist-dim bg-mist-card px-3 py-2 text-sm text-ink outline-none focus:border-highway"
        >
          <option value="">Renditja</option>
          <option value="price-asc">Çmimi: i ulët → i lartë</option>
          <option value="price-desc">Çmimi: i lartë → i ulët</option>
        </select>

        <span className="ml-auto text-sm text-steel">
          {checkingAvailability
            ? "Duke kontrolluar disponueshmërinë…"
            : `${visibleCars.length} ${visibleCars.length === 1 ? "makinë" : "makina"}`}
        </span>
      </div>

      {hasDateFilter && (
        <p className="mt-3 text-xs text-steel">
          Duke shfaqur vetëm makinat e lira për {startDate} → {endDate}.
        </p>
      )}

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-mist-dim" />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : visibleCars.length === 0 ? (
          <p className="text-steel">
            {hasDateFilter
              ? "Asnjë makinë e lirë për këto data. Provo data të tjera."
              : "Nuk u gjet asnjë makinë me këto filtra."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
