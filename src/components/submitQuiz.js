// src/components/submitQuiz.js
import axios from "axios";

const submitQuiz = (answers, setSubmitted, setResult) => {
  const submission = {
    username: localStorage.getItem("userId") || "guest",
    answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId: parseInt(questionId, 10),
      selectedAnswer,
    })),
  };

  console.log("📤 Submitting:", submission);

  axios
    .post("https://quizapplication-5.onrender.com/api/questions/submit", submission)
    .then((res) => {
      console.log("✅ Submitted successfully:", res.data);
      setResult(res.data);
      setSubmitted(true);
    })
    .catch((err) => {
      console.error("❌ Submission failed:", err.response?.data || err.message);
      alert("❌ Submission failed. Try again.");
    });
};

export default submitQuiz;
