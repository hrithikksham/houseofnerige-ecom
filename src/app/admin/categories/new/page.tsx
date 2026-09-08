import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px]">
      {/* Back navigation */}
      <Link
        href="/admin/categories"
        className="group inline-flex h-9 items-center gap-2 rounded-full px-2.5 text-sm text-[#86868B] transition-all hover:bg-black/[0.04] hover:text-[#1D1D1F]"
      >
        <ChevronLeft
          className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          strokeWidth={1.8}
        />

        <span>Categories</span>
      </Link>

      {/* Header */}
      <header className="mt-7">
        <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-[#1D1D1F] sm:text-[38px]">
          Add category
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#86868B]">
          Create a category to organize products and control how they appear
          throughout your store.
        </p>
      </header>

      {/* Form */}
      <section className="mt-8 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white">
        <div className="border-b border-black/[0.06] px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-[#1D1D1F]">
            Category details
          </h2>

          <p className="mt-1 text-xs text-[#86868B]">
            Add the information for this category.
          </p>
        </div>

        <div className="p-5 sm:p-6 lg:p-8">
          <CategoryForm />
        </div>
      </section>
    </div>
  );
}