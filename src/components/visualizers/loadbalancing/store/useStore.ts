import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Request, LBAlgorithm, SimulationState, SimulationMode } from '../engine/types';
import { selectNode } from '../engine/algorithms';

interface AppState extends SimulationState {
  setAlgorithm: (algo: LBAlgorithm) => void;
  setSimulationMode: (mode: SimulationMode) => void;
  togglePause: () => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  setRequestRate: (rate: number) => void;
  setSimulationSpeed: (speed: number) => void;
  tick: () => void;
  clearRequests: () => void;
  circuitBreakerStatus: 'closed' | 'open' | 'half-open';
  consecutiveFailures: number;
}

const DEFAULT_NODES: Node[] = [
    { id: 'n1', name: 'Instance Alpha', status: 'healthy', weight: 1, currentConnections: 0, totalRequestsProcessed: 0, errorRate: 0.05, baseLatency: 800 },
    { id: 'n2', name: 'Instance Beta', status: 'healthy', weight: 1, currentConnections: 0, totalRequestsProcessed: 0, errorRate: 0.05, baseLatency: 1200 },
    { id: 'n3', name: 'Instance Gamma', status: 'healthy', weight: 1, currentConnections: 0, totalRequestsProcessed: 0, errorRate: 0.05, baseLatency: 1000 },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      nodes: [...DEFAULT_NODES],
      algorithm: 'round-robin',
      mode: 'default',
      requests: [],
      isPaused: false,
      requestRate: 1,
      simulationSpeed: 1,
      circuitBreakerStatus: 'closed',
      consecutiveFailures: 0,

      setAlgorithm: (algo: LBAlgorithm) => {
          set({ algorithm: algo });
          if (algo === 'weighted-round-robin') {
              set((state) => ({
                  nodes: state.nodes.map((n, i) => ({
                      ...n,
                      weight: i === 0 ? 3 : 1,
                      baseLatency: 800 // Reset to standard
                  }))
              }));
          } else if (algo === 'least-connections') {
              set((state) => ({
                  nodes: state.nodes.map((n, i) => ({
                      ...n,
                      weight: 1,
                      baseLatency: i === 1 ? 3000 : 600 
                  }))
              }));
          } else if (algo === 'least-response-time') {
              set({
                  nodes: [
                      { ...DEFAULT_NODES[0], baseLatency: 400 },  // Very Fast
                      { ...DEFAULT_NODES[1], baseLatency: 1200 }, // Medium
                      { ...DEFAULT_NODES[2], baseLatency: 2500 }, // Slow
                  ]
              });
          } else {
              set((state) => ({
                  nodes: state.nodes.map(n => ({ ...n, weight: 1, baseLatency: 800 }))
              }));
          }
      },
      setSimulationMode: (mode: SimulationMode) => {
          set({ mode, requests: [], consecutiveFailures: 0, circuitBreakerStatus: 'closed' });
          
          // Context-aware node resets
          if (mode === 'global-lb') {
              set({
                  nodes: [
                      { id: 'us-1', name: 'US-East Node', status: 'healthy', weight: 1, currentConnections: 0, totalRequestsProcessed: 0, errorRate: 0.02, baseLatency: 200 },
                      { id: 'eu-1', name: 'EU-West Node', status: 'healthy', weight: 1, currentConnections: 0, totalRequestsProcessed: 0, errorRate: 0.02, baseLatency: 1200 },
                  ]
              });
          } else if (mode === 'autoscaling') {
              set({
                  nodes: [
                      { id: 'n1', name: 'Static Node 1', status: 'healthy', weight: 1, currentConnections: 0, totalRequestsProcessed: 0, errorRate: 0.05, baseLatency: 800 },
                      { id: 'n2', name: 'Static Node 2', status: 'healthy', weight: 1, currentConnections: 0, totalRequestsProcessed: 0, errorRate: 0.05, baseLatency: 800 },
                  ]
              });
          } else {
              // Reset to standard nodes for all Fundamentals and Algorithms
              set({ nodes: [...DEFAULT_NODES] });
          }
      },
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      addNode: (node: Node) => set((state) => ({ nodes: [...state.nodes, node] })),
      removeNode: (id: string) => set((state) => ({ nodes: state.nodes.filter((n: Node) => n.id !== id) })),
      updateNode: (id: string, updates: Partial<Node>) => set((state) => ({
        nodes: state.nodes.map((n: Node) => n.id === id ? { ...n, ...updates } : n)
      })),
      setRequestRate: (rate: number) => set({ requestRate: rate }),
      setSimulationSpeed: (speed: number) => set({ simulationSpeed: speed }),
      clearRequests: () => set({ requests: [] }),

      tick: () => {
        const state = get();
        if (state.isPaused) return;

        const now = Date.now();
        let newRequests = [...state.requests];
        let newNodes = [...state.nodes];

        // 1. Mode-specific logic
        if (state.mode === 'health-checks' || state.mode === 'backend-failures') {
            if (Math.random() < 0.015) { // Slightly higher probability for failures mode
                const nodeToToggle = newNodes[Math.floor(Math.random() * newNodes.length)];
                newNodes = newNodes.map((n: Node) => n.id === nodeToToggle.id ? { 
                    ...n, 
                    status: n.status === 'healthy' ? 'unhealthy' : 'healthy' 
                } : n);
            }
        }

        if (state.mode === 'autoscaling') {
            const avgConnections = newNodes.reduce((acc, n) => acc + n.currentConnections, 0) / newNodes.length;
            if (avgConnections > 1.5 && newNodes.length < 5) {
                newNodes.push({
                    id: `auto-${Math.random().toString(36).substr(2, 5)}`,
                    name: `Elastic Instance`,
                    status: 'healthy',
                    weight: 1,
                    currentConnections: 0,
                    totalRequestsProcessed: 0,
                    errorRate: 0.05,
                    baseLatency: 1000
                });
            } else if (avgConnections < 0.3 && newNodes.length > 2) {
                newNodes = newNodes.filter((_, i) => i !== newNodes.length - 1);
            }
        }

        if (state.mode === 'circuit-breaker') {
            if (state.circuitBreakerStatus === 'open' && Math.random() < 0.02) {
                set({ circuitBreakerStatus: 'half-open' });
            }
        }

        if (state.mode === 'single-point-of-failure') {
            if (Math.random() < 0.005) {
                set({ circuitBreakerStatus: 'open' });
            }
        }

        // 2. Generate new requests
        const lastReq = newRequests.filter(r => r.status === 'pending').sort((a, b) => b.timestamp - a.timestamp)[0];
        let effectiveRate = state.requestRate;
        if (state.mode === 'bottleneck' || state.mode === 'autoscaling') effectiveRate *= 3;
        
        if (!lastReq || now - lastReq.timestamp > 1000 / effectiveRate) {
            let requestColor;
            const clientIdentities = [
                { id: 'client-1', color: '#3b82f6' }, 
                { id: 'client-2', color: '#ef4444' }, 
                { id: 'client-3', color: '#f59e0b' }, 
                { id: 'client-4', color: '#10b981' }
            ];

            if (state.mode === 'sticky-sessions' || state.algorithm === 'ip-hash') {
                const identityIndex = Math.floor(now / 1500) % clientIdentities.length;
                requestColor = clientIdentities[identityIndex].color;
            } else {
                requestColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
            }

            newRequests.push({
              id: Math.random().toString(36).substr(2, 9),
              timestamp: now,
              status: 'pending',
              latency: 0,
              retryCount: 0,
              color: requestColor,
            });
        }

        if (newRequests.length > 30) {
            newRequests = newRequests.slice(-30);
        }

        // 3. Process Pending -> Routing
        newRequests = newRequests.map((req: Request) => {
            if (req.status === 'pending') {
                if ((state.mode === 'circuit-breaker' || state.mode === 'single-point-of-failure') && state.circuitBreakerStatus === 'open') {
                    return { ...req, status: 'failed' as const, timestamp: now };
                }

                const healthyNodes = newNodes.filter(n => n.status === 'healthy');
                
                let target;
                if (state.mode === 'sticky-sessions') {
                    target = healthyNodes[0];
                } else if (state.algorithm === 'ip-hash') {
                    target = selectNode(healthyNodes, 'ip-hash', req.color);
                } else {
                    target = selectNode(healthyNodes, state.algorithm);
                }

                if (target) {
                    const targetIdx = newNodes.findIndex(n => n.id === target.id);
                    newNodes = newNodes.map((n: Node) => n.id === target.id ? { ...n, currentConnections: n.currentConnections + 1 } : n);
                    return { ...req, status: 'routing' as const, targetNodeId: target.id, targetNodeIndex: targetIdx, timestamp: now };
                } else {
                    return { ...req, status: 'failed' as const, timestamp: now };
                }
            }
            return req;
        });

        // 4. Routing -> Processing
        newRequests = newRequests.map((req: Request) => {
            // LAYER 4 is fast (short delay), LAYER 7 is slow (DPI analysis)
            let routingDelay = 800;
            if (state.mode === 'l4') routingDelay = 300;
            if (state.mode === 'l7') routingDelay = 1500;
            if (state.mode === 'bottleneck') routingDelay = 1500;

            if (req.status === 'routing' && now - req.timestamp > routingDelay) {
                // SPECIAL CASE: Reverse Proxy Security Checks
                if (state.mode === 'reverse-proxy') {
                    const failSecurity = Math.random() < 0.2; // 20% chance of proxy-layer failure
                    if (failSecurity) {
                        return { 
                            ...req, 
                            status: 'failed' as const, 
                            timestamp: now,
                            targetNodeId: undefined, // CLEAR TARGET
                            targetNodeIndex: undefined // CLEAR INDEX
                        };
                    }
                }
                return { ...req, status: 'processing' as const, timestamp: now };
            }
            return req;
        });

        // 5. Processing -> Completed/Failed
        newRequests = newRequests.map((req: Request) => {
            if (req.status === 'processing') {
                const node = newNodes.find((n: Node) => n.id === req.targetNodeId);
                if (node) {
                    const processingTime = state.mode === 'bottleneck' ? node.baseLatency * 2 : node.baseLatency;
                    if (now - req.timestamp > processingTime) {
                        let isError = Math.random() < node.errorRate;
                        
                        if (state.mode === 'circuit-breaker') isError = true;

                        if (isError && state.mode === 'retries' && req.retryCount < 1) {
                            newNodes = newNodes.map((n: Node) => n.id === node.id ? { ...n, currentConnections: Math.max(0, n.currentConnections - 1) } : n);
                            // Ensure next retry picks a DIFFERENT node
                            return { 
                                ...req, 
                                status: 'pending' as const, 
                                retryCount: req.retryCount + 1, 
                                timestamp: now,
                                targetNodeId: undefined, // Wipe current target
                                targetNodeIndex: undefined // Wipe index
                            };
                        }

                        if (isError && state.mode === 'circuit-breaker') {
                            const newFailures = get().consecutiveFailures + 1;
                            set({ consecutiveFailures: newFailures });
                            if (newFailures >= 3) {
                                set({ circuitBreakerStatus: 'open', consecutiveFailures: 0 });
                            }
                        } else if (!isError && state.mode === 'circuit-breaker') {
                            set({ consecutiveFailures: 0, circuitBreakerStatus: 'closed' });
                        }

                        newNodes = newNodes.map((n: Node) => n.id === node.id ? { 
                            ...n, 
                            currentConnections: Math.max(0, n.currentConnections - 1),
                            totalRequestsProcessed: isError ? n.totalRequestsProcessed : n.totalRequestsProcessed + 1
                        } : n);
                        return { ...req, status: (isError ? 'failed' : 'completed') as any, timestamp: now };
                    }
                } else {
                    return { ...req, status: 'failed' as const, timestamp: now };
                }
            }
            return req;
        });

        set({ requests: newRequests, nodes: newNodes });
      }
    }),
    {
      name: 'loadbalancer-lab-storage',
      // FS-40: theme is owned by src/context/ThemeContext.tsx, so this store has
      // nothing left to persist. The key and the wrapper stay, so the simulation
      // state still behaves exactly as before and old payloads are harmless.
      partialize: () => ({}),
      // zustand's default merge is `{ ...currentState, ...persistedState }`, which
      // would copy a pre-FS-40 `theme` key from old JSON straight back onto the
      // store (the spread ignores TypeScript's view of the state shape). Restore
      // only keys the live state actually defines, and stay inert for a payload
      // that is not a plain object (`{"state":"oops"}` used to be spread as
      // "oops" — spreading a string is a no-op, but `key in "oops"` throws).
      merge: (persistedState, currentState) => {
        const persisted =
          persistedState !== null && typeof persistedState === 'object'
            ? (persistedState as Record<string, unknown>)
            : {};
        const merged = { ...currentState } as Record<string, unknown>;
        for (const key of Object.keys(merged)) {
          if (Object.prototype.hasOwnProperty.call(persisted, key)) merged[key] = persisted[key];
        }
        return merged as unknown as AppState;
      },
    }
  )
);