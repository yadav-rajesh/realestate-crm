import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
        <p>(c) {new Date().getFullYear()} RealEstate CRM</p>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link to="/properties" className="hover:text-slate-900">
            Properties
          </Link>
          <Link to="/login" className="hover:text-slate-900">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
