import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface CampaignBannerProps {
  image: string;
  alt: string;
  href?: string | null;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
}

export function CampaignBanner({
  image,
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
        "aspect-[2/1] sm:aspect-[5/2] lg:aspect-[3/1]",
        className
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover object-center",
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