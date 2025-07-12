// src/admin/pages/AdminDashboard.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);

  const token = localStorage.getItem("adminAuth");

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/admin/login");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
        .get("https://quizapplication-6.onrender.com/api/admin/users", { headers })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch users.");
      });

    axios
       .get("https://quizapplication-6.onrender.com/api/admin/results", { headers })
      .then((res) => setResults(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch results.");
      });
  }, [navigate, token]);

  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .delete(`https://quizapplication-6.onrender.com/api/admin/users/${id}`, { headers })
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert("User deleted.");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete user.");
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>📊 Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>👥 Users</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📈 Quiz Results</h2>
        <div style={styles.resultsGrid}>
          {results.length === 0 && <p>No quiz results found.</p>}
          {results.map((res) => (
            <div key={res.id} style={styles.resultCard}>
              <p style={styles.resultUser}>
                <strong>{res.username}</strong>
              </p>
              <p style={styles.resultScore}>
                Score: {res.correctAnswers} / {res.totalQuestions}
              </p>
              <p style={styles.resultPercentage}>
                Percentage: {Number(res.scorePercentage).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1000,
    margin: "auto",
    padding: 30,
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    margin: 0,
    fontSize: "2.2rem",
    color: "#4A148C",
  },
  logout: {
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    borderBottom: "2px solid #4A148C",
    paddingBottom: 6,
    marginBottom: 20,
    fontSize: "1.5rem",
    color: "#4A148C",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #4A148C",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#E1BEE7",
    color: "#4A148C",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "8px",
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
  divider: {
    margin: "40px 0",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  resultCard: {
    backgroundColor: "#F3E5F5",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  resultUser: {
    marginBottom: 10,
    fontSize: "1.2rem",
    color: "#4A148C",
  },
  resultScore: {
    fontSize: "1.1rem",
    color: "#333",
  },
  resultPercentage: {
    fontSize: "1rem",
    color: "#555",
  },
};

export default AdminDashboard;
