import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { CollectionForm } from "@/components/admin/collection-form";

export default function NewCollectionPage() {
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
          Add Collection
        </h1>

        <p className="mt-3 text-sm leading-6 text-primary/65">
          Create a curated collection of sarees for your store.
        </p>
      </div>

      <div className="mt-8">
        <CollectionForm />
      </div>
    </div>
  );
}