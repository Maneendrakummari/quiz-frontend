import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPasswordOffline from "./components/ForgotPasswordOffline";
import CategorySelector from "./components/CategorySelector";
import AllQuestionsByCategory from "./components/AllQuestionsByCategory";
import QuizPage from "./components/QuizPage"; // ✅ IMPORT QuizPage

function App() {
  const isLoggedIn = !!localStorage.getItem("userId");

  return (
    <div style={styles.app}>
      <Router>
        <Routes>
          {/* 🏠 Home */}
          <Route path="/" element={<LandingPage />} />

          {/* 🔑 Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password-offline" element={<ForgotPasswordOffline />} />

          {/* 🔐 Protected Dashboard */}
          <Route
            path="/dashboard"
            element={isLoggedIn ? <CategorySelector /> : <Navigate to="/login" />}
          />

          {/* 📚 View All Questions by Category + Limit */}
          <Route path="/all-questions" element={<AllQuestionsByCategory />} />

          {/* ✅ NEW: Load quiz by category + limit */}
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Router>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #dbeafe, #e0f2fe)",
    padding: 30,
    fontFamily: "Segoe UI, sans-serif",
  },
};

export default App;
