import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
      // This removes all console.logs in production, but keeps console.error and console.warn!
      removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
    },};

export default nextConfig;
