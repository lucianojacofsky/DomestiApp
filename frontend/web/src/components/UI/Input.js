import React from "react";

export function Input({ 
  label, 
  error, 
  icon, 
  className = "", 
  disabled = false,
  dark = false,
  ...props 
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={`block text-sm font-semibold ${
          dark 
            ? "text-neutral-200" 
            : "text-gray-700"
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg`}>
            {icon}
          </span>
        )}
        <input
          className={`w-full px-${icon ? "10" : "4"} py-3 border-2 rounded-xl transition-all font-medium ${
            dark
              ? "bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 hover:bg-gray-100 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
          } ${error ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-600" : ""} ${className}`}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 flex items-center gap-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}

export function Textarea({ 
  label, 
  error, 
  className = "", 
  disabled = false,
  dark = false,
  ...props 
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={`block text-sm font-semibold ${
          dark 
            ? "text-neutral-200" 
            : "text-gray-700"
        }`}>
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all font-medium resize-vertical ${
          dark
            ? "bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 hover:bg-gray-100 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
        } ${error ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-600" : ""} ${className}`}
        disabled={disabled}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500 flex items-center gap-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}

export function Select({ 
  label, 
  error, 
  options = [], 
  className = "",
  disabled = false,
  dark = false,
  ...props 
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={`block text-sm font-semibold ${
          dark 
            ? "text-neutral-200" 
            : "text-gray-700"
        }`}>
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all font-medium appearance-none bg-no-repeat ${
          dark
            ? "bg-neutral-700 border-neutral-600 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
        } ${error ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-600" : ""} ${className}`}
        disabled={disabled}
        {...props}
      >
        <option value="">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-medium text-red-500 flex items-center gap-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}
