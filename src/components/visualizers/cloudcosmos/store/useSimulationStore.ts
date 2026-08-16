import { create } from 'zustand';

export interface Instance {
  id: string;
  status: 'initializing' | 'healthy' | 'unhealthy' | 'terminating';
  az: string;
  load: number; // 0 to 100
  createdAt: number;
}

export interface SimulationLog {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
}

export interface SimulationState {
  instances: Instance[];
  trafficRate: number; // requests per second
  autoScalingEnabled: boolean;
  activeAZs: string[];
  logs: SimulationLog[];
  metrics: {
    latency: number;
    errorRate: number;
    cpuUtilization: number;
  };
  
  // Actions
  addInstance: (az?: string) => void;
  removeInstance: (id: string) => void;
  setTrafficRate: (rate: number) => void;
  toggleAutoScaling: () => void;
  toggleAZ: (az: string) => void;
  simulateFailure: (id: string) => void;
  addLog: (message: string, type?: SimulationLog['type']) => void;
  reset: () => void;
  tick: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  instances: [
    { id: 'i-1', status: 'healthy', az: 'us-east-1a', load: 0, createdAt: Date.now() },
    { id: 'i-2', status: 'healthy', az: 'us-east-1b', load: 0, createdAt: Date.now() },
  ],
  trafficRate: 10,
  autoScalingEnabled: false,
  activeAZs: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  logs: [{ id: '1', message: 'Simulation initialized', type: 'info', timestamp: Date.now() }],
  metrics: {
    latency: 20,
    errorRate: 0,
    cpuUtilization: 0,
  },

  addLog: (message, type = 'info') => set((state) => ({
    logs: [{ id: Math.random().toString(36), message, type, timestamp: Date.now() }, ...state.logs].slice(0, 50)
  })),

  addInstance: (az) => set((state) => {
    const availableAZs = state.activeAZs;
    if (availableAZs.length === 0) return state;
    const targetAZ = az || availableAZs[Math.floor(Math.random() * availableAZs.length)];
    const newId = `i-${Math.random().toString(36).substr(2, 5)}`;
    const newInstance: Instance = {
      id: newId,
      status: 'initializing',
      az: targetAZ,
      load: 0,
      createdAt: Date.now(),
    };
    get().addLog(`Scaling out: Adding instance ${newId} in ${targetAZ}`, 'info');
    return { instances: [...state.instances, newInstance] };
  }),

  removeInstance: (id) => set((state) => {
    get().addLog(`Terminating instance ${id}`, 'warning');
    return { instances: state.instances.filter(i => i.id !== id) };
  }),

  setTrafficRate: (rate) => set({ trafficRate: rate }),

  toggleAutoScaling: () => set((state) => {
    const next = !state.autoScalingEnabled;
    get().addLog(`Auto Scaling Group (ASG) ${next ? 'enabled' : 'disabled'}`, 'success');
    return { autoScalingEnabled: next };
  }),

  toggleAZ: (az) => set((state) => {
    const isActive = state.activeAZs.includes(az);
    const newActiveAZs = isActive 
      ? state.activeAZs.filter(a => a !== az)
      : [...state.activeAZs, az];
    
    get().addLog(`AZ ${az} is now ${isActive ? 'OFFLINE' : 'ONLINE'}`, isActive ? 'error' : 'success');

    const newInstances = state.instances.map(inst => {
      if (inst.az === az && isActive) {
        return { ...inst, status: 'unhealthy' as const };
      }
      return inst;
    });

    return { activeAZs: newActiveAZs, instances: newInstances };
  }),

  simulateFailure: (id) => set((state) => {
    get().addLog(`Instance ${id} failure detected!`, 'error');
    return {
      instances: state.instances.map(inst => 
        inst.id === id ? { ...inst, status: 'unhealthy' } : inst
      )
    };
  }),

  reset: () => set({
    instances: [
      { id: 'i-1', status: 'healthy', az: 'us-east-1a', load: 0, createdAt: Date.now() },
      { id: 'i-2', status: 'healthy', az: 'us-east-1b', load: 0, createdAt: Date.now() },
    ],
    trafficRate: 10,
    autoScalingEnabled: false,
    activeAZs: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
    logs: [{ id: '1', message: 'Simulation reset', type: 'info', timestamp: Date.now() }],
    metrics: {
      latency: 20,
      errorRate: 0,
      cpuUtilization: 0,
    },
  }),

  tick: () => set((state) => {
    const healthyInstances = state.instances.filter(i => i.status === 'healthy' && state.activeAZs.includes(i.az));
    const numHealthy = healthyInstances.length;
    
    // Calculate new metrics
    let newCpuUtilization = 0;
    let newErrorRate = 0;
    let newLatency = 20;

    if (numHealthy > 0) {
      const loadPerInstance = state.trafficRate / numHealthy;
      newCpuUtilization = Math.min(100, (loadPerInstance / 20) * 100);
      
      if (newCpuUtilization > 80) {
        newLatency = 20 + (newCpuUtilization - 80) * 5;
        newErrorRate = (newCpuUtilization - 80) / 2;
      }
    } else {
      newErrorRate = 100;
      newLatency = 0;
    }

    // Auto-scaling logic
    const updatedInstances = state.instances.map(inst => {
      if (inst.status === 'initializing' && Date.now() - inst.createdAt > 3000) {
        return { ...inst, status: 'healthy' as const };
      }
      if (inst.status === 'healthy' && !state.activeAZs.includes(inst.az)) {
        return { ...inst, status: 'unhealthy' as const };
      }
      
      // Update load for healthy instances
      if (inst.status === 'healthy') {
        return { ...inst, load: newCpuUtilization };
      }

      return inst;
    });

    // Auto-scale out
    if (state.autoScalingEnabled && newCpuUtilization > 70 && updatedInstances.length < 10) {
       // logic to add instance is handled by calling addInstance in an effect or here? 
       // For simplicity, let's just do it here if we want but it's better to keep tick pure-ish
    }

    return {
      instances: updatedInstances,
      metrics: {
        latency: newLatency,
        errorRate: newErrorRate,
        cpuUtilization: newCpuUtilization
      }
    };
  }),
}));
