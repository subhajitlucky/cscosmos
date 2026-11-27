'use client';

import React from 'react';
import type { DBMSWalkthrough } from '../../data/walkthrough-types';
import { ERDWalkthrough } from './ERDWalkthrough';
import { AlgebraWalkthrough } from './AlgebraWalkthrough';
import { NormalizationWalkthrough } from './NormalizationWalkthrough';
import { TransactionStateWalkthrough } from './TransactionStateWalkthrough';
import { LockingWalkthrough } from './LockingWalkthrough';

export function Walkthrough({ config }: { config: DBMSWalkthrough }) {
  if (config.kind === 'erd') return <ERDWalkthrough cardinality={config.cardinality} />;
  if (config.kind === 'algebra') return <AlgebraWalkthrough operation={config.operation} />;
  if (config.kind === 'normalization') return <NormalizationWalkthrough form={config.form} />;
  if (config.kind === 'transaction-states') return <TransactionStateWalkthrough />;
  return <LockingWalkthrough />;
}
