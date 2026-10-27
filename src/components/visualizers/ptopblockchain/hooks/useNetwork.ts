import { useState, useCallback, useRef, useEffect } from 'react';
import { NetworkManager } from '../lib/simulation/NetworkManager';
import type { NetworkLog } from '../lib/simulation/NetworkManager';
import type { NetworkState, Node, PacketType } from '../lib/simulation/types';

export const useNetwork = (initialState: NetworkState) => {
  const [state, setState] = useState<NetworkState>(initialState);
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [speed, setSpeedState] = useState(1);
  const [isPaused, setIsPausedState] = useState(false);
  const managerRef = useRef<NetworkManager | null>(null);
  // The manager is created in an effect, not while rendering. Its constructor
  // appends a "Network initialized" log stamped with `Date.now()`, which the
  // playground renders — so building it during render put the build machine's
  // clock into the pre-rendered HTML and guaranteed a hydration mismatch. The
  // first render is driven by `initialState` either way.
  const initialStateRef = useRef(initialState);

  useEffect(() => {
    if (managerRef.current) return;
    managerRef.current = new NetworkManager(initialStateRef.current, (s: NetworkState, l: NetworkLog[]) => {
      setState(s);
      setLogs(l);
    });
  }, []);

  const addNode = useCallback((node: Node) => {
    managerRef.current?.addNode(node);
  }, []);

  const removeNode = useCallback((id: string) => {
    managerRef.current?.removeNode(id);
  }, []);

  const killNode = useCallback((id: string) => {
    managerRef.current?.killNode(id);
  }, []);

  const connectNodes = useCallback((id1: string, id2: string) => {
    managerRef.current?.connectNodes(id1, id2);
  }, []);

  const disconnectNodes = useCallback((id1: string, id2: string) => {
    managerRef.current?.disconnectNodes(id1, id2);
  }, []);

  const broadcast = useCallback((fromId: string, type: PacketType, payloadId: string, fanOut?: number, fee?: number) => {
    managerRef.current?.broadcast(fromId, type, payloadId, fanOut, fee);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    managerRef.current?.setSpeed(newSpeed);
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    setIsPausedState(paused);
    managerRef.current?.setPaused(paused);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      managerRef.current?.tick(16);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const reset = useCallback((newState: NetworkState) => {
    managerRef.current = new NetworkManager(newState, (s: NetworkState, l: NetworkLog[]) => {
      setState(s);
      setLogs(l);
    });
    setState(newState);
    setLogs([]);
    setSpeedState(1);
    setIsPausedState(false);
  }, []);

  return {
    state,
    logs,
    speed,
    isPaused,
    addNode,
    removeNode,
    killNode,
    connectNodes,
    disconnectNodes,
    broadcast,
    reset,
    setSpeed,
    setPaused
  };
};