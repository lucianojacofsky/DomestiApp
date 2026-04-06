import React, { useState } from "react";
import API_CONFIG from "./config/api.js";
import { Card, CardHeader, CardBody, CardFooter } from "./components/UI/Card";
import { Input } from "./components/UI/Input";
import { Button } from "./components/UI/Button";
import { Alert } from "./components/UI/Alert";
import { useTheme } from "./context/ThemeContext.js";

function WorkerForm({ onWorkerAdded }) {
  const [nombre, setNombre] = useState("");
  const [oficio, setOficio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { isDark } = useTheme();

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    switch (name) {
      case "nombre":
        if (!value.trim() || value.length < 3) {
          errors.nombre = "El nombre debe tener al menos 3 caracteres";
        } else {
          delete errors.nombre;
        }
        break;
      case "oficio":
        if (!value.trim() || value.length < 3) {
          errors.oficio = "El oficio debe tener al menos 3 caracteres";
        } else {
          delete errors.oficio;
        }
        break;
      case "telefono":
        if (!/^\d{10,}$/.test(value)) {
          errors.telefono = "El teléfono debe tener al menos 10 dígitos";
        } else {
          delete errors.telefono;
        }
        break;
      case "tarifa":
        if (value && isNaN(parseFloat(value))) {
          errors.tarifa = "La tarifa debe ser un número válido";
        } else {
          delete errors.tarifa;
        }
        break;
      default:
        break;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "nombre":
        setNombre(value);
        break;
      case "oficio":
        setOficio(value);
        break;
      case "telefono":
        setTelefono(value);
        break;
      case "tarifa":
        setTarifa(value);
        break;
      default:
        break;
    }
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validar todos los campos
    if (!validateField("nombre", nombre) || !validateField("oficio", oficio) || !validateField("telefono", telefono)) {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          👷 Agregar Trabajador
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
          Registra un nuevo profesional en tu red
        </p>
      </CardHeader>

      <CardBody className="space-y-6">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">¡Trabajador agregado exitosamente!</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="📝 Nombre Completo"
            icon="👤"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            error={fieldErrors.nombre}
            disabled={loading}
            dark={isDark}
            required
          />

          <Input
            label="🔧 Oficio"
            icon="⚙️"
            type="text"
            placeholder="Ej: Plomero, Electricista"
            value={oficio}
            onChange={(e) => handleChange("oficio", e.target.value)}
            error={fieldErrors.oficio}
            disabled={loading}
            dark={isDark}
            required
          />

          <Input
            label="📞 Teléfono"
            icon="☎️"
            type="tel"
            placeholder="Ej: 1234567890"
            value={telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            error={fieldErrors.telefono}
            disabled={loading}
            dark={isDark}
            required
          />

          <Input
            label="💰 Tarifa (Opcional)"
            icon="💵"
            type="number"
            placeholder="Ej: 50000"
            value={tarifa}
            onChange={(e) => handleChange("tarifa", e.target.value)}
            error={fieldErrors.tarifa}
            disabled={loading}
            dark={isDark}
          />

          <Button
            type="submit"
            disabled={loading || Object.keys(fieldErrors).length > 0}
            loading={loading}
            className="w-full"
          >
            {loading ? "Guardando..." : "✓ Guardar Trabajador"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

export default WorkerForm;