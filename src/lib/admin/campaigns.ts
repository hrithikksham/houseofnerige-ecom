import { LinkType } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export async function getCampaigns() {
  return prisma.campaignBanner.findMany({
    orderBy: [
      {
        priority: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getCampaignById(id: string) {
  return prisma.campaignBanner.findUnique({
    where: {
      id,
    },
  });
}

export async function getCampaignFormData() {
  const [collections, products] = await Promise.all([
    prisma.collection.findMany({
      where: {
        status: "PUBLISHED",
      },

      select: {
        id: true,
        name: true,
      },

      orderBy: {
        sortOrder: "asc",
      },
    }),

    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
      },

      select: {
        id: true,
        name: true,
      },

      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return {
    collections,
    products,

    linkTypes: [
      LinkType.COLLECTION,
      LinkType.PRODUCT,
      LinkType.CUSTOM,
    ],
  };
}

export async function getActiveCampaign() {
  const now = new Date();

  return prisma.campaignBanner.findFirst({
    where: {
      isActive: true,

      AND: [
        {
          OR: [
            {
              startDate: null,
            },
            {
              startDate: {
                lte: now,
              },
            },
          ],
        },
        {
          OR: [
            {
              endDate: null,
            },
            {
              endDate: {
                gte: now,
              },
            },
          ],
        },
      ],
    },

    orderBy: [
      {
        priority: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}