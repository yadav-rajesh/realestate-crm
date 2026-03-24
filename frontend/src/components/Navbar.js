import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, logout, onMenuOpen }) {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/88 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 md:gap-6">
          <button
            onClick={onMenuOpen}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Menu
          </button>

          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src="/nirmana-logo.jpg"
              alt="Nirmana logo"
              className="h-12 w-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-sm md:h-14"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-black leading-none text-slate-900 md:text-xl">
                Nirmana
              </p>
              <p className="mt-1 truncate text-xs text-slate-500 md:text-sm">
                Realtors & Consultancy
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm text-slate-500">{isLoggedIn ? "Welcome back" : "Explore verified listings"}</p>
            <h2 className="font-semibold text-slate-800">{username}</h2>
          </div>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
