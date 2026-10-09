'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Sub-sites that manage their own autonomous navigation and footer
// (with built-in CSCosmos back button, breadcrumbs, and sub-routes)
const SELF_CONTAINED_SUBSITE_ROUTES = new Set([
  '/aicosmos',
  '/aimathviz',
  '/apiviz',
  '/arrayviz',
  '/authviz',
  '/blockchainviz',
  '/browseruniverse',
  '/cloudcosmos',
  '/consensusviz',
  '/crossplatformviz',
  '/cryptviz',
  '/css-cosmos',
  '/dockercosmos',
  '/evminternals',
  '/fastapicosmos',
  '/gitcosmos',
  '/golangviz',
  '/html-cosmos',
  '/jsviz',
  '/k8scosmos',
  '/lldcosmos',
  '/loadbalancing',
  '/merkletreeviz',
  '/microservicesviz',
  '/mongocosmos',
  '/mqviz',
  '/nextjscosmos',
  '/nodecosmos',
  '/patriciatrie',
  '/program-cosmos',
  '/ptopblockchain',
  '/reactcosmos',
  '/redisviz',
  '/rustviz',
  '/solidityviz',
  '/sqlcosmos',
  '/stringalgoviz',
  '/sveltecosmos',
  '/synccosmos',
  '/systemdesignviz',
  '/tailwindcosmos',
  '/tsviz',
  '/vuecosmos',
  '/wasmcosmos',
  '/webprotocols',
  '/websecurity',
  '/xrcosmos',
]);

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];
  const isSelfContained = segments.some((seg) =>
    SELF_CONTAINED_SUBSITE_ROUTES.has(`/${seg}`)
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg"
      >
        Skip to content
      </a>
      {!isSelfContained && <Navbar />}
      <main id="main" className="flex-1">{children}</main>
      {!isSelfContained && <Footer />}
    </>
  );
}
