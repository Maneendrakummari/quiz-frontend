// src/admin/adminIndex.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp'; // Must exist
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AdminApp />
  </BrowserRouter>
);
