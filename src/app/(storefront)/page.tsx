import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import { CampaignBanner } from "@/components/layout/campaign-banner";
import { WovenDivider } from "@/components/layout/woven-divider";

import { ProductGrid } from "@/components/storefront/product-grid";

import {
  getStorefrontProducts,
  type ProductSort,
} from "@/lib/storefront/products";

const FEATURED_SORT: ProductSort = "newest";

const categoryCards = [
  {
    title: "Silk Sarees",
    description: "Timeless elegance",
    href: "/shop?category=silk-sarees",
    image: "/images/categories/silk-sarees.webp",
  },
  {
    title: "Wedding Sarees",
    description: "Made for celebrations",
    href: "/shop?occasion=wedding",
    image: "/images/categories/wedding-sarees.webp",
  },
  {
    title: "Festive Sarees",
    description: "For every celebration",
    href: "/shop?occasion=festive",
    image: "/images/categories/festive-sarees.webp",
  },
  {
    title: "Handloom",
    description: "Crafted with heritage",
    href: "/shop?category=handloom",
    image: "/images/categories/handloom.webp",
  },
  {
    title: "New Arrivals",
    description: "Recently added",
    href: "/shop?sort=newest",
    image: "/images/categories/new-arrivals.webp",
  },
];

export default async function StorefrontHomePage() {
  const products = await getStorefrontProducts({
    sort: FEATURED_SORT,
  });

  const displayedProducts = products.slice(0, 15);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-primary">
      {/* ============================================================
          CAMPAIGN
      ============================================================ */}
      <section className="relative">
        <CampaignBanner
          image="/images/campaigns/campaign1.webp"
          alt="Nerige Sarees campaign"
          href="/shop"
          priority
        />
      </section>

      <WovenDivider />

      {/* ============================================================
          BROWSE BY COLLECTION
      ============================================================ */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-terracotta">
              Discover Nerige
            </p>

            <h1 className="mt-4 font-serif text-4xl tracking-[-0.025em] text-primary sm:text-5xl lg:text-6xl">
              Sarees for every story.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-primary/55 sm:text-base">
              Explore sarees selected for celebrations,
              traditions, everyday elegance and the moments
              worth remembering.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit shrink-0 items-center gap-3 text-sm font-medium text-primary transition-colors hover:text-terracotta"
          >
            Shop all sarees

            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        {/* ============================================================
            HORIZONTAL CATEGORY SCROLLER
        ============================================================ */}
        <div className="mt-10 -mr-4 overflow-x-auto pb-3 pr-4 sm:-mr-6 sm:pr-6 lg:-mr-10 lg:pr-10">
          <div className="flex w-max gap-4 sm:gap-5">
            {categoryCards.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group relative block w-[240px] shrink-0 overflow-hidden rounded-[20px] bg-primary/5 sm:w-[280px]"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 240px, 280px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/10 to-transparent" />

                  {/* Card content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">
                      {category.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-4">
                      <h2 className="font-serif text-2xl text-white sm:text-[26px]">
                        {category.title}
                      </h2>

                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-primary">
                        <ChevronRight
                          className="size-4"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SAREE LISTING
      ============================================================ */}
      <section className="border-t border-primary/10">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          {/* Listing heading */}
          <div className="flex items-end justify-between gap-4 border-b border-primary/10 pb-6 sm:pb-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-terracotta">
                Latest from Nerige
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-[-0.025em] text-primary sm:text-5xl">
                New arrivals.
              </h2>
            </div>

            <p className="hidden text-sm text-primary/45 sm:block">
              {displayedProducts.length}{" "}
              {displayedProducts.length === 1
                ? "saree"
                : "sarees"}
            </p>
          </div>

          {/* Product grid */}
          <div className="mt-8 sm:mt-10">
            {displayedProducts.length > 0 ? (
              <ProductGrid products={displayedProducts} />
            ) : (
              <div className="border border-primary/10 px-6 py-20 text-center">
                <p className="font-serif text-2xl text-primary">
                  New sarees are arriving soon.
                </p>

                <p className="mt-3 text-sm text-primary/50">
                  Our next collection is being prepared.
                </p>
              </div>
            )}
          </div>

          {/* ============================================================
              LOAD MORE
              Replace this Link with client-side pagination later.
          ============================================================ */}
          {products.length > 15 && (
            <div className="mt-12 flex justify-center">
              <Link
                href="/shop?sort=newest"
                className="
                  group inline-flex min-h-12 items-center gap-4
                  bg-primary px-7
                  text-[10px] font-semibold uppercase
                  tracking-[0.16em] text-white
                  transition-all duration-300
                  hover:-translate-y-px
                  hover:bg-primary/90
                  hover:shadow-[0_14px_36px_rgba(23,58,52,0.18)]
                "
              >
                Explore all sarees

                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          BOTTOM SIGNATURE DIVIDER
      ============================================================ */}
      <WovenDivider />
    </main>
  );
}