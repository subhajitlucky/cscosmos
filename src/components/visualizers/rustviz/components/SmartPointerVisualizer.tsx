'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Minus, 
  RotateCcw, 
  Trash2, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export function SmartPointerVisualizer() {
  const [pointerType, setPointerType] = useState<'rc' | 'arc' | 'box' | 'refcell'>('rc');
  const [strongCount, setStrongCount] = useState(2);
  const [weakCount, setWeakCount] = useState(1);
  const [refCellBorrows, setRefCellBorrows] = useState<'unborrowed' | 'shared_1' | 'shared_2' | 'mut_exclusive'>('unborrowed');

  const handleIncrementStrong = () => {
    setStrongCount(strongCount + 1);
  };

  const handleDecrementStrong = () => {
    if (strongCount > 0) {
      setStrongCount(strongCount - 1);
    }
  };

  const handleIncrementWeak = () => {
    setWeakCount(weakCount + 1);
  };

  const handleDecrementWeak = () => {
    if (weakCount > 0) {
      setWeakCount(weakCount - 1);
    }
  };

  const isDeallocated = strongCount === 0;

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rust-border)] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--rust-text)] flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-[var(--rust-primary)]" />
            Smart Pointer Memory &amp; Reference Counter Sandbox
          </h3>
          <p className="text-xs text-[var(--rust-muted)]">
            Simulate heap allocation headers, atomic reference counters (Arc), and dynamic borrow tracking (RefCell).
          </p>
        </div>

        {/* Pointer Type Selector */}
        <div className="flex gap-2">
          {(['rc', 'arc', 'refcell', 'box'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPointerType(type)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                pointerType === type
                  ? 'bg-[var(--rust-primary)] text-white shadow-md'
                  : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] border border-[var(--rust-border)]'
              }`}
            >
              {type === 'rc' && 'Rc<T>'}
              {type === 'arc' && 'Arc<T>'}
              {type === 'refcell' && 'RefCell<T>'}
              {type === 'box' && 'Box<T>'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Controls & Code Sample (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)]">
              Interactive Controls
            </div>

            {pointerType === 'rc' || pointerType === 'arc' ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Strong count controllers */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)]">
                  <div>
                    <div className="font-bold text-[var(--rust-text)]">Strong References (Rc::clone)</div>
                    <div className="text-[10px] text-[var(--rust-muted)]">Active owners holding data</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDecrementStrong}
                      disabled={strongCount === 0}
                      className="h-7 w-7 rounded bg-[var(--rust-bg)] border border-[var(--rust-border)] flex items-center justify-center disabled:opacity-30 hover:border-[var(--rust-primary)]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-bold text-sm text-[var(--rust-primary)] w-4 text-center">{strongCount}</span>
                    <button
                      onClick={handleIncrementStrong}
                      className="h-7 w-7 rounded bg-[var(--rust-bg)] border border-[var(--rust-border)] flex items-center justify-center hover:border-[var(--rust-primary)]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Weak count controllers */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)]">
                  <div>
                    <div className="font-bold text-[var(--rust-text)]">Weak References (Rc::downgrade)</div>
                    <div className="text-[10px] text-[var(--rust-muted)]">Non-owning references</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDecrementWeak}
                      disabled={weakCount === 0}
                      className="h-7 w-7 rounded bg-[var(--rust-bg)] border border-[var(--rust-border)] flex items-center justify-center disabled:opacity-30 hover:border-[var(--rust-primary)]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-bold text-sm text-[var(--rust-cyan)] w-4 text-center">{weakCount}</span>
                    <button
                      onClick={handleIncrementWeak}
                      className="h-7 w-7 rounded bg-[var(--rust-bg)] border border-[var(--rust-border)] flex items-center justify-center hover:border-[var(--rust-primary)]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--rust-primary-light)] border border-[var(--rust-primary-border)] text-xs text-[var(--rust-text)]">
                  {pointerType === 'arc'
                    ? 'Arc<T> uses atomic hardware instructions (fetch_add / fetch_sub) for thread-safe multi-core synchronization.'
                    : 'Rc<T> uses regular integers with zero atomic lock overhead (single-threaded only).'}
                </div>
              </div>
            ) : pointerType === 'refcell' ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="text-[11px] text-[var(--rust-muted)]">Select Active Runtime Borrow State:</div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'unborrowed', label: 'Unborrowed (Count: 0)' },
                    { id: 'shared_1', label: '1 Shared Borrow (cell.borrow())' },
                    { id: 'shared_2', label: '2 Shared Borrows (cell.borrow())' },
                    { id: 'mut_exclusive', label: '1 Mutable Borrow (cell.borrow_mut())' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setRefCellBorrows(item.id as 'unborrowed' | 'shared_1' | 'shared_2' | 'mut_exclusive')}
                      className={`p-2.5 rounded-lg border text-left font-bold transition-all ${
                        refCellBorrows === item.id
                          ? 'bg-[var(--rust-primary)] text-white border-[var(--rust-primary)]'
                          : 'bg-[var(--rust-surface-2)] text-[var(--rust-text)] border-[var(--rust-border)]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)] text-xs font-mono text-[var(--rust-text)] space-y-2">
                <div className="font-bold text-[var(--rust-primary)]">Box&lt;T&gt; Unique Heap Ownership</div>
                <p className="text-[var(--rust-muted)] leading-relaxed">
                  Zero reference counter overhead. A single 8-byte pointer on the stack directly owning the heap allocation. Reclaimed immediately on drop.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setStrongCount(2);
                setWeakCount(1);
                setRefCellBorrows('unborrowed');
              }}
              className="flex items-center space-x-1 text-xs text-[var(--rust-muted)] hover:text-[var(--rust-text)] pt-2"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Right: Visual Heap Header Structure (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)] font-mono">
                Heap Header Layout (0x6080)
              </span>
              <span className="text-[11px] font-mono text-[var(--rust-muted)]">
                {pointerType === 'rc' && 'std::rc::RcBox<T>'}
                {pointerType === 'arc' && 'std::sync::ArcInner<T>'}
                {pointerType === 'refcell' && 'std::cell::RefCell<T>'}
                {pointerType === 'box' && 'Unique<T>'}
              </span>
            </div>

            {/* Visual Box Component */}
            {isDeallocated && (pointerType === 'rc' || pointerType === 'arc') ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-rose-500/50 bg-rose-950/10 space-y-2">
                <Trash2 className="h-8 w-8 text-rose-400 mx-auto" />
                <div className="font-bold text-rose-300 text-sm">Value Dropped &amp; Deallocated!</div>
                <p className="text-xs text-[var(--rust-muted)] max-w-sm mx-auto">
                  Strong reference count reached 0. The inner payload was deterministically dropped by RAII.
                  {weakCount > 0 && ' (Weak pointer handles now upgrade to None).'}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-[var(--rust-primary-border)] bg-[var(--rust-bg)] p-4 space-y-4">
                
                {/* Header Counters Row */}
                {(pointerType === 'rc' || pointerType === 'arc') && (
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-[var(--rust-surface)] border border-[var(--rust-border)] text-center">
                      <div className="text-[10px] uppercase text-[var(--rust-muted)] font-bold">Strong Count</div>
                      <div className="text-2xl font-bold text-[var(--rust-primary)]">{strongCount}</div>
                      <div className="text-[9px] text-[var(--rust-muted)]">{pointerType === 'arc' ? 'AtomicUsize' : 'Cell<usize>'}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-[var(--rust-surface)] border border-[var(--rust-border)] text-center">
                      <div className="text-[10px] uppercase text-[var(--rust-muted)] font-bold">Weak Count</div>
                      <div className="text-2xl font-bold text-[var(--rust-cyan)]">{weakCount}</div>
                      <div className="text-[9px] text-[var(--rust-muted)]">{pointerType === 'arc' ? 'AtomicUsize' : 'Cell<usize>'}</div>
                    </div>
                  </div>
                )}

                {pointerType === 'refcell' && (
                  <div className="p-3 rounded-lg bg-[var(--rust-surface)] border border-[var(--rust-border)] text-center font-mono">
                    <div className="text-[10px] uppercase text-[var(--rust-muted)] font-bold">Borrow Flag (Cell&lt;isize&gt;)</div>
                    <div className={`text-xl font-bold ${
                      refCellBorrows === 'mut_exclusive' ? 'text-rose-400' : refCellBorrows !== 'unborrowed' ? 'text-emerald-400' : 'text-[var(--rust-text)]'
                    }`}>
                      {refCellBorrows === 'unborrowed' && '0 (Unborrowed)'}
                      {refCellBorrows === 'shared_1' && '1 (1 Active Immutable Reader)'}
                      {refCellBorrows === 'shared_2' && '2 (2 Concurrent Immutable Readers)'}
                      {refCellBorrows === 'mut_exclusive' && '-1 (Exclusive Mutable Writer)'}
                    </div>
                  </div>
                )}

                {/* Inner Data Payload */}
                <div className="p-4 rounded-lg bg-[var(--rust-surface)] border border-[var(--rust-border)] space-y-1 text-center font-mono">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--rust-muted)] font-bold">
                    Target Payload (T)
                  </div>
                  <div className="text-base font-bold text-[var(--rust-text)]">
                    &quot;High-Performance Rust Backend Service&quot;
                  </div>
                  <div className="text-[10px] text-[var(--rust-muted)]">Size: 40 bytes on heap</div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
