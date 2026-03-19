import { Link } from "react-router-dom";
import { getUserRole } from "../utils/auth";

export default function Sidebar({ isLoggedIn, isOpen, onClose }) {
  const role = getUserRole();
  const isAgentOwnerOrAdmin = role === "AGENT" || role === "OWNER" || role === "ADMIN";
  const isAdmin = role === "ADMIN";

  const linkClass = "block rounded-lg px-3 py-2 hover:bg-slate-800";

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-100 p-5 z-40 transform transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={onClose}
        className="mb-4 border border-slate-700 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800"
      >
        Close
      </button>

      <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">Workspace</p>
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/60 p-3">
        <img
          src="/nirmana-logo.jpg"
          alt="Nirmana logo"
          className="h-14 w-14 shrink-0 rounded-xl bg-white p-1 shadow-lg object-contain"
        />
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight">Nirmana</h1>
          <p className="text-xs text-slate-400 mt-1">Realtors & Consultancy</p>
        </div>
      </div>

      <nav className="space-y-2">
        <Link className={linkClass} to="/" onClick={onClose}>
          Home
        </Link>

        <Link className={linkClass} to="/about" onClick={onClose}>
          About
        </Link>

        <Link className={linkClass} to="/properties" onClick={onClose}>
          Properties
        </Link>

        {isLoggedIn ? (
          <>
            {isAgentOwnerOrAdmin && (
              <Link className={linkClass} to="/dashboard" onClick={onClose}>
                Dashboard
              </Link>
            )}

            <Link className={linkClass} to="/favorites" onClick={onClose}>
              Favorites
            </Link>

            {isAgentOwnerOrAdmin && (
              <>
                <Link className={linkClass} to="/requests" onClick={onClose}>
                  Requests
                </Link>
                <Link className={linkClass} to="/add-property" onClick={onClose}>
                  Add Property
                </Link>
              </>
            )}

            {isAdmin && (
              <Link className={linkClass} to="/admin/users" onClick={onClose}>
                Users
              </Link>
            )}

            <Link className={linkClass} to="/profile" onClick={onClose}>
              Profile
            </Link>
          </>
        ) : (
          <Link className={linkClass} to="/login" onClick={onClose}>
            Login
          </Link>
        )}
      </nav>
    </aside>
  );
}

