// components/Button.js
import React from 'react';

function Button({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
