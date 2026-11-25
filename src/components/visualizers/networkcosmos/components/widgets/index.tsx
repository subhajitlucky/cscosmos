'use client';

// Typed registry consumed by NetworkTopic: CONCEPT_WIDGETS[concept.widget].
// The Record type forces every WidgetKind to have exactly one implementation.

import type { ComponentType } from 'react';
import type { Concept, WidgetKind } from '../../data/concepts';
import { BitsWidget } from './BitsWidget';
import { CaptureWidget } from './CaptureWidget';
import { FrameWidget } from './FrameWidget';
import { HandshakeWidget } from './HandshakeWidget';
import { HeaderWidget } from './HeaderWidget';
import { LpmWidget } from './LpmWidget';
import { QueueWidget } from './QueueWidget';
import { RouteWidget } from './RouteWidget';
import { StateWidget } from './StateWidget';
import { SubnetWidget } from './SubnetWidget';
import { TimerWidget } from './TimerWidget';
import { WindowWidget } from './WindowWidget';

export const CONCEPT_WIDGETS: Record<WidgetKind, ComponentType<{ concept: Concept }>> = {
  bits: BitsWidget,
  frame: FrameWidget,
  subnet: SubnetWidget,
  lpm: LpmWidget,
  state: StateWidget,
  window: WindowWidget,
  capture: CaptureWidget,
  handshake: HandshakeWidget,
  route: RouteWidget,
  header: HeaderWidget,
  queue: QueueWidget,
  timer: TimerWidget,
};
