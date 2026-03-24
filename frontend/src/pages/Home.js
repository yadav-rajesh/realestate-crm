import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import PropertyCard from "../components/PropertyCard";
import { isAuthenticated } from "../utils/auth";
import { formatPrice, getPropertyImageUrl } from "../utils/propertyPresentation";

const whyChooseUs = [
  {
    title: "Verified Listing Network",
    description: "Browse quality-controlled property inventory with structured listing details and trusted contact workflows.",
  },
  {
    title: "Faster Lead Conversion",
    description: "Search, shortlist, inquire, and schedule visits from one consistent interface built for conversion.",
  },
  {
    title: "Buyer to Seller Journey",
    description: "Support buyers, renters, owners, and agents through one connected premium real estate experience.",
  },
];

const testimonials = [
  {
    name: "Ananya Mehta",
    role: "Homebuyer",
    quote: "The shortlist and inquiry flow felt clear from the first search. I could compare options much faster than on basic listing sites.",
  },
  {
    name: "Rohit Verma",
    role: "Investor",
    quote: "The property presentation looks polished and trustworthy. It feels closer to a real platform than a basic listing demo.",
  },
  {
    name: "Sakshi Patil",
    role: "Seller",
    quote: "The brand, listing cards, and detail pages now feel premium enough to actually capture leads and conversations.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("BUY");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("ALL");
  const [budget, setBudget] = useState("ALL");
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({});
  const popularCities = ["Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad", "Chennai"];

  useEffect(() => {
    Promise.all([API.get("/api/properties?page=0&size=8"), API.get("/api/dashboard")])
      .then(([propertiesRes, statsRes]) => {
        setProperties(propertiesRes.data?.content || []);
        setStats(statsRes.data || {});
      })
      .catch(() => {
        setProperties([]);
        setStats({});
      });
  }, []);

  const featuredProperties = properties.slice(0, 4);
  const recentProperties = properties.slice(4, 8);
  const heroProperty = properties[0] || null;
  const heroImage = heroProperty ? getPropertyImageUrl(heroProperty) : "/nirmana-logo.jpg";

  const searchProperties = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (mode === "COMMERCIAL") {
      params.set("mode", "commercial");
      params.set("type", "Commercial");
    } else {
      params.set("mode", mode.toLowerCase());
      if (type !== "ALL") {
        params.set("type", type);
      }
    }

    if (budget === "LOW") {
      params.set("max", "10000000");
    } else if (budget === "MID") {
      params.set("min", "10000000");
      params.set("max", "30000000");
    } else if (budget === "HIGH") {
      params.set("min", "30000000");
    }

    const query = params.toString();
    navigate(query ? `/properties?${query}` : "/properties");
  };

  const openCity = (city) => {
    navigate(`/properties?location=${encodeURIComponent(city)}`);
  };

  const categoryCards = [
    {
      title: "Buy Properties",
      description: "Premium homes, flats, villas, and investment-ready listings across high-demand cities.",
      action: () => navigate("/properties?mode=buy"),
      cta: "Explore Buy Listings",
    },
    {
      title: "Rent Homes",
      description: "Shortlist rental-ready inventory with fast browsing and inquiry-friendly detail pages.",
      action: () => navigate("/properties?mode=rent"),
      cta: "Explore Rentals",
    },
    {
      title: "Commercial Spaces",
      description: "Offices, retail, and business inventory presented in a sharper commercial search flow.",
      action: () => navigate("/properties?mode=commercial&type=Commercial"),
      cta: "Explore Commercial",
    },
  ];

  return (
    <div className="space-y-14">
      <section
        className="overflow-hidden rounded-[36px] border border-slate-200 bg-slate-900 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.65)]"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 39, 68, 0.86) 48%, rgba(15, 23, 42, 0.7) 100%), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="px-6 py-10 md:px-10 md:py-12">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_380px] xl:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                Premium Property Discovery Platform
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                Find Your Dream Property
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">
                Explore verified homes, villas, flats, and commercial spaces with a clean,
                conversion-focused experience built to increase inquiries and shortlist quality.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  { key: "BUY", label: "Buy" },
                  { key: "RENT", label: "Rent" },
                  { key: "COMMERCIAL", label: "Commercial" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setMode(option.key)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                      mode === option.key
                        ? "border-white bg-white text-slate-900"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/15"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-white p-4 text-slate-900 shadow-2xl">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_0.9fr_0.9fr_auto_auto]">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search by city or locality"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  >
                    <option value="ALL">All Property Types</option>
                    <option value="Flat">Flat</option>
                    <option value="Residential">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                  </select>

                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  >
                    <option value="ALL">All Budgets</option>
                    <option value="LOW">Up to 1 Cr</option>
                    <option value="MID">1 Cr - 3 Cr</option>
                    <option value="HIGH">Above 3 Cr</option>
                  </select>

                  <button
                    onClick={searchProperties}
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Search
                  </button>

                  <Link
                    to={isAuthenticated() ? "/dashboard" : "/login"}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Post Property
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-blue-100">
                <span className="font-medium text-white">Popular:</span>
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => openCity(city)}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 transition hover:bg-white/15"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Spotlight Listing
              </p>

              <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/20">
                <img
                  src={heroImage}
                  alt={heroProperty?.title || "Premium property"}
                  className="h-52 w-full object-cover"
                />
              </div>

              <div className="mt-4">
                <p className="text-3xl font-black text-white">
                  {heroProperty ? formatPrice(heroProperty.price) : formatPrice(stats.averagePrice || 0)}
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  {heroProperty?.title || "Curated Premium Inventory"}
                </h2>
                <p className="mt-1 text-sm text-blue-100">
                  {heroProperty?.location || "Across key Indian property markets"}
                </p>
                <Link
                  to={heroProperty ? `/property/${heroProperty.id}` : "/properties"}
                  className="mt-5 inline-flex rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
                >
                  View Spotlight Listing
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Verified Listings</p>
              <p className="mt-2 text-3xl font-black">{stats.totalProperties ?? 0}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Average Ticket Size</p>
              <p className="mt-2 text-3xl font-black">{formatPrice(stats.averagePrice || 0)}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Cities Covered</p>
              <p className="mt-2 text-3xl font-black">{stats.totalLocations ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Property Categories</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Browse by intent</h2>
          </div>
          <Link to="/properties" className="text-sm font-semibold text-blue-700">
            Explore all listings
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {categoryCards.map((card) => (
            <button
              key={card.title}
              onClick={card.action}
              className="rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Nirmana Category</p>
              <h3 className="mt-3 text-2xl font-black text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              <span className="mt-6 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {card.cta}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Featured Properties</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Premium handpicked listings</h2>
          </div>
          <Link to="/properties" className="text-sm font-semibold text-blue-700">
            View all properties
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Featured listings will appear here once properties are available.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {whyChooseUs.map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Why Choose Us</p>
            <h3 className="mt-3 text-2xl font-black text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Client Feedback</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Built to inspire trust and action</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-base leading-7 text-slate-700">"{item.quote}"</p>
              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Recently Added</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Fresh inventory for serious buyers</h2>
          </div>
          <Link to="/properties" className="text-sm font-semibold text-blue-700">
            Browse more
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Recently added properties will appear here.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-white via-blue-50 to-slate-100 px-6 py-8 shadow-sm md:px-10 md:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">High-Intent CTA</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Ready to generate better leads?</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Browse premium listings, shortlist faster, and move into a contact-ready flow with better trust signals, stronger property cards, and clearer inquiry actions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/properties"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Search Properties
            </Link>
            <Link
              to={isAuthenticated() ? "/dashboard" : "/register"}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800"
            >
              Post Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
