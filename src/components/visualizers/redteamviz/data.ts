// Defensive kill-chain teaching data for the red-team simulator.
// MITRE ATT&CK technique names provide the defenders' shared vocabulary.
// Conceptual descriptions only - no exploit content, commands, or real targets.

export type NodeId = 'mail' | 'laptop' | 'ws-hr' | 'ws-fin' | 'dc';

export type StageKey = 'phishing' | 'foothold' | 'privesc' | 'lateral' | 'c2';

export interface NetworkNode {
  id: NodeId;
  label: string;
  role: string;
  x: number;
  y: number;
}

export interface LogLine {
  source: string;
  line: string;
}

export interface KillChainStage {
  key: StageKey;
  num: number;
  title: string;
  technique: string;
  tactic: string;
  targetNode: NodeId;
  attackerView: string;
  defenderLogs: LogLine[];
  lesson: string;
}

export interface DetectionControl {
  id: string;
  stage: StageKey;
  name: string;
  howItWorks: string;
}

export const NODES: NetworkNode[] = [
  { id: 'mail', label: 'MAIL-SRV', role: 'DMZ mail relay', x: 26, y: 40 },
  { id: 'laptop', label: 'USER-LAPTOP', role: 'Accounting client', x: 212, y: 40 },
  { id: 'ws-hr', label: 'WS-HR', role: 'HR workstation', x: 396, y: 40 },
  { id: 'ws-fin', label: 'WS-FIN', role: 'Finance station', x: 212, y: 186 },
  { id: 'dc', label: 'DC-CORE', role: 'Domain controller', x: 396, y: 186 },
];

export const EDGES: Array<[NodeId, NodeId]> = [
  ['mail', 'laptop'],
  ['laptop', 'ws-hr'],
  ['laptop', 'ws-fin'],
  ['ws-fin', 'dc'],
  ['ws-hr', 'dc'],
];

export const ORDER: StageKey[] = ['phishing', 'foothold', 'privesc', 'lateral', 'c2'];

export const STAGES: KillChainStage[] = [
  {
    key: 'phishing',
    num: 1,
    title: 'Phishing',
    technique: 'T1566.01 Spearphishing Attachment',
    tactic: 'Initial Access',
    targetNode: 'laptop',
    attackerView:
      'A themed invoice lands in the accounting inbox. The message is deliberately ordinary: one attachment, one line of urgency. The operator needs nothing more than a click - the recipient performs the delivery.',
    defenderLogs: [
      { source: 'MAIL GATEWAY', line: 'deliver from=billing@partner-example.test to=ap@corp.test subj="Invoice 8841" attach=1 spf=pass' },
      { source: 'ENDPOINT AGENT', line: 'user opened Invoice_8841.docx from Downloads folder (telemetry event)' },
    ],
    lesson:
      'Email is the boundary before the boundary. The gateway sees metadata, the endpoint sees behavior - neither alone sees intent.',
  },
  {
    key: 'foothold',
    num: 2,
    title: 'Foothold',
    technique: 'T1204.02 User Execution: Malicious File',
    tactic: 'Execution',
    targetNode: 'laptop',
    attackerView:
      'The document politely asks the user to enable content. One approval later, a script interpreter runs as a child of the document reader - a parent-child pairing no normal workflow ever produces.',
    defenderLogs: [
      { source: 'EDR TELEMETRY', line: 'lineage: word processor -> script host spawned from %TEMP% (unusual parent)' },
      { source: 'EVENT 4688', line: 'new process created on USER-LAPTOP in session of user j.mehta' },
    ],
    lesson:
      'Footholds borrow trust from everyday tools. Process lineage - who spawned whom - is the strongest early signal defenders have.',
  },
  {
    key: 'privesc',
    num: 3,
    title: 'Privilege Escalation',
    technique: 'T1548.02 Abuse Elevation Control Mechanism',
    tactic: 'Privilege Escalation',
    targetNode: 'laptop',
    attackerView:
      'Running as a standard user is cramped. The operator borrows a signed system helper that quietly starts processes at high integrity without a prompt - the request never looks like a request.',
    defenderLogs: [
      { source: 'EVENT 4688', line: 'high-integrity token issued to child of medium-integrity parent (auto-approve path)' },
      { source: 'EDR TELEMETRY', line: 'auto-elevate helper invoked with abnormal arguments from user-writable path' },
    ],
    lesson:
      'Privilege boundaries fail silently when convenience features auto-trust signed binaries. Watch integrity transitions, not just prompts.',
  },
  {
    key: 'lateral',
    num: 4,
    title: 'Lateral Movement',
    technique: 'T1021.02 Remote Services: Admin Shares',
    tactic: 'Lateral Movement',
    targetNode: 'dc',
    attackerView:
      'Holding admin rights on one workstation, the operator reaches toward the domain controller over remote-admin shares - reusing the stolen session context. No new credentials are ever typed.',
    defenderLogs: [
      { source: 'EVENT 4624', line: 'logon type 3 (network) on DC-CORE from USER-LAPTOP account=j.mehta' },
      { source: 'EVENT 5140', line: 'administrative share accessed on DC-CORE from internal host 10.20.30.145' },
      { source: 'POLICY ENGINE', line: 'workstation-originated administration of tier-0 asset outside change window' },
    ],
    lesson:
      'Workstations have no business administrating domain controllers. A tiered admin model makes this path structurally impossible - not merely detectable.',
  },
  {
    key: 'c2',
    num: 5,
    title: 'C2 Beacon',
    technique: 'T1071.01 Application Layer Protocol: Web',
    tactic: 'Command and Control',
    targetNode: 'dc',
    attackerView:
      'The implant checks in on a steady heartbeat dressed as ordinary web traffic - small, periodic, patient. Instructions arrive inside responses; stolen data leaves inside posts. Nothing shouts.',
    defenderLogs: [
      { source: 'EGRESS PROXY', line: 'periodic encrypted sessions DC-CORE -> 203.0.113.77 every 60s (+/- 2s, uniform size)' },
      { source: 'DNS RESOLVER', line: 'first-ever query for freshly registered domain from DC-CORE at 02:47 UTC' },
    ],
    lesson:
      'Beacons are rhythm machines. Humans are random; timers are not. Cadence analytics catch what payload inspection misses. (203.0.113.x is reserved documentation space.)',
  },
];

export const CONTROLS: DetectionControl[] = [
  {
    id: 'ctl-mail',
    stage: 'phishing',
    name: 'Attachment Detonation Sandbox',
    howItWorks: 'Unknown attachments open in an isolated runner first; anything that misbehaves never reaches a human inbox.',
  },
  {
    id: 'ctl-edr',
    stage: 'foothold',
    name: 'EDR Behavioral Block',
    howItWorks: 'Script interpreters spawning from document readers are terminated on creation, not merely logged.',
  },
  {
    id: 'ctl-uac',
    stage: 'privesc',
    name: 'UAC Hardening + Integrity Alerts',
    howItWorks: 'Auto-approval paths are disabled and any integrity-level jump raises an immediate alert.',
  },
  {
    id: 'ctl-tier',
    stage: 'lateral',
    name: 'Tiered Admin Model',
    howItWorks: 'Workstation credentials cannot authenticate to tier-0 assets; the administrative share mount is denied outright.',
  },
  {
    id: 'ctl-egress',
    stage: 'c2',
    name: 'Egress Beacon Analytics',
    howItWorks: 'Uniform-interval outbound sessions trip a cadence alert and the destination is sinkholed pending review.',
  },
];

export const STAGE_BY_KEY: Record<StageKey, KillChainStage> = STAGES.reduce(
  (acc, s) => {
    acc[s.key] = s;
    return acc;
  },
  {} as Record<StageKey, KillChainStage>
);
