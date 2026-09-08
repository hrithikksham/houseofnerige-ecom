import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface CampaignBannerProps {
  desktopImage: string;
  mobileImage?: string | null;

  alt: string;

  href?: string | null;

  priority?: boolean;

  className?: string;

  imageClassName?: string;

  sizes?: string;
}

export function CampaignBanner({
  desktopImage,
  mobileImage,
  alt,
  href,
  priority = false,
  className,
  imageClassName,
  sizes = "100vw",
}: CampaignBannerProps) {
  const content = (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "aspect-[4/5] sm:aspect-[5/2] lg:aspect-[3/1]",
        className
      )}
    >
      {/* Desktop image */}
      <Image
        src={desktopImage}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "hidden object-cover object-center sm:block",
          imageClassName
        )}
      />

      {/* Mobile image */}
      <Image
        src={mobileImage || desktopImage}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={cn(
          "object-cover object-center sm:hidden",
          imageClassName
        )}
      />
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      aria-label={alt}
      className="group block w-full overflow-hidden"
    >
      {content}
    </Link>
  );
}