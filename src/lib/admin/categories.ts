import { ContentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: {
      id,
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: {
      slug,
    },
  });
}

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}