"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

export type ProductImage = {
  id?: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

type ProductImageUploadProps = {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  disabled?: boolean;
};

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function normalizeImages(images: ProductImage[]) {
  return images.map((image, index) => ({
    ...image,
    sortOrder: index,
    isPrimary: index === 0,
  }));
}

function isValidImage(file: File) {
  return file.type.startsWith("image/");
}

export function ProductImageUpload({
  images,
  onChange,
  disabled = false,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const canUpload =
    !disabled &&
    !isUploading &&
    images.length < MAX_IMAGES;

  function openFilePicker() {
    if (!canUpload) return;

    inputRef.current?.click();
  }

  async function uploadFile(file: File) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", "products");

    const response = await fetch(
      "/api/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error ?? "Unable to upload image."
      );
    }

    return result.url as string;
  }

  async function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) return;

    setError("");

    const remainingSlots =
      MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      );

      event.target.value = "";
      return;
    }

    const filesToUpload = files.slice(
      0,
      remainingSlots
    );

    const invalidFile = filesToUpload.find(
      (file) => !isValidImage(file)
    );

    if (invalidFile) {
      setError(
        "Please select valid image files."
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = filesToUpload.find(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" is larger than 10 MB.`
      );

      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const uploadedImages: ProductImage[] = [];

      for (const file of filesToUpload) {
        const imageUrl = await uploadFile(file);

        uploadedImages.push({
          imageUrl,
          altText: null,
          sortOrder:
            images.length +
            uploadedImages.length,
          isPrimary: false,
        });
      }

      onChange(
        normalizeImages([
          ...images,
          ...uploadedImages,
        ])
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage(indexToRemove: number) {
    if (disabled || isUploading) return;

    const updatedImages = images.filter(
      (_, index) => index !== indexToRemove
    );

    onChange(normalizeImages(updatedImages));
  }

  function updateAltText(
    indexToUpdate: number,
    altText: string
  ) {
    if (disabled || isUploading) return;

    const updatedImages = images.map(
      (image, index) =>
        index === indexToUpdate
          ? {
              ...image,
              altText: altText || null,
            }
          : image
    );

    onChange(updatedImages);
  }

  function moveImage(
    currentIndex: number,
    direction: "left" | "right"
  ) {
    if (disabled || isUploading) return;

    const targetIndex =
      direction === "left"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= images.length
    ) {
      return;
    }

    const updatedImages = [...images];

    [
      updatedImages[currentIndex],
      updatedImages[targetIndex],
    ] = [
      updatedImages[targetIndex],
      updatedImages[currentIndex],
    ];

    onChange(normalizeImages(updatedImages));
  }

  return (
    <div className="space-y-5">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleFiles}
      />

      {/* Upload information */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Product photography
          </p>

          <p className="mt-1 max-w-xl text-sm leading-6 text-primary/55">
            Upload up to {MAX_IMAGES} images.
            The first image is automatically used as
            the primary storefront image.
          </p>
        </div>

        <button
          type="button"
          onClick={openFilePicker}
          disabled={!canUpload}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-primary/15 bg-soft-white px-4 text-sm font-medium text-primary transition-all hover:border-primary/30 hover:bg-primary/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Upload images
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 ? (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={!canUpload}
          className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-primary/20 bg-primary/[0.015] px-6 text-center transition-all hover:border-primary/35 hover:bg-primary/[0.025] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/[0.06]">
            {isUploading ? (
              <Loader2 className="size-6 animate-spin text-primary/60" />
            ) : (
              <ImagePlus
                className="size-6 text-primary/60"
                strokeWidth={1.5}
              />
            )}
          </div>

          <p className="mt-5 text-sm font-semibold text-primary">
            {isUploading
              ? "Uploading your images"
              : "Add product images"}
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-primary/50">
            JPEG, PNG or WebP. Up to 10 MB per
            image. Select multiple images at once.
          </p>

          {!isUploading && (
            <span className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-medium text-soft-white">
              Choose images
            </span>
          )}
        </button>
      ) : (
        <>
          {/* Images */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => (
              <article
                key={
                  image.id ??
                  `${image.imageUrl}-${index}`
                }
                className="overflow-hidden rounded-3xl border border-primary/10 bg-soft-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-primary/[0.04]">
                  <Image
                    src={image.imageUrl}
                    alt={
                      image.altText ||
                      `Product image ${index + 1}`
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />

                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm ${
                        index === 0
                          ? "bg-primary text-soft-white"
                          : "bg-soft-white/90 text-primary/60"
                      }`}
                    >
                      {index === 0
                        ? "Primary"
                        : `Image ${index + 1}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove image ${
                      index + 1
                    }`}
                    onClick={() =>
                      removeImage(index)
                    }
                    disabled={
                      disabled || isUploading
                    }
                    className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-soft-white/95 text-primary/55 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2
                      className="size-4"
                      strokeWidth={1.6}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <label
                    htmlFor={`image-alt-${index}`}
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/45"
                  >
                    Image description
                  </label>

                  <input
                    id={`image-alt-${index}`}
                    type="text"
                    value={image.altText ?? ""}
                    onChange={(event) =>
                      updateAltText(
                        index,
                        event.target.value
                      )
                    }
                    disabled={
                      disabled || isUploading
                    }
                    placeholder={`Describe image ${
                      index + 1
                    }`}
                    className="h-10 w-full rounded-xl border border-primary/10 bg-primary/[0.015] px-3 text-sm text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary/30 focus:bg-soft-white disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {/* Reordering */}
                  <div className="mt-4 flex items-center justify-between border-t border-primary/8 pt-4">
                    <p className="text-xs text-primary/40">
                      Position {index + 1}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          moveImage(index, "left")
                        }
                        disabled={
                          disabled ||
                          isUploading ||
                          index === 0
                        }
                        aria-label={`Move image ${
                          index + 1
                        } left`}
                        className="flex size-9 items-center justify-center rounded-full border border-primary/10 text-primary/60 transition-all hover:border-primary/25 hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-25"
                      >
                        <ArrowLeft
                          className="size-4"
                          strokeWidth={1.5}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveImage(index, "right")
                        }
                        disabled={
                          disabled ||
                          isUploading ||
                          index ===
                            images.length - 1
                        }
                        aria-label={`Move image ${
                          index + 1
                        } right`}
                        className="flex size-9 items-center justify-center rounded-full border border-primary/10 text-primary/60 transition-all hover:border-primary/25 hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-25"
                      >
                        <ArrowRight
                          className="size-4"
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/8 bg-primary/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-primary/55">
              <span className="font-medium text-primary">
                {images.length}
              </span>{" "}
              of {MAX_IMAGES} images uploaded
            </p>

            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={openFilePicker}
                disabled={!canUpload}
                className="text-sm font-medium text-primary transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add more images
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}