import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HeroSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
};

export function HeroSection({
  eyebrow = "Nerige Sarees",
  title,
  description,
  image,
  imageAlt = "",
  primaryAction,
  secondaryAction,
}: HeroSectionProps) {
  return (
    <section className="overflow-hidden bg-[#f5f0e8]">
      <div className="mx-auto grid min-h-[560px] max-w-7xl lg:grid-cols-2">
        {/* Content */}
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="max-w-xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#80503a]/65">
              {eyebrow}
            </p>

            <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-[#243c32] sm:text-6xl lg:text-7xl">
              {title}
            </h1>

            {description && (
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#243c32]/60 sm:text-base">
                {description}
              </p>
            )}

            {(primaryAction || secondaryAction) && (
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {primaryAction && (
                  <Link
                    href={primaryAction.href}
                    className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#243c32] px-6 text-sm font-medium text-[#faf8f3] transition-opacity hover:opacity-90"
                  >
                    {primaryAction.label}

                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                )}

                {secondaryAction && (
                  <Link
                    href={secondaryAction.href}
                    className="inline-flex h-12 items-center rounded-full border border-[#243c32]/15 px-6 text-sm font-medium text-[#243c32] transition-colors hover:bg-[#243c32]/5"
                  >
                    {secondaryAction.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[420px] lg:min-h-full">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#d8c6ad]" />
          )}
        </div>
      </div>
    </section>
  );
}