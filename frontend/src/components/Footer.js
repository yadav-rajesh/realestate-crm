import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 md:grid-cols-[1.3fr_0.8fr_1fr] md:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/nirmana-logo.jpg"
              alt="Nirmana logo"
              className="h-14 w-auto rounded-2xl bg-white p-1"
            />
            <div>
              <p className="text-lg font-black">Nirmana</p>
              <p className="text-sm text-slate-400">Realtors & Consultancy</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            Premium property discovery built for buyers, sellers, renters, and real estate teams.
            Browse freely, shortlist faster, and convert interest into verified inquiries.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Quick Links</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-200">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <Link to="/about" className="transition hover:text-white">
              About
            </Link>
            <Link to="/properties" className="transition hover:text-white">
              Properties
            </Link>
            <Link to="/login" className="transition hover:text-white">
              Login
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Get Started</p>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Search premium listings, contact agents, and manage inquiries through one clean portal.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              to="/properties"
              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Browse Properties
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-white"
            >
              Login / Post Property
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500 md:px-6 lg:px-8">
        (c) {new Date().getFullYear()} Nirmana Realtors & Consultancy. Built for premium property discovery.
      </div>
    </footer>
  );
}
