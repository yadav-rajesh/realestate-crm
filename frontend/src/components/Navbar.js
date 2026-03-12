import React from "react";
import { Link } from "react-router-dom";
import { getUserRole } from "../utils/auth";

export default function Navbar({ isLoggedIn, logout, onMenuOpen }) {
  const username = localStorage.getItem("username") || "Guest";
  const role = getUserRole();
  const canAccessDashboard = role === "ADMIN" || role === "AGENT" || role === "OWNER";
  const isAdmin = role === "ADMIN";

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuOpen}
          className="border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Menu
        </button>

        <Link to="/" className="font-black text-slate-900 text-lg">
          RealEstate CRM
        </Link>
        <nav className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link to="/properties" className="hover:text-slate-900">
            Properties
          </Link>
          {isLoggedIn && (
            <>
              {canAccessDashboard && (
                <Link to="/dashboard" className="hover:text-slate-900">
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/users" className="hover:text-slate-900">
                  Users
                </Link>
              )}
              <Link to="/profile" className="hover:text-slate-900">
                Profile
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
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
