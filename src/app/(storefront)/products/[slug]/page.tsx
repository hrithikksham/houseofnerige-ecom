import type { Metadata } from "next";
import {
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/storefront/product-card";

import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/storefront/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Nerige Sarees",
    };
  }

  return {
    title: `${product.name} | Nerige Sarees`,

    description:
      product.shortDescription ??
      `Shop ${product.name} from Nerige Sarees.`,

    openGraph: {
      title: product.name,

      description:
        product.shortDescription ??
        `Shop ${product.name} from Nerige Sarees.`,

      images: product.images[0]
        ? [
            {
              url: product.images[0].url,
              alt:
                product.images[0].alt ??
                product.name,
            },
          ]
        : [],
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts =
    await getRelatedProducts(product, 4);

  const isSoldOut =
    product.stock <= 0;

  const hasDiscount =
    product.originalPrice !== null &&
    product.originalPrice > product.price;

  return (
    <main className="min-h-screen bg-background text-primary">
      {/* ============================================================
          BREADCRUMB
      ============================================================ */}
      <div className="border-b border-primary/[0.08]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-3.5 text-[9px] font-medium uppercase tracking-[0.14em] sm:px-6 lg:px-10">
          <Link
            href="/"
            className="text-primary/40 transition-colors hover:text-primary"
          >
            Home
          </Link>

          <ChevronRight
            className="size-3 text-primary/20"
            strokeWidth={1.5}
          />

          <Link
            href="/shop"
            className="text-primary/40 transition-colors hover:text-primary"
          >
            Shop
          </Link>

          <ChevronRight
            className="size-3 text-primary/20"
            strokeWidth={1.5}
          />

          <Link
            href={`/shop?category=${product.category.slug}`}
            className="hidden text-primary/40 transition-colors hover:text-primary sm:block"
          >
            {product.category.name}
          </Link>

          <ChevronRight
            className="hidden size-3 text-primary/20 sm:block"
            strokeWidth={1.5}
          />

          <span className="truncate text-primary/70">
            {product.name}
          </span>
        </div>
      </div>

      {/* ============================================================
          PRODUCT
      ============================================================ */}
      <section className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)] lg:gap-12 xl:gap-20">
          {/* ========================================================
              GALLERY
          ======================================================== */}
          <div className="min-w-0">
            {product.images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {product.images.map(
                  (image, index) => (
                    <ProductImage
                      key={image.id}
                      src={image.url}
                      alt={image.alt}
                      index={index}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-[24px] border border-primary/[0.06] bg-primary/[0.025]">
                <ShoppingBag
                  className="size-10 text-primary/20"
                  strokeWidth={1.2}
                />
              </div>
            )}
          </div>

          {/* ========================================================
              PRODUCT INFORMATION
          ======================================================== */}
          <div className="lg:sticky lg:top-24">
            {/* Top badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="rounded-full bg-terracotta/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-terracotta transition-colors hover:bg-terracotta hover:text-soft-white"
              >
                {product.category.name}
              </Link>

              {product.isNew && (
                <span className="rounded-full bg-primary/[0.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-primary/60">
                  New arrival
                </span>
              )}
            </div>

            {/* Product title */}
            <h1 className="mt-5 max-w-2xl font-serif text-[2.8rem] leading-[0.94] tracking-[-0.045em] text-primary sm:text-6xl xl:text-7xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-3xl font-semibold tracking-[-0.04em] text-primary">
                {formatPrice(product.price)}
              </span>

              {hasDiscount &&
                product.originalPrice !== null && (
                  <>
                    <span className="text-sm text-primary/35 line-through">
                      {formatPrice(
                        product.originalPrice
                      )}
                    </span>

                    <span className="rounded-full bg-terracotta/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                      {product.discountPercent}% off
                    </span>
                  </>
                )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-primary/60 sm:text-base sm:leading-8">
                {product.shortDescription}
              </p>
            )}

            {/* Stock */}
            <div className="mt-7 flex items-center gap-2.5">
              <span
                className={`
                  size-1.5 rounded-full
                  ${
                    isSoldOut
                      ? "bg-terracotta"
                      : "bg-emerald-600"
                  }
                `}
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-primary/55">
                {isSoldOut
                  ? "Currently unavailable"
                  : product.stock <=
                      product.lowStockThreshold
                    ? `Only ${product.stock} remaining`
                    : "Available and ready to ship"}
              </span>
            </div>

            {/* ======================================================
                PRODUCT SPECIFICATIONS
            ====================================================== */}
            <div className="mt-9 border-y border-primary/[0.08]">
              <dl className="divide-y divide-primary/[0.08]">
                {product.specification?.fabric && (
                  <SpecificationRow
                    label="Fabric"
                    value={
                      product.specification.fabric
                    }
                  />
                )}

                {product.specification?.colour && (
                  <SpecificationRow
                    label="Colour"
                    value={
                      product.specification.colour
                    }
                  />
                )}

                {product.specification?.workWeave && (
                  <SpecificationRow
                    label="Work / Weave"
                    value={
                      product.specification.workWeave
                    }
                  />
                )}

                {product.specification?.occasion && (
                  <SpecificationRow
                    label="Occasion"
                    value={
                      product.specification.occasion
                    }
                  />
                )}

                {product.specification
                  ?.sareeLength !== null &&
                  product.specification
                    ?.sareeLength !== undefined && (
                    <SpecificationRow
                      label="Saree length"
                      value={`${product.specification.sareeLength} m`}
                    />
                  )}

                {product.specification && (
                  <SpecificationRow
                    label="Blouse piece"
                    value={
                      product.specification
                        .blousePieceIncluded
                        ? product.specification
                            .blousePieceLength
                          ? `Included · ${product.specification.blousePieceLength} m`
                          : "Included"
                        : "Not included"
                    }
                  />
                )}
              </dl>
            </div>

            {/* ======================================================
                PURCHASE
            ====================================================== */}
            <div className="mt-8">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 items-center rounded-full border border-primary/[0.12] bg-primary/[0.025] p-1">
                  <button
                    type="button"
                    disabled={isSoldOut}
                    aria-label="Decrease quantity"
                    className="flex size-10 items-center justify-center rounded-full text-primary/60 transition-colors hover:bg-primary/[0.07] hover:text-primary disabled:opacity-30"
                  >
                    <Minus
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </button>

                  <span className="flex w-9 items-center justify-center text-sm font-medium">
                    1
                  </span>

                  <button
                    type="button"
                    disabled={isSoldOut}
                    aria-label="Increase quantity"
                    className="flex size-10 items-center justify-center rounded-full text-primary/60 transition-colors hover:bg-primary/[0.07] hover:text-primary disabled:opacity-30"
                  >
                    <Plus
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <span className="text-xs text-primary/40">
                  Select quantity
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  disabled={isSoldOut}
                  className="group flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-soft-white shadow-[0_12px_35px_rgba(23,58,52,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(23,58,52,0.20)] disabled:pointer-events-none disabled:opacity-40"
                >
                  <ShoppingBag
                    className="size-4 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />

                  {isSoldOut
                    ? "Sold out"
                    : "Add to bag"}
                </button>

                <button
                  type="button"
                  disabled={isSoldOut}
                  className="flex h-13 items-center justify-center rounded-full border border-primary/[0.16] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-all duration-300 hover:bg-primary/[0.04] disabled:pointer-events-none disabled:opacity-40"
                >
                  Buy now
                </button>
              </div>
            </div>

            {/* ======================================================
                TRUST
            ====================================================== */}
            <div className="mt-9 grid gap-2 border-t border-primary/[0.08] pt-7">
              <TrustItem
                icon={<Truck />}
                title="Thoughtfully delivered"
                description="Carefully packed and delivered with tracking."
              />

              <TrustItem
                icon={<ShieldCheck />}
                title="Secure checkout"
                description="A protected and secure payment experience."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT STORY
      ============================================================ */}
      <section className="border-y border-primary/[0.08] bg-primary/[0.025]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles
                  className="size-4 text-terracotta"
                  strokeWidth={1.5}
                />

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-terracotta">
                  The details
                </p>
              </div>

              <h2 className="mt-5 font-serif text-4xl leading-[1] tracking-[-0.035em] text-primary sm:text-5xl">
                Made for moments
                <br />
                worth remembering.
              </h2>

              {product.description ? (
                <div className="mt-7 whitespace-pre-line text-[15px] leading-8 text-primary/60 sm:text-base">
                  {product.description}
                </div>
              ) : (
                <p className="mt-7 max-w-xl text-[15px] leading-8 text-primary/55 sm:text-base">
                  Every Nerige saree is selected
                  for its craftsmanship, graceful
                  drape and timeless elegance.
                </p>
              )}
            </div>

            <div className="divide-y divide-primary/[0.08]">
              <DetailBlock
                label="Care"
                title="Care instructions"
                content={
                  product.specification
                    ?.careInstructions ??
                  "We recommend gentle handling and professional dry cleaning to preserve the fabric, colour and intricate work."
                }
              />

              <DetailBlock
                label="Shipping"
                title="Delivery & returns"
                content="Your order is carefully packed and dispatched with tracking. Delivery timelines depend on your location."
              />

              {product.collections.length > 0 && (
                <div className="py-8 first:pt-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                    Collections
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.collections.map(
                      (collection) => (
                        <Link
                          key={collection.id}
                          href={`/collections/${collection.slug}`}
                          className="rounded-full border border-primary/[0.12] px-4 py-2 text-[10px] font-medium text-primary/65 transition-all hover:border-primary/30 hover:text-primary"
                        >
                          {collection.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          REVIEWS
      ============================================================ */}
      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 border-b border-primary/[0.08] pb-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-terracotta">
              Customer reviews
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[1] tracking-[-0.035em] text-primary sm:text-5xl">
              Worn. Loved.
              <br />
              Remembered.
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-xl text-sm leading-8 text-primary/55 sm:text-base">
              Share your experience and help other
              customers discover the saree that feels
              right for their special moments.
            </p>
          </div>
        </div>

        <div className="flex min-h-[240px] items-center justify-center py-12 text-center">
          <div className="max-w-md">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary/35">
              Verified customer reviews
            </p>

            <h3 className="mt-4 font-serif text-2xl tracking-[-0.02em] text-primary">
              Be the first to share your experience.
            </h3>

            <p className="mt-3 text-sm leading-7 text-primary/50">
              Reviews from verified Nerige customers
              will appear here.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          RELATED PRODUCTS
      ============================================================ */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-primary/[0.08]">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-terracotta">
                  You may also like
                </p>

                <h2 className="mt-5 font-serif text-4xl tracking-[-0.035em] text-primary sm:text-5xl">
                  More to discover.
                </h2>
              </div>

              <Link
                href="/shop"
                className="hidden rounded-full border border-primary/[0.12] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-primary transition-all hover:bg-primary hover:text-soft-white sm:block"
              >
                View all
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map(
                (relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ============================================================
   PRODUCT IMAGE
============================================================ */

function ProductImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const isPrimary =
    index === 0;

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-[20px]
        bg-primary/[0.025]
        sm:rounded-[28px]
        ${
          isPrimary
            ? "sm:col-span-2"
            : ""
        }
      `}
    >
      <div
        className={
          isPrimary
            ? "relative aspect-[4/5]"
            : "relative aspect-[3/4]"
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={isPrimary}
          quality={
            isPrimary
              ? 82
              : 65
          }
          sizes={
            isPrimary
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 55vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw"
          }
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />
      </div>
    </div>
  );
}

/* ============================================================
   SPECIFICATION ROW
============================================================ */

function SpecificationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <dt className="text-[9px] font-semibold uppercase tracking-[0.15em] text-primary/40">
        {label}
      </dt>

      <dd className="text-right text-sm font-medium text-primary/75">
        {value}
      </dd>
    </div>
  );
}

/* ============================================================
   TRUST ITEM
============================================================ */

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 py-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/[0.05] text-primary/60">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold text-primary">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-primary/45">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL BLOCK
============================================================ */

function DetailBlock({
  label,
  title,
  content,
}: {
  label: string;
  title: string;
  content: string;
}) {
  return (
    <div className="py-8 first:pt-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-terracotta">
        {label}
      </p>

      <h3 className="mt-4 font-serif text-2xl tracking-[-0.025em] text-primary">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-8 text-primary/55">
        {content}
      </p>
    </div>
  );
}