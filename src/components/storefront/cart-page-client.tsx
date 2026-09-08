"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import type { CartItem } from "@/lib/storefront/cart";
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/lib/storefront/cart";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function CartPageClient() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      setCart(getCart());
    };

    const frame = window.requestAnimationFrame(loadCart);

    window.addEventListener(
      "nerige-cart-updated",
      loadCart
    );

    return () => {
      window.cancelAnimationFrame(frame);

      window.removeEventListener(
        "nerige-cart-updated",
        loadCart
      );
    };
  }, []);

  function handleQuantityChange(
    productId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(
        productId,
        quantity
      );
    }

    setCart(getCart());
  }

  function handleRemove(productId: string) {
    removeFromCart(productId);
    setCart(getCart());
  }

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5 py-16 sm:px-8 lg:px-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/[0.05]">
            <ShoppingBag
              className="size-7 text-primary/60"
              strokeWidth={1.3}
            />
          </div>

          <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">
            Your Shopping Bag
          </p>

          <h1 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
            Your bag is empty
          </h1>

          <p className="mt-5 text-sm leading-7 text-primary/55">
            Discover our collection of timeless
            sarees and find something special.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-7 text-sm font-medium text-soft-white transition-opacity hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      {/* Back */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-primary/55 transition-colors hover:text-primary"
      >
        <ArrowLeft
          className="size-4"
          strokeWidth={1.5}
        />

        Continue shopping
      </Link>

      {/* Header */}
      <div className="mt-10 border-b border-primary/10 pb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">
          Shopping Bag
        </p>

        <div className="mt-3 flex items-end justify-between gap-5">
          <h1 className="font-serif text-4xl text-primary sm:text-5xl">
            Your selections
          </h1>

          <p className="pb-1 text-sm text-primary/50">
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Cart items */}
        <section className="divide-y divide-primary/10">
          {cart.map((item) => (
            <article
              key={item.productId}
              className="flex gap-5 py-6 first:pt-0 sm:gap-7"
            >
              {/* Image */}
              <Link
                href={`/products/${item.slug}`}
                className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden bg-primary/[0.04] sm:w-36"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag
                      className="size-6 text-primary/20"
                      strokeWidth={1.2}
                    />
                  </div>
                )}
              </Link>

              {/* Details */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-base font-medium text-primary transition-colors hover:text-terracotta sm:text-lg"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 text-sm text-primary/50">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(item.productId)
                    }
                    aria-label={`Remove ${item.name}`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary/40 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-4 pt-7">
                  {/* Quantity */}
                  <div className="flex items-center rounded-full border border-primary/15">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                      aria-label="Decrease quantity"
                      className="flex size-9 items-center justify-center text-primary/60 transition-colors hover:text-primary"
                    >
                      <Minus
                        className="size-3.5"
                        strokeWidth={1.5}
                      />
                    </button>

                    <span className="flex min-w-9 items-center justify-center text-sm font-medium text-primary">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                      aria-label="Increase quantity"
                      className="flex size-9 items-center justify-center text-primary/60 transition-colors hover:text-primary"
                    >
                      <Plus
                        className="size-3.5"
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>

                  <p className="text-sm font-medium text-primary sm:text-base">
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-primary/10 bg-background p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-primary">
            Order summary
          </h2>

          <div className="mt-8 space-y-4 border-b border-primary/10 pb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary/55">
                Subtotal
              </span>

              <span className="font-medium text-primary">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-primary/55">
                Shipping
              </span>

              <span className="text-primary/55">
                Calculated at checkout
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-6">
            <span className="text-base font-medium text-primary">
              Total
            </span>

            <span className="text-xl font-semibold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="flex min-h-14 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-soft-white transition-opacity hover:opacity-90"
          >
            Proceed to Checkout
          </Link>

          <p className="mt-5 text-center text-xs leading-5 text-primary/40">
            Taxes and shipping are calculated
            during checkout.
          </p>
        </aside>
      </div>
    </main>
  );
}