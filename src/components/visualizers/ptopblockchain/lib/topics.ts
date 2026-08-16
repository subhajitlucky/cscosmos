import type { TopicConfig } from './topics/types';
import { whyP2PConfig } from './topics/why-p2p';
import { nodesPeersConfig } from './topics/nodes-peers';
import { gossipBasicsConfig } from './topics/gossip-basics';
import { duplicateHandlingConfig } from './topics/duplicate-handling';
import { networkLatencyConfig } from './topics/network-latency';
import { networkPartitionsConfig } from './topics/network-partitions';
import { peerDiscoveryConfig } from './topics/peer-discovery';
import { dosSpamMitigationConfig } from './topics/dos-spam-mitigation';
import { overlayNetworksConfig } from './topics/overlay-networks';
import { transactionPropagationConfig } from './topics/transaction-propagation';
import { blockPropagationConfig } from './topics/block-propagation';
import { resilienceFaultToleranceConfig } from './topics/resilience-fault-tolerance';

export type { TopicConfig, BriefingData, MetricItem, TopicActionArgs } from './topics/types';

export const topics: TopicConfig[] = [
  whyP2PConfig,
  nodesPeersConfig,
  gossipBasicsConfig,
  duplicateHandlingConfig,
  networkLatencyConfig,
  networkPartitionsConfig,
  peerDiscoveryConfig,
  dosSpamMitigationConfig,
  overlayNetworksConfig,
  transactionPropagationConfig,
  blockPropagationConfig,
  resilienceFaultToleranceConfig
];
