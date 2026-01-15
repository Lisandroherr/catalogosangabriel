/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "erp-v0.onrender.com"],
    unoptimized: true,
  },
  // Ensure output is standalone for better performance in Render
  output: 'standalone',
};

module.exports = nextConfig;
