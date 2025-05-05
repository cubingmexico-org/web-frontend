"use client";

import { Button } from "@workspace/ui/components/button";
import {
  FileUpload,
  FileUploadTrigger,
} from "@workspace/ui/components/file-upload";
import { Upload } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { uploadFiles } from "@/lib/uploadthing";
import { UploadThingError } from "uploadthing/server";

export function CoverUploader({ stateId }: { stateId: string }) {
  const [isUploading, setIsUploading] = React.useState(false);

  const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
      }: {
        onProgress: (file: File, progress: number) => void;
      },
    ) => {
      try {
        setIsUploading(true);

        const file = files[0];
        const renamedFile = new File([file!], `${stateId}-cover`!, {
          type: file?.type,
        });

        await uploadFiles("coverUploader", {
          files: [renamedFile],
          onUploadProgress: ({ file, progress }) => {
            onProgress(file, progress);
          },
          headers: {
            "x-state-id": stateId,
          },
        });

        toast.success("Imagen subida correctamente");
      } catch (error) {
        setIsUploading(false);

        if (error instanceof UploadThingError) {
          const errorMessage =
            error.data && "error" in error.data
              ? error.data.error
              : "Falló la carga del archivo";
          toast.error(errorMessage);
          return;
        }

        toast.error(
          error instanceof Error ? error.message : "Error desconocido",
        );
      } finally {
        setIsUploading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" ha sido rechazado`,
    });
  }, []);

  return (
    <FileUpload
      accept="image/*"
      maxFiles={1}
      maxSize={4 * 1024 * 1024}
      onUpload={(files, options) => onUpload(files, options)}
      onFileReject={onFileReject}
      multiple={false}
      disabled={isUploading}
    >
      <FileUploadTrigger asChild>
        <Button className="mx-4" type="button" variant="outline" size="sm">
          <Upload />
          Cambiar
        </Button>
      </FileUploadTrigger>
    </FileUpload>
  );
}
