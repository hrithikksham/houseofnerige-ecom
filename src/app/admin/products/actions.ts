"use server";

import { revalidatePath } from "next/cache";

import {
  ContentStatus,
  ProductStatus,
} from "@/generated/prisma/client";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

type ProductImageInput = {
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

function createSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getString(
  formData: FormData,
  key: string
) {
  return formData.get(key)?.toString().trim() || "";
}

function getOptionalString(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  return value || null;
}

function getOptionalNumber(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function getNumber(
  formData: FormData,
  key: string,
  fallback = 0
) {
  const value = getString(formData, key);

  if (!value) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function getCollectionIds(formData: FormData) {
  return [
    ...new Set(
      formData
        .getAll("collectionIds")
        .map((value) => value.toString().trim())
        .filter(Boolean)
    ),
  ];
}

function getProductImages(
  formData: FormData
): ProductImageInput[] {
  const imageUrls = formData
    .getAll("imageUrls")
    .map((value) => value.toString().trim())
    .filter(Boolean);

  const imageAltTexts = formData
    .getAll("imageAltTexts")
    .map((value) => value.toString().trim());

  const imageSortOrders = formData
    .getAll("imageSortOrders")
    .map((value) => Number(value));

  const requestedPrimaryImageIndex = Number(
    getString(formData, "primaryImageIndex")
  );

  const primaryImageIndex =
    Number.isInteger(requestedPrimaryImageIndex) &&
    requestedPrimaryImageIndex >= 0 &&
    requestedPrimaryImageIndex < imageUrls.length
      ? requestedPrimaryImageIndex
      : 0;

  return imageUrls.map((imageUrl, index) => ({
    imageUrl,

    altText:
      imageAltTexts[index]?.trim() || null,

    sortOrder: Number.isFinite(
      imageSortOrders[index]
    )
      ? imageSortOrders[index]
      : index,

    isPrimary: index === primaryImageIndex,
  }));
}

async function validateProductRelations(
  categoryId: string,
  collectionIds: string[]
) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    return "Please select a valid published category.";
  }

  if (collectionIds.length > 0) {
    const collections =
      await prisma.collection.findMany({
        where: {
          id: {
            in: collectionIds,
          },

          status: ContentStatus.PUBLISHED,
        },

        select: {
          id: true,
        },
      });

    if (
      collections.length !==
      collectionIds.length
    ) {
      return (
        "One or more selected collections " +
        "are invalid."
      );
    }
  }

  return null;
}

function getProductStatus(formData: FormData) {
  return getString(formData, "status") ===
    ProductStatus.PUBLISHED
    ? ProductStatus.PUBLISHED
    : ProductStatus.DRAFT;
}

function getProductSpecificationData(
  formData: FormData
) {
  return {
    fabric: getOptionalString(
      formData,
      "fabric"
    ),

    colour: getOptionalString(
      formData,
      "colour"
    ),

    sareeLength: getOptionalNumber(
      formData,
      "sareeLength"
    ),

    blousePieceIncluded:
      formData.get("blousePieceIncluded") ===
      "on",

    blousePieceLength: getOptionalNumber(
      formData,
      "blousePieceLength"
    ),

    workWeave: getOptionalString(
      formData,
      "workWeave"
    ),

    occasion: getOptionalString(
      formData,
      "occasion"
    ),

    careInstructions: getOptionalString(
      formData,
      "careInstructions"
    ),
  };
}

function revalidateStorefrontProduct(
  slug: string
) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/collections");
  revalidatePath(`/products/${slug}`);
}

export async function createProduct(
  formData: FormData
) {
  await requireAdmin();

  const name = getString(formData, "name");
  const sku = getString(formData, "sku");

  const categoryId = getString(
    formData,
    "categoryId"
  );

  const regularPrice = getNumber(
    formData,
    "regularPrice"
  );

  const discountPercent = getNumber(
    formData,
    "discountPercent"
  );

  const stockQuantity = getNumber(
    formData,
    "stockQuantity"
  );

  const lowStockThreshold = getNumber(
    formData,
    "lowStockThreshold",
    3
  );

  const collectionIds =
    getCollectionIds(formData);

  const images =
    getProductImages(formData);

  if (!name) {
    return {
      success: false,
      error: "Product name is required.",
    };
  }

  if (!sku) {
    return {
      success: false,
      error: "SKU is required.",
    };
  }

  if (!categoryId) {
    return {
      success: false,
      error: "Please select a category.",
    };
  }

  if (images.length === 0) {
    return {
      success: false,
      error:
        "Please upload at least one product image.",
    };
  }

  if (regularPrice <= 0) {
    return {
      success: false,
      error:
        "Regular price must be greater than zero.",
    };
  }

  if (
    discountPercent < 0 ||
    discountPercent > 100
  ) {
    return {
      success: false,
      error:
        "Discount must be between 0 and 100 percent.",
    };
  }

  if (stockQuantity < 0) {
    return {
      success: false,
      error:
        "Stock quantity cannot be negative.",
    };
  }

  const slug = createSlug(name);

  if (!slug) {
    return {
      success: false,
      error:
        "Please enter a valid product name.",
    };
  }

  const [
    existingSlug,
    existingSku,
  ] = await Promise.all([
    prisma.product.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    }),

    prisma.product.findUnique({
      where: {
        sku,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (existingSlug) {
    return {
      success: false,
      error:
        "A product with this name already exists.",
    };
  }

  if (existingSku) {
    return {
      success: false,
      error:
        "This SKU is already in use.",
    };
  }

  const relationError =
    await validateProductRelations(
      categoryId,
      collectionIds
    );

  if (relationError) {
    return {
      success: false,
      error: relationError,
    };
  }

  const status = getProductStatus(formData);

  await prisma.product.create({
    data: {
      name,
      slug,
      sku,

      shortDescription: getOptionalString(
        formData,
        "shortDescription"
      ),

      description: getOptionalString(
        formData,
        "description"
      ),

      regularPrice,
      discountPercent,

      categoryId,

      stockQuantity,
      lowStockThreshold,

      isNewArrival:
        formData.get("isNewArrival") === "on",

      isFeatured:
        formData.get("isFeatured") === "on",

      status,

      specification: {
        create:
          getProductSpecificationData(
            formData
          ),
      },

      images: {
        create: images.map((image) => ({
          imageUrl: image.imageUrl,
          altText: image.altText,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        })),
      },

      productCollections: {
        create: collectionIds.map(
          (collectionId) => ({
            collectionId,
          })
        ),
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");

  revalidateStorefrontProduct(slug);

  return {
    success: true,
  };
}

export async function updateProduct(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    return {
      success: false,
      error: "Product ID is missing.",
    };
  }

  const existingProduct =
    await prisma.product.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        slug: true,
      },
    });

  if (!existingProduct) {
    return {
      success: false,
      error: "Product not found.",
    };
  }

  const name = getString(formData, "name");
  const sku = getString(formData, "sku");

  const categoryId = getString(
    formData,
    "categoryId"
  );

  const regularPrice = getNumber(
    formData,
    "regularPrice"
  );

  const discountPercent = getNumber(
    formData,
    "discountPercent"
  );

  const stockQuantity = getNumber(
    formData,
    "stockQuantity"
  );

  const lowStockThreshold = getNumber(
    formData,
    "lowStockThreshold",
    3
  );

  const collectionIds =
    getCollectionIds(formData);

  const images =
    getProductImages(formData);

  if (!name) {
    return {
      success: false,
      error: "Product name is required.",
    };
  }

  if (!sku) {
    return {
      success: false,
      error: "SKU is required.",
    };
  }

  if (!categoryId) {
    return {
      success: false,
      error: "Please select a category.",
    };
  }

  if (images.length === 0) {
    return {
      success: false,
      error:
        "Please upload at least one product image.",
    };
  }

  if (regularPrice <= 0) {
    return {
      success: false,
      error:
        "Regular price must be greater than zero.",
    };
  }

  if (
    discountPercent < 0 ||
    discountPercent > 100
  ) {
    return {
      success: false,
      error:
        "Discount must be between 0 and 100 percent.",
    };
  }

  if (stockQuantity < 0) {
    return {
      success: false,
      error:
        "Stock quantity cannot be negative.",
    };
  }

  const slug = createSlug(name);

  if (!slug) {
    return {
      success: false,
      error:
        "Please enter a valid product name.",
    };
  }

  const [
    duplicateSlug,
    duplicateSku,
  ] = await Promise.all([
    prisma.product.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    }),

    prisma.product.findFirst({
      where: {
        sku,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (duplicateSlug) {
    return {
      success: false,
      error:
        "A product with this name already exists.",
    };
  }

  if (duplicateSku) {
    return {
      success: false,
      error:
        "This SKU is already in use.",
    };
  }

  const relationError =
    await validateProductRelations(
      categoryId,
      collectionIds
    );

  if (relationError) {
    return {
      success: false,
      error: relationError,
    };
  }

  const status = getProductStatus(formData);

  await prisma.product.update({
    where: {
      id,
    },

    data: {
      name,
      slug,
      sku,

      shortDescription: getOptionalString(
        formData,
        "shortDescription"
      ),

      description: getOptionalString(
        formData,
        "description"
      ),

      regularPrice,
      discountPercent,

      categoryId,

      stockQuantity,
      lowStockThreshold,

      isNewArrival:
        formData.get("isNewArrival") === "on",

      isFeatured:
        formData.get("isFeatured") === "on",

      status,

      specification: {
        upsert: {
          create:
            getProductSpecificationData(
              formData
            ),

          update:
            getProductSpecificationData(
              formData
            ),
        },
      },

      images: {
        deleteMany: {},

        create: images.map((image) => ({
          imageUrl: image.imageUrl,
          altText: image.altText,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        })),
      },

      productCollections: {
        deleteMany: {},

        create: collectionIds.map(
          (collectionId) => ({
            collectionId,
          })
        ),
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(
    `/admin/products/${id}/edit`
  );

  // Revalidate old URL if the product name/slug changed.
  revalidateStorefrontProduct(
    existingProduct.slug
  );

  revalidateStorefrontProduct(slug);

  return {
    success: true,
  };
}

export async function archiveProduct(
  id: string
) {
  await requireAdmin();

  const product =
    await prisma.product.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        slug: true,
      },
    });

  if (!product) {
    return {
      success: false,
      error: "Product not found.",
    };
  }

  await prisma.product.update({
    where: {
      id,
    },

    data: {
      status: ProductStatus.ARCHIVED,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");

  revalidateStorefrontProduct(
    product.slug
  );

  return {
    success: true,
  };
}