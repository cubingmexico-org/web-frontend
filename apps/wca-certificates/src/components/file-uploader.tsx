/* eslint-disable react/no-array-index-key -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
"use client"

import * as React from "react"
import Image from "next/image"
import { X, UploadIcon } from "lucide-react"
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone"
import { toast } from "sonner"
import { Button } from "@repo/ui/button"
import { Progress } from "@repo/ui/progress"
import { ScrollArea } from "@repo/ui/scroll-area"
import { cn } from "@repo/ui/utils"
import { formatBytes } from "@/lib/utils"
import { useControllableState } from "@/hooks/use-controllable-state"

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[]
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>
  onUpload?: (files: File[]) => Promise<void>
  progresses?: Record<string, number>
  accept?: DropzoneProps["accept"]
  maxSize?: DropzoneProps["maxSize"]
  maxFiles?: DropzoneProps["maxFiles"]
  multiple?: boolean
  disabled?: boolean
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  })

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error("No se puede subir más de 1 archivo a la vez")
        return
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`No se pueden subir más de ${maxFiles} archivos`)
        return
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`El archivo ${file.name} fue rechazado`)
        })
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

        toast.promise(onUpload(updatedFiles), {
          loading: `Subiendo ${target}...`,
          success: () => {
            setFiles([])
            return `${target} uploaded`
          },
          error: `Falló la subida de ${target}`,
        })
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles]
  )

  function onRemove(index: number) {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onValueChange?.(newFiles)
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file: File) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- .
  }, [])

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        accept={accept}
        disabled={isDisabled}
        maxFiles={maxFiles}
        maxSize={maxSize}
        multiple={maxFiles > 1 || multiple}
        onDrop={onDrop}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50",
              isDisabled && "pointer-events-none opacity-60",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    aria-hidden="true"
                    className="size-7 text-muted-foreground"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  Suelta los archivos aquí
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    aria-hidden="true"
                    className="size-7 text-muted-foreground"
                  />
                </div>
                <div className="space-y-px">
                  <p className="font-medium text-muted-foreground">
                    Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Puedes subir
                    {maxFiles > 1
                      ? ` ${maxFiles === Infinity ? "múltiples" : maxFiles}
                      archivos (hasta ${formatBytes(maxSize)} cada uno)`
                      : ` un archivo de ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files.map((file: File, index: number) => (
              <FileCard
                file={file}
                key={index}
                onRemove={() => { onRemove(index); }}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}

interface FileCardProps {
  file: File
  onRemove: () => void
  progress?: number
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            alt={file.name}
            className="aspect-square shrink-0 rounded-md object-cover"
            height={48}
            loading="lazy"
            src={file.preview}
            width={48}
          />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="size-7"
          onClick={onRemove}
          size="icon"
          type="button"
          variant="outline"
        >
          <X aria-hidden="true" className="size-4 " />
          <span className="sr-only">Eliminar archivo</span>
        </Button>
      </div>
    </div>
  )
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string"
}