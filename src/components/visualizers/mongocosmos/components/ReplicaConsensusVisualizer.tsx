'use client';

import React, { useState } from 'react';
import {
  Server,
  Zap,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Radio,
  ArrowRight
} from 'lucide-react';

interface ReplicaNode {
  id: string;
  name: string;
  role: 'PRIMARY' | 'SECONDARY' | 'DOWN';
  oplogTerm: number;
  oplogSeq: number;
  health: 'healthy' | 'partitioned' | 'crashed';
}

export function ReplicaConsensusVisualizer() {
  const [term, setTerm] = useState(1);
  const [nodes, setNodes] = useState<ReplicaNode[]>([
    { id: 'node-1', name: 'mongo-node-1:27017', role: 'PRIMARY', oplogTerm: 1, oplogSeq: 1045, health: 'healthy' },
    { id: 'node-2', name: 'mongo-node-2:27017', role: 'SECONDARY', oplogTerm: 1, oplogSeq: 1045, health: 'healthy' },
    { id: 'node-3', name: 'mongo-node-3:27017', role: 'SECONDARY', oplogTerm: 1, oplogSeq: 1045, health: 'healthy' },
  ]);

  const [writeConcern, setWriteConcern] = useState<'w1' | 'majority'>('majority');
  const [logMessage, setLogMessage] = useState('Replica set stable on Term 1. Primary node-1 actively serving writes.');

  // Write a document: updates primary oplog, and replicates
  const handleWrite = () => {
    const primary = nodes.find((n) => n.role === 'PRIMARY');
    if (!primary) {
      setLogMessage('WRITE FAILED! No active PRIMARY node in replica set to accept writes.');
      return;
    }

    const nextSeq = primary.oplogSeq + 1;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.role === 'PRIMARY') {
          return { ...n, oplogSeq: nextSeq };
        }
        if (n.role === 'SECONDARY' && n.health === 'healthy') {
          return { ...n, oplogSeq: nextSeq };
        }
        return n;
      })
    );

    if (writeConcern === 'majority') {
      setLogMessage(`Write committed with w:"majority": Acknowledged after oplog entry #${nextSeq} replicated to 2 of 3 nodes.`);
    } else {
      setLogMessage(`Write committed with w:1: Acknowledged immediately by PRIMARY node-1 before secondary replication.`);
    }
  };

  // Simulate Primary Partition / Crash
  const handlePartitionPrimary = () => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.role === 'PRIMARY') {
          return { ...n, role: 'DOWN', health: 'crashed' };
        }
        return n;
      })
    );
    setLogMessage('PRIMARY node-1 partitioned/crashed! Heartbeats timed out after 10 seconds.');
  };

  // Trigger Election
  const handleTriggerElection = () => {
    const healthySecondaries = nodes.filter((n) => n.role === 'SECONDARY' && n.health === 'healthy');
    if (healthySecondaries.length < 2) {
      setLogMessage('ELECTION FAILED: Strict majority quorum (2 of 3 votes) impossible with available nodes.');
      return;
    }

    const newTerm = term + 1;
    setTerm(newTerm);

    // Promote node-2 to PRIMARY
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'node-2') {
          return { ...n, role: 'PRIMARY', oplogTerm: newTerm };
        }
        if (n.id === 'node-3') {
          return { ...n, oplogTerm: newTerm };
        }
        return n;
      })
    );

    setLogMessage(`Election concluded! Node-2 won 2 of 3 votes. Promoted to PRIMARY on Term ${newTerm}.`);
  };

  // Recover old primary as Secondary
  const handleRecoverOldPrimary = () => {
    const currentPrimary = nodes.find((n) => n.role === 'PRIMARY');
    const targetSeq = currentPrimary ? currentPrimary.oplogSeq : 1045;

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'node-1') {
          return { ...n, role: 'SECONDARY', health: 'healthy', oplogTerm: term, oplogSeq: targetSeq };
        }
        return n;
      })
    );
    setLogMessage('Node-1 recovered. Rolled back any uncommitted writes, resynced oplog, and joined as SECONDARY.');
  };

  const handleReset = () => {
    setTerm(1);
    setNodes([
      { id: 'node-1', name: 'mongo-node-1:27017', role: 'PRIMARY', oplogTerm: 1, oplogSeq: 1045, health: 'healthy' },
      { id: 'node-2', name: 'mongo-node-2:27017', role: 'SECONDARY', oplogTerm: 1, oplogSeq: 1045, health: 'healthy' },
      { id: 'node-3', name: 'mongo-node-3:27017', role: 'SECONDARY', oplogTerm: 1, oplogSeq: 1045, health: 'healthy' },
    ]);
    setLogMessage('Replica set state reset to Term 1 default.');
  };

  const hasPrimary = nodes.some((n) => n.role === 'PRIMARY');

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 text-card-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <Server className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Replica Set Raft Consensus &amp; Heartbeat Election Lab
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Simulate 3-node replica set heartbeats, failovers, oplog replication, and write concern guarantees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasPrimary ? (
            <>
              <button
                type="button"
                onClick={handleWrite}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Write Document</span>
              </button>
              <button
                type="button"
                onClick={handlePartitionPrimary}
                className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-500/20 transition-colors"
              >
                Partition Primary
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleTriggerElection}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Trigger Heartbeat Election</span>
            </button>
          )}

          {nodes.some((n) => n.role === 'DOWN') && (
            <button
              type="button"
              onClick={handleRecoverOldPrimary}
              className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-medium text-xs shadow-xs transition-colors"
            >
              Recover Node-1
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Write Concern Toggle & Quorum Metric */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Consensus Term</div>
          <div className="text-lg font-bold font-mono text-foreground">Term {term}</div>
          <div className="text-[10px] text-muted-foreground">Monotonically increasing</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Voting Quorum</div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            2 / 3 Majority
          </div>
          <div className="text-[10px] text-muted-foreground">Strict floor(N/2) + 1</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Heartbeat Interval</div>
          <div className="text-lg font-bold font-mono text-foreground">2000 ms</div>
          <div className="text-[10px] text-muted-foreground">10s election timeout</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Write Concern</div>
          <div className="flex items-center gap-1.5 mt-1">
            <button
              type="button"
              onClick={() => setWriteConcern('majority')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                writeConcern === 'majority'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              w:"majority"
            </button>
            <button
              type="button"
              onClick={() => setWriteConcern('w1')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                writeConcern === 'w1'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              w:1
            </button>
          </div>
        </div>
      </div>

      {/* 3 Node Cluster Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const isPrimary = node.role === 'PRIMARY';
          const isDown = node.role === 'DOWN';

          return (
            <div
              key={node.id}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                isPrimary
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : isDown
                  ? 'border-rose-500/40 bg-rose-500/5 opacity-80'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-foreground">{node.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isPrimary
                      ? 'bg-emerald-600 text-white'
                      : isDown
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {node.role}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Host:</span>
                  <span className="font-mono text-foreground">{node.name}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Oplog Sequence:</span>
                  <span className="font-mono text-foreground font-bold">#{node.oplogSeq}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Voted Term:</span>
                  <span className="font-mono text-foreground">Term {node.oplogTerm}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-muted/20 border border-border/60 text-[11px] text-muted-foreground">
                {isPrimary && 'Accepts all driver write and read traffic (ReadPreference: primary).'}
                {node.role === 'SECONDARY' && 'Tails primary local.oplog.rs in background thread.'}
                {isDown && 'Disconnected. Not sending or receiving heartbeat pings.'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cluster Event Log */}
      <div className="p-3.5 rounded-lg border border-border bg-muted/20 font-mono text-xs flex items-center gap-2">
        <span className="text-muted-foreground font-bold shrink-0">REPL_LOG:</span>
        <span className="text-foreground">{logMessage}</span>
      </div>
    </div>
  );
}
