import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPasswordOffline() {
  const [form, setForm] = useState({
    username: "",
    securityAnswer: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/reset-password-offline",
        form
      );
      setMessage(res.data);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2s
    } catch (err) {
      console.error("Reset error:", err);
      const msg = err.response?.data || "Something went wrong";
      setError("❌ " + (typeof msg === "string" ? msg : JSON.stringify(msg)));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔐 Reset Password Without Email</h2>

      <input
        type="text"
        name="username"
        placeholder="Enter your username"
        value={form.username}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <input
        type="text"
        name="securityAnswer"
        placeholder="Enter your secret answer"
        value={form.securityAnswer}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <input
        type="password"
        name="newPassword"
        placeholder="Enter new password"
        value={form.newPassword}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <button onClick={handleReset} style={styles.button}>
        🔁 Reset Password
      </button>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 30,
    backgroundColor: "#ffffffee",
    borderRadius: 12,
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: 20,
    color: "#1a237e",
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    marginBottom: 14,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#2e7d32", // ✅ fixed missing value
    color: "white",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
};

export default ForgotPasswordOffline;
