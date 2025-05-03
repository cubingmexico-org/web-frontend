"use server"

import { teamFormSchema } from "@/lib/validations"
import { z } from "zod"

export async function teamFormAction(_prevState: unknown, formData: FormData) {
  const defaultValues = z.record(z.string(), z.string()).parse(Object.fromEntries(formData.entries()))

  try {
    const data = teamFormSchema.parse(Object.fromEntries(formData))

    console.log("data", data)

    return {
      defaultValues: {
        name: data.email,
        description: data.description,
        email: data.email,
        whatsapp: data.whatsapp,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        tiktok: data.tiktok,
        isActive: data.isActive,
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [key, value?.join(", ")]),
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}
