import Joi from "joi";

export const createWorkerSchema = Joi.object({
  userId: Joi.string().optional(),
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
  }),
  oficio: Joi.string().min(3).max(50).required().messages({
    "string.empty": "El oficio es obligatorio",
    "string.min": "El oficio debe tener al menos 3 caracteres",
  }),
  descripcion: Joi.string().max(500).optional(),
  experiencia: Joi.string().max(500).optional(),
  imagenes: Joi.array().items(Joi.string()).optional(),
  aliasPago: Joi.string().optional(),
  telefono: Joi.string()
    .pattern(/^[0-9]{6,}$/)
    .required()
    .messages({
      "string.empty": "El teléfono es obligatorio",
      "string.pattern.base": "El teléfono debe tener al menos 6 dígitos",
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
