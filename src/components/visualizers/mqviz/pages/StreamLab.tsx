'use client';

import React, { useState } from 'react';
import { Activity, Server, Radio, Play, RotateCcw, Zap, RefreshCw, Layers, ShieldAlert, Cpu } from 'lucide-react';

interface EventRecord {
  id: string;
  key: string;
  partition: number;
  offset: number;
  payload: string;
  timestamp: string;
}

export function StreamLab() {
  const [keyInput, setKeyInput] = useState('user_881');
  const [payloadInput, setPayloadInput] = useState('{"event": "CHECKOUT_COMPLETED", "amount": 149}');
  const [partitions, setPartitions] = useState<{ [key: number]: EventRecord[] }>({
    0: [
      { id: 'evt_1', key: 'user_102', partition: 0, offset: 0, payload: '{"event":"LOGIN"}', timestamp: '12:00:01' },
      { id: 'evt_2', key: 'user_102', partition: 0, offset: 1, payload: '{"event":"PAGE_VIEW"}', timestamp: '12:00:02' }
    ],
    1: [
      { id: 'evt_3', key: 'user_305', partition: 1, offset: 0, payload: '{"event":"ADD_TO_CART"}', timestamp: '12:00:01' }
    ],
    2: [
      { id: 'evt_4', key: 'user_881', partition: 2, offset: 0, payload: '{"event":"SIGNUP"}', timestamp: '12:00:00' }
    ]
  });

  const [consumerOffsets, setConsumerOffsets] = useState<{ [key: number]: number }>({
    0: 1,
    1: 0,
    2: 0
  });

  const [activeWorkers, setActiveWorkers] = useState<string[]>(['Worker-1 (C1)', 'Worker-2 (C2)']);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Kafka Cluster KRaft Broker 1 online.',
    '[GROUP] Consumer group "order-analytics" assigned partitions: C1 -> [P0, P1], C2 -> [P2].'
  ]);

  const hashKey = (key: string) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 3;
  };

  const produceEvent = () => {
    const pId = hashKey(keyInput);
    const currentList = partitions[pId] || [];
    const newRecord: EventRecord = {
      id: `evt_${Date.now().toString().slice(-4)}`,
      key: keyInput,
      partition: pId,
      offset: currentList.length,
      payload: payloadInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setPartitions(prev => ({
      ...prev,
      [pId]: [...prev[pId], newRecord]
    }));

    setLogs(prev => [
      `[PRODUCE] Key "${keyInput}" hashed -> Partition ${pId} (Offset ${newRecord.offset})`,
      ...prev.slice(0, 7)
    ]);
  };

  const consumePartition = (pId: number) => {
    const total = partitions[pId].length;
    const current = consumerOffsets[pId];
    if (current < total) {
      setConsumerOffsets(prev => ({
        ...prev,
        [pId]: prev[pId] + 1
      }));
      setLogs(prev => [
        `[CONSUME] Worker committed offset ${current + 1} on Partition ${pId}`,
        ...prev.slice(0, 7)
      ]);
    }
  };

  const toggleWorker3 = () => {
    if (activeWorkers.length === 2) {
      setActiveWorkers(['Worker-1 (C1)', 'Worker-2 (C2)', 'Worker-3 (C3)']);
      setLogs(prev => [
        '[REBALANCE] Worker-3 joined! Cooperative rebalance triggered: C1->[P0], C2->[P1], C3->[P2].',
        ...prev.slice(0, 7)
      ]);
    } else {
      setActiveWorkers(['Worker-1 (C1)', 'Worker-2 (C2)']);
      setLogs(prev => [
        '[REBALANCE] Worker-3 departed! Reassigning partitions: C1->[P0, P1], C2->[P2].',
        ...prev.slice(0, 7)
      ]);
    }
  };

  const totalEvents = Object.values(partitions).reduce((sum, list) => sum + list.length, 0);
  const totalConsumed = Object.values(consumerOffsets).reduce((sum, off) => sum + off, 0);
  const totalLag = Math.max(0, totalEvents - totalConsumed);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--mq-primary)]/30 bg-[var(--mq-primary)]/10 text-[var(--mq-primary)] text-xs font-mono">
          <Activity className="w-3.5 h-3.5" /> Interactive Broker Simulator
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--mq-text)]">
          Live Event <span className="text-[var(--mq-primary)] mq-glow">Stream Lab</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--mq-muted)] max-w-2xl leading-relaxed">
          Produce messages with custom routing keys, observe partition Murmur2 hash distributions, trigger consumer rebalancing, and track real-time lag.
        </p>
      </div>

      {/* Top Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--mq-muted)] uppercase">Total Events Produced</span>
          <div className="font-mono font-bold text-2xl text-[var(--mq-text)]">{totalEvents}</div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--mq-muted)] uppercase">Committed Offsets</span>
          <div className="font-mono font-bold text-2xl text-[var(--mq-cyan)]">{totalConsumed}</div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--mq-muted)] uppercase">Consumer Lag</span>
          <div className={`font-mono font-bold text-2xl ${totalLag > 3 ? 'text-[var(--mq-rose)]' : 'text-[var(--mq-emerald)]'}`}>
            {totalLag} msgs
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-1">
          <span className="text-[10px] font-mono text-[var(--mq-muted)] uppercase">Active Consumer Workers</span>
          <div className="font-mono font-bold text-2xl text-[var(--mq-primary)]">{activeWorkers.length} nodes</div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Producer Console */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--mq-border-subtle)] pb-4">
            <span className="font-mono text-xs text-[var(--mq-primary)] uppercase tracking-wider font-bold">
              Producer Gateway
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--mq-primary)]/10 text-[var(--mq-primary)] border border-[var(--mq-primary)]/20">
              ACKS=ALL
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-[var(--mq-muted)] text-[11px]">Message Key (determines partition)</label>
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--mq-border-subtle)] bg-[var(--mq-bg)] text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none"
              />
              <span className="text-[10px] text-[var(--mq-muted)]">
                Murmur2 Hash Target: <b className="text-[var(--mq-primary)]">Partition-0{hashKey(keyInput)}</b>
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--mq-muted)] text-[11px]">Payload (JSON Record)</label>
              <textarea
                value={payloadInput}
                onChange={(e) => setPayloadInput(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[var(--mq-border-subtle)] bg-[var(--mq-bg)] text-[var(--mq-text)] focus:border-[var(--mq-primary)] focus:outline-none"
              />
            </div>

            <button
              onClick={produceEvent}
              className="w-full py-3 rounded-lg bg-[var(--mq-primary)] text-black font-semibold text-xs hover:bg-[var(--mq-primary-hover)] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Publish Record to Topic
            </button>
          </div>

          {/* Consumer Group Management */}
          <div className="pt-4 border-t border-[var(--mq-border-subtle)] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--mq-muted)]">Consumer Scale Controller</span>
              <button
                onClick={toggleWorker3}
                className="text-[10px] font-mono px-2.5 py-1 rounded bg-[var(--mq-surface-2)] text-[var(--mq-primary)] border border-[var(--mq-border)] hover:bg-[var(--mq-primary)] hover:text-black transition-colors"
              >
                {activeWorkers.length === 2 ? '+ Scale Worker 3' : '- Descale Worker 3'}
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              {activeWorkers.map((w, idx) => (
                <div key={idx} className="p-2 rounded bg-[var(--mq-bg)] border border-[var(--mq-border-subtle)] flex items-center justify-between">
                  <span className="text-[var(--mq-text)]">{w}</span>
                  <span className="text-[10px] text-[var(--mq-emerald)]">ONLINE</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Partitions & Offsets Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--mq-primary)] uppercase tracking-wider font-bold">
                Topic Partitions Log (Append-Only)
              </span>
              <span className="text-[10px] font-mono text-[var(--mq-muted)]">
                RETENTION: 7 DAYS
              </span>
            </div>

            <div className="space-y-4">
              {[0, 1, 2].map((pId) => {
                const records = partitions[pId] || [];
                const committed = consumerOffsets[pId];
                const pLag = Math.max(0, records.length - committed);

                return (
                  <div key={pId} className="p-4 rounded-xl border border-[var(--mq-border-subtle)] bg-[var(--mq-bg)] space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-[var(--mq-primary)]" />
                        <span className="font-bold text-[var(--mq-text)]">Partition 0{pId}</span>
                        <span className="text-[10px] text-[var(--mq-muted)]">({records.length} records)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] ${pLag > 0 ? 'text-[var(--mq-rose)]' : 'text-[var(--mq-emerald)]'}`}>
                          Lag: {pLag}
                        </span>
                        <button
                          onClick={() => consumePartition(pId)}
                          disabled={pLag === 0}
                          className="px-2.5 py-1 rounded bg-[var(--mq-cyan)]/10 text-[var(--mq-cyan)] border border-[var(--mq-cyan)]/30 text-[10px] hover:bg-[var(--mq-cyan)]/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Commit Next
                        </button>
                      </div>
                    </div>

                    {/* Offset Segment Blocks */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {records.map((rec, rIdx) => {
                        const isConsumed = rIdx < committed;
                        return (
                          <div
                            key={rIdx}
                            className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap border transition-all ${
                              isConsumed
                                ? 'border-[var(--mq-emerald)]/30 bg-[var(--mq-emerald)]/10 text-[var(--mq-emerald)]'
                                : 'border-[var(--mq-primary)]/40 bg-[var(--mq-primary)]/10 text-[var(--mq-primary)] animate-pulse'
                            }`}
                            title={`Key: ${rec.key} | Offset: ${rec.offset}`}
                          >
                            #{rec.offset}: {rec.key}
                          </div>
                        );
                      })}
                      {records.length === 0 && (
                        <span className="text-[10px] font-mono text-[var(--mq-muted)]">Empty log segment</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Log Terminal */}
          <div className="rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-[var(--mq-cyan)]">
              <span className="font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> Broker Event Stream Telemetry
              </span>
              <span className="text-[10px] text-[var(--mq-muted)]">STREAM_LIVE</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--mq-bg)] border border-[var(--mq-border-subtle)] space-y-1.5 text-[11px] max-h-36 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="text-[var(--mq-text)] leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
