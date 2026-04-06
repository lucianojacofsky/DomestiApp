import React from "react";

export function Badge({ children, variant = "primary", icon, className = "" }) {
  const variants = {
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700",
    success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700",
    secondary: "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-700",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
