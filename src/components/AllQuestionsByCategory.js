import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function AllQuestionsByCategory() {
  const [questions, setQuestions] = useState([]);
  const location = useLocation();

  // Read category and limit from query params (e.g., ?category=java&limit=30)
  const query = new URLSearchParams(location.search);
  const category = query.get("category") || "java";
  const limit = parseInt(query.get("limit")) || 30;

  useEffect(() => {
    axios
     .get(https://quizapplication-5.onrender.com/api/questions/${category}/limit/${limit})
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, [category, limit]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        📘 {category.charAt(0).toUpperCase() + category.slice(1)} Questions ({questions.length})
      </h2>

      {questions.map((q, index) => (
        <div key={q.id} style={styles.questionBox}>
          <p style={styles.questionText}>
            <strong>Q{index + 1}:</strong> {q.question}
          </p>

          {q.imageUrl && q.imageUrl !== "none" && (
            <img
              src={`http://localhost:8080${q.imageUrl}`}
              alt="question"
              style={styles.image}
            />
          )}

          <ul style={styles.optionsList}>
            <li>A. {q.option1}</li>
            <li>B. {q.option2}</li>
            <li>C. {q.option3}</li>
            <li>D. {q.option4}</li>
          </ul>

          <p style={styles.answer}>
            <strong>✅ Answer:</strong> {q.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: "Segoe UI, sans-serif",
    maxWidth: 900,
    margin: "30px auto",
    background: "#f9f9f9",
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: 28,
    color: "#2c3e50",
    marginBottom: 30,
  },
  questionBox: {
    background: "#fff",
    padding: 20,
    marginBottom: 20,
    borderLeft: "5px solid #2980b9",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    maxWidth: "100%",
    borderRadius: 6,
    marginBottom: 12,
    border: "1px solid #ccc",
  },
  optionsList: {
    listStyleType: "none",
    paddingLeft: 0,
    lineHeight: 1.7,
  },
  answer: {
    color: "#27ae60",
    marginTop: 12,
    fontWeight: "bold",
  },
};

export default AllQuestionsByCategory;
