// Shared OSI-layer vocabulary for the journey lab primitives.
// Pure data and functions: safe to import during SSG.

export const OSI_LAYERS = [
  'Application',
  'Presentation',
  'Session',
  'Transport',
  'Network',
  'Data Link',
  'Physical',
] as const;

/** The five layer names emitted by the packet-journey simulator. */
export type SimLayer = 'Application' | 'Transport' | 'Network' | 'Link' | 'Physical';

type OsiLayer = (typeof OSI_LAYERS)[number];

const SIM_TO_OSI: Record<SimLayer, OsiLayer> = {
  Application: 'Application',
  Transport: 'Transport',
  Network: 'Network',
  Link: 'Data Link',
  Physical: 'Physical',
};

const PASSIVE_LAYERS: ReadonlySet<string> = new Set<OsiLayer>(['Presentation', 'Session']);

/** Maps a simulator layer name to its OSI label; passes through unknown names. */
export function simLayerToOsi(name: string): string {
  return SIM_TO_OSI[name as SimLayer] ?? name;
}

/** Presentation and Session exist in the OSI model but are not simulated. */
export function isPassiveLayer(name: string): boolean {
  return PASSIVE_LAYERS.has(name);
}
