import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
     const res = await axios.post("https://quizapplication-6.onrender.com/api/auth/login", form);


      const user = res.data;

      if (typeof user === "string") {
        // If backend returns just a message (unlikely for login success)
        localStorage.setItem("username", form.username);
        navigate("/dashboard");
      } else {
        if (user.status?.toLowerCase() === "blocked") {
          setError("❌ Your account is blocked.");
          setLoading(false);
          return;
        }

        // Store relevant user info in localStorage (avoid storing sensitive data)
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);
        localStorage.setItem("status", user.status);

        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("❌ Your account is blocked.");
      } else if (err.response?.status === 401) {
        setError("❌ Invalid username or password.");
      } else if (err.response?.status === 400) {
        setError("❌ Missing or invalid input.");
      } else {
        setError("❌ Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔐 Login</h2>

      <form onSubmit={handleLogin} style={styles.form} noValidate>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
          required
          autoComplete="username"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
          autoComplete="current-password"
          disabled={loading}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={loading ? styles.buttonDisabled : styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 15 }}>
        <Link to="/forgot-password-offline" style={styles.forgotLink}>
          Forgot Password?
        </Link>
      </p>

      <p style={{ textAlign: "center", marginTop: 10 }}>
        Don't have an account?{" "}
        <Link to="/register" style={styles.registerLink}>
          Register
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 30,
    backgroundColor: "#ffffffcc",
    borderRadius: 12,
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    padding: 12,
    backgroundColor: "#4a148c",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonDisabled: {
    padding: 12,
    backgroundColor: "#8e24aa",
    color: "#ddd",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "not-allowed",
  },
  forgotLink: {
    fontSize: "14px",
    color: "#2980b9",
    textDecoration: "none",
  },
  registerLink: {
    fontSize: "14px",
    color: "#1b5e20",
    textDecoration: "none",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default Login;
