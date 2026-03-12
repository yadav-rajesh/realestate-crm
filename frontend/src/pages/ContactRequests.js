import { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function ContactRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    API.get("/api/contact-requests")
      .then((res) => {
        setRequests(res.data || []);
      })
      .catch(() => {
        setError("Failed to load contact requests.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading requests...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Contact Requests</h2>
      <p className="text-slate-600 mb-5">People who requested callbacks for properties.</p>

      {requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-500">
          No contact requests yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Property</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      {req.propertyTitle || `#${req.propertyId}`}
                    </p>
                    <p className="text-xs text-slate-500">{req.propertyLocation || "-"}</p>
                  </td>
                  <td className="px-4 py-3">{req.requesterName}</td>
                  <td className="px-4 py-3">{req.requesterPhone}</td>
                  <td className="px-4 py-3">{req.message || "-"}</td>
                  <td className="px-4 py-3">
                    {req.createdAt ? new Date(req.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
