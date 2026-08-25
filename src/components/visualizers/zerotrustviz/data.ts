// Castle-and-moat vs zero-trust request-journey knowledge base.
// Pure data - no browser APIs - safe for module scope.

export type Mode = 'castle' | 'zero-trust';

export interface StageDef {
  id: string;
  label: string;
  sub: string;
}

/** Verification stages a zero-trust request must clear, in order. */
export const ZERO_TRUST_STAGES: StageDef[] = [
  { id: 'identity', label: 'Identity', sub: 'verify signed JWT' },
  { id: 'device', label: 'Device posture', sub: 'health cert + patches' },
  { id: 'policy', label: 'Policy check', sub: 'least-privilege rules' },
  { id: 'mtls', label: 'mTLS', sub: 'mutual TLS handshake' },
  { id: 'authorize', label: 'Authorize', sub: 'per-request scope grant' },
];

export interface ModeInfo {
  title: string;
  blurb: string;
  footnote: string;
}

export const MODE_INFO: Record<Mode, ModeInfo> = {
  castle: {
    title: 'Castle & Moat',
    blurb: 'One strong gate at the edge. Once a request crosses the moat, the interior trusts everything blindly.',
    footnote:
      'Perimeter trust means lateral movement is free: any insider foothold walks straight to the crown jewels.',
  },
  'zero-trust': {
    title: 'Zero Trust',
    blurb: 'Never trust, always verify. Every hop re-proves identity, device health, policy, channel, and scope.',
    footnote:
      'A stolen credential alone is not enough - without a healthy known device, the journey dies at hop two.',
  },
};
