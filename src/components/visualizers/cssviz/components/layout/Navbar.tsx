'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { cn } from '../../utils/cn';

const links = [
  { href: '/css-cosmos', label: 'Home' },
  { href: '/css-cosmos/visualizers', label: 'Visualizers' },
  { href: '/css-cosmos/concepts', label: 'Concepts' },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass bg-surface/85 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/topics" className="text-xs font-semibold text-muted-text hover:text-body-text flex items-center gap-1.5 bg-surface border border-glass px-3 py-1.5 rounded-full transition-all">
            <ArrowLeft size={14} />
            <span>CSCosmos</span>
          </Link>
          <Link href="/css-cosmos" className="group flex items-center gap-3 text-body-text transition-colors">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-amber-500 shadow-sm">
              <Sparkles className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-text">CSS Universe</p>
              <p className="text-lg font-semibold leading-tight">Visual Learning</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-glass bg-surface/60 px-2 py-1 text-sm text-body-text backdrop-blur-lg transition-colors lg:flex">
          {links.map((link) => {
            const isActive = link.href === '/css-cosmos' ? pathname === '/css-cosmos' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 transition hover:text-primary',
                  isActive && 'bg-surface text-body-text shadow-glow font-bold',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            as={Link}
            href="/css-cosmos/topics/flexbox"
            size="sm"
            variant="secondary"
            className="hidden sm:inline-flex"
          >
            Start learning
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
