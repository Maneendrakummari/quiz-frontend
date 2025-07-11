import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const questions = [
    "What is your favorite color?",
    "What is your pet’s name?",
    "What is your mother’s maiden name?",
    "What was your first school?",
    "What is your favorite food?",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
     await axios.post("https://quizapplication-5.onrender.com/api/auth/register", form);

      setSuccess("✅ Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data || "Something went wrong";
      setError("❌ " + msg);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Register</h2>

      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {/* 🔐 Security Question Dropdown */}
        <select
          name="securityQuestion"
          value={form.securityQuestion}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">-- Select a security question --</option>
          {questions.map((q, i) => (
            <option key={i} value={q}>{q}</option>
          ))}
        </select>

        <input
          type="text"
          name="securityAnswer"
          placeholder="Your answer"
          value={form.securityAnswer}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button type="submit" style={styles.button}>Register</button>
      </form>

      <p style={{ textAlign: "center", marginTop: 10 }}>
        Already registered?{" "}
        <Link to="/login" style={styles.loginLink}>Login</Link>
      </p>
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
    color: "#2c3e50",
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
    backgroundColor: "#00695c",
    color: "white",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  loginLink: {
    color: "#1565c0",
    textDecoration: "none",
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

export default Register;
