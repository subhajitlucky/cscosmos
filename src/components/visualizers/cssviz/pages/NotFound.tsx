'use client';

import Link from 'next/link';
import { Button } from '@/components/visualizers/cssviz/components/ui/Button';
import PageTransition from '@/components/visualizers/cssviz/components/common/PageTransition';
import GlassCard from '@/components/visualizers/cssviz/components/common/GlassCard';

const NotFound = () => (
  <PageTransition>
    <div className="flex min-h-[60vh] items-center justify-center">
      <GlassCard className="max-w-lg">
        <div className="space-y-4 p-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">404</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The CSS galaxy is vast, but this route doesn’t exist. Choose a visualizer or head back to the home nebula.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button as={Link} href="/css-cosmos" size="lg">
              Home
            </Button>
            <Button as={Link} href="/css-cosmos/visualizers" variant="secondary" size="lg">
              Visualizers
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  </PageTransition>
);

export default NotFound;
