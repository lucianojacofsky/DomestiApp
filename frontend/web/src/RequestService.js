import React, { useState } from "react";
import API_CONFIG from "./config/api.js";
import { Card, CardHeader, CardBody, CardFooter } from "./components/UI/Card";
import { Input, Textarea } from "./components/UI/Input";
import { Button } from "./components/UI/Button";
import { Alert } from "./components/UI/Alert";
import { useTheme } from "./context/ThemeContext.js";

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
  const [fieldErrors, setFieldErrors] = useState({});
  const { isDark } = useTheme();

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    switch (name) {
      case "tipoServicio":
        if (!value.trim() || value.length < 3) {
          errors.tipoServicio = "El tipo de servicio debe tener al menos 3 caracteres";
        } else {
          delete errors.tipoServicio;
        }
        break;
      case "descripcion":
        if (!value.trim() || value.length < 10) {
          errors.descripcion = "La descripción debe tener al menos 10 caracteres";
        } else {
          delete errors.descripcion;
        }
        break;
      case "ubicacion":
        if (!value.trim()) {
          errors.ubicacion = "La ubicación es requerida";
        } else {
          delete errors.ubicacion;
        }
        break;
      default:
        break;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
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
    <Card className="w-full">
      <CardHeader>
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          📋 Solicitar Servicio
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
          Describe el trabajo que necesitas realizar
        </p>
      </CardHeader>

      <CardBody className="space-y-6">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">¡Solicitud creada exitosamente!</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="🔧 Tipo de Servicio"
            icon="🛠️"
            type="text"
            name="tipoServicio"
            placeholder="Ej: Plomería, Electricidad, Pintura"
            value={formData.tipoServicio}
            onChange={handleChange}
            error={fieldErrors.tipoServicio}
            disabled={loading}
            dark={isDark}
            required
          />

          <Textarea
            label="📝 Descripción del Trabajo"
            name="descripcion"
            placeholder="Describe detalladamente el servicio que necesitas..."
            value={formData.descripcion}
            onChange={handleChange}
            error={fieldErrors.descripcion}
            disabled={loading}
            dark={isDark}
            rows="5"
            required
          />

          <Input
            label="📍 Ubicación"
            icon="📌"
            type="text"
            name="ubicacion"
            placeholder="Ej: Calle principal 123, Apartamento 5"
            value={formData.ubicacion}
            onChange={handleChange}
            error={fieldErrors.ubicacion}
            disabled={loading}
            dark={isDark}
            required
          />

          {/* Fotos */}
          <div className="flex flex-col gap-2">
            <label className={`block text-sm font-semibold ${
              isDark 
                ? "text-neutral-200" 
                : "text-gray-700"
            }`}>
              📸 Fotos del problema (opcional)
            </label>
            <div className={`px-4 py-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
              isDark
                ? "border-neutral-600 hover:border-primary-500 hover:bg-neutral-700/50"
                : "border-gray-300 hover:border-primary-500 hover:bg-primary-50"
            }`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                disabled={loading}
                className="opacity-0 w-full h-full cursor-pointer"
              />
              <div className={`pointer-events-none ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                <p className="text-lg mb-1">📷 Haz clic o arrastra imágenes</p>
                <p className="text-xs">PNG, JPG, GIF hasta 5MB</p>
              </div>
            </div>
            {formData.fotos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {formData.fotos.map((src, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden">
                    <img
                      src={src}
                      alt={`Foto ${idx + 1}`}
                      className="h-24 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xl">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid de presupuesto y fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="💰 Presupuesto (Opcional)"
              icon="💵"
              type="number"
              name="presupuestoOferido"
              placeholder="Ej: 50000"
              value={formData.presupuestoOferido}
              onChange={handleChange}
              disabled={loading}
              dark={isDark}
            />

            <Input
              label="📅 Fecha Deseada (Opcional)"
              icon="🗓️"
              type="date"
              name="fechaCompromiso"
              value={formData.fechaCompromiso}
              onChange={handleChange}
              disabled={loading}
              dark={isDark}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || Object.keys(fieldErrors).length > 0}
            loading={loading}
            className="w-full"
          >
            {loading ? "Creando solicitud..." : "✓ Crear Solicitud"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

export default RequestService;
