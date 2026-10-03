import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const baseUrl = process.env.API_BASE_URL?.replace(/\/+$/, "");
    if (!baseUrl) throw new Error("API_BASE_URL is not configured");

    return [
      {
        source: "/api/v1/:path*",
        destination: `${baseUrl}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
