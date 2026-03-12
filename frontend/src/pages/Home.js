import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("Buy");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("ALL");
  const [budget, setBudget] = useState("ALL");
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({});
  const popularCities = ["Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad", "Chennai"];

  useEffect(() => {
    Promise.all([API.get("/api/properties?page=0&size=3"), API.get("/api/dashboard")])
      .then(([propertiesRes, statsRes]) => {
        setFeatured(propertiesRes.data?.content || []);
        setStats(statsRes.data || {});
      })
      .catch(() => {
        setFeatured([]);
        setStats({});
      });
  }, []);

  const searchProperties = () => {
    const params = new URLSearchParams();
    if (location.trim()) {
      params.set("location", location.trim());
    }
    if (type !== "ALL") {
      params.set("type", type);
    }
    if (budget !== "ALL") {
      if (budget === "LOW") {
        params.set("max", "10000000");
      } else if (budget === "MID") {
        params.set("min", "10000000");
        params.set("max", "30000000");
      } else if (budget === "HIGH") {
        params.set("min", "30000000");
      }
    }
    params.set("mode", mode);

    const query = params.toString();
    navigate(query ? `/properties?${query}` : "/properties");
  };

  const openCity = (city) => {
    navigate(`/properties?location=${encodeURIComponent(city)}`);
  };

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-blue-700 via-cyan-700 to-emerald-700 rounded-2xl p-6 md:p-10 text-white">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-100 font-semibold">
          Property Marketplace
        </p>
        <h1 className="text-3xl md:text-5xl font-black mt-3 max-w-3xl">
          Buy, Sell, and Rent Properties With Confidence
        </h1>
        <p className="text-blue-50 mt-3 max-w-2xl">
          Public browsing is open for everyone. Login only when you need actions like favorites,
          requests, and profile access.
        </p>

        <div className="mt-6 flex items-center gap-2">
          {["Buy", "Rent"].map((opt) => (
            <button
              key={opt}
              onClick={() => setMode(opt)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                mode === opt
                  ? "bg-white text-slate-900 border-white"
                  : "bg-transparent text-white border-white/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-xl p-3 grid md:grid-cols-4 gap-2">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search by city or location"
            className="border border-slate-200 text-slate-900 rounded-lg px-3 py-2.5"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-slate-200 text-slate-900 rounded-lg px-3 py-2.5"
          >
            <option value="ALL">All Types</option>
            <option value="Flat">Flat</option>
            <option value="Residential">House</option>
            <option value="Villa">Villa</option>
            <option value="Commercial">Commercial</option>
          </select>

          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border border-slate-200 text-slate-900 rounded-lg px-3 py-2.5"
          >
            <option value="ALL">All Budgets</option>
            <option value="LOW">Up to 1 Cr</option>
            <option value="MID">1 Cr - 3 Cr</option>
            <option value="HIGH">Above 3 Cr</option>
          </select>

          <button
            onClick={searchProperties}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 py-2.5 font-semibold"
          >
            Search
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Popular Cities</h2>
          <Link to="/properties" className="text-blue-600 font-semibold">
            Explore all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => openCity(city)}
              className="bg-white border border-slate-200 rounded-full px-4 py-2 text-sm hover:border-blue-600 hover:text-blue-700"
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <article className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Total Properties</p>
          <p className="text-2xl font-bold mt-1">{stats.totalProperties ?? 0}</p>
        </article>
        <article className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Average Price</p>
          <p className="text-2xl font-bold mt-1">Rs. {Math.round(stats.averagePrice || 0)}</p>
        </article>
        <article className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Locations</p>
          <p className="text-2xl font-bold mt-1">{stats.totalLocations ?? 0}</p>
        </article>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <Link to="/properties" className="text-blue-600 font-semibold">
            View all properties
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {featured.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-500">
            No featured properties yet.
          </div>
        )}
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Need help finding a property?</h3>
          <p className="text-slate-600 mt-1">
            Browse listings freely and login only when you want to contact owners or save favorites.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/properties"
            className="border border-slate-300 text-slate-800 rounded-lg px-4 py-2 font-semibold"
          >
            Browse Properties
          </Link>
          <Link to="/login" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold">
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}
