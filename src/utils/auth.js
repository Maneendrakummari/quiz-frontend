// src/utils/auth.js
export const logout = () => {
  localStorage.clear(); // Remove all stored session data
  window.location.href = "/login"; // Redirect to login page
};
