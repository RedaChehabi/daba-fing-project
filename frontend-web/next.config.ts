/** @type {import('next').NextConfig} */


const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      // Add any Turbopack-specific rules here if needed
    },
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
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

export default nextConfig
