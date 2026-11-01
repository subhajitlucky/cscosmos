import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-muted-foreground sm:flex-row">
        <p className="font-mono">
          TEST::COSMOS — prove the behavior, not the implementation.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/fullstack/testing/learn" className="hover:text-foreground">
            Curriculum
          </Link>
          <Link href="/fullstack" className="hover:text-foreground">
            Full Stack
          </Link>
        </div>
      </div>
    </footer>
  );
}
