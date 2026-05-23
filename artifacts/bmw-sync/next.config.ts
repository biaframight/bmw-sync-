import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/bmw-sync",
  output: "standalone",
  allowedDevOrigins: ["*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
