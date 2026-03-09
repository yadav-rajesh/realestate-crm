import { useState } from "react";
import API from "../api/axiosConfig";

export default function AddProperty() {
  const [property, setProperty] = useState({
    title: "",
    location: "",
    price: "",
    status: "Available",
    type: "Residential",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...property,
        price: Number(property.price || 0),
      };

      const res = await API.post("/api/properties", payload);

      if (file) {
        const form = new FormData();
        form.append("file", file);
        await API.post(`/api/properties/upload/${res.data.id}`, form);
      }

      setSuccess("Property added successfully.");
      setProperty({
        title: "",
        location: "",
        price: "",
        status: "Available",
        type: "Residential",
        description: "",
      });
      setFile(null);
    } catch {
      setError("Failed to add property.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-1">Add Property</h2>
      <p className="text-slate-600 mb-4">Create a new listing for your inventory.</p>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <input
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        placeholder="Title"
        value={property.title}
        onChange={(e) => setProperty({ ...property, title: e.target.value })}
      />

      <input
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        placeholder="Location"
        value={property.location}
        onChange={(e) => setProperty({ ...property, location: e.target.value })}
      />

      <input
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        placeholder="Price"
        value={property.price}
        onChange={(e) => setProperty({ ...property, price: e.target.value })}
      />

      <select
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        value={property.status}
        onChange={(e) => setProperty({ ...property, status: e.target.value })}
      >
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>

      <select
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        value={property.type}
        onChange={(e) => setProperty({ ...property, type: e.target.value })}
      >
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
      </select>

      <textarea
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3 min-h-28"
        placeholder="Description"
        value={property.description}
        onChange={(e) => setProperty({ ...property, description: e.target.value })}
      />

      <input
        type="file"
        className="block mb-4 text-sm"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={save}
        disabled={saving || !property.title || !property.location || !property.price}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
