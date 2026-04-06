import React from "react";

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  loading = false,
  ...props 
}) {
  const baseStyle = "font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg disabled:opacity-50",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-md hover:shadow-lg disabled:opacity-50",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-neutral-800 disabled:opacity-50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg disabled:opacity-50",
    ghost: "text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-neutral-800 disabled:opacity-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
