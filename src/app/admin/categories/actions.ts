"use server";

import { revalidatePath } from "next/cache";
import { ContentStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin/auth";

import { prisma } from "@/lib/prisma";


function createSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}


export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const statusValue = formData.get("status")?.toString();

  if (!name) {
    return {
      success: false,
      error: "Category name is required.",
    };
  }

  const slug = createSlug(name);

  if (!slug) {
    return {
      success: false,
      error: "Please enter a valid category name.",
    };
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (existingCategory) {
    return {
      success: false,
      error: "A category with this name already exists.",
    };
  }

  const lastCategory = await prisma.category.findFirst({
    orderBy: {
      sortOrder: "desc",
    },
  });

  const status =
  statusValue === ContentStatus.PUBLISHED
    ? ContentStatus.PUBLISHED
    : statusValue === ContentStatus.ARCHIVED
      ? ContentStatus.ARCHIVED
      : ContentStatus.DRAFT;

  await prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
      status,
      sortOrder: (lastCategory?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
  };
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const statusValue = formData.get("status")?.toString();

  if (!id || !name) {
    return {
      success: false,
      error: "Category information is missing.",
    };
  }

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    return {
      success: false,
      error: "Category not found.",
    };
  }

  const slug = createSlug(name);

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      slug,
      NOT: {
        id,
      },
    },
  });

  if (duplicateCategory) {
    return {
      success: false,
      error: "A category with this name already exists.",
    };
  }

  const status =
    statusValue === ContentStatus.PUBLISHED
      ? ContentStatus.PUBLISHED
      : ContentStatus.DRAFT;

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      description: description || null,
      status,
    },
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
  };
}

export async function archiveCategory(id: string) {
  await requireAdmin();

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      status: ContentStatus.ARCHIVED,
    },
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
  };
}

export async function restoreCategory(id: string) {
  await requireAdmin();

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      status: ContentStatus.DRAFT,
    },
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
  };
}

export async function moveCategory(
  categoryId: string,
  direction: "up" | "down"
) {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });

  const currentIndex = categories.findIndex(
    (category) => category.id === categoryId
  );

  if (currentIndex === -1) {
    return {
      success: false,
      error: "Category not found.",
    };
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= categories.length
  ) {
    return {
      success: false,
    };
  }

  const currentCategory = categories[currentIndex];
  const targetCategory = categories[targetIndex];

  await prisma.$transaction([
    prisma.category.update({
      where: {
        id: currentCategory.id,
      },
      data: {
        sortOrder: targetCategory.sortOrder,
      },
    }),

    prisma.category.update({
      where: {
        id: targetCategory.id,
      },
      data: {
        sortOrder: currentCategory.sortOrder,
      },
    }),
  ]);

  revalidatePath("/admin/categories");

  return {
    success: true,
  };
}

