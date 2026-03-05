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

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchLocation, setSearchLocation] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");


  // ================= LOAD ON REFRESH =================
  useEffect(() => {

    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
      fetchProperties(0);
    }

  }, []);


  // ================= LOGIN =================
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

      if (role.startsWith("ROLE_")) {
        role = role.replace("ROLE_", "");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setIsLoggedIn(true);
      setRole(role);

      fetchProperties(0);

    } catch (error) {

      alert("Invalid credentials");

    }
  };


  // ================= FETCH PROPERTIES =================
  const fetchProperties = async (page = 0) => {

    try {

      const response = await API.get(
        `/api/properties?page=${page}&size=5&sortBy=${sortBy}&direction=${direction}`
      );

      setProperties(response.data.content);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.number);

    } catch (error) {

      console.error("Fetch Error:", error);

    }
  };


  // ================= SEARCH =================
  const searchProperties = async (page = 0) => {

    try {

      const response = await API.get(
        `/api/properties/search?location=${searchLocation}&page=${page}&size=5`
      );

      setProperties(response.data.content);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.number);

    } catch (error) {

      console.error("Search Error:", error);

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

      fetchProperties(currentPage);

    } catch (error) {

      console.error("Save Error:", error);
      alert("Error saving property");

    }
  };


  // ================= DELETE =================
  const handleDelete = async (id) => {

    try {

      await API.delete(`/api/properties/${id}`);

      fetchProperties(currentPage);

    } catch (error) {

      console.error("Delete Error:", error);
      alert("Only ADMIN can delete");

    }
  };


  // ================= CLEAR SEARCH =================
  const clearSearch = () => {

    setSearchLocation("");
    fetchProperties(0);

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

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

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


      {/* ADD / UPDATE PROPERTY */}

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


      {/* SEARCH */}

      <div style={{ marginBottom: "20px" }}>

        <input
          type="text"
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />

        <button onClick={() => searchProperties(0)}>
          Search
        </button>

        <button onClick={clearSearch}>
          Clear
        </button>

      </div>

      <h3>Sort</h3>

      <button onClick={() => {
        setSortBy("price");
        setDirection("asc");
        fetchProperties(0);
      }}>
        Price Low → High
      </button>

      <button onClick={() => {
        setSortBy("price");
        setDirection("desc");
        fetchProperties(0);
      }}>
        Price High → Low
      </button>

      <button onClick={() => {
        setSortBy("location");
        setDirection("asc");
        fetchProperties(0);
      }}>
        Location
      </button>

      {/* PROPERTY LIST */}

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

      <hr />


      {/* PAGINATION */}

      <h3>Pages</h3>

      <button
        disabled={currentPage === 0}
        onClick={() =>
          searchLocation
            ? searchProperties(currentPage - 1)
            : fetchProperties(currentPage - 1)
        }
      >
        Previous
      </button>

      <span style={{ margin: "0 10px" }}>
        Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
      </span>

      <button
        disabled={currentPage + 1 === totalPages}
        onClick={() =>
          searchLocation
            ? searchProperties(currentPage + 1)
            : fetchProperties(currentPage + 1)
        }
      >
        Next
      </button>

    </div>

  );

}

export default App;