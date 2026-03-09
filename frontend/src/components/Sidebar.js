import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 p-5 hidden md:block">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">Workspace</p>
      <h1 className="text-xl font-bold mb-8">RealEstate CRM</h1>

      <nav className="space-y-2">
        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" to="/dashboard">
          Dashboard
        </Link>
        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" to="/properties">
          Properties
        </Link>
        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" to="/favorites">
          Favorites
        </Link>
        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-800" to="/add-property">
          Add Property
        </Link>
      </nav>
    </aside>
  );
}
