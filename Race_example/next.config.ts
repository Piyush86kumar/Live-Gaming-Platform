import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false, // Disabled to avoid double-render issues with the canvas game loop
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
