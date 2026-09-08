"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  LoaderCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { IconButton } from "@/components/ui";

const suggestions = [
  "Wedding sarees under ₹10,000",
  "Soft silk for festive wear",
  "Lightweight office sarees",
  "Traditional Kanjivaram sarees",
  "Red sarees for bridal occasions",
];

export function AiSearchDialog() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  function openSearch() {
    setIsOpen(true);
  }

  function closeSearch() {
    setIsOpen(false);
  }

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery || isLoading) {
      return;
    }

    setIsLoading(true);

    router.push(
      `/search?q=${encodeURIComponent(
        normalizedQuery
      )}`
    );

    setIsOpen(false);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }

  function handleSuggestion(suggestion: string) {
    setQuery(suggestion);

    router.push(
      `/search?q=${encodeURIComponent(
        suggestion
      )}`
    );

    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        label="Search products"
        variant="ghost"
        size="sm"
        onClick={openSearch}
        className="transition-all duration-300 hover:bg-primary/5 hover:text-terracotta"
      >
        <Search
          className="size-[18px]"
          strokeWidth={1.5}
        />
      </IconButton>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:px-6 sm:py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Search Nerige Sarees"
        >
          {/* Backdrop */}
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="absolute inset-0 bg-[#173A34]/35 backdrop-blur-md"
          />

          {/* Search panel */}
          <div className="relative z-10 w-full max-w-4xl overflow-hidden border border-primary/10 bg-[#F7F1E5] shadow-[0_30px_100px_rgba(23,58,52,0.2)]">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-[#B18743] via-[#D8C49B] to-[#B18743]" />

            <div className="p-5 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="size-4 text-[#A27735]"
                      strokeWidth={1.5}
                    />

                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A27735]">
                      AI Product Search
                    </p>
                  </div>

                  <h2 className="mt-3 font-serif text-3xl text-[#173A34] sm:text-4xl">
                    Find your perfect saree.
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#173A34]/55">
                    Describe what you are looking for
                    naturally. Search understands colour,
                    fabric, occasion, weave, style and
                    budget.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="flex size-10 shrink-0 items-center justify-center border border-primary/10 text-primary/55 transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <X
                    className="size-5"
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="relative mt-8"
              >
                <Search
                  className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#173A34]/35"
                  strokeWidth={1.5}
                />

                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Try “red wedding saree under ₹10,000”"
                  className="h-16 w-full border border-primary/15 bg-white pl-14 pr-32 text-sm text-[#173A34] outline-none transition-all placeholder:text-[#173A34]/35 focus:border-[#A27735]/60 focus:ring-4 focus:ring-[#A27735]/5 sm:text-base"
                />

                <button
                  type="submit"
                  disabled={
                    !query.trim() || isLoading
                  }
                  className="absolute bottom-2 right-2 top-2 inline-flex items-center gap-2 bg-[#062F28] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F7F1E5] transition-colors hover:bg-[#17473E] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoading ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <>
                      Search

                      <ArrowRight
                        className="size-4"
                        strokeWidth={1.5}
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Suggestions */}
              <div className="mt-8 border-t border-primary/10 pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#173A34]/45">
                  Try searching for
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        handleSuggestion(suggestion)
                      }
                      className="border border-primary/10 bg-white px-4 py-2.5 text-xs text-[#173A34]/65 transition-all hover:border-[#A27735]/40 hover:bg-[#A27735]/5 hover:text-[#173A34]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capability */}
              <div className="mt-8 flex items-center gap-3 border-t border-primary/10 pt-6">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#173A34]/5">
                  <Sparkles
                    className="size-4 text-[#A27735]"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="text-xs leading-5 text-[#173A34]/45">
                  AI search helps interpret what you mean.
                  Product results always come directly from
                  the Nerige catalogue.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}