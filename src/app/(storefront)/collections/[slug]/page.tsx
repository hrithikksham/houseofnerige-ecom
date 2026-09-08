import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
} from "lucide-react";

import {
  ProductGrid,
} from "@/components/storefront/product-grid";

import {
  getStorefrontCollectionBySlug,
} from "@/lib/storefront/collections";

type CollectionDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const collection =
    await getStorefrontCollectionBySlug(
      slug
    );

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${collection.name} | Nerige Sarees`,

    description:
      collection.description ??
      `Explore the ${collection.name} collection from Nerige Sarees.`,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;

  const collection =
    await getStorefrontCollectionBySlug(
      slug
    );

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-primary">
      {/* Hero */}
      <section className="border-b border-primary/10">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/50 transition-colors hover:text-primary"
          >
            <ArrowLeft
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.5}
            />

            All collections
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-terracotta">
                Collection
              </p>

              <h1 className="mt-4 font-serif text-5xl tracking-[-0.035em] text-primary sm:text-6xl lg:text-7xl">
                {collection.name}
              </h1>

              {collection.description && (
                <p className="mt-5 max-w-xl text-sm leading-7 text-primary/55 sm:text-base sm:leading-8">
                  {collection.description}
                </p>
              )}

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/40">
                {collection.products.length}{" "}
                {collection.products.length === 1
                  ? "saree"
                  : "sarees"}{" "}
                in this collection
              </p>
            </div>

            {collection.image && (
              <div className="relative aspect-[16/8] overflow-hidden rounded-[24px] border border-primary/10 bg-primary/[0.04] sm:rounded-[32px]">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        {collection.products.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/40">
                  Curated sarees
                </p>
              </div>

              <p className="text-sm text-primary/50">
                {collection.products.length}{" "}
                {collection.products.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>

            <ProductGrid
              products={collection.products}
            />
          </>
        ) : (
          <div className="flex min-h-[380px] items-center justify-center rounded-[24px] border border-primary/10 px-6 text-center">
            <div>
              <p className="font-serif text-3xl text-primary">
                No sarees yet.
              </p>

              <p className="mt-3 text-sm text-primary/50">
                Products will appear here soon.
              </p>

              <Link
                href="/shop"
                className="mt-7 inline-flex border-b border-primary/30 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Explore all sarees
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}