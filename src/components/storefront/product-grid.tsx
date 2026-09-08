import type { ProductCardData } from "@/lib/storefront/products";

import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: ProductCardData[];
  emptyMessage?: string;
};

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-[#173A34]/10 bg-white/30 px-6 text-center sm:rounded-[32px]">
        <div className="max-w-sm">
          <p className="text-lg font-medium tracking-[-0.02em] text-[#173A34]">
            {emptyMessage}
          </p>

          <p className="mt-2 text-sm leading-6 text-[#173A34]/50">
            Try adjusting your filters or browse our complete
            collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-12">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 2}
        />
      ))}
    </div>
  );
}