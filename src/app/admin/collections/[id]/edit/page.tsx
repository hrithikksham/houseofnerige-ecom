import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { CollectionForm } from "@/components/admin/collection-form";
import { getCollectionById } from "@/lib/admin/collections";

type EditCollectionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const { id } = await params;

  const collection = await getCollectionById(id);

  if (!collection) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/admin/collections"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-primary/60 transition-colors hover:text-terracotta"
      >
        <ChevronLeft className="size-4" />
        Collections
      </Link>

      <div className="mt-6 border-b border-border pb-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
          Product Organization
        </p>

        <h1 className="mt-2 font-serif text-3xl text-primary sm:text-4xl">
          Edit Collection
        </h1>

        <p className="mt-3 text-sm leading-6 text-primary/65">
          Update the collection details and publishing status.
        </p>
      </div>

      <div className="mt-8">
        <CollectionForm
          collection={{
            id: collection.id,
            name: collection.name,
            description: collection.description,
            status: collection.status,
          }}
        />
      </div>

      <div className="mt-6 border border-border bg-soft-white p-5 sm:p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Collection Details
        </h2>

        <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-primary/50">
              URL Slug
            </p>

            <p className="mt-1 font-medium text-primary">
              /{collection.slug}
            </p>
          </div>

          <div>
            <p className="text-xs text-primary/50">
              Display Order
            </p>

            <p className="mt-1 font-medium text-primary">
              {collection.sortOrder + 1}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}