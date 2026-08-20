/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/pars-database',
  assetPrefix: '/pars-database/',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
