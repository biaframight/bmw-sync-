import type { NextConfig } from "next";

// BASE_PATH is set to "/bmw-sync/" by the Replit artifact workflow.
// On Vercel (standalone), it is empty → app serves at "/".
const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  basePath,
  // Expose to client bundles so QR URLs are constructed correctly
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
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
