"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useGoProgress } from "../lib/useGoProgress";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ChevronDown,
  Code2,
  Cpu,
  FileCode,
  Github,
  Menu,
  Play,
  ShieldAlert,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { completedCount, totalConcepts, percentage, nextUncompletedConcept } = useGoProgress();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/golangviz") return pathname === "/golangviz";
    return pathname?.startsWith(href);
  };

  const toolLinks = [
    {
      href: "/golangviz/flashcards",
      label: "Interview Flashcards",
      desc: "Spaced-repetition technical recall deck",
      icon: Brain,
    },
    {
      href: "/golangviz/pitfalls",
      label: "Top 50 Production Pitfalls",
      desc: "Critical bugs, leaks, and gotchas",
      icon: ShieldAlert,
    },
    {
      href: "/golangviz/cheatsheet",
      label: "Go 1.24+ Cheat Sheet",
      desc: "1-click copyable production recipes",
      icon: FileCode,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--panel-border)] bg-[color-mix(in srgb, var(--background) 88%, transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        {/* Left: Brand & Hub Backlink */}
        <div className="flex items-center gap-3">
          <Link
            href="/topics"
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1.5 bg-[var(--panel)] border border-[var(--panel-border)] px-3 py-1.5 rounded-full transition-all hover:border-[var(--accent)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CSCosmos</span>
          </Link>

          <Link
            href="/golangviz"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-[var(--foreground)] group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-extrabold text-base">
              Golang<span className="text-blue-500">Viz</span>
            </span>
          </Link>
        </div>

        {/* Center: Main Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-[var(--foreground)]">
          <Link
            href="/golangviz/path"
            className={`px-3 py-2 rounded-xl transition-all ${
              isActive("/golangviz/path")
                ? "bg-[var(--panel)] text-blue-600 dark:text-blue-400 border border-[var(--panel-border)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--panel)]"
            }`}
          >
            70 Concepts
          </Link>

          <Link
            href="/golangviz/labs"
            className={`px-3 py-2 rounded-xl transition-all ${
              isActive("/golangviz/labs")
                ? "bg-[var(--panel)] text-blue-600 dark:text-blue-400 border border-[var(--panel-border)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--panel)]"
            }`}
          >
            Coding Labs
          </Link>

          <Link
            href="/golangviz/playground"
            className={`px-3 py-2 rounded-xl transition-all ${
              isActive("/golangviz/playground")
                ? "bg-[var(--panel)] text-blue-600 dark:text-blue-400 border border-[var(--panel-border)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--panel)]"
            }`}
          >
            Playground
          </Link>

          {/* More Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
                isActive("/golangviz/flashcards") ||
                isActive("/golangviz/pitfalls") ||
                isActive("/golangviz/cheatsheet")
                  ? "bg-[var(--panel)] text-blue-600 dark:text-blue-400 border border-[var(--panel-border)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--panel)]"
              }`}
            >
              <span>Practice &amp; Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--panel)] border border-[var(--panel-border)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="space-y-1">
                  {toolLinks.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                          isActive(tool.href)
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "hover:bg-slate-500/10 text-[var(--foreground)]"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{tool.label}</div>
                          <div className="text-[11px] text-[var(--muted)] leading-tight">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Progress & Theme Controls */}
        <div className="flex items-center gap-2">
          {/* Compact Progress Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-[var(--panel)] border border-[var(--panel-border)] text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono text-[var(--muted)] font-semibold">
              {completedCount}/{totalConcepts}
            </span>
            <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            {nextUncompletedConcept && (
              <Link
                href={`/golangviz/concepts/${nextUncompletedConcept.slug}`}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 ml-1"
                title={`Resume: ${nextUncompletedConcept.title}`}
              >
                <span>Resume</span>
                <Play className="w-2.5 h-2.5 fill-current" />
              </Link>
            )}
          </div>

          <ThemeToggle />

          <a
            href="https://github.com/subhajitlucky/golangviz"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-[var(--panel-border)] text-[var(--foreground)] hover:bg-[var(--panel)] transition-colors hidden sm:flex items-center justify-center"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[var(--panel-border)] bg-[var(--background)] px-4 py-4 text-xs font-semibold text-[var(--foreground)] md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--panel)] border border-[var(--panel-border)] mb-3">
              <span>Overall Progress:</span>
              <span className="font-mono text-emerald-500 font-bold">
                {completedCount}/{totalConcepts} ({percentage}%)
              </span>
            </div>

            <Link
              href="/golangviz/path"
              onClick={() => setMobileOpen(false)}
              className="block p-2.5 rounded-xl hover:bg-[var(--panel)] transition"
            >
              70 Concepts Roadmap
            </Link>

            <Link
              href="/golangviz/labs"
              onClick={() => setMobileOpen(false)}
              className="block p-2.5 rounded-xl hover:bg-[var(--panel)] transition"
            >
              Interactive Coding Labs
            </Link>

            <Link
              href="/golangviz/playground"
              onClick={() => setMobileOpen(false)}
              className="block p-2.5 rounded-xl hover:bg-[var(--panel)] transition"
            >
              Live Code Playground &amp; Simulators
            </Link>

            <div className="pt-2 border-t border-[var(--panel-border)] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider px-2">
                Practice &amp; Tools
              </span>
              {toolLinks.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileOpen(false)}
                  className="block p-2.5 rounded-xl hover:bg-[var(--panel)] transition"
                >
                  {tool.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[var(--panel-border)] flex items-center justify-between">
              <ThemeToggle />
              <a
                href="https://github.com/subhajitlucky/golangviz"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] text-center font-bold"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
