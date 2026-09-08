import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xullvkfocdcxywbtwcge.supabase.co",
      },
      {
        protocol: "https",
        hostname:
          "pub-c09c28cd8a3a4fe39608a7de136951d8.r2.dev",
      },
    ],
  },
};

export default nextConfig;