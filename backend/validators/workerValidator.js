import Joi from "joi";

export const createWorkerSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
  }),
  oficio: Joi.string().min(3).max(50).required().messages({
    "string.empty": "El oficio es obligatorio",
    "string.min": "El oficio debe tener al menos 3 caracteres",
  }),
  telefono: Joi.string()
    .pattern(/^[0-9]{10,}$/)
    .required()
    .messages({
      "string.empty": "El teléfono es obligatorio",
      "string.pattern.base": "El teléfono debe tener al menos 10 dígitos",
    }),
  tarifa: Joi.number().positive().optional().messages({
    "number.positive": "La tarifa debe ser un número positivo",
  }),
  disponibilidad: Joi.string().optional(),
  dni: Joi.string().optional(),
});

export const validateWorker = (data) => {
  return createWorkerSchema.validate(data, { abortEarly: false });
};
