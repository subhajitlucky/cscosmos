'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Sub-sites that manage their own custom header (with built-in CSCosmos back button & sub-navigation)
const CUSTOM_HEADER_ROUTES = [
  '/jsviz',
  '/html-cosmos',
  '/css-cosmos',
  '/program-cosmos',
  '/webprotocols',
  '/websecurity',
  '/reactcosmos',
  '/nextjscosmos',
  '/golangviz',
  '/tsviz',
  '/redisviz',
];

// Sub-sites that manage their own custom footer
const CUSTOM_FOOTER_ROUTES = [
  '/jsviz',
  '/html-cosmos',
  '/css-cosmos',
  '/program-cosmos',
  '/webprotocols',
  '/websecurity',
  '/reactcosmos',
  '/nextjscosmos',
  '/golangviz',
  '/tsviz',
  '/redisviz',
];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCustomHeader = CUSTOM_HEADER_ROUTES.some(
    route => pathname === route || pathname?.startsWith(route + '/')
  );
  const isCustomFooter = CUSTOM_FOOTER_ROUTES.some(
    route => pathname === route || pathname?.startsWith(route + '/')
  );

  return (
    <>
      {!isCustomHeader && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isCustomFooter && <Footer />}
    </>
  );
}
