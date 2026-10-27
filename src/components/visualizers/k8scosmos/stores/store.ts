import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Pod, SchedulingDecision } from '../types/scheduler';
import { SchedulerEngine as Engine } from '../lib/scheduler';

interface AppState {
  nodes: Node[];
  pods: Pod[];
  selectedNode: Node | null;
  selectedPod: Pod | null;
  scheduler: Engine;
  schedulingDecisions: Map<string, SchedulingDecision>;

  setNodes: (nodes: Node[]) => void;
  setPods: (pods: Pod[]) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  addPod: (pod: Pod) => void;
  removePod: (podId: string) => void;
  selectNode: (node: Node | null) => void;
  selectPod: (pod: Pod | null) => void;

  schedulePod: (podId: string) => void;
  scheduleAllPods: () => void;
  resetCluster: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      nodes: [],
      pods: [],
      selectedNode: null,
      selectedPod: null,
      scheduler: new Engine({ algorithm: 'bin-packing', enablePreemption: true }),
      schedulingDecisions: new Map(),

      setNodes: (nodes) => {
        const { scheduler } = get();
        scheduler.setNodes(nodes);
        set({ nodes });
      },

      setPods: (pods) => {
        const { scheduler } = get();
        scheduler.setPods(pods);
        set({ pods });
      },

      addNode: (node) => set((state) => {
        const newNodes = [...state.nodes, node];
        state.scheduler.setNodes(newNodes);
        return { nodes: newNodes };
      }),

      removeNode: (nodeId) => set((state) => {
        const newNodes = state.nodes.filter(n => n.id !== nodeId);
        state.scheduler.setNodes(newNodes);
        return { 
          nodes: newNodes,
          selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode
        };
      }),

      updateNode: (nodeId, updates) => set((state) => {
        const newNodes = state.nodes.map(n =>
          n.id === nodeId ? { ...n, ...updates } : n
        );
        state.scheduler.setNodes(newNodes);
        return { nodes: newNodes };
      }),

      addPod: (pod) => set((state) => {
        const newPods = [...state.pods, pod];
        state.scheduler.setPods(newPods);
        return { pods: newPods };
      }),

      removePod: (podId) => set((state) => {
        const newPods = state.pods.filter(p => p.id !== podId);
        state.scheduler.setPods(newPods);
        return { 
          pods: newPods,
          selectedPod: state.selectedPod?.id === podId ? null : state.selectedPod
        };
      }),

      selectNode: (node) => set({ selectedNode: node }),
      selectPod: (pod) => set({ selectedPod: pod }),

      schedulePod: (podId) => {
        const { scheduler, schedulingDecisions } = get();
        const decision = scheduler.schedule(podId);
        const newDecisions = new Map(schedulingDecisions);
        newDecisions.set(podId, decision);
        set({
          pods: scheduler.getPods(),
          nodes: scheduler.getNodes(),
          schedulingDecisions: newDecisions
        });
      },

      scheduleAllPods: () => {
        const { pods, scheduler } = get();
        const newDecisions = new Map<string, SchedulingDecision>();

        const pendingPods = pods.filter(p => p.status === 'pending');
        for (const pod of pendingPods) {
          const decision = scheduler.schedule(pod.id);
          newDecisions.set(pod.id, decision);
        }

        set({
          pods: scheduler.getPods(),
          nodes: scheduler.getNodes(),
          schedulingDecisions: newDecisions
        });
      },

      resetCluster: () => {
        const { scheduler } = get();
        scheduler.reset();
        set({
          nodes: [],
          pods: [],
          selectedNode: null,
          selectedPod: null,
          schedulingDecisions: new Map()
        });
      },
    }),
    {
      name: 'k8s-scheduler-storage',
      // FS-40: theme is owned by src/context/ThemeContext.tsx, so this store has
      // nothing left to persist. The key and the wrapper stay, so the cluster
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
