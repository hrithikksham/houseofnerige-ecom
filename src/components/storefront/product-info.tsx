"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";

type ProductInfoProps = {
  product: {
    id: string;
    name: string;
    sku: string;
    shortDescription: string | null;
    regularPrice: number;
    discountPercent: number;
    stockQuantity: number;
    isNewArrival: boolean;
    category: {
      name: string;
      slug: string;
    } | null;
  };
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductInfo({
  product,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const finalPrice =
    product.regularPrice *
    (1 - product.discountPercent / 100);

  const hasDiscount = product.discountPercent > 0;

  const isOutOfStock =
    product.stockQuantity <= 0;

  const increaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.min(
        currentQuantity + 1,
        product.stockQuantity
      )
    );
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(currentQuantity - 1, 1)
    );
  };

  return (
    <section className="lg:sticky lg:top-8">
      {/* Category */}
      {product.category && (
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#355D68]">
          {product.category.name}
        </p>
      )}

      {/* Name */}
      <h1 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-[#181F1C] sm:text-4xl">
        {product.name}
      </h1>

      {/* SKU */}
      <p className="mt-3 text-xs text-[#181F1C]/45">
        Product code: {product.sku}
      </p>

      {/* Badges */}
      <div className="mt-5 flex flex-wrap gap-2">
        {product.isNewArrival && (
          <span className="rounded-full bg-[#D8E8EA] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#20444E]">
            New Arrival
          </span>
        )}

        {isOutOfStock && (
          <span className="rounded-full bg-[#181F1C] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
            Out of Stock
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-8 border-y border-[#20444E]/10 py-6">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <p className="text-2xl font-medium tracking-[-0.02em] text-[#181F1C]">
            {formatPrice(finalPrice)}
          </p>

          {hasDiscount && (
            <>
              <p className="pb-0.5 text-sm text-[#181F1C]/40 line-through">
                {formatPrice(product.regularPrice)}
              </p>

              <span className="mb-0.5 text-xs font-medium text-[#355D68]">
                {product.discountPercent}% off
              </span>
            </>
          )}
        </div>

        {!isOutOfStock && (
          <p className="mt-3 text-xs text-[#355D68]">
            In stock · Ready to order
          </p>
        )}
      </div>

      {/* Description */}
      {product.shortDescription && (
        <div className="mt-7">
          <p className="text-base leading-7 text-[#181F1C]/65">
            {product.shortDescription}
          </p>
        </div>
      )}

      {/* Quantity */}
      {!isOutOfStock && (
        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#181F1C]/50">
            Quantity
          </p>

          <div className="mt-3 inline-flex items-center rounded-full border border-[#20444E]/15 bg-white">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="flex size-11 items-center justify-center text-[#181F1C]/60 transition-colors hover:text-[#20444E] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus
                className="size-4"
                strokeWidth={1.5}
              />
            </button>

            <span className="flex w-10 justify-center text-sm font-medium text-[#181F1C]">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={
                quantity >= product.stockQuantity
              }
              aria-label="Increase quantity"
              className="flex size-11 items-center justify-center text-[#181F1C]/60 transition-colors hover:text-[#20444E] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus
                className="size-4"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={isOutOfStock}
          className="flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#20444E] px-6 text-sm font-medium text-[#20444E] transition-colors hover:bg-[#20444E] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingBag
            className="size-4"
            strokeWidth={1.5}
          />

          {isOutOfStock
            ? "Out of Stock"
            : "Add to Bag"}
        </button>

        <button
          type="button"
          disabled={isOutOfStock}
          className="min-h-14 rounded-full bg-[#20444E] px-6 text-sm font-medium text-white transition-colors hover:bg-[#355D68] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>

      {/* Helper text */}
      {!isOutOfStock && (
        <p className="mt-4 text-center text-xs leading-5 text-[#181F1C]/45">
          Your cart will be confirmed before payment.
        </p>
      )}
    </section>
  );
}