import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 2. serverActions is now stable in Next 14+,
    // but bodySizeLimit still lives here if you need to increase it
    serverActions: {
      bodySizeLimit: "50mb",
      allowedOrigins: [
        "altamaritime.com",
        "www.altamaritime.com",
        "https://altamaritime.com",
        "https://www.altamaritime.com",
      ],
    },
  },
};

export default nextConfig;
