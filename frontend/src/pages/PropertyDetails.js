import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import { isAuthenticated } from "../utils/auth";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loggedIn = isAuthenticated();
  const [reqName, setReqName] = useState(localStorage.getItem("username") || "");
  const [reqPhone, setReqPhone] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    API.get(`/api/properties/${id}`)
      .then((res) => {
        if (!active) {
          return;
        }

        setProperty(res.data || null);
      })
      .catch(() => {
        if (active) {
          setProperty(null);
          setError("Property not found.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let objectUrl = "";
    const imageName = property?.images?.[0]?.imageUrl;

    if (!imageName) {
      setImageSrc("");
      return undefined;
    }

    API.get(`/uploads/${imageName}`, { responseType: "blob" })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setImageSrc(objectUrl);
      })
      .catch(() => {
        setImageSrc("");
      });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [property]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error && !property) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!property) {
    return <div className="p-6">Property not found.</div>;
  }

  const sendRequest = () => {
    if (!reqName.trim() || !reqPhone.trim()) {
      setRequestStatus("Name and phone are required.");
      return;
    }

    setSending(true);
    setRequestStatus("");

    API.post("/api/contact-requests", {
      propertyId: property.id,
      name: reqName.trim(),
      phone: reqPhone.trim(),
      message: reqMessage.trim(),
    })
      .then(() => {
        setRequestStatus("Request submitted successfully.");
        setReqMessage("");
      })
      .catch((err) => {
        setRequestStatus(err?.response?.data?.message || "Failed to submit request.");
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={property.title || "Property"}
          className="h-80 w-full object-cover"
        />
      ) : (
        <div className="h-80 w-full bg-gray-200" />
      )}

      <div className="p-6">
        <h2 className="text-3xl font-bold">{property.title}</h2>

        <p className="text-slate-600 mt-1">{property.location}</p>

        <p className="mt-4 text-slate-700 leading-7">{property.description}</p>

        <p className="text-green-700 text-2xl font-bold mt-6">Rs. {property.price}</p>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
          {loggedIn ? (
            <div>
              <div className="space-y-1 text-slate-700 mb-4">
                <p>Owner: {property.ownerName || "Not available"}</p>
                <p>Phone: {property.phone || "Not available"}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold mb-3">Request Callback</h4>
                {requestStatus && <p className="text-sm mb-2 text-slate-700">{requestStatus}</p>}
                <input
                  className="border border-slate-200 rounded-lg p-2.5 w-full mb-2"
                  placeholder="Your name"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                />
                <input
                  className="border border-slate-200 rounded-lg p-2.5 w-full mb-2"
                  placeholder="Phone number"
                  value={reqPhone}
                  onChange={(e) => setReqPhone(e.target.value)}
                />
                <textarea
                  className="border border-slate-200 rounded-lg p-2.5 w-full mb-3 min-h-24"
                  placeholder="Message (optional)"
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                />
                <button
                  onClick={sendRequest}
                  disabled={sending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                >
                  {sending ? "Submitting..." : "Request Callback"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-600">
              Please{" "}
              <Link to="/login" className="text-blue-600 font-semibold">
                login
              </Link>{" "}
              to view contact details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
