import Link from "next/link";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  FolderOpen,
  Pencil,
  Plus,
} from "lucide-react";

import { getCollections } from "@/lib/admin/collections";

import {
  archiveCollection,
  moveCollection,
} from "./actions";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
            Product Organization
          </p>

          <h1 className="mt-2 font-serif text-3xl text-primary sm:text-4xl">
            Collections
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-primary/65">
            Create curated groups of sarees for special occasions,
            seasonal stories, and featured selections.
          </p>
        </div>

        <Link
          href="/admin/collections/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-xs font-medium uppercase tracking-[0.14em] text-soft-white transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="mt-8 flex min-h-80 flex-col items-center justify-center border border-dashed border-border bg-soft-white p-8 text-center">
          <div className="flex size-14 items-center justify-center border border-border bg-background">
            <FolderOpen
              className="size-6 text-primary/50"
              strokeWidth={1.3}
            />
          </div>

          <h2 className="mt-5 font-serif text-2xl text-primary">
            No collections yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-primary/60">
            Create a collection to group related sarees together.
          </p>

          <Link
            href="/admin/collections/new"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-xs font-medium uppercase tracking-[0.14em] text-soft-white transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add First Collection
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden border border-border bg-soft-white">
          {/* Desktop heading */}
          <div className="hidden grid-cols-[64px_1.4fr_0.8fr_0.8fr_auto] items-center gap-4 border-b border-border bg-background/50 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-primary/50 md:grid">
            <span>Order</span>
            <span>Collection</span>
            <span>Status</span>
            <span>Products</span>
            <span className="text-right">
              Actions
            </span>
          </div>

          <div>
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className="grid gap-4 border-b border-border p-5 last:border-b-0 md:grid-cols-[64px_1.4fr_0.8fr_0.8fr_auto] md:items-center"
              >
                {/* Reorder */}
                <div className="flex items-center gap-1">
                  <span className="mr-2 text-sm text-primary/50 md:hidden">
                    Order:
                  </span>

                  <div className="flex items-center gap-1">
                    <form
                      action={async () => {
                        "use server";

                        await moveCollection(
                          collection.id,
                          "up"
                        );
                      }}
                    >
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label="Move collection up"
                        className="flex size-8 items-center justify-center border border-border text-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                    </form>

                    <form
                      action={async () => {
                        "use server";

                        await moveCollection(
                          collection.id,
                          "down"
                        );
                      }}
                    >
                      <button
                        type="submit"
                        disabled={
                          index === collections.length - 1
                        }
                        aria-label="Move collection down"
                        className="flex size-8 items-center justify-center border border-border text-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-primary/40 md:hidden">
                    Collection
                  </p>

                  <p className="mt-1 font-medium text-primary md:mt-0">
                    {collection.name}
                  </p>

                  <p className="mt-1 text-xs text-primary/50">
                    /{collection.slug}
                  </p>

                  {collection.description && (
                    <p className="mt-2 line-clamp-1 text-sm text-primary/60">
                      {collection.description}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-primary/40 md:hidden">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] md:mt-0 ${
                      collection.status === "PUBLISHED"
                        ? "bg-primary/10 text-primary"
                        : collection.status === "ARCHIVED"
                          ? "bg-primary/5 text-primary/45"
                          : "bg-terracotta/10 text-terracotta"
                    }`}
                  >
                    {collection.status}
                  </span>
                </div>

                {/* Product count */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-primary/40 md:hidden">
                    Products
                  </p>

                  <p className="mt-1 text-sm text-primary/70 md:mt-0">
                    —
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:justify-end">
                  <Link
                    href={`/admin/collections/${collection.id}/edit`}
                    className="flex min-h-9 items-center gap-2 border border-border px-3 text-xs text-primary transition-colors hover:bg-background"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>

                  {collection.status !== "ARCHIVED" && (
                    <form
                      action={async () => {
                        "use server";

                        await archiveCollection(
                          collection.id
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className="flex min-h-9 items-center gap-2 border border-border px-3 text-xs text-primary/70 transition-colors hover:border-terracotta/40 hover:text-terracotta"
                      >
                        <Archive className="size-3.5" />
                        Archive
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}