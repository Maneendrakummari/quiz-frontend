import React, { useEffect, useState } from "react";

const QuizResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
 fetch(`${process.env.REACT_APP_API_URL}/api/questions/results`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error("Error loading quiz results:", err));
  }, []);

  return (
    <div>
      <h2>Quiz Results</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <strong>{result.username}</strong>: {result.correctAnswers}/
              {result.totalQuestions} (
              {result.scorePercentage.toFixed(2)}%) -{" "}
              {new Date(result.submittedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizResults;
