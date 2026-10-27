'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Cog, Cpu, AlertTriangle } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: the learner edits the JSX and reads the emitted JavaScript it desugars into.
 * The transform is a real (small) recursive-descent compiler for the JSX subset this page
 * teaches — tags, attributes, string/expression/boolean props, text, {expressions}, fragments,
 * components and self-closing tags — so editing the source counterfactually changes the output.
 * Nothing is pre-rendered: type a tag, get a _jsx() call.
 */

type Attr = { name: string; value: string };
type AstNode =
  | { kind: 'element'; name: string; attrs: Attr[]; children: AstNode[] }
  | { kind: 'text'; value: string }
  | { kind: 'expr'; value: string };

const pad = (s: string, indent: string) => indent + s.split('\n').join('\n' + indent);

const emit = (node: AstNode): string => {
  if (node.kind === 'text') return JSON.stringify(node.value);
  if (node.kind === 'expr') return node.value;

  const tag = node.name === '' ? '_Fragment' : /^[A-Z]/.test(node.name) ? node.name : JSON.stringify(node.name);
  const entries = node.attrs.map((a) => `${a.name}: ${a.value}`);
  const kids = node.children;

  if (kids.length === 1) {
    entries.push(`children: ${emit(kids[0])}`);
  } else if (kids.length > 1) {
    entries.push('children: [\n' + kids.map((k) => pad(emit(k), '  ')).join(',\n') + '\n]');
  }

  if (entries.length === 0) return `_jsx(${tag}, {})`;
  return `_jsx(${tag}, {\n` + entries.map((e) => pad(e, '  ')).join(',\n') + '\n})';
};

const compile = (source: string) => {
  let i = 0;
  let elements = 0;
  let props = 0;

  const fail = (msg: string) => {
    throw new Error(msg);
  };
  const skipWs = () => {
    while (i < source.length && /\s/.test(source[i])) i++;
  };
  const readName = () => {
    const start = i;
    while (i < source.length && /[A-Za-z0-9_.:-]/.test(source[i])) i++;
    if (i === start) fail('expected a tag or attribute name');
    return source.slice(start, i);
  };
  const readBraced = () => {
    if (source[i] !== '{') fail('expected "{"');
    const start = i + 1;
    let depth = 0;
    while (i < source.length) {
      const ch = source[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          const out = source.slice(start, i);
          i++;
          return out.trim();
        }
      }
      i++;
    }
    return fail('unclosed "{" — every expression needs its closing brace');
  };

  const parseChildren = (): AstNode[] => {
    const kids: AstNode[] = [];
    for (;;) {
      const start = i;
      while (i < source.length && source[i] !== '<' && source[i] !== '{') i++;
      const text = source.slice(start, i).replace(/\s+/g, ' ').trim();
      if (text) kids.push({ kind: 'text', value: text });

      if (i >= source.length) fail('unexpected end of input — a tag is never closed');
      if (source[i] === '<') {
        if (source[i + 1] === '/') return kids; // closing tag of the parent
        kids.push(parseElement());
      } else {
        const expr = readBraced();
        if (expr) kids.push({ kind: 'expr', value: expr });
        else fail('empty {} — remove it or put an expression inside');
      }
    }
  };

  const parseAttrs = () => {
    const attrs: Attr[] = [];
    for (;;) {
      skipWs();
      if (i >= source.length) fail('unexpected end of input inside a tag');
      if (source[i] === '>' || source[i] === '/') return attrs;
      const name = readName();
      skipWs();
      if (source[i] === '=') {
        i++;
        skipWs();
        if (source[i] === '"' || source[i] === "'") {
          const quote = source[i];
          i++;
          const start = i;
          while (i < source.length && source[i] !== quote) i++;
          if (i >= source.length) fail(`unclosed ${quote} in attribute "${name}"`);
          const value = source.slice(start, i);
          i++;
          attrs.push({ name, value: JSON.stringify(value) });
        } else if (source[i] === '{') {
          attrs.push({ name, value: readBraced() });
        } else {
          const start = i;
          while (i < source.length && !/[\s>/]/.test(source[i])) i++;
          attrs.push({ name, value: source.slice(start, i) });
        }
      } else {
        attrs.push({ name, value: 'true' }); // boolean shorthand: <button disabled>
      }
    }
  };

  const parseElement = (): AstNode => {
    elements++;
    i++; // consume "<"
    if (source[i] === '>') {
      i++;
      const children = parseChildren();
      if (!(source[i] === '<' && source[i + 1] === '/')) fail('fragment <> is missing its closing </>');
      i += 2;
      skipWs();
      if (source[i] !== '>') fail('expected ">" to close the fragment');
      i++;
      return { kind: 'element', name: '', attrs: [], children };
    }

    const name = readName();
    const attrs = parseAttrs();
    props += attrs.length;

    if (source[i] === '/') {
      i++;
      skipWs();
      if (source[i] !== '>') fail('expected ">" after "/"');
      i++;
      return { kind: 'element', name, attrs, children: [] };
    }

    skipWs();
    if (source[i] !== '>') fail(`expected ">" after the attributes of <${name}>`);
    i++;
    const children = parseChildren();

    if (!(source[i] === '<' && source[i + 1] === '/')) fail(`<${name}> is missing its closing tag`);
    i += 2;
    skipWs();
    const closing = readName();
    if (closing !== name) fail(`</${closing}> does not match <${name}>`);
    skipWs();
    if (source[i] !== '>') fail(`expected ">" in </${closing}>`);
    i++;
    return { kind: 'element', name, attrs, children };
  };

  skipWs();
  if (source[i] !== '<') fail('JSX starts with "<" — add an opening tag');
  const root = parseElement();
  skipWs();
  if (i < source.length) fail('only one root element is allowed — wrap siblings in a fragment <>…</>');

  return { code: emit(root), elements, props };
};

const PRESETS: { label: string; source: string }[] = [
  { label: 'element', source: '<h1 className="title">Hello</h1>' },
  {
    label: 'component + children',
    source: '<Card title="User">\n  <p>Name: {name}</p>\n  <button disabled>Edit</button>\n</Card>',
  },
  { label: 'fragment', source: '<>\n  <span>Left</span>\n  <span>Right</span>\n</>' },
  { label: 'expression', source: '<ul>\n  {items.map(i => <li key={i}>{i}</li>)}\n</ul>' },
];

export default function JSXCompilationVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [source, setSource] = useState(PRESETS[0].source);

  let code = '';
  let error: string | null = null;
  let elements = 0;
  let props = 0;
  try {
    const result = compile(source);
    code = result.code;
    elements = result.elements;
    props = result.props;
  } catch (e) {
    error = e instanceof Error ? e.message : 'could not parse this JSX';
  }

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <FileCode className="w-3 h-3 text-react" /> The Build Pipeline
      </div>

      <div className="w-full max-w-[740px] flex flex-col gap-2 pt-10">
        {/* ── Presets ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mr-1">
            load
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setSource(p.source)}
              className={cn(
                'px-2 py-0.5 rounded border font-mono text-[9px] transition-colors',
                source === p.source
                  ? 'border-react/50 bg-react/10 text-react'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
          {/* ── Source ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              source JSX · editable
            </div>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              spellCheck={false}
              aria-label="JSX source"
              className="w-full h-[148px] p-2 rounded-lg border border-border bg-muted/30 font-mono text-[10px] leading-relaxed text-foreground outline-none focus:border-react/60 resize-none"
            />
          </div>

          {/* ── Compiler ───────────────────────────────────────────────── */}
          <div className="flex sm:flex-col items-center justify-center gap-1 py-1">
            <motion.div
              animate={isExecuting ? { rotate: 360 } : { rotate: 0 }}
              transition={isExecuting ? { duration: 1.6, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
              className="p-2 bg-react/10 border border-react/30 rounded-full"
            >
              <Cog className={cn('w-5 h-5', isExecuting ? 'text-react' : 'text-muted-foreground')} />
            </motion.div>
            <div className="text-[7px] font-black text-react uppercase tracking-widest">swc</div>
          </div>

          {/* ── Output ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              {error ? (
                <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> parse error
                </span>
              ) : (
                'emitted JavaScript'
              )}
            </div>
            <div className="w-full h-[148px] rounded-lg border border-border bg-muted/30 overflow-auto">
              <pre className="p-2 font-mono text-[10px] leading-relaxed whitespace-pre">
                {error ? (
                  <span className="text-rose-700 dark:text-rose-400">{error}</span>
                ) : (
                  <>
                    <span className="text-muted-foreground/70">
                      {`import { jsx as _jsx } from "react/jsx-runtime";\n\n`}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400">{code}</span>
                  </>
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* ── Stats + lesson ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-1 border-t border-border">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
            <Cpu className={cn('w-3 h-3', isExecuting ? 'text-react' : 'text-muted-foreground')} />
            <span>
              tags <span className="font-black text-foreground">{error ? '—' : elements}</span>
            </span>
            <span className="opacity-40">·</span>
            <span>
              props <span className="font-black text-foreground">{error ? '—' : props}</span>
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground italic leading-snug ml-auto max-w-[430px] text-right">
            Change the tag, drop an attribute, add a second child: the emitted call changes with it.
            JSX is not HTML — it is the argument list of <span className="font-mono not-italic">_jsx()</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
