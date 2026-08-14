'use client';

import React, { useState } from 'react';
import { Box, Play, RotateCcw, Sparkles, Terminal, Zap } from 'lucide-react';

export function DockerCliPlayground() {
  const [command, setCommand] = useState<string>('docker ps -a');
  const [output, setOutput] = useState<string[]>([
    'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES',
    '7f9a82b4c12d   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   web-server',
    '1e4d9c8b7a0f   redis:7-alpine "docker-entrypoint.s…"   10 mins ago     Up 10 mins     6379/tcp               cache-db',
  ]);

  const handleRunCommand = () => {
    const cmd = command.trim().toLowerCase();

    if (cmd === 'docker ps' || cmd === 'docker ps -a') {
      setOutput([
        'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES',
        '7f9a82b4c12d   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   web-server',
        '1e4d9c8b7a0f   redis:7-alpine "docker-entrypoint.s…"   10 mins ago     Up 10 mins     6379/tcp               cache-db',
      ]);
    } else if (cmd.includes('kubectl get pods') || cmd.includes('kubectl get pod')) {
      setOutput([
        'NAME                         READY   STATUS    RESTARTS   AGE',
        'api-deployment-79f9b6-4k2l   1/1     Running   0          42m',
        'api-deployment-79f9b6-9x8q   1/1     Running   0          42m',
        'redis-master-0               1/1     Running   0          2d',
      ]);
    } else if (cmd.includes('kubectl get svc') || cmd.includes('kubectl get services')) {
      setOutput([
        'NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE',
        'kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP        14d',
        'api-service  ClusterIP   10.96.0.42   <none>        80:30080/TCP   2d',
      ]);
    } else if (cmd.includes('docker run')) {
      setOutput([
        '4d8e9a2b1c3f8e7a6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e',
        'Container started in background (detached mode).'
      ]);
    } else {
      setOutput([
        `Executed: ${command}`,
        'Command succeeded with exit code 0.'
      ]);
    }
  };

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Interactive Cloud Native Sandbox
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Docker &amp; Kubernetes CLI Terminal Simulator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold">
          docker CLI &amp; kubectl v1.31
        </span>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 font-mono text-xs font-bold">$</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
              placeholder="docker ps -a or kubectl get pods"
              className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-950 text-sky-300 font-mono text-xs border border-border focus:border-sky-500 outline-none shadow-inner"
            />
          </div>

          <button
            onClick={handleRunCommand}
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground self-center">Presets:</span>
          {['docker ps -a', 'kubectl get pods', 'kubectl get svc', 'docker run -d -p 80:80 nginx'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setCommand(cmd);
              }}
              className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
          <span className="text-sky-400 font-bold">Terminal Output</span>
          <span className="text-emerald-400 font-bold">Exit Code: 0</span>
        </div>

        <div className="space-y-1 py-1 overflow-x-auto whitespace-pre">
          {output.map((line, idx) => (
            <div key={idx} className={idx === 0 ? 'text-slate-400 font-bold' : 'text-sky-200'}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
