import React from "react";

export function Alert({ children, type = "info", icon, className = "" }) {
  const types = {
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300",
  };

  const icons = {
    error: "⚠️",
    success: "✓",
    warning: "⚡",
    info: "ℹ️",
  };

  return (
    <div className={`p-4 border-l-4 rounded-lg flex items-center gap-3 font-medium text-sm animate-fade-in ${types[type]} ${className}`}>
      <span className="text-lg flex-shrink-0">{icon || icons[type]}</span>
      <div>{children}</div>
    </div>
  );
}
