"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, Input } from "@/components/ui";
import {
  createCategory,
  updateCategory,
} from "@/app/admin/categories/actions";

type CategoryFormProps = {
  category?: {
    id: string;
    name: string;
    description: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
};

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isEditing = Boolean(category);

  function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      let result;

      if (isEditing) {
        formData.append("id", category!.id);
        result = await updateCategory(formData);
      } else {
        result = await createCategory(formData);
      }

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    });
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto max-w-5xl space-y-6"
    >
      {/* Basic Information */}
      <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
        <div className="border-b border-black/[0.06] px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A694F]">
            Category Details
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#1C1D20] sm:text-2xl">
            Basic information
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#777B84]">
            Add the information used to identify and organize this category.
          </p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#1C1D20]"
            >
              Category name
            </label>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Silk Sarees"
              defaultValue={category?.name ?? ""}
              required
              disabled={isPending}
              className="min-h-12 rounded-xl border-black/[0.09] bg-white text-[#1C1D20] placeholder:text-[#A5A8AE] focus:border-[#1C1D20]"
            />

            <p className="mt-2 text-xs leading-5 text-[#8A8E96]">
              The URL slug will be generated automatically from the category
              name.
            </p>
          </div>

          {/* Description */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="description"
                className="text-sm font-medium text-[#1C1D20]"
              >
                Description
              </label>

              <span className="text-xs text-[#9A9DA4]">Optional</span>
            </div>

            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Describe this category..."
              defaultValue={category?.description ?? ""}
              disabled={isPending}
              className="w-full resize-y rounded-xl border border-black/[0.09] bg-white px-4 py-3 text-sm leading-6 text-[#1C1D20] outline-none transition-colors placeholder:text-[#A5A8AE] focus:border-[#1C1D20] focus:ring-2 focus:ring-black/[0.03] disabled:cursor-not-allowed disabled:bg-black/[0.02] disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
        <div className="border-b border-black/[0.06] px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A694F]">
            Visibility
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#1C1D20] sm:text-2xl">
            Category status
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#777B84]">
            Control whether this category is available in the store.
          </p>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <div className="max-w-md">
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-[#1C1D20]"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={
                category?.status === "ARCHIVED"
                  ? "DRAFT"
                  : category?.status ?? "DRAFT"
              }
              disabled={isPending}
              className="min-h-12 w-full rounded-xl border border-black/[0.09] bg-white px-4 text-sm text-[#1C1D20] outline-none transition-colors focus:border-[#1C1D20] focus:ring-2 focus:ring-black/[0.03] disabled:cursor-not-allowed disabled:bg-black/[0.02] disabled:opacity-60"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>

            <p className="mt-2 text-xs leading-5 text-[#8A8E96]">
              Published categories are available for use in the public store.
            </p>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-black/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/categories")}
          disabled={isPending}
          className="min-h-11 px-5"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
          className="min-h-11 rounded-xl px-6"
        >
          {isPending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Create Category"}
        </Button>
      </div>
    </form>
  );
}