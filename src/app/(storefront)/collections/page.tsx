import type { Metadata } from "next";

import { CollectionCard } from "@/components/storefront/collection-card";

import {
  getStorefrontCollections,
} from "@/lib/storefront/collections";

export const metadata: Metadata = {
  title: "Collections | Nerige Sarees",

  description:
    "Explore curated saree collections from Nerige Sarees.",
};

export default async function CollectionsPage() {
  const collections =
    await getStorefrontCollections();

  return (
    <main className="min-h-screen bg-background text-primary">
      {/* ============================================================
          SHORT HEADER
      ============================================================ */}
      <section className="border-b border-primary/10">
        <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-terracotta">
              Nerige Sarees
            </p>

            <h1 className="mt-2 font-serif text-4xl leading-none tracking-[-0.035em] text-primary sm:text-5xl lg:text-6xl">
              Collections
            </h1>
          </div>

          {collections.length > 0 && (
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-primary/40 sm:block">
              {collections.length}{" "}
              {collections.length === 1
                ? "collection"
                : "collections"}
            </p>
          )}
        </div>
      </section>

      {/* ============================================================
          COLLECTIONS
      ============================================================ */}
      <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {collections.length > 0 ? (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-primary/10 bg-primary/[0.02] px-6 text-center sm:rounded-[28px]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta">
                Coming soon
              </p>

              <h2 className="mt-3 font-serif text-2xl tracking-[-0.025em] text-primary sm:text-3xl">
                New collections are being prepared.
              </h2>

              <p className="mt-3 text-sm text-primary/50">
                Curated saree collections will appear here soon.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}