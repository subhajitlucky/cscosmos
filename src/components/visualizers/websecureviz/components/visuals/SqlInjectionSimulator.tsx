'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Play, RotateCcw, ShieldAlert, Sparkles, Terminal, XCircle } from 'lucide-react';

export function SqlInjectionSimulator() {
  const [inputVal, setInputVal] = useState<string>("' OR '1'='1");
  const [useParameterized, setUseParameterized] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Enter input and click 'Execute Query'");

  const runQuery = () => {
    if (!useParameterized) {
      if (inputVal.includes("' OR '1'='1") || inputVal.includes("OR 1=1") || inputVal.includes("--")) {
        setQueryResult("⚠️ [LEAKED ACCOUNTS]: admin (hash: $2b$12...), user_alice, user_bob, user_charlie");
        setStatus("💥 SQL INJECTION SUCCESSFUL: String concatenation broke the SQL query grammar and returned ALL database rows!");
      } else {
        setQueryResult("User: " + inputVal + " (Account verified)");
        setStatus("Query executed normally (Vulnerable concatenation).");
      }
    } else {
      setQueryResult("No account found with username: \"" + inputVal + "\"");
      setStatus("🛡️ PROTECTED: Parameterized Prepared Statement treated the payload as literal data, not executable SQL syntax.");
    }
  };

  const reset = () => {
    setInputVal("' OR '1'='1");
    setQueryResult(null);
    setStatus("Enter input and click 'Execute Query'");
  };

  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-rose-600 dark:text-rose-400">
              Interactive Attack Simulator
            </div>
            <h3 className="text-xl font-bold text-foreground">
              SQL Injection (SQLi) vs Parameterized Queries
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold">
          OWASP Top 10 A03
        </span>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-3">
        <button
          onClick={() => setUseParameterized(false)}
          className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
            !useParameterized
              ? 'border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300 shadow-sm'
              : 'border-border opacity-60'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Vulnerable String Concatenation</span>
        </button>

        <button
          onClick={() => setUseParameterized(true)}
          className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
            useParameterized
              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'border-border opacity-60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Prepared Statement (Parameterized)</span>
        </button>
      </div>

      {/* Input Payload & Raw SQL */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            User Input Payload:
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-background border border-border font-mono text-xs text-foreground focus:border-rose-500 outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setInputVal("' OR '1'='1")}
              className="text-[11px] text-blue-500 hover:underline font-mono"
            >
              Preset: Bypass Auth (&#39; OR &#39;1&#39;=&#39;1)
            </button>
            <button
              onClick={() => setInputVal("admin' --")}
              className="text-[11px] text-blue-500 hover:underline font-mono"
            >
              Preset: Comment Out (admin&#39; --)
            </button>
          </div>
        </div>

        {/* Database Query Result Preview */}
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs space-y-2">
          <span className="text-slate-400 text-[11px]">Constructed Database Query:</span>
          <pre className="text-rose-300 overflow-x-auto whitespace-pre-wrap">
            {!useParameterized
              ? `SELECT * FROM users WHERE username = '${inputVal}';`
              : `SELECT * FROM users WHERE username = $1; [param: "${inputVal}"]`}
          </pre>
        </div>
      </div>

      {/* Result Status Log */}
      <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-1">
        <div className="text-amber-400 font-bold">Execution Output:</div>
        <div>{status}</div>
        {queryResult && <div className="text-emerald-400 font-bold pt-1">{queryResult}</div>}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 pt-2 border-t border-rose-500/20">
        <button
          onClick={runQuery}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Execute Database Query</span>
        </button>

        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
