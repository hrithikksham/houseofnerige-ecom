"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, Input } from "@/components/ui";
import {
  createCollection,
  updateCollection,
} from "@/app/admin/collections/actions";

type CollectionFormProps = {
  collection?: {
    id: string;
    name: string;
    description: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
};

export function CollectionForm({
  collection,
}: CollectionFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isEditing = Boolean(collection);

  function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      let result;

      if (isEditing) {
        formData.append("id", collection!.id);

        result = await updateCollection(formData);
      } else {
        result = await createCollection(formData);
      }

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      router.push("/admin/collections");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Basic information */}
      <div className="border border-border bg-soft-white p-5 sm:p-6">
        <div className="border-b border-border pb-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
            Collection Details
          </p>

          <h2 className="mt-2 font-serif text-2xl text-primary">
            Basic Information
          </h2>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Collection Name
            </label>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Wedding Collection"
              defaultValue={collection?.name ?? ""}
              required
              disabled={isPending}
            />

            <p className="mt-2 text-xs text-primary/50">
              The URL slug is generated automatically from the collection name.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Description
              <span className="ml-1 text-primary/40">
                (Optional)
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe this collection..."
              defaultValue={collection?.description ?? ""}
              disabled={isPending}
              className="
                w-full
                border
                border-border
                bg-background
                px-4
                py-3
                text-sm
                text-primary
                outline-none
                transition-colors
                placeholder:text-primary/40
                focus:border-terracotta
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="border border-border bg-soft-white p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
          Visibility
        </p>

        <h2 className="mt-2 font-serif text-2xl text-primary">
          Collection Status
        </h2>

        <div className="mt-6">
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-primary"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue={
              collection?.status === "ARCHIVED"
                ? "DRAFT"
                : collection?.status ?? "DRAFT"
            }
            disabled={isPending}
            className="
              min-h-11
              w-full
              border
              border-border
              bg-background
              px-4
              text-sm
              text-primary
              outline-none
              transition-colors
              focus:border-terracotta
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="DRAFT">
              Draft
            </option>

            <option value="PUBLISHED">
              Published
            </option>
          </select>

          <p className="mt-2 text-xs leading-5 text-primary/50">
            Published collections can be displayed in the public store.
          </p>
        </div>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/collections")}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
        >
          {isPending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Create Collection"}
        </Button>
      </div>
    </form>
  );
}