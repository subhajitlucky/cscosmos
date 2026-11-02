'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Database,
  Layers,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import {
  executeMqlQuery,
  MOCK_COLLECTIONS,
  MongoExecutionResult
} from '../lib/mongoSubsetEvaluator';

const SAMPLE_QUERIES = [
  {
    name: 'Find Active Developers',
    code: `db.users.find({ role: 'developer', status: 'active' });`
  },
  {
    name: 'High-Value Orders (Sorted)',
    code: `db.orders.find({ total: { $gt: 200 } }).sort({ total: -1 });`
  },
  {
    name: 'Revenue Grouped by Payment',
    code: `db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$payment', totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } },
  { $sort: { totalRevenue: -1 } }
]);`
  },
  {
    name: 'Unwind User Tags Frequency',
    code: `db.users.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);`
  },
  {
    name: 'Customer & Order $lookup Join',
    code: `db.orders.aggregate([
  { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'customerDetails' } }
]);`
  }
];

export function MongoPlayground() {
  const [queryCode, setQueryCode] = useState(SAMPLE_QUERIES[0].code);
  const [activeTab, setActiveTab] = useState<'results' | 'explain' | 'schema'>('results');
  const [activeCollectionTab, setActiveCollectionTab] = useState('users');
  const [execResult, setExecResult] = useState<MongoExecutionResult | null>(() => {
    try {
      return executeMqlQuery(SAMPLE_QUERIES[0].code, MOCK_COLLECTIONS);
    } catch {
      return null;
    }
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRun = () => {
    try {
      setErrorMsg(null);
      const res = executeMqlQuery(queryCode, MOCK_COLLECTIONS);
      setExecResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Execution error');
      setExecResult(null);
    }
  };

  const handleSelectSample = (code: string) => {
    setQueryCode(code);
    setErrorMsg(null);
    try {
      const res = executeMqlQuery(code, MOCK_COLLECTIONS);
      setExecResult(res);
    } catch (err: any) {
      setErrorMsg(err.message);
      setExecResult(null);
    }
  };

  const handleReset = () => {
    setQueryCode(SAMPLE_QUERIES[0].code);
    handleSelectSample(SAMPLE_QUERIES[0].code);
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 text-card-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <Terminal className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">Interactive MQL &amp; Aggregation Playground</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Execute MongoDB queries and multi-stage pipelines against in-memory BSON collections with live execution plans.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRun}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute MQL</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Queries Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Templates:</span>
        {SAMPLE_QUERIES.map((q) => (
          <button
            key={q.name}
            type="button"
            onClick={() => handleSelectSample(q.code)}
            className="px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted/40 text-xs text-foreground transition-colors"
          >
            {q.name}
          </button>
        ))}
      </div>

      {/* Query Code Editor */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>MQL Query Editor</span>
          <span className="text-[11px] font-mono text-muted-foreground">db.&lt;collection&gt;.find() or .aggregate()</span>
        </label>
        <textarea
          value={queryCode}
          onChange={(e) => setQueryCode(e.target.value)}
          rows={5}
          spellCheck={false}
          className="w-full p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground leading-relaxed resize-y"
        />
      </div>

      {/* Output & Inspection Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-border/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'results'
                  ? 'border-foreground text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Output Documents ({execResult ? execResult.count : 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('explain')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'explain'
                  ? 'border-foreground text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Execution Plan (Explain)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'schema'
                  ? 'border-foreground text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Collection Schemas
            </button>
          </div>

          {execResult && !errorMsg && (
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
              EXECUTION_SUCCESS • {execResult.explain.executionTimeMillis}ms
            </span>
          )}
        </div>

        {/* Tab 1: Documents Result */}
        {activeTab === 'results' && (
          <div>
            {errorMsg ? (
              <div className="p-4 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs font-mono space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Execution Error:</span>
                </div>
                <div>{errorMsg}</div>
              </div>
            ) : execResult && execResult.documents.length > 0 ? (
              <pre className="p-4 rounded-xl border border-border bg-muted/10 font-mono text-xs text-foreground max-h-[320px] overflow-y-auto leading-relaxed">
                {JSON.stringify(execResult.documents, null, 2)}
              </pre>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No matching documents returned.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Explain Plan */}
        {activeTab === 'explain' && execResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="text-[11px] text-muted-foreground font-medium">Scan Stage</div>
                <div className="text-lg font-bold font-mono text-foreground">{execResult.explain.stage}</div>
                <div className="text-[10px] text-muted-foreground">
                  {execResult.explain.stage === 'IXSCAN' ? 'Index B-Tree Seek' : 'Collection Scan'}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="text-[11px] text-muted-foreground font-medium">Returned Docs</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {execResult.explain.nReturned}
                </div>
                <div className="text-[10px] text-muted-foreground">Tuples projected</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="text-[11px] text-muted-foreground font-medium">Docs Examined</div>
                <div className="text-lg font-bold font-mono text-foreground">{execResult.explain.docsExamined}</div>
                <div className="text-[10px] text-muted-foreground">Physical disk reads</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="text-[11px] text-muted-foreground font-medium">Index Keys Checked</div>
                <div className="text-lg font-bold font-mono text-foreground">{execResult.explain.keysExamined}</div>
                <div className="text-[10px] text-muted-foreground">B-Tree leaf entries</div>
              </div>
            </div>

            <pre className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground overflow-x-auto">
              {JSON.stringify(execResult.explain, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Collection Schema Explorer */}
        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.keys(MOCK_COLLECTIONS).map((cName) => (
                <button
                  key={cName}
                  type="button"
                  onClick={() => setActiveCollectionTab(cName)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    activeCollectionTab === cName
                      ? 'bg-foreground text-background font-bold'
                      : 'border border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  db.{cName} ({MOCK_COLLECTIONS[cName].length})
                </button>
              ))}
            </div>

            <pre className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground max-h-[260px] overflow-y-auto">
              {JSON.stringify(MOCK_COLLECTIONS[activeCollectionTab], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
