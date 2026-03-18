import Joi from "joi";

export const createServiceRequestSchema = Joi.object({
  tipoServicio: Joi.string().min(3).max(50).required().messages({
    "string.empty": "El tipo de servicio es obligatorio",
    "string.min": "El tipo de servicio debe tener al menos 3 caracteres",
  }),
  descripcion: Joi.string().min(10).max(500).required().messages({
    "string.empty": "La descripción es obligatoria",
    "string.min": "La descripción debe tener al menos 10 caracteres",
  }),
  ubicacion: Joi.string().min(5).max(150).required().messages({
    "string.empty": "La ubicación es obligatoria",
    "string.min": "La ubicación debe tener al menos 5 caracteres",
  }),
  presupuestoOferido: Joi.number().positive().optional().messages({
    "number.positive": "El presupuesto debe ser un número positivo",
  }),
  fechaCompromiso: Joi.date().iso().optional().messages({
    "date.base": "Debe ser una fecha válida",
  }),
});

export const updateServiceRequestSchema = Joi.object({
  estado: Joi.string()
    .valid("pendiente", "aceptado", "en_progreso", "completado", "cancelado")
    .optional()
    .messages({
      "any.only": "Estado inválido",
    }),
  profesionalId: Joi.string().optional(),
  presupuestoOferido: Joi.number().positive().optional(),
  fechaCompromiso: Joi.date().iso().optional(),
  calificacion: Joi.number().min(1).max(5).optional(),
  comentario: Joi.string().max(500).optional(),
});

export const validateCreateServiceRequest = (data) => {
  return createServiceRequestSchema.validate(data, { abortEarly: false });
};

export const validateUpdateServiceRequest = (data) => {
  return updateServiceRequestSchema.validate(data, { abortEarly: false });
};
