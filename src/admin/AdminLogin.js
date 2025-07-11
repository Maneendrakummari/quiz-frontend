import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("http://localhost:8080/api/admin/login", { username, password })
      .then((res) => {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminAuth", res.data.token); // optional token
       navigate("/AdminDashboard");
 // ✅ Capital D
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Unauthorized. Invalid credentials.");
      });
  };

  return (
    <div style={styles.container}>
      <h2>🔐 Admin Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 30,
    background: "#f8f8f8",
    borderRadius: 10,
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 12,
    backgroundColor: "#4a148c",
    color: "white",
    fontSize: 16,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default AdminLogin;
