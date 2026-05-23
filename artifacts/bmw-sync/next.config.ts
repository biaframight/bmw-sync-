import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/bmw-sync",
  output: "standalone",
  allowedDevOrigins: [
    "*.replit.dev",
    "*.spock.replit.dev",
    "*.repl.co",
    "*.replit.app",
  ],
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
