import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCar, API_BASE_URL } from "../api/api";
import BookingForm from "../components/BookingForm";

function resolveImage(imageUrl) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads/")) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  return imageUrl;
}

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    getCar(id)
      .then(setCar)
      .catch((err) => setError(err.message || "Makina nuk u gjet."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="h-96 animate-pulse rounded-2xl bg-mist-dim" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Makina nuk u gjet</h1>
        <p className="mt-2 text-steel">{error || "Ky ID nuk ekziston."}</p>
        <Link to="/cars" className="mt-6 inline-block font-semibold text-highway-dark">
          ← Kthehu te flota
        </Link>
      </div>
    );
  }

  const galleryImages = [
  car.imageUrl,
  ...(car.imageUrls || []),
]
  .filter(Boolean)
  .filter((url, index, array) => array.indexOf(url) === index)
  .map(resolveImage);

const img = galleryImages[currentImageIndex] || null;

function previousImage() {
  setCurrentImageIndex((current) =>
    current === 0 ? galleryImages.length - 1 : current - 1
  );
}

function nextImage() {
  setCurrentImageIndex((current) =>
    current === galleryImages.length - 1 ? 0 : current + 1
  );
}

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link to="/cars" className="text-sm font-semibold text-highway-dark hover:text-highway">
        ← Kthehu te flota
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-[1.4fr_1fr]">
  <div>

<div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink-line">
  {img ? (
    <img
      src={img}
      alt={`${car.brand} ${car.model}`}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center font-display text-3xl text-mist/40">
      {car.brand} {car.model}
    </div>
  )}

  {galleryImages.length > 1 && (
    <>
      <button
        type="button"
        onClick={previousImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl font-bold shadow"
      >
        ←
      </button>

      <button
        type="button"
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl font-bold shadow"
      >
        →
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
        {currentImageIndex + 1} / {galleryImages.length}
      </div>
    </>
  )}
</div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {car.category && (
              <span className="rounded-full bg-highway/10 px-3 py-1 text-xs font-semibold text-highway-dark">
                {car.category}
              </span>
            )}
            <span className="rounded-full bg-mist-dim px-3 py-1 text-xs font-semibold text-steel">
              {car.year}
            </span>
            {car.active === false && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                Aktualisht jo aktive
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl text-ink">
            {car.brand} {car.model}
          </h1>

          {car.description && (
            <p className="mt-4 max-w-xl text-steel">{car.description}</p>
          )}

          <div className="route-line mt-8 text-mist-dim" />

          <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-widest text-steel">Marka</dt>
              <dd className="font-display text-lg text-ink">{car.brand}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-steel">Modeli</dt>
              <dd className="font-display text-lg text-ink">{car.model}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-steel">Viti</dt>
              <dd className="font-display text-lg text-ink">{car.year}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-steel">Kategoria</dt>
              <dd className="font-display text-lg text-ink">{car.category}</dd>
            </div>
          </dl>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <BookingForm carId={car.id} dailyPrice={car.dailyPrice} />
        </div>
      </div>
    </div>
  );
}
