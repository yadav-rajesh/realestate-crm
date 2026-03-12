import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axiosConfig";
import PropertyCard from "../components/PropertyCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get("location") || "");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [error, setError] = useState("");

  const fetchProperties = useCallback(
    (targetPage = page) => {
      setLoading(true);
      setError("");

      const trimmedSearch = search.trim();
      const endpoint = trimmedSearch
        ? `/api/properties/search?location=${encodeURIComponent(trimmedSearch)}&page=${targetPage}&size=${pageSize}`
        : `/api/properties?page=${targetPage}&size=${pageSize}`;

      API.get(endpoint)
        .then((res) => {
          setProperties(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        })
        .catch(() => {
          setError(trimmedSearch ? "Search failed." : "Failed to load properties.");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [page, pageSize, search]
  );

  useEffect(() => {
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "ALL";
    const min = searchParams.get("min") || "";
    const max = searchParams.get("max") || "";
    const mode = searchParams.get("mode") || "";

    setSearch(location);
    setTypeFilter(type);
    setMinPrice(min);
    setMaxPrice(max);

    if (mode.toLowerCase() === "rent" && statusFilter === "ALL") {
      setStatusFilter("Available");
    }

    setPage(0);
  }, [searchParams, statusFilter]);

  useEffect(() => {
    fetchProperties(page);
  }, [fetchProperties, page, pageSize]);

  const searchProperties = () => {
    setPage(0);
    fetchProperties(0);
  };

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("latest");
    setPage(0);

    setLoading(true);
    setError("");

    API.get(`/api/properties?page=0&size=${pageSize}`)
      .then((res) => {
        setProperties(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      })
      .catch(() => {
        setError("Failed to load properties.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const visibleProperties = properties
    .filter((p) => {
      const matchType =
        typeFilter === "ALL" ||
        (p.type || "").toLowerCase() === typeFilter.toLowerCase();
      const matchStatus =
        statusFilter === "ALL" ||
        (p.status || "").toLowerCase() === statusFilter.toLowerCase();
      const price = Number(p.price || 0);
      const matchMin = minPrice === "" || price >= Number(minPrice);
      const matchMax = maxPrice === "" || price <= Number(maxPrice);

      return matchType && matchStatus && matchMin && matchMax;
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Properties</h2>
        <p className="text-slate-600">Browse and manage all listed properties.</p>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        <input
          placeholder="Search location"
          className="border border-slate-200 rounded-lg p-2.5 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-slate-200 rounded-lg p-2.5"
        >
          <option value="ALL">All Types</option>
          <option value="Flat">Flat</option>
          <option value="Residential">Residential</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg p-2.5"
        >
          <option value="ALL">All Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-slate-200 rounded-lg p-2.5"
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          className="border border-slate-200 rounded-lg p-2.5"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border border-slate-200 rounded-lg p-2.5"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button onClick={searchProperties} className="bg-blue-600 text-white px-4 rounded-lg">
          Search
        </button>

        <button onClick={resetFilters} className="border border-slate-300 px-4 rounded-lg">
          Reset
        </button>
      </div>

      {visibleProperties.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-500 mb-4">
          No properties match the selected filters.
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {visibleProperties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={(size) => {
          setPageSize(size);
          setPage(0);
        }}
      />
    </div>
  );
}
