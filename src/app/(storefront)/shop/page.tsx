import { ProductFilters } from "@/components/storefront/product-filters";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SortSelect } from "@/components/storefront/sort-select";

import { getStorefrontFilterOptions } from "@/lib/storefront/filter-options";

import {
  getStorefrontProducts,
  type ProductSort,
} from "@/lib/storefront/products";

type SearchParamValue = string | string[] | undefined;

type ShopPageProps = {
  searchParams: Promise<{
    sort?: SearchParamValue;
    category?: SearchParamValue;
    price?: SearchParamValue;
    colour?: SearchParamValue;
    fabric?: SearchParamValue;
    occasion?: SearchParamValue;
    workWeave?: SearchParamValue;
  }>;
};

const VALID_SORTS: readonly ProductSort[] = [
  "newest",
  "price-low",
  "price-high",
  "discount",
];

function toArray(
  value: SearchParamValue
): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return [value];
}

function getFirstValue(
  value: SearchParamValue
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const sortValue = getFirstValue(
    params.sort
  );

  const sort: ProductSort =
    VALID_SORTS.includes(
      sortValue as ProductSort
    )
      ? (sortValue as ProductSort)
      : "newest";

  const [
    products,
    filterOptions,
  ] = await Promise.all([
    getStorefrontProducts({
      sort,
      category: toArray(params.category),
      price: toArray(params.price),
      colour: toArray(params.colour),
      fabric: toArray(params.fabric),
      occasion: toArray(params.occasion),
      workWeave: toArray(params.workWeave),
    }),

    getStorefrontFilterOptions(),
  ]);

  const productCount = products.length;

  return (
    <main className="min-h-screen bg-[#F7F1E5] text-[#173A34]">
      {/* Page heading */}
      <section className="border-b border-[#173A34]/10">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A27735]">
              House of Nerige
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.03em] text-[#173A34] sm:text-5xl lg:text-6xl">
              Shop Sarees
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#173A34]/60 sm:text-base sm:leading-8">
              Discover thoughtfully selected sarees rooted
              in tradition and made for the stories you
              create today.
            </p>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        {/* Results toolbar */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#173A34]/10 pb-5 sm:pb-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            {/* Mobile filter trigger */}
            <div className="lg:hidden">
              <ProductFilters
                mobile
                categories={
                  filterOptions.categories
                }
                colours={
                  filterOptions.colours
                }
                fabrics={
                  filterOptions.fabrics
                }
                occasions={
                  filterOptions.occasions
                }
                workWeaves={
                  filterOptions.workWeaves
                }
              />
            </div>

            <p
              className="whitespace-nowrap text-sm text-[#173A34]/55"
              aria-live="polite"
            >
              <span className="font-medium text-[#173A34]">
                {productCount}
              </span>{" "}
              {productCount === 1
                ? "product"
                : "products"}
            </p>
          </div>

          <div className="shrink-0">
            <SortSelect />
          </div>
        </div>

        <div className="flex items-start gap-8 xl:gap-12">
          {/* Desktop filters */}
          <ProductFilters
            categories={
              filterOptions.categories
            }
            colours={
              filterOptions.colours
            }
            fabrics={
              filterOptions.fabrics
            }
            occasions={
              filterOptions.occasions
            }
            workWeaves={
              filterOptions.workWeaves
            }
          />

          {/* Products */}
          <div className="min-w-0 flex-1">
            {productCount > 0 ? (
              <ProductGrid
                products={products}
              />
            ) : (
              <div className="border border-[#173A34]/10 bg-white/30 px-6 py-20 text-center">
                <p className="font-serif text-2xl text-[#173A34]">
                  No sarees found
                </p>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#173A34]/55">
                  Try changing your filters or explore our
                  complete collection.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}