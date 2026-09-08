"use client";

import {
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useState } from "react";

type FilterCategory = {
  id: string;
  name: string;
  slug: string;
};

type ProductFiltersProps = {
  categories: FilterCategory[];
  colours: string[];
  fabrics: string[];
  occasions: string[];
  workWeaves: string[];
  mobile?: boolean;
};

type FilterSectionProps = {
  title: string;
  param: string;
  options: Array<{
    label: string;
    value: string;
  }>;
};

const priceRanges = [
  {
    label: "Under ₹5,000",
    value: "0-5000",
  },
  {
    label: "₹5,000 – ₹10,000",
    value: "5000-10000",
  },
  {
    label: "₹10,000 – ₹20,000",
    value: "10000-20000",
  },
  {
    label: "Above ₹20,000",
    value: "20000-plus",
  },
];

export function ProductFilters({
  categories,
  colours,
  fabrics,
  occasions,
  workWeaves,
  mobile = false,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  function getSelectedValues(param: string) {
    return searchParams
      .getAll(param)
      .filter(Boolean);
  }

  function updateFilter(
    param: string,
    value: string,
    checked: boolean
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    const values = getSelectedValues(param);

    params.delete(param);

    const nextValues = checked
      ? [...values, value]
      : values.filter(
          (item) => item !== value
        );

    nextValues.forEach((item) => {
      params.append(param, item);
    });

    router.push(
      `${pathname}${
        params.toString()
          ? `?${params.toString()}`
          : ""
      }`,
      {
        scroll: false,
      }
    );
  }

  function resetFilters() {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    [
      "category",
      "price",
      "colour",
      "fabric",
      "occasion",
      "workWeave",
    ].forEach((key) => {
      params.delete(key);
    });

    router.push(
      `${pathname}${
        params.toString()
          ? `?${params.toString()}`
          : ""
      }`,
      {
        scroll: false,
      }
    );
  }

  const filterSections: FilterSectionProps[] = [
    {
      title: "Categories",
      param: "category",
      options: categories.map((category) => ({
        label: category.name,
        value: category.slug,
      })),
    },
    {
      title: "Price",
      param: "price",
      options: priceRanges,
    },
    {
      title: "Colour",
      param: "colour",
      options: colours.map((colour) => ({
        label: colour,
        value: colour,
      })),
    },
    {
      title: "Fabric",
      param: "fabric",
      options: fabrics.map((fabric) => ({
        label: fabric,
        value: fabric,
      })),
    },
    {
      title: "Occasion",
      param: "occasion",
      options: occasions.map((occasion) => ({
        label: occasion,
        value: occasion,
      })),
    },
    {
      title: "Work / Weave",
      param: "workWeave",
      options: workWeaves.map(
        (workWeave) => ({
          label: workWeave,
          value: workWeave,
        })
      ),
    },
  ];

  const hasActiveFilters = [
    "category",
    "price",
    "colour",
    "fabric",
    "occasion",
    "workWeave",
  ].some(
    (param) =>
      getSelectedValues(param).length > 0
  );

  function FilterSection({
    title,
    param,
    options,
  }: FilterSectionProps) {
    if (options.length === 0) {
      return null;
    }

    const selectedValues =
      getSelectedValues(param);

    return (
      <section className="border-b border-[#20444E]/10 py-6">
        <h3 className="text-sm font-medium text-[#181F1C]">
          {title}
        </h3>

        <div className="mt-4 space-y-3">
          {options.map((option) => {
            const isChecked =
              selectedValues.includes(
                option.value
              );

            return (
              <label
                key={option.value}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(event) =>
                    updateFilter(
                      param,
                      option.value,
                      event.target.checked
                    )
                  }
                  className="size-4 cursor-pointer rounded border-[#20444E]/20 accent-[#355D68]"
                />

                <span className="text-sm text-[#181F1C]/60 transition-colors group-hover:text-[#181F1C]">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </section>
    );
  }

  const filterContent = (
    <>
      {filterSections.map((section) => (
        <FilterSection
          key={section.param}
          {...section}
        />
      ))}
    </>
  );

  if (mobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-11 items-center gap-2 border border-[#20444E]/15 bg-white px-4 text-sm font-medium text-[#181F1C] lg:hidden"
        >
          <SlidersHorizontal
            className="size-4"
            strokeWidth={1.5}
          />

          Filters

          {hasActiveFilters && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-[#355D68] text-[10px] text-white">
              {[
                "category",
                "price",
                "colour",
                "fabric",
                "occasion",
                "workWeave",
              ].reduce(
                (total, param) =>
                  total +
                  getSelectedValues(param)
                    .length,
                0
              )}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            />

            <aside className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto bg-[#F5F0E6]">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#20444E]/10 bg-[#F5F0E6] px-5 py-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#355D68]/60">
                    Shop
                  </p>

                  <h2 className="mt-1 text-lg font-medium text-[#181F1C]">
                    Filters
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="flex size-10 items-center justify-center text-[#181F1C]/60"
                  aria-label="Close filters"
                >
                  <X
                    className="size-5"
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <div className="px-5">
                {filterContent}
              </div>

              <div className="sticky bottom-0 flex gap-3 border-t border-[#20444E]/10 bg-[#F5F0E6] px-5 py-5">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-12 flex-1 border border-[#20444E]/15 bg-white text-sm font-medium text-[#181F1C]"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="h-12 flex-1 bg-[#355D68] text-sm font-medium text-white"
                >
                  View products
                </button>
              </div>
            </aside>
          </div>
        )}
      </>
    );
  }

  return (
    <aside className="hidden w-[240px] shrink-0 lg:block">
      <div className="sticky top-8">
        <div className="flex items-center justify-between border-b border-[#20444E]/10 pb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              className="size-4 text-[#355D68]"
              strokeWidth={1.5}
            />

            <h2 className="text-sm font-medium text-[#181F1C]">
              Filters
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-[#355D68] transition-opacity hover:opacity-60"
            >
              Reset
            </button>
          )}
        </div>

        {filterContent}
      </div>
    </aside>
  );
}