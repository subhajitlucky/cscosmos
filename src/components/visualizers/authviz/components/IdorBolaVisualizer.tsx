'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';

interface InvoiceRecord {
  id: number;
  ownerUser: string;
  orgId: string;
  title: string;
  amount: string;
  confidential: boolean;
}

const INVOICE_DATABASE: InvoiceRecord[] = [
  {
    id: 101,
    ownerUser: 'alice@cosmos.io',
    orgId: 'org_acme',
    title: 'Acme Corp Q3 Cloud Compute Invoice',
    amount: '$4,250.00',
    confidential: false,
  },
  {
    id: 102,
    ownerUser: 'bob@competitor.io',
    orgId: 'org_globex',
    title: 'Globex Private Acquisition Legal Retainer',
    amount: '$180,000.00',
    confidential: true,
  },
  {
    id: 103,
    ownerUser: 'carol@vendor.io',
    orgId: 'org_apex',
    title: 'Apex Security Penetration Testing Retainer',
    amount: '$32,000.00',
    confidential: true,
  },
];

export function IdorBolaVisualizer() {
  const [currentUser, setCurrentUser] = useState({
    email: 'alice@cosmos.io',
    orgId: 'org_acme',
  });
  const [targetId, setTargetId] = useState<number>(102);
  const [defenseEnabled, setDefenseEnabled] = useState<boolean>(true);
  const [responseStatus, setResponseStatus] = useState<'idle' | 'authorized' | 'breached' | 'denied'>('idle');

  const handleTestRequest = () => {
    const record = INVOICE_DATABASE.find((i) => i.id === targetId);

    if (!defenseEnabled) {
      // Vulnerable IDOR behavior: returns object without checking ownership/tenant
      if (record) {
        if (record.orgId !== currentUser.orgId) {
          setResponseStatus('breached');
        } else {
          setResponseStatus('authorized');
        }
      } else {
        setResponseStatus('denied');
      }
    } else {
      // Secure behavior: queries strictly with tenant & owner boundaries
      if (record && record.orgId === currentUser.orgId) {
        setResponseStatus('authorized');
      } else {
        setResponseStatus('denied');
      }
    }
  };

  const activeRecord = INVOICE_DATABASE.find((i) => i.id === targetId);

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Station 07 · Access Control
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              OWASP API #1 BOLA / IDOR
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            IDOR &amp; Object-Level Authorization Lab
          </h3>
          <p className="text-xs text-muted-foreground">
            Simulate ID tampering against multi-tenant object boundaries and observe how database tenant scoping neutralizes BOLA.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetId(102);
            setDefenseEnabled(true);
            setResponseStatus('idle');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* Security Mode Toggle Bar */}
      <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="text-xs font-bold text-foreground">
            Backend Authorization Mode:
          </div>
          <p className="text-xs text-muted-foreground">
            {defenseEnabled
              ? 'Secure: Multi-tenant boundary enforced (WHERE id = ? AND org_id = ?)'
              : 'Vulnerable: Direct reference lookup (WHERE id = ?)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDefenseEnabled(false);
              setResponseStatus('idle');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !defenseEnabled
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            Vulnerable Endpoint
          </button>
          <button
            onClick={() => {
              setDefenseEnabled(true);
              setResponseStatus('idle');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              defenseEnabled
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            Secure Endpoint (OWASP)
          </button>
        </div>
      </div>

      {/* Main Grid: Request Tester + Response Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Request Construction */}
        <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-4">
          <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Client Request (CosmosApp)</span>
            <span className="text-[10px] font-mono text-muted-foreground">
              User: {currentUser.email} ({currentUser.orgId})
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[11px] text-muted-foreground font-semibold block mb-1">
                Select Target Invoice ID to Request:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {INVOICE_DATABASE.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setTargetId(inv.id);
                      setResponseStatus('idle');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      targetId === inv.id
                        ? 'border-emerald-500 bg-emerald-500/10 font-bold text-foreground'
                        : 'border-border/70 bg-card hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <div className="text-xs">ID: {inv.id}</div>
                    <div className="text-[9px] truncate text-slate-500">{inv.orgId}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
              <div className="text-muted-foreground text-[11px]">HTTP Request:</div>
              <div className="text-foreground font-bold">
                GET /api/v1/invoices/{targetId}
              </div>
              <div className="text-slate-500 text-[10px]">
                Authorization: Bearer jwt_alice_acmecorp
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                SQL Query Executed by Server:
              </div>
              <pre className="text-[11px] text-emerald-400 font-mono whitespace-pre-wrap">
                {defenseEnabled
                  ? `SELECT * FROM invoices \nWHERE id = ${targetId} \n  AND org_id = '${currentUser.orgId}';`
                  : `SELECT * FROM invoices \nWHERE id = ${targetId}; -- NO TENANT CHECK!`}
              </pre>
            </div>
          </div>

          <button
            onClick={handleTestRequest}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Send HTTP Request
          </button>
        </div>

        {/* Right: Response & Exploit Outcome */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Server Response</span>
            {responseStatus !== 'idle' && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  responseStatus === 'breached'
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    : responseStatus === 'authorized'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-foreground'
                }`}
              >
                {responseStatus === 'breached'
                  ? '200 OK · BOLA BREACH!'
                  : responseStatus === 'authorized'
                  ? '200 OK · AUTHORIZED'
                  : '404 NOT FOUND / 403 FORBIDDEN'}
              </span>
            )}
          </div>

          {responseStatus === 'idle' && (
            <div className="p-8 text-center text-muted-foreground text-xs border border-dashed border-border rounded-xl">
              Click &quot;Send HTTP Request&quot; to test whether Alice can access Bob&apos;s confidential invoice #{targetId}.
            </div>
          )}

          {responseStatus === 'breached' && activeRecord && (
            <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Critical Vulnerability: BOLA / IDOR Exploited!</span>
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                Alice (Acme Corp) was able to read Bob&apos;s invoice ({activeRecord.orgId}) simply by guessing or tampering with the numeric ID in the URL.
              </p>
              <div className="p-3 rounded-lg bg-card border border-rose-500/30 text-xs font-mono space-y-1">
                <div className="text-foreground font-bold">{activeRecord.title}</div>
                <div className="text-rose-500 font-extrabold">{activeRecord.amount}</div>
                <div className="text-slate-500 text-[10px]">Owner: {activeRecord.ownerUser}</div>
              </div>
            </div>
          )}

          {responseStatus === 'denied' && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Access Denied · Boundary Enforced</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                The database query scoped by `org_id = &apos;org_acme&apos;` returned 0 rows. The API safely responds with `404 Not Found` to prevent resource enumeration.
              </p>
            </div>
          )}

          {responseStatus === 'authorized' && activeRecord && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Legitimate Access Granted</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Alice requested her own invoice #{activeRecord.id}. The tenant boundary check matched her organization (`org_acme`).
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg border border-border/80 bg-muted/20 text-xs space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> OWASP Key Defense:
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Never rely on authentication tokens alone to authorize object access. Every database query must append the current user ID or organization ID to enforce data boundaries at the SQL/ORM layer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
