// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from "./App";
// import "./index.css";

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

// main.jsx or index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";
import { AuthProvider } from './context/AuthContext'; // 👈 import this

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>   {/* ✅ wrap your app with context provider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
