import { LinkType } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export type StorefrontCampaignBanner = {
  id: string;
  name: string;
  desktopImage: string;
  mobileImage: string | null;
  href: string | null;
};

function resolveCampaignHref(
  linkType: LinkType,
  linkValue: string
): string | null {
  const value = linkValue.trim();

  if (!value) {
    return null;
  }

  switch (linkType) {
    case "COLLECTION":
      return `/collections/${value}`;

    case "PRODUCT":
      return `/products/${value}`;

    case "CUSTOM":
      return value;

    default:
      return null;
  }
}

export async function getActiveCampaignBanner(): Promise<StorefrontCampaignBanner | null> {
  const now = new Date();

  const banner = await prisma.campaignBanner.findFirst({
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

  if (!banner) {
    return null;
  }

  return {
    id: banner.id,
    name: banner.name,
    desktopImage: banner.desktopImage,
    mobileImage: banner.mobileImage,
    href: resolveCampaignHref(
      banner.linkType,
      banner.linkValue
    ),
  };
}