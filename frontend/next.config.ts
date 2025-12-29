/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features if needed
  output: "standalone",
  
  // Allow images from any domain (for future media support)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
