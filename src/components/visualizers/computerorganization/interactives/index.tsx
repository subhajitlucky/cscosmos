'use client';

import type { InteractiveKey } from '../data/chapters';
import { AddressSpaceExplorer } from './AddressSpaceExplorer';
import { ArchitectureCompare } from './ArchitectureCompare';
import { BlockDiagramBuilder } from './BlockDiagramBuilder';
import { BusWidthCalculator } from './BusWidthCalculator';
import { CpuSignalTracer } from './CpuSignalTracer';
import { InstructionCycleStepper } from './InstructionCycleStepper';
import { IoModeSimulator } from './IoModeSimulator';
import { PerformanceCalculator } from './PerformanceCalculator';

// One distinct, subject-native tool per chapter.
export function ChapterInteractive({ kind }: { kind: InteractiveKey }) {
  switch (kind) {
    case 'block-diagram-builder':
      return <BlockDiagramBuilder />;
    case 'cpu-signal-tracer':
      return <CpuSignalTracer />;
    case 'bus-width-calculator':
      return <BusWidthCalculator />;
    case 'instruction-cycle-stepper':
      return <InstructionCycleStepper />;
    case 'address-space-explorer':
      return <AddressSpaceExplorer />;
    case 'io-mode-simulator':
      return <IoModeSimulator />;
    case 'architecture-compare':
      return <ArchitectureCompare />;
    case 'performance-calculator':
      return <PerformanceCalculator />;
    default:
      // Unreachable for every valid InteractiveKey.
      return null;
  }
}
