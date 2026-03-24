import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { getUserRole } from "../utils/auth";
import {
  formatPrice,
  getAreaLabel,
  getBhkLabel,
  getPropertyImageUrl,
} from "../utils/propertyPresentation";

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
      API.get("/api/properties?page=0&size=100"),
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

  const recentProperties = useMemo(() => properties.slice(0, 5), [properties]);
  const recentRequests = useMemo(() => requests.slice(0, 5), [requests]);

  const inventoryStats = useMemo(() => {
    const available = properties.filter((property) => (property.status || "").toLowerCase() === "available").length;
    const sold = properties.filter((property) => (property.status || "").toLowerCase() === "sold").length;
    const commercial = properties.filter((property) => (property.type || "").toLowerCase() === "commercial").length;
    const residential = properties.length - commercial;
    const views = properties.reduce((total, property) => total + Number(property.views || 0), 0);

    return {
      available,
      sold,
      commercial,
      residential,
      inquiries: requests.length,
      views: stats.totalViews ?? views,
      locations: stats.totalLocations ?? 0,
    };
  }, [properties, requests, stats]);

  if (loading) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-slate-900 px-6 py-8 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.56)] md:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">{role} Workspace</p>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">Premium operations dashboard</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">
              Manage listings, review lead requests, and move inventory through a cleaner,
              more presentation-ready control center.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Total Properties</p>
              <p className="mt-2 text-3xl font-black">{stats.totalProperties ?? 0}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Average Price</p>
              <p className="mt-2 text-3xl font-black">{formatPrice(stats.averagePrice || 0)}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Open Inquiries</p>
              <p className="mt-2 text-3xl font-black">{inventoryStats.inquiries}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Total Views</p>
              <p className="mt-2 text-3xl font-black">{inventoryStats.views}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Quick Actions</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Move faster</h2>

          <div className="mt-5 grid gap-3">
            <Link
              to="/add-property"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Add Property
            </Link>
            <Link
              to="/requests"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Review Requests
            </Link>
            <Link
              to="/properties"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Browse Listings
            </Link>
            {role === "ADMIN" && (
              <Link
                to="/admin/users"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Manage Users
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Available</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{inventoryStats.available}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Sold</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{inventoryStats.sold}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Residential</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{inventoryStats.residential}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Commercial</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{inventoryStats.commercial}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Lead Requests</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{inventoryStats.inquiries}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Locations</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{inventoryStats.locations}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Recent Listings</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Presentation-ready inventory</h2>
            </div>
            <Link to="/properties" className="text-sm font-semibold text-blue-700">
              View all
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            {recentProperties.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                No recent properties available.
              </div>
            ) : (
              recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="grid gap-4 rounded-[24px] border border-slate-200 p-4 md:grid-cols-[150px_minmax(0,1fr)]"
                >
                  <img
                    src={getPropertyImageUrl(property)}
                    alt={property.title}
                    className="h-32 w-full rounded-2xl object-cover"
                  />
                  <div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{property.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{property.location}</p>
                      </div>
                      <p className="text-xl font-black text-slate-900">{formatPrice(property.price)}</p>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                        {getBhkLabel(property)}
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                        {getAreaLabel(property)}
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                        {property.type}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{property.views ?? 0} views</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{property.inquiryCount ?? 0} inquiries</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to={`/property/${property.id}`}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit-property/${property.id}`}
                        className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Latest Inquiries</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Lead pipeline</h2>
              </div>
              <Link to="/requests" className="text-sm font-semibold text-blue-700">
                Open all
              </Link>
            </div>

            {requestError && <p className="mt-4 text-sm text-amber-700">{requestError}</p>}

            <div className="mt-5 space-y-3">
              {recentRequests.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  No inquiries captured yet.
                </div>
              ) : (
                recentRequests.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-semibold text-slate-900">{request.requesterName || "Lead"}</p>
                    <p className="mt-1 text-sm text-slate-500">{request.propertyTitle || `Property #${request.propertyId}`}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600">
                      <span>{request.requesterPhone || "No phone"}</span>
                      <span>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">UI Upgrade Notes</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Cleaner cards and premium spacing improve internal usability.</div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Recent listings now feel aligned with the public storefront.</div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Lead requests are surfaced more clearly for faster response.</div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}


