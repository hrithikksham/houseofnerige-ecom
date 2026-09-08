import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CollectionCardData } from "@/lib/storefront/collections";

interface CollectionCardProps {
  collection: CollectionCardData;
  priority?: boolean;
}

export function CollectionCard({
  collection,
  priority = false,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block w-full overflow-hidden rounded-[20px] border border-primary/10 bg-primary/[0.03] transition-all duration-500 hover:border-primary/20 hover:shadow-[0_20px_60px_rgba(23,58,52,0.10)] sm:rounded-[28px]"
    >
      <div className="relative aspect-[2/1] w-full sm:aspect-[5/2] lg:aspect-[3/1]">
        {collection.image ? (
          <>
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              priority={priority}
              sizes="100vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />

            {/* Premium cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

            {/* Bottom depth */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-primary/[0.06]" />
        )}

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl px-6 sm:px-10 lg:px-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-soft-white/75 sm:text-[10px]">
              Nerige Collection
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-[0.95] tracking-[-0.03em] text-soft-white sm:text-5xl lg:text-6xl">
              {collection.name}
            </h2>

            {collection.description && (
              <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-6 text-soft-white/80 sm:text-base sm:leading-7">
                {collection.description}
              </p>
            )}

            <div className="mt-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-soft-white sm:mt-7">
              <span>Explore collection</span>

              <span className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Premium highlight */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.10]" />
      </div>
    </Link>
  );
}