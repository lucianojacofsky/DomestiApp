import React, { useState } from "react";
import API_CONFIG from "./config/api.js";

function WorkerForm({ onWorkerAdded }) {
  const [nombre, setNombre] = useState("");
  const [oficio, setOficio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validación básica en frontend
    if (!nombre.trim() || nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!oficio.trim() || oficio.length < 3) {
      setError("El oficio debe tener al menos 3 caracteres");
      return;
    }

    if (!/^\d{10,}$/.test(telefono)) {
      setError("El teléfono debe tener al menos 10 dígitos");
      return;
    }

    const newWorker = {
      nombre: nombre.trim(),
      oficio: oficio.trim(),
      telefono,
      tarifa: tarifa ? parseFloat(tarifa) : null,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(API_CONFIG.WORKERS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newWorker),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error ${res.status}`);
      }

      const savedWorker = await res.json();
      onWorkerAdded(savedWorker);

      setNombre("");
      setOficio("");
      setTelefono("");
      setTarifa("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Agregar Trabajador</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Trabajador agregado exitosamente
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Oficio
          </label>
          <input
            type="text"
            placeholder="Ej: Plomero, Electricista"
            value={oficio}
            onChange={(e) => setOficio(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            placeholder="Ej: 1234567890"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tarifa (Opcional)
          </label>
          <input
            type="number"
            placeholder="Ej: 50000"
            value={tarifa}
            onChange={(e) => setTarifa(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

export default WorkerForm;