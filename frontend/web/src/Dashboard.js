import React, { useState } from "react";
import WorkerForm from "./WorkerForm";
import WorkersList from "./WorkersList";
import RequestService from "./RequestService";
import ServicesList from "./ServicesList";
import TransactionsList from "./TransactionsList";
import Chat from "./Chat.js";
import ProfessionalProfile from "./ProfessionalProfile";
import UserProfile from "./UserProfile";

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("servicios");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRequestCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DomestiApp</h1>
            <p className="text-gray-600">Bienvenido, {user?.nombre}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-2">
              Rol: <span className="font-semibold capitalize">{user?.rol}</span>
            </p>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {/* Navegación de tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("servicios")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "servicios"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Solicitudes de Servicios
            </button>
            <button
              onClick={() => setActiveTab("solicitar")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "solicitar"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Solicitar Servicio
            </button>
            <button
              onClick={() => setActiveTab("transacciones")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transacciones"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Transacciones
            </button>
            <button
              onClick={() => setActiveTab("perfil")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "perfil"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Perfil
            </button>
            {user?.rol === "profesional" && (
              <button
                onClick={() => setActiveTab("trabajadores")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "trabajadores"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Mi Perfil
              </button>
            )}
          </nav>
        </div>

        {/* Contenido por tab */}
        <div className="space-y-8">
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
            <div className="space-y-8">
              {user?.rol === "profesional" ? (
                <ProfessionalProfile />
              ) : (
                <UserProfile />
              )}
            </div>
          )}

          {activeTab === "trabajadores" && user?.rol === "profesional" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <WorkerForm onWorkerAdded={() => {}} />
              <div className="md:col-span-2">
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
