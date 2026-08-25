// DFIR case-file data for the incident reconstruction board.
// Pure data - no browser APIs - safe for module scope.
// Timestamps are deliberately NOT shown on cards: analysts must order
// evidence by content correlation, not by clocks (hosts skew anyway).

export type EvidenceKind = 'log' | 'auth' | 'file' | 'netflow';

export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  label: string;
  host: string;
  detail: string;
  /** Ids this evidence cross-references - they normally happen BEFORE this item. */
  references: string[];
  /** Gentle hint shown when a referenced item sits later in the timeline. */
  referenceHint: string;
}

export const EVIDENCE: EvidenceItem[] = [
  {
    id: 'vpn-auth',
    kind: 'auth',
    label: 'VPN gateway record',
    host: 'vpn-gw-01',
    detail:
      'Contractor login j.alvarez succeeded from a country never seen for this account; MFA satisfied by a remembered device.',
    references: [],
    referenceHint: '',
  },
  {
    id: 'svc-auth',
    kind: 'auth',
    label: 'Service account logon',
    host: 'ws-fin',
    detail:
      'Interactive logon for account backup-svc on a finance workstation. Service accounts have no reason to sit down at a desk.',
    references: ['vpn-auth'],
    referenceHint:
      'Interactive use of a service account usually follows stolen credentials - something has to come before it.',
  },
  {
    id: 'drop-file',
    kind: 'file',
    label: 'Binary written to temp',
    host: 'ws-fin',
    detail:
      'sync_helper.exe appeared in %TEMP%, written seconds after an odd interactive logon on the same host.',
    references: ['svc-auth'],
    referenceHint:
      'The file landed right after that suspicious logon - it should trail the account activity, not lead it.',
  },
  {
    id: 'task-log',
    kind: 'log',
    label: 'Scheduled task created',
    host: 'ws-fin',
    detail:
      'New task HealthCheck\\SyncHelper registered to run %TEMP%\\sync_helper.exe daily at 02:45 under the logged-on user.',
    references: ['drop-file'],
    referenceHint:
      'A task cannot point at a file that does not exist yet - the binary has to land first.',
  },
  {
    id: 'beacon-flow',
    kind: 'netflow',
    label: 'Periodic outbound sessions',
    host: 'edge-fw',
    detail:
      'Uniform encrypted flows from ws-fin to 203.0.113.77 every 60 seconds, matching size, starting in the small hours. (Documentation-range address.)',
    references: ['task-log'],
    referenceHint:
      'A steady heartbeat smells like that scheduled task finally firing - persistence comes before traffic.',
  },
  {
    id: 'stage-copy',
    kind: 'log',
    label: 'Archive staged on web root',
    host: 'ws-fin',
    detail:
      '412 MB archive copied to an internet-facing directory, then downloaded once from an external address minutes later.',
    references: ['beacon-flow'],
    referenceHint:
      'Bulk collection usually comes last - attackers gather after they trust their access, not before.',
  },
];

/** Ground-truth chronological order of EVIDENCE ids. */
export const TRUE_ORDER: string[] = [
  'vpn-auth',
  'svc-auth',
  'drop-file',
  'task-log',
  'beacon-flow',
  'stage-copy',
];

export interface NarrativeStep {
  id: string;
  text: string;
}

export const NARRATIVE: NarrativeStep[] = [
  { id: 'vpn-auth', text: 'Stolen contractor credentials slip past the VPN because the attacker also controls the remembered MFA device.' },
  { id: 'svc-auth', text: 'On the finance workstation the intruder logs in interactively as backup-svc, hoping service-account noise hides them.' },
  { id: 'drop-file', text: 'A small utility named sync_helper.exe is dropped into %TEMP% - the operator\'s toolkit arrives.' },
  { id: 'task-log', text: 'Persistence is nailed down via a scheduled task disguised as a health check, set to fire at 02:45 daily.' },
  { id: 'beacon-flow', text: 'The implant beacons home every 60 seconds with machine-like regularity, opening a quiet command channel.' },
  { id: 'stage-copy', text: 'With reliable access established, 412 MB is archived onto the web root and pulled out in one download.' },
];

export const GROUND_TRUTH =
  'One phishing-free intrusion: compromised contractor credentials, then hands on keyboard. ' +
  'The actor abused an over-privileged service account for initial execution, persisted with a scheduled task, ' +
  'and exfiltrated through the corporate egress. Clocks on the four hosts disagree by up to four minutes, which is ' +
  'why ordering was built on cross-references rather than timestamps. The beacon destination uses the reserved ' +
  '203.0.113.0/24 documentation range - synthetic throughout.';

export const EVIDENCE_BY_ID: Record<string, EvidenceItem> = EVIDENCE.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, EvidenceItem>
);

export const KIND_TAG: Record<EvidenceKind, string> = {
  log: 'LOG',
  auth: 'AUTH',
  file: 'FILE',
  netflow: 'NETFLOW',
};

/** Deterministic shuffle so server and client renders agree. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = Math.floor((s / 4294967296) * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
