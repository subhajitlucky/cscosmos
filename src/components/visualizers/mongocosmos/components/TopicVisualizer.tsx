'use client';

import React, { useState } from 'react';
import { MongoTopic } from '../data/topics/types';
import { BsonVisualizer } from './BsonVisualizer';
import { WiredTigerVisualizer } from './WiredTigerVisualizer';
import { AggPipelineVisualizer } from './AggPipelineVisualizer';
import { ReplicaConsensusVisualizer } from './ReplicaConsensusVisualizer';
import { ShardingVisualizer } from './ShardingVisualizer';
import { Cpu, Database, Search, Sparkles } from 'lucide-react';

interface TopicVisualizerProps {
  topic: MongoTopic;
}

export function TopicVisualizer({ topic }: TopicVisualizerProps) {
  // If the topic is in bson-storage, show BSON visualizer
  if (topic.category === 'bson-storage') {
    return <BsonVisualizer />;
  }

  // If the topic is WiredTiger engine internals
  if (topic.category === 'wiredtiger') {
    return <WiredTigerVisualizer />;
  }

  // If the topic is Aggregation pipeline
  if (topic.category === 'aggregation') {
    return <AggPipelineVisualizer />;
  }

  // If the topic is Sharding or Distributed
  if (topic.category === 'distributed') {
    if (topic.topicNumber >= 46) {
      return <ShardingVisualizer />;
    }
    return <ReplicaConsensusVisualizer />;
  }

  // For Indexing & Querying, provide an interactive Index vs Collscan evaluator
  return <IndexingTopicVisualizer topic={topic} />;
}

function IndexingTopicVisualizer({ topic }: { topic: MongoTopic }) {
  const [indexType, setIndexType] = useState<'single' | 'compound' | 'multikey'>('compound');
  const [useIndex, setUseIndex] = useState(true);

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 text-card-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <Search className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">
              Index Traversal &amp; IXSCAN vs COLLSCAN Execution Plan
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Topic {topic.topicNumber}: {topic.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseIndex((v) => !v)}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs shadow-xs transition-colors ${
              useIndex
                ? 'bg-emerald-600 text-white font-bold'
                : 'border border-border bg-card hover:bg-muted/40 text-foreground'
            }`}
          >
            {useIndex ? 'INDEX ENABLED (IXSCAN)' : 'INDEX DISABLED (COLLSCAN)'}
          </button>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Execution Stage</div>
          <div className={`text-lg font-bold font-mono ${useIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
            {useIndex ? 'IXSCAN + FETCH' : 'COLLSCAN'}
          </div>
          <div className="text-[10px] text-muted-foreground">{useIndex ? 'B-Tree leaf seek' : 'Full collection scan'}</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Documents Examined</div>
          <div className="text-lg font-bold font-mono text-foreground">{useIndex ? '2' : '10,000'}</div>
          <div className="text-[10px] text-muted-foreground">{useIndex ? 'O(log N) lookup' : 'O(N) unindexed scan'}</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Keys Examined</div>
          <div className="text-lg font-bold font-mono text-foreground">{useIndex ? '2' : '0'}</div>
          <div className="text-[10px] text-muted-foreground">Index keys inspected</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Query Latency</div>
          <div className={`text-lg font-bold font-mono ${useIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
            {useIndex ? '0.3 ms' : '84.2 ms'}
          </div>
          <div className="text-[10px] text-muted-foreground">WiredTiger execution time</div>
        </div>
      </div>

      {/* Sample Query Explain JSON */}
      <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-2">
        <span className="text-xs font-bold text-foreground">Explain Plan Output Summary:</span>
        <pre className="p-3 rounded-lg border border-border bg-background font-mono text-xs text-foreground overflow-x-auto">
{JSON.stringify(
  {
    queryPlanner: {
      winningPlan: {
        stage: useIndex ? 'FETCH' : 'COLLSCAN',
        inputStage: useIndex
          ? {
              stage: 'IXSCAN',
              indexName: 'role_1_country_1',
              isMultiKey: false,
              direction: 'forward',
            }
          : undefined,
      },
    },
    executionStats: {
      nReturned: 2,
      executionTimeMillis: useIndex ? 1 : 85,
      totalKeysExamined: useIndex ? 2 : 0,
      totalDocsExamined: useIndex ? 2 : 10000,
    },
  },
  null,
  2
)}
        </pre>
      </div>
    </div>
  );
}
