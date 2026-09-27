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
  const rootSegment = pathname ? '/' + pathname.split('/')[1] : '';
  const isSelfContained = SELF_CONTAINED_SUBSITE_ROUTES.has(rootSegment);

  return (
    <>
      {!isSelfContained && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isSelfContained && <Footer />}
    </>
  );
}
