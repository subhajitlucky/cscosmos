'use client';

import React from 'react';
import type { CWalkthrough } from '../../data/walkthrough-types';
import { PointerChainWalkthrough } from './PointerChainWalkthrough';
import { ArrayWalkWalkthrough } from './ArrayWalkWalkthrough';
import { StructLayoutWalkthrough } from './StructLayoutWalkthrough';
import { HeapWalkthrough } from './HeapWalkthrough';
import { FileLifecycleWalkthrough } from './FileLifecycleWalkthrough';
import { BitwiseWalkthrough } from './BitwiseWalkthrough';

export function Walkthrough({ config }: { config: CWalkthrough }) {
  if (config.kind === 'pointer-chain') return <PointerChainWalkthrough />;
  if (config.kind === 'array-walk') return <ArrayWalkWalkthrough />;
  if (config.kind === 'struct-layout') {
    return (
      <StructLayoutWalkthrough
        name={config.name}
        fields={config.fields}
        totalSize={config.totalSize}
        padding={config.padding}
      />
    );
  }
  if (config.kind === 'heap') {
    return <HeapWalkthrough bytes={config.bytes} values={config.values} />;
  }
  if (config.kind === 'file-lifecycle') {
    return <FileLifecycleWalkthrough filename={config.filename} line={config.line} />;
  }
  return <BitwiseWalkthrough mode={config.mode} />;
}
