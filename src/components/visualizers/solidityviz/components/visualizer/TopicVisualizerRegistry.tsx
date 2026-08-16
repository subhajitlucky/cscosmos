import { SolidityBasicsViz } from "./topics/SolidityBasicsViz";
import { StorageLayoutViz } from "./topics/StorageLayoutViz";
import { ReentrancyViz } from "./topics/ReentrancyViz";
import { GasOptimizationViz } from "./topics/GasOptimizationViz";
import { DefaultTopicViz } from "./topics/DefaultTopicViz";

// Registry mapping topic IDs to their specific Visualizer Component
// If a specific visualizer is not found, the TopicPage handles it by rendering the DefaultTopicViz
export const visualizerRegistry: Record<string, React.ComponentType<any>> = {
    'solidity-basics': SolidityBasicsViz,
    'storage-layout': StorageLayoutViz,
    'reentrancy': ReentrancyViz,
    'gas-optimization': GasOptimizationViz,
};

// Helper to get visualizer or default
export function getVisualizerForTopic(topicId: string) {
    return visualizerRegistry[topicId] || DefaultTopicViz;
}
