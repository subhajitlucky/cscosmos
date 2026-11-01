'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Eye, MousePointerClick, AlertOctagon } from 'lucide-react';

export function ClickjackingVisual() {
  const [opacity, setOpacity] = useState(25); // 0 to 100
  const [defenseMode, setDefenseMode] = useState<'none' | 'xfo' | 'csp'>('none');
  const [clickCount, setClickCount] = useState(0);
  const [exploited, setExploited] = useState(false);

  const handleClick = () => {
    if (defenseMode === 'none') {
      setExploited(true);
      setClickCount((c) => c + 1);
    }
  };

  const isBlocked = defenseMode !== 'none';

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-4xl mx-auto shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <MousePointerClick className="h-5 w-5 text-red-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Interactive Clickjacking & UI Redressing Sandbox
          </span>
        </div>
        <div className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md text-foreground">
          CWE-1021
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Defense Policy Selector */}
        <div className="bg-background border border-border/80 rounded-lg p-3 space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Target Server Framing Defense:</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                setDefenseMode('none');
                setExploited(false);
              }}
              className={`text-xs py-1.5 px-2 rounded font-medium transition-colors ${
                defenseMode === 'none'
                  ? 'bg-rose-500 text-white font-semibold'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              Vulnerable
            </button>
            <button
              onClick={() => {
                setDefenseMode('xfo');
                setExploited(false);
              }}
              className={`text-xs py-1.5 px-2 rounded font-medium transition-colors ${
                defenseMode === 'xfo'
                  ? 'bg-foreground text-background font-semibold'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              X-Frame-Options
            </button>
            <button
              onClick={() => {
                setDefenseMode('csp');
                setExploited(false);
              }}
              className={`text-xs py-1.5 px-2 rounded font-medium transition-colors ${
                defenseMode === 'csp'
                  ? 'bg-foreground text-background font-semibold'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              CSP frame-ancestors
            </button>
          </div>
          <div className="font-mono text-[11px] text-muted-foreground truncate pt-0.5">
            {defenseMode === 'none' && '// No framing headers sent (default vulnerable)'}
            {defenseMode === 'xfo' && 'X-Frame-Options: DENY'}
            {defenseMode === 'csp' && "Content-Security-Policy: frame-ancestors 'none';"}
          </div>
        </div>

        {/* Opacity Slider */}
        <div className="bg-background border border-border/80 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Target Iframe Opacity:</span>
            </span>
            <span className="font-mono text-red-500 font-bold">{opacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full accent-red-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0% (Invisible to victim)</span>
            <span>100% (Fully visible target)</span>
          </div>
        </div>
      </div>

      {/* Visual Simulation Canvas */}
      <div className="relative border-2 border-dashed border-border rounded-xl p-6 bg-slate-900 overflow-hidden min-h-[300px] flex items-center justify-center select-none">
        {/* Attacker Decoy Layer (Visible to victim) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <div className="space-y-3 max-w-sm">
            <div className="inline-block bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
              🎉 Congratulations!
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Claim Your Free $500 Gift Card!
            </h3>
            <p className="text-xs text-slate-300">
              Click the button below to instantly deposit your bonus reward.
            </p>
            <div className="pt-2">
              <button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl shadow-lg border border-amber-300 transform transition-transform">
                Claim Reward Now &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Target Embedded Iframe Layer */}
        {isBlocked ? (
          <div className="absolute inset-4 rounded-xl border border-red-500/40 bg-zinc-950/90 z-20 flex flex-col items-center justify-center p-6 text-center text-foreground gap-3">
            <ShieldCheck className="h-10 w-10 text-emerald-500" />
            <div className="font-bold text-sm text-foreground">
              Framing Blocked by Browser
            </div>
            <p className="font-mono text-xs text-rose-400 max-w-md bg-rose-950/40 border border-rose-900/60 p-2.5 rounded-md">
              Refused to display &#39;https://bank.com/transfer&#39; in a frame because it set &#39;
              {defenseMode === 'xfo' ? 'X-Frame-Options: DENY' : "frame-ancestors 'none'"}
              &#39;.
            </p>
          </div>
        ) : (
          <div
            onClick={handleClick}
            style={{ opacity: opacity / 100 }}
            className="absolute inset-6 rounded-xl border-2 border-red-500 bg-white dark:bg-zinc-900 z-20 flex flex-col justify-between p-6 cursor-pointer shadow-2xl transition-opacity duration-150"
          >
            <div className="flex items-center justify-between border-b border-border pb-2 text-xs font-mono">
              <span className="font-bold text-blue-600 dark:text-blue-400">bank.com/transfer</span>
              <span className="text-emerald-500 font-semibold">Authenticated Session</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Transfer Funds</span>
              <button
                type="button"
                className="bg-red-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-red-700 pointer-events-auto"
              >
                Confirm Wire Transfer ($5,000)
              </button>
            </div>

            <div className="text-[10px] text-center text-muted-foreground">
              Target Sensitive Action Form
            </div>
          </div>
        )}
      </div>

      {/* Exploit Status Alert */}
      {exploited && !isBlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 flex items-start gap-3"
        >
          <AlertOctagon className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
              CLICKJACKING ATTACK SUCCESSFUL! (Clicked {clickCount} time{clickCount > 1 ? 's' : ''})
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              The victim believed they clicked &quot;Claim Reward Now&quot; on the decoy site, but the browser
              routed the physical mouse coordinate into the invisible iframe beneath, silently executing
              a wire transfer of $5,000 in the victim&#39;s bank session!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
