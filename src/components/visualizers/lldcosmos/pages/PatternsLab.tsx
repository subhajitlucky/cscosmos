'use client';

import React, { useState } from 'react';
import { Cpu, Play, RotateCcw, Zap, CheckCircle2, ShieldCheck, Coffee, ShoppingCart, Activity } from 'lucide-react';

export function PatternsLab() {
  const [activePattern, setActivePattern] = useState<'strategy' | 'decorator' | 'observer'>('strategy');

  // Strategy State (Shopping Cart)
  const [subtotal, setSubtotal] = useState<number>(100);
  const [strategy, setStrategy] = useState<'NONE' | 'FLAT10' | 'BOGO' | 'VIP25'>('FLAT10');

  // Decorator State (Coffee Builder)
  const [addons, setAddons] = useState<{ [id: string]: boolean }>({
    milk: true,
    caramel: false,
    cream: true,
  });

  // Observer State (Stock Ticker)
  const [stockPrice, setStockPrice] = useState<number>(150);
  const [tickerLogs, setTickerLogs] = useState<string[]>([
    'WidgetA: Subscribed to NASDAQ:COSMOS',
    'WidgetB: Subscribed to NASDAQ:COSMOS',
    'AuditLogger: Subscribed to NASDAQ:COSMOS',
  ]);

  // Calculations
  const calculateTotal = () => {
    if (strategy === 'FLAT10') return subtotal * 0.9;
    if (strategy === 'BOGO') return subtotal * 0.5;
    if (strategy === 'VIP25') return subtotal * 0.75;
    return subtotal;
  };

  const calculateCoffee = () => {
    let cost = 3.0; // Base Espresso
    let desc = 'Base Espresso ($3.00)';
    if (addons.milk) { cost += 0.75; desc += ' + Steamed Milk ($0.75)'; }
    if (addons.caramel) { cost += 0.50; desc += ' + Caramel Drizzle ($0.50)'; }
    if (addons.cream) { cost += 0.60; desc += ' + Whipped Cream ($0.60)'; }
    return { cost: cost.toFixed(2), desc };
  };

  const updateStock = (delta: number) => {
    const newPrice = Math.max(10, stockPrice + delta);
    setStockPrice(newPrice);
    setTickerLogs(prev => [
      `[BROADCAST] NASDAQ:COSMOS price updated to $${newPrice}`,
      `-> WidgetA notified: $${newPrice} (${delta > 0 ? '+▲' : '-▼'})`,
      `-> WidgetB notified: $${newPrice}`,
      ...prev.slice(0, 4)
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--lld-purple)]/30 bg-[var(--lld-purple)]/10 text-[var(--lld-purple)] text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" /> Gang of Four (GoF) Interactive Studio
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--lld-text)]">
          Design Pattern <span className="text-[var(--lld-primary)] lld-glow">Interactive Lab</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--lld-muted)] max-w-2xl leading-relaxed">
          Test runtime behavioral and structural patterns in action: Strategy discounts, Decorator coffee wrappers, and Observer event broadcasters.
        </p>
      </div>

      {/* Pattern Selector */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        {[
          ['strategy', '1. Strategy Pattern (Discount Engine)'],
          ['decorator', '2. Decorator Pattern (Coffee Builder)'],
          ['observer', '3. Observer Pattern (Stock Broadcaster)'],
        ].map(([pId, label]) => (
          <button
            key={pId}
            onClick={() => setActivePattern(pId as 'strategy' | 'decorator' | 'observer')}
            className={`px-4 py-2.5 rounded-lg transition-all ${
              activePattern === pId
                ? 'bg-[var(--lld-primary)] text-white font-bold shadow-md'
                : 'border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] text-[var(--lld-muted)] hover:text-[var(--lld-text)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Studio Grid */}
      <div className="rounded-2xl border border-[var(--lld-border)] bg-[var(--lld-surface)] p-8 shadow-2xl font-mono text-xs space-y-8">
        {/* STRATEGY PATTERN */}
        {activePattern === 'strategy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-[var(--lld-primary)] font-bold uppercase tracking-wider text-[10px]">
                Strategy Pattern: Interchangeable Pricing Algorithms
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--lld-text)]">
                Shopping Cart Checkout Context
              </h3>
              <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
                The <code>ShoppingCart</code> context delegates calculation to an <code>IDiscountStrategy</code> interface without hardcoded if/else statements.
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-[var(--lld-muted)]">Select Concrete Strategy:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['NONE', 'No Discount (100%)'],
                    ['FLAT10', 'Flat 10% Off'],
                    ['BOGO', 'Buy 1 Get 1 (50% Off)'],
                    ['VIP25', 'VIP Club (25% Off)'],
                  ].map(([sId, label]) => (
                    <button
                      key={sId}
                      onClick={() => setStrategy(sId as 'NONE' | 'FLAT10' | 'BOGO' | 'VIP25')}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        strategy === sId
                          ? 'border-[var(--lld-primary)] bg-[var(--lld-primary)]/15 text-white font-bold'
                          : 'border-[var(--lld-border-subtle)] bg-[var(--lld-bg)] text-[var(--lld-muted)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-[var(--lld-bg)] border border-[var(--lld-border-subtle)] space-y-4 text-center">
              <span className="text-[10px] text-[var(--lld-muted)] uppercase tracking-wider">Computed Cart Total</span>
              <div className="text-4xl font-bold text-emerald-400 font-display">
                ${calculateTotal().toFixed(2)}
              </div>
              <p className="text-[10px] text-[var(--lld-muted)]">
                Base Subtotal: $100.00 &bull; Applied Strategy: <code>{strategy}DiscountStrategy</code>
              </p>
            </div>
          </div>
        )}

        {/* DECORATOR PATTERN */}
        {activePattern === 'decorator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-[var(--lld-primary)] font-bold uppercase tracking-wider text-[10px]">
                Decorator Pattern: Dynamic Object Wrapping
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--lld-text)]">
                Coffee Beverage Customizer
              </h3>
              <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
                Decorators implement <code>ICoffee</code> while wrapping another <code>ICoffee</code> instance, dynamically appending costs and descriptions.
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-[var(--lld-muted)]">Toggle Decorator Wrappers:</span>
                <div className="space-y-2">
                  {[
                    ['milk', 'MilkDecorator (+ $0.75)'],
                    ['caramel', 'CaramelDecorator (+ $0.50)'],
                    ['cream', 'WhippedCreamDecorator (+ $0.60)'],
                  ].map(([addId, label]) => (
                    <button
                      key={addId}
                      onClick={() => setAddons(a => ({ ...a, [addId]: !a[addId] }))}
                      className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                        addons[addId]
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold'
                          : 'border-[var(--lld-border-subtle)] bg-[var(--lld-bg)] text-[var(--lld-muted)]'
                      }`}
                    >
                      <span>{label}</span>
                      <span>{addons[addId] ? '✓ WRAPPED' : '+ ADD'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-[var(--lld-bg)] border border-[var(--lld-border-subtle)] space-y-4 text-center">
              <span className="text-[10px] text-[var(--lld-muted)] uppercase tracking-wider">Final Wrapped Beverage Cost</span>
              <div className="text-4xl font-bold text-[var(--lld-primary)] font-display">
                ${calculateCoffee().cost}
              </div>
              <p className="text-[11px] text-[var(--lld-muted)] leading-relaxed">
                {calculateCoffee().desc}
              </p>
            </div>
          </div>
        )}

        {/* OBSERVER PATTERN */}
        {activePattern === 'observer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-[var(--lld-primary)] font-bold uppercase tracking-wider text-[10px]">
                Observer Pattern: 1-to-Many Pub/Sub Event Broadcast
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--lld-text)]">
                Stock Market Subject &amp; Ticker Observers
              </h3>
              <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
                When the <code>StockSubject</code> updates its price, all registered <code>IObserver</code> widgets receive the new value synchronously.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateStock(5)}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow"
                >
                  + Raise Price (+$5)
                </button>
                <button
                  onClick={() => updateStock(-5)}
                  className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow"
                >
                  - Drop Price (-$5)
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[var(--lld-bg)] border border-[var(--lld-border-subtle)] text-center space-y-1">
                <span className="text-[10px] text-[var(--lld-muted)]">Subject Price (NASDAQ:COSMOS)</span>
                <div className="text-3xl font-bold text-white font-display">${stockPrice}</div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] text-[var(--lld-primary)] uppercase tracking-wider font-bold">
                Observer Notification Log
              </span>
              <div className="p-4 rounded-xl bg-[var(--lld-bg)] border border-[var(--lld-border-subtle)] space-y-1.5 text-[11px] max-h-56 overflow-y-auto">
                {tickerLogs.map((log, idx) => (
                  <div key={idx} className="text-[var(--lld-muted)] leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
