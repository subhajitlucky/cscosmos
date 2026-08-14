'use client';

import React, { useState } from 'react';
import { Globe, Play, RotateCcw, Sparkles, Terminal, Zap } from 'lucide-react';

export function ApiPlayground() {
  const [endpoint, setEndpoint] = useState<string>('/graphql');
  const [method, setMethod] = useState<string>('POST');
  const [queryBody, setQueryBody] = useState<string>('{\n  user(id: "42") {\n    id\n    name\n    role\n  }\n}');
  const [responseJson, setResponseJson] = useState<string>('{\n  "data": {\n    "user": {\n      "id": "42",\n      "name": "Alice Johnson",\n      "role": "Staff Software Architect"\n    }\n  }\n}');

  const handleSend = () => {
    if (endpoint === '/graphql') {
      setResponseJson(JSON.stringify({
        data: {
          user: {
            id: '42',
            name: 'Alice Johnson',
            role: 'Staff Software Architect',
            queriedAt: new Date().toISOString(),
          }
        }
      }, null, 2));
    } else {
      setResponseJson(JSON.stringify({
        status: 'success',
        endpoint: endpoint,
        method: method,
        payload: {
          posts: [
            { id: 1, title: 'Mastering GraphQL Resolvers' },
            { id: 2, title: 'Building Resilient Microservices' }
          ]
        },
        timestamp: new Date().toISOString()
      }, null, 2));
    }
  };

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-pink-500/5 dark:bg-pink-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
              Interactive API Client Sandbox
            </div>
            <h3 className="text-xl font-bold text-foreground">
              GraphQL &amp; REST Request Playground
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 font-mono text-xs font-bold">
          Live Mock Engine
        </span>
      </div>

      {/* URL Bar */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-card border border-border text-foreground font-bold outline-none"
        >
          <option value="POST">POST</option>
          <option value="GET">GET</option>
        </select>

        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-card border border-border text-foreground outline-none font-bold"
        />

        <button
          onClick={handleSend}
          className="px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Send Request</span>
        </button>
      </div>

      {/* Editor & Response Grid */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Request Body */}
        <div className="space-y-1">
          <span className="text-muted-foreground block font-bold">Request Body:</span>
          <textarea
            rows={8}
            value={queryBody}
            onChange={(e) => setQueryBody(e.target.value)}
            className="w-full p-4 rounded-3xl bg-slate-950 text-pink-300 border border-slate-800 outline-none font-mono text-xs shadow-inner leading-relaxed"
          />
        </div>

        {/* Response Body */}
        <div className="space-y-1">
          <span className="text-muted-foreground block font-bold">Response (HTTP 200 OK):</span>
          <pre className="w-full h-[155px] p-4 rounded-3xl bg-slate-950 text-emerald-300 border border-slate-800 font-mono text-xs shadow-inner overflow-auto whitespace-pre leading-relaxed">
            {responseJson}
          </pre>
        </div>
      </div>
    </div>
  );
}
