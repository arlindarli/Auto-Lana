import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/api";

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

export default function CarCard({ car }) {
  const img = resolveImage(car.imageUrl);

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-mist-card ring-1 ring-mist-dim transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-line">
        {img ? (
          <img
            src={img}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-mist/40">
            {car.brand}
          </div>
        )}
        {car.category && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-mist backdrop-blur">
            {car.category}
          </span>
        )}
        {car.active === false && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold text-white">
            Jo aktive
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight text-ink">
            {car.brand} {car.model}
          </h3>
          <span className="shrink-0 text-sm text-steel">{car.year}</span>
        </div>

        {car.description && (
          <p className="line-clamp-2 text-sm text-steel">{car.description}</p>
        )}

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="font-mono">
            <span className="text-lg font-bold text-ink">{car.dailyPrice}</span>
            <span className="text-sm text-steel"> Lek/ditë</span>
          </div>
          <span className="text-sm font-semibold text-highway-dark group-hover:text-highway">
            Shiko detajet →
          </span>
        </div>
      </div>
    </Link>
  );
}
