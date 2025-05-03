import { z } from "zod"
import validator from "validator";

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(32, { message: "El nombre debe tener como máximo 32 caracteres" }),
  description: z
    .string()
    .max(1000, { message: "La descripción debe tener como máximo 1000 caracteres" })
    .nullable(),
  email: z
    .string()
    .email({ message: "Debe ser un correo electrónico válido" })
    .optional()
    .nullable(),
  whatsapp: z
    .string()
    .refine(validator.isMobilePhone, { message: "Debe ser un número de teléfono móvil válido" })
    .optional()
    .nullable(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  tiktok: z.string().optional(),
  isActive: z.string(),
})
