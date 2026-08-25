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