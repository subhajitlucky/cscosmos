import type { NetworkState, PacketType } from '../simulation/types';

export interface MetricItem {
  label: string;
  desc: string;
}

export interface BriefingData {
  arch: MetricItem[];
  logic: MetricItem[];
}

export interface TopicActionArgs {
  state: NetworkState;
  broadcast: (fromId: string, type: PacketType, payloadId: string, fanOut?: number, fee?: number) => void;
  connectNodes: (id1: string, id2: string) => void;
  killNode: (id: string) => void;
  togglePause: () => void;
  isPaused: boolean;
}

export interface TopicConfig {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  analogy: string;
  initialState: NetworkState;
  interactiveLabel: string;
  briefing: BriefingData;
  action: (args: TopicActionArgs) => void;
}
