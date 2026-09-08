import {
  ContentStatus,
  ProductStatus,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export async function getStorefrontFilterOptions() {
  const [
    categories,
    colourRows,
    fabricRows,
    occasionRows,
    workWeaveRows,
  ] = await Promise.all([
    prisma.category.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),

    prisma.productSpecification.findMany({
      where: {
        product: {
          status: ProductStatus.PUBLISHED,
        },
        colour: {
          not: null,
        },
      },
      select: {
        colour: true,
      },
      distinct: ["colour"],
    }),

    prisma.productSpecification.findMany({
      where: {
        product: {
          status: ProductStatus.PUBLISHED,
        },
        fabric: {
          not: null,
        },
      },
      select: {
        fabric: true,
      },
      distinct: ["fabric"],
    }),

    prisma.productSpecification.findMany({
      where: {
        product: {
          status: ProductStatus.PUBLISHED,
        },
        occasion: {
          not: null,
        },
      },
      select: {
        occasion: true,
      },
      distinct: ["occasion"],
    }),

    prisma.productSpecification.findMany({
      where: {
        product: {
          status: ProductStatus.PUBLISHED,
        },
        workWeave: {
          not: null,
        },
      },
      select: {
        workWeave: true,
      },
      distinct: ["workWeave"],
    }),
  ]);

  return {
    categories,

    colours: colourRows
      .map((item) => item.colour)
      .filter(
        (colour): colour is string =>
          typeof colour === "string"
      )
      .sort((a, b) => a.localeCompare(b)),

    fabrics: fabricRows
      .map((item) => item.fabric)
      .filter(
        (fabric): fabric is string =>
          typeof fabric === "string"
      )
      .sort((a, b) => a.localeCompare(b)),

    occasions: occasionRows
      .map((item) => item.occasion)
      .filter(
        (occasion): occasion is string =>
          typeof occasion === "string"
      )
      .sort((a, b) => a.localeCompare(b)),

    workWeaves: workWeaveRows
      .map((item) => item.workWeave)
      .filter(
        (workWeave): workWeave is string =>
          typeof workWeave === "string"
      )
      .sort((a, b) => a.localeCompare(b)),
  };
}