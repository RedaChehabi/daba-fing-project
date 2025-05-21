/** @type {import('next').NextConfig} */


const nextConfig = {
  output: 'export',
  // When building for Electron, set assetPrefix to '/' to satisfy next/font.
  // This might require adjustments in how Electron loads assets if runtime path issues occur.
  images: {
    unoptimized: true, // This is the crucial line
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
