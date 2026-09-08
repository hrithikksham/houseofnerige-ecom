import Link from "next/link";

const suggestions = [
  "Wedding sarees",
  "Soft silk for festive wear",
  "Lightweight office sarees",
  "Traditional Kanjivaram sarees",
  "Elegant sarees under ₹10,000",
  "Red sarees for bridal occasions",
];

export function SearchSuggestions() {
  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary/40">
        Explore
      </p>

      <h2 className="mt-2 text-lg font-medium tracking-[-0.02em] text-primary">
        Find what you are looking for
      </h2>

      <p className="mt-2 text-sm leading-6 text-primary/50">
        Describe the saree naturally. Search can understand colour,
        fabric, occasion, style, and price.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Link
            key={suggestion}
            href={`/search?q=${encodeURIComponent(suggestion)}`}
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-primary/[0.10]
              bg-background
              px-3.5
              py-2
              text-xs
              text-primary/65
              transition-all
              hover:border-primary/20
              hover:bg-primary/[0.04]
              hover:text-primary
            "
          >
            {suggestion}
          </Link>
        ))}
      </div>
    </section>
  );
}