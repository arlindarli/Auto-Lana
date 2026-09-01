import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../api/api";
import CarCard from "../components/CarCard";

const steps = [
  {
    n: "Nisja",
    title: "Zgjidh makinën",
    text: "Shfleto flotën, filtro sipas kategorisë dhe krahaso çmimet për ditë.",
  },
  {
    n: "Rruga",
    title: "Kontrollo datat",
    text: "Vendos datën e marrjes dhe kthimit — kontrollojmë disponueshmërinë në kohë reale.",
  },
  {
    n: "Mbërritja",
    title: "Konfirmo rezervimin",
    text: "Lër të dhënat e kontaktit dhe makina të pret gati, pa surpriza.",
  },
];

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCars()
      .then((data) => setCars(data.filter((c) => c.active !== false).slice(0, 6)))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    navigate(`/cars?${params.toString()}`);
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-mist">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-amber">
              <span className="route-line w-10 text-amber" />
              Qera makinash, Shqipëri
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Nis udhëtimin,
              <br />
              <span className="text-amber">jo pritjen.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-mist/70">
              Zgjidh makinën, cakto datat, konfirmo — pa telefonata të pafundme,
              pa letra. Flota gati kudo që të shkosh.
            </p>
          </div>

          <div className="relative">
            <div className="route-line-v absolute -left-6 top-0 hidden h-full text-amber/30 md:block" />
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-4 rounded-2xl bg-mist-card p-6 text-ink shadow-2xl shadow-black/30"
            >
              <h2 className="font-display text-lg">Gjej makinën tënde</h2>

              <label className="flex flex-col gap-1 text-sm text-steel">
                Kategoria
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
                >
                  <option value="">Të gjitha</option>
                  <option value="Economy">Economy</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Van">Van</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm text-steel">
                  Marrja
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-steel">
                  Kthimi
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="rounded-full bg-amber px-4 py-3 text-sm font-bold text-ink transition hover:bg-amber-dark"
              >
                Kërko makina
              </button>
            </form>
          </div>
        </div>
        <div className="route-line w-full text-mist/10" />
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl text-ink">Si funksionon</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative pl-2">
              <p className="font-mono text-xs uppercase tracking-widest text-highway-dark">
                {step.n}
              </p>
              <h3 className="mt-2 font-display text-xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-steel">{step.text}</p>
              {i < steps.length - 1 && (
                <div className="route-line mt-6 hidden text-mist-dim md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">Makina të zgjedhura</h2>
          <a href="/cars" className="text-sm font-semibold text-highway-dark hover:text-highway">
            Shiko të gjitha →
          </a>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-mist-dim" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <p className="text-steel">Ende s'ka makina të shtuara.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-24">
  <div className="grid gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2">
    <div>
      <h2 className="font-display text-3xl text-ink">
        Na kontaktoni
      </h2>

      <p className="mt-4 text-steel">
        Për rezervime ose informacione të tjera, na kontaktoni direkt.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-ink">Telefon</p>
          <a
            href="tel:+355683760977"
            className="text-highway-dark hover:text-highway"
          >
            +355 68 376 0977
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Adresa</p>
          <p className="text-steel">
            Rruga Muhammet Deliu, Fresk, Tiranë
          </p>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Rruga+Muhammet+Deliu+Fresk+Tirane"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink-soft"
        >
          Hap në Google Maps
        </a>
        <a
  href="https://wa.me/355683760977"
  target="_blank"
  rel="noreferrer"
  className="ml-3 inline-block rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink-soft"
>
  WhatsApp
</a>
      </div>
    </div>

    <div className="overflow-hidden rounded-xl">
      <iframe
        title="Auto Lana Location"
        src="https://www.google.com/maps?q=Rruga+Muhammet+Deliu,+Fresk,+Tirane&output=embed"
        width="100%"
        height="320"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>
    </div>
  );
}
