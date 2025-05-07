"use server";

import {
  addMember,
  deleteTeamCover,
  deleteTeamLogo,
  saveTeam,
  updateTeamCover,
  updateTeamLogo,
} from "@/db/queries";
import { addMemberFormSchema, teamFormSchema } from "@/lib/validations";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

export async function teamFormAction(_prevState: unknown, formData: FormData) {
  const formDataEntries = Object.fromEntries(formData.entries());
  if (formDataEntries.whatsapp) {
    formDataEntries.whatsapp = (formDataEntries.whatsapp as string).replace(
      /\s+/g,
      "",
    );
  }

  const defaultValues = z.record(z.string(), z.string()).parse(formDataEntries);

  try {
    const data = teamFormSchema.parse(Object.fromEntries(formData));

    await saveTeam({
      stateId: data.stateId,
      name: data.name,
      description: data.description,
      socialLinks: {
        email: data.email,
        whatsapp: data.whatsapp,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        tiktok: data.tiktok,
      },
      founded: new Date(data.founded || Date.now()),
      isActive: data.isActive === "on",
    });

    return {
      defaultValues: {
        name: data.name,
        description: data.description,
        email: data.email,
        whatsapp: data.whatsapp,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        tiktok: data.tiktok,
        founded: data.founded,
        isActive: data.isActive,
      },
      success: true,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(", "),
          ]),
        ),
      };
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    };
  }
}

export async function addMemberFormAction(
  _prevState: unknown,
  formData: FormData,
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()));

  try {
    const data = addMemberFormSchema.parse(Object.fromEntries(formData));

    console.log("data", data);

    const specialties = data.specialties
      ? data.specialties.split(",").map((speciality) => speciality.trim())
      : null;

    await addMember({
      stateId: data.stateId,
      personId: data.personId,
      specialties,
      achievements: null,
    });

    revalidateTag("members");
    revalidateTag("members-gender-count");

    return {
      defaultValues: {
        stateId: data.stateId,
        personId: data.personId,
        specialties,
      },
      success: true,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(", "),
          ]),
        ),
      };
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    };
  }
}

export async function deleteTeamLogoAction(stateId: string) {
  try {
    await deleteTeamLogo({
      stateId,
    });

    revalidatePath(`/teams/${stateId}/manage`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete team logo in database");
    throw error;
  }
}

export async function deleteTeamCoverAction(stateId: string) {
  try {
    await deleteTeamCover({
      stateId,
    });

    revalidatePath(`/teams/${stateId}/manage`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete team cover in database");
    throw error;
  }
}

export async function updateTeamLogoAction(
  stateId: string,
  image: string | null,
) {
  try {
    await updateTeamLogo({
      stateId,
      image,
    });

    revalidatePath(`/teams/${stateId}/manage`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update team logo in database");
    throw error;
  }
}

export async function updateTeamCoverAction(
  stateId: string,
  coverImage: string | null,
) {
  try {
    await updateTeamCover({
      stateId,
      coverImage,
    });

    revalidatePath(`/teams/${stateId}/manage`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update team cover in database");
    throw error;
  }
}
