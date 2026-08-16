import { useState, useCallback, useMemo } from 'react';
import { EVMEngine } from '../lib/evm/engine';
import { hexToUint8Array } from '../lib/evm/utils';
import type { EVMState } from '../types/evm';
import { EVMAssistant } from '../lib/evm/agent';
import type { AgentResponse } from '../lib/evm/agent';

const assistant = new EVMAssistant();

export const useEVM = (initialBytecode?: string) => {
  const initialData = useMemo(() => {
    if (!initialBytecode) return null;
    try {
      const code = hexToUint8Array(initialBytecode);
      const engine = new EVMEngine(code);
      const state = engine.getState();
      const response = assistant.analyze(state);
      return { engine, state, response };
    } catch {
      return null;
    }
  }, [initialBytecode]);

  const [engine, setEngine] = useState<EVMEngine | null>(initialData?.engine || null);
  const [state, setState] = useState<EVMState | null>(initialData?.state || null);
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(initialData?.response || null);

  const reset = useCallback((bytecode: string) => {
    try {
      const code = hexToUint8Array(bytecode);
      const newEngine = new EVMEngine(code);
      const initialState = newEngine.getState();
      setEngine(newEngine);
      setState(initialState);
      setAgentResponse(assistant.analyze(initialState));
    } catch {
      console.error('Invalid bytecode');
    }
  }, []);

  const step = useCallback(() => {
    if (engine) {
      engine.step();
      const newState = engine.getState();
      setState(newState);
      setAgentResponse(assistant.analyze(newState));
    }
  }, [engine]);

  const undo = useCallback(() => {
    if (engine) {
      engine.undo();
      const newState = engine.getState();
      setState(newState);
      setAgentResponse(assistant.analyze(newState));
    }
  }, [engine]);

  return { engine, state, agentResponse, step, undo, reset, setEngine, setState, setAgentResponse };
};
