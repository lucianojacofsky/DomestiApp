import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";

function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    telefono: "",
    metodosPago: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setFormData({
        nombre: data.nombre || "",
        ubicacion: data.ubicacion || "",
        telefono: data.telefono || "",
        metodosPago: data.metodosPago || [],
      });
    } catch (err) {
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetodoPagoChange = (index, field, value) => {
    setFormData((prev) => {
      const metodos = [...(prev.metodosPago || [])];
      if (!metodos[index]) metodos[index] = { tipo: "mercadopago", alias: "" };
      metodos[index][field] = value;
      return { ...prev, metodosPago: metodos };
    });
  };

  const addMetodoPago = () => {
    setFormData((prev) => ({
      ...prev,
      metodosPago: [...(prev.metodosPago || []), { tipo: "mercadopago", alias: "" }],
    }));
  };

  const removeMetodoPago = (index) => {
    setFormData((prev) => ({
      ...prev,
      metodosPago: prev.metodosPago.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Perfil actualizado
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
          <input
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">Métodos de pago</label>
            <button
              type="button"
              onClick={addMetodoPago}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              + Agregar
            </button>
          </div>

          {(formData.metodosPago || []).map((mp, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <select
                value={mp.tipo}
                onChange={(e) => handleMetodoPagoChange(index, "tipo", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mercadopago">MercadoPago</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </select>
              <input
                value={mp.alias}
                onChange={(e) => handleMetodoPagoChange(index, "alias", e.target.value)}
                placeholder="Alias / Cuenta"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent col-span-2"
              />
              <button
                type="button"
                onClick={() => removeMetodoPago(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {saving ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
