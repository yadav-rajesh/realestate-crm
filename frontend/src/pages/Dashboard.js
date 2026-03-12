import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { getUserRole } from "../utils/auth";

export default function Dashboard() {
  const role = getUserRole();
  const [stats, setStats] = useState({});
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setRequestError("");

    Promise.allSettled([
      API.get("/api/dashboard"),
      API.get("/api/properties?page=0&size=100&sort=id,desc"),
      API.get("/api/contact-requests"),
    ])
      .then(([statsRes, propertiesRes, requestsRes]) => {
        let nextError = "";

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data || {});
        } else {
          nextError = "Failed to load dashboard stats.";
        }

        if (propertiesRes.status === "fulfilled") {
          setProperties(propertiesRes.value.data?.content || []);
        } else if (!nextError) {
          nextError = "Failed to load properties.";
        }

        if (requestsRes.status === "fulfilled") {
          setRequests(requestsRes.value.data || []);
        } else {
          setRequestError("Could not load requests right now.");
        }

        setError(nextError);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const recentProperties = useMemo(() => properties.slice(0, 6), [properties]);
  const recentRequests = useMemo(() => requests.slice(0, 6), [requests]);

  const inventoryStats = useMemo(() => {
    const available = properties.filter((p) => (p.status || "").toLowerCase() === "available").length;
    const sold = properties.filter((p) => (p.status || "").toLowerCase() === "sold").length;
    const residential = properties.filter(
      (p) => (p.type || "").toLowerCase() === "residential"
    ).length;
    const commercial = properties.filter((p) => (p.type || "").toLowerCase() === "commercial").length;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const newToday = requests.filter((r) => r.createdAt && new Date(r.createdAt) >= start).length;

    return {
      available,
      sold,
      residential,
      commercial,
      totalRequests: requests.length,
      newToday,
    };
  }, [properties, requests]);

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
        <p className="text-slate-600">Quick control panel for listings and requests.</p>
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
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Link
            to="/add-property"
            className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <p className="font-semibold">Add Property</p>
            <p className="text-sm text-slate-600 mt-1">Create a new listing.</p>
          </Link>

          <Link
            to="/requests"
            className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <p className="font-semibold">View Requests</p>
            <p className="text-sm text-slate-600 mt-1">Check incoming inquiries.</p>
          </Link>

          <Link
            to="/properties"
            className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <p className="font-semibold">Browse Listings</p>
            <p className="text-sm text-slate-600 mt-1">See all active properties.</p>
          </Link>

          {role === "ADMIN" && (
            <Link
              to="/admin/users"
              className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <p className="font-semibold">Manage Users</p>
              <p className="text-sm text-slate-600 mt-1">Review user accounts.</p>
            </Link>
          )}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Available</h3>
          <p className="text-2xl font-bold mt-2">{inventoryStats.available}</p>
        </div>
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Sold</h3>
          <p className="text-2xl font-bold mt-2">{inventoryStats.sold}</p>
        </div>
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Residential</h3>
          <p className="text-2xl font-bold mt-2">{inventoryStats.residential}</p>
        </div>
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Commercial</h3>
          <p className="text-2xl font-bold mt-2">{inventoryStats.commercial}</p>
        </div>
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">Total Requests</h3>
          <p className="text-2xl font-bold mt-2">{inventoryStats.totalRequests}</p>
        </div>
        <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-200">
          <h3 className="text-slate-500 text-sm">New Today</h3>
          <p className="text-2xl font-bold mt-2">{inventoryStats.newToday}</p>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-lg font-semibold mb-4">Recently Added</h3>
        {recentProperties.length === 0 && <p className="text-slate-500">No properties added yet.</p>}
        <div className="grid lg:grid-cols-2 gap-3">
          {recentProperties.map((property) => (
            <div key={property.id} className="border border-slate-200 rounded-lg p-3">
              <p className="font-semibold">{property.title}</p>
              <p className="text-sm text-slate-600">{property.location}</p>
              <p className="text-sm text-green-700 font-semibold mt-1">Rs. {property.price}</p>
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/property/${property.id}`}
                  className="text-sm px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50"
                >
                  View
                </Link>
                <Link
                  to={`/edit-property/${property.id}`}
                  className="text-sm px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold">Latest Contact Requests</h3>
          <Link to="/requests" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Open all
          </Link>
        </div>

        {requestError && <p className="text-sm text-amber-700 mb-3">{requestError}</p>}

        {recentRequests.length === 0 ? (
          <p className="text-slate-500">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left">Property</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      {request.propertyTitle || `#${request.propertyId || "-"}`}
                    </td>
                    <td className="px-3 py-2">{request.requesterName || "-"}</td>
                    <td className="px-3 py-2">{request.requesterPhone || "-"}</td>
                    <td className="px-3 py-2">
                      {request.createdAt ? new Date(request.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
