import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosConfig";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let objectUrl = "";
    const imageName = property?.images?.[0]?.imageUrl;

    if (!imageName) {
      setImageSrc("");
      return undefined;
    }

    API.get(`/uploads/${imageName}`, { responseType: "blob" })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setImageSrc(objectUrl);
      })
      .catch(() => {
        setImageSrc("");
      });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [property]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error && !property) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!property) {
    return <div className="p-6">Property not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={property.title || "Property"}
          className="h-80 w-full object-cover"
        />
      ) : (
        <div className="h-80 w-full bg-gray-200" />
      )}

      <div className="p-6">
        <h2 className="text-3xl font-bold">{property.title}</h2>

        <p className="text-slate-600 mt-1">{property.location}</p>

        <p className="mt-4 text-slate-700 leading-7">{property.description}</p>

        <p className="text-green-700 text-2xl font-bold mt-6">Rs. {property.price}</p>
      </div>
    </div>
  );
}
