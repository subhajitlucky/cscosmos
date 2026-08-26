// STRIDE threat-model knowledge base for the workshop.
// Pure data - no browser APIs - safe for module scope.

export type ComponentId = 'user' | 'webapp' | 'api' | 'database';

export type StrideKey = 'S' | 'T' | 'R' | 'I' | 'D' | 'E';

export interface StrideMeta {
  key: StrideKey;
  letter: string;
  name: string;
  question: string;
}

export const STRIDE: StrideMeta[] = [
  { key: 'S', letter: 'S', name: 'Spoofing', question: 'How could someone pretend to be someone else here?' },
  { key: 'T', letter: 'T', name: 'Tampering', question: 'How could data be changed en route or at rest?' },
  { key: 'R', letter: 'R', name: 'Repudiation', question: 'Could an actor deny doing this later?' },
  { key: 'I', letter: 'I', name: 'Information Disclosure', question: 'What could leak that should not?' },
  { key: 'D', letter: 'D', name: 'Denial of Service', question: 'How could this be made unavailable?' },
  { key: 'E', letter: 'E', name: 'Elevation of Privilege', question: 'How could a lesser actor gain more power?' },
];

export interface ComponentInfo {
  id: ComponentId;
  label: string;
  role: string;
  trustNote: string;
}

export const COMPONENTS: ComponentInfo[] = [
  { id: 'user', label: 'User / Browser', role: 'Untrusted client device', trustNote: 'Zero trust: assume fully attacker-controlled. Anything it sends can be forged.' },
  { id: 'webapp', label: 'Web Application', role: 'Public-facing frontend + session edge', trustNote: 'Trust boundary: internet hits here first. Validates everything crossing in.' },
  { id: 'api', label: 'API Service', role: 'Business logic behind the boundary', trustNote: 'Inside the perimeter, but must re-verify - never trusts the webapp blindly.' },
  { id: 'database', label: 'Database', role: 'System of record', trustNote: 'Highest-value asset. Only parameterized queries and least-privilege accounts reach it.' },
];

export interface ThreatEntry {
  component: ComponentId;
  stride: StrideKey;
  attack: string;
  mitigation: string;
}

export const THREATS: ThreatEntry[] = [
  // ---- User / Browser ----
  { component: 'user', stride: 'S', attack: 'Stolen session cookie replayed from another machine to impersonate a logged-in user.', mitigation: 'HttpOnly + Secure + SameSite cookies, short-lived sessions, device binding.' },
  { component: 'user', stride: 'T', attack: 'Client-side price or quantity field edited in devtools before checkout POST.', mitigation: 'Server recomputes every value; client input is never authoritative.' },
  { component: 'user', stride: 'R', attack: 'User denies submitting a destructive order because there is no durable proof of who clicked.', mitigation: 'Append-only audit log keyed by authenticated identity + timestamp.' },
  { component: 'user', stride: 'I', attack: 'Shoulder-surfing or malware on a shared machine reading displayed secrets.', mitigation: 'Mask secrets by default, short clipboard lifetime, no secret persistence in localStorage.' },
  { component: 'user', stride: 'D', attack: 'Malicious page keeps thousands of connections open, exhausting app capacity for others.', mitigation: 'Per-IP rate limits, connection timeouts, CDN absorption layer.' },
  { component: 'user', stride: 'E', attack: 'Hidden admin button enabled via JS console on a regular-user machine.', mitigation: 'Authorization enforced server-side only; UI hiding is never the control.' },

  // ---- Web Application ----
  { component: 'webapp', stride: 'S', attack: 'Credential-stuffing with breached password lists lands a valid admin login.', mitigation: 'MFA, breach-password screening, adaptive rate limiting on login.' },
  { component: 'webapp', stride: 'T', attack: 'Cross-Site Scripting payload stored in a profile field rewrites page content for other users.', mitigation: 'Context-aware output encoding, strict Content-Security-Policy, sanitization at render.' },
  { component: 'webapp', stride: 'R', attack: 'Shared service account makes actions unattributable to a human when investigating abuse.', mitigation: 'Per-user identities propagated through every request; no shared accounts.' },
  { component: 'webapp', stride: 'I', attack: 'Verbose error page prints SQL query and internal paths to an end user.', mitigation: 'Generic external errors, detailed logs kept server-side only, secrets scrubbed from stack traces.' },
  { component: 'webapp', stride: 'D', attack: 'ReCaptcha-free form hammered by botnet floods signup and login endpoints.', mitigation: 'CAPTCHA/challenge on abuse signals, request budgeting, autoscaling floor limits.' },
  { component: 'webapp', stride: 'E', attack: 'Debug endpoint left enabled in production exposes admin functions without auth.', mitigation: 'Feature flags default-off, production config linting, separate debug builds.' },

  // ---- API Service ----
  { component: 'api', stride: 'S', attack: 'Internal microservice accepts caller identity from a header any pod can set.', mitigation: 'Mutual TLS between services; signed service tokens with audience checks.' },
  { component: 'api', stride: 'T', attack: 'JSON body mass-assignment slips an isAdmin:true field straight into the persistence layer.', mitigation: 'Explicit DTO allowlists; unknown fields rejected, not ignored.' },
  { component: 'api', stride: 'R', attack: 'Batch job mutates records without writing who triggered it, stalling incident response.', mitigation: 'Structured audit events with actor, purpose, and correlation IDs on every mutation.' },
  { component: 'api', stride: 'I', attack: 'BOLA/IDOR: sequential order IDs let one customer enumerate another\u2019s orders.', mitigation: 'Object-level authorization checks; UUIDs as identifiers, ownership verified per request.' },
  { component: 'api', stride: 'D', attack: 'A single 200 MB JSON payload starves parser memory and stalls the whole worker pool.', mitigation: 'Hard payload size caps, streaming parsers, per-route concurrency limits.' },
  { component: 'api', stride: 'E', attack: 'JWT stored with alg:none accepted after a library downgrade silently skips signature verification.', mitigation: 'Pin allowed algorithms, reject none, verify issuer+audience+expiry every time.' },

  // ---- Database ----
  { component: 'database', stride: 'S', attack: 'Compromised app credential connects as superuser - database cannot tell app from attacker.', mitigation: 'Least-privilege roles per service; network-level allowlist to known pods only.' },
  { component: 'database', stride: 'T', attack: 'SQL injection through a search box edits balance rows directly, bypassing app logic.', mitigation: 'Parameterized queries exclusively; ORM raw-query escape hatches code-reviewed.' },
  { component: 'database', stride: 'R', attack: 'Backdoor row deleted during a cover-up leaves no trace of who or what removed it.', mitigation: 'Point-in-time recovery plus append-only change data capture streams.' },
  { component: 'database', stride: 'I', attack: 'Unencrypted backups on object storage leak entire customer table to anyone with the bucket URL.', mitigation: 'Encryption at rest, bucket policies deny-all by default, backup access audited.' },
  { component: 'database', stride: 'D', attack: 'One unindexed report query locks hot tables and takes checkout down with it.', mitigation: 'Statement timeouts, read replicas for analytics, lock-aware query review.' },
  { component: 'database', stride: 'E', attack: 'Analyst account granted WRITE on production for a one-off fix quietly keeps it forever.', mitigation: 'Time-boxed elevated access with automatic revocation and quarterly recertification.' },
];

// Which components sit inside the trusted boundary in the diagram.
export const BOUNDARY_MEMBERS: ComponentId[] = ['api', 'database'];
// ---- Course structure for the Learn section ----

export interface Lesson {
  id: string;
  title: string;
  blurb: string;
  minutes: number;
  body: string[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'stride-overview',
    title: 'What STRIDE Actually Is',
    blurb: 'Six attacker goals, one mnemonic. The taxonomy every threat model starts with.',
    minutes: 6,
    body: [
      'STRIDE is not a checklist you complete - it is six questions you ask about every element of a system until running out of honest answers. Microsoft researchers Loren Kohnfelder and Praerit Garg framed it in 1999 and it survived because attacker goals have barely changed since.',
      'Each letter is an attacker GOAL, not an attack technique. Spoofing means appearing as someone you are not. Tampering means changing data you should not touch. Repudiation means doing something and later denying it. Information Disclosure means seeing what you should not. Denial of Service means breaking availability for others. Elevation of Privilege means gaining powers that were never yours.'
    ]
  },
  {
    id: 'trust-boundaries',
    title: 'Drawing Trust Boundaries',
    blurb: 'Where your validation lives matters more than where your code runs.',
    minutes: 7,
    body: [
      'A trust boundary is any line where data crosses from one level of trust to another. Browser to server: boundary. Webapp to API: another one, even inside your own infrastructure. API to database: yet another. Every boundary is a checkpoint where assumptions must be re-verified, because everything crossing it may be hostile.',
      'The classic mistake is drawing the boundary around the network and calling the interior trusted. That is castle-and-moat thinking. Inside-the-perimeter attackers cause some of the costliest breaches precisely because internal services historically skipped verification. Modern practice verifies at every hop.'
    ]
  },
  {
    id: 'threat-enumeration',
    title: 'Enumerating Threats Per Element',
    blurb: 'Walk each component through all six questions. Write down the honest answers.',
    minutes: 9,
    body: [
      'Enumeration is boring on purpose. Take one element - say the API service - and ask all six STRIDE questions of it in order. Spoofing: how could a caller fake its identity? Tampering: which inputs could be altered mid-flight? Continue until six answers exist, even when the answer is only we think this is hard.',
      'The output is a threat register: one row per element-times-category pairing. Rows without mitigations are not failures - they are your roadmap. A model with zero open rows usually means the model stopped too early.'
    ]
  },
  {
    id: 'mitigation-mapping',
    title: 'Mapping Mitigations to Threats',
    blurb: 'Every accepted threat gets an owner, a control, and a residual-risk note.',
    minutes: 6,
    body: [
      'A threat without a mapped mitigation is a risk acceptance, and acceptances must be explicit. For each register row choose one of four dispositions: mitigate with a control, transfer to another party, avoid by redesigning, or accept with a named owner. Vague entries like improve security are not dispositions.',
      'Good mitigations name the mechanism and the failure mode they address. MFA mitigates credential spoofing. Parameterized queries mitigate injection tampering. If you cannot name what would prove the mitigation failed, it is not a mitigation yet.'
    ]
  },
  {
    id: 'coverage-matrix',
    title: 'Reading the Coverage Matrix',
    blurb: 'Gaps in the grid are communication tools, not embarrassments.',
    minutes: 5,
    body: [
      'Lay elements on one axis and the six STRIDE categories on the other. Filled cells mean modeled-and-understood; empty cells mean unknown. The matrix turns an abstract security conversation into a shared picture a whole team can read in seconds.',
      'Prioritize filling cells for the highest-value assets first - typically the database row - then work outward toward the edge. Review the matrix whenever the architecture changes, because every new element adds six empty cells.'
    ]
  }
];
