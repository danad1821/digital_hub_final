/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    // This is required for Server Actions in older versions (Next.js 13)
    // and where the bodySizeLimit option lives.
    serverActions: {
      // Set the maximum size for the request body.
      // Example: Setting the limit to 10 megabytes.
      bodySizeLimit: '50mb', 
    },
  },
  serverExternalPackages: ['mongoose']
};
 
module.exports = config;