import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axiosConfig";
import { isAuthenticated } from "../utils/auth";
import {
  formatFullPrice,
  getAmenities,
  getAreaLabel,
  getBhkLabel,
  getCallUrl,
  getMapEmbedUrl,
  getMapSearchUrl,
  getPropertyImageUrl,
  getWhatsAppUrl,
} from "../utils/propertyPresentation";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
        setSelectedImageIndex(0);
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

  const galleryImages = property?.images?.length ? property.images : [{ id: "fallback", imageUrl: "" }];
  const activeImageUrl = property ? getPropertyImageUrl(property, selectedImageIndex) : "/nirmana-logo.jpg";
  const amenities = useMemo(() => getAmenities(property), [property]);
  const callUrl = property ? getCallUrl(property) : "";
  const whatsappUrl = property ? getWhatsAppUrl(property) : "";
  const mapsUrl = property ? getMapSearchUrl(property) : "#";
  const mapEmbedUrl = property ? getMapEmbedUrl(property) : "";

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

  const scheduleVisit = () => {
    if (!property) {
      return;
    }

    setReqMessage(`I would like to schedule a site visit for ${property.title}. Please share an available time.`);
    const panel = document.getElementById("contact-request-panel");
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">Loading property details...</div>;
  }

  if (error && !property) {
    return <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>;
  }

  if (!property) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">Property not found.</div>;
  }

  const requestStatusClass = requestStatus.toLowerCase().includes("success")
    ? "text-emerald-600"
    : "text-rose-600";

  return (
    <div className="space-y-6 pb-24 xl:pb-0">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/properties" className="font-semibold text-blue-700">
          Properties
        </Link>
        <span>/</span>
        <span>{property.title}</span>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_380px]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Verified Listing
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {property.type}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {property.status}
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-black text-slate-900 md:text-5xl">{property.title}</h1>
                <p className="mt-3 text-base text-slate-500 md:text-lg">{property.location}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Premium presentation for a high-intent property inquiry journey. Compare details,
                  review amenities, and connect with the listing contact from one page.
                </p>
              </div>

              <div className="rounded-[28px] bg-slate-900 px-5 py-4 text-white shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Listed Price</p>
                <p className="mt-2 text-3xl font-black">{formatFullPrice(property.price)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">BHK</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{getBhkLabel(property)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Approx. Area</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{getAreaLabel(property)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Listed By</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{property.ownerName || "Nirmana Partner"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Status</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{property.status}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="relative">
              <img
                src={activeImageUrl}
                alt={property.title}
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent px-6 py-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Premium Detail View</p>
                <p className="mt-2 text-2xl font-black">{property.title}</p>
                <p className="text-sm text-slate-100">{property.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 p-4 md:grid-cols-6">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden rounded-2xl border transition ${
                    selectedImageIndex === index ? "border-slate-900" : "border-slate-200"
                  }`}
                >
                  <img
                    src={getPropertyImageUrl(property, index)}
                    alt={`${property.title} ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Property Overview</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Designed to answer buyer questions faster</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {property.description || "Premium property listing with lead-ready presentation."}
              </p>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Listing Summary</p>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span>Listing ID</span>
                  <span className="font-semibold text-slate-900">#{property.id}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span>Type</span>
                  <span className="font-semibold text-slate-900">{property.type}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span>Configuration</span>
                  <span className="font-semibold text-slate-900">{getBhkLabel(property)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span>Area</span>
                  <span className="font-semibold text-slate-900">{getAreaLabel(property)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Contact Owner</span>
                  <span className="font-semibold text-slate-900">{property.ownerName || "Nirmana Partner"}</span>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Amenities</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Lifestyle and convenience highlights</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {amenities.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Map Location</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Explore the location context</h2>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200">
              <iframe
                title="Property map"
                src={mapEmbedUrl}
                loading="lazy"
                className="h-80 w-full border-0"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-[32px] bg-slate-900 p-6 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Contact Agent</p>
            <h2 className="mt-3 text-3xl font-black">{property.ownerName || "Nirmana Advisor"}</h2>
            <p className="mt-2 text-sm text-slate-300">Verified listing consultant</p>

            {loggedIn ? (
              <>
                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Direct Phone</p>
                  <p className="mt-2 text-2xl font-black">{property.phone || "Not available"}</p>
                </div>

                <div className="mt-4 grid gap-3">
                  <a
                    href={callUrl}
                    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900"
                  >
                    Call Now
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Chat on WhatsApp
                  </a>
                  <button
                    onClick={scheduleVisit}
                    className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Schedule Visit
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/10 p-4">
                <p className="text-sm leading-7 text-slate-200">
                  Login to unlock the consultant phone number, WhatsApp button, callback form, and visit scheduling actions.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-flex rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
                >
                  Login to Contact
                </Link>
              </div>
            )}
          </section>

          <section
            id="contact-request-panel"
            className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Inquiry Form</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Request more details</h3>

            {loggedIn ? (
              <div className="mt-5">
                {requestStatus && (
                  <p className={`mb-3 text-sm font-medium ${requestStatusClass}`}>{requestStatus}</p>
                )}
                <input
                  className="mb-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Your name"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                />
                <input
                  className="mb-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Phone number"
                  value={reqPhone}
                  onChange={(e) => setReqPhone(e.target.value)}
                />
                <textarea
                  className="mb-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Share your requirement, budget, or visit preference"
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                />
                <button
                  onClick={sendRequest}
                  disabled={sending}
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {sending ? "Submitting..." : "Submit Inquiry"}
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Inquiry actions are available after login so contact data stays protected.
              </p>
            )}
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Trust Signals</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Verified listing presentation</div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Structured contact workflow</div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">Quick callback and visit intent capture</div>
            </div>
          </section>
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur xl:hidden">
        {loggedIn ? (
          <div className="grid grid-cols-3 gap-2">
            <a
              href={callUrl}
              className="rounded-2xl bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-white"
            >
              Call
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-300 px-3 py-3 text-center text-sm font-semibold text-slate-800"
            >
              WhatsApp
            </a>
            <button
              onClick={scheduleVisit}
              className="rounded-2xl border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-800"
            >
              Schedule
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/login"
              className="rounded-2xl bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-white"
            >
              Login to Contact
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-slate-300 px-3 py-3 text-center text-sm font-semibold text-slate-800"
            >
              Unlock Inquiry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
