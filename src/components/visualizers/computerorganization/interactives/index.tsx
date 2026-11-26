'use client';

import type { InteractiveKey } from '../data/chapters';
import { BlockDiagramBuilder } from './BlockDiagramBuilder';
import { BusWidthCalculator } from './BusWidthCalculator';

// One key per chapter. The remaining six interactives are added in the next
// build; until then their chapters get an honest placeholder, never a blank box.
export function ChapterInteractive({ kind }: { kind: InteractiveKey }) {
  switch (kind) {
    case 'block-diagram-builder':
      return <BlockDiagramBuilder />;
    case 'bus-width-calculator':
      return <BusWidthCalculator />;
    default:
      return <p className="co-muted">Interactive coming in the next build.</p>;
  }
}
