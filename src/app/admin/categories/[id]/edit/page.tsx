import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Pencil } from "lucide-react";

import { CategoryForm } from "@/components/admin/category-form";
import { prisma } from "@/lib/prisma";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Back navigation */}
      <Link
        href="/admin/categories"
        className="group inline-flex items-center gap-2 text-sm text-primary/50 transition-colors hover:text-primary"
      >
        <span className="flex size-8 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary/20">
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </span>

        <span>Back to categories</span>
      </Link>

      {/* Page header */}
      <div className="mt-8 flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center border border-border bg-background text-primary">
              <Pencil className="size-4" strokeWidth={1.5} />
            </span>

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/45">
              Categories
            </p>
          </div>

          <h1 className="mt-5 text-3xl font-medium tracking-tight text-primary sm:text-4xl">
            Edit category
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-primary/60">
            Update the category details and control its availability in your
            store.
          </p>
        </div>

        {/* Category information */}
        <div className="border border-border bg-background px-4 py-3 sm:min-w-48">
          <p className="text-[10px] uppercase tracking-[0.14em] text-primary/40">
            Category
          </p>

          <p className="mt-1 truncate text-sm font-medium text-primary">
            {category.name}
          </p>
        </div>
      </div>

      {/* Edit form */}
      <div className="mt-8">
        <CategoryForm
          category={{
            id: category.id,
            name: category.name,
            description: category.description,
            status: category.status,
          }}
        />
      </div>

      {/* System details */}
      <div className="mt-8 border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <p className="text-xs font-medium text-primary">
            Category information
          </p>

          <p className="mt-1 text-xs text-primary/45">
            System-generated information for this category.
          </p>
        </div>

        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-primary/40">
              Slug
            </p>

            <p className="mt-2 break-all text-sm text-primary/75">
              /{category.slug}
            </p>
          </div>

          <div className="px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-primary/40">
              Display order
            </p>

            <p className="mt-2 text-sm font-medium text-primary">
              #{category.sortOrder + 1}
            </p>
          </div>

          <div className="px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-primary/40">
              Current status
            </p>

            <p className="mt-2 text-sm font-medium text-primary">
              {category.status.charAt(0) +
                category.status.slice(1).toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}