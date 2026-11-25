'use client';

import { isPassiveLayer, OSI_LAYERS, simLayerToOsi, type SimLayer } from './layers';
import { LayerStation } from './LayerStation';

export interface JourneyMapProps {
  activeLayer?: SimLayer;
  className?: string;
}

export function JourneyMap({ activeLayer, className = '' }: JourneyMapProps) {
  const activeOsiLayer = activeLayer ? simLayerToOsi(activeLayer) : undefined;

  return (
    <section
      aria-label="OSI layer journey"
      className={`rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">OSI layers</h3>
      <ol aria-label="Seven OSI layers, application to physical" className="space-y-1.5">
        {OSI_LAYERS.map((layer) => {
          const passive = isPassiveLayer(layer);
          return (
            <li key={layer}>
              <LayerStation
                layer={layer}
                active={layer === activeOsiLayer && !passive}
                note={passive ? 'Not exercised by this simulator' : undefined}
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
