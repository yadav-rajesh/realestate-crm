import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";

export default function EditProperty() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    API.get(`/api/properties/${id}`)
      .then((res) => {
        if (!active) {
          return;
        }

        setProperty(res.data || null);
      })
      .catch(() => {
        if (active) {
          setProperty(null);
          setError("Property not found.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const update = async () => {
    if (!property) {
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = {
        title: property.title || "",
        location: property.location || "",
        price: Number(property.price || 0),
        status: property.status || "Available",
        type: property.type || "Residential",
        description: property.description || "",
      };

      await API.put(`/api/properties/${id}`, payload);

      if (file) {
        const form = new FormData();
        form.append("file", file);
        await API.post(`/api/properties/upload/${id}`, form);
      }

      alert("Property Updated");
    } catch {
      setError("Failed to update property.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading property...</div>;
  }

  if (error && !property) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!property) {
    return <div className="p-6">Property not found.</div>;
  }

  return (
    <div className="max-w-3xl bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-1">Edit Property</h2>
      <p className="text-slate-600 mb-4">Update listing details and media.</p>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <input
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        value={property.title || ""}
        onChange={(e) => setProperty({ ...property, title: e.target.value })}
        placeholder="Title"
      />

      <input
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        value={property.location || ""}
        onChange={(e) => setProperty({ ...property, location: e.target.value })}
        placeholder="Location"
      />

      <input
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        value={property.price || ""}
        onChange={(e) => setProperty({ ...property, price: e.target.value })}
        placeholder="Price"
      />

      <select
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        value={property.status || "Available"}
        onChange={(e) => setProperty({ ...property, status: e.target.value })}
      >
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>

      <select
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3"
        value={property.type || "Residential"}
        onChange={(e) => setProperty({ ...property, type: e.target.value })}
      >
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
      </select>

      <textarea
        className="border border-slate-200 rounded-lg p-2.5 block w-full mb-3 min-h-28"
        value={property.description || ""}
        onChange={(e) => setProperty({ ...property, description: e.target.value })}
        placeholder="Description"
      />

      <input
        type="file"
        className="block mb-4 text-sm"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={update}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
      >
        {saving ? "Updating..." : "Update"}
      </button>
    </div>
  );
}
