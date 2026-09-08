import type { CollectionCardData } from "@/lib/storefront/collections";

import { CollectionCard } from "./collection-card";

interface CollectionGridProps {
  collections: CollectionCardData[];
}

export function CollectionGrid({
  collections,
}: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center border border-primary/10 bg-primary/[0.02] px-6 text-center">
        <div>
          <p className="font-serif text-2xl text-primary">
            Collections are coming soon.
          </p>

          <p className="mt-3 text-sm text-primary/50">
            Discover our curated saree collections soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-7">
      {collections.map((collection, index) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          priority={index === 0}
        />
      ))}
    </div>
  );
}