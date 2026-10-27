'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Network, Layers, RotateCcw, Play, ShieldAlert, GitPullRequest } from 'lucide-react';
import { microserviceTopicGroups } from '../data/topics';

/** Short names for the five architecture stages, keyed by topic group id. */
const STAGE_NAMES: Record<string, { phase: string; name: string }> = {
  decomposition: { phase: 'MAP', name: 'Decompose' },
  resilience: { phase: 'CONTAIN', name: 'Contain' },
  'transactions-sagas': { phase: 'RECOVER', name: 'Settle' },
  observability: { phase: 'OBSERVE', name: 'Observe' },
  'service-mesh': { phase: 'TRANSPORT', name: 'Secure' },
};

interface ServiceNode {
  id: string;
  name: string;
  role: string;
  status: 'healthy' | 'degraded' | 'tripped';
  latency: number;
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

export function Home() {
  const [scenario, setScenario] = useState<'normal' | 'latency' | 'payment_fail' | 'inventory_crash'>('normal');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Service Mesh Active: Envoy sidecars connected via mTLS.',
    '[READY] Select failure injection scenario and click "Execute Distributed RPC".'
  ]);

  const [services, setServices] = useState<ServiceNode[]>([
    { id: 'gw', name: 'API Gateway', role: 'Routing / Auth / Rate Limit', status: 'healthy', latency: 4, circuitState: 'CLOSED' },
    { id: 'order', name: 'Order Service', role: 'Saga Orchestrator FSM', status: 'healthy', latency: 8, circuitState: 'CLOSED' },
    { id: 'payment', name: 'Payment Service', role: 'Stripe Gateway Wrapper', status: 'healthy', latency: 15, circuitState: 'CLOSED' },
    { id: 'inventory', name: 'Inventory Service', role: 'PostgreSQL Stock Ledger', status: 'healthy', latency: 6, circuitState: 'CLOSED' },
  ]);

  const runSimulation = () => {
    setIsSimulating(true);

    if (scenario === 'normal') {
      setServices([
        { id: 'gw', name: 'API Gateway', role: 'Routing / Auth / Rate Limit', status: 'healthy', latency: 4, circuitState: 'CLOSED' },
        { id: 'order', name: 'Order Service', role: 'Saga Orchestrator FSM', status: 'healthy', latency: 8, circuitState: 'CLOSED' },
        { id: 'payment', name: 'Payment Service', role: 'Stripe Gateway Wrapper', status: 'healthy', latency: 15, circuitState: 'CLOSED' },
        { id: 'inventory', name: 'Inventory Service', role: 'PostgreSQL Stock Ledger', status: 'healthy', latency: 6, circuitState: 'CLOSED' },
      ]);
      setLogs([
        '[TRACE 0x4bf9] POST /orders -> Traceparent W3C injected',
        '[RPC] Gateway -> OrderService (4ms)',
        '[RPC] OrderService -> PaymentService (15ms)',
        '[RPC] OrderService -> InventoryService (6ms)',
        '[SUCCESS] Order #9021 created with status: COMPLETED (Total: 33ms)'
      ]);
      setTimeout(() => setIsSimulating(false), 600);
    } else if (scenario === 'latency') {
      setServices([
        { id: 'gw', name: 'API Gateway', role: 'Routing / Auth / Rate Limit', status: 'healthy', latency: 4, circuitState: 'CLOSED' },
        { id: 'order', name: 'Order Service', role: 'Saga Orchestrator FSM', status: 'degraded', latency: 2500, circuitState: 'HALF_OPEN' },
        { id: 'payment', name: 'Payment Service', role: 'Stripe Gateway Wrapper', status: 'degraded', latency: 2480, circuitState: 'HALF_OPEN' },
        { id: 'inventory', name: 'Inventory Service', role: 'PostgreSQL Stock Ledger', status: 'healthy', latency: 6, circuitState: 'CLOSED' },
      ]);
      setLogs([
        '[WARN] PaymentService response latency spiked to 2,480ms',
        '[BULKHEAD] Threadpool isolation prevented OrderService thread exhaustion',
        '[TIMEOUT] Exceeded 2,000ms SLA -> Fallback asynchronous queue triggered',
        '[TRACE 0x4bf9] Span paymentService duration: 2480ms (Alert logged to Prometheus)'
      ]);
      setTimeout(() => setIsSimulating(false), 800);
    } else {
      setServices([
        { id: 'gw', name: 'API Gateway', role: 'Routing / Auth / Rate Limit', status: 'healthy', latency: 4, circuitState: 'CLOSED' },
        { id: 'order', name: 'Order Service', role: 'Saga Orchestrator FSM', status: 'healthy', latency: 8, circuitState: 'CLOSED' },
        { id: 'payment', name: 'Payment Service', role: 'Stripe Gateway Wrapper', status: 'tripped', latency: 0, circuitState: 'OPEN' },
        { id: 'inventory', name: 'Inventory Service', role: 'PostgreSQL Stock Ledger', status: 'healthy', latency: 6, circuitState: 'CLOSED' },
      ]);
      setLogs([
        '[ERROR] PaymentService 500 Internal Server Crash detected',
        '[CIRCUIT BREAKER] Error threshold > 50% -> Circuit tripped to OPEN state!',
        '[FAST FAIL] Immediate 0ms fallback executed (No downstream network call)',
        '[COMPENSATION] Saga triggered: unreserveInventory() -> Order marked CANCELLED'
      ]);
      setTimeout(() => setIsSimulating(false), 800);
    }
  };

  const resetAll = () => {
    setScenario('normal');
    setServices([
      { id: 'gw', name: 'API Gateway', role: 'Routing / Auth / Rate Limit', status: 'healthy', latency: 4, circuitState: 'CLOSED' },
      { id: 'order', name: 'Order Service', role: 'Saga Orchestrator FSM', status: 'healthy', latency: 8, circuitState: 'CLOSED' },
      { id: 'payment', name: 'Payment Service', role: 'Stripe Gateway Wrapper', status: 'healthy', latency: 15, circuitState: 'CLOSED' },
      { id: 'inventory', name: 'Inventory Service', role: 'PostgreSQL Stock Ledger', status: 'healthy', latency: 6, circuitState: 'CLOSED' },
    ]);
    setLogs(['[RESET] All circuit breakers closed; telemetry normalized.']);
  };

  const meshStatus: ServiceNode['status'] = services.some((svc) => svc.status === 'tripped')
    ? 'tripped'
    : services.some((svc) => svc.status === 'degraded')
    ? 'degraded'
    : 'healthy';

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="ms-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--ms-primary-30)] bg-[var(--ms-primary-10)] text-[var(--ms-primary)] text-xs font-mono">
              <Network className="w-3.5 h-3.5 animate-pulse text-[var(--ms-primary)]" />
              Circuit Breakers &bull; Distributed Sagas &bull; OpenTelemetry
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--ms-text)]">
              Zero Cascading Failures.<br />
              <span className="text-[var(--ms-primary)] ms-glow">Resilient Sagas.</span> Distributed Tracing.
            </h1>

            <p className="text-base md:text-lg text-[var(--ms-muted)] max-w-xl leading-relaxed">
              Deconstruct distributed microservices architectures. Explore Domain-Driven Bounded Contexts, Circuit Breaker state machines, Saga compensations, and OpenTelemetry trace waterfalls.
            </p>

            {/* Live topology strip: the same four services the mesh panel drives */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[var(--ms-muted)]">
              <span className="uppercase tracking-[0.18em]">Topology</span>
              {services.map((svc, index) => (
                <React.Fragment key={svc.id}>
                  {index > 0 && (
                    <span className="text-[var(--ms-muted)]" aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[var(--ms-border-subtle)] text-[var(--ms-text)]">
                    {/* This dot is the ONLY carrier of svc.status in this strip:
                        the adjacent label is the service name, not its state.
                        --ms-emerald/--ms-amber are dark-tuned (2.42 / 2.05:1 on
                        the light --ms-bg), so the light mode gets a shade of the
                        same hue that clears 3:1 and dark restores the token. */}
                    <span
                      aria-hidden="true"
                      className={`w-1.5 h-1.5 rounded-full ${
                        svc.status === 'healthy'
                          ? 'bg-emerald-600 dark:bg-[var(--ms-emerald)]'
                          : svc.status === 'degraded'
                          ? 'bg-amber-700 dark:bg-[var(--ms-amber)]'
                          : 'bg-[var(--ms-rose)]'
                      }`}
                    />
                    {svc.name}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/microservicesviz/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--ms-primary)] text-white font-semibold text-sm hover:bg-[var(--ms-primary-hover)] transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-95"
              >
                Open the Domain Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/microservicesviz/circuit-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--ms-border)] bg-[var(--ms-surface)] text-[var(--ms-text)] font-mono text-sm hover:border-[var(--ms-primary)] hover:text-[var(--ms-primary)] transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-[var(--ms-rose)]" />
                Circuit Breaker Lab
              </Link>

              <Link
                href="/microservicesviz/saga-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--ms-border-subtle)] bg-[var(--ms-surface-2)] text-[var(--ms-muted)] font-mono text-sm hover:text-[var(--ms-text)] transition-all"
              >
                <GitPullRequest className="w-4 h-4 text-[var(--ms-amber)]" />
                Saga Pattern Lab
              </Link>
            </div>
          </div>

          {/* Right Live 4-Service Mesh Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--ms-border)] bg-[var(--ms-surface)] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 border-b border-[var(--ms-border-subtle)] bg-[var(--ms-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`w-1.5 h-1.5 rounded-full ${
                      meshStatus === 'healthy'
                        ? 'bg-[var(--ms-emerald)]'
                        : meshStatus === 'degraded'
                        ? 'bg-[var(--ms-amber)] animate-pulse'
                        : 'bg-[var(--ms-rose)] animate-pulse'
                    }`}
                  />
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
                    mesh {meshStatus}
                  </span>
                  <span className="text-xs text-[var(--ms-muted)]">ServiceMesh::EnvoyControlPlane</span>
                </div>
                <button
                  onClick={resetAll}
                  className="text-[10px] text-[var(--ms-muted)] hover:text-[var(--ms-primary)]"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Scenario Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[var(--ms-muted)]">Failure Injection Scenario:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['normal', '1. Healthy Flow'],
                      ['latency', '2. Latency (+2.5s)'],
                      ['payment_fail', '3. Service Crash (500)'],
                    ].map(([sId, label]) => (
                      <button
                        key={sId}
                        onClick={() => setScenario(sId as 'normal' | 'latency' | 'payment_fail' | 'inventory_crash')}
                        className={`py-1.5 px-2 rounded-lg text-[10px] text-center transition-all ${
                          scenario === sId
                            ? 'bg-[var(--ms-primary)] text-white font-bold shadow'
                            : 'border border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] text-[var(--ms-muted)] hover:text-[var(--ms-text)]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Nodes Visualizer */}
                <div className="space-y-2">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        svc.status === 'healthy'
                          ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                          : svc.status === 'degraded'
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                          : 'border-rose-500/50 bg-rose-500/15 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-[var(--ms-text)] flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            svc.status === 'healthy' ? 'bg-emerald-400' : svc.status === 'degraded' ? 'bg-amber-400' : 'bg-rose-400 animate-ping'
                          }`} />
                          {svc.name}
                        </div>
                        <div className="text-[9px] opacity-75 text-[var(--ms-muted)]">{svc.role}</div>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${
                          svc.circuitState === 'CLOSED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : svc.circuitState === 'HALF_OPEN'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        }`}>
                          CIRCUIT: {svc.circuitState}
                        </span>
                        <div className="text-[10px] text-[var(--ms-muted)]">{svc.latency} ms</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Execution Button */}
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 rounded-lg bg-[var(--ms-primary)] text-white font-bold hover:bg-[var(--ms-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {isSimulating ? 'Propagating RPC Mesh...' : 'Execute Distributed RPC'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Monolith vs Microservices vs Service Mesh */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ms-primary)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Architecture Paradigm Evolution
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--ms-text)]">
            Monolith vs Microservices vs Service Mesh
          </h2>
          <p className="text-sm text-[var(--ms-muted)]">
            How modern distributed platforms decouple application business logic from network resilience and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Monolith Card */}
          <div className="p-8 rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--ms-text)]">Monolith</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">
                Single Process
              </span>
            </div>
            <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
              All domain logic resides in one single codebase and process. In-memory function calls have 0ms network latency, but a single memory leak or crash downs the entire application.
            </p>
            <div className="p-4 rounded-lg bg-[var(--ms-bg)] font-mono text-[11px] text-[var(--ms-muted)] space-y-1.5 border border-[var(--ms-border-subtle)]">
              <div>• 0ms in-memory method invocation</div>
              <div>• Single database with ACID transactions</div>
              <div>• Rigid deployment cycle &amp; blast radius</div>
            </div>
          </div>

          {/* Microservices Card */}
          <div className="p-8 rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--ms-text)]">Microservices</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Autonomous RPC
              </span>
            </div>
            <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
              Independent deployments with private databases. Independent scaling and polyglot stacks, but requires distributed transaction sagas, circuit breakers, and OpenTelemetry tracing.
            </p>
            <div className="p-4 rounded-lg bg-[var(--ms-bg)] font-mono text-[11px] text-[var(--ms-muted)] space-y-1.5 border border-[var(--ms-border-subtle)]">
              <div>• Database-per-service autonomy</div>
              <div>• Saga compensating rollbacks</div>
              <div>• Application-level retry &amp; backoff logic</div>
            </div>
          </div>

          {/* Service Mesh Card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--ms-primary-40)] bg-[var(--ms-surface)] space-y-6 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--ms-text)]">Service Mesh</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--ms-primary-10)] text-[var(--ms-primary)] border border-[var(--ms-primary-30)] font-bold">
                Envoy Sidecars
              </span>
            </div>
            <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
              Envoy sidecar proxies manage all networking out-of-process. Provides transparent mTLS encryption, canary traffic shifting, automatic circuit breaking, and zero-code telemetry.
            </p>
            <div className="p-4 rounded-lg bg-[var(--ms-bg)] font-mono text-[11px] text-[var(--ms-muted)] space-y-1.5 border border-[var(--ms-primary-20)]">
              <div className="text-[var(--ms-primary)]">• Zero-code mTLS &amp; access control</div>
              <div className="text-emerald-400">• Out-of-process circuit breakers</div>
              <div className="text-[var(--ms-sky)]">• Automated OpenTelemetry trace injection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture path: the five stages a request passes through */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--ms-border-subtle)] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-[var(--ms-text)] uppercase tracking-wider">
              Architecture path &bull; {microserviceTopicGroups.length} stages
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--ms-text)]">
              From bounded context to encrypted hop
            </h2>
            <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
              The modules are ordered as a request travels the architecture: find the boundary,
              contain the failure, settle the transaction, observe the outcome, secure the
              transport. Every stage names the failure mode it owns.
            </p>
          </div>
          <Link
            href="/microservicesviz/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ms-text)] hover:underline whitespace-nowrap"
          >
            Open the domain map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ol className="ms-path">
          {microserviceTopicGroups.map((group, index) => {
            const topic = group.topics[0];
            if (!topic) return null;
            const stage = STAGE_NAMES[group.id] ?? { phase: 'STAGE', name: group.name };
            return (
              <li key={group.id} className="ms-path-hop">
                <Link
                  href={`/microservicesviz/learn/${topic.id}`}
                  className="ms-path-node group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-[var(--ms-muted)]">
                      STAGE {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-[var(--ms-border-subtle)] text-[var(--ms-muted)] uppercase tracking-[0.14em]">
                      {stage.phase}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[var(--ms-text)] mt-3 group-hover:underline">
                    {stage.name}
                  </h3>
                  <p className="font-mono text-[10px] text-[var(--ms-muted)] mt-0.5">
                    {topic.kicker}
                  </p>

                  <p className="text-xs text-[var(--ms-text)] leading-relaxed mt-3">
                    {topic.title}
                  </p>
                  <p className="text-[11px] text-[var(--ms-muted)] leading-relaxed mt-2 line-clamp-2">
                    {topic.summary}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[var(--ms-border-subtle)] space-y-1">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                      Failure it owns
                    </span>
                    <p className="text-[11px] text-[var(--ms-muted)] leading-relaxed line-clamp-3">
                      {topic.mistakes[0]}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-[var(--ms-text)]">
                    {topic.steps.length} moves &bull; {topic.difficulty}
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>

                {index < microserviceTopicGroups.length - 1 && (
                  <span className="ms-path-link" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
