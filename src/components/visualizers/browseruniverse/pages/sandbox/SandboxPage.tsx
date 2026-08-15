'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import MonacoEditorPanel from '../../components/MonacoEditorPanel';
import { topics } from '../../data/topics';
import { cn } from '../../utils/cn';

type LogEntry = { type: 'log' | 'error' | 'mutation' | 'listener'; message: string };

const starter = topics[0];

export default function SandboxPage() {
  const [html, setHtml] = useState(starter.exampleHTML);
  const [css, setCss] = useState(starter.exampleCSS);
  const [js, setJs] = useState(starter.exampleJS);
  const [srcDoc, setSrcDoc] = useState('');
  const [paused, setPaused] = useState(false);
  const [unsafeOrigin, setUnsafeOrigin] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mutations, setMutations] = useState<string[]>([]);
  const [listeners, setListeners] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setSrcDoc(buildSandboxDoc({ html, css, js, paused }));
  }, []); // initial run

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const { type, payload } = event.data || {};
      if (!type) return;
      if (type === 'mutation') {
        setMutations((prev) => [payload, ...prev].slice(0, 10));
      } else if (type === 'listener') {
        setListeners((prev) => [`${payload.target} → ${payload.type}`, ...prev].slice(0, 8));
      } else if (type === 'log' || type === 'error') {
        setLogs((prev) => [{ type, message: String(payload) } satisfies LogEntry, ...prev].slice(0, 30));
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const run = () => {
    setSrcDoc(buildSandboxDoc({ html, css, js, paused }));
    setLogs((prev) => [
      { type: 'log', message: 'Sandbox refreshed' } satisfies LogEntry,
      ...prev,
    ].slice(0, 30));
  };

  const sandboxAttr = unsafeOrigin ? 'allow-scripts allow-same-origin' : 'allow-scripts';

  const domTree = useMemo(() => quickOutline(html), [html]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Sandbox</p>
        <h1 className="section-title">Live DOM, CSS, and JS sandbox</h1>
        <p className="text-sm text-slate-300">
          Monaco-powered split editors with a sandboxed iframe (CSP: default-src &apos;none&apos;). Mutation
          observers, event listener inspector, and runtime error stack traces included.
        </p>
      </div>

      <MonacoEditorPanel
        html={html}
        css={css}
        js={js}
        onChange={(value) => {
          if (value.html !== undefined) setHtml(value.html);
          if (value.css !== undefined) setCss(value.css);
          if (value.js !== undefined) setJs(value.js);
        }}
        onRun={run}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr,0.5fr]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              className={cn(
                'rounded-full border px-3 py-2 font-semibold',
                paused ? 'border-accent bg-accent/20 text-white' : 'border-border text-slate-200',
              )}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? 'Resume scripts' : 'Pause scripts'}
            </button>
            <label className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={unsafeOrigin}
                onChange={() => setUnsafeOrigin((v) => !v)}
              />
              allow-same-origin (unsafe)
            </label>
            <button
              className="rounded-full border border-border bg-card/70 px-3 py-2 text-xs text-slate-200 hover:border-accent/40"
              onClick={run}
            >
              Refresh sandbox
            </button>
          </div>
          <div className="rounded-2xl border border-border bg-base/70 p-3 text-xs text-slate-300">
            CSP applied inside iframe: <code>default-src &apos;none&apos;; script-src &apos;unsafe-inline&apos;; style-src &apos;unsafe-inline&apos;; img-src data:;</code>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 shadow-lg">
            <iframe
              title="sandbox"
              ref={iframeRef}
              sandbox={sandboxAttr}
              srcDoc={srcDoc}
              className="h-[420px] w-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <LogPanel title="Runtime log" entries={logs} />
          <ListPanel title="Mutation observer" items={mutations} />
          <ListPanel title="Event listeners" items={listeners} />
          <ListPanel title="DOM outline" items={domTree} />
        </div>
      </div>
    </div>
  );
}

function LogPanel({ title, entries }: { title: string; entries: LogEntry[] }) {
  return (
    <div className="glass rounded-2xl border border-border p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{title}</p>
        <span className="text-[11px] uppercase tracking-[0.2rem] text-slate-400">live</span>
      </div>
      <div className="mt-2 space-y-1 text-xs text-slate-200">
        {entries.length === 0 ? <p className="text-slate-500">No events yet.</p> : null}
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded-lg border px-2 py-1',
              entry.type === 'error'
                ? 'border-red-500/40 bg-red-500/10 text-red-100'
                : entry.type === 'log'
                  ? 'border-border bg-base/70'
                  : 'border-accent/40 bg-accent/10 text-white',
            )}
          >
            <span className="mr-2 rounded bg-card/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.15rem]">
              {entry.type}
            </span>
            {entry.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl border border-border p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{title}</p>
        <span className="text-[11px] uppercase tracking-[0.2rem] text-slate-400">live</span>
      </div>
      <ul className="mt-2 space-y-1 text-xs text-slate-200">
        {items.length === 0 ? <li className="text-slate-500">No data yet.</li> : null}
        {items.map((item, idx) => (
          <li key={idx} className="rounded-lg border border-border bg-base/70 px-2 py-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildSandboxDoc({
  html,
  css,
  js,
  paused,
}: {
  html: string;
  css: string;
  js: string;
  paused: boolean;
}) {
  const escapedJs = js.replace(/<\/script/gi, '<\\/script>');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:;" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>
      const send = (type, payload) => parent.postMessage({ type, payload }, '*');
      const observer = new MutationObserver((mutations) => {
        send('mutation', mutations.map(m => m.type + ' on ' + (m.target?.tagName || 'node')).join('; '));
      });
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

      const add = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        send('listener', { target: this.tagName || 'window', type });
        return add.call(this, type, listener, options);
      }

      const originalLog = console.log;
      console.log = (...args) => { send('log', args.map(String).join(' ')); originalLog(...args); };

      window.addEventListener('error', (event) => send('error', event.message + (event.error?.stack ? '\\n' + event.error.stack : '')));

      ${paused ? '' : `try { ${escapedJs} } catch (err) { send('error', err.message + '\\n' + err.stack); }`}
    </script>
  </body>
</html>`;
}

function quickOutline(markup: string) {
  const outlines = markup
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/</g, '').replace(/>/g, ''))
    .slice(0, 6);
  return outlines;
}
