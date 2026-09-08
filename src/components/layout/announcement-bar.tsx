"use client";

import { useState } from "react";

interface AnnouncementBarProps {
  messages?: string[];
}

export function AnnouncementBar({
  messages = [
    "INSPIRED BY HERITAGE",
    "NEW ARRIVALS",
    "ROOTED IN TRADITION",
    "PAN-INDIA SHIPPING",
  ],
}: AnnouncementBarProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Enough repeated content for a seamless infinite marquee.
  const repeatedMessages = [
    ...messages,
    ...messages,
    ...messages,
    ...messages,
  ];

  return (
    <div
      className="
        relative
        isolate
        h-9
        overflow-hidden
        border-b
        border-white/[0.08]
        bg-[#062F28]
        text-soft-white
        shadow-[0_1px_0_rgba(255,255,255,0.04)]
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Premium ambient gradients */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_20%_50%,rgba(216,196,155,0.12),transparent_28%),radial-gradient(circle_at_80%_50%,rgba(177,135,67,0.10),transparent_25%)]
        "
      />

      {/* Moving highlight */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-[35%]
          announcement-light-sweep
          bg-gradient-to-r
          from-transparent
          via-white/[0.08]
          to-transparent
          blur-md
        "
      />

      {/* Top premium hairline */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#D8C49B]/35
          to-transparent
        "
      />

      {/* Bottom subtle glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#B18743]/40
          to-transparent
        "
      />

      {/* Scrolling messages */}
      <div
        className="
          relative
          z-10
          flex
          h-full
          w-max
          items-center
          announcement-track
          will-change-transform
        "
        style={{
          animationPlayState: isPaused
            ? "paused"
            : "running",
        }}
        aria-live="off"
      >
        {repeatedMessages.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="
              flex
              shrink-0
              items-center
              gap-8
              px-9
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-[#F7F1E5]/85
              md:text-[11px]
            "
          >
            {/* Shimmer text */}
            <span
              className={
                index % 4 === 0
                  ? "announcement-shine"
                  : ""
              }
            >
              {message}
            </span>

            {/* Premium separator */}
            <span
              className="
                relative
                flex
                size-1.5
                items-center
                justify-center
              "
              aria-hidden="true"
            >
              <span className="absolute size-1 rounded-full bg-[#D8C49B]" />

              <span className="absolute size-2.5 rounded-full border border-[#D8C49B]/20" />
            </span>
          </span>
        ))}
      </div>

      {/* Edge fade */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-20
          w-20
          bg-gradient-to-r
          from-[#062F28]
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-20
          w-20
          bg-gradient-to-l
          from-[#062F28]
          to-transparent
        "
      />
    </div>
  );
}