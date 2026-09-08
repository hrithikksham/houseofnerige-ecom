"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "discount",
    label: "Highest Discount",
  },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort =
    searchParams.get("sort") ?? "newest";

  function handleSortChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("sort", event.target.value);

    router.push(
      `${pathname}?${params.toString()}`,
      {
        scroll: false,
      }
    );
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="sort"
        className="hidden text-xs text-[#181F1C]/50 sm:block"
      >
        Sort by
      </label>

      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="h-11 min-w-[160px] appearance-none border border-[#20444E]/15 bg-white px-4 text-sm text-[#181F1C] outline-none transition-colors focus:border-[#355D68]"
      >
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}