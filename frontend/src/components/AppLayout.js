import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { clearAuthSession, isAuthenticated } from "../utils/auth";

export default function AppLayout() {
  const loggedIn = isAuthenticated();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logout = () => {
    clearAuthSession();
    window.location = "/";
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900">
      <Sidebar
        isLoggedIn={loggedIn}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/45"
        />
      )}

      <div className="relative flex min-h-screen flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-50/80 via-white/40 to-transparent" />
        <Navbar
          isLoggedIn={loggedIn}
          logout={logout}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <main className="relative mx-auto w-full max-w-[1400px] flex-1 px-4 py-5 md:px-6 md:py-8 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
