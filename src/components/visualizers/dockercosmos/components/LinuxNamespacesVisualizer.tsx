'use client';

import React, { useState } from 'react';
import { Box, CheckCircle2, ChevronRight, Eye, HardDrive, Layers, Network, RefreshCw, Server, Shield, Sparkles, Terminal, Zap } from 'lucide-react';

interface NamespaceDetail {
  id: string;
  name: string;
  flag: string;
  isolatedEntity: string;
  hostView: string;
  containerView: string;
  description: string;
}

const NAMESPACES: NamespaceDetail[] = [
  {
    id: 'pid',
    name: '1. PID Namespace (Process Tree)',
    flag: 'CLONE_NEWPID',
    isolatedEntity: 'Process IDs',
    hostView: 'Host sees PID 48291 (node server.js) alongside 300 other host processes.',
    containerView: 'Container sees PID 1 (node server.js) as the root init process. Host processes are 100% invisible!',
    description: 'Provides private process hierarchy. Signals (SIGKILL, SIGTERM) cannot be sent to host processes from inside the container.'
  },
  {
    id: 'net',
    name: '2. NET Namespace (Network Stack)',
    flag: 'CLONE_NEWNET',
    isolatedEntity: 'IPs, Routing & Ports',
    hostView: 'Host has eth0 (192.168.1.50) and docker0 bridge (172.17.0.1).',
    containerView: 'Container has private eth0 (172.17.0.2), loopback lo, and private port 80 (isolated from host port 80).',
    description: 'Gives the container its own virtual network adapters, routing tables, and iptables firewall rules.'
  },
  {
    id: 'mnt',
    name: '3. MNT Namespace (Mount Points)',
    flag: 'CLONE_NEWNS',
    isolatedEntity: 'Filesystem Mounts',
    hostView: 'Host RootFS: / (Ubuntu/Debian /var, /etc, /home).',
    containerView: 'Container RootFS: / (Alpine Linux chroot / pivot_root isolated overlay). Host disk is inaccessible.',
    description: 'Isolates the list of mounted filesystems so containers cannot see or tamper with host disk mounts.'
  },
  {
    id: 'uts',
    name: '4. UTS Namespace (Hostname)',
    flag: 'CLONE_NEWUTS',
    isolatedEntity: 'Host & Domain Name',
    hostView: 'Host hostname: "production-worker-node-01"',
    containerView: 'Container hostname: "7f9a82b4c12d" (or custom --hostname api-box)',
    description: 'Allows containers to have their own private NIS domain and hostname independent of the host node.'
  },
  {
    id: 'ipc',
    name: '5. IPC Namespace (Shared Memory)',
    flag: 'CLONE_NEWIPC',
    isolatedEntity: 'Inter-Process Comm',
    hostView: 'Host POSIX/SysV message queues & shared memory segments.',
    containerView: 'Container has private IPC semaphores. Cannot read host shared memory.',
    description: 'Prevents processes in different containers or on the host from reading shared memory segments.'
  },
  {
    id: 'user',
    name: '6. USER Namespace (UID / GID)',
    flag: 'CLONE_NEWUSER',
    isolatedEntity: 'User Privileges',
    hostView: 'Mapped to non-privileged standard user UID 10001 on the host.',
    containerView: 'Container root UID 0 (Full root privileges inside container only!).',
    description: 'Key security barrier: A root user inside the container has ZERO root power if it escapes to the host.'
  }
];

export function LinuxNamespacesVisualizer() {
  const [activeNs, setActiveNs] = useState<NamespaceDetail>(NAMESPACES[0]);

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Linux Kernel Isolation Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Linux Namespaces Inspector: The 6 Pillars of Container Isolation
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold">
          Syscall: {activeNs.flag}
        </span>
      </div>

      {/* 6 Namespaces Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {NAMESPACES.map((ns) => (
          <button
            key={ns.id}
            onClick={() => setActiveNs(ns)}
            className={`p-3 rounded-2xl border text-left font-mono text-xs transition-all ${
              activeNs.id === ns.id
                ? 'bg-sky-600 text-white font-bold shadow-md scale-105 border-sky-500'
                : 'bg-card border-border text-foreground hover:border-sky-500'
            }`}
          >
            <div className="text-[10px] opacity-70">Namespace</div>
            <div className="text-xs font-extrabold truncate">{ns.id.toUpperCase()}</div>
          </button>
        ))}
      </div>

      {/* Dual Perspective: Host View vs Container View */}
      <div className="grid md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Host Perspective */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2 text-foreground font-bold">
            <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-slate-500" /> Host OS Perspective (Global)</span>
            <span className="text-xs text-muted-foreground">Linux Kernel</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {activeNs.hostView}
          </p>
        </div>

        {/* Container Perspective */}
        <div className="p-5 rounded-3xl bg-sky-500/10 border border-sky-500/30 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-sky-500/20 text-sky-800 dark:text-sky-200 font-bold">
            <span className="flex items-center gap-1.5"><Box className="w-4 h-4 text-sky-500" /> Container Perspective (Isolated)</span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Private Illusion</span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">
            {activeNs.containerView}
          </p>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1">
        <span className="text-sky-400 font-bold">Kernel Architectural Role:</span>
        <p className="text-slate-300 leading-relaxed">{activeNs.description}</p>
      </div>
    </div>
  );
}
