import { Link } from "react-router-dom";

export default function About() {
  const highlights = [
    "Residential buying and selling support",
    "Rental property assistance",
    "Owner and agent listing management",
    "Local market guidance and consultation",
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 px-6 py-10 text-white md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
          About Us
        </p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black md:text-5xl">Nirmana Realtors & Consultancy</h1>
            <p className="mt-4 max-w-2xl text-base text-blue-50 md:text-lg">
              We help clients discover the right property with practical guidance,
              transparent communication, and market-focused support across buying,
              renting, and listing workflows.
            </p>
          </div>

          <img
            src="/nirmana-logo.jpg"
            alt="Nirmana logo"
            className="h-28 w-auto rounded-3xl border border-white/20 bg-white/90 p-2 shadow-2xl"
          />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Who We Are</h2>
          <p className="mt-3 text-slate-600">
            Nirmana is a real estate company focused on property discovery,
            consultation, and listing support. This portal is designed to let users
            browse properties openly while keeping contact and management actions
            available through secure user roles.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">What We Offer</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            {highlights.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="mt-3 text-slate-600">
            To simplify property search and consultation with a clean, accessible,
            and trustworthy digital experience.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Our Approach</h3>
          <p className="mt-3 text-slate-600">
            We combine local market understanding with a structured property portal
            that supports clients, agents, owners, and administrators.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Why Choose Us</h3>
          <p className="mt-3 text-slate-600">
            Clear listings, role-based workflows, and consultation-focused service
            make the platform feel closer to a real deployable business portal.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Start Exploring</h2>
            <p className="mt-2 text-slate-600">
              Browse listings freely, then login only when you want to save
              favorites, manage listings, or contact the seller.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/properties"
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800"
            >
              View Properties
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
