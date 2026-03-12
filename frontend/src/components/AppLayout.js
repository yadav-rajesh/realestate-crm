import { useState } from "react";
import { Outlet } from "react-router-dom";
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
    <div className="min-h-screen bg-slate-100 text-slate-900 overflow-x-hidden">
      <Sidebar
        isLoggedIn={loggedIn}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30"
        />
      )}

      <div className="min-h-screen flex flex-col">
        <Navbar
          isLoggedIn={loggedIn}
          logout={logout}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        <main className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
