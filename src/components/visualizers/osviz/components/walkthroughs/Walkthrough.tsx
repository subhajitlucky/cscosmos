'use client';

import React from 'react';
import type { OSWalkthrough } from '../../data/walkthrough-types';
import { SchedulerWalkthrough } from './SchedulerWalkthrough';
import { PageReplacementWalkthrough } from './PageReplacementWalkthrough';
import { PagingWalkthrough } from './PagingWalkthrough';
import { FatWalkthrough } from './FatWalkthrough';
import { ProcessStateWalkthrough } from './ProcessStateWalkthrough';
import { TlbWalkthrough } from './TlbWalkthrough';
import { SegmentationWalkthrough } from './SegmentationWalkthrough';
import { IndexedAllocationWalkthrough } from './IndexedAllocationWalkthrough';
import { ExternalSortWalkthrough } from './ExternalSortWalkthrough';

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

  if (config.kind === 'process-states') {
    return <ProcessStateWalkthrough processId={config.processId} />;
  }

  if (config.kind === 'tlb') {
    return (
      <TlbWalkthrough
        virtualAddress={config.virtualAddress}
        pageSize={config.pageSize}
        pageTable={config.pageTable}
      />
    );
  }

  if (config.kind === 'segmentation') {
    return (
      <SegmentationWalkthrough
        segments={config.segments}
        segmentIndex={config.segmentIndex}
        offset={config.offset}
      />
    );
  }

  if (config.kind === 'indexed') {
    return (
      <IndexedAllocationWalkthrough
        indexBlock={config.indexBlock}
        pointers={config.pointers}
        requestedBlock={config.requestedBlock}
      />
    );
  }

  if (config.kind === 'external-sort') {
    return <ExternalSortWalkthrough chunks={config.chunks} />;
  }

  return <FatWalkthrough start={config.start} fat={config.fat} totalBlocks={config.totalBlocks} />;
}
