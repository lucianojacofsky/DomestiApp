import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const SERVICE_CATEGORIES = [
  { icon: "🧹", title: "Limpieza integral", description: "Hogar, oficinas y limpiezas profundas con profesionales verificados." },
  { icon: "🔧", title: "Plomería y gas", description: "Reparaciones urgentes, instalaciones y mantenimiento preventivo." },
  { icon: "💡", title: "Electricidad", description: "Solución de fallas eléctricas, iluminación y tableros." },
  { icon: "🎨", title: "Pintura y acabados", description: "Interior, exterior y retoques de terminación profesional." },
];

function Landing({ onStartLogin, onStartRegister }) {
  return (
    <div className="landing-page min-h-screen">
      <header className="landing-header">
        <div>
          <p className="landing-tag">DomestiApp · Uber de servicios domésticos</p>
          <h1>Tu casa resuelta en minutos, con profesionales de confianza.</h1>
          <p>
            Publicá tu necesidad, compará presupuestos y contratá con pago seguro.
            Diseñado para clientes y profesionales en una sola plataforma.
          </p>
          <div className="landing-cta-row">
            <button type="button" className="btn btn-primary" onClick={onStartRegister}>
              Crear cuenta gratis
            </button>
            <button type="button" className="btn btn-secondary" onClick={onStartLogin}>
              Ya tengo cuenta
            </button>
          </div>
        </div>

        <div className="landing-hero-card">
          <h3>Cómo funciona</h3>
          <ul>
            <li>1. Publicás tu solicitud en menos de 2 minutos.</li>
            <li>2. Recibís propuestas y elegís al profesional ideal.</li>
            <li>3. Pagás de forma segura y calificás el servicio.</li>
          </ul>
        </div>
      </header>

      <section className="landing-services">
        <h2>Servicios más pedidos</h2>
        <div className="landing-services-grid">
          {SERVICE_CATEGORIES.map((category) => (
            <article key={category.title} className="landing-service-card">
              <span className="landing-service-icon">{category.icon}</span>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("landing");

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
    setCurrentPage("landing");
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
          {currentPage === "landing" && (
            <Landing
              onStartLogin={() => setCurrentPage("login")}
              onStartRegister={() => setCurrentPage("register")}
            />
          )}
          {currentPage === "login" && (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setCurrentPage("register")}
              onSwitchToLanding={() => setCurrentPage("landing")}
            />
          )}
          {currentPage === "register" && (
            <Register
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setCurrentPage("login")}
              onSwitchToLanding={() => setCurrentPage("landing")}
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
