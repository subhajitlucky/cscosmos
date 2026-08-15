'use client';

import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/rustviz/styles.css';
import { Navbar } from '@/components/visualizers/rustviz/components/Navbar';
import { Footer } from '@/components/visualizers/rustviz/components/Footer';
import { Home } from '@/components/visualizers/rustviz/pages/Home';
import { Concepts } from '@/components/visualizers/rustviz/pages/Concepts';
import { ConceptDetail } from '@/components/visualizers/rustviz/pages/ConceptDetail';
import { OwnershipLab } from '@/components/visualizers/rustviz/pages/OwnershipLab';
import { BorrowCheckerLab } from '@/components/visualizers/rustviz/pages/BorrowCheckerLab';
import { LifetimesLab } from '@/components/visualizers/rustviz/pages/LifetimesLab';
import { SmartPointersLab } from '@/components/visualizers/rustviz/pages/SmartPointersLab';
import { ConcurrencyLab } from '@/components/visualizers/rustviz/pages/ConcurrencyLab';
import { Pitfalls } from '@/components/visualizers/rustviz/pages/Pitfalls';
import { Flashcards } from '@/components/visualizers/rustviz/pages/Flashcards';
import { CheatSheet } from '@/components/visualizers/rustviz/pages/CheatSheet';

export default function RustVizClientPage({ slug }: { slug: string[] }) {
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let View: React.ReactNode = <Home />;

  if (first === '') {
    View = <Home />;
  } else if (first === 'concepts') {
    if (second) {
      View = <ConceptDetail slug={second} />;
    } else {
      View = <Concepts />;
    }
  } else if (first === 'ownership-lab') {
    View = <OwnershipLab />;
  } else if (first === 'borrow-checker') {
    View = <BorrowCheckerLab />;
  } else if (first === 'lifetimes-lab') {
    View = <LifetimesLab />;
  } else if (first === 'smart-pointers') {
    View = <SmartPointersLab />;
  } else if (first === 'concurrency-lab') {
    View = <ConcurrencyLab />;
  } else if (first === 'pitfalls') {
    View = <Pitfalls />;
  } else if (first === 'flashcards') {
    View = <Flashcards />;
  } else if (first === 'cheatsheet') {
    View = <CheatSheet />;
  } else {
    notFound();
  }

  return (
    <div className="rustviz-root min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-16 text-center font-mono text-xs text-[var(--rust-muted)]">
              Loading RustViz Engine...
            </div>
          }
        >
          {View}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
