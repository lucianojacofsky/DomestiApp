import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";

function ProfessionalProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    oficio: "",
    descripcion: "",
    experiencia: "",
    tarifa: "",
    telefono: "",
    aliasPago: "",
    disponibilidad: "",
    dni: "",
    imagenes: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/workers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
      setFormData({
        nombre: data.nombre || "",
        oficio: data.oficio || "",
        descripcion: data.descripcion || "",
        experiencia: data.experiencia || "",
        tarifa: data.tarifa || "",
        telefono: data.telefono || "",
        aliasPago: data.aliasPago || "",
        disponibilidad: data.disponibilidad || "",
        dni: data.dni || "",
        imagenes: data.imagenes || [],
      });
    } catch (err) {
      setError("No se pudo cargar el perfil. Asegurate de tener un perfil profesional creado.");
    } finally {
      setLoading(false);
    }
  };

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
    setFormData((prev) => ({ ...prev, imagenes: [...(prev.imagenes || []), ...uploadedUrls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/workers/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      setProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600">Cargando perfil profesional...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil Profesional</h2>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Oficio / Especialidad</label>
          <input
            name="oficio"
            value={formData.oficio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia</label>
          <textarea
            name="experiencia"
            value={formData.experiencia}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarifa por hora</label>
            <input
              name="tarifa"
              type="number"
              value={formData.tarifa}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alias / Cuenta para cobros</label>
            <input
              name="aliasPago"
              value={formData.aliasPago}
              onChange={handleChange}
              placeholder="Ej: Alias MercadoPago"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
            <input
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
            <input
              name="disponibilidad"
              value={formData.disponibilidad}
              onChange={handleChange}
              placeholder="Ej: Lun-Vie 9-18"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fotos / Portafolio</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="w-full"
          />
          {formData.imagenes?.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {formData.imagenes.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`Portafolio ${idx + 1}`}
                    className="h-24 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {saving ? "Guardando..." : "Guardar Perfil"}
        </button>
      </form>
    </div>
  );
}

export default ProfessionalProfile;
