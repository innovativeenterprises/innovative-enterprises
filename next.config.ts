
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Disable Image Optimization API for static export
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
   typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
