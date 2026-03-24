import { NavLink } from "react-router-dom";
import { getUserRole } from "../utils/auth";

export default function Sidebar({ isLoggedIn, isOpen, onClose }) {
  const role = getUserRole();
  const isAgentOwnerOrAdmin = role === "AGENT" || role === "OWNER" || role === "ADMIN";
  const isAdmin = role === "ADMIN";

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-white text-slate-900 shadow-sm"
        : "text-slate-200 hover:bg-slate-800/90 hover:text-white"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 flex h-full w-72 flex-col bg-slate-900 p-5 text-slate-100 shadow-2xl transform transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={onClose}
        className="mb-4 w-fit rounded-xl border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
      >
        Close
      </button>

      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">Workspace</p>
      <div className="mb-8 flex items-center gap-3 rounded-[24px] border border-slate-800 bg-slate-800/60 p-3">
        <img
          src="/nirmana-logo.jpg"
          alt="Nirmana logo"
          className="h-14 w-14 shrink-0 rounded-2xl bg-white p-1 object-contain shadow-lg"
        />
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight">Nirmana</h1>
          <p className="mt-1 text-xs text-slate-400">Realtors & Consultancy</p>
        </div>
      </div>

      <nav className="space-y-1.5">
        <NavLink className={linkClass} to="/" end onClick={onClose}>
          Home
        </NavLink>
        <NavLink className={linkClass} to="/about" onClick={onClose}>
          About
        </NavLink>
        <NavLink className={linkClass} to="/properties" onClick={onClose}>
          Properties
        </NavLink>

        {isLoggedIn ? (
          <>
            {isAgentOwnerOrAdmin && (
              <NavLink className={linkClass} to="/dashboard" onClick={onClose}>
                Dashboard
              </NavLink>
            )}

            <NavLink className={linkClass} to="/favorites" onClick={onClose}>
              Favorites
            </NavLink>

            {isAgentOwnerOrAdmin && (
              <>
                <NavLink className={linkClass} to="/requests" onClick={onClose}>
                  Requests
                </NavLink>
                <NavLink className={linkClass} to="/add-property" onClick={onClose}>
                  Add Property
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink className={linkClass} to="/admin/users" onClick={onClose}>
                Users
              </NavLink>
            )}

            <NavLink className={linkClass} to="/profile" onClick={onClose}>
              Profile
            </NavLink>
          </>
        ) : (
          <NavLink className={linkClass} to="/login" onClick={onClose}>
            Login
          </NavLink>
        )}
      </nav>

      <div className="mt-auto rounded-[24px] border border-slate-800 bg-slate-800/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lead Ready</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Browse verified listings publicly, then unlock inquiry tools, favorites, and management features when you sign in.
        </p>
      </div>
    </aside>
  );
}
