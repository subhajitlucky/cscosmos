'use client';

import type { AnimationSpec } from '@/data/interview/types';
import { StepFlow } from './StepFlow';
import { CodeTrace } from './CodeTrace';
import { Timeline } from './Timeline';
import { BeforeAfter } from './BeforeAfter';
import { MemoryDiagram } from './MemoryDiagram';
import { AttentionScaling } from './custom/AttentionScaling';

export function AnimationBlock({ spec }: { spec: AnimationSpec }) {
  switch (spec.kind) {
    case 'step-flow':
      return <StepFlow spec={spec} />;
    case 'code-trace':
      return <CodeTrace spec={spec} />;
    case 'timeline':
      return <Timeline spec={spec} />;
    case 'before-after':
      return <BeforeAfter spec={spec} />;
    case 'memory-diagram':
      return <MemoryDiagram spec={spec} />;
    case 'custom':
      return <AttentionScaling />;
  }
}
