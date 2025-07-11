import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.heading}>
            <span style={styles.emoji}>🧠</span> Quiz Practice Portal
          </h1>
          <p style={styles.subtitle}>
            Practice and test your knowledge by taking quizzes by category.
          </p>
          <div style={styles.buttonGroup}>
            <button
              style={styles.registerButton}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              style={styles.loginButton}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #b388c5 0%, #9d83cc 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  overlay: {
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "20px",
    padding: "50px 60px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    color: "#fff",
    maxWidth: "700px",
  },
 heading: {
  fontSize: "3.2rem",
  marginBottom: "16px",
  fontWeight: "800",
  background: "linear-gradient(90deg, #ff6a00, #ff3cac, #784ba0)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
},
  emoji: {
    fontSize: "3.2rem",
    marginRight: "10px",
  },
 subtitle: {
  fontSize: "1.3rem",
  marginBottom: "40px",
  color: "#fefefe",
  opacity: 0.85,
  lineHeight: "1.6",
},
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  registerButton: {
  background: "linear-gradient(45deg, #ff3cac, #784ba0)",
  color: "white",
  border: "none",
  padding: "12px 28px",
  borderRadius: "50px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
},

loginButton: {
  background: "transparent",
  border: "2px solid #ff3cac",
  color: "#ff3cac",
  padding: "12px 28px",
  borderRadius: "50px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
},
registerButtonHover: {
  background: "linear-gradient(45deg, #ff6a00, #ff3cac)",
},
loginButtonHover: {
  background: "#ff3cac",
  color: "#fff",
},

};

export default LandingPage;
