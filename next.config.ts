import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/log-analyzer",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
