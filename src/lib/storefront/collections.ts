import {
  ContentStatus,
  ProductStatus,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import type {
  ProductCardData,
  ProductSort,
} from "@/lib/storefront/products";

export type CollectionCardData = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  productCount: number;
};

export type CollectionDetailData = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  products: ProductCardData[];
};

type GetCollectionOptions = {
  sort?: ProductSort;
};

/* ============================================================
   PRICE HELPERS
============================================================ */

function getFinalPrice(
  regularPrice: number,
  discountPercent: number
) {
  if (discountPercent <= 0) {
    return Math.round(regularPrice);
  }

  return Math.round(
    regularPrice *
      (1 - discountPercent / 100)
  );
}

/* ============================================================
   ALL PUBLISHED COLLECTIONS
============================================================ */

export async function getStorefrontCollections(): Promise<
  CollectionCardData[]
> {
  const collections =
    await prisma.collection.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,

        _count: {
          select: {
            productCollections: {
              where: {
                product: {
                  status:
                    ProductStatus.PUBLISHED,

                  category: {
                    is: {
                      status:
                        ContentStatus.PUBLISHED,
                    },
                  },
                },
              },
            },
          },
        },
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  return collections.map(
    (collection) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      image: collection.image,
      description:
        collection.description ?? null,
      productCount:
        collection._count.productCollections,
    })
  );
}

/* ============================================================
   SINGLE COLLECTION
============================================================ */

export async function getStorefrontCollectionBySlug(
  slug: string,
  options: GetCollectionOptions = {}
): Promise<CollectionDetailData | null> {
  const {
    sort = "newest",
  } = options;

  const collection =
    await prisma.collection.findFirst({
      where: {
        slug,

        status:
          ContentStatus.PUBLISHED,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,

        productCollections: {
          where: {
            product: {
              status:
                ProductStatus.PUBLISHED,

              category: {
                is: {
                  status:
                    ContentStatus.PUBLISHED,
                },
              },
            },
          },

          select: {
            product: {
              select: {
                id: true,
                slug: true,
                name: true,

                regularPrice: true,
                discountPercent: true,

                stockQuantity: true,
                isNewArrival: true,

                category: {
                  select: {
                    name: true,
                  },
                },

                images: {
                  select: {
                    imageUrl: true,
                    sortOrder: true,
                    isPrimary: true,
                  },

                  orderBy: [
                    {
                      isPrimary:
                        "desc",
                    },
                    {
                      sortOrder:
                        "asc",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    });

  if (!collection) {
    return null;
  }

  const products: ProductCardData[] =
    collection.productCollections.map(
      ({ product }) => {
        const regularPrice =
          Number(
            product.regularPrice
          );

        const discountPercent =
          Number(
            product.discountPercent
          );

        const finalPrice =
          getFinalPrice(
            regularPrice,
            discountPercent
          );

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,

          price: finalPrice,

          originalPrice:
            discountPercent > 0
              ? regularPrice
              : null,

          stock:
            product.stockQuantity,

          isNew:
            product.isNewArrival,

          categoryName:
            product.category.name,

          images:
            product.images.map(
              (image) =>
                image.imageUrl
            ),
        };
      }
    );

  /* ==========================================================
     SORT BY FINAL SALE PRICE
  ========================================================== */

  if (sort === "price-low") {
    products.sort(
      (a, b) =>
        a.price - b.price
    );
  }

  if (sort === "price-high") {
    products.sort(
      (a, b) =>
        b.price - a.price
    );
  }

  if (sort === "discount") {
    products.sort(
      (a, b) => {
        const aDiscount =
          a.originalPrice !== null
            ? a.originalPrice -
              a.price
            : 0;

        const bDiscount =
          b.originalPrice !== null
            ? b.originalPrice -
              b.price
            : 0;

        return (
          bDiscount -
          aDiscount
        );
      }
    );
  }

  if (sort === "newest") {
    /*
     * Products inside a collection do not currently
     * have a collection-specific sort order in the
     * Prisma schema, so the relation follows the
     * database relation ordering.
     *
     * If you want newest sorting here, add createdAt
     * to the selected product fields and sort by it.
     */
  }

  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    image:
      collection.image ?? null,
    description:
      collection.description ?? null,
    products,
  };
}