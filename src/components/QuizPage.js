import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useLocation, useNavigate } from "react-router-dom";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const { width, height } = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const category = query.get("category") || "java";
  const limit = 20;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("⚠️ Please sign in to take the quiz.");
      navigate("/login");
      return;
    }

    axios
      .get(`https://quizapplication-6.onrender.com/api/questions/category/${category}/limit/${limit}`)
      .then((res) => {
        const data = res.data;
        setQuestions(data);
        setAnswers({});
        setSubmitted(false);
        setResult(null);
        setTimeLeft(data.length * 60);
      })
      .catch((err) => {
        console.error("❌ Failed to load questions:", err);
        alert("❌ Failed to load quiz questions.");
      });
  }, [category, limit, navigate]);

  const handleSubmitQuiz = useCallback(() => {
    const username = localStorage.getItem("userId") || "guest";

    const payload = {
      username,
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer,
      })),
    };

    axios
      .post("https://quizapplication-6.onrender.com/api/questions/submit", payload)
      .then((res) => {
        setResult(res.data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.error("❌ Submission failed:", err.response?.data || err.message);
        alert("❌ Quiz submission failed.");
      });
  }, [answers]);

  useEffect(() => {
    if (!submitted && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [questions, submitted, handleSubmitQuiz]);

  const handleSelectAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        📋 {category.charAt(0).toUpperCase() + category.slice(1)} Quiz
      </h2>

      {!submitted && questions.length > 0 && (
        <>
          <div style={styles.timer}>
            ⏰ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>

          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${(Object.keys(answers).length / questions.length) * 100}%`,
              }}
            />
          </div>

          {questions.map((q, index) => (
            <div key={q.id} style={styles.questionBox}>
              <p style={styles.questionText}>
                <strong>Q{index + 1}:</strong> {q.question}
              </p>

              {q.imageUrl && q.imageUrl !== "none" && (
                <img
                  src={`https://quizapplication-6.onrender.com${q.imageUrl}`}
                  alt="Question"
                  style={styles.image}
                />
              )}

              {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                <label key={i} style={styles.option}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleSelectAnswer(q.id, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length < questions.length}
            style={{
              ...styles.button,
              backgroundColor:
                Object.keys(answers).length < questions.length ? "#bdc3c7" : "#2980b9",
              cursor:
                Object.keys(answers).length < questions.length ? "not-allowed" : "pointer",
            }}
          >
            🚀 Submit
          </button>
        </>
      )}

      {submitted && result && (
        <div style={styles.resultBox}>
          {result.percentage >= 80 && <Confetti width={width} height={height} />}
          <h3>✅ Quiz Result:</h3>
          <p><strong>Total Questions:</strong> {result.totalQuestions}</p>
          <p><strong>Correct Answers:</strong> {result.correctAnswers}</p>
          <p><strong>Score:</strong> {result.percentage.toFixed(2)}%</p>
          <p><strong>Performance:</strong> 
            {result.percentage >= 80 ? "🌟 Excellent!" : result.percentage >= 50 ? "👍 Good effort!" : "💪 Keep practicing!"}
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setResult(null);
              setAnswers({});
              setTimeLeft(questions.length * 60);
            }}
            style={{
              ...styles.button,
              backgroundColor: "#27ae60",
              marginTop: "20px",
            }}
          >
            🔁 Retry Quiz
          </button>

          <button
            onClick={handleLogout}
            style={{
              ...styles.button,
              backgroundColor: "#e74c3c",
              marginTop: "15px",
            }}
          >
            🚪 Logout
          </button>

          <button
            onClick={() => navigate("/quiz")}
            style={{
              ...styles.button,
              backgroundColor: "#3498db",
              marginTop: "15px",
            }}
          >
            🏠 Home
          </button>
        </div>
      )}
    </div>
  );
}

// ✅ Styles
const styles = {
  container: {
    maxWidth: 800,
    margin: "30px auto",
    padding: 30,
    borderRadius: 14,
    background: "linear-gradient(135deg, #e0f7fa, #fce4ec)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    fontFamily: "Segoe UI, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: 28,
    marginBottom: 25,
  },
  timer: {
    textAlign: "right",
    fontWeight: "bold",
    marginBottom: 12,
    color: "#e74c3c",
  },
  progressBarContainer: {
    height: 10,
    background: "#d0d0d0",
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2ecc71",
    transition: "width 0.4s ease",
  },
  questionBox: {
    background: "#fff",
    padding: 20,
    marginBottom: 25,
    borderLeft: "5px solid #2980b9",
    borderRadius: 10,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    maxWidth: "100%",
    borderRadius: 8,
    marginBottom: 10,
    border: "1px solid #ccc",
  },
  option: {
    display: "block",
    marginBottom: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    padding: "12px 24px",
    backgroundColor: "#2980b9",
    color: "white",
    fontSize: 18,
    borderRadius: 10,
    cursor: "pointer",
    border: "none",
  },
  resultBox: {
    background: "#e8f5e9",
    border: "2px solid #27ae60",
    padding: 24,
    borderRadius: 12,
    marginTop: 35,
    textAlign: "center",
  },
};

export default QuizPage;
