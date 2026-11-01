'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { cn } from '../../utils/cn';

const BASE = '/fullstack/css-cosmos';

const links = [
  { href: `${BASE}`, label: 'Home' },
  { href: `${BASE}/concepts`, label: 'Concepts' },
  { href: `${BASE}/lab`, label: 'CSS Lab' },
  { href: `${BASE}/problems`, label: 'Challenges (100 Qs)' },
];

const Navbar = () => {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    const normPath = (pathname || '').replace(/^\/fullstack/, '');
    const normHref = href.replace(/^\/fullstack/, '');
    return normHref === '/css-cosmos' ? normPath === '/css-cosmos' : normPath.startsWith(normHref);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/topics" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full transition-all">
            <ArrowLeft size={14} />
            <span>CSCosmos</span>
          </Link>
          <Link href={BASE} className="group flex items-center gap-3 text-slate-900 dark:text-white transition-colors">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-amber-500 shadow-sm">
              <Sparkles className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">CSS Universe</p>
              <p className="text-lg font-semibold leading-tight">Visual Learning</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-1 text-sm backdrop-blur-lg transition-colors lg:flex">
          {links.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
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
            href={`${BASE}/lab`}
            size="sm"
            variant="secondary"
            className="hidden sm:inline-flex"
          >
            Open Lab
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
