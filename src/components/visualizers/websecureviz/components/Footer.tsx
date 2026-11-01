'use client';

import Link from 'next/link';
import { ShieldCheck, Github, Twitter, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { TOPIC_BASE_PATH } from '../data/topic';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border/80 bg-card px-6 py-12 transition-colors">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="col-span-1 space-y-4">
          <Link
            href={TOPIC_BASE_PATH}
            className="flex items-center gap-2 text-xl font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
              <ShieldCheck size={20} />
            </span>
            <span className="text-foreground">Web Security</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A comprehensive, interactive deep dive into modern browser security models, attack vectors, and defense-in-depth engineering.
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
          <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">
            Curriculum
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href={`${TOPIC_BASE_PATH}/concepts`} className="font-semibold text-foreground hover:underline">
                All 8 Core Concepts &rarr;
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/same-origin-policy`} className="hover:text-foreground transition-colors">
                Same-Origin Policy
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/cors-architecture`} className="hover:text-foreground transition-colors">
                CORS Architecture
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/xss-cross-site-scripting`} className="hover:text-foreground transition-colors">
                Cross-Site Scripting (XSS)
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/csrf-and-samesite`} className="hover:text-foreground transition-colors">
                CSRF & Anti-Forgery
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">
            Advanced Defense
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/content-security-policy`} className="hover:text-foreground transition-colors">
                Content Security Policy (CSP)
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/cookie-security-architecture`} className="hover:text-foreground transition-colors">
                Cookie Security & SameSite
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/clickjacking-defense`} className="hover:text-foreground transition-colors">
                Clickjacking & Framing
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/topics/modern-web-defense-stack`} className="hover:text-foreground transition-colors">
                Defense-in-Depth Stack
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">
            Interactive Tools
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href={`${TOPIC_BASE_PATH}/lab`} className="hover:text-foreground transition-colors">
                Multi-Tool Security Lab
              </Link>
            </li>
            <li>
              <Link href={`${TOPIC_BASE_PATH}/problems`} className="hover:text-foreground transition-colors">
                52 Certification Problems
              </Link>
            </li>
            <li>
              <Link href="/topics" className="hover:text-foreground inline-flex items-center gap-1 transition-colors">
                CSCosmos Catalog <ExternalLink size={12} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-border pt-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} CSCosmos. Dedicated to open-access computer science mastery.
      </div>
    </footer>
  );
}
