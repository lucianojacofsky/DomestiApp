import React from "react";

export function Card({ children, className = "", highlighted = false, dark = false }) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-sm transition-all ${
        highlighted
          ? "bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-800 dark:to-neutral-900 border border-primary-200 dark:border-primary-600 shadow-medium hover:shadow-lg"
          : dark
          ? "bg-neutral-800 border border-neutral-700 shadow-soft hover:shadow-medium"
          : "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-soft hover:shadow-medium"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-neutral-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 dark:border-neutral-700 flex gap-3 ${className}`}>
      {children}
    </div>
  );
}
