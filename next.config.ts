/** @type {import('next').NextConfig} */
const config = {
  // ... other configuration settings you might have ...

  experimental: {
    // This is required for Server Actions in older versions (Next.js 13)
    // and where the bodySizeLimit option lives.
    serverActions: {
      // Set the maximum size for the request body.
      // Example: Setting the limit to 10 megabytes.
      bodySizeLimit: '50mb', 
    },
  },
};
 
module.exports = config;