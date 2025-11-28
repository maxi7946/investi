import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Import all stylesheets from a single CSS entry point
import './styles/index.css';
 
const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Make sure your public/index.html has an element with id='root'.");
}
