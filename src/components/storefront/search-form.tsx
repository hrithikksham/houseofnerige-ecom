"use client";

import { FormEvent, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(currentQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(normalizedQuery)}`);
  }

  function handleClear() {
    setQuery("");
    router.push("/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative"
      role="search"
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-primary/40"
        strokeWidth={1.6}
      />

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search sarees, colours, fabrics, occasions..."
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-primary/[0.10]
          bg-background
          pl-11
          pr-12
          text-sm
          text-primary
          outline-none
          transition-all
          placeholder:text-primary/35
          hover:border-primary/[0.16]
          focus:border-primary/25
          focus:bg-soft-white
          focus:ring-4
          focus:ring-primary/[0.04]
          sm:h-14
          sm:text-base
        "
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute
            right-3
            top-1/2
            flex
            size-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            text-primary/35
            transition-colors
            hover:bg-primary/[0.05]
            hover:text-primary
          "
        >
          <X
            className="size-4"
            strokeWidth={1.7}
          />
        </button>
      )}
    </form>
  );
}