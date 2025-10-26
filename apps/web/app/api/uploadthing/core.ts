import { auth } from "@/auth";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter: FileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError("Unauthorized");

      // Extract stateId from the request headers or query parameters
      const stateId = req.headers.get("x-state-id") ?? "";
      if (!stateId) throw new UploadThingError("Missing stateId");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user?.id, stateId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { stateId: metadata.stateId, image: file.ufsUrl };
    }),
  coverUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError("Unauthorized");

      // Extract stateId from the request headers or query parameters
      const stateId = req.headers.get("x-state-id") ?? "";
      if (!stateId) throw new UploadThingError("Missing stateId");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user?.id, stateId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { stateId: metadata.stateId, coverImage: file.ufsUrl };
    }),
};

export type OurFileRouter = typeof ourFileRouter;
