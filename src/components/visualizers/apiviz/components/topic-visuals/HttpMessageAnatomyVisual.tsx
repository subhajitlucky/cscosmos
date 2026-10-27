'use client';

import { useState } from 'react';
import { ArrowDown, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Topic, TopicRender } from '../../data/learning-path';
import { cn } from '@/lib/utils';
import { Flag, Micro, Panel, Stage, TerminalButton, VisualCaption } from './chrome';

type Data = Extract<TopicRender, { kind: 'http-message' }>;

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Generic, true HTTP semantics — the same facts an RFC-indexed table would give.
 * Nothing here is specific to a framework, product or vendor.
 */
const METHOD_FACTS: Record<Method, { safe: boolean; idempotent: boolean; cacheable: boolean }> = {
  GET: { safe: true, idempotent: true, cacheable: true },
  POST: { safe: false, idempotent: false, cacheable: false },
  PUT: { safe: false, idempotent: true, cacheable: false },
  PATCH: { safe: false, idempotent: false, cacheable: false },
  DELETE: { safe: false, idempotent: true, cacheable: false },
};

const START_LINES: Record<Method, string> = {
  GET: 'GET /articles/<article-id> HTTP/1.1',
  POST: 'POST /articles HTTP/1.1',
  PUT: 'PUT /articles/<article-id> HTTP/1.1',
  PATCH: 'PATCH /articles/<article-id> HTTP/1.1',
  DELETE: 'DELETE /articles/<article-id> HTTP/1.1',
};

const BODIES: Record<Method, string> = {
  GET: '— none: the method only asks for a representation —',
  POST: '— a new representation for the collection —',
  PUT: '— the full replacement representation —',
  PATCH: '— a partial modification —',
  DELETE: '— none —',
};

const STATUS_FAMILIES = {
  '2xx': 'HTTP/1.1 200 OK',
  '4xx': 'HTTP/1.1 404 Not Found',
  '5xx': 'HTTP/1.1 500 Internal Server Error',
} as const;

type Family = keyof typeof STATUS_FAMILIES;

const FAMILY_MEANING: Record<Family, string> = {
  '2xx': 'accepted — the outcome is in the response body',
  '4xx': 'the caller must change the request before retrying',
  '5xx': 'the request was fine; the server failed',
};

/**
 * FS-27c, `http-basics` — a message anatomy inspector.
 *
 * Geometry: the request and the response are drawn as stacked *bands* (start line,
 * headers, body / status line, headers), each annotated by the authored band text.
 * Interaction: two independent selectors — the method changes the start line and the
 * safety/idempotency/cacheability flags; the status family changes the response line
 * and its meaning. This is a property table in message shape, not a timeline.
 */
export function HttpMessageAnatomyVisual({ topic, data }: { topic: Topic; data: Data }) {
  const [method, setMethod] = useState<Method>('GET');
  const [family, setFamily] = useState<Family>('2xx');
  const facts = METHOD_FACTS[method];

  const annotation = (band: Data['bands'][number]['band']) =>
    data.bands.find((entry) => entry.band === band)?.text ?? '';

  return (
    <Stage>
      <VisualCaption topic={topic} />

      <div className="grid flex-grow grid-cols-1 gap-6 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ---------------- request anatomy ---------------- */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Micro className="text-cyan-400/60">REQUEST</Micro>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(METHOD_FACTS) as Method[]).map((verb) => (
                <TerminalButton
                  key={verb}
                  active={verb === method}
                  onClick={() => setMethod(verb)}
                  className="px-2 py-1"
                >
                  {verb}
                </TerminalButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-2 border-cyan-400/20">
            <Band
              label="START_LINE"
              value={START_LINES[method]}
              note={annotation('start-line')}
              emphasis
            />
            <Band
              label="HEADERS"
              value={'Host: api.example\nAccept: application/json'}
              note={annotation('headers')}
            />
            <Band label="BODY" value={BODIES[method]} note={annotation('body')} muted />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Flag on={facts.safe} label="SAFE" />
            <Flag on={facts.idempotent} label="IDEMPOTENT" />
            <Flag on={facts.cacheable} label="CACHEABLE" />
          </div>
        </div>

        {/* ---------------- response anatomy ---------------- */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Micro className="text-cyan-400/60">RESPONSE</Micro>
            <div className="flex gap-1">
              {(Object.keys(STATUS_FAMILIES) as Family[]).map((key) => (
                <TerminalButton
                  key={key}
                  active={key === family}
                  onClick={() => setFamily(key)}
                  className="px-2 py-1"
                >
                  {key}
                </TerminalButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-2 border-cyan-400/10">
            <Band
              label="STATUS_LINE"
              value={STATUS_FAMILIES[family]}
              note={annotation('status')}
              emphasis={family === '2xx'}
              tone={family === '2xx' ? 'ok' : family === '4xx' ? 'warn' : 'error'}
            />
            <Band
              label="HEADERS"
              value={'Content-Type: application/json\nCache-Control: <directives>'}
              note={
                facts.cacheable
                  ? 'this method is cacheable, so the directives here actually matter'
                  : 'this method is not cacheable: intermediaries store nothing'
              }
            />
            <div className="flex items-start gap-2 border-t border-cyan-400/10 px-4 py-3">
              {family === '2xx' ? (
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
              )}
              <span className="font-mono text-[10px] lowercase leading-relaxed text-cyan-400/50">
                {FAMILY_MEANING[family]}
              </span>
            </div>
          </div>

          <Panel className="mt-auto">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-3.5 w-3.5 text-cyan-400/40" />
              <Micro>RETRY_READS_THE_STATUS</Micro>
            </div>
            <p className="mt-2 font-mono text-[10px] lowercase leading-relaxed text-cyan-400/40">
              {facts.idempotent
                ? `${method} is idempotent: a client may repeat it after a timeout without changing the outcome`
                : `${method} is not idempotent: a blind retry after a timeout may apply the change twice`}
            </p>
          </Panel>
        </div>
      </div>
    </Stage>
  );
}

function Band({
  label,
  value,
  note,
  emphasis,
  muted,
  tone = 'ok',
}: {
  label: string;
  value: string;
  note: string;
  emphasis?: boolean;
  muted?: boolean;
  tone?: 'ok' | 'warn' | 'error';
}) {
  return (
    <div className="border-b border-cyan-400/10 px-4 py-3 last:border-b-0">
      <div className="flex items-baseline gap-3">
        <Micro className="w-20 flex-shrink-0">{label}</Micro>
        <pre
          className={cn(
            'whitespace-pre-wrap font-mono text-[10px] leading-relaxed',
            emphasis
              ? tone === 'warn'
                ? 'text-amber-400/80'
                : tone === 'error'
                  ? 'text-rose-400/80'
                  : 'text-cyan-400/90'
              : muted
                ? 'text-cyan-400/30'
                : 'text-cyan-400/60',
          )}
        >
          {value}
        </pre>
      </div>
      <p className="mt-1 pl-[5.75rem] text-[9px] font-bold uppercase leading-relaxed tracking-[0.12em] text-cyan-400/25">
        {note}
      </p>
    </div>
  );
}
