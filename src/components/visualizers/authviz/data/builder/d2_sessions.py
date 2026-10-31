topics = [
  # 5. Session Lifecycle Security
  {
    "id": "session-lifecycle-security",
    "title": "The Session Lifecycle: Creation, Hijacking, Fixation, Idle/Absolute Expiration & Logout",
    "category": "sessions-cookies",
    "difficulty": "Intermediate",
    "summary": "A session represents authenticated state between client and server. Robust session management enforces cryptographic ID generation, regenerates session IDs upon privilege change (neutralizing Session Fixation), tracks both idle and absolute timeouts, and ensures complete server-side destruction on logout.",
    "whyExists": "HTTP is a stateless protocol. Applications need a mechanism to remember who is making requests. If session management is flawed, attackers can fixate, steal, or indefinitely replay session credentials.",
    "mentalModel": "The Hotel Keycard with Auto-Deactivation: When you check in, you receive a keycard. If you upgrade from standard to the penthouse suite, the front desk cancels the old keycard and burns a new one (Session Regeneration). If you leave your room door closed for 30 minutes, the lock auto-engages (Idle Timeout). Even if you keep using the card, it stops working after 11:00 AM on checkout day (Absolute Timeout).",
    "architectureDiagram": """[ Client ]                                      [ CosmosApp Server ]      [ Redis Session Store ]
    │                                                      │                         │
    ├── (1) POST /login (credentials) ────────────────────►│                         │
    │                                                      ├── Generate sess_101 ────►│ SET sess_101 { user: 42 }
    │◄── (2) Set-Cookie: sid=sess_101; HttpOnly; SameSite ─┤                          │     (TTL: 15m idle)
    │                                                      │                         │
    ├── (3) GET /dashboard (Cookie: sid=sess_101) ────────►│── Check & Refresh TTL ──►│ EXPIRE sess_101 900
    │                                                      │                         │
    ├── (4) Privilege Change (Standard -> Admin) ──────────►│── Destroy sess_101 ────►│ DEL sess_101
    │                                                      ├── Create sess_202 ─────►│ SET sess_202 { admin: true }
    │◄── (5) Set-Cookie: sid=sess_202 (Session Regen) ─────┤                         │
    │                                                      │                         │
    ├── (6) POST /logout ─────────────────────────────────►│── Delete from Redis ───►│ DEL sess_202
    │◄── (7) Set-Cookie: sid=; Max-Age=0 (Cookie Clear) ───┤                         │""",
    "cosmosAppStory": "CosmosApp authenticates users and issues high-entropy session IDs stored in Redis. To prevent Session Fixation (where an attacker gives a victim a pre-generated session ID), CosmosApp regenerates the session ID immediately upon login. It sets a 15-minute sliding idle timeout and an 8-hour absolute maximum session lifetime.",
    "stepByStep": [
      "Step 1: Client submits valid authentication credentials to /login.",
      "Step 2: Server regenerates the session ID to neutralize Session Fixation attacks.",
      "Step 3: Server stores the session payload in Redis with an idle TTL (e.g., 15 minutes) and absolute expiration timestamp (e.g., 8 hours).",
      "Step 4: Server sends the session ID in a Set-Cookie header with HttpOnly, Secure, and SameSite=Lax/Strict flags.",
      "Step 5: On each incoming request, the server verifies the session and extends the idle TTL (sliding window) as long as absolute expiration has not passed.",
      "Step 6: On /logout, the server deletes the session key from Redis and sends Set-Cookie with Max-Age=0 to clear client state."
    ],
    "misconceptions": [
      "Sliding idle timeouts alone are enough (Without an absolute timeout, a session can remain alive perpetually if kept active).",
      "Deleting the cookie on the client side logs the user out (The session remains completely valid on the server unless explicitly purged from storage)."
    ],
    "codeSnippet": """// CosmosApp Session Lifecycle Implementation:
export async function handleRequest(req: Request) {
  const sessionId = getCookie(req, 'sid');
  if (!sessionId) return { authenticated: false };

  const session = await redis.get(`session:${sessionId}`);
  if (!session) return { authenticated: false };

  const parsed = JSON.parse(session);
  const now = Date.now();

  # 1. Check Absolute Expiration (8 hours max lifetime)
  if (now > parsed.absoluteExpiresAt) {
    await redis.del(`session:${sessionId}`);
    return { authenticated: false, reason: "Absolute session lifetime expired" };
  }

  # 2. Extend Sliding Idle Timeout (15 minutes of inactivity)
  await redis.expire(`session:${sessionId}`, 15 * 60);

  return { authenticated: true, user: parsed.user };
}""",
    "takeaways": [
      "Always regenerate the session ID immediately upon login and privilege elevation to defeat Session Fixation.",
      "Enforce two distinct timeouts: a sliding idle timeout (15–30 mins) and an absolute ceiling (8–12 hours).",
      "Ensure /logout destroys server-side session state and explicitly clears the client cookie."
    ],
    "commonPitfall": {
      "mistake": "Failing to regenerate session IDs upon login. An attacker tricks the victim into using a known session ID, and gains access once the victim logs in.",
      "fix": "Regenerate the session identifier immediately upon successful authentication."
    },
    "knowledgeCheck": {
      "question": "Why must a secure session system enforce an absolute timeout in addition to an idle timeout?",
      "answer": "An idle timeout only expires inactive sessions. Without an absolute timeout, an attacker who steals a session or keeps an active connection open can maintain access indefinitely."
    },
    "nextTopicId": "cookies-vs-tokens-storage"
  },
  # 6. Cookies vs Tokens Storage
  {
    "id": "cookies-vs-tokens-storage",
    "title": "Storage & Transport Security: HttpOnly SameSite Cookies vs Bearer Tokens",
    "category": "sessions-cookies",
    "difficulty": "Intermediate",
    "summary": "Storing sensitive authentication tokens in browser LocalStorage exposes them to instant exfiltration via Cross-Site Scripting (XSS). HttpOnly, Secure, SameSite=Lax/Strict cookies are completely inaccessible to JavaScript, insulating sessions from XSS token theft.",
    "whyExists": "Browsers execute third-party JavaScript (npm packages, analytics, CDNs). If an application stores sensitive session tokens in LocalStorage or sessionStorage, a single XSS flaw compromises the entire identity. Cookies with the HttpOnly flag provide hardware-like browser enforcement that blocks document.cookie access.",
    "mentalModel": "The Bank Vault Deposit Box vs Cash on the Nightstand: LocalStorage is cash sitting on your nightstand; anyone who steps into your room (malicious script) can grab it. An HttpOnly cookie is a bank deposit box where only the bank teller (the browser itself) can hand the funds directly to the merchant on outbound requests.",
    "architectureDiagram": """[ Malicious Script (XSS) ] 
       │ 
       ├──► Attempts: document.cookie ────────► [ BLOCKED: Returns Empty String ]
       └──► Attempts: localStorage.getItem() ──► [ COMPROMISED: Token Stolen! ]

[ Legitimate Browser Request ]
       │
       ▼ (Automatic inclusion by Browser Network Stack)
[ Outbound HTTPS Request ] ──(Cookie: sid=sess_123; Secure; HttpOnly)──► [ CosmosApp Server ]""",
    "cosmosAppStory": "CosmosApp evaluates where to store its web session tokens. Rather than writing tokens to window.localStorage where any rogue analytics script could exfiltrate them, CosmosApp issues HttpOnly, Secure, SameSite=Lax cookies with the __Host- prefix. JavaScript running in the browser cannot read or exfiltrate the session cookie.",
    "stepByStep": [
      "Step 1: User authenticates with valid credentials.",
      "Step 2: Server generates a cryptographically secure 256-bit session token.",
      "Step 3: Server responds with Set-Cookie header containing: __Host-sid=..., Secure, HttpOnly, SameSite=Lax, Path=/.",
      "Step 4: Browser stores the cookie in its isolated cookie jar, hidden from DOM JavaScript APIs.",
      "Step 5: On subsequent requests to the same origin, the browser network stack automatically attaches the cookie.",
      "Step 6: If an attacker injects a script (XSS), calls to document.cookie return empty for HttpOnly cookies."
    ],
    "misconceptions": [
      "HttpOnly cookies prevent Cross-Site Scripting (HttpOnly does not prevent XSS; it prevents XSS from stealing the session token).",
      "LocalStorage is more secure because cookies are vulnerable to CSRF (Modern SameSite=Lax/Strict cookies and CSRF tokens defeat CSRF while retaining XSS immunity)."
    ],
    "codeSnippet": """// CosmosApp Set-Cookie Header Configuration:
export function setAuthCookie(res: Response, token: string) {
  res.headers.set(
    'Set-Cookie',
    `__Host-sid=${token}; ` +
    `Path=/; ` +
    `Secure; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=28800` // 8 hours absolute
  );
}""",
    "takeaways": [
      "Never store long-lived sensitive authentication tokens in LocalStorage or SessionStorage.",
      "Use HttpOnly, Secure, SameSite=Lax/Strict cookies for web application session persistence.",
      "Use the __Host- cookie prefix to enforce that cookies are only sent over HTTPS to the exact issuing host."
    ],
    "commonPitfall": {
      "mistake": "Storing JWTs in LocalStorage because it's 'easy to attach as a Bearer token in fetch()'.",
      "fix": "Use HttpOnly cookies. If an API requires Bearer tokens for mobile/CLI clients, provide an isolated OAuth token exchange endpoint."
    },
    "knowledgeCheck": {
      "question": "What protection does the HttpOnly flag on a cookie provide to an application?",
      "answer": "It completely hides the cookie from client-side JavaScript APIs (such as document.cookie), preventing attackers from exfiltrating the token via XSS."
    },
    "nextTopicId": "csrf-protection-synchronizer"
  },
  # 7. CSRF Protection
  {
    "id": "csrf-protection-synchronizer",
    "title": "Cross-Site Request Forgery (CSRF): Synchronizer Tokens, Origin Checking & SameSite Nuances",
    "category": "sessions-cookies",
    "difficulty": "Intermediate",
    "summary": "Cross-Site Request Forgery (CSRF) tricks a victim's browser into submitting unauthorized commands to an authenticated web application using automatically attached cookies. Defenses require the Double-Submit or Synchronizer Token Pattern alongside SameSite=Lax/Strict cookies and strict Origin/Referer header verification.",
    "whyExists": "Browsers automatically send cookies on cross-origin requests by default. If evil.com hosts a hidden form submitting POST /api/transfer to bank.com, the user's session cookie attaches automatically. The application must verify that the intent originated within its own legitimate UI.",
    "mentalModel": "The Bank Letter with a Forged Stamp: If a courier delivers a withdrawal slip with your official bank seal already stamped on the envelope (automatic cookie), the bank must demand an additional secret one-time code only written inside the checkbook (CSRF token) before dispensing cash.",
    "architectureDiagram": """[ evil.com (Attacker Page) ]
       │
       ▼ (1) Auto-submits hidden form: POST https://cosmos.app/api/delete-account
       │     (Browser automatically attaches CosmosApp session cookies!)
       ▼
[ CosmosApp Server PEP ]
       │
       ├── Check 1: Sec-Fetch-Site == 'cross-site' ──► REJECT (Origin Mismatch)
       ├── Check 2: Header 'X-CSRF-Token' missing ──► REJECT (403 Forbidden)
       ▼
[ Attack Neutralized with HTTP 403 ]""",
    "cosmosAppStory": "CosmosApp's collaboration features allow users to delete projects via POST /api/projects/:id/delete. To protect against malicious third-party websites triggering this deletion, CosmosApp generates a cryptographic CSRF synchronizer token bound to the user's session, which the React frontend must include in the X-CSRF-Token HTTP header for all mutating requests.",
    "stepByStep": [
      "Step 1: Server generates a cryptographically random CSRF secret when establishing a user session.",
      "Step 2: Server delivers the CSRF token to the client via a readable cookie or initial page load payload.",
      "Step 3: Frontend framework intercepts state-changing requests (POST, PUT, DELETE, PATCH) and injects the token into custom HTTP header X-CSRF-Token.",
      "Step 4: Server middleware inspects incoming requests; safe methods (GET, HEAD, OPTIONS) pass through.",
      "Step 5: For mutating requests, server validates the Origin/Referer header and compares the submitted CSRF token against the session secret.",
      "Step 6: If tokens match and origin is valid, the request proceeds; otherwise, returns HTTP 403 Forbidden."
    ],
    "misconceptions": [
      "SameSite=Lax cookies completely eliminate the need for CSRF tokens (Lax cookies are still sent on top-level GET navigations, and older browsers do not support SameSite).",
      "CSRF protection is needed on GET requests (GET requests must be idempotent and should never mutate server state)."
    ],
    "codeSnippet": """// CosmosApp CSRF Validation Middleware:
import crypto from 'node:crypto';

export function verifyCsrf(req: Request, sessionCsrfSecret: string): boolean {
  # 1. Safe methods do not require CSRF tokens
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;

  # 2. Validate Origin Header
  const origin = req.headers.get('Origin');
  if (origin && origin !== 'https://cosmos.app') {
    return false;
  }

  # 3. Verify Custom Header against session secret
  const submittedToken = req.headers.get('X-CSRF-Token');
  if (!submittedToken) return false;

  return crypto.timingSafeEqual(
    Buffer.from(submittedToken),
    Buffer.from(sessionCsrfSecret)
  );
}""",
    "takeaways": [
      "Combine SameSite=Lax/Strict cookies with custom X-CSRF-Token headers for robust defense-in-depth.",
      "Enforce strict Origin and Referer header checking on all state-changing endpoints.",
      "Keep all GET requests strictly read-only and idempotent."
    ],
    "commonPitfall": {
      "mistake": "Allowing state-changing operations via GET requests (e.g. GET /api/user/delete?id=12), which bypasses CSRF protections.",
      "fix": "Strictly enforce HTTP methods: only allow POST, PUT, DELETE, PATCH for state mutations and guard them with CSRF tokens."
    },
    "knowledgeCheck": {
      "question": "Why does a custom HTTP header like 'X-CSRF-Token' provide inherent CSRF protection in cross-origin browser requests?",
      "answer": "Browsers enforce the Same-Origin Policy for custom headers; cross-origin websites cannot attach custom headers without triggering a CORS preflight OPTIONS request, which the server will reject."
    },
    "nextTopicId": "distributed-sessions-redis"
  },
  # 8. Distributed Sessions Redis
  {
    "id": "distributed-sessions-redis",
    "title": "Distributed Session Storage: Sticky Sessions vs Redis Clusters & Instant Revocation",
    "category": "sessions-cookies",
    "difficulty": "Advanced",
    "summary": "In multi-instance cloud architectures, storing sessions in local server memory forces sticky load balancing and prevents instant revocation. Distributed, in-memory session stores (Redis) enable horizontal scaling, sub-millisecond lookups, and global session invalidation across all nodes.",
    "whyExists": "When an application scales across 20 server instances behind a load balancer, a user's request may hit Server A on one click and Server B on the next. If sessions reside in local RAM, users get intermittently logged out. Furthermore, suspending a compromised account requires instantly evicting their session across every cluster node.",
    "mentalModel": "The Centralized Hotel Database vs Local Notebooks: If each floor of a hotel kept guest records in physical paper notebooks, a guest moving to the 4th floor lounge would be unrecognized. Instead, all desks check a synchronized central terminal that updates instantly.",
    "architectureDiagram": """[ Client ] ──(Request with sid=sess_abc)──► [ Load Balancer (Round Robin) ]
                                                    │
                             ┌──────────────────────┴──────────────────────┐
                             ▼                                             ▼
                   [ App Instance 1 ]                            [ App Instance 2 ]
                             │                                             │
                             └──────────────┬──────────────────────────────┘
                                            ▼ (Sub-millisecond query)
                               [ Redis Session Cluster ]
                                  GET sess_abc -> { user: 42, role: 'admin' }
                                  DEL sess_abc -> Instant Global Revocation!""",
    "cosmosAppStory": "CosmosApp scales to 15 container replicas on Kubernetes. Rather than configuring complex sticky sessions on AWS ALB, CosmosApp connects all replicas to a Redis cluster. When an administrator revokes a compromised user's access, CosmosApp executes redis.del(sessionId), instantly logging out the attacker across all 15 replicas within 2 milliseconds.",
    "stepByStep": [
      "Step 1: User completes login on App Instance 1.",
      "Step 2: App Instance 1 generates a 256-bit crypto session ID and stores user metadata in Redis with an EXPIRE TTL.",
      "Step 3: User receives session cookie and sends subsequent request routed to App Instance 2.",
      "Step 4: App Instance 2 queries Redis for session metadata; Redis returns user data in under 1 millisecond.",
      "Step 5: On password reset or administrative ban, any instance deletes the session key from Redis.",
      "Step 6: All subsequent requests to any instance fail session lookup and redirect to login."
    ],
    "misconceptions": [
      "Sticky sessions are just as good as Redis (Sticky sessions cause uneven load distribution, server crash session loss, and prevent instant multi-node revocation).",
      "Redis lookups add too much latency (Redis in-memory lookups typically complete in 200–800 microseconds within the same cloud region)."
    ],
    "codeSnippet": """import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// CosmosApp Distributed Session Operations:
export async function createDistributedSession(userId: string, data: object): Promise<string> {
  const sessionId = crypto.randomUUID();
  const sessionKey = `sess:${sessionId}`;
  
  # Store session with 15-minute idle expiration
  await redis.set(sessionKey, JSON.stringify({ userId, ...data }), 'EX', 15 * 60);
  # Track all sessions for this user for batch revocation
  await redis.sadd(`user_sessions:${userId}`, sessionId);
  
  return sessionId;
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  const sessionIds = await redis.smembers(`user_sessions:${userId}`);
  if (sessionIds.length > 0) {
    const keys = sessionIds.map((id) => `sess:${id}`);
    await redis.del(...keys);
    await redis.del(`user_sessions:${userId}`);
  }
}""",
    "takeaways": [
      "Store session state in centralized in-memory stores like Redis to enable stateless horizontal scaling.",
      "Track user-to-session indexes (sets) to enable instant 'Log out of all devices' functionality.",
      "Configure automated Redis TTLs for sliding idle expirations without manual database cleanup scripts."
    ],
    "commonPitfall": {
      "mistake": "Storing sessions in local Node.js memory (e.g. Map or object). When instances scale up or restart, all users are abruptly logged out.",
      "fix": "Use a dedicated Redis cluster for session persistence and cache management."
    },
    "knowledgeCheck": {
      "question": "How does storing sessions in Redis enable instant global session revocation across multiple application servers?",
      "answer": "Because all application instances query the shared Redis store on every request, deleting the session key in Redis instantly makes the session invalid across every server node."
    },
    "nextTopicId": "mfa-totp-hotp-rfc6238"
  }
]
