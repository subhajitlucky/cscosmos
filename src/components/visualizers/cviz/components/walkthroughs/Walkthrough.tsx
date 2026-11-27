'use client';

import React from 'react';
import type { CWalkthrough } from '../../data/walkthrough-types';
import { PointerChainWalkthrough } from './PointerChainWalkthrough';
import { ArrayWalkWalkthrough } from './ArrayWalkWalkthrough';

export function Walkthrough({ config }: { config: CWalkthrough }) {
  if (config.kind === 'pointer-chain') return <PointerChainWalkthrough />;
  return <ArrayWalkWalkthrough />;
}
