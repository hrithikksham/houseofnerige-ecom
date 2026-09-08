import {
  ContentStatus,
  Prisma,
  ProductStatus,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

/* ============================================================
   TYPES
============================================================ */

export type ProductSort =
  | "newest"
  | "price-low"
  | "price-high"
  | "discount";

export type GetProductsOptions = {
  query?: string;

  sort?: ProductSort;

  category?: string[];
  collection?: string[];

  colour?: string[];
  fabric?: string[];
  occasion?: string[];
  workWeave?: string[];

  price?: string[];

  minPrice?: number;
  maxPrice?: number;

  page?: number;
  limit?: number;

  featured?: boolean;
  newArrival?: boolean;

  excludeSlug?: string;
};

export type ProductCardData = {
  id: string;

  slug: string;
  name: string;

  price: number;
  originalPrice: number | null;

  discountPercent: number;

  stock: number;

  isNew: boolean;
  isFeatured: boolean;

  categoryName: string | null;
  categorySlug: string | null;

  images: string[];
};

export type StorefrontProductsResult = {
  products: ProductCardData[];

  total: number;

  page: number;
  limit: number;

  totalPages: number;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ProductDetailsData = {
  id: string;

  slug: string;
  sku: string;

  name: string;

  shortDescription: string | null;
  description: string | null;

  price: number;
  originalPrice: number | null;

  discountPercent: number;

  stock: number;
  lowStockThreshold: number;

  isNew: boolean;
  isFeatured: boolean;

  category: {
    id: string;

    name: string;
    slug: string;
  };

  specification: {
    fabric: string | null;

    colour: string | null;

    sareeLength: number | null;

    blousePieceIncluded: boolean;

    blousePieceLength: number | null;

    workWeave: string | null;

    occasion: string | null;

    careInstructions: string | null;
  } | null;

  images: {
    id: string;

    url: string;

    alt: string;

    isPrimary: boolean;
  }[];

  collections: {
    id: string;

    name: string;
    slug: string;
  }[];
};

export type StorefrontCollectionData = {
  id: string;

  name: string;
  slug: string;

  image: string | null;

  description: string | null;

  sortOrder: number;

  productCount: number;
};

export type StorefrontCategoryData = {
  id: string;

  name: string;
  slug: string;

  image: string | null;

  description: string | null;

  sortOrder: number;

  productCount: number;
};

/* ============================================================
   SEARCH
============================================================ */

const SEARCH_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "for",
  "in",
  "of",
  "or",
  "saree",
  "sarees",
  "the",
  "to",
  "with",
  "wear",
  "style",
  "styles",
]);

function getSearchTerms(
  query?: string
): string[] {
  if (!query?.trim()) {
    return [];
  }

  return [
    ...new Set(
      query
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .map((term) =>
          term.replace(/[^\p{L}\p{N}]/gu, "")
        )
        .filter(
          (term) =>
            term.length > 1 &&
            !SEARCH_STOP_WORDS.has(term)
        )
    ),
  ];
}

/* ============================================================
   PRICE RANGE PARSING
============================================================ */

function getPriceRanges(
  priceValues: string[] = []
) {
  const ranges = {
    "0-5000": {
      min: 0,
      max: 5000,
    },

    "5000-10000": {
      min: 5000,
      max: 10000,
    },

    "10000-20000": {
      min: 10000,
      max: 20000,
    },
  } as const;

  if (priceValues.length === 0) {
    return {
      minPrice: undefined,
      maxPrice: undefined,
    };
  }

  const hasPlusRange =
    priceValues.includes("20000-plus");

  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  for (const value of priceValues) {
    if (value === "20000-plus") {
      minPrice =
        minPrice === undefined
          ? 20000
          : Math.min(minPrice, 20000);

      continue;
    }

    if (!(value in ranges)) {
      continue;
    }

    const range =
      ranges[
        value as keyof typeof ranges
      ];

    minPrice =
      minPrice === undefined
        ? range.min
        : Math.min(
            minPrice,
            range.min
          );

    maxPrice =
      maxPrice === undefined
        ? range.max
        : Math.max(
            maxPrice,
            range.max
          );
  }

  return {
    minPrice,

    maxPrice: hasPlusRange
      ? undefined
      : maxPrice,
  };
}

/* ============================================================
   PRICE HELPERS
============================================================ */

function getFinalPrice(
  regularPrice: number,
  discountPercent: number
): number {
  if (discountPercent <= 0) {
    return Math.round(regularPrice);
  }

  return Math.round(
    regularPrice *
      (1 - discountPercent / 100)
  );
}

/* ============================================================
   PRODUCT CARD MAPPER
============================================================ */

function mapProductToCardData(product: {
  id: string;

  slug: string;
  name: string;

  regularPrice: Prisma.Decimal;
  discountPercent: Prisma.Decimal;

  stockQuantity: number;

  isNewArrival: boolean;
  isFeatured: boolean;

  category: {
    name: string;
    slug: string;
  };

  images: {
    imageUrl: string;
  }[];
}): ProductCardData {
  const regularPrice = Number(
    product.regularPrice
  );

  const discountPercent = Number(
    product.discountPercent
  );

  const finalPrice = getFinalPrice(
    regularPrice,
    discountPercent
  );

  const hasDiscount =
    discountPercent > 0;

  return {
    id: product.id,

    slug: product.slug,
    name: product.name,

    price: finalPrice,

    originalPrice: hasDiscount
      ? Math.round(regularPrice)
      : null,

    discountPercent,

    stock: product.stockQuantity,

    isNew: product.isNewArrival,

    isFeatured: product.isFeatured,

    categoryName:
      product.category.name,

    categorySlug:
      product.category.slug,

    images: product.images.map(
      (image) => image.imageUrl
    ),
  };
}

/* ============================================================
   PRODUCT WHERE BUILDER
============================================================ */

function buildProductsWhere(
  options: GetProductsOptions
): Prisma.ProductWhereInput {
  const {
    query,

    category = [],
    collection = [],

    colour = [],
    fabric = [],
    occasion = [],
    workWeave = [],

    featured,
    newArrival,

    excludeSlug,
  } = options;

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,

    category: {
      is: {
        status: ContentStatus.PUBLISHED,
      },
    },
  };

  /* CATEGORY */

  if (category.length > 0) {
    where.category = {
      is: {
        slug: {
          in: category,
        },

        status:
          ContentStatus.PUBLISHED,
      },
    };
  }

  /* COLLECTION */

  if (collection.length > 0) {
    where.productCollections = {
      some: {
        collection: {
          slug: {
            in: collection,
          },

          status:
            ContentStatus.PUBLISHED,
        },
      },
    };
  }

  /* FEATURED */

  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  /* NEW ARRIVALS */

  if (newArrival !== undefined) {
    where.isNewArrival =
      newArrival;
  }

  /* EXCLUDE PRODUCT */

  if (excludeSlug) {
    where.slug = {
      not: excludeSlug,
    };
  }

  /* SPECIFICATION FILTERS */

  if (
    colour.length > 0 ||
    fabric.length > 0 ||
    occasion.length > 0 ||
    workWeave.length > 0
  ) {
    where.specification = {
      is: {
        ...(colour.length > 0
          ? {
              colour: {
                in: colour,
                mode: "insensitive",
              },
            }
          : {}),

        ...(fabric.length > 0
          ? {
              fabric: {
                in: fabric,
                mode: "insensitive",
              },
            }
          : {}),

        ...(occasion.length > 0
          ? {
              occasion: {
                in: occasion,
                mode: "insensitive",
              },
            }
          : {}),

        ...(workWeave.length > 0
          ? {
              workWeave: {
                in: workWeave,
                mode: "insensitive",
              },
            }
          : {}),
      },
    };
  }

  /* SEARCH */

  const searchTerms =
    getSearchTerms(query);

  if (searchTerms.length > 0) {
    const searchConditions:
      Prisma.ProductWhereInput[] =
      searchTerms.map((term) => ({
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive",
            },
          },

          {
            shortDescription: {
              contains: term,
              mode: "insensitive",
            },
          },

          {
            description: {
              contains: term,
              mode: "insensitive",
            },
          },

          {
            category: {
              is: {
                name: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },

          {
            specification: {
              is: {
                colour: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },

          {
            specification: {
              is: {
                fabric: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },

          {
            specification: {
              is: {
                occasion: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },

          {
            specification: {
              is: {
                workWeave: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }));

    where.AND =
      searchConditions;
  }

  return where;
}

/* ============================================================
   PRODUCT ORDER
============================================================ */

function getProductOrder(
  sort: ProductSort
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-low":
      return [
        {
          regularPrice: "asc",
        },

        {
          createdAt: "desc",
        },
      ];

    case "price-high":
      return [
        {
          regularPrice: "desc",
        },

        {
          createdAt: "desc",
        },
      ];

    case "discount":
      return [
        {
          discountPercent: "desc",
        },

        {
          createdAt: "desc",
        },
      ];

    case "newest":
    default:
      return [
        {
          createdAt: "desc",
        },
      ];
  }
}

/* ============================================================
   STORE PRODUCT LIST
============================================================ */

export async function getStorefrontProducts(
  options: GetProductsOptions = {}
): Promise<ProductCardData[]> {
  const {
    sort = "newest",

    price = [],

    minPrice: explicitMinPrice,
    maxPrice: explicitMaxPrice,
  } = options;

  const where =
    buildProductsWhere(options);

  const products =
    await prisma.product.findMany({
      where,

      select: {
        id: true,

        slug: true,
        name: true,

        regularPrice: true,
        discountPercent: true,

        stockQuantity: true,

        isNewArrival: true,
        isFeatured: true,

        category: {
          select: {
            name: true,
            slug: true,
          },
        },

        images: {
          select: {
            imageUrl: true,
          },

          orderBy: [
            {
              isPrimary: "desc",
            },

            {
              sortOrder: "asc",
            },
          ],
        },
      },

      orderBy:
        getProductOrder(sort),
    });

  const mappedProducts =
    products.map(
      mapProductToCardData
    );

  const parsedPriceRanges =
    getPriceRanges(price);

  const minPrice =
    explicitMinPrice ??
    parsedPriceRanges.minPrice;

  const maxPrice =
    explicitMaxPrice ??
    parsedPriceRanges.maxPrice;

  const filteredProducts =
    mappedProducts.filter(
      (product) => {
        if (
          minPrice !== undefined &&
          product.price < minPrice
        ) {
          return false;
        }

        if (
          maxPrice !== undefined &&
          product.price > maxPrice
        ) {
          return false;
        }

        return true;
      }
    );

  /* FINAL PRICE SORTING */

  if (sort === "price-low") {
    return filteredProducts.sort(
      (a, b) =>
        a.price - b.price
    );
  }

  if (sort === "price-high") {
    return filteredProducts.sort(
      (a, b) =>
        b.price - a.price
    );
  }

  if (sort === "discount") {
    return filteredProducts.sort(
      (a, b) =>
        b.discountPercent -
        a.discountPercent
    );
  }

  return filteredProducts;
}

/* ============================================================
   PAGINATED PRODUCT LIST

   Default: 15 products per page.
============================================================ */

export async function getPaginatedStorefrontProducts(
  options: GetProductsOptions = {}
): Promise<StorefrontProductsResult> {
  const {
    page = 1,
    limit = 15,
  } = options;

  const safePage =
    Math.max(1, page);

  const safeLimit =
    Math.min(
      Math.max(1, limit),
      50
    );

  const allProducts =
    await getStorefrontProducts({
      ...options,

      page: undefined,
      limit: undefined,
    });

  const total =
    allProducts.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / safeLimit
      )
    );

  const currentPage =
    Math.min(
      safePage,
      totalPages
    );

  const start =
    (currentPage - 1) *
    safeLimit;

  const products =
    allProducts.slice(
      start,
      start + safeLimit
    );

  return {
    products,

    total,

    page: currentPage,
    limit: safeLimit,

    totalPages,

    hasNextPage:
      currentPage < totalPages,

    hasPreviousPage:
      currentPage > 1,
  };
}

/* ============================================================
   SINGLE PRODUCT
============================================================ */

export async function getStorefrontProductBySlug(
  slug: string
): Promise<ProductDetailsData | null> {
  const product =
    await prisma.product.findFirst({
      where: {
        slug,

        status:
          ProductStatus.PUBLISHED,

        category: {
          is: {
            status:
              ContentStatus.PUBLISHED,
          },
        },
      },

      select: {
        id: true,

        slug: true,
        sku: true,

        name: true,

        shortDescription: true,
        description: true,

        regularPrice: true,
        discountPercent: true,

        stockQuantity: true,
        lowStockThreshold: true,

        isNewArrival: true,
        isFeatured: true,

        category: {
          select: {
            id: true,

            name: true,
            slug: true,
          },
        },

        specification: {
          select: {
            fabric: true,
            colour: true,

            sareeLength: true,

            blousePieceIncluded: true,
            blousePieceLength: true,

            workWeave: true,
            occasion: true,

            careInstructions: true,
          },
        },

        images: {
          select: {
            id: true,

            imageUrl: true,
            altText: true,

            sortOrder: true,
            isPrimary: true,
          },

          orderBy: [
            {
              isPrimary: "desc",
            },

            {
              sortOrder: "asc",
            },
          ],
        },

        productCollections: {
          where: {
            collection: {
              status:
                ContentStatus.PUBLISHED,
            },
          },

          select: {
            collection: {
              select: {
                id: true,

                name: true,
                slug: true,
              },
            },
          },

          orderBy: {
            collection: {
              sortOrder: "asc",
            },
          },
        },
      },
    });

  if (!product) {
    return null;
  }

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
    sku: product.sku,

    name: product.name,

    shortDescription:
      product.shortDescription,

    description:
      product.description,

    price: finalPrice,

    originalPrice:
      discountPercent > 0
        ? Math.round(regularPrice)
        : null,

    discountPercent,

    stock:
      product.stockQuantity,

    lowStockThreshold:
      product.lowStockThreshold,

    isNew:
      product.isNewArrival,

    isFeatured:
      product.isFeatured,

    category: {
      id: product.category.id,

      name: product.category.name,
      slug: product.category.slug,
    },

    specification:
      product.specification
        ? {
            fabric:
              product.specification
                .fabric,

            colour:
              product.specification
                .colour,

            sareeLength:
              product.specification
                .sareeLength !== null
                ? Number(
                    product.specification
                      .sareeLength
                  )
                : null,

            blousePieceIncluded:
              product.specification
                .blousePieceIncluded,

            blousePieceLength:
              product.specification
                .blousePieceLength !==
                null
                ? Number(
                    product.specification
                      .blousePieceLength
                  )
                : null,

            workWeave:
              product.specification
                .workWeave,

            occasion:
              product.specification
                .occasion,

            careInstructions:
              product.specification
                .careInstructions,
          }
        : null,

    images:
      product.images.map(
        (image) => ({
          id: image.id,

          url:
            image.imageUrl,

          alt:
            image.altText ??
            product.name,

          isPrimary:
            image.isPrimary,
        })
      ),

    collections:
      product.productCollections.map(
        (item) => ({
          id:
            item.collection.id,

          name:
            item.collection.name,

          slug:
            item.collection.slug,
        })
      ),
  };
}

/* ============================================================
   PRODUCT PAGE COMPATIBILITY ALIAS
============================================================ */

export const getProductBySlug =
  getStorefrontProductBySlug;

/* ============================================================
   RELATED PRODUCTS
============================================================ */

export async function getRelatedProducts(
  product: ProductDetailsData,
  limit = 4
): Promise<ProductCardData[]> {
  const products =
    await getStorefrontProducts({
      category: [
        product.category.slug,
      ],

      excludeSlug:
        product.slug,

      sort: "newest",
    });

  return products.slice(
    0,
    limit
  );
}

/* ============================================================
   STORE COLLECTIONS
============================================================ */

export async function getStorefrontCollections(): Promise<
  StorefrontCollectionData[]
> {
  const collections =
    await prisma.collection.findMany({
      where: {
        status:
          ContentStatus.PUBLISHED,
      },

      select: {
        id: true,

        name: true,
        slug: true,

        image: true,
        description: true,

        sortOrder: true,

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

      image:
        collection.image,

      description:
        collection.description,

      sortOrder:
        collection.sortOrder,

      productCount:
        collection._count
          .productCollections,
    })
  );
}

/* ============================================================
   SINGLE COLLECTION
============================================================ */

export async function getStorefrontCollectionBySlug(
  slug: string
): Promise<StorefrontCollectionData | null> {
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

        sortOrder: true,

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
    });

  if (!collection) {
    return null;
  }

  return {
    id: collection.id,

    name: collection.name,
    slug: collection.slug,

    image:
      collection.image,

    description:
      collection.description,

    sortOrder:
      collection.sortOrder,

    productCount:
      collection._count
        .productCollections,
  };
}

/* ============================================================
   COLLECTION PRODUCTS
============================================================ */

export async function getCollectionProducts(
  collectionSlug: string,
  options: Omit<
    GetProductsOptions,
    "collection"
  > = {}
): Promise<ProductCardData[]> {
  return getStorefrontProducts({
    ...options,

    collection: [
      collectionSlug,
    ],
  });
}

/* ============================================================
   PAGINATED COLLECTION PRODUCTS
============================================================ */

export async function getPaginatedCollectionProducts(
  collectionSlug: string,
  options: Omit<
    GetProductsOptions,
    "collection"
  > = {}
): Promise<StorefrontProductsResult> {
  return getPaginatedStorefrontProducts({
    ...options,

    collection: [
      collectionSlug,
    ],
  });
}

/* ============================================================
   STORE CATEGORIES
============================================================ */

export async function getStorefrontCategories(): Promise<
  StorefrontCategoryData[]
> {
  const categories =
    await prisma.category.findMany({
      where: {
        status:
          ContentStatus.PUBLISHED,
      },

      select: {
        id: true,

        name: true,
        slug: true,

        image: true,
        description: true,

        sortOrder: true,

        _count: {
          select: {
            products: {
              where: {
                status:
                  ProductStatus.PUBLISHED,
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

  return categories.map(
    (category) => ({
      id: category.id,

      name: category.name,
      slug: category.slug,

      image:
        category.image,

      description:
        category.description,

      sortOrder:
        category.sortOrder,

      productCount:
        category._count.products,
    })
  );
}