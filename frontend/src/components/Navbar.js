import React from "react";

export default function Navbar({ logout }) {
  const username = localStorage.getItem("username") || "Agent";

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h2 className="font-semibold text-slate-800">{username}</h2>
      </div>

      <button
        onClick={logout}
        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
      >
        Logout
      </button>
    </header>
  );
}
