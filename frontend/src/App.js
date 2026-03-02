import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await axios.get("http://localhost:8080/api/properties");
    setProperties(res.data);
  };

  const addOrUpdateProperty = async () => {
    if (editingId) {
      // UPDATE
      await axios.put(`http://localhost:8080/api/properties/${editingId}`, {
        title,
        location,
        price,
        type: "Flat",
        status: "Available"
      });
      setEditingId(null);
    } else {
      // CREATE
      await axios.post("http://localhost:8080/api/properties", {
        title,
        location,
        price,
        type: "Flat",
        status: "Available"
      });
    }

    setTitle("");
    setLocation("");
    setPrice("");
    fetchProperties();
  };

  const deleteProperty = async (id) => {
    await axios.delete(`http://localhost:8080/api/properties/${id}`);
    fetchProperties();
  };

  const editProperty = (property) => {
    setTitle(property.title);
    setLocation(property.location);
    setPrice(property.price);
    setEditingId(property.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{editingId ? "Update Property" : "Add Property"}</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br /><br />

      <button onClick={addOrUpdateProperty}>
        {editingId ? "Update" : "Add"}
      </button>

      <hr />

      <h2>Property List</h2>

      {properties.map((p) => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          {p.title} - {p.location} - ₹{p.price}
          <button onClick={() => editProperty(p)} style={{ marginLeft: "10px" }}>
            Edit
          </button>
          <button onClick={() => deleteProperty(p.id)} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;