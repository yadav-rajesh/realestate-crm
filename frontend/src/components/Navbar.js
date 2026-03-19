import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, logout, onMenuOpen }) {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-6 min-w-0">
        <button
          onClick={onMenuOpen}
          className="border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Menu
        </button>

        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img
            src="/nirmana-logo.jpg"
            alt="Nirmana logo"
            className="h-12 md:h-14 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
          />
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-lg md:text-xl leading-none truncate">Nirmana</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1 truncate">Realtors & Consultancy</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-500">{isLoggedIn ? "Welcome back" : "Public access mode"}</p>
          <h2 className="font-semibold text-slate-800">{username}</h2>
        </div>

        {isLoggedIn ? (
          <button
            onClick={logout}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
