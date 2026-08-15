import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    cpus: 12,
    staticGenerationMaxConcurrency: 12,
    staticGenerationMinPagesPerWorker: 10,
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      '@radix-ui/react-dialog', 
      '@radix-ui/react-tabs', 
      '@radix-ui/react-accordion',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-separator',
      'd3',
      'animejs',
      'zustand',
      'clsx',
      'tailwind-merge'
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
