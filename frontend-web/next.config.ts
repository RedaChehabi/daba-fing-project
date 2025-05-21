/** @type {import('next').NextConfig} */

const isElectronBuild = process.env.BUILD_TARGET === 'electron';

const nextConfig = {
  output: 'export',
  // basePath: isElectronBuild ? './' : undefined, // Add this line
  assetPrefix: isElectronBuild ? './' : undefined, // Add this line
  images: {
    unoptimized: isElectronBuild, // This should be true during this build
  },
  experimental: {
    turbo: {
      // Add any Turbopack-specific rules here if needed
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
  reactStrictMode: true,
  async rewrites() {
    // Rewrites are not used by `output: 'export'` and Electron,
    // but can be kept for web server deployments.
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  }
}

module.exports = nextConfig
