import Link from "next/link";
import {
  ChevronLeft,
  FolderPlus,
  PackagePlus,
} from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { getProductFormData } from "@/lib/admin/products";

export default async function NewProductPage() {
  const { categories, collections } =
    await getProductFormData();

  const hasCategories = categories.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl pb-12">
      {/* Back navigation */}
      <Link
        href="/admin/products"
        className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-primary/60 transition-colors hover:bg-background hover:text-primary"
      >
        <ChevronLeft
          className="size-4"
          strokeWidth={1.7}
        />
        Products
      </Link>

      {/* Page header */}
      <div className="mt-6 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-soft-white">
              <PackagePlus
                className="size-5 text-primary"
                strokeWidth={1.5}
              />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/40">
              Catalogue
            </p>
          </div>

          <h1 className="mt-5 font-serif text-4xl tracking-tight text-primary sm:text-5xl">
            Add Product
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-primary/60 sm:text-base">
            Create a complete saree listing with images,
            pricing, inventory, specifications, and
            publishing details.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="flex items-center gap-2 rounded-full border border-border bg-soft-white px-4 py-2.5">
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-soft-white">
              1
            </span>

            <span className="text-xs font-medium text-primary/70">
              Product details
            </span>
          </div>
        </div>
      </div>

      {/* Missing category state */}
      {!hasCategories && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/70">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white">
              <FolderPlus
                className="size-5 text-amber-700"
                strokeWidth={1.5}
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                Create a category before adding products
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-800/75">
                Every saree must belong to a published
                category. Create one first, then return
                here to add your product.
              </p>

              <Link
                href="/admin/categories/new"
                className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-amber-900 px-4 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                Create Category
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div
        className={`mt-8 ${
          !hasCategories
            ? "pointer-events-none opacity-50"
            : ""
        }`}
      >
        <ProductForm
          categories={categories}
          collections={collections}
        />
      </div>
    </div>
  );
}