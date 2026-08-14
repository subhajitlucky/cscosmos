'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Layers, Plus, RefreshCw, RotateCcw, Server, Skull, Sparkles, Zap } from 'lucide-react';

export function KafkaPartitionVisualizer() {
  const [partitions, setPartitions] = useState([
    { id: 0, messages: ['Order #101', 'Order #104'], assignedConsumer: 'Consumer A' },
    { id: 1, messages: ['Order #102', 'Order #105'], assignedConsumer: 'Consumer B' },
    { id: 2, messages: ['Order #103', 'Order #106'], assignedConsumer: 'Consumer C' },
  ]);

  const [consumerBDead, setConsumerBDead] = useState<boolean>(false);
  const [log, setLog] = useState<string>('Kafka Topic "orders-stream" running with 3 partitions and 3 consumers.');

  const handleProduce = () => {
    const nextOrderId = Math.floor(Math.random() * 800) + 200;
    const targetP = Math.floor(Math.random() * 3);

    setPartitions((prev) =>
      prev.map((p) =>
        p.id === targetP ? { ...p, messages: [...p.messages, `Order #${nextOrderId}`] } : p
      )
    );
    setLog(`⚡ MESSAGE PRODUCED: Appended "Order #${nextOrderId}" to Partition ${targetP} at offset ${partitions[targetP].messages.length}.`);
  };

  const handleKillConsumerB = () => {
    setConsumerBDead(true);
    setPartitions((prev) => [
      { id: 0, messages: prev[0].messages, assignedConsumer: 'Consumer A' },
      { id: 1, messages: prev[1].messages, assignedConsumer: 'Consumer A (Rebalanced)' },
      { id: 2, messages: prev[2].messages, assignedConsumer: 'Consumer C' },
    ]);
    setLog('🚨 CONSUMER CRASH: Consumer B died! Kafka Group Coordinator triggered REBALANCE. Partition 1 dynamically reassigned to Consumer A.');
  };

  const handleHealConsumerB = () => {
    setConsumerBDead(false);
    setPartitions((prev) => [
      { id: 0, messages: prev[0].messages, assignedConsumer: 'Consumer A' },
      { id: 1, messages: prev[1].messages, assignedConsumer: 'Consumer B' },
      { id: 2, messages: prev[2].messages, assignedConsumer: 'Consumer C' },
    ]);
    setLog('✅ REBALANCE COMPLETE: Consumer B rejoined group. Partitions reassigned 1-to-1.');
  };

  const handleReset = () => {
    setConsumerBDead(false);
    setPartitions([
      { id: 0, messages: ['Order #101', 'Order #104'], assignedConsumer: 'Consumer A' },
      { id: 1, messages: ['Order #102', 'Order #105'], assignedConsumer: 'Consumer B' },
      { id: 2, messages: ['Order #103', 'Order #106'], assignedConsumer: 'Consumer C' },
    ]);
    setLog('Reset Kafka partitions and consumers.');
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Distributed Event Streaming
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Kafka Partition Log &amp; Consumer Group Rebalance
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Topic: orders-stream (3 Partitions)
        </span>
      </div>

      {/* Partitions Grid */}
      <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
        {partitions.map((p) => (
          <div key={p.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-indigo-400 font-extrabold text-sm">Partition #{p.id}</span>
              <span className="text-[10px] text-slate-400 font-bold">Offset: {p.messages.length}</span>
            </div>

            <div className="space-y-1.5 min-h-[100px]">
              <span className="text-[10px] text-slate-500 block">Append-Only Commit Log:</span>
              {p.messages.map((msg, mIdx) => (
                <div key={mIdx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex justify-between">
                  <span>{msg}</span>
                  <span className="text-slate-500 text-[10px]">[{mIdx}]</span>
                </div>
              ))}
            </div>

            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold text-center">
              Assigned: {p.assignedConsumer}
            </div>
          </div>
        ))}
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-indigo-400 font-bold">Kafka Broker Event Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <div className="flex items-center gap-2">
          {consumerBDead ? (
            <button
              onClick={handleHealConsumerB}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Revive Consumer B (Heal)</span>
            </button>
          ) : (
            <button
              onClick={handleKillConsumerB}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
            >
              <Skull className="w-3.5 h-3.5" />
              <span>Kill Consumer B (Trigger Rebalance)</span>
            </button>
          )}

          <button
            onClick={handleProduce}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Produce Event to Topic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
