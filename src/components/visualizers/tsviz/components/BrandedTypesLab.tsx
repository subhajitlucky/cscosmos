'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, DollarSign, Shield, Sparkles, XCircle } from 'lucide-react';

export function BrandedTypesLab() {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'RawNumber'>('USD');

  const isValid = selectedCurrency === 'USD';

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Nominal Typing in Structural TypeScript
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Branded Types &amp; Unit Safety Simulator
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isValid
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {isValid ? 'Compile Safety: PASSED ✅' : 'Type Mismatch: REJECTED ❌'}
        </span>
      </div>

      {/* Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedCurrency('USD')}
          className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
            selectedCurrency === 'USD'
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md'
              : 'bg-card border-border text-foreground hover:border-amber-500'
          }`}
        >
          <div className="font-bold">Pass: walletUSD (Brand: USD)</div>
          <div className={`text-[10px] ${selectedCurrency === 'USD' ? 'text-slate-900' : 'text-muted-foreground'}`}>
            Type: USD (number &amp; &#123; __brand: &apos;USD&apos; &#125;)
          </div>
        </button>

        <button
          onClick={() => setSelectedCurrency('EUR')}
          className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
            selectedCurrency === 'EUR'
              ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-md'
              : 'bg-card border-border text-foreground hover:border-rose-500'
          }`}
        >
          <div className="font-bold">Pass: walletEUR (Brand: EUR)</div>
          <div className={`text-[10px] ${selectedCurrency === 'EUR' ? 'text-rose-100' : 'text-muted-foreground'}`}>
            Type: EUR (number &amp; &#123; __brand: &apos;EUR&apos; &#125;)
          </div>
        </button>

        <button
          onClick={() => setSelectedCurrency('RawNumber')}
          className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
            selectedCurrency === 'RawNumber'
              ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-md'
              : 'bg-card border-border text-foreground hover:border-rose-500'
          }`}
        >
          <div className="font-bold">Pass: rawAmount (50)</div>
          <div className={`text-[10px] ${selectedCurrency === 'RawNumber' ? 'text-rose-100' : 'text-muted-foreground'}`}>
            Type: number (Unbranded primitive)
          </div>
        </button>
      </div>

      {/* Code Preview & Evaluation */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner space-y-2">
          <span className="text-slate-400 text-[11px] block border-b border-slate-800 pb-1.5">
            Target Checkout Function Contract:
          </span>
          <pre className="text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed py-2">
{`declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B };

type USD = Brand<number, 'USD'>;
type EUR = Brand<number, 'EUR'>;

function chargeUSDCreditCard(amount: USD) {
  console.log(\`Successfully charged $\${amount} USD\`);
}

// Invocations:
${selectedCurrency === 'USD' ? 'chargeUSDCreditCard(walletUSD); // ✅ Compiles perfectly!' : selectedCurrency === 'EUR' ? 'chargeUSDCreditCard(walletEUR); // ❌ TS2345: Type "EUR" not assignable to "USD"' : 'chargeUSDCreditCard(50);        // ❌ TS2345: Type "number" not assignable to "USD"'}`}
          </pre>
        </div>

        {/* Diagnostic Card */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nominal Type Check:
            </span>
            {isValid ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Currency Verified</div>
                <div>The brand tag matches &apos;USD&apos;. Safe to process transaction with 0 currency conversion errors.</div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-xs font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5"><XCircle className="w-4 h-4 text-rose-500" /> Type Error TS2345</div>
                <div>
                  {selectedCurrency === 'EUR'
                    ? 'Refused: EUR currency object cannot be used where USD was contracted.'
                    : 'Refused: Raw unvalidated numbers cannot be spent without explicit currency verification.'}
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border">
            <strong>Why it matters:</strong> Prevents multi-million dollar bugs in banking, aerospace (metric vs imperial units), and database entities (User ID vs Post ID).
          </div>
        </div>
      </div>
    </div>
  );
}
