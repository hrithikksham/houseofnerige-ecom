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

export async function createCollection(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const statusValue = formData.get("status")?.toString();

  if (!name) {
    return {
      success: false,
      error: "Collection name is required.",
    };
  }

  const slug = createSlug(name);

  if (!slug) {
    return {
      success: false,
      error: "Please enter a valid collection name.",
    };
  }

  const existingCollection = await prisma.collection.findUnique({
    where: {
      slug,
    },
  });

  if (existingCollection) {
    return {
      success: false,
      error: "A collection with this name already exists.",
    };
  }

  const lastCollection = await prisma.collection.findFirst({
    orderBy: {
      sortOrder: "desc",
    },
  });

  const status =
    statusValue === ContentStatus.PUBLISHED
      ? ContentStatus.PUBLISHED
      : ContentStatus.DRAFT;

  await prisma.collection.create({
    data: {
      name,
      slug,
      description: description || null,
      status,
      sortOrder: (lastCollection?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/collections");

  return {
    success: true,
  };
}

export async function updateCollection(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const statusValue = formData.get("status")?.toString();

  if (!id || !name) {
    return {
      success: false,
      error: "Collection information is missing.",
    };
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id,
    },
  });

  if (!collection) {
    return {
      success: false,
      error: "Collection not found.",
    };
  }

  const slug = createSlug(name);

  const duplicateCollection = await prisma.collection.findFirst({
    where: {
      slug,
      NOT: {
        id,
      },
    },
  });

  if (duplicateCollection) {
    return {
      success: false,
      error: "A collection with this name already exists.",
    };
  }

  const status =
    statusValue === ContentStatus.PUBLISHED
      ? ContentStatus.PUBLISHED
      : ContentStatus.DRAFT;

  await prisma.collection.update({
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

  revalidatePath("/admin/collections");

  return {
    success: true,
  };
}

export async function archiveCollection(id: string) {
  await requireAdmin();

  await prisma.collection.update({
    where: {
      id,
    },
    data: {
      status: ContentStatus.ARCHIVED,
    },
  });

  revalidatePath("/admin/collections");

  return {
    success: true,
  };
}

export async function restoreCollection(id: string) {
  await requireAdmin();

  await prisma.collection.update({
    where: {
      id,
    },
    data: {
      status: ContentStatus.DRAFT,
    },
  });

  revalidatePath("/admin/collections");

  return {
    success: true,
  };
}

export async function moveCollection(
  collectionId: string,
  direction: "up" | "down"
) {
  await requireAdmin();

  const collections = await prisma.collection.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });

  const currentIndex = collections.findIndex(
    (collection) => collection.id === collectionId
  );

  if (currentIndex === -1) {
    return {
      success: false,
      error: "Collection not found.",
    };
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= collections.length
  ) {
    return {
      success: false,
    };
  }

  const currentCollection = collections[currentIndex];
  const targetCollection = collections[targetIndex];

  await prisma.$transaction([
    prisma.collection.update({
      where: {
        id: currentCollection.id,
      },
      data: {
        sortOrder: targetCollection.sortOrder,
      },
    }),

    prisma.collection.update({
      where: {
        id: targetCollection.id,
      },
      data: {
        sortOrder: currentCollection.sortOrder,
      },
    }),
  ]);

  revalidatePath("/admin/collections");

  return {
    success: true,
  };
}