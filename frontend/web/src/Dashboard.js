import React, { useState } from "react";
import WorkerForm from "./WorkerForm";
import WorkersList from "./WorkersList";
import RequestService from "./RequestService";
import ServicesList from "./ServicesList";
import TransactionsList from "./TransactionsList";
import ProfessionalProfile from "./ProfessionalProfile";
import UserProfile from "./UserProfile";
import AdminPanel from "./AdminPanel";
import { useTheme } from "./context/ThemeContext.js";

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(
    user?.rol === "admin" ? "admin" : "servicios"
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const { isDark, toggleTheme } = useTheme();

  const handleRequestCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? "bg-gradient-to-br from-neutral-900 via-neutral-900 to-primary-900" 
        : "bg-gradient-to-br from-primary-50 via-white to-secondary-50"
    }`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors ${
        isDark 
          ? "bg-neutral-800/90 border-neutral-700" 
          : "bg-white/90 border-primary-100"
      } border-b shadow-soft`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                🏠 DomestiApp
              </h1>
              <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Bienvenido, <span className="font-semibold">{user?.nombre}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all ${
                  isDark
                    ? "bg-neutral-700 hover:bg-neutral-600 text-yellow-300"
                    : "bg-primary-100 hover:bg-primary-200 text-primary-600"
                }`}
                title={isDark ? "Modo claro" : "Modo oscuro"}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
              <div className={`h-8 w-px ${isDark ? "bg-neutral-700" : "bg-primary-200"}`} />
              <div className="text-right">
                <p className={`text-xs font-semibold ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Rol: <span className="capitalize text-primary-600 dark:text-primary-400">{user?.rol}</span>
                </p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg active:scale-95"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tabs mejorados */}
        <div className="mb-8">
          <div className={`rounded-2xl p-1 inline-flex gap-1 flex-wrap ${
            isDark ? "bg-neutral-800" : "bg-white"
          } shadow-soft`}>
            <button
              onClick={() => setActiveTab("servicios")}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === "servicios"
                  ? isDark
                    ? "bg-primary-600 text-white shadow-glow"
                    : "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium"
                  : isDark
                  ? "text-neutral-400 hover:text-neutral-200"
                  : "text-neutral-600 hover:text-primary-600"
              }`}
            >
              <span className="mr-1">📋</span>Solicitudes
            </button>
            {user?.rol === "cliente" && (
              <button
                onClick={() => setActiveTab("solicitar")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === "solicitar"
                    ? isDark
                      ? "bg-primary-600 text-white shadow-glow"
                      : "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium"
                    : isDark
                    ? "text-neutral-400 hover:text-neutral-200"
                    : "text-neutral-600 hover:text-primary-600"
                }`}
              >
                <span className="mr-1">➕</span>Solicitar
              </button>
            )}
            {(user?.rol === "cliente" || user?.rol === "profesional") && (
              <button
                onClick={() => setActiveTab("transacciones")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === "transacciones"
                    ? isDark
                      ? "bg-primary-600 text-white shadow-glow"
                      : "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium"
                    : isDark
                    ? "text-neutral-400 hover:text-neutral-200"
                    : "text-neutral-600 hover:text-primary-600"
                }`}
              >
                <span className="mr-1">💰</span>Transacciones
              </button>
            )}
            {user?.rol !== "admin" && (
              <button
                onClick={() => setActiveTab("perfil")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === "perfil"
                    ? isDark
                      ? "bg-primary-600 text-white shadow-glow"
                      : "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium"
                    : isDark
                    ? "text-neutral-400 hover:text-neutral-200"
                    : "text-neutral-600 hover:text-primary-600"
                }`}
              >
                <span className="mr-1">👤</span>Perfil
              </button>
            )}
            {user?.rol === "profesional" && (
              <button
                onClick={() => setActiveTab("trabajadores")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === "trabajadores"
                    ? isDark
                      ? "bg-primary-600 text-white shadow-glow"
                      : "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium"
                    : isDark
                    ? "text-neutral-400 hover:text-neutral-200"
                    : "text-neutral-600 hover:text-primary-600"
                }`}
              >
                <span className="mr-1">🛠️</span>Mi Perfil
              </button>
            )}
            {user?.rol === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === "admin"
                    ? isDark
                      ? "bg-primary-600 text-white shadow-glow"
                      : "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium"
                    : isDark
                    ? "text-neutral-400 hover:text-neutral-200"
                    : "text-neutral-600 hover:text-primary-600"
                }`}
              >
                <span className="mr-1">⚙️</span>Admin
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "servicios" && (
            <ServicesList key={refreshKey} user={user} />
          )}

          {activeTab === "solicitar" && user?.rol === "cliente" && (
            <RequestService onRequestCreated={handleRequestCreated} />
          )}

          {activeTab === "transacciones" && (
            <TransactionsList user={user} />
          )}

          {activeTab === "perfil" && (
            <div>
              {user?.rol === "profesional" ? (
                <ProfessionalProfile />
              ) : (
                <UserProfile />
              )}
            </div>
          )}

          {activeTab === "trabajadores" && user?.rol === "profesional" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WorkerForm onWorkerAdded={() => {}} />
              </div>
              <div className="lg:col-span-2">
                <WorkersList />
              </div>
            </div>
          )}

          {activeTab === "solicitar" && user?.rol !== "cliente" && (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">
                Solo los clientes pueden solicitar servicios
              </p>
            </div>
          )}

          {activeTab === "admin" && user?.rol === "admin" && <AdminPanel />}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
