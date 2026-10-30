import type { NextConfig } from 'next';
import { engineRoutes } from './src/data/engine-routes';

// Canonical URL: /[domain]/[topicSlug]
// Engine URL:    /[enginePath]  (currently the same value as topicSlug)
//
// Requests to the canonical URL are internally rewritten to the engine route.
// Requests to the engine route are 308-redirected to the canonical URL, so the
// canonical URL is the only URL users and crawlers should ever see.
const engineRewrites: { source: string; destination: string }[] = [];
const canonicalRedirects: { source: string; destination: string; permanent: boolean }[] = [];

// Shared module pages live under the AI engine in the component tree but have
// their own canonical topic URLs. Keep the old /aicosmos/... URLs working with a
// direct redirect instead of serving duplicate content through the engine route.
const moduleRedirects = [
  {
    source: '/aicosmos/ai-engineering-foundations',
    destination: '/ai/ai-engineering-foundations',
  },
  {
    source: '/aicosmos/ai-engineering-foundations/:path*',
    destination: '/ai/ai-engineering-foundations/:path*',
  },
  {
    source: '/aicosmos/python-for-ai-engineering',
    destination: '/ai/python-for-ai-engineering',
  },
  {
    source: '/aicosmos/python-for-ai-engineering/:path*',
    destination: '/ai/python-for-ai-engineering/:path*',
  },
  {
    source: '/aicosmos/learn/ai-engineering-foundations',
    destination: '/ai/ai-engineering-foundations/learn',
  },
  {
    source: '/aicosmos/learn/ai-engineering-foundations/:path*',
    destination: '/ai/ai-engineering-foundations/learn/:path*',
  },
  {
    source: '/aicosmos/learn/python-for-ai-engineering',
    destination: '/ai/python-for-ai-engineering/learn',
  },
  {
    source: '/aicosmos/learn/python-for-ai-engineering/:path*',
    destination: '/ai/python-for-ai-engineering/learn/:path*',
  },
].map((redirect) => ({ ...redirect, permanent: true }));

canonicalRedirects.push(...moduleRedirects);

const seenEnginePaths = new Set<string>();

for (const route of engineRoutes) {
  const { domain, topicSlug } = route;

  // 1. Rewrite the canonical topic URL to the engine route.
  engineRewrites.push({
    source: `/${domain}/${topicSlug}`,
    destination: `/${topicSlug}`,
  });
  engineRewrites.push({
    source: `/${domain}/${topicSlug}/:path*`,
    destination: `/${topicSlug}/:path*`,
  });

  // Support any cross-listed domain aliases (e.g. /devops/dockercosmos -> /dockercosmos).
  for (const alias of route.crossListedDomains ?? []) {
    engineRewrites.push({
      source: `/${alias}/${topicSlug}`,
      destination: `/${topicSlug}`,
    });
    engineRewrites.push({
      source: `/${alias}/${topicSlug}/:path*`,
      destination: `/${topicSlug}/:path*`,
    });
  }

  // 2. Redirect direct engine-route visits to the canonical domain route.
  if (!seenEnginePaths.has(topicSlug)) {
    seenEnginePaths.add(topicSlug);
    canonicalRedirects.push({
      source: `/${topicSlug}`,
      destination: `/${domain}/${topicSlug}`,
      permanent: true,
    });
    canonicalRedirects.push({
      source: `/${topicSlug}/:path*`,
      destination: `/${domain}/${topicSlug}/:path*`,
      permanent: true,
    });
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,
  productionBrowserSourceMaps: false,
  enablePrerenderSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/login',
        headers: [{ key: 'X-Frame-Options', value: 'DENY' }],
      },
      {
        source: '/progress',
        headers: [{ key: 'X-Frame-Options', value: 'DENY' }],
      },
      {
        source: '/certificate/:id*',
        headers: [{ key: 'X-Frame-Options', value: 'DENY' }],
      },
    ];
  },
  async redirects() {
    return canonicalRedirects;
  },
  async rewrites() {
    return {
      beforeFiles: engineRewrites,
      afterFiles: [],
      fallback: [],
    };
  },
  experimental: {
    serverSourceMaps: false,
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
