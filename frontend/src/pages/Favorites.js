import { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    API.get("/api/favorites")
      .then((res) => {
        setFavorites(res.data || []);
      })
      .catch(() => {
        setError("Failed to load favorites.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading favorites...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Favorites</h2>
      <p className="text-slate-600 mb-5">Properties you have saved for quick access.</p>

      {favorites.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-500">
          No favorites found.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((f) => (
          <article key={f.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500">Favorite ID</p>
            <p className="font-semibold">{f.id}</p>
            <p className="text-sm text-slate-500 mt-2">Property ID</p>
            <p className="font-semibold">{f.propertyId}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
