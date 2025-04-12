// components/Button.js
import React from 'react';

function Button({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md  border-neutral-300  hover:-translate-y-1 transform transition duration-200 hover:shadow-md ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
