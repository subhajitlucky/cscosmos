'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, GitCompare, KeyRound, Plus, Trash2, Type } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: the learner mutates a real tree and a real diff is computed.
 * Nothing here is a pre-baked "node 2 lights up" animation — clicking a node and
 * changing its text, class, or inserting/removing a sibling runs an actual
 * reconciliation walk, and the patch list + counter report what React would touch.
 * The "keys" switch changes the algorithm (identity vs index), so inserting a sibling
 * at the head costs one mount with keys and rewrites every sibling without them.
 */

type VNode = { id: string; tag: string; text?: string; className?: string; children?: VNode[] };
type PatchKind = 'text' | 'class' | 'mount' | 'remove';
type Patch = { id: string; kind: PatchKind; detail: string };
type Diff = { visited: number; patches: Patch[] };

const BASE_TREE: VNode = {
  id: 'app',
  tag: 'div',
  children: [
    {
      id: 'header',
      tag: 'header',
      children: [{ id: 'title', tag: 'h1', text: 'Cosmos' }],
    },
    {
      id: 'list',
      tag: 'ul',
      children: [
        { id: 'a', tag: 'li', text: 'Mercury' },
        { id: 'b', tag: 'li', text: 'Venus' },
        { id: 'c', tag: 'li', text: 'Earth' },
      ],
    },
    { id: 'footer', tag: 'footer', text: 'v1.0' },
  ],
};

const TEXT_CYCLE: Record<string, string[]> = {
  li: ['Mercury', 'Venus', 'Earth', 'Mars'],
  h1: ['Cosmos', 'Solar System', 'Universe'],
  footer: ['v1.0', 'v1.1', 'v2.0'],
};

const findNode = (node: VNode, id: string): VNode | null => {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const hit = findNode(child, id);
    if (hit) return hit;
  }
  return null;
};

const updateNode = (node: VNode, id: string, fn: (n: VNode) => VNode): VNode => {
  if (node.id === id) return fn(node);
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => updateNode(c, id, fn)) };
};

const removeNode = (node: VNode, id: string): VNode => ({
  ...node,
  children: (node.children ?? [])
    .filter((c) => c.id !== id)
    .map((c) => removeNode(c, id)),
});

const insertChild = (node: VNode, parentId: string, child: VNode): VNode => {
  if (node.id === parentId) return { ...node, children: [child, ...(node.children ?? [])] };
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => insertChild(c, parentId, child)) };
};

const walkDiff = (prev: VNode, next: VNode, keyed: boolean, diff: Diff) => {
  diff.visited++;
  if ((prev.text ?? '') !== (next.text ?? '')) {
    diff.patches.push({
      id: next.id,
      kind: 'text',
      detail: `<${next.tag}> textContent "${prev.text ?? ''}" → "${next.text ?? ''}"`,
    });
  }
  if ((prev.className ?? '') !== (next.className ?? '')) {
    diff.patches.push({
      id: next.id,
      kind: 'class',
      detail: `<${next.tag}> className "${prev.className ?? ''}" → "${next.className ?? ''}"`,
    });
  }

  const prevKids = prev.children ?? [];
  const nextKids = next.children ?? [];

  if (keyed) {
    const byKey = new Map(prevKids.map((k) => [k.id, k]));
    nextKids.forEach((kid) => {
      const old = byKey.get(kid.id);
      if (!old) {
        diff.visited++;
        diff.patches.push({ id: kid.id, kind: 'mount', detail: `<${kid.tag}> mounted (new key "${kid.id}")` });
        return;
      }
      walkDiff(old, kid, keyed, diff);
    });
    const nextKeys = new Set(nextKids.map((k) => k.id));
    prevKids
      .filter((k) => !nextKeys.has(k.id))
      .forEach((k) => {
        diff.visited++;
        diff.patches.push({ id: k.id, kind: 'remove', detail: `<${k.tag}> unmounted (key "${k.id}" gone)` });
      });
  } else {
    const shared = Math.min(prevKids.length, nextKids.length);
    for (let i = 0; i < shared; i++) walkDiff(prevKids[i], nextKids[i], keyed, diff);
    nextKids.slice(shared).forEach((k) => {
      diff.visited++;
      diff.patches.push({ id: k.id, kind: 'mount', detail: `<${k.tag}> mounted at index ${shared}` });
    });
    prevKids.slice(shared).forEach((k) => {
      diff.visited++;
      diff.patches.push({ id: k.id, kind: 'remove', detail: `<${k.tag}> unmounted from index ${shared}` });
    });
  }
};

/** Diff is derived from the last committed pair, so flipping keys re-costs the same edit. */
const diffTrees = (prev: VNode, next: VNode, keyed: boolean): Diff => {
  const diff: Diff = { visited: 0, patches: [] };
  walkDiff(prev, next, keyed, diff);
  return diff;
};

const KIND_STYLE: Record<PatchKind, string> = {
  text: 'text-amber-700 dark:text-amber-400 border-amber-500/40',
  class: 'text-cyan-700 dark:text-cyan-400 border-cyan-500/40',
  mount: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/40',
  remove: 'text-rose-700 dark:text-rose-400 border-rose-500/40',
};

/** Outline rows (the in-memory object graph) — every row is selectable. */
const OutlineNode = ({
  node,
  depth,
  selectedId,
  patchedIds,
  onSelect,
}: {
  node: VNode;
  depth: number;
  selectedId: string;
  patchedIds: Set<string>;
  onSelect: (id: string) => void;
}) => (
  <div className="flex flex-col gap-1">
    <button
      onClick={() => onSelect(node.id)}
      style={{ marginLeft: depth * 12 }}
      className={cn(
        'text-left px-1.5 py-0.5 rounded border font-mono text-[9px] transition-colors',
        node.id === selectedId
          ? 'border-react bg-react/10 text-foreground'
          : patchedIds.has(node.id)
            ? 'border-amber-500/40 bg-amber-500/5 text-foreground'
            : 'border-transparent text-muted-foreground hover:border-border'
      )}
    >
      <span className="text-react">&lt;{node.tag}&gt;</span>
      {node.text && <span className="text-foreground"> {node.text}</span>}
      {node.className && <span className="text-emerald-700 dark:text-emerald-400"> .{node.className}</span>}
    </button>
    {(node.children ?? []).map((child) => (
      <OutlineNode
        key={child.id}
        node={child}
        depth={depth + 1}
        selectedId={selectedId}
        patchedIds={patchedIds}
        onSelect={onSelect}
      />
    ))}
  </div>
);

/** Nested boxes (what the browser actually holds). */
const DomBox = ({ node, patchedIds }: { node: VNode; patchedIds: Set<string> }) => {
  const patched = patchedIds.has(node.id);
  return (
    <div
      className={cn(
        'rounded border px-1.5 py-1 font-mono text-[8px] leading-tight transition-colors',
        patched ? 'border-react/60 bg-react/10' : 'border-border/60 bg-muted/10'
      )}
    >
      <span className={cn(patched ? 'text-react' : 'text-muted-foreground')}>&lt;{node.tag}&gt;</span>
      {node.text && <span className="text-foreground"> {node.text}</span>}
      {node.className && <span className="text-emerald-700 dark:text-emerald-400"> .{node.className}</span>}
      {(node.children ?? []).length > 0 && (
        <div className="flex flex-col gap-1 mt-1 pl-2 border-l border-border/50">
          {(node.children ?? []).map((child) => (
            <DomBox key={child.id} node={child} patchedIds={patchedIds} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function VirtualDOMVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [prevTree, setPrevTree] = useState<VNode>(BASE_TREE);
  const [tree, setTree] = useState<VNode>(BASE_TREE);
  const [selectedId, setSelectedId] = useState('b');
  const [keyed, setKeyed] = useState(true);
  const [mounted, setMounted] = useState(0);

  const diff = diffTrees(prevTree, tree, keyed);
  const selected = findNode(tree, selectedId) ?? tree;
  const listExists = !!findNode(tree, 'list');
  const cycle = TEXT_CYCLE[selected.tag];
  const patchedIds = new Set(diff.patches.map((p) => p.id));

  const commit = (next: VNode, nextSelected = selectedId) => {
    setPrevTree(tree);
    setTree(next);
    setSelectedId(findNode(next, nextSelected) ? nextSelected : 'app');
  };

  const cycleText = () => {
    if (!cycle) return;
    const next = cycle[(cycle.indexOf(selected.text ?? '') + 1) % cycle.length];
    commit(updateNode(tree, selected.id, (n) => ({ ...n, text: next })));
  };

  const toggleClass = () => {
    commit(updateNode(tree, selected.id, (n) => ({ ...n, className: n.className ? undefined : 'hot' })));
  };

  const mountSibling = () => {
    if (!listExists) return;
    const id = `n${mounted + 1}`;
    commit(insertChild(tree, 'list', { id, tag: 'li', text: 'Mars' }), id);
    setMounted((n) => n + 1);
  };

  const unmountSelected = () => {
    if (selected.id === 'app') return;
    commit(removeNode(tree, selected.id), 'app');
  };

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Layers className="w-3 h-3 text-react" /> VDOM Diffing Engine
      </div>

      <div className="w-full max-w-[720px] flex flex-col gap-3 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
          {/* ── Memory: the tree you can edit ─────────────────────────────── */}
          <div className="rounded-xl border border-react/30 bg-react/5 p-2.5 min-w-0">
            <div className="text-[9px] font-black uppercase tracking-widest text-react mb-2 px-1">
              Virtual DOM · click a node
            </div>
            <div className="max-h-[176px] overflow-auto pr-1">
              <OutlineNode
                node={tree}
                depth={0}
                selectedId={selectedId}
                patchedIds={patchedIds}
                onSelect={setSelectedId}
              />
            </div>
          </div>

          <div className="flex sm:flex-col items-center justify-center gap-1">
            <GitCompare
              className={cn('w-4 h-4', isExecuting ? 'text-react animate-pulse' : 'text-muted-foreground')}
            />
            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">
              diff
            </span>
          </div>

          {/* ── Browser: only patched nodes are touched ───────────────────── */}
          <div className="rounded-xl border border-border bg-muted/20 p-2.5 min-w-0">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-1">
              Real DOM · browser
            </div>
            <div className="max-h-[176px] overflow-auto pr-1">
              <DomBox node={tree} patchedIds={patchedIds} />
            </div>
          </div>
        </div>

        {/* ── Mutations ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mr-1">
            mutate
          </span>
          <button
            onClick={cycleText}
            disabled={!cycle}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md border font-mono text-[10px] transition-colors',
              cycle
                ? 'border-border bg-card text-foreground hover:border-amber-500/50'
                : 'border-border text-muted-foreground/40 cursor-not-allowed'
            )}
            title={cycle ? `cycle .textContent of <${selected.tag}>` : 'select a text node (li, h1, footer)'}
          >
            <Type className="w-3 h-3" /> textContent
          </button>
          <button
            onClick={toggleClass}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-card font-mono text-[10px] text-foreground hover:border-cyan-500/50 transition-colors"
          >
            className {selected.className ? '− hot' : '+ hot'}
          </button>
          <button
            onClick={mountSibling}
            disabled={!listExists}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md border font-mono text-[10px] transition-colors',
              listExists
                ? 'border-border bg-card text-foreground hover:border-emerald-500/50'
                : 'border-border text-muted-foreground/40 cursor-not-allowed'
            )}
          >
            <Plus className="w-3 h-3" /> &lt;li&gt; at head
          </button>
          <button
            onClick={unmountSelected}
            disabled={selected.id === 'app'}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md border font-mono text-[10px] transition-colors',
              selected.id !== 'app'
                ? 'border-border bg-card text-foreground hover:border-rose-500/50'
                : 'border-border text-muted-foreground/40 cursor-not-allowed'
            )}
          >
            <Trash2 className="w-3 h-3" /> unmount selected
          </button>

          <button
            onClick={() => setKeyed((k) => !k)}
            className={cn(
              'ml-auto flex items-center gap-1.5 px-2 py-1 rounded-md border font-mono text-[10px] transition-colors',
              keyed
                ? 'border-react/50 bg-react/10 text-react'
                : 'border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-400'
            )}
            title="Match children by key (identity) or by index"
          >
            <KeyRound className="w-3 h-3" /> key=&#123;id&#125; {keyed ? 'on' : 'off'}
          </button>
        </div>

        {/* ── The computed diff ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
          <div className="rounded-lg border border-border bg-card p-2 max-h-[84px] overflow-auto">
            {diff.patches.length === 0 ? (
              <div className="text-[10px] font-mono text-muted-foreground italic px-1">
                no mutations yet — the trees are identical, so a render would write nothing.
              </div>
            ) : (
              <ul className="space-y-1">
                {diff.patches.map((p, i) => (
                  <motion.li
                    key={`${p.id}-${p.kind}-${i}`}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-1.5 font-mono text-[9px] leading-tight"
                  >
                    <span
                      className={cn(
                        'shrink-0 px-1 rounded border text-[8px] font-black uppercase',
                        KIND_STYLE[p.kind]
                      )}
                    >
                      {p.kind}
                    </span>
                    <span className="text-muted-foreground break-all">{p.detail}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-center gap-2 font-mono text-[10px] px-1">
            <div>
              <span className="text-muted-foreground">walked </span>
              <span className="font-black text-foreground">{diff.visited}</span>
            </div>
            <div>
              <span className="text-muted-foreground">writes </span>
              <span className={cn('font-black', diff.patches.length ? 'text-react' : 'text-foreground')}>
                {diff.patches.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
