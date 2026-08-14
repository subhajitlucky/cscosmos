'use client';

import React, { useState } from 'react';
import { ArrowRight, Cpu, Layers, Network, Server, ShieldCheck, Sparkles, Zap } from 'lucide-react';

type CniType = 'flannel-vxlan' | 'calico-bgp' | 'cilium-ebpf';

export function CniPacketFlowVisualizer() {
  const [cni, setCni] = useState<CniType>('cilium-ebpf');

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Container Network Interface (CNI)
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Cross-Node Pod Networking: Flannel vs Calico vs Cilium eBPF
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          {cni === 'cilium-ebpf' ? '⚡ eBPF Socket Bypass (Wire Speed)' : cni === 'calico-bgp' ? 'Layer-3 BGP Routing' : 'UDP Overlay (Port 8472)'}
        </span>
      </div>

      {/* CNI Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'flannel-vxlan' as const, name: '1. Flannel (VXLAN)', sub: 'Encapsulates packets in UDP tunnel (Port 8472)', speed: '50-byte header overhead' },
          { id: 'calico-bgp' as const, name: '2. Calico (BGP)', sub: 'Direct Layer-3 routing across nodes without overlay', speed: 'Native wire speed' },
          { id: 'cilium-ebpf' as const, name: '3. Cilium (eBPF)', sub: 'Bypasses iptables & TCP stack at Linux kernel sockets', speed: 'Ultra-Low Latency (Fastest)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCni(item.id)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              cni === item.id
                ? 'bg-sky-600 text-white shadow-md border-sky-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-sky-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${cni === item.id ? 'text-sky-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
            <div className={`text-[10px] pt-1 font-bold ${cni === item.id ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {item.speed}
            </div>
          </button>
        ))}
      </div>

      {/* Packet Route Animation Across 2 Worker Nodes */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Cross-Node Journey: Pod A (10.244.1.5) ➔ Pod B (10.244.2.8)</span>
          <span className="text-sky-400 font-bold uppercase">{cni}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Worker Node 1 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-sky-400 font-bold block">Worker Node 1 (192.168.1.10)</span>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
              <div>• Source: Pod A (IP: 10.244.1.5)</div>
              <div>• Packet egresses container via veth0 pair</div>
              {cni === 'flannel-vxlan' && <div className="text-amber-400">• flannel.1 device wraps packet in VXLAN UDP (port 8472)</div>}
              {cni === 'calico-bgp' && <div className="text-emerald-400">• Kernel routes packet directly via BGP route table</div>}
              {cni === 'cilium-ebpf' && <div className="text-emerald-300 font-bold">• eBPF program hooks socket buffer directly in kernel space!</div>}
            </div>
          </div>

          {/* Worker Node 2 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold block">Worker Node 2 (192.168.1.11)</span>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
              <div>• Physical adapter eth0 receives packet</div>
              {cni === 'flannel-vxlan' && <div className="text-amber-400">• flannel.1 decapsulates VXLAN header</div>}
              {cni === 'calico-bgp' && <div className="text-emerald-400">• Packet forwarded directly to target veth interface</div>}
              {cni === 'cilium-ebpf' && <div className="text-emerald-300 font-bold">• eBPF delivers packet directly to Pod socket buffer (0 iptables rules!)</div>}
              <div className="text-emerald-400 font-bold">• Delivered to: Pod B (10.244.2.8) ✅</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
