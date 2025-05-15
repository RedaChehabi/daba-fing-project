/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export', // <-- Remove this line
   images: { // <-- Remove this block if only needed for Electron
    unoptimized: true,
  },
  experimental: {
    turbo: {
      // Add any Turbopack-specific rules here if needed
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
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
        destination: 'http://localhost:8000/api/:path*', // Keep for dev proxy
      },
    ];
  }
}

module.exports = nextConfig
