import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js'; // Ensure App.js exists and is correctly defined
import reportWebVitals from './reportWebVitals.js'; // Ensure this file exists

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Measure performance in your app
reportWebVitals(console.log); // You can log results here if desired
