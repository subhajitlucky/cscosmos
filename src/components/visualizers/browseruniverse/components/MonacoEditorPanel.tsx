'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '../utils/cn';

type MonacoEditorPanelProps = {
  html: string;
  css: string;
  js: string;
  onChange: (value: { html?: string; css?: string; js?: string }) => void;
  onRun: () => void;
};

export default function MonacoEditorPanel({ html, css, js, onChange, onRun }: MonacoEditorPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <EditorCard title="HTML" accent="text-accentSoft">
        <Editor
          height="240px"
          defaultLanguage="html"
          value={html}
          onChange={(value) => onChange({ html: value || '' })}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on' }}
        />
      </EditorCard>
      <EditorCard title="CSS" accent="text-accentBlue">
        <Editor
          height="240px"
          defaultLanguage="css"
          value={css}
          onChange={(value) => onChange({ css: value || '' })}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on' }}
        />
      </EditorCard>
      <EditorCard title="JavaScript" accent="text-accentGreen">
        <Editor
          height="240px"
          defaultLanguage="javascript"
          value={js}
          onChange={(value) => onChange({ js: value || '' })}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on' }}
        />
      </EditorCard>
      <div className="lg:col-span-3 flex justify-end">
        <button
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow"
          onClick={onRun}
        >
          Run in sandbox
        </button>
      </div>
    </div>
  );
}

function EditorCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass flex h-full flex-col gap-2 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{title}</p>
        <span className={cn('text-xs uppercase tracking-[0.2rem]', accent)}>live</span>
      </div>
      <div className="min-h-[240px] overflow-hidden rounded-xl border border-border bg-base/80">
        {children}
      </div>
    </div>
  );
}
