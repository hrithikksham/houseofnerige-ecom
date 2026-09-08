import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

import type { ProductCardData } from "@/lib/storefront/products";

type ProductCardProps = {
  product: ProductCardData;
  priority?: boolean;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const originalPrice = product.originalPrice;

  const hasDiscount =
    originalPrice !== null &&
    originalPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((originalPrice! - product.price) / originalPrice!) *
          100
      )
    : 0;

  const productImage = product.images[0];
  const isSoldOut = product.stock <= 0;

  return (
    <article className="group relative min-w-0">
      <Link
        href={`/products/${product.slug}`}
        className="
          block
          overflow-hidden
          rounded-[18px]
          border
          border-[#173A34]/25
          bg-[#F8F4EA]
          shadow-[0_2px_0_rgba(23,58,52,0.06)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-[#173A34]/55
          hover:shadow-[0_16px_40px_rgba(23,58,52,0.12)]
          sm:rounded-[22px]
        "
        aria-label={`View ${product.name}`}
      >
        {/* Product image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#E5E0D5]">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              priority={priority}
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                (max-width: 1280px) 25vw,
                320px
              "
              className={`
                object-cover
                transition-transform
                duration-700
                ease-out
                will-change-transform
                group-hover:scale-[1.025]
                ${
                  isSoldOut
                    ? "opacity-50 grayscale-[0.25]"
                    : ""
                }
              `}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag
                className="size-7 text-[#173A34]/25"
                strokeWidth={1.3}
              />
            </div>
          )}

          {/* Strong image frame */}
          <div className="pointer-events-none absolute inset-0 border-b border-[#173A34]/20" />

          {/* Image hover shading */}
          <div className="pointer-events-none absolute inset-0 bg-[#173A34]/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* New badge */}
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            {product.isNew && (
              <span className="border border-[#173A34]/20 bg-[#F8F4EA] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#173A34] shadow-sm">
                New
              </span>
            )}
          </div>

          {/* Discount */}
          {hasDiscount && (
            <span className="absolute right-3 top-3 border border-[#F8F4EA]/20 bg-[#173A34] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#F8F4EA] shadow-sm sm:right-4 sm:top-4">
              {discountPercentage}% off
            </span>
          )}

          {/* Sold out */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#173A34]/15">
              <span className="border border-[#173A34]/30 bg-[#F8F4EA] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#173A34]">
                Sold out
              </span>
            </div>
          )}

          {/* Quick view */}
          {!isSoldOut && (
            <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
              <div className="flex h-11 items-center justify-between border border-[#173A34]/20 bg-[#F8F4EA] px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#173A34] shadow-md">
                <span>View product</span>

                <ArrowUpRight
                  className="size-4"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="border-t border-[#173A34]/15 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.categoryName && (
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#173A34]/55">
                  {product.categoryName}
                </p>
              )}

              <h3 className="line-clamp-2 font-serif text-[16px] leading-[1.35] tracking-[-0.01em] text-[#173A34] sm:text-[17px]">
                {product.name}
              </h3>
            </div>

            <span className="flex size-7 shrink-0 items-center justify-center border border-[#173A34]/20 text-[#173A34]/55 transition-all duration-300 group-hover:border-[#173A34] group-hover:bg-[#173A34] group-hover:text-[#F8F4EA]">
              <ArrowUpRight
                className="size-3.5"
                strokeWidth={1.5}
              />
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-[#173A34]/10 pt-3">
            <span className="text-[16px] font-semibold tracking-[-0.01em] text-[#173A34]">
              {formatPrice(product.price)}
            </span>

            {hasDiscount && originalPrice !== null && (
              <span className="text-xs text-[#173A34]/45 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {isSoldOut && (
            <p className="mt-3 border-t border-[#173A34]/10 pt-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#80503A]">
              Currently unavailable
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}