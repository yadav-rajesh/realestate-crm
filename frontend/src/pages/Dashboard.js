import { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([API.get("/api/dashboard"), API.get("/api/properties?page=0&size=4")])
      .then(([statsRes, propertiesRes]) => {
        setStats(statsRes.data || {});
        setRecentProperties(propertiesRes.data?.content || []);
      })
      .catch(() => {
        setError("Failed to load dashboard stats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-slate-600">Overview of your current inventory.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Total Properties</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalProperties ?? 0}</p>
        </div>

        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Average Price</h3>
          <p className="text-3xl font-bold mt-2">Rs. {Math.round(stats.averagePrice || 0)}</p>
        </div>

        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Locations</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalLocations ?? 0}</p>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-lg font-semibold mb-4">Recently Added</h3>
        {recentProperties.length === 0 && <p className="text-slate-500">No properties added yet.</p>}
        <div className="grid lg:grid-cols-2 gap-3">
          {recentProperties.map((property) => (
            <div key={property.id} className="border border-slate-200 rounded-lg p-3">
              <p className="font-semibold">{property.title}</p>
              <p className="text-sm text-slate-600">{property.location}</p>
              <p className="text-sm text-green-700 font-semibold mt-1">Rs. {property.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
