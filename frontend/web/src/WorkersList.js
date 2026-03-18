import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";

function WorkersList({ onRefresh }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await fetch(API_CONFIG.WORKERS_ENDPOINT, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este trabajador?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_CONFIG.WORKERS_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error al eliminar: ${res.status}`);
      }

      // Refresca la lista
      fetchWorkers();
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">Cargando trabajadores...</p>
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">No hay trabajadores registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Lista de Trabajadores ({workers.length})
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 m-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Oficio
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Tarifa
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr
                key={worker.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-900">{worker.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{worker.oficio}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{worker.telefono}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {worker.tarifa ? `$${worker.tarifa.toLocaleString()}` : "-"}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleDelete(worker.id)}
                    disabled={loading}
                    className="px-4 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkersList;