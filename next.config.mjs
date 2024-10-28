/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
