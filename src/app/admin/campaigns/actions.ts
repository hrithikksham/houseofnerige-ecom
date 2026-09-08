"use server";

import { revalidatePath } from "next/cache";

import { LinkType } from "@/generated/prisma/client";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

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

function getOptionalDate(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getPriority(formData: FormData) {
  const value = Number(
    getString(formData, "priority")
  );

  if (!Number.isInteger(value) || value < 0) {
    return 0;
  }

  return value;
}

function getLinkType(
  formData: FormData
): LinkType | null {
  const value = getString(
    formData,
    "linkType"
  );

  if (value === LinkType.COLLECTION) {
    return LinkType.COLLECTION;
  }

  if (value === LinkType.PRODUCT) {
    return LinkType.PRODUCT;
  }

  if (value === LinkType.CUSTOM) {
    return LinkType.CUSTOM;
  }

  return null;
}

async function validateLink(
  linkType: LinkType,
  linkValue: string
) {
  if (!linkValue) {
    return "Please select a campaign destination.";
  }

  if (linkType === LinkType.COLLECTION) {
    const collection =
      await prisma.collection.findFirst({
        where: {
          id: linkValue,
          status: "PUBLISHED",
        },

        select: {
          id: true,
        },
      });

    if (!collection) {
      return (
        "Please select a valid published collection."
      );
    }
  }

  if (linkType === LinkType.PRODUCT) {
    const product =
      await prisma.product.findFirst({
        where: {
          id: linkValue,
          status: "PUBLISHED",
        },

        select: {
          id: true,
        },
      });

    if (!product) {
      return (
        "Please select a valid published product."
      );
    }
  }

  if (linkType === LinkType.CUSTOM) {
    if (!linkValue.startsWith("/")) {
      return (
        "Custom campaign links must start with '/'."
      );
    }
  }

  return null;
}

function revalidateCampaignPaths() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/campaigns");
}

async function validateCampaign(
  formData: FormData
) {
  const name = getString(formData, "name");

  const desktopImage = getString(
    formData,
    "desktopImage"
  );

  const mobileImage = getOptionalString(
    formData,
    "mobileImage"
  );

  const linkType = getLinkType(
    formData
  );

  const linkValue = getString(
    formData,
    "linkValue"
  );

  const startDate = getOptionalDate(
    formData,
    "startDate"
  );

  const endDate = getOptionalDate(
    formData,
    "endDate"
  );

  const priority = getPriority(
    formData
  );

  const isActive =
    formData.get("isActive") === "on";

  if (!name) {
    return {
      success: false as const,
      error: "Campaign name is required.",
    };
  }

  if (!desktopImage) {
    return {
      success: false as const,
      error:
        "Please upload a desktop campaign image.",
    };
  }

  if (!linkType) {
    return {
      success: false as const,
      error:
        "Please select a campaign destination.",
    };
  }

  if (
    startDate &&
    endDate &&
    endDate < startDate
  ) {
    return {
      success: false as const,
      error:
        "End date must be after the start date.",
    };
  }

  const linkError = await validateLink(
    linkType,
    linkValue
  );

  if (linkError) {
    return {
      success: false as const,
      error: linkError,
    };
  }

  return {
    success: true as const,

    data: {
      name,
      desktopImage,
      mobileImage,
      linkType,
      linkValue,
      startDate,
      endDate,
      priority,
      isActive,
    },
  };
}

export async function createCampaign(
  formData: FormData
) {
  await requireAdmin();

  const result = await validateCampaign(
    formData
  );

  if (!result.success) {
    return result;
  }

  await prisma.campaignBanner.create({
    data: result.data,
  });

  revalidateCampaignPaths();

  return {
    success: true,
  };
}

export async function updateCampaign(
  formData: FormData
) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    return {
      success: false,
      error: "Campaign ID is missing.",
    };
  }

  const existingCampaign =
    await prisma.campaignBanner.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

  if (!existingCampaign) {
    return {
      success: false,
      error: "Campaign not found.",
    };
  }

  const result = await validateCampaign(
    formData
  );

  if (!result.success) {
    return result;
  }

  await prisma.campaignBanner.update({
    where: {
      id,
    },

    data: result.data,
  });

  revalidateCampaignPaths();

  revalidatePath(
    `/admin/campaigns/${id}/edit`
  );

  return {
    success: true,
  };
}

export async function deleteCampaign(
  id: string
) {
  await requireAdmin();

  const campaign =
    await prisma.campaignBanner.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

  if (!campaign) {
    return {
      success: false,
      error: "Campaign not found.",
    };
  }

  await prisma.campaignBanner.delete({
    where: {
      id,
    },
  });

  revalidateCampaignPaths();

  return {
    success: true,
  };
}

export async function toggleCampaignStatus(
  id: string
) {
  await requireAdmin();

  const campaign =
    await prisma.campaignBanner.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        isActive: true,
      },
    });

  if (!campaign) {
    return {
      success: false,
      error: "Campaign not found.",
    };
  }

  await prisma.campaignBanner.update({
    where: {
      id,
    },

    data: {
      isActive: !campaign.isActive,
    },
  });

  revalidateCampaignPaths();

  return {
    success: true,
  };
}