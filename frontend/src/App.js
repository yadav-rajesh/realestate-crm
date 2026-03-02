import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await axios.get("http://localhost:8080/api/properties");
    setProperties(res.data);
  };

  const addProperty = async () => {
    await axios.post("http://localhost:8080/api/properties", {
      title,
      location,
      price,
      type: "Flat",
      status: "Available"
    });
    fetchProperties();
  };

  return (
    <div>
      <h2>Add Property</h2>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Location" onChange={e => setLocation(e.target.value)} />
      <input placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <button onClick={addProperty}>Add</button>

      <h2>Property List</h2>
      {properties.map(p => (
        <div key={p.id}>
          {p.title} - {p.location} - ₹{p.price}
        </div>
      ))}
    </div>
  );
}

export default App;