// src/admin/AdminApp.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const isAdminLoggedIn = () => {
  return localStorage.getItem('adminLoggedIn') === 'true';
};

const AdminApp = () => {
  return (
    <Routes>
      {/* Redirect root ("/") based on login status */}
      <Route
        path="/"
        element={
          isAdminLoggedIn()
            ? <Navigate to="/AdminDashboard" replace />
            : <Navigate to="/admin/login" replace />
        }
      />

      {/* Admin login page */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin dashboard route */}
      <Route
        path="/AdminDashboard"
        element={
          isAdminLoggedIn()
            ? <AdminDashboard />
            : <Navigate to="/admin/login" replace />
        }
      />
    </Routes>
  );
};

export default AdminApp;
