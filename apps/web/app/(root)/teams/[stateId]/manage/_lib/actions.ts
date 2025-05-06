"use server";

import { db } from "@/db/index";
import { eq, inArray } from "drizzle-orm";
import { revalidateTag, unstable_noStore } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";
import { person, teamMember } from "@/db/schema";

// import type { CreateTaskSchema, UpdateTaskSchema } from "./validations";

// export async function updateTask(input: UpdateTaskSchema & { id: string }) {
//   unstable_noStore();
//   try {
//     const data = await db
//       .update(tasks)
//       .set({
//         title: input.title,
//         label: input.label,
//         status: input.status,
//         priority: input.priority,
//       })
//       .where(eq(tasks.id, input.id))
//       .returning({
//         status: tasks.status,
//         priority: tasks.priority,
//       })
//       .then(takeFirstOrThrow);

//     revalidateTag("tasks");
//     if (data.status === input.status) {
//       revalidateTag("task-status-counts");
//     }
//     if (data.priority === input.priority) {
//       revalidateTag("task-priority-counts");
//     }

//     return {
//       data: null,
//       error: null,
//     };
//   } catch (err) {
//     return {
//       data: null,
//       error: getErrorMessage(err),
//     };
//   }
// }

// export async function updateTasks(input: {
//   ids: string[];
//   label?: Task["label"];
//   status?: Task["status"];
//   priority?: Task["priority"];
// }) {
//   unstable_noStore();
//   try {
//     const data = await db
//       .update(tasks)
//       .set({
//         label: input.label,
//         status: input.status,
//         priority: input.priority,
//       })
//       .where(inArray(tasks.id, input.ids))
//       .returning({
//         status: tasks.status,
//         priority: tasks.priority,
//       })
//       .then(takeFirstOrThrow);

//     revalidateTag("tasks");
//     if (data.status === input.status) {
//       revalidateTag("task-status-counts");
//     }
//     if (data.priority === input.priority) {
//       revalidateTag("task-priority-counts");
//     }

//     return {
//       data: null,
//       error: null,
//     };
//   } catch (err) {
//     return {
//       data: null,
//       error: getErrorMessage(err),
//     };
//   }
// }

export async function deleteMember(input: { id: string }) {
  unstable_noStore();
  try {
    await db.transaction(async (tx) => {
      await tx.delete(teamMember).where(eq(teamMember.personId, input.id));
      await tx
        .update(person)
        .set({ stateId: null })
        .where(eq(person.id, input.id));
    });

    revalidateTag("members");
    revalidateTag("members-gender-count");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteMembers(input: { ids: string[] }) {
  unstable_noStore();
  try {
    await db.transaction(async (tx) => {
      console.log("Deleting members", input.ids);
      await tx
        .delete(teamMember)
        .where(inArray(teamMember.personId, input.ids));
      await tx
        .update(person)
        .set({ stateId: null })
        .where(inArray(person.id, input.ids));
    });

    revalidateTag("members");
    revalidateTag("members-gender-count");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.error("Error deleting members", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
