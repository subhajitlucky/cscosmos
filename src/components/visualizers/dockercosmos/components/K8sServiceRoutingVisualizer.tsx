'use client';

import React, { useState } from 'react';
import { ArrowRight, Globe, Layers, Network, Server, Sparkles, Terminal, Zap } from 'lucide-react';

type ServiceType = 'ClusterIP' | 'NodePort' | 'LoadBalancer';

export function K8sServiceRoutingVisualizer() {
  const [serviceType, setServiceType] = useState<ServiceType>('ClusterIP');
  const [activePod, setActivePod] = useState<number>(1);

  const handleSendPacket = () => {
    setActivePod((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
  };

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Cluster Networking Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Kubernetes Service &amp; kube-proxy Packet Routing
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold">
          Type: {serviceType}
        </span>
      </div>

      {/* Service Type Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'ClusterIP' as const, name: '1. ClusterIP (Default)', sub: 'Internal virtual IP only (10.96.0.42)' },
          { id: 'NodePort' as const, name: '2. NodePort', sub: 'Exposes port 30080 on all node IPs' },
          { id: 'LoadBalancer' as const, name: '3. LoadBalancer', sub: 'Provisions external Cloud LB IP' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setServiceType(item.id)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              serviceType === item.id
                ? 'bg-sky-600 text-white shadow-md border-sky-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-sky-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${serviceType === item.id ? 'text-sky-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Packet Flow Animation Diagram */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Packet Route: Client ➔ {serviceType} ➔ kube-proxy ➔ Target Pod</span>
          <span className="text-sky-400 font-bold">Routed to: Pod #{activePod} (10.244.1.{activePod + 10})</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((podId) => (
            <div
              key={podId}
              className={`p-4 rounded-2xl border text-center transition-all ${
                activePod === podId
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md scale-105'
                  : 'border-slate-800 bg-slate-900 text-slate-500'
              }`}
            >
              <div className="font-bold text-xs">Pod #{podId} (api-app)</div>
              <div className="text-[10px] pt-1">IP: 10.244.1.{podId + 10}:8080</div>
              <div className="pt-2 text-[11px] font-bold">
                {activePod === podId ? '⚡ RECEIVING REQUEST' : '💤 READY'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSendPacket}
          className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Send HTTP Request (Round-Robin Route)</span>
        </button>
      </div>
    </div>
  );
}
