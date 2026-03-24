import { Link } from "react-router-dom";
import {
  formatPrice,
  getAreaLabel,
  getBhkLabel,
  getPropertyImageUrl,
} from "../utils/propertyPresentation";

export default function PropertyCard({ property }) {
  const imageUrl = getPropertyImageUrl(property);
  const isAvailable = (property?.status || "").toLowerCase() === "available";

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_48px_-24px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.38)]">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={property?.title || "Property"}
          loading="lazy"
          decoding="async"
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            Verified Listing
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
              isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-900/85 text-white"
            }`}
          >
            {property?.status || "Available"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-2xl font-black text-slate-900">{formatPrice(property?.price)}</p>
            <p className="mt-1 text-sm text-slate-500">{property?.location}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {property?.type || "Listing"}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-900">{property?.title}</h3>
        <p className="mt-2 h-12 overflow-hidden text-sm leading-6 text-slate-600">
          {property?.description || "Premium property listing curated by Nirmana."}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">BHK</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{getBhkLabel(property)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Area</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{getAreaLabel(property)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Listed By</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{property?.ownerName ? "Agent" : "Team"}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Consultant</p>
            <p className="truncate text-sm font-semibold text-slate-700">
              {property?.ownerName || "Nirmana Partner"}
            </p>
          </div>

          <Link
            to={`/property/${property.id}`}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
