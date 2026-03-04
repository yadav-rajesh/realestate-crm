import React, { useEffect, useState } from "react";
import API from "./api/axiosConfig";

function App() {

  // ================= STATE =================
  const [properties, setProperties] = useState([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  // ================= LOAD ON REFRESH =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
      fetchProperties();
    }
  }, []);

  // ================= LOGIN =================
  // const handleLogin = async () => {
  //   try {
  //     const response = await API.post("/auth/login", {
  //       username,
  //       password,
  //     });

  //     const { token, role } = response.data;

  //     if (!token) {
  //       alert(response.data.message || "Login failed");
  //       return;
  //     }

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("role", role);

  //     setIsLoggedIn(true);
  //     setRole(role);

  //     alert("Login Successful ✅");
  //     fetchProperties();

  //   } catch (error) {
  //     console.error("Login Error:", error);
  //     alert(error.response?.data?.message || "Invalid credentials");
  //   }
  // };
  const handleLogin = async () => {
  try {
    const response = await API.post("/auth/login", {
      username,
      password,
    });

    let { token, role } = response.data;

    if (!token) {
      alert(response.data.message || "Login failed");
      return;
    }

    // 🔥 Normalize role
    if (role.startsWith("ROLE_")) {
      role = role.replace("ROLE_", "");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    setIsLoggedIn(true);
    setRole(role);

    fetchProperties();
  } catch (error) {
    alert("Invalid credentials");
  }
};

  // ================= FETCH PROPERTIES =================
  const fetchProperties = async () => {
    try {
      const response = await API.get("/api/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Unauthorized or token expired");
    }
  };

  // ================= ADD / UPDATE =================
  const handleSubmit = async () => {
    try {

      if (editingId) {
        await API.put(`/api/properties/${editingId}`, {
          title,
          location,
          price,
        });
        setEditingId(null);
      } else {
        await API.post("/api/properties", {
          title,
          location,
          price,
        });
      }

      setTitle("");
      setLocation("");
      setPrice("");

      fetchProperties();

    } catch (error) {
      console.error("Save Error:", error);
      alert("Error saving property");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/properties/${id}`);
      fetchProperties();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Only ADMIN can delete");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setRole("");
    setProperties([]);
  };

  // ================= LOGIN UI =================
  if (!isLoggedIn) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div style={{ padding: "30px" }}>
      <h2>Real Estate CRM</h2>

      <p>
        Logged in as: <b>{role}</b>
      </p>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h3>{editingId ? "Update Property" : "Add Property"}</h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {editingId ? "Update" : "Add"}
      </button>

      <hr />

      <h3>Properties</h3>

      {properties.map((property) => (
        <div key={property.id} style={{ marginBottom: "15px" }}>
          <b>{property.title}</b> — {property.location} — ₹{property.price}
          <br />

          <button
            onClick={() => {
              setEditingId(property.id);
              setTitle(property.title);
              setLocation(property.location);
              setPrice(property.price);
            }}
          >
            Edit
          </button>

          {/* ROLE BASED DELETE */}
          {role === "ADMIN" && (
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(property.id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;