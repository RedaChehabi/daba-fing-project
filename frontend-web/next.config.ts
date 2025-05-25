/** @type {import('next').NextConfig} */


const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      // Add any Turbopack-specific rules here if needed
    },
  },
  webpack: (config, { isServer }) => {
    // Disable webpack caching for Electron builds
    config.cache = false;
    
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
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  }
}

module.exports = nextConfig
