import Link from "next/link";
import Image from "next/image";
import {
  Archive,
  CheckCircle2,
  Eye,
  FileText,
  Package,
  Pencil,
  Plus,
  TriangleAlert,
} from "lucide-react";

import { getProducts } from "@/lib/admin/products";
import { archiveProduct } from "./actions";

function formatPrice(price: number | { toString(): string }) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function getStatusStyles(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10";

    case "ARCHIVED":
      return "bg-primary/[0.04] text-primary/45 ring-1 ring-inset ring-primary/10";

    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10";
  }
}

function getStockStyles(
  stockQuantity: number,
  lowStockThreshold: number
) {
  if (stockQuantity <= 0) {
    return "text-red-600";
  }

  if (stockQuantity <= lowStockThreshold) {
    return "text-amber-600";
  }

  return "text-primary/65";
}

export default async function ProductsPage() {
  const products = await getProducts();

  const publishedCount = products.filter(
    (product) => product.status === "PUBLISHED"
  ).length;

  const draftCount = products.filter(
    (product) => product.status === "DRAFT"
  ).length;

  const lowStockCount = products.filter(
    (product) =>
      product.status !== "ARCHIVED" &&
      product.stockQuantity <= product.lowStockThreshold
  ).length;

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary/40">
            Catalogue
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-primary sm:text-5xl">
            Products
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-primary/55">
            Create, organize, publish, and manage your complete saree
            catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-medium uppercase tracking-[0.12em] text-soft-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
        >
          <Plus className="size-4" strokeWidth={1.7} />
          Add Product
        </Link>
      </div>

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Products"
          value={products.length}
          icon={<Package className="size-4" strokeWidth={1.5} />}
        />

        <SummaryCard
          label="Published"
          value={publishedCount}
          icon={
            <CheckCircle2
              className="size-4"
              strokeWidth={1.5}
            />
          }
        />

        <SummaryCard
          label="Drafts"
          value={draftCount}
          icon={
            <FileText
              className="size-4"
              strokeWidth={1.5}
            />
          }
        />

        <SummaryCard
          label="Needs Attention"
          value={lowStockCount}
          icon={
            <TriangleAlert
              className="size-4"
              strokeWidth={1.5}
            />
          }
          alert={lowStockCount > 0}
        />
      </section>

      {/* Products */}
      {products.length === 0 ? (
        <div className="mt-8 flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-soft-white p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
            <Package
              className="size-6 text-primary/35"
              strokeWidth={1.4}
            />
          </div>

          <h2 className="mt-6 font-serif text-3xl tracking-[-0.02em] text-primary">
            No products yet
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-primary/55">
            Add your first saree with pricing, stock, specifications,
            images, and publishing details.
          </p>

          <Link
            href="/admin/products/new"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-medium uppercase tracking-[0.12em] text-soft-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95"
          >
            <Plus className="size-4" />
            Add First Product
          </Link>
        </div>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-soft-white shadow-sm">
          {/* Table Header */}
          <div className="hidden grid-cols-[72px_minmax(240px,1.7fr)_0.8fr_0.7fr_0.65fr_0.65fr_auto] items-center gap-5 border-b border-border bg-background/60 px-6 py-4 lg:grid">
            <TableHeading>Image</TableHeading>
            <TableHeading>Product</TableHeading>
            <TableHeading>Category</TableHeading>
            <TableHeading>Price</TableHeading>
            <TableHeading>Stock</TableHeading>
            <TableHeading>Status</TableHeading>

            <TableHeading align="right">
              Actions
            </TableHeading>
          </div>

          <div>
            {products.map((product) => {
              const primaryImage =
                product.images.find(
                  (image) => image.isPrimary
                ) ?? product.images[0];

              const regularPrice = Number(
                product.regularPrice
              );

              const discountPercent = Number(
                product.discountPercent
              );

              const discountedPrice =
                regularPrice -
                (regularPrice * discountPercent) / 100;

              const isLowStock =
                product.stockQuantity <=
                product.lowStockThreshold;

              const isOutOfStock =
                product.stockQuantity <= 0;

              return (
                <article
                  key={product.id}
                  className="grid gap-5 border-b border-border px-5 py-5 last:border-b-0 transition-colors hover:bg-background/40 lg:grid-cols-[72px_minmax(240px,1.7fr)_0.8fr_0.7fr_0.65fr_0.65fr_auto] lg:items-center lg:gap-5 lg:px-6"
                >
                  {/* Image */}
                  <div className="lg:self-center">
                    {primaryImage ? (
                      <div className="relative aspect-square w-[72px] overflow-hidden rounded-xl border border-border bg-background">
                        <Image
                          src={primaryImage.imageUrl}
                          alt={
                            primaryImage.altText ??
                            product.name
                          }
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-square w-[72px] items-center justify-center rounded-xl border border-border bg-background">
                        <Package
                          className="size-5 text-primary/25"
                          strokeWidth={1.4}
                        />
                      </div>
                    )}
                  </div>

                  {/* Product */}
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-primary">
                          {product.name}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-xs text-primary/40">
                            {product.sku}
                          </span>

                          {product.isNewArrival && (
                            <span className="rounded-full bg-primary/[0.06] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-primary/55">
                              New
                            </span>
                          )}

                          {product.isFeatured && (
                            <span className="rounded-full bg-primary/[0.06] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-primary/55">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <ProductCell label="Category">
                    <p className="text-sm text-primary/65">
                      {product.category.name}
                    </p>
                  </ProductCell>

                  {/* Price */}
                  <ProductCell label="Price">
                    {discountPercent > 0 ? (
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(discountedPrice)}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-primary/35 line-through">
                            {formatPrice(regularPrice)}
                          </span>

                          <span className="text-[10px] font-medium text-terracotta">
                            {discountPercent}% off
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(regularPrice)}
                      </p>
                    )}
                  </ProductCell>

                  {/* Stock */}
                  <ProductCell label="Stock">
                    <div>
                      <p
                        className={`text-sm font-medium ${getStockStyles(
                          product.stockQuantity,
                          product.lowStockThreshold
                        )}`}
                      >
                        {product.stockQuantity}
                      </p>

                      {isOutOfStock ? (
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-red-500">
                          Out of stock
                        </p>
                      ) : isLowStock ? (
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-amber-600">
                          Low stock
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-primary/35">
                          In stock
                        </p>
                      )}
                    </div>
                  </ProductCell>

                  {/* Status */}
                  <ProductCell label="Status">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] ${getStatusStyles(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </ProductCell>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:justify-end">
                    <ActionButton
                      href={`/admin/products/${product.id}`}
                      label={`View ${product.name}`}
                    >
                      <Eye
                        className="size-3.5"
                        strokeWidth={1.6}
                      />
                    </ActionButton>

                    <ActionButton
                      href={`/admin/products/${product.id}/edit`}
                      label={`Edit ${product.name}`}
                    >
                      <Pencil
                        className="size-3.5"
                        strokeWidth={1.6}
                      />
                    </ActionButton>

                    {product.status !== "ARCHIVED" && (
                      <form
                        action={async () => {
                          "use server";
                          await archiveProduct(product.id);
                        }}
                      >
                        <button
                          type="submit"
                          aria-label={`Archive ${product.name}`}
                          className="flex size-9 items-center justify-center rounded-full border border-border text-primary/45 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Archive
                            className="size-3.5"
                            strokeWidth={1.6}
                          />
                        </button>
                      </form>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  alert = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-soft-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary/40">
            {label}
          </p>

          <p
            className={`mt-4 text-3xl font-semibold tracking-[-0.03em] ${
              alert && value > 0
                ? "text-amber-600"
                : "text-primary"
            }`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex size-10 items-center justify-center rounded-xl border ${
            alert && value > 0
              ? "border-amber-200 bg-amber-50 text-amber-600"
              : "border-border bg-background text-primary/45"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <span
      className={`text-[10px] font-medium uppercase tracking-[0.14em] text-primary/40 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </span>
  );
}

function ProductCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-primary/35 lg:hidden">
        {label}
      </p>

      {children}
    </div>
  );
}

function ActionButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-border text-primary/45 transition-all hover:bg-primary hover:text-soft-white"
    >
      {children}
    </Link>
  );
}