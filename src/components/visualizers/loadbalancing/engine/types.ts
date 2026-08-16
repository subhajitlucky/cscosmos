export type RequestStatus = 'pending' | 'routing' | 'processing' | 'completed' | 'failed' | 'retrying';

export interface Request {
  id: string;
  timestamp: number;
  status: RequestStatus;
  targetNodeId?: string;
  targetNodeIndex?: number;
  latency: number;
  retryCount: number;
  color: string;
}

export interface Node {
  id: string;
  name: string;
  status: 'healthy' | 'unhealthy' | 'draining';
  weight: number;
  currentConnections: number;
  totalRequestsProcessed: number;
  errorRate: number; // 0 to 1
  baseLatency: number; // ms
}

export type LBAlgorithm = 
  | 'round-robin' 
  | 'weighted-round-robin' 
  | 'least-connections' 
  | 'least-response-time' 
  | 'random' 
  | 'ip-hash';

export type SimulationMode = 
  | 'default'
  | 'reverse-proxy'
  | 'client-side'
  | 'l4'
  | 'l7'
  | 'consistent-hashing'
  | 'health-checks'
  | 'backend-failures'
  | 'circuit-breaker'
  | 'sticky-sessions'
  | 'cdn'
  | 'autoscaling'
  | 'retries'
  | 'bottleneck'
  | 'global-lb'
  | 'single-point-of-failure';

export interface SimulationState {
  nodes: Node[];
  algorithm: LBAlgorithm;
  mode: SimulationMode;
  requests: Request[];
  isPaused: boolean;
  requestRate: number; // requests per second
  simulationSpeed: number;
}
