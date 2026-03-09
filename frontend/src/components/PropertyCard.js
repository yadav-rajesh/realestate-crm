import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";

export default function PropertyCard({ property }) {
  const [imageSrc, setImageSrc] = useState("");
  const imageName = property?.images?.[0]?.imageUrl;

  useEffect(() => {
    let objectUrl = "";

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
  }, [imageName]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={property?.title || "Property"}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 w-full bg-gray-200" />
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900">{property.title}</h3>

        <p className="text-slate-600">{property.location}</p>

        <p className="text-green-700 font-bold mt-1">Rs. {property.price}</p>

        <Link to={`/property/${property.id}`} className="text-blue-600 font-semibold inline-block mt-3">
          View Details
        </Link>
      </div>
    </div>
  );
}
