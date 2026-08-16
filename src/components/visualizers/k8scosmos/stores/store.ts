import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Pod, SchedulingDecision } from '../types/scheduler';
import { SchedulerEngine as Engine } from '../lib/scheduler';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;

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
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => {
        if (state.theme === 'light') return { theme: 'dark' };
        if (state.theme === 'dark') return { theme: 'system' };
        return { theme: 'light' };
      }),

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
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
