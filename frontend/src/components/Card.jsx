import React from "react";

/**
 * Generic Card wrapper
 * props:
 *  - className: extra tailwind classes
 *  - children
 */
export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 border ${className}`}>
      {children}
    </div>
  );
}
