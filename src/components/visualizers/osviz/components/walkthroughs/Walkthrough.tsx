'use client';

import React from 'react';
import type { OSWalkthrough } from '../../data/walkthrough-types';
import { SchedulerWalkthrough } from './SchedulerWalkthrough';
import { PageReplacementWalkthrough } from './PageReplacementWalkthrough';
import { PagingWalkthrough } from './PagingWalkthrough';
import { FatWalkthrough } from './FatWalkthrough';

export function Walkthrough({ config }: { config: OSWalkthrough }) {
  if (config.kind === 'scheduler') {
    return (
      <SchedulerWalkthrough
        processes={config.processes}
        algorithm={config.algorithm}
        quantum={config.quantum}
      />
    );
  }

  if (config.kind === 'page-replacement') {
    return (
      <PageReplacementWalkthrough
        references={config.references}
        frameCount={config.frameCount}
        defaultPolicy={config.defaultPolicy}
      />
    );
  }

  if (config.kind === 'paging') {
    return (
      <PagingWalkthrough
        virtualAddress={config.virtualAddress}
        pageSize={config.pageSize}
        pageTable={config.pageTable}
      />
    );
  }

  return <FatWalkthrough start={config.start} fat={config.fat} totalBlocks={config.totalBlocks} />;
}
