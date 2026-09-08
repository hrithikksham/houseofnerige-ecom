"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

import type { CartItem } from "@/lib/storefront/cart";
import { getCart } from "@/lib/storefront/cart";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function CheckoutPageClient() {
  const [cart] = useState<CartItem[]>(() => getCart());

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/[0.05]">
            <ShoppingBag
              className="size-7 text-primary/50"
              strokeWidth={1.3}
            />
          </div>

          <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">
            Checkout
          </p>

          <h1 className="mt-3 font-serif text-4xl text-primary">
            Nothing to checkout
          </h1>

          <p className="mt-4 text-sm leading-7 text-primary/55">
            Your shopping bag is currently empty.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-soft-white transition-opacity hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      {/* Back */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-primary/55 transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Back to bag
      </Link>

      {/* Header */}
      <div className="mt-9 border-b border-primary/10 pb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">
          Secure Checkout
        </p>

        <h1 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
          Complete your order
        </h1>

        <p className="mt-4 text-sm leading-7 text-primary/55">
          Enter your details to continue with payment.
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Checkout form */}
        <form
          className="space-y-12"
          onSubmit={(event) => {
            event.preventDefault();

            // Payment and order creation
            // will be connected next.
          }}
        >
          {/* Contact */}
          <section>
            <div className="flex items-center gap-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-soft-white">
                1
              </span>

              <div>
                <h2 className="text-lg font-medium text-primary">
                  Contact information
                </h2>

                <p className="mt-1 text-sm text-primary/50">
                  For order confirmation and updates.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <CheckoutInput
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                required
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <CheckoutInput
                  label="First name"
                  name="firstName"
                  autoComplete="given-name"
                  required
                />

                <CheckoutInput
                  label="Last name"
                  name="lastName"
                  autoComplete="family-name"
                  required
                />
              </div>

              <CheckoutInput
                label="Phone number"
                type="tel"
                name="phone"
                autoComplete="tel"
                required
              />
            </div>
          </section>

          {/* Shipping */}
          <section className="border-t border-primary/10 pt-10">
            <div className="flex items-center gap-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-soft-white">
                2
              </span>

              <div>
                <h2 className="text-lg font-medium text-primary">
                  Delivery address
                </h2>

                <p className="mt-1 text-sm text-primary/50">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <CheckoutInput
                label="Address"
                name="addressLine1"
                autoComplete="address-line1"
                required
              />

              <CheckoutInput
                label="Apartment, suite, etc. (optional)"
                name="addressLine2"
                autoComplete="address-line2"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <CheckoutInput
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  required
                />

                <CheckoutInput
                  label="State"
                  name="state"
                  autoComplete="address-level1"
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <CheckoutInput
                  label="PIN code"
                  name="postalCode"
                  autoComplete="postal-code"
                  required
                />

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-xs font-medium text-primary/65"
                  >
                    Country
                  </label>

                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      defaultValue="India"
                      className="h-12 w-full appearance-none rounded-xl border border-primary/15 bg-background px-4 pr-10 text-sm text-primary outline-none transition-colors focus:border-primary/40"
                    >
                      <option>India</option>
                    </select>

                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary/45"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Continue */}
          <section className="border-t border-primary/10 pt-10">
            <button
              type="submit"
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-medium text-soft-white transition-opacity hover:opacity-90"
            >
              Continue to Payment
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-primary/45">
              <LockKeyhole
                className="size-3.5"
                strokeWidth={1.5}
              />

              Your information is securely protected.
            </div>
          </section>
        </form>

        {/* Order summary */}
        <aside className="h-fit lg:sticky lg:top-8">
          <div className="overflow-hidden rounded-3xl border border-primary/10 bg-background">
            <div className="border-b border-primary/10 px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-primary">
                  Order summary
                </h2>

                <span className="text-sm text-primary/45">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            <div className="divide-y divide-primary/10 px-6">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 py-5"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-primary/[0.04]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}

                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[9px] text-soft-white">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-primary/45">
                      Qty {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/10 px-6 py-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary/55">
                    Subtotal
                  </span>

                  <span className="text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-primary/55">
                    Shipping
                  </span>

                  <span className="text-primary/45">
                    Calculated next
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-primary/10 pt-5">
                  <span className="text-base font-medium text-primary">
                    Total
                  </span>

                  <span className="text-xl font-semibold text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary/[0.04] px-4 py-3">
                <Check
                  className="size-4 shrink-0 text-primary/65"
                  strokeWidth={1.8}
                />

                <p className="text-xs leading-5 text-primary/55">
                  Your payment method will be selected
                  in the next step.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

type CheckoutInputProps = {
  label: string;
  type?: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
};

function CheckoutInput({
  label,
  type = "text",
  name,
  autoComplete,
  required = false,
}: CheckoutInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-medium text-primary/65"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className="h-12 w-full rounded-xl border border-primary/15 bg-background px-4 text-sm text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary/40"
      />
    </div>
  );
}