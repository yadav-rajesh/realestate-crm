import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axiosConfig";
import PropertyCard from "../components/PropertyCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { getBhkLabel } from "../utils/propertyPresentation";

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [allProperties, setAllProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("location") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bhkFilter, setBhkFilter] = useState("ALL");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [sortBy, setSortBy] = useState("latest");
  const [modeFilter, setModeFilter] = useState((searchParams.get("mode") || "buy").toUpperCase());

  useEffect(() => {
    setLoading(true);
    setError("");

    API.get("/api/properties?page=0&size=100")
      .then((res) => {
        setAllProperties(res.data?.content || []);
      })
      .catch(() => {
        setError("Failed to load properties.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const nextLocation = searchParams.get("location") || "";
    const nextType = searchParams.get("type") || "ALL";
    const nextMin = searchParams.get("min") || "";
    const nextMax = searchParams.get("max") || "";
    const nextMode = (searchParams.get("mode") || "buy").toUpperCase();
    const nextStatus = nextMode === "RENT" ? "Available" : "ALL";

    setSearch(nextLocation);
    setTypeFilter(nextType);
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    setModeFilter(nextMode);
    setStatusFilter(nextStatus);
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    setPage(0);
  }, [search, typeFilter, statusFilter, bhkFilter, minPrice, maxPrice, sortBy, modeFilter]);

  const filteredProperties = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return allProperties
      .filter((property) => {
        const lookupText = `${property.title || ""} ${property.location || ""} ${property.description || ""}`.toLowerCase();
        const propertyType = (property.type || "").toLowerCase();
        const propertyStatus = (property.status || "").toLowerCase();
        const price = Number(property.price || 0);
        const propertyBhk = getBhkLabel(property);

        const matchesSearch = !searchText || lookupText.includes(searchText);
        const matchesType = typeFilter === "ALL" || propertyType === typeFilter.toLowerCase();
        const matchesStatus = statusFilter === "ALL" || propertyStatus === statusFilter.toLowerCase();
        const matchesMin = minPrice === "" || price >= Number(minPrice);
        const matchesMax = maxPrice === "" || price <= Number(maxPrice);
        const matchesBhk = bhkFilter === "ALL" || propertyBhk.startsWith(String(bhkFilter));
        const matchesMode =
          modeFilter === "COMMERCIAL"
            ? propertyType === "commercial"
            : modeFilter === "RENT"
            ? propertyType !== "commercial" && propertyStatus === "available"
            : propertyType !== "commercial";

        return (
          matchesSearch &&
          matchesType &&
          matchesStatus &&
          matchesMin &&
          matchesMax &&
          matchesBhk &&
          matchesMode
        );
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") {
          return Number(a.price || 0) - Number(b.price || 0);
        }

        if (sortBy === "price_desc") {
          return Number(b.price || 0) - Number(a.price || 0);
        }

        return Number(b.id || 0) - Number(a.id || 0);
      });
  }, [allProperties, search, typeFilter, statusFilter, bhkFilter, minPrice, maxPrice, sortBy, modeFilter]);

  const totalPages = filteredProperties.length ? Math.ceil(filteredProperties.length / pageSize) : 0;
  const currentPageProperties = filteredProperties.slice(page * pageSize, page * pageSize + pageSize);

  useEffect(() => {
    if (page > 0 && page >= totalPages) {
      setPage(0);
    }
  }, [page, totalPages]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setBhkFilter("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("latest");
    setModeFilter("BUY");
    setPage(0);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-slate-900 px-6 py-8 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.52)] md:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
              Premium Listing Search
            </p>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">Compare listings with confidence</h1>
            <p className="mt-3 text-base leading-7 text-blue-50 md:text-lg">
              Explore a cleaner real-estate search experience with better cards, clearer filters,
              and inquiry-ready detail pages.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Inventory</p>
              <p className="mt-2 text-3xl font-black">{allProperties.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Available</p>
              <p className="mt-2 text-3xl font-black">
                {allProperties.filter((property) => (property.status || "").toLowerCase() === "available").length}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Commercial</p>
              <p className="mt-2 text-3xl font-black">
                {allProperties.filter((property) => (property.type || "").toLowerCase() === "commercial").length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Filters</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Refine search</h2>
              </div>
              <button
                onClick={resetFilters}
                className="text-sm font-semibold text-blue-700"
              >
                Reset
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "BUY", label: "Buy" },
                    { key: "RENT", label: "Rent" },
                    { key: "COMMERCIAL", label: "Commercial" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setModeFilter(item.key)}
                      className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                        modeFilter === item.key
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="City or locality"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Property Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="ALL">All types</option>
                  <option value="Flat">Flat</option>
                  <option value="Residential">Residential</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">BHK</label>
                <select
                  value={bhkFilter}
                  onChange={(e) => setBhkFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="ALL">All BHK options</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK+</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Listing Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="ALL">All status</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Price Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => setPage(0)}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Search Results</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {filteredProperties.length} properties matching your filters
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use the sidebar to compare price, BHK, type, and listing intent with a more platform-like search flow.
                </p>
              </div>

              <div className="w-full lg:w-64">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {currentPageProperties.length === 0 ? (
            <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              No properties match the selected filters. Try widening the budget or changing the location.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {currentPageProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={filteredProperties.length}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}
