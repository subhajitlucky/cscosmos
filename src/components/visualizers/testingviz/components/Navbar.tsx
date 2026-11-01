import Link from 'next/link';
import { FlaskConical, Github } from 'lucide-react';

const links = [
  { href: '/fullstack/testing', label: 'Overview' },
  { href: '/fullstack/testing/learn', label: 'Curriculum' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/fullstack/testing" className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
            <FlaskConical className="h-4 w-4" />
          </span>
          TEST::COSMOS
        </Link>

        <nav className="flex items-center gap-1 text-xs font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://github.com/subhajitlucky/cscosmos"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="ml-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
