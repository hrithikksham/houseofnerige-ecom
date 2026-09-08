import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Pencil,
  PackageCheck,
} from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getStatusLabel(
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
) {
  switch (status) {
    case "PUBLISHED":
      return "Published";

    case "ARCHIVED":
      return "Archived";

    default:
      return "Draft";
  }
}

function getStatusStyles(
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
) {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "ARCHIVED":
      return "border-border bg-background text-primary/50";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories, collections] =
    await Promise.all([
      prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          specification: true,

          images: {
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
            select: {
              collectionId: true,
            },
          },
        },
      }),

      prisma.category.findMany({
        where: {
          status: "PUBLISHED",
        },

        orderBy: {
          sortOrder: "asc",
        },

        select: {
          id: true,
          name: true,
        },
      }),

      prisma.collection.findMany({
        where: {
          status: "PUBLISHED",
        },

        orderBy: {
          sortOrder: "asc",
        },

        select: {
          id: true,
          name: true,
        },
      }),
    ]);

  if (!product) {
    notFound();
  }

  const productStatus = product.status;

  return (
    <div className="mx-auto w-full max-w-6xl pb-12">
      {/* Back navigation */}
      <Link
        href="/admin/products"
        className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-primary/60 transition-colors hover:bg-background hover:text-primary"
      >
        <ChevronLeft
          className="size-4"
          strokeWidth={1.7}
        />

        Products
      </Link>

      {/* Page header */}
      <div className="mt-6 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-soft-white">
              <Pencil
                className="size-5 text-primary"
                strokeWidth={1.5}
              />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/40">
              Catalogue
            </p>
          </div>

          <h1 className="mt-5 font-serif text-4xl tracking-tight text-primary sm:text-5xl">
            Edit Product
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-primary/60 sm:text-base">
            Update the details, images, pricing,
            inventory, specifications, and publishing
            settings for{" "}
            <span className="font-medium text-primary/80">
              {product.name}
            </span>
            .
          </p>
        </div>

        {/* Product status */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="rounded-xl border border-border bg-soft-white px-4 py-3">
            <div className="flex items-center gap-3">
              <PackageCheck
                className="size-4 text-primary/50"
                strokeWidth={1.5}
              />

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-primary/40">
                  Current Status
                </p>

                <span
                  className={`mt-1 inline-flex border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${getStatusStyles(
                    productStatus
                  )}`}
                >
                  {getStatusLabel(productStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product form */}
      <div className="mt-8">
        <ProductForm
          product={{
            id: product.id,

            name: product.name,
            sku: product.sku,

            shortDescription:
              product.shortDescription,

            description:
              product.description,

            regularPrice:
              product.regularPrice.toString(),

            discountPercent:
              product.discountPercent.toString(),

            categoryId:
              product.categoryId,

            stockQuantity:
              product.stockQuantity,

            lowStockThreshold:
              product.lowStockThreshold,

            isNewArrival:
              product.isNewArrival,

            isFeatured:
              product.isFeatured,

            status:
              product.status,

            collectionIds:
              product.productCollections.map(
                (item) => item.collectionId
              ),

            specification:
              product.specification
                ? {
                    fabric:
                      product.specification.fabric,

                    colour:
                      product.specification.colour,

                    sareeLength:
                      product.specification.sareeLength?.toString() ??
                      null,

                    blousePieceIncluded:
                      product.specification
                        .blousePieceIncluded,

                    blousePieceLength:
                      product.specification
                        .blousePieceLength?.toString() ??
                      null,

                    workWeave:
                      product.specification.workWeave,

                    occasion:
                      product.specification.occasion,

                    careInstructions:
                      product.specification
                        .careInstructions,
                  }
                : null,

            images:
              product.images.map(
                (image) => ({
                  id: image.id,
                  imageUrl: image.imageUrl,
                  altText: image.altText,
                  sortOrder: image.sortOrder,
                  isPrimary:
                    image.isPrimary,
                })
              ),
          }}
          categories={categories}
          collections={collections}
        />
      </div>
    </div>
  );
}