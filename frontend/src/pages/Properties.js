import { useCallback, useEffect, useState } from "react";
import API from "../api/axiosConfig";
import PropertyCard from "../components/PropertyCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchProperties = useCallback(() => {
    setLoading(true);
    setError("");

    API.get(`/api/properties?page=${page}`)
      .then((res) => {
        setProperties(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch(() => {
        setError("Failed to load properties.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const searchProperties = () => {
    setLoading(true);
    setError("");
    const location = encodeURIComponent(search.trim());

    API.get(`/api/properties/search?location=${location}`)
      .then((res) => {
        setProperties(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch(() => {
        setError("Search failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Properties</h2>
        <p className="text-slate-600">Browse and manage all listed properties.</p>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex flex-col sm:flex-row gap-2">
        <input
          placeholder="Search location"
          className="border border-slate-200 rounded-lg p-2.5 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchProperties} className="bg-blue-600 text-white px-4 rounded-lg">
          Search
        </button>

        <button onClick={fetchProperties} className="border border-slate-300 px-4 rounded-lg">
          Reset
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
