import type { NextConfig } from 'next';
import { legacyTopicRoutes } from './src/data/legacy-topic-routes';

// Build rewrites and redirects for universal URL routing:
// Canonical URL: /[domain]/[topic]
// Legacy URL: /[rootPath] -> 308 redirect to /[domain]/[topic]
// Internal rewrite: /[domain]/[topic] -> /[rootPath] (serves legacy visualizer page)
const legacyRewrites: { source: string; destination: string }[] = [];
const legacyRedirects: { source: string; destination: string; permanent: boolean }[] = [];
const seenRoots = new Set<string>();

for (const r of legacyTopicRoutes) {
  // 1. Rewrite domain route to legacy visualizer root route
  legacyRewrites.push({
    source: `/${r.domain}/${r.slug}`,
    destination: `/${r.rootPath}`,
  });
  legacyRewrites.push({
    source: `/${r.domain}/${r.slug}/:path*`,
    destination: `/${r.rootPath}/:path*`,
  });

  // Support any domain aliases (e.g. /devops/dockercosmos -> /dockercosmos)
  if (r.aliases) {
    for (const alias of r.aliases) {
      legacyRewrites.push({
        source: `/${alias}/${r.slug}`,
        destination: `/${r.rootPath}`,
      });
      legacyRewrites.push({
        source: `/${alias}/${r.slug}/:path*`,
        destination: `/${r.rootPath}/:path*`,
      });
    }
  }

  // 2. Redirect legacy root visits to canonical domain route
  if (!seenRoots.has(r.rootPath)) {
    seenRoots.add(r.rootPath);
    legacyRedirects.push({
      source: `/${r.rootPath}`,
      destination: `/${r.domain}/${r.slug}`,
      permanent: true,
    });
    legacyRedirects.push({
      source: `/${r.rootPath}/:path*`,
      destination: `/${r.domain}/${r.slug}/:path*`,
      permanent: true,
    });
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async redirects() {
    return legacyRedirects;
  },
  async rewrites() {
    return {
      beforeFiles: legacyRewrites,
      afterFiles: [],
      fallback: [],
    };
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
