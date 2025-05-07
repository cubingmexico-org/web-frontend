import { z } from "zod";
import validator from "validator";

export const teamFormSchema = z.object({
  stateId: z.string(),
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(32, { message: "El nombre debe tener como máximo 32 caracteres" }),
  description: z
    .string()
    .max(1000, {
      message: "La descripción debe tener como máximo 1000 caracteres",
    })
    .nullable(),
  email: z
    .string()
    .refine(
      (value) =>
        value === null ||
        value === "" ||
        z.string().email().safeParse(value).success,
      {
        message: "Debe ser un correo electrónico válido",
      },
    )
    .optional(),
  whatsapp: z
    .string()
    .refine(
      (value) =>
        value === null || value === "" || validator.isMobilePhone(value),
      {
        message:
          "Debe ser un número de teléfono móvil válido, asegúrate que no contenga espacios",
      },
    )
    .optional(),
  facebook: z
    .string()
    .refine(
      (value) =>
        value === null ||
        value === "" ||
        z.string().url().safeParse(value).success,
      {
        message: "Debe ser una URL válida",
      },
    )
    .optional(),
  instagram: z
    .string()
    .refine(
      (value) =>
        value === null ||
        value === "" ||
        z.string().url().safeParse(value).success,
      {
        message: "Debe ser una URL válida",
      },
    )
    .optional(),
  twitter: z
    .string()
    .refine(
      (value) =>
        value === null ||
        value === "" ||
        z.string().url().safeParse(value).success,
      {
        message: "Debe ser una URL válida",
      },
    )
    .optional(),
  tiktok: z
    .string()
    .refine(
      (value) =>
        value === null ||
        value === "" ||
        z.string().url().safeParse(value).success,
      {
        message: "Debe ser una URL válida",
      },
    )
    .optional(),
  founded: z.string().optional(),
  isActive: z.string().optional(),
});

export const addMemberFormSchema = z.object({
  stateId: z.string(),
  personId: z.string().min(10, {
    message: "Selecciona una persona",
  }),
  specialties: z.string().optional(),
});
