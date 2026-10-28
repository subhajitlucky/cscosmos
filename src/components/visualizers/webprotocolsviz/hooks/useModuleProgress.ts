'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'webprotocols:modules:v1';
const UPDATE_EVENT = 'webprotocols:modules-updated';

export type ModuleCompletion = Record<string, boolean>;

function readCompletion(): ModuleCompletion {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter((entry): entry is [string, boolean] => entry[1] === true),
    );
  } catch {
    return {};
  }
}

function writeCompletion(next: ModuleCompletion) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function useModuleProgress() {
  const [completed, setCompleted] = useState<ModuleCompletion>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setCompleted(readCompletion());
    sync();
    setMounted(true);
    window.addEventListener(UPDATE_EVENT, sync);
    return () => window.removeEventListener(UPDATE_EVENT, sync);
  }, []);

  const isComplete = (moduleId: string) => completed[moduleId] === true;

  const toggle = (moduleId: string): boolean => {
    const next = { ...readCompletion() };
    if (next[moduleId]) {
      delete next[moduleId];
    } else {
      next[moduleId] = true;
    }
    writeCompletion(next);
    setCompleted(next);
    return next[moduleId] === true;
  };

  return {
    completed,
    mounted,
    isComplete,
    toggle,
    completedCount: Object.keys(completed).length,
  };
}
