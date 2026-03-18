import React from "react";

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para acceder a esta página
          </p>
          <button
            onClick={() => (window.location.hash = "#login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
