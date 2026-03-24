import { API_BASE_URL } from "../api/axiosConfig";

function toNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function trimDecimal(value) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export function formatPrice(price) {
  const value = toNumber(price);

  if (value >= 10000000) {
    return `Rs. ${trimDecimal(value / 10000000)} Cr`;
  }

  if (value >= 100000) {
    return `Rs. ${trimDecimal(value / 100000)} L`;
  }

  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatFullPrice(price) {
  return `Rs. ${Math.round(toNumber(price)).toLocaleString("en-IN")}`;
}

export function getPropertyImageUrl(property, index = 0) {
  const imageName = property?.images?.[index]?.imageUrl || property?.images?.[0]?.imageUrl;
  return imageName ? `${API_BASE_URL}/uploads/${imageName}` : "/nirmana-logo.jpg";
}

export function getBhkLabel(property) {
  const text = `${property?.title || ""} ${property?.description || ""}`;
  const match = text.match(/(\d+)\s*BHK/i);

  if (match) {
    return `${match[1]} BHK`;
  }

  const type = (property?.type || "").toLowerCase();

  if (type === "villa") {
    return "4 BHK";
  }

  if (type === "residential") {
    return "3 BHK";
  }

  if (type === "commercial") {
    return "Commercial";
  }

  return "2 BHK";
}

export function getAreaLabel(property) {
  const text = `${property?.title || ""} ${property?.description || ""}`;
  const exactArea = text.match(/(\d[\d,]{2,5})\s*(?:sq\s*ft|sqft)/i);

  if (exactArea) {
    return `${exactArea[1].replace(/,/g, "")} sq ft`;
  }

  const bhkMatch = getBhkLabel(property).match(/(\d+)/);
  const bhk = bhkMatch ? Number(bhkMatch[1]) : 0;
  const type = (property?.type || "").toLowerCase();
  const areaByBhk = {
    1: 650,
    2: 1100,
    3: 1550,
    4: 2400,
    5: 3600,
  };

  if (type === "commercial") {
    return "1350 sq ft";
  }

  if (type === "villa") {
    return `${areaByBhk[bhk] || 3200} sq ft`;
  }

  if (type === "residential") {
    return `${areaByBhk[bhk] || 2100} sq ft`;
  }

  return `${areaByBhk[bhk] || 1250} sq ft`;
}

export function getAmenities(property) {
  const type = (property?.type || "").toLowerCase();
  const baseAmenities = ["24x7 Security", "Power Backup", "Parking", "Water Supply"];
  let extraAmenities = ["Lift Access", "Club Access", "Visitor Parking", "Security Desk"];

  if (type === "villa") {
    extraAmenities = ["Private Garden", "Covered Parking", "Clubhouse", "Landscape View"];
  } else if (type === "commercial") {
    extraAmenities = ["High-Speed Internet", "Visitor Lounge", "Power Backup", "Access Control"];
  } else if (getBhkLabel(property).startsWith("1")) {
    extraAmenities = ["Lift Access", "CCTV", "Children Play Area", "Gated Entry"];
  }

  return [...new Set([...baseAmenities, ...extraAmenities])].slice(0, 8);
}

export function getMapSearchUrl(property) {
  const query = encodeURIComponent(`${property?.title || "Property"}, ${property?.location || "India"}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getMapEmbedUrl(property) {
  const query = encodeURIComponent(`${property?.title || "Property"}, ${property?.location || "India"}`);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function getWhatsAppUrl(property) {
  if (!property?.phone) {
    return "";
  }

  const message = encodeURIComponent(
    `Hello, I am interested in ${property?.title || "this property"} in ${property?.location || "your location"}. Please share more details.`
  );

  return `https://wa.me/91${property.phone}?text=${message}`;
}

export function getCallUrl(property) {
  return property?.phone ? `tel:${property.phone}` : "";
}
