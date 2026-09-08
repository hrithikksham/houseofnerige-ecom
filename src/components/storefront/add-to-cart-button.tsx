"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";

import { addToCart } from "@/lib/storefront/cart";

type AddToCartButtonProps = {
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
  quantity: number;
};

export function AddToCartButton({
  product,
  quantity,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock =
    product.stockQuantity <= 0;

  async function handleAddToCart() {
    if (isAdding || isOutOfStock) {
      return;
    }

    setIsAdding(true);

    try {
      const finalPrice =
        product.regularPrice *
        (1 - product.discountPercent / 100);

      addToCart(
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: finalPrice,
          quantity,
          image: product.images[0]?.url ?? null,
        },
        product.stockQuantity
      );

      setIsAdded(true);

      window.setTimeout(() => {
        setIsAdded(false);
      }, 1800);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <button
      type="button"
      disabled={isAdding || isOutOfStock}
      onClick={handleAddToCart}
      className="
        flex min-h-14 w-full items-center justify-center gap-3
        rounded-full border border-[#20444E]
        px-6 text-sm font-medium text-[#20444E]
        transition-all hover:bg-[#20444E] hover:text-white
        disabled:cursor-not-allowed disabled:opacity-40
      "
    >
      {isAdded ? (
        <>
          <Check
            className="size-4"
            strokeWidth={1.7}
          />
          Added to Bag
        </>
      ) : (
        <>
          <ShoppingBag
            className="size-4"
            strokeWidth={1.5}
          />

          {isAdding
            ? "Adding..."
            : isOutOfStock
              ? "Out of Stock"
              : "Add to Bag"}
        </>
      )}
    </button>
  );
}