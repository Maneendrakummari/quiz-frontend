import React, { useEffect, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function TakeQuiz() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { width, height } = useWindowSize();

  const BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/questions`)
      .then((response) => {
        const uniqueCategories = [
          ...new Set(response.data.map((q) => q.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Failed to load categories", error));
  }, [BASE_URL]);

  // Fetch questions on category change
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`${BASE_URL}/api/questions/category/${selectedCategory}`)
        .then((response) => {
          setQuestions(response.data);
          setAnswers({});
          setSubmitted(false);
          setResult(null);
          setTimeLeft(300);
        })
        .catch((error) => console.error("Failed to load questions", error));
    }
  }, [selectedCategory, BASE_URL]);

  // Timer countdown
  useEffect(() => {
    if (!submitted && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [questions, submitted]);

  const handleSelectAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    const submission = {
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer,
      })),
    };

    axios
      .post(`${BASE_URL}/api/questions/submit`, submission)
      .then((response) => {
        setResult(response.data);
        setSubmitted(true);
      })
      .catch((error) => console.error("Failed to submit quiz", error));
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 89, 152, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(59, 89, 152, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 89, 152, 0); }
          }
        `}
      </style>

      <h2 style={styles.heading}>🎯 Take a Quiz</h2>

      <div style={styles.selectBox}>
        <label><strong>Select Category:</strong></label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">Select...</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {questions.length > 0 && !submitted && (
        <div style={{ animation: "fadeIn 0.5s ease-out" }}>
          <div style={styles.timer}>
            ⏰ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>

          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${
                  questions.length > 0
                    ? (Object.keys(answers).length / questions.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p>{Object.keys(answers).length} of {questions.length} answered</p>

          {questions.map((q) => (
            <div key={q.id} style={styles.questionBox}>
              <p style={styles.questionText}><strong>{q.question}</strong></p>

              {q.imageUrl && q.imageUrl !== "none" && (
                <img
                  src={`${BASE_URL}${q.imageUrl}`}
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
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            style={{
              ...styles.button,
              backgroundColor:
                Object.keys(answers).length < questions.length ? "#bdc3c7" : "#2980b9",
              animation:
                Object.keys(answers).length < questions.length ? "none" : "pulse 1.5s infinite",
              cursor:
                Object.keys(answers).length < questions.length ? "not-allowed" : "pointer",
            }}
          >
            🚀 Submit
          </button>
        </div>
      )}

      {submitted && result && (
        <div style={styles.resultBox}>
          {result.percentage >= 80 && <Confetti width={width} height={height} />}
          <h3>✅ Quiz Result:</h3>
          <p><strong>Total Questions:</strong> {result?.totalQuestions ?? "N/A"}</p>
          <p><strong>Correct Answers:</strong> {result?.correctAnswers ?? "N/A"}</p>
          <p><strong>Score:</strong> {result?.percentage?.toFixed(2) ?? "0.00"}%</p>

          <p>
            <strong>Performance:</strong>{" "}
            {result.percentage >= 80
              ? "🌟 Excellent!"
              : result.percentage >= 50
              ? "👍 Good effort!"
              : "💪 Keep practicing!"}
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setResult(null);
              setAnswers({});
              setTimeLeft(300);
            }}
            style={{
              ...styles.button,
              backgroundColor: "#27ae60",
              marginTop: "20px",
            }}
          >
            🔁 Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
}

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
  selectBox: {
    marginBottom: 25,
  },
  select: {
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    width: "100%",
    border: "1px solid #ccc",
    background: "#fff",
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

export default TakeQuiz;
