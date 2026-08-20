/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  ...(isGitHubPages ? { output: 'export' } : {}),
  basePath: isGitHubPages ? '/pars-database' : '',
  assetPrefix: isGitHubPages ? '/pars-database/' : '',
  trailingSlash: isGitHubPages,
  images: { unoptimized: isGitHubPages },
};

export default nextConfig;
