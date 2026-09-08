"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { AddToCartButton } from "./add-to-cart-button";

type ProductPageClientProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    regularPrice: number;
    discountPercent: number;
    stockQuantity: number;
    images: {
      url: string;
      altText: string | null;
    }[];
  };
};

export function ProductPageClient({
  product,
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock =
    product.stockQuantity <= 0;

  function decreaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.max(currentQuantity - 1, 1)
    );
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(
        currentQuantity + 1,
        product.stockQuantity
      )
    );
  }

  return (
    <div className="mt-8">
      {/* Quantity */}
      {!isOutOfStock && (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#181F1C]/50">
            Quantity
          </p>

          <div className="mt-3 inline-flex items-center rounded-full border border-[#20444E]/15 bg-white">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="
                flex
                size-11
                items-center
                justify-center
                text-[#181F1C]/60
                transition-colors
                hover:text-[#20444E]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
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
              className="
                flex
                size-11
                items-center
                justify-center
                text-[#181F1C]/60
                transition-colors
                hover:text-[#20444E]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
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
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          product={product}
          quantity={quantity}
        />

        <button
          type="button"
          disabled={isOutOfStock}
          className="
            min-h-14
            rounded-full
            bg-[#20444E]
            px-6
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-[#355D68]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {isOutOfStock
            ? "Out of Stock"
            : "Buy Now"}
        </button>
      </div>
    </div>
  );
}