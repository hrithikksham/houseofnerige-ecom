import Link from "next/link";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  FolderOpen,
  Pencil,
  Plus,
} from "lucide-react";

import { getCategories } from "@/lib/admin/categories";
import { archiveCategory, moveCategory } from "./actions";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const publishedCount = categories.filter(
    (category) => category.status === "PUBLISHED"
  ).length;

  const draftCount = categories.filter(
    (category) => category.status === "DRAFT"
  ).length;

  const archivedCount = categories.filter(
    (category) => category.status === "ARCHIVED"
  ).length;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium text-[#9A694F]">
            Product organization
          </p>

          <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-[#1D1D1F] sm:text-[38px]">
            Categories
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#86868B]">
            Organize your sarees into clear categories for your store.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1D1D1F] px-4 text-sm font-medium text-white transition-all hover:bg-[#343438] active:scale-[0.98]"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          Add Category
        </Link>
      </header>

      {/* Statistics */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={categories.length}
        />

        <StatCard
          label="Published"
          value={publishedCount}
        />

        <StatCard
          label="Drafts"
          value={draftCount}
        />

        <StatCard
          label="Archived"
          value={archivedCount}
        />
      </section>

      {/* Empty State */}
      {categories.length === 0 ? (
        <section className="mt-8 flex min-h-[440px] flex-col items-center justify-center rounded-[24px] border border-black/[0.06] bg-white px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F5F5F7]">
            <FolderOpen
              className="size-5 text-[#86868B]"
              strokeWidth={1.6}
            />
          </div>

          <h2 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">
            No categories yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-[#86868B]">
            Create your first category to organize your products.
          </p>

          <Link
            href="/admin/categories/new"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#1D1D1F] px-4 text-sm font-medium text-white transition-all hover:bg-[#343438]"
          >
            <Plus className="size-4" />
            Create Category
          </Link>
        </section>
      ) : (
        <section className="mt-8">
          {/* List Header */}
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                All Categories
              </h2>

              <p className="mt-1 text-sm text-[#86868B]">
                {categories.length}{" "}
                {categories.length === 1
                  ? "category"
                  : "categories"}
              </p>
            </div>
          </div>

          {/* Category list */}
          <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white">
            {/* Desktop heading */}
            <div className="hidden grid-cols-[110px_minmax(0,1fr)_130px_110px_150px] items-center border-b border-black/[0.06] bg-[#FAFAFA] px-6 py-3.5 md:grid">
              <span className="text-[11px] font-medium text-[#86868B]">
                Order
              </span>

              <span className="text-[11px] font-medium text-[#86868B]">
                Category
              </span>

              <span className="text-[11px] font-medium text-[#86868B]">
                Status
              </span>

              <span className="text-[11px] font-medium text-[#86868B]">
                Products
              </span>

              <span className="text-right text-[11px] font-medium text-[#86868B]">
                Actions
              </span>
            </div>

            {categories.map((category, index) => (
              <article
                key={category.id}
                className="
                  group
                  grid
                  gap-5
                  border-b
                  border-black/[0.06]
                  px-5
                  py-5
                  transition-colors
                  last:border-b-0
                  hover:bg-[#FAFAFA]
                  md:grid-cols-[110px_minmax(0,1fr)_130px_110px_150px]
                  md:items-center
                  md:gap-0
                  md:px-6
                "
              >
                {/* Order */}
                <div className="flex items-center gap-3">
                  <span className="w-7 text-sm font-medium text-[#86868B]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex">
                    <form
                      action={async () => {
                        "use server";
                        await moveCategory(category.id, "up");
                      }}
                    >
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label={`Move ${category.name} up`}
                        className="flex size-8 items-center justify-center rounded-full text-[#86868B] transition hover:bg-black/[0.04] hover:text-[#1D1D1F] disabled:pointer-events-none disabled:opacity-25"
                      >
                        <ArrowUp
                          className="size-3.5"
                          strokeWidth={1.8}
                        />
                      </button>
                    </form>

                    <form
                      action={async () => {
                        "use server";
                        await moveCategory(category.id, "down");
                      }}
                    >
                      <button
                        type="submit"
                        disabled={
                          index === categories.length - 1
                        }
                        aria-label={`Move ${category.name} down`}
                        className="flex size-8 items-center justify-center rounded-full text-[#86868B] transition hover:bg-black/[0.04] hover:text-[#1D1D1F] disabled:pointer-events-none disabled:opacity-25"
                      >
                        <ArrowDown
                          className="size-3.5"
                          strokeWidth={1.8}
                        />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Category */}
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F7]">
                      <FolderOpen
                        className="size-[18px] text-[#86868B]"
                        strokeWidth={1.6}
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="block w-fit"
                      >
                        <h3 className="truncate text-sm font-medium text-[#1D1D1F] transition-colors group-hover:text-[#9A694F]">
                          {category.name}
                        </h3>
                      </Link>

                      <p className="mt-1 truncate text-xs text-[#86868B]">
                        /{category.slug}
                      </p>
                    </div>
                  </div>

                  {category.description && (
                    <p className="mt-2 line-clamp-1 max-w-xl text-xs leading-5 text-[#86868B] md:pl-[52px]">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <p className="mb-2 text-[10px] font-medium text-[#86868B] md:hidden">
                    STATUS
                  </p>

                  <StatusBadge
                    status={category.status}
                  />
                </div>

                {/* Products */}
                <div>
                  <p className="mb-2 text-[10px] font-medium text-[#86868B] md:hidden">
                    PRODUCTS
                  </p>

                  <span className="text-sm text-[#86868B]">
                    —
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 md:justify-end">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium text-[#1D1D1F] transition hover:bg-black/[0.05]"
                  >
                    <Pencil
                      className="size-3.5"
                      strokeWidth={1.7}
                    />

                    Edit
                  </Link>

                  {category.status !== "ARCHIVED" && (
                    <form
                      action={async () => {
                        "use server";
                        await archiveCategory(category.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="flex size-9 items-center justify-center rounded-full text-[#86868B] transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Archive ${category.name}`}
                      >
                        <Archive
                          className="size-3.5"
                          strokeWidth={1.7}
                        />
                      </button>
                    </form>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[20px] border border-black/[0.06] bg-white p-4 sm:p-5">
      <p className="text-[11px] font-medium text-[#86868B]">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#1D1D1F]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    PUBLISHED:
      "bg-[#EAF6EE] text-[#287A45]",
    DRAFT:
      "bg-[#FDF2E8] text-[#A65A20]",
    ARCHIVED:
      "bg-[#F5F5F7] text-[#86868B]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[status as keyof typeof styles] ??
        styles.DRAFT
      }`}
    >
      {status.charAt(0) +
        status.slice(1).toLowerCase()}
    </span>
  );
}