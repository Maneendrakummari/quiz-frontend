import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1 = email, Step 2 = OTP & new password
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const requestOtp = async () => {
    setError("");
    setMessage("");
    try {
      const res = await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email: form.email,
      });
      setMessage(res.data); // Expected: "OTP sent to your email"
      setStep(2);
    } catch (err) {
      console.error("OTP Error:", err);
      const errorMsg = err.response?.data || "Something went wrong";
      setError("❌ " + (typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)));
    }
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");
    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      alert("✅ Password reset successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Reset Error:", err);
      const errorMsg = err.response?.data || "Something went wrong";
      setError("❌ " + (typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔐 Forgot Password</h2>

      {step === 1 ? (
        <>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button onClick={requestOtp} style={styles.button}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button onClick={resetPassword} style={styles.button}>Reset Password</button>
        </>
      )}

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
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
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
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#2e7d32",
    color: "white",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
};

export default ForgotPassword;
