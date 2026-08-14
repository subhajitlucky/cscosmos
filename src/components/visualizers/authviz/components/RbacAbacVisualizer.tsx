'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, ShieldCheck, Sparkles, UserCheck, XCircle, Zap } from 'lucide-react';

export function RbacAbacVisualizer() {
  const [userRole, setUserRole] = useState<'VIEWER' | 'EDITOR' | 'ADMIN'>('EDITOR');
  const [userDept, setUserDept] = useState<'Marketing' | 'HR' | 'Finance'>('Marketing');
  const [isVpn, setIsVpn] = useState<boolean>(false);

  // RBAC checks only role:
  const rbacAllowed = userRole === 'EDITOR' || userRole === 'ADMIN';

  // ABAC checks role AND department match AND VPN security posture:
  const abacAllowed = userRole === 'ADMIN' || (userRole === 'EDITOR' && userDept === 'Finance' && isVpn);

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Access Control &amp; Policy Evaluation
            </div>
            <h3 className="text-xl font-bold text-foreground">
              RBAC (Role-Based) vs ABAC (Attribute-Based) Engine
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Target: Confidential Finance Payroll
        </span>
      </div>

      {/* Interactive Attribute Controls */}
      <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
        {/* Role */}
        <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-slate-400 block font-bold">User Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as 'VIEWER' | 'EDITOR' | 'ADMIN')}
            className="w-full p-2 rounded-xl bg-slate-950 text-emerald-400 font-bold border border-border outline-none"
          >
            <option value="VIEWER">VIEWER</option>
            <option value="EDITOR">EDITOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* Department */}
        <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-slate-400 block font-bold">User Department:</span>
          <select
            value={userDept}
            onChange={(e) => setUserDept(e.target.value as 'Marketing' | 'HR' | 'Finance')}
            className="w-full p-2 rounded-xl bg-slate-950 text-emerald-400 font-bold border border-border outline-none"
          >
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {/* Network Posture */}
        <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-slate-400 block font-bold">Connection Security:</span>
          <button
            onClick={() => setIsVpn((prev) => !prev)}
            className={`w-full p-2 rounded-xl border text-center font-bold transition ${
              isVpn
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-950 text-slate-400 border-border'
            }`}
          >
            {isVpn ? '🔒 Corporate VPN (Active)' : '🌐 Public Internet'}
          </button>
        </div>
      </div>

      {/* Side by Side Evaluation Result */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* RBAC */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-bold">1. Simple RBAC Decision:</span>
            <span className={rbacAllowed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {rbacAllowed ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Checks only `role === "EDITOR"`. Ignores department and VPN connection posture.
          </p>
        </div>

        {/* ABAC */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold">2. Fine-Grained ABAC Decision:</span>
            <span className={abacAllowed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {abacAllowed ? 'ALLOWED' : 'DENIED (Protected)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Evaluates: Role ({userRole}) + Dept ({userDept} === Finance) + VPN ({isVpn ? 'true' : 'false'}).
          </p>
        </div>
      </div>
    </div>
  );
}
