import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";

function TransactionsList({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_CONFIG.BASE_URL}/payments/transactions/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (estado) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800",
      aprobada: "bg-green-100 text-green-800",
      rechazada: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600">Cargando transacciones...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Historial de Pagos</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 m-4 rounded-lg">
          {error}
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">No hay transacciones para mostrar</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Servicio ID: {transaction.servicioId}
                  </h3>
                  <p className="text-gray-600">
                    {user.rol === "cliente" ? "Profesional" : "Cliente"}: {user.rol === "cliente" ? transaction.profesionalId : transaction.clienteId}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    📅 {new Date(transaction.fecha).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeColor(
                    transaction.estado
                  )}`}
                >
                  {transaction.estado}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Monto Total</p>
                  <p className="font-semibold">${transaction.montoTotal}</p>
                </div>
                <div>
                  <p className="text-gray-600">Comisión Plataforma</p>
                  <p className="font-semibold text-red-600">${transaction.montoComision}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pago Profesional</p>
                  <p className="font-semibold text-green-600">${transaction.montoProfesional}</p>
                </div>
                <div>
                  <p className="text-gray-600">ID Transacción</p>
                  <p className="font-semibold text-xs">{transaction.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionsList;