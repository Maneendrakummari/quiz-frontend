import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CategorySelector() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch username from localStorage
  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/questions")
      .then((res) => {
        const uniqueCategories = [
          ...new Set(
            res.data
              .map((q) => q.category?.toLowerCase().trim())
              .filter(Boolean)
          ),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.error("Error loading categories", err);
        alert("❌ Unable to fetch quiz categories.");
      });
  }, []);

  const startQuiz = (category) => {
    // ✅ Fixed number of questions (20)
    navigate(`/quiz?category=${category}&limit=20`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.userBadge}>
          👤 {username}
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <h2 style={styles.title}>🎯 Choose a Quiz Category</h2>

      <div style={styles.grid}>
        {categories.length > 0 ? (
          categories.map((cat, i) => (
            <div
              key={i}
              style={styles.card}
              onClick={() => startQuiz(cat)}
            >
              <div style={styles.cardTitle}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </div>
              <div style={styles.cardIcon}>➡️</div>
            </div>
          ))
        ) : (
          <p style={{ color: "red" }}>⚠️ No categories found in DB.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: 30,
    background: "#f9fafb",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userBadge: {
    fontWeight: 500,
    color: "#1e3a8a",
    fontSize: 16,
  },
  logoutButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 14,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 25,
    color: "#1e40af",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#1e3a8a",
    color: "#fff",
    borderRadius: 12,
    padding: "20px 18px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 20,
  },
};

export default CategorySelector;
