// Synthetic RF knowledge base for the spectrum explorer.
// Pure data and pure math helpers - no browser APIs - safe for module scope.

export type SignalKind = 'am' | 'fm' | 'wifi' | 'mystery';

export interface SignalDef {
  id: string;
  kind: SignalKind;
  /** Real name, masked in the UI until the signal has been tuned in once. */
  name: string;
  band: string;
  /** Center frequency in MHz. */
  freqMHz: number;
  /** Occupied bandwidth in MHz. */
  bandwidthMHz: number;
  /** Easter-egg style signals hide their identity until discovered. */
  classified: boolean;
  /** Teaching blurb shown while demodulating. */
  blurb: string;
  /** Message revealed character by character once the receiver locks. */
  decodedText: string;
  /** Seed for the deterministic waveform trace. */
  seed: number;
}

export const SIGNALS: SignalDef[] = [
  {
    id: 'mw-band',
    kind: 'am',
    name: 'AM News Talk',
    band: 'Medium Wave 530-1700 kHz',
    freqMHz: 1.18,
    bandwidthMHz: 0.03,
    classified: false,
    blurb:
      'Amplitude modulation paints sound onto wave strength, so lightning and motors crash straight into the audio. Old, noisy, and it still reaches mountain valleys.',
    decodedText:
      '"...clear skies through Sunday. Fun fact: this tower has been talking to commuters since 1963."',
    seed: 11,
  },
  {
    id: 'kosm-fm',
    kind: 'fm',
    name: 'KOSM 98.5 Synthwave',
    band: 'FM Broadcast 88-108 MHz',
    freqMHz: 98.5,
    bandwidthMHz: 0.38,
    classified: false,
    blurb:
      'Frequency modulation rides on wave spacing instead of strength, which shrugs off most static. Notice the wide, steady carrier compared to the whisper-thin AM spike.',
    decodedText:
      '"You are locked to KOSM 98.5 - all synthwave, all night. Spectrum shared, never owned."',
    seed: 29,
  },
  {
    id: 'wx-radio',
    kind: 'fm',
    name: 'Weather Radio WX3',
    band: 'VHF Weather 162.4-162.55 MHz',
    freqMHz: 162.45,
    bandwidthMHz: 0.016,
    classified: false,
    blurb:
      'The same FM trick squeezed into a 25 kHz sliver. Government weather radios repeat on schedule forever - reliability beats excitement.',
    decodedText:
      '"...small craft advisory until six PM. This forecast repeats every seven minutes, day and night."',
    seed: 47,
  },
  {
    id: 'mystery',
    kind: 'mystery',
    name: 'Walkie-Talkie Ghosts',
    band: 'UHF 462 MHz GMRS gap',
    freqMHz: 462.5625,
    bandwidthMHz: 0.0125,
    classified: true,
    blurb:
      'Faint, irregular, and parked on an odd frequency nobody admits to using. Tune it dead-center and wait for the bursts.',
    decodedText:
      '"Breaker breaker - you actually found 462.5625. Nobody has listened here since 2019. Easter egg unlocked. Tell them the spectrum sent you."',
    seed: 73,
  },
  {
    id: 'wifi-ch6',
    kind: 'wifi',
    name: 'Wi-Fi Burst (Channel 6)',
    band: 'ISM 2.4 GHz',
    freqMHz: 2437,
    bandwidthMHz: 22,
    classified: false,
    blurb:
      'Not a tone at all: thousands of short packet bursts sharing one 20 MHz channel politely via listen-before-talk. Digital signals look like sparks on a waterfall.',
    decodedText:
      'SSID COSMOS-GUEST | beacon | DHCP lease 10.20.30.145 | POST /check-in -> 200 OK',
    seed: 91,
  },
];

// ---- Logarithmic spectrum axis (0.5 MHz .. 3000 MHz) -----------------------

export const FREQ_MIN_MHZ = 0.5;
export const FREQ_MAX_MHZ = 3000;

const LOG_MIN = Math.log10(FREQ_MIN_MHZ);
const LOG_SPAN = Math.log10(FREQ_MAX_MHZ) - LOG_MIN;

/** Map a frequency (MHz) to a 0..1 position on the log spectrum axis. */
export function freqToUnit(freqMHz: number): number {
  return (Math.log10(freqMHz) - LOG_MIN) / LOG_SPAN;
}

/** Inverse of freqToUnit: turn a 0..1 slider position back into MHz. */
export function unitToFreq(unit: number): number {
  return Math.pow(10, LOG_MIN + unit * LOG_SPAN);
}
