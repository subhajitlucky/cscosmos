'use client';

import Link from 'next/link';
import { BookOpen, Terminal, Github, Twitter } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { TOPIC_BASE_PATH } from '../data/topic';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border/80 bg-card px-6 py-12 transition-colors">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="col-span-1 space-y-4">
          <Link
            href={TOPIC_BASE_PATH}
            className="flex items-center gap-2 text-xl font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen size={20} />
            </span>
            <span className="text-foreground">Web Protocols</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A visual guide to HTTP, headers, caching, and the network path between browser and server.
          </p>
          <div className="flex gap-2">
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="CSCosmos on Twitter"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Twitter size={18} />
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="CSCosmos on GitHub"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">Learning</h4>
          <ul className="space-y-2 text-sm font-medium text-muted-foreground">
            <li>
              <Link href={`${TOPIC_BASE_PATH}/path`} className="transition-colors hover:text-primary">
                Learning Path
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/playground`} className="transition-colors hover:text-primary">
                Playground
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/http-intro`} className="transition-colors hover:text-primary">
                Introduction
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/caching-basics`} className="transition-colors hover:text-primary">
                Caching Guide
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">Resources</h4>
          <ul className="space-y-2 text-sm font-medium text-muted-foreground">
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                MDN Web Docs
              </a>
            </li>
            <li>
              <a
                href="https://www.rfc-editor.org/rfc/rfc9114"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                HTTP/3 Spec
              </a>
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                Header Reference
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/80 bg-muted/50 p-6">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Terminal size={18} />
            <span className="text-sm font-bold uppercase tracking-tight">Try a request</span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Build a request, change the cache behavior, and inspect the response headers.
          </p>
          <Link
            href={`${TOPIC_BASE_PATH}/playground`}
            className="block rounded-xl bg-primary py-2 text-center text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Open Playground
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 text-xs font-medium text-muted-foreground md:flex-row">
        <p>© CSCosmos Web Protocols Visualizer.</p>
        <div className="flex gap-6">
          <Link href="/topics" className="transition-colors hover:text-foreground">
            CSCosmos Topics
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
