import Joi from "joi";

export const registerSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
  }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "Formato de email inválido",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "La contraseña es obligatoria",
      "string.min": "La contraseña debe tener al menos 6 caracteres",
    }),
  rol: Joi.string()
    .valid("cliente", "profesional", "admin")
    .default("cliente")
    .messages({
      "any.only": "El rol debe ser: cliente, profesional o admin",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "Formato de email inválido",
    }),
  password: Joi.string()
    .required()
    .messages({
      "string.empty": "La contraseña es obligatoria",
    }),
});

export const validateRegister = (data) => {
  return registerSchema.validate(data, { abortEarly: false });
};

export const validateProfileUpdate = (data) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).max(100).optional().messages({
      "string.min": "El nombre debe tener al menos 3 caracteres",
      "string.max": "El nombre no puede exceder 100 caracteres",
    }),
    ubicacion: Joi.string().min(3).max(150).optional().messages({
      "string.min": "La ubicación debe tener al menos 3 caracteres",
      "string.max": "La ubicación no puede exceder 150 caracteres",
    }),
    telefono: Joi.string().pattern(/^[0-9]{6,}$/).optional().messages({
      "string.pattern.base": "El teléfono debe contener solo números y al menos 6 dígitos",
    }),
    metodosPago: Joi.array().items(
      Joi.object({
        tipo: Joi.string().valid("mercadopago", "efectivo", "transferencia").required(),
        alias: Joi.string().required(),
      })
    ).optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false });
};
