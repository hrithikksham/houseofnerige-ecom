import { ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
      _count: {
        select: {
          productCollections: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      specification: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      productCollections: {
        include: {
          collection: true,
        },
      },
    },
  });
}

export async function getProductFormData() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),

    prisma.collection.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),
  ]);

  return {
    categories,
    collections,
  };
}

export async function getProductCountByStatus(status: ProductStatus) {
  return prisma.product.count({
    where: {
      status,
    },
  });
}