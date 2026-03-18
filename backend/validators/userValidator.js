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

export const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false });
};
