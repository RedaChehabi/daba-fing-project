/** @type {import('next').NextConfig} */

const isElectronBuild = process.env.BUILD_TARGET === 'electron';

const nextConfig = {
  output: 'export', // Keep this commented unless specifically building for static export only for all targets
  images: {
    unoptimized: isElectronBuild, // Conditionally unoptimize for Electron
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
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', 
      },
    ];
  }
}

module.exports = nextConfig