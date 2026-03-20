import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("login");

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage("dashboard");
    }

    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage("dashboard");
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentPage("login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <>
          {currentPage === "login" && (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setCurrentPage("register")}
            />
          )}
          {currentPage === "register" && (
            <Register
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setCurrentPage("login")}
            />
          )}
        </>
      ) : (
        <ProtectedRoute isAuthenticated={!!user}>
          <Dashboard user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      )}
    </>
  );
}

export default App;