import React, { useState } from "react";
import API_CONFIG from "./config/api.js";

function RequestService({ onRequestCreated }) {
  const [formData, setFormData] = useState({
    tipoServicio: "",
    descripcion: "",
    ubicacion: "",
    fotos: [],
    presupuestoOferido: "",
    fechaCompromiso: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    const dataUrls = await Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    );
    const token = localStorage.getItem("token");
    const uploadedUrls = await Promise.all(
      dataUrls.map(async (dataUrl) => {
        const res = await fetch(`${API_CONFIG.BASE_URL}/uploads-api/base64-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dataUrl }),
        });
        if (!res.ok) throw new Error("No se pudo subir una imagen");
        const data = await res.json();
        return `${API_CONFIG.BASE_URL}${data.url}`;
      })
    );
    setFormData((prev) => ({ ...prev, fotos: uploadedUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_CONFIG.BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.messages)) {
          throw new Error(data.messages.join(", "));
        }
        throw new Error(data.error || `Error ${res.status}`);
      }

      onRequestCreated(data);
      setFormData({
        tipoServicio: "",
        descripcion: "",
        ubicacion: "",
        fotos: [],
        presupuestoOferido: "",
        fechaCompromiso: "",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Solicitar Servicio</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Solicitud creada exitosamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Servicio
          </label>
          <input
            type="text"
            name="tipoServicio"
            value={formData.tipoServicio}
            onChange={handleChange}
            placeholder="Ej: Plomería, Electricidad, Pintura"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Trabajo
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe detalladamente el servicio que necesitas"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Calle principal 123, Apartamento 5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos del problema (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="w-full"
            disabled={loading}
          />
          {formData.fotos.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {formData.fotos.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Foto ${idx + 1}`}
                  className="h-20 w-full object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Presupuesto (Opcional)
            </label>
            <input
              type="number"
              name="presupuestoOferido"
              value={formData.presupuestoOferido}
              onChange={handleChange}
              placeholder="Ej: 50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Deseada (Opcional)
            </label>
            <input
              type="date"
              name="fechaCompromiso"
              value={formData.fechaCompromiso}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? "Creando solicitud..." : "Crear Solicitud"}
        </button>
      </form>
    </div>
  );
}

export default RequestService;
