import { SearchForm } from "@/components/storefront/search-form";
import { SearchSuggestions } from "@/components/storefront/search-suggestions";
import { ProductFilters } from "@/components/storefront/product-filters";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SortSelect } from "@/components/storefront/sort-select";

import {
  getStorefrontProducts,
  type ProductSort,
} from "@/lib/storefront/products";

import { getStorefrontFilterOptions } from "@/lib/storefront/filter-options";

type SearchParamValue = string | string[] | undefined;

type SearchPageProps = {
  searchParams: Promise<{
    q?: SearchParamValue;
    sort?: SearchParamValue;
    category?: SearchParamValue;
    colour?: SearchParamValue;
    fabric?: SearchParamValue;
    occasion?: SearchParamValue;
    workWeave?: SearchParamValue;
    price?: SearchParamValue;
  }>;
};

const VALID_SORTS = [
  "newest",
  "price-low",
  "price-high",
  "discount",
] as const satisfies readonly ProductSort[];

function getFirstValue(
  value: SearchParamValue
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getArrayValue(
  value: SearchParamValue
) {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value)
    ? value
    : [value];

  return [
    ...new Set(
      values
        .flatMap((item) => item.split(","))
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query =
    getFirstValue(params.q)?.trim() ?? "";

  const requestedSort =
    getFirstValue(params.sort);

  const sort: ProductSort = VALID_SORTS.includes(
    requestedSort as ProductSort
  )
    ? (requestedSort as ProductSort)
    : "newest";

  const categories = getArrayValue(
    params.category
  );

  const colours = getArrayValue(
    params.colour
  );

  const fabrics = getArrayValue(
    params.fabric
  );

  const occasions = getArrayValue(
    params.occasion
  );

  const workWeaves = getArrayValue(
    params.workWeave
  );

  const priceRanges = getArrayValue(
    params.price
  );

  const [products, filterOptions] =
    await Promise.all([
      query
        ? getStorefrontProducts({
            query,
            sort,
            category: categories,
            colour: colours,
            fabric: fabrics,
            occasion: occasions,
            workWeave: workWeaves,
            price: priceRanges,
          })
        : Promise.resolve([]),

      getStorefrontFilterOptions(),
    ]);

  const productCount = products.length;

  return (
    <main className="min-h-screen bg-[#F7F1E5]">
      {/* Search header */}
      <section className="border-b border-[#173A34]/10">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A27735]">
              House of Nerige
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.03em] text-[#173A34] sm:text-5xl lg:text-6xl">
              Find your saree.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#173A34]/60 sm:text-base sm:leading-8">
              Search naturally by colour, fabric,
              occasion, weave, style, or the kind of
              saree you are looking for.
            </p>

            <div className="mt-8">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {!query ? (
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <div className="max-w-3xl">
            <SearchSuggestions />
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          {/* Search result toolbar */}
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#173A34]/10 pb-5 sm:pb-6">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              {/* Mobile filters */}
              <div className="lg:hidden">
                <ProductFilters
                  categories={filterOptions.categories}
                  colours={filterOptions.colours}
                  fabrics={filterOptions.fabrics}
                  occasions={filterOptions.occasions}
                  workWeaves={filterOptions.workWeaves}
                  mobile
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-[#173A34]/55">
                  <span className="font-medium text-[#173A34]">
                    {productCount}
                  </span>{" "}
                  {productCount === 1
                    ? "result"
                    : "results"}
                </p>

                <p className="mt-1 truncate text-xs text-[#173A34]/40">
                  Results for{" "}
                  <span className="font-medium text-[#173A34]/65">
                    “{query}”
                  </span>
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <SortSelect />
            </div>
          </div>

          <div className="flex items-start gap-8 xl:gap-12">
            {/* Desktop filters */}
            <div className="hidden lg:block">
              <ProductFilters
                categories={filterOptions.categories}
                colours={filterOptions.colours}
                fabrics={filterOptions.fabrics}
                occasions={filterOptions.occasions}
                workWeaves={filterOptions.workWeaves}
              />
            </div>

            {/* Search results */}
            <div className="min-w-0 flex-1">
              {productCount > 0 ? (
                <ProductGrid
                  products={products}
                  emptyMessage="No sarees found."
                />
              ) : (
                <SearchEmptyState query={query} />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function SearchEmptyState({
  query,
}: {
  query: string;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-[24px] border border-dashed border-[#173A34]/15 bg-white/20 px-6 text-center sm:rounded-[32px]">
      <div className="max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A27735]">
          No matches
        </p>

        <h2 className="mt-4 font-serif text-3xl tracking-[-0.02em] text-[#173A34]">
          We couldn&apos;t find a match.
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#173A34]/55">
          No sarees matched “{query}”. Try searching
          for a colour, fabric, occasion, weave, or
          browse our complete collection.
        </p>
      </div>
    </div>
  );
}