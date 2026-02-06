import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose'],
  experimental: {
    // 2. serverActions is now stable in Next 14+, 
    // but bodySizeLimit still lives here if you need to increase it
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: ['altamaritime.com', 'www.altamaritime.com', 'springgreen-hedgehog-502712.hostingersite.com', 'www.springgreen-hedgehog-502712.hostingersite.com']
    },
  },
  

};

export default nextConfig;