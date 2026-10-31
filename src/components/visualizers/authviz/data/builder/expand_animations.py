import json

# Full dictionary of all 30 topic animation scenarios
scenarios = {
  # 1. authn-vs-authz-foundations
  "authn-vs-authz-foundations": {
    "topicId": "authn-vs-authz-foundations",
    "title": "Authentication vs Authorization Boundary Simulation",
    "subtitle": "Step through identity verification (AuthN) and policy enforcement (AuthZ) in CosmosApp",
    "nodes": [
      { "id": "client", "label": "User Client", "role": "Alice (Browser)", "iconType": "client", "x": 12, "y": 50 },
      { "id": "authn", "label": "AuthN Engine", "role": "Identity Provider", "iconType": "auth", "x": 38, "y": 50 },
      { "id": "authz", "label": "AuthZ PEP", "role": "Policy Enforcement", "iconType": "gateway", "x": 64, "y": 50 },
      { "id": "db", "label": "Resource API", "role": "Billing Records", "iconType": "database", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Credential Presentation",
        "description": "Alice submits username and password over TLS to the identity endpoint.",
        "activeNodeIds": ["client", "authn"],
        "packet": { "from": "client", "to": "authn", "label": "POST /auth/login { user: 'alice' }", "type": "request" },
        "payloadData": { "username": "alice", "method": "password", "channel": "TLS_v1.3" },
        "securityStatus": "normal",
        "securityNote": "Authentication Phase Begins: The server does not know who Alice is yet."
      },
      {
        "step": 2,
        "stageTitle": "Identity Verification (AuthN)",
        "description": "AuthN engine verifies credentials against stored Argon2id hash. Identity verified!",
        "activeNodeIds": ["authn"],
        "payloadData": { "verified": True, "userId": "usr_42", "role": "member", "httpStatus": 200 },
        "securityStatus": "verified",
        "securityNote": "AuthN Check: Identity established. If credentials were wrong, returns 401 Unauthorized."
      },
      {
        "step": 3,
        "stageTitle": "Resource Request with Identity Context",
        "description": "Alice attempts to access sensitive financial billing records: DELETE /billing/invoices/99.",
        "activeNodeIds": ["client", "authz"],
        "packet": { "from": "client", "to": "authz", "label": "DELETE /billing/invoices/99 [usr_42]", "type": "request" },
        "payloadData": { "actor": "usr_42", "action": "billing:delete", "resource": "invoice_99" },
        "securityStatus": "normal",
        "securityNote": "Passing from Authentication boundary into Authorization boundary."
      },
      {
        "step": 4,
        "stageTitle": "Policy Enforcement Check (AuthZ)",
        "description": "Policy engine checks Alice's role (member) against required permission (billing:admin). Access Denied!",
        "activeNodeIds": ["authz"],
        "payloadData": { "required": "billing:admin", "assigned": "member", "result": "DENY", "httpStatus": 403 },
        "securityStatus": "blocked",
        "securityNote": "AuthZ Decision: 403 Forbidden! Identity is valid, but permissions are insufficient."
      },
      {
        "step": 5,
        "stageTitle": "Protective Perimeter Preserved",
        "description": "Resource API remains completely protected. No database query is executed for the unauthorized user.",
        "activeNodeIds": ["authz", "client"],
        "packet": { "from": "authz", "to": "client", "label": "403 Forbidden (Access Denied)", "type": "blocked" },
        "payloadData": { "status": 403, "error": "InsufficientPermissions", "resourceUntouched": True },
        "securityStatus": "verified",
        "securityNote": "Zero Trust in practice: Never confuse authenticated status with authorized access."
      }
    ]
  },

  # 2. passwords-salting-argon2id
  "passwords-salting-argon2id": {
    "topicId": "passwords-salting-argon2id",
    "title": "Argon2id Memory-Hard Cryptographic Hashing Matrix",
    "subtitle": "Observe memory hardness (64MB RAM) and salt generation defeating GPU brute-force rigs",
    "nodes": [
      { "id": "user", "label": "Plaintext Input", "role": "User Password", "iconType": "user", "x": 12, "y": 50 },
      { "id": "salt", "label": "CSPRNG Salt", "role": "16-byte Entropy", "iconType": "lock", "x": 38, "y": 25 },
      { "id": "argon", "label": "Argon2id Core", "role": "64MB Memory Matrix", "iconType": "hsm", "x": 62, "y": 50 },
      { "id": "db", "label": "PostgreSQL DB", "role": "Stored Hash", "iconType": "database", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "High-Entropy Random Salt Generation",
        "description": "Server invokes crypto.getRandomValues() to generate a unique 16-byte cryptographic salt.",
        "activeNodeIds": ["salt"],
        "payloadData": { "saltBytes": 16, "entropy": "128 bits", "randomness": "CSPRNG" },
        "securityStatus": "normal",
        "securityNote": "Every password receives a unique salt, making precomputed rainbow tables useless."
      },
      {
        "step": 2,
        "stageTitle": "Memory Buffer Allocation (64 MB)",
        "description": "Argon2id allocates a 64 MB RAM array in system memory. GPUs cannot parallelize across thousands of cores.",
        "activeNodeIds": ["argon"],
        "payloadData": { "memoryCost_m": 65536, "ramAllocated": "64 MB", "timeCost_t": 3, "threads_p": 4 },
        "securityStatus": "verified",
        "securityNote": "Memory-Hardness: ASIC and GPU cracking rigs with low RAM per core are paralyzed."
      },
      {
        "step": 3,
        "stageTitle": "Iterative Memory-Hard Computations",
        "description": "Argon2id executes 3 sequential time passes across the 64 MB memory blocks with Blake2b hashing.",
        "activeNodeIds": ["user", "argon"],
        "packet": { "from": "user", "to": "argon", "label": "Password + Salt -> Memory Pass 1..3", "type": "crypto" },
        "payloadData": { "pass": "3/3 completed", "memoryLatencyMs": 340, "sideChannelResistant": True },
        "securityStatus": "verified",
        "securityNote": "Argon2id combines data-dependent (Argon2d) and data-independent (Argon2i) memory access."
      },
      {
        "step": 4,
        "stageTitle": "Formatted Modular Hash Storage",
        "description": "The resulting 256-bit hash with version parameters is stored in the database row.",
        "activeNodeIds": ["argon", "db"],
        "packet": { "from": "argon", "to": "db", "label": "Store $argon2id$v=19$m=65536...", "type": "response" },
        "payloadData": { "format": "$argon2id$v=19$m=65536,t=3,p=4$salt$hash", "irreversible": True },
        "securityStatus": "verified",
        "securityNote": "Even if the database leaks, cracking a single password requires millions of dollars in compute."
      }
    ]
  },

  # 3. registration-email-verification
  "registration-email-verification": {
    "topicId": "registration-email-verification",
    "title": "Registration Lifecycle & Hashed Verification Token Flow",
    "subtitle": "Track single-use SHA-256 token hashing and account activation in CosmosApp",
    "nodes": [
      { "id": "user", "label": "User Browser", "role": "alice@cosmos.io", "iconType": "client", "x": 12, "y": 50 },
      { "id": "api", "label": "CosmosApp API", "role": "Registration Gate", "iconType": "gateway", "x": 40, "y": 50 },
      { "id": "mail", "label": "User Mailbox", "role": "Inbox Notification", "iconType": "user", "x": 65, "y": 22 },
      { "id": "db", "label": "PostgreSQL DB", "role": "SHA-256 Token Store", "iconType": "database", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "User Registration Submission",
        "description": "Alice submits email and password. CosmosApp saves account with status: 'pending'.",
        "activeNodeIds": ["user", "api"],
        "packet": { "from": "user", "to": "api", "label": "POST /register { alice@cosmos.io }", "type": "request" },
        "payloadData": { "email": "alice@cosmos.io", "status": "pending", "emailVerified": False },
        "securityStatus": "normal",
        "securityNote": "Account is created in unverified state; privileged features remain locked."
      },
      {
        "step": 2,
        "stageTitle": "Token Generation & SHA-256 Hashing",
        "description": "Server creates 32 random bytes (rawToken) and computes tokenHash = SHA256(rawToken). Only hash is saved in DB!",
        "activeNodeIds": ["api", "db"],
        "packet": { "from": "api", "to": "db", "label": "INSERT tokenHash (TTL: 24h)", "type": "response" },
        "payloadData": { "rawToken": "9f8a... (memory only)", "tokenHash": "e3b0... (stored in DB)", "ttl": "24 hours" },
        "securityStatus": "verified",
        "securityNote": "If the DB leaks, attackers cannot see the raw tokens or activate unverified accounts."
      },
      {
        "step": 3,
        "stageTitle": "Verification Link Dispatched",
        "description": "Email sent containing the plaintext raw token: https://cosmos.app/verify?token=9f8a...",
        "activeNodeIds": ["api", "mail"],
        "packet": { "from": "api", "to": "mail", "label": "Dispatch Activation Email", "type": "response" },
        "payloadData": { "link": "/verify?token=9f8a...", "recipient": "alice@cosmos.io" },
        "securityStatus": "normal",
        "securityNote": "Plaintext token exists only in the recipient mailbox and transit."
      },
      {
        "step": 4,
        "stageTitle": "Click & Cryptographic Verification",
        "description": "Alice clicks link. Server computes SHA-256 of submitted token, finds matching DB record, and activates account.",
        "activeNodeIds": ["mail", "api", "db"],
        "packet": { "from": "api", "to": "db", "label": "UPDATE status = 'active'", "type": "crypto" },
        "payloadData": { "match": "SHA256(submitted) == db.hash", "accountStatus": "active", "tokenConsumed": True },
        "securityStatus": "verified",
        "securityNote": "Token is immediately consumed or deleted to prevent replay."
      }
    ]
  },

  # 4. account-recovery-password-reset
  "account-recovery-password-reset": {
    "topicId": "account-recovery-password-reset",
    "title": "Secure Account Recovery & Universal Session Revocation",
    "subtitle": "Observe short-lived 15m reset tokens and the instant eviction of hijacked sessions",
    "nodes": [
      { "id": "client", "label": "User Browser", "role": "Bob (Recovery)", "iconType": "client", "x": 12, "y": 50 },
      { "id": "api", "label": "Auth Gateway", "role": "Anti-Enumeration", "iconType": "gateway", "x": 38, "y": 50 },
      { "id": "redis", "label": "Redis Cache", "role": "Active Sessions", "iconType": "redis", "x": 64, "y": 25 },
      { "id": "db", "label": "PostgreSQL DB", "role": "Password Hash", "iconType": "database", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Anti-Enumeration Recovery Request",
        "description": "Bob requests a reset link. Server returns HTTP 200 'If your email exists, a link was sent' regardless of existence.",
        "activeNodeIds": ["client", "api"],
        "packet": { "from": "client", "to": "api", "label": "POST /forgot-password", "type": "request" },
        "payloadData": { "response": "Generic 200 OK", "accountEnumerationPrevented": True },
        "securityStatus": "normal",
        "securityNote": "Attackers cannot probe whether high-profile targets hold accounts."
      },
      {
        "step": 2,
        "stageTitle": "15-Minute Short-Lived Token Generation",
        "description": "Server creates single-use 32-byte token with strict 15-minute expiration timestamp.",
        "activeNodeIds": ["api"],
        "payloadData": { "validityLifespan": "15 minutes", "singleUse": True, "hashedInDb": True },
        "securityStatus": "verified",
        "securityNote": "NIST SP 800-63B recommends 15–30 minutes maximum for account recovery."
      },
      {
        "step": 3,
        "stageTitle": "Password Hash Update (Argon2id)",
        "description": "Bob submits new password. CosmosApp computes new Argon2id hash and marks reset token consumed.",
        "activeNodeIds": ["client", "api", "db"],
        "packet": { "from": "api", "to": "db", "label": "UPDATE password_hash", "type": "crypto" },
        "payloadData": { "tokenUsed": True, "newHashComputed": True },
        "securityStatus": "verified",
        "securityNote": "Token is immediately invalidated upon first successful submission."
      },
      {
        "step": 4,
        "stageTitle": "Universal Session Eviction (DEL Redis)",
        "description": "CRITICAL: CosmosApp executes DEL user_sessions:bob in Redis, instantly logging out all devices and any intruder!",
        "activeNodeIds": ["api", "redis"],
        "packet": { "from": "api", "to": "redis", "label": "DEL user_sessions:bob (Evict All)", "type": "blocked" },
        "payloadData": { "activeSessionsEvicted": 4, "redisKeysPurged": True, "intruderKicked": True },
        "securityStatus": "verified",
        "securityNote": "Failing to evict sessions allows an attacker with a stolen cookie to stay logged in."
      }
    ]
  },

  # 5. session-lifecycle-security
  "session-lifecycle-security": {
    "topicId": "session-lifecycle-security",
    "title": "The Session Lifecycle: Fixation Defense & Dual Timeouts",
    "subtitle": "Simulate session regeneration upon login, sliding idle windows, and absolute expiration",
    "nodes": [
      { "id": "browser", "label": "Browser Client", "role": "Cookie Jar", "iconType": "client", "x": 15, "y": 50 },
      { "id": "server", "label": "Web Server", "role": "Session Manager", "iconType": "gateway", "x": 50, "y": 50 },
      { "id": "redis", "label": "Redis Store", "role": "Session TTLs", "iconType": "redis", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Pre-Authentication State (Unauthenticated)",
        "description": "Browser holds an unauthenticated session ID: sess_anon_01. Attacker may know this ID.",
        "activeNodeIds": ["browser", "server"],
        "payloadData": { "currentSession": "sess_anon_01", "authenticated": False },
        "securityStatus": "warning",
        "securityNote": "Session Fixation Hazard: Never promote an existing anonymous ID to authenticated state."
      },
      {
        "step": 2,
        "stageTitle": "Session ID Regeneration (Fixation Defense)",
        "description": "User enters credentials. Server DESTROYS sess_anon_01 and generates brand-new high-entropy sess_auth_99!",
        "activeNodeIds": ["server", "redis"],
        "packet": { "from": "server", "to": "redis", "label": "SET sess_auth_99 (Regenerate)", "type": "crypto" },
        "payloadData": { "oldIdDestroyed": "sess_anon_01", "newId": "sess_auth_99", "fixationNeutralized": True },
        "securityStatus": "verified",
        "securityNote": "Session Fixation Attack is completely neutralized; attacker's pre-set ID is dead."
      },
      {
        "step": 3,
        "stageTitle": "Dual Timeout Enforcement (Idle vs Absolute)",
        "description": "Server sets sliding idle TTL (15 mins) and an unmodifiable absolute expiration ceiling (8 hours).",
        "activeNodeIds": ["server", "redis"],
        "payloadData": { "idleTtlSeconds": 900, "absoluteExpiresAt": "T + 8 Hours", "slidingWindow": "active" },
        "securityStatus": "verified",
        "securityNote": "Sliding TTL extends with activity, but the session dies permanently at the 8-hour ceiling."
      },
      {
        "step": 4,
        "stageTitle": "Secure Logout & Cookie Purge",
        "description": "User clicks Logout. Server purges key in Redis (DEL) and sends Set-Cookie with Max-Age=0 to clear browser.",
        "activeNodeIds": ["server", "redis", "browser"],
        "packet": { "from": "server", "to": "browser", "label": "Set-Cookie: sid=; Max-Age=0", "type": "response" },
        "payloadData": { "redisKeyDeleted": True, "browserCookieCleared": True, "statefulSessionDead": True },
        "securityStatus": "verified",
        "securityNote": "Complete destruction: Server-side state and client-side cookie are both purged."
      }
    ]
  },

  # 6. cookies-vs-tokens-storage
  "cookies-vs-tokens-storage": {
    "topicId": "cookies-vs-tokens-storage",
    "title": "Storage Security: HttpOnly Cookies vs LocalStorage",
    "subtitle": "Simulate XSS script token theft against LocalStorage vs the browser-enforced HttpOnly cookie vault",
    "nodes": [
      { "id": "script", "label": "Malicious XSS Script", "role": "Injected Code", "iconType": "attacker", "x": 15, "y": 22 },
      { "id": "localstorage", "label": "window.localStorage", "role": "Unprotected Storage", "iconType": "lock", "x": 45, "y": 22 },
      { "id": "cookie", "label": "HttpOnly Cookie Jar", "role": "Browser Network Stack", "iconType": "hsm", "x": 45, "y": 75 },
      { "id": "server", "label": "CosmosApp Server", "role": "Protected API", "iconType": "gateway", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "XSS Probes LocalStorage (CRITICAL BREACH)",
        "description": "Injected script calls localStorage.getItem('jwt_token'). The token is instantly exfiltrated to attacker.com!",
        "activeNodeIds": ["script", "localstorage"],
        "packet": { "from": "localstorage", "to": "script", "label": "Token Leaked to JS!", "type": "blocked" },
        "payloadData": { "api": "localStorage.getItem()", "tokenExfiltrated": True, "vulnerability": "XSS Token Theft" },
        "securityStatus": "blocked",
        "securityNote": "Never store sensitive long-lived authentication tokens in LocalStorage or SessionStorage."
      },
      {
        "step": 2,
        "stageTitle": "XSS Probes HttpOnly Cookie (BLOCKED)",
        "description": "Injected script executes document.cookie. The browser returns an empty string! HttpOnly blocks JavaScript.",
        "activeNodeIds": ["script", "cookie"],
        "packet": { "from": "script", "to": "cookie", "label": "document.cookie -> BLOCKED", "type": "blocked" },
        "payloadData": { "api": "document.cookie", "result": "'' (empty string)", "xssProtection": "HARDWARE-LEVEL BLOCKED" },
        "securityStatus": "verified",
        "securityNote": "The browser's C++ network core enforces that HttpOnly cookies never enter JavaScript DOM."
      },
      {
        "step": 3,
        "stageTitle": "Legitimate Outbound HTTPS Request",
        "description": "When the browser makes a legitimate fetch() to CosmosApp, the browser network stack automatically attaches cookie.",
        "activeNodeIds": ["cookie", "server"],
        "packet": { "from": "cookie", "to": "server", "label": "Cookie: __Host-sid=... (Secure; HttpOnly)", "type": "response" },
        "payloadData": { "transmission": "Automatic Browser Attachment", "sameSite": "Lax", "secure": True },
        "securityStatus": "verified",
        "securityNote": "Tokens travel safely between browser network stack and server without entering client JS."
      }
    ]
  },

  # 7. csrf-protection-synchronizer
  "csrf-protection-synchronizer": {
    "topicId": "csrf-protection-synchronizer",
    "title": "CSRF Synchronizer Token & Cross-Origin Defense",
    "subtitle": "Observe how SameSite cookies, Origin checks, and X-CSRF-Token headers defeat cross-site forgery",
    "nodes": [
      { "id": "evil", "label": "Attacker (evil.com)", "role": "Hidden Cross-Site Form", "iconType": "attacker", "x": 15, "y": 25 },
      { "id": "browser", "label": "Victim Browser", "role": "Ambient Cookie Sender", "iconType": "client", "x": 45, "y": 50 },
      { "id": "cosmos", "label": "CosmosApp Server", "role": "CSRF Synchronizer PEP", "iconType": "gateway", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Cross-Origin Forgery Attempt",
        "description": "Victim visits evil.com. A hidden script submits POST https://cosmos.app/api/transfer with victim's cookies.",
        "activeNodeIds": ["evil", "browser"],
        "packet": { "from": "evil", "to": "browser", "label": "Auto-submit hidden form", "type": "request" },
        "payloadData": { "target": "https://cosmos.app/api/transfer", "ambientCookiesAttached": True },
        "securityStatus": "warning",
        "securityNote": "Browsers automatically attach cookies unless cross-origin restrictions are in place."
      },
      {
        "step": 2,
        "stageTitle": "Same-Origin & Custom Header Inspection",
        "description": "CosmosApp detects Sec-Fetch-Site: 'cross-site' and Origin: 'https://evil.com'. Required X-CSRF-Token is MISSING!",
        "activeNodeIds": ["browser", "cosmos"],
        "packet": { "from": "browser", "to": "cosmos", "label": "POST /api/transfer (Missing X-CSRF-Token)", "type": "blocked" },
        "payloadData": { "secFetchSite": "cross-site", "origin": "https://evil.com", "csrfHeader": "NONE" },
        "securityStatus": "blocked",
        "securityNote": "Under Same-Origin Policy, evil.com cannot read or forge the custom X-CSRF-Token header."
      },
      {
        "step": 3,
        "stageTitle": "Request Terminated with 403 Forbidden",
        "description": "CosmosApp aborts the request before any transaction occurs. The attack is completely neutralized.",
        "activeNodeIds": ["cosmos"],
        "payloadData": { "httpStatus": 403, "error": "Invalid CSRF Token", "stateMutated": False },
        "securityStatus": "verified",
        "securityNote": "Combining SameSite=Lax cookies with custom synchronizer headers eliminates CSRF."
      }
    ]
  },

  # 8. distributed-sessions-redis
  "distributed-sessions-redis": {
    "topicId": "distributed-sessions-redis",
    "title": "Distributed Redis Session Architecture & Sub-Millisecond Revocation",
    "subtitle": "Watch horizontal load balancing across multiple server instances with synchronized in-memory Redis state",
    "nodes": [
      { "id": "client", "label": "Browser Client", "role": "sid=sess_101", "iconType": "client", "x": 12, "y": 50 },
      { "id": "lb", "label": "Load Balancer", "role": "Round Robin", "iconType": "gateway", "x": 38, "y": 50 },
      { "id": "node1", "label": "App Node 1", "role": "Stateless Worker", "iconType": "gateway", "x": 64, "y": 25 },
      { "id": "node2", "label": "App Node 2", "role": "Stateless Worker", "iconType": "gateway", "x": 64, "y": 75 },
      { "id": "redis", "label": "Redis Cluster", "role": "Central In-Memory Store", "iconType": "redis", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Request Routed to Node 1",
        "description": "Client sends request with session ID. Load Balancer routes traffic to App Node 1.",
        "activeNodeIds": ["client", "lb", "node1"],
        "packet": { "from": "lb", "to": "node1", "label": "GET /dashboard (sid=sess_101)", "type": "request" },
        "payloadData": { "route": "Node 1", "sessionId": "sess_101" },
        "securityStatus": "normal",
        "securityNote": "Node 1 holds no local session state in RAM; it queries the Redis cluster."
      },
      {
        "step": 2,
        "stageTitle": "Sub-Millisecond Redis Lookup (< 1ms)",
        "description": "Node 1 queries Redis: GET sess_101. Redis responds in 400 microseconds with user metadata.",
        "activeNodeIds": ["node1", "redis"],
        "packet": { "from": "node1", "to": "redis", "label": "GET sess_101", "type": "crypto" },
        "payloadData": { "latency": "400us", "userId": "usr_42", "role": "admin", "ttl": "900s" },
        "securityStatus": "verified",
        "securityNote": "In-memory distributed storage enables completely stateless application scaling."
      },
      {
        "step": 3,
        "stageTitle": "Subsequent Request Routed to Node 2",
        "description": "Next request hits App Node 2. Because session is in Redis, Node 2 immediately recognizes the user without sticky sessions.",
        "activeNodeIds": ["client", "lb", "node2", "redis"],
        "packet": { "from": "node2", "to": "redis", "label": "GET sess_101 -> FOUND", "type": "response" },
        "payloadData": { "worker": "Node 2", "seamlessFailover": True },
        "securityStatus": "verified",
        "securityNote": "Sticky sessions eliminated: Nodes can restart or scale up/down with zero dropped user sessions."
      },
      {
        "step": 4,
        "stageTitle": "Instant Multi-Node Account Revocation",
        "description": "Administrator suspends user: DEL sess_101. On the very next click, both Node 1 and Node 2 immediately reject access!",
        "activeNodeIds": ["redis"],
        "payloadData": { "command": "DEL sess_101", "globalRevocationLatency": "< 2ms", "nodesUpdated": "ALL" },
        "securityStatus": "verified",
        "securityNote": "Single atomic delete propagates across all 100+ microservice instances instantly."
      }
    ]
  },

  # 9. mfa-totp-hotp-rfc6238
  "mfa-totp-hotp-rfc6238": {
    "topicId": "mfa-totp-hotp-rfc6238",
    "title": "Time-Based One-Time Password (TOTP RFC 6238) Engine",
    "subtitle": "Watch the 30-second Unix time step, HMAC-SHA1 hashing, and 4-bit dynamic offset truncation",
    "nodes": [
      { "id": "phone", "label": "Authenticator App", "role": "Offline Mobile Device", "iconType": "client", "x": 15, "y": 50 },
      { "id": "clock", "label": "30s Time Epoch", "role": "floor(now / 30)", "iconType": "clock", "x": 42, "y": 25 },
      { "id": "hmac", "label": "HMAC-SHA1 Engine", "role": "Secret + Time Step", "iconType": "hsm", "x": 65, "y": 50 },
      { "id": "server", "label": "CosmosApp Server", "role": "Replay Cache Gate", "iconType": "auth", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Unix Epoch Time Step Calculation",
        "description": "Both phone and server compute the identical 8-byte counter: T = Math.floor(UnixTimestamp / 30).",
        "activeNodeIds": ["phone", "clock"],
        "payloadData": { "unixTime": 1735689600, "timeStep_T": 57856320, "timeWindowSeconds": 30 },
        "securityStatus": "normal",
        "securityNote": "No internet required! TOTP works entirely offline from the device's quartz clock."
      },
      {
        "step": 2,
        "stageTitle": "HMAC-SHA1 Computation over Shared Secret",
        "description": "Engine computes 20-byte digest: HMAC-SHA1(Base32Secret, timeBuffer).",
        "activeNodeIds": ["phone", "hmac"],
        "packet": { "from": "phone", "to": "hmac", "label": "HMAC-SHA1(Secret, T)", "type": "crypto" },
        "payloadData": { "secret": "JBSWY3DPEHPK3PXP", "digestLength": "20 bytes (160 bits)" },
        "securityStatus": "verified",
        "securityNote": "Cryptographic one-way hash ensures the secret cannot be extracted from the output."
      },
      {
        "step": 3,
        "stageTitle": "Dynamic 4-Bit Offset Truncation",
        "description": "Takes last 4 bits of digest as offset index (e.g. 15), reads 4 bytes, drops sign bit, and computes % 1,000,000.",
        "activeNodeIds": ["hmac"],
        "payloadData": { "offset": 12, "binaryCode": 10482910, "modulo": 1000000, "code": "482910" },
        "securityStatus": "verified",
        "securityNote": "RFC 6238 standardizes dynamic truncation so all authenticators compute the identical 6-digit code."
      },
      {
        "step": 4,
        "stageTitle": "Verification & Replay Cache Lockdown",
        "description": "Server verifies code 482910 and records it in Redis for 60 seconds to prevent replay attacks during the window.",
        "activeNodeIds": ["phone", "server"],
        "packet": { "from": "phone", "to": "server", "label": "POST /auth/mfa { code: '482910' }", "type": "response" },
        "payloadData": { "codeVerified": True, "cachedInRedisTtl": "60s", "replayBlocked": True },
        "securityStatus": "verified",
        "securityNote": "Anti-Replay: Even if intercepted over the shoulder, the code cannot be reused."
      }
    ]
  },

  # 10. webauthn-passkeys-fido2
  "webauthn-passkeys-fido2": {
    "topicId": "webauthn-passkeys-fido2",
    "title": "WebAuthn & FIDO2 Hardware Passkey Phishing Defense",
    "subtitle": "Watch TouchID / Secure Enclave hardware sign cryptographic challenges bound to the domain origin",
    "nodes": [
      { "id": "browser", "label": "Browser (WebAuthn API)", "role": "Origin Verifier", "iconType": "client", "x": 15, "y": 50 },
      { "id": "enclave", "label": "Hardware Secure Enclave", "role": "TouchID / P-256 Private Key", "iconType": "hsm", "x": 48, "y": 25 },
      { "id": "server", "label": "CosmosApp (Relying Party)", "role": "Public Key Verifier", "iconType": "auth", "x": 82, "y": 50 },
      { "id": "phish", "label": "Phishing Site (fake-cosmos.app)", "role": "Adversary Domain", "iconType": "attacker", "x": 48, "y": 75 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Cryptographic Challenge Issued by Server",
        "description": "Server generates 32 cryptographically random bytes and sends to browser: { challenge: '7a9f...', rpId: 'cosmos.app' }.",
        "activeNodeIds": ["server", "browser"],
        "packet": { "from": "server", "to": "browser", "label": "Challenge (32 bytes) + rpId='cosmos.app'", "type": "request" },
        "payloadData": { "challenge": "7a9f...3c", "rpId": "cosmos.app", "userVerification": "required" },
        "securityStatus": "normal",
        "securityNote": "Challenge prevents replay; rpId defines the exact permitted domain scope."
      },
      {
        "step": 2,
        "stageTitle": "Origin Validation & Biometric Sensor Trigger",
        "description": "Browser checks that current URL matches rpId: 'cosmos.app'. Prompts TouchID biometric fingerprint.",
        "activeNodeIds": ["browser", "enclave"],
        "packet": { "from": "browser", "to": "enclave", "label": "TouchID Fingerprint Scan", "type": "crypto" },
        "payloadData": { "originChecked": "https://cosmos.app", "biometricMatch": True, "hardwareEnclaveActive": True },
        "securityStatus": "verified",
        "securityNote": "Biometric data never leaves the local chip; only a digital signature is emitted."
      },
      {
        "step": 3,
        "stageTitle": "Phishing Attack Simulation (MATHEMATICALLY BLOCKED)",
        "description": "If user is tricked onto fake-cosmos.app, browser sends rpId: 'fake-cosmos.app' to Secure Enclave. Enclave REFUSES to sign!",
        "activeNodeIds": ["phish", "enclave"],
        "packet": { "from": "phish", "to": "enclave", "label": "fake-cosmos.app PROMPT -> REFUSED!", "type": "blocked" },
        "payloadData": { "requestedDomain": "fake-cosmos.app", "registeredDomain": "cosmos.app", "result": "SIGNATURE_DENIED" },
        "securityStatus": "blocked",
        "securityNote": "Phishing Immunity: Hardware keys mathematically refuse to sign for spoofed domains."
      },
      {
        "step": 4,
        "stageTitle": "Valid Signature Verification on Server",
        "description": "CosmosApp verifies signature using Alice's stored public key and increments signature counter.",
        "activeNodeIds": ["browser", "server"],
        "packet": { "from": "browser", "to": "server", "label": "POST /auth/verify { signature, authenticatorData }", "type": "response" },
        "payloadData": { "verified": True, "algorithm": "ES256 (P-256 ECDSA)", "signatureCounter": 104 },
        "securityStatus": "verified",
        "securityNote": "Passwordless, phishing-resistant, hardware-authenticated login complete."
      }
    ]
  },

  # 11. oauth2-core-framework-roles
  "oauth2-core-framework-roles": {
    "topicId": "oauth2-core-framework-roles",
    "title": "OAuth 2.0 Core Delegated Authorization Architecture",
    "subtitle": "Trace interactions between Resource Owner, Client App, Authorization Server, and Resource Server",
    "nodes": [
      { "id": "owner", "label": "Resource Owner", "role": "Alice (User)", "iconType": "user", "x": 12, "y": 30 },
      { "id": "client", "label": "Client App", "role": "CosmosApp Frontend", "iconType": "client", "x": 12, "y": 70 },
      { "id": "as", "label": "Auth Server (IdP)", "role": "Google / GitHub", "iconType": "auth", "x": 55, "y": 30 },
      { "id": "rs", "label": "Resource Server", "role": "Protected API", "iconType": "database", "x": 88, "y": 70 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Authorization Consent Request",
        "description": "Client redirects Alice to the Authorization Server with requested scopes: 'repo:read'.",
        "activeNodeIds": ["client", "owner", "as"],
        "packet": { "from": "client", "to": "as", "label": "GET /authorize?scope=repo:read&state=xyz", "type": "request" },
        "payloadData": { "clientId": "cosmos_client_1", "scope": "repo:read", "state": "xyz981" },
        "securityStatus": "normal",
        "securityNote": "Alice reviews the exact permissions requested; she never enters her password into CosmosApp."
      },
      {
        "step": 2,
        "stageTitle": "Consent Granted & Authorization Code Issued",
        "description": "Alice clicks 'Authorize'. Auth Server redirects browser back to CosmosApp with a temporary code.",
        "activeNodeIds": ["as", "client"],
        "packet": { "from": "as", "to": "client", "label": "302 Redirect ?code=auth_code_77&state=xyz", "type": "response" },
        "payloadData": { "authCode": "auth_code_77", "stateVerified": True, "singleUse": True },
        "securityStatus": "normal",
        "securityNote": "State parameter is verified to prevent Login CSRF attacks."
      },
      {
        "step": 3,
        "stageTitle": "Back-Channel Code Exchange for Token",
        "description": "CosmosApp backend makes a direct HTTPS POST to /token exchanging code for Access Token.",
        "activeNodeIds": ["client", "as"],
        "packet": { "from": "client", "to": "as", "label": "POST /token { code, client_secret }", "type": "crypto" },
        "payloadData": { "grantType": "authorization_code", "issuedTokenType": "Bearer", "expiresIn": 3600 },
        "securityStatus": "verified",
        "securityNote": "Back-channel connection directly between servers; tokens never enter browser address bar."
      },
      {
        "step": 4,
        "stageTitle": "Scoped API Access on Resource Server",
        "description": "CosmosApp presents Bearer token to fetch repositories. Resource server verifies scope and returns data.",
        "activeNodeIds": ["client", "rs"],
        "packet": { "from": "client", "to": "rs", "label": "GET /api/repos (Authorization: Bearer <token>)", "type": "response" },
        "payloadData": { "scopeEnforced": "repo:read", "dataReturned": "20 Repositories", "accessGranted": True },
        "securityStatus": "verified",
        "securityNote": "Delegated authorization achieved without sharing master passwords."
      }
    ]
  },

  # 12. oauth2-pkce-flow-rfc9700
  "oauth2-pkce-flow-rfc9700": {
    "topicId": "oauth2-pkce-flow-rfc9700",
    "title": "OAuth 2.0 PKCE (RFC 7636 & RFC 9700) Cryptographic Handshake",
    "subtitle": "Trace Code Verifier generation, SHA-256 S256 challenge creation, and authorization code trade",
    "nodes": [
      { "id": "spa", "label": "React / Next.js SPA", "role": "Public Client", "iconType": "client", "x": 15, "y": 50 },
      { "id": "idp", "label": "Authorization Server", "role": "IdP (OAuth Engine)", "iconType": "auth", "x": 50, "y": 50 },
      { "id": "api", "label": "Resource Server", "role": "Protected API", "iconType": "database", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Code Verifier & S256 Challenge Generation",
        "description": "Client creates high-entropy random code_verifier (64 chars) and computes code_challenge = base64url(sha256(verifier)).",
        "activeNodeIds": ["spa"],
        "payloadData": { "code_verifier": "dBjftJeZ4CVP-mB92K...", "code_challenge": "E9Melhoa2OwvFrEMTJ...", "method": "S256" },
        "securityStatus": "normal",
        "securityNote": "Verifier remains strictly in browser memory; only the cryptographic hash is transmitted."
      },
      {
        "step": 2,
        "stageTitle": "Authorization Request with Challenge",
        "description": "Client redirects browser to IdP: /authorize?code_challenge=E9Mel...&code_challenge_method=S256&state=xyz.",
        "activeNodeIds": ["spa", "idp"],
        "packet": { "from": "spa", "to": "idp", "label": "GET /authorize?challenge=E9Mel...&state=xyz", "type": "request" },
        "payloadData": { "code_challenge": "E9Mel...", "method": "S256", "response_type": "code" },
        "securityStatus": "normal",
        "securityNote": "Server stores the code_challenge linked to the user's pending authorization session."
      },
      {
        "step": 3,
        "stageTitle": "Authorization Code Issued via Redirect",
        "description": "User consents. IdP redirects back with single-use authorization code: ?code=auth_code_981&state=xyz.",
        "activeNodeIds": ["idp", "spa"],
        "packet": { "from": "idp", "to": "spa", "label": "302 Redirect ?code=auth_code_981", "type": "response" },
        "payloadData": { "code": "auth_code_981", "stateMatches": True, "singleUse": True },
        "securityStatus": "normal",
        "securityNote": "If an attacker intercepts this code, they STILL cannot use it without the original code_verifier!"
      },
      {
        "step": 4,
        "stageTitle": "Code Exchange with Proof of Possession (PKCE)",
        "description": "Client sends back-channel POST /token with authorization code AND the plaintext code_verifier.",
        "activeNodeIds": ["spa", "idp"],
        "packet": { "from": "spa", "to": "idp", "label": "POST /token { code, code_verifier }", "type": "crypto" },
        "payloadData": { "code": "auth_code_981", "submitted_verifier": "dBjftJeZ4CVP-mB92K..." },
        "securityStatus": "normal",
        "securityNote": "IdP computes SHA-256 of submitted verifier and checks if it matches the stored challenge."
      },
      {
        "step": 5,
        "stageTitle": "Cryptographic Proof Verified & Tokens Issued",
        "description": "SHA256(verifier) matches stored challenge! IdP issues Access Token and Rotating Refresh Token.",
        "activeNodeIds": ["idp", "spa"],
        "packet": { "from": "idp", "to": "spa", "label": "200 OK { access_token, refresh_token }", "type": "response" },
        "payloadData": { "match": "VERIFIED", "accessToken": "jwt_signed_rs256", "expiresIn": 900 },
        "securityStatus": "verified",
        "securityNote": "Zero Client Secrets required. Mathematically immune to code interception attacks."
      }
    ]
  },

  # 13. oauth2-machine-to-machine
  "oauth2-machine-to-machine": {
    "topicId": "oauth2-machine-to-machine",
    "title": "Machine-to-Machine Client Credentials Grant Flow",
    "subtitle": "Watch autonomous daemon microservices authenticate without end-user involvement",
    "nodes": [
      { "id": "billing", "label": "Billing Daemon", "role": "Service svc_billing", "iconType": "client", "x": 15, "y": 50 },
      { "id": "idp", "label": "Enterprise IdP", "role": "M2M Token Issuer", "iconType": "auth", "x": 50, "y": 50 },
      { "id": "metrics", "label": "Telemetry API", "role": "Resource Server", "iconType": "database", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Direct Machine Authentication Request",
        "description": "Daemon submits client_id and client_secret to /oauth/token with grant_type=client_credentials.",
        "activeNodeIds": ["billing", "idp"],
        "packet": { "from": "billing", "to": "idp", "label": "POST /token (grant_type=client_credentials)", "type": "request" },
        "payloadData": { "client_id": "svc_billing_01", "scope": "metrics:write", "grant_type": "client_credentials" },
        "securityStatus": "normal",
        "securityNote": "No human in the loop; machine presents confidential credentials stored in AWS KMS."
      },
      {
        "step": 2,
        "stageTitle": "Credential Validation & Scoped Token Generation",
        "description": "IdP verifies secret against cryptographic store and signs a short-lived access token (TTL: 15m).",
        "activeNodeIds": ["idp"],
        "payloadData": { "clientVerified": True, "tokenLifetime": "900 seconds", "refreshTokensIssued": "NONE" },
        "securityStatus": "verified",
        "securityNote": "RFC 6749 specifies that Refresh Tokens are not issued for client credentials."
      },
      {
        "step": 3,
        "stageTitle": "Microservice RPC Execution",
        "description": "Billing daemon calls Telemetry API with Bearer token. Telemetry service verifies token and accepts metrics.",
        "activeNodeIds": ["billing", "metrics"],
        "packet": { "from": "billing", "to": "metrics", "label": "POST /api/v1/metrics (Bearer <token>)", "type": "response" },
        "payloadData": { "httpStatus": 202, "metricsRecorded": 1500, "authenticatedService": "svc_billing_01" },
        "securityStatus": "verified",
        "securityNote": "Auditable, scoped machine identity enforced without sharing master database credentials."
      }
    ]
  },

  # 14. refresh-tokens-rotation
  "refresh-tokens-rotation": {
    "topicId": "refresh-tokens-rotation",
    "title": "Refresh Token Rotation (RTR) & Replay Defense Simulation",
    "subtitle": "Observe single-use token exchange, token family tracking, and automated replay lockout",
    "nodes": [
      { "id": "client", "label": "Legitimate Client", "role": "Alice Laptop", "iconType": "client", "x": 15, "y": 50 },
      { "id": "server", "label": "Authorization Server", "role": "Token Family Manager", "iconType": "auth", "x": 50, "y": 50 },
      { "id": "attacker", "label": "Attacker (Stolen RT)", "role": "Token Interceptor", "iconType": "attacker", "x": 85, "y": 22 },
      { "id": "db", "label": "Token Family Store", "role": "State Tracker", "iconType": "database", "x": 85, "y": 75 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Initial Legitimate Rotation (RT_1 -> RT_2)",
        "description": "Client trades RT_1. Server marks RT_1 as consumed and issues RT_2 in Token Family 'Fam_Alpha'.",
        "activeNodeIds": ["client", "server", "db"],
        "packet": { "from": "client", "to": "server", "label": "POST /token { grant_type: 'refresh_token', RT_1 }", "type": "request" },
        "payloadData": { "familyId": "Fam_Alpha", "consumedToken": "RT_1", "newlyIssuedToken": "RT_2", "status": "ACTIVE" },
        "securityStatus": "verified",
        "securityNote": "RT_1 is now dead and consumed. Only RT_2 is valid for subsequent rotation."
      },
      {
        "step": 2,
        "stageTitle": "Attacker Attempts Replay of Stolen RT_1",
        "description": "An attacker who intercepted old RT_1 attempts to exchange it at the authorization server.",
        "activeNodeIds": ["attacker", "server"],
        "packet": { "from": "attacker", "to": "server", "label": "POST /token { RT_1 (OLD REPLAY!) }", "type": "blocked" },
        "payloadData": { "presentedToken": "RT_1", "dbState": "ALREADY_CONSUMED", "alert": "REPLAY_DETECTED" },
        "securityStatus": "blocked",
        "securityNote": "REPLAY ATTACK DETECTED! Presenting a previously consumed token indicates token compromise."
      },
      {
        "step": 3,
        "stageTitle": "Immediate Family Revocation (Lockout)",
        "description": "IdP immediately sets is_revoked = true on the entire family (Fam_Alpha), revoking RT_2 and evicting all sessions!",
        "activeNodeIds": ["server", "db"],
        "packet": { "from": "server", "to": "db", "label": "UPDATE tokens SET revoked=true WHERE family='Fam_Alpha'", "type": "blocked" },
        "payloadData": { "familyId": "Fam_Alpha", "allTokensRevoked": True, "sessionsTerminated": True },
        "securityStatus": "verified",
        "securityNote": "Both attacker and victim are evicted immediately, forcing mandatory re-authentication."
      }
    ]
  },

  # 15. openid-connect-oidc-identity
  "openid-connect-oidc-identity": {
    "topicId": "openid-connect-oidc-identity",
    "title": "OpenID Connect (OIDC) Identity & Nonce Replay Defense",
    "subtitle": "Watch ID Token generation, user claim verification, and nonce replay validation",
    "nodes": [
      { "id": "client", "label": "CosmosApp Client", "role": "Relying Party", "iconType": "client", "x": 15, "y": 50 },
      { "id": "idp", "label": "Google OIDC IdP", "role": "Identity Provider", "iconType": "auth", "x": 50, "y": 50 },
      { "id": "session", "label": "Session Cookie", "role": "Nonce Store", "iconType": "lock", "x": 15, "y": 15 },
      { "id": "api", "label": "User Profile API", "role": "sub, email", "iconType": "database", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Cryptographic Nonce Generation",
        "description": "Client creates random nonce 'n_981a', saves it in an HttpOnly session cookie, and includes it in /authorize.",
        "activeNodeIds": ["client", "session", "idp"],
        "packet": { "from": "client", "to": "idp", "label": "GET /authorize?scope=openid email&nonce=n_981a", "type": "request" },
        "payloadData": { "nonce": "n_981a", "scopes": ["openid", "profile", "email"] },
        "securityStatus": "normal",
        "securityNote": "Nonce ties the specific login request to the returned ID token."
      },
      {
        "step": 2,
        "stageTitle": "ID Token Generation with Claims",
        "description": "Google IdP authenticates user and embeds the nonce into the signed ID Token payload claims.",
        "activeNodeIds": ["idp"],
        "payloadData": { "sub": "usr_google_102", "email": "alice@gmail.com", "nonce": "n_981a", "iss": "accounts.google.com" },
        "securityStatus": "verified",
        "securityNote": "ID Token is digitally signed with Google's RS256 private key."
      },
      {
        "step": 3,
        "stageTitle": "Signature Verification & Nonce Check",
        "description": "CosmosApp fetches Google JWKS, verifies signature, and confirms ID Token nonce matches Alice's session cookie.",
        "activeNodeIds": ["client", "session"],
        "packet": { "from": "idp", "to": "client", "label": "200 OK { id_token, access_token }", "type": "crypto" },
        "payloadData": { "signatureValid": True, "nonceMatches": True, "replayAttackPrevented": True },
        "securityStatus": "verified",
        "securityNote": "If an attacker tries to replay an old ID Token, the nonce mismatch rejects it immediately."
      }
    ]
  },

  # 16. enterprise-sso-saml-vs-oidc
  "enterprise-sso-saml-vs-oidc": {
    "topicId": "enterprise-sso-saml-vs-oidc",
    "title": "Enterprise SSO: SAML 2.0 vs OIDC XML-DSig Security",
    "subtitle": "Inspect XML assertion verification, XML External Entity (XXE) defense, and clock skew validation",
    "nodes": [
      { "id": "employee", "label": "Corporate User", "role": "alice@acme.com", "iconType": "user", "x": 12, "y": 50 },
      { "id": "sp", "label": "CosmosApp (SP)", "role": "Service Provider", "iconType": "gateway", "x": 42, "y": 50 },
      { "id": "okta", "label": "Okta Enterprise IdP", "role": "Identity Provider", "iconType": "auth", "x": 78, "y": 25 },
      { "id": "cert", "label": "X.509 Certificate", "role": "XML-DSig Key", "iconType": "hsm", "x": 78, "y": 75 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "SAML AuthnRequest Dispatch",
        "description": "User enters corporate email. CosmosApp redirects user's browser to Okta with a signed SAML AuthnRequest.",
        "activeNodeIds": ["employee", "sp", "okta"],
        "packet": { "from": "sp", "to": "okta", "label": "302 Redirect (SAMLRequest)", "type": "request" },
        "payloadData": { "spEntityId": "https://cosmos.app/saml/metadata", "idpUrl": "https://acme.okta.com" },
        "securityStatus": "normal",
        "securityNote": "SP initiates federated identity handshake."
      },
      {
        "step": 2,
        "stageTitle": "XML Assertion Digital Signature (XML-DSig)",
        "description": "Okta authenticates employee via MFA and signs the SAML XML assertion with its X.509 private certificate.",
        "activeNodeIds": ["okta", "cert"],
        "payloadData": { "signatureMethod": "RSA-SHA256", "canonicalization": "xml-c14n", "digest": "SHA256" },
        "securityStatus": "verified",
        "securityNote": "XML assertion contains user attributes: email, department, security clearance."
      },
      {
        "step": 3,
        "stageTitle": "Hardened XML Parsing & Signature Validation",
        "description": "CosmosApp ACS receives SAMLResponse. It disables external DTD entities (XXE defense) and validates XML-DSig.",
        "activeNodeIds": ["sp", "cert"],
        "packet": { "from": "okta", "to": "sp", "label": "POST /saml/acs (SAMLResponse XML)", "type": "crypto" },
        "payloadData": { "xxeDisabled": True, "xswAttackPrevented": True, "signatureValid": True, "clockSkewSeconds": 4 },
        "securityStatus": "verified",
        "securityNote": "Hardened parsers defend against XML Signature Wrapping (XSW) and XXE attacks."
      }
    ]
  },

  # 17. jwt-architecture-claims
  "jwt-architecture-claims": {
    "topicId": "jwt-architecture-claims",
    "title": "JSON Web Token (JWT) Anatomy & 6-Point Verification Pipeline",
    "subtitle": "Deconstruct Header.Payload.Signature segments and step through cryptographic verification",
    "nodes": [
      { "id": "token", "label": "JWT Bearer String", "role": "Header.Payload.Sig", "iconType": "lock", "x": 12, "y": 50 },
      { "id": "parser", "label": "Base64URL Decoder", "role": "Segment Unpacker", "iconType": "gateway", "x": 38, "y": 50 },
      { "id": "crypto", "label": "Crypto Signature Engine", "role": "Public Key RS256", "iconType": "hsm", "x": 64, "y": 50 },
      { "id": "validator", "label": "Claims Validator", "role": "exp, iss, aud Gate", "iconType": "auth", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Segment Extraction & Base64URL Decoding",
        "description": "Incoming token is split by periods into Header, Payload, and Signature segments.",
        "activeNodeIds": ["token", "parser"],
        "packet": { "from": "token", "to": "parser", "label": "Split on dots ('.')", "type": "request" },
        "payloadData": { "segments": 3, "alg": "RS256", "typ": "JWT", "kid": "cosmos_2026" },
        "securityStatus": "normal",
        "securityNote": "Header specifies algorithm and Key ID; payload contains identity claims."
      },
      {
        "step": 2,
        "stageTitle": "Algorithm Whitelist Check (Defeat 'alg: none')",
        "description": "Gateway checks header alg against strict allowed whitelist: ['RS256', 'ES256']. Rejects 'none' and 'HS256'!",
        "activeNodeIds": ["parser", "crypto"],
        "payloadData": { "headerAlg": "RS256", "whitelist": ["RS256", "ES256"], "algCheck": "PASSED" },
        "securityStatus": "verified",
        "securityNote": "Never allow the client-controlled header to dictate which algorithm the server uses."
      },
      {
        "step": 3,
        "stageTitle": "Asymmetric RS256 Signature Verification",
        "description": "Engine computes SHA-256(Header + '.' + Payload) and verifies signature with IdP's RSA Public Key.",
        "activeNodeIds": ["crypto"],
        "payloadData": { "algorithm": "RS256", "keyType": "RSA-2048 Public Key", "mathematicalIntegrity": "VALID" },
        "securityStatus": "verified",
        "securityNote": "Mathematical proof: Payload was signed by the authentic IdP and has not been tampered with."
      },
      {
        "step": 4,
        "stageTitle": "Standard Claims Validation Pipeline",
        "description": "Validator checks temporal (exp > now, nbf <= now) and structural claims (iss == cosmos.app, aud == cosmos-api).",
        "activeNodeIds": ["crypto", "validator"],
        "packet": { "from": "crypto", "to": "validator", "label": "Inspect exp, iss, aud", "type": "response" },
        "payloadData": { "exp": "1735689600 (Valid)", "iss": "https://auth.cosmos.app", "aud": "https://api.cosmos.app" },
        "securityStatus": "verified",
        "securityNote": "All 6 checks pass! User identity usr_42 is safely admitted to resource controllers."
      }
    ]
  },

  # 18. jwt-digital-signatures-rs256
  "jwt-digital-signatures-rs256": {
    "topicId": "jwt-digital-signatures-rs256",
    "title": "Digital Signatures: RS256 vs HS256 & Algorithm Confusion Defense",
    "subtitle": "Watch an Algorithm Confusion attack attempt get intercepted by an explicit algorithm whitelist",
    "nodes": [
      { "id": "attacker", "label": "Attacker (Forgery)", "role": "alg: HS256", "iconType": "attacker", "x": 15, "y": 25 },
      { "id": "idp", "label": "CosmosApp IdP", "role": "RSA Private Key", "iconType": "hsm", "x": 15, "y": 75 },
      { "id": "gateway", "label": "API Gateway", "role": "Algorithm Whitelist", "iconType": "gateway", "x": 55, "y": 50 },
      { "id": "pubkey", "label": "Public RSA Key", "role": "Publicly Available", "iconType": "lock", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Legitimate Asymmetric RS256 Signing",
        "description": "IdP signs legitimate tokens using its private RSA key. Public key is published for anyone to verify.",
        "activeNodeIds": ["idp"],
        "payloadData": { "signingKey": "RSA-2048 Private Key (KMS)", "alg": "RS256", "publicKeyShared": True },
        "securityStatus": "verified",
        "securityNote": "Resource servers verify tokens without holding private keys."
      },
      {
        "step": 2,
        "stageTitle": "Attacker Launches Algorithm Confusion Attack",
        "description": "Attacker downloads the public RSA key, alters header to 'alg: HS256', and signs a forged admin token using the public key as HMAC secret!",
        "activeNodeIds": ["attacker", "pubkey"],
        "packet": { "from": "attacker", "to": "gateway", "label": "Forged Token { alg: 'HS256', role: 'admin' }", "type": "blocked" },
        "payloadData": { "forgedHeader": "{ alg: 'HS256' }", "hmacKeyUsed": "Public RSA Certificate", "goal": "Privilege Escalation" },
        "securityStatus": "warning",
        "securityNote": "Vulnerable servers use the public key as an HMAC secret, validating the forgery!"
      },
      {
        "step": 3,
        "stageTitle": "Hardened Whitelist Interception",
        "description": "CosmosApp gateway enforces algorithms: ['RS256']. When token header specifies 'HS256', it REJECTS immediately!",
        "activeNodeIds": ["gateway"],
        "payloadData": { "permittedAlg": ["RS256"], "receivedAlg": "HS256", "action": "DROP_REQUEST", "httpStatus": 401 },
        "securityStatus": "blocked",
        "securityNote": "Algorithm Confusion completely neutralized: The server never runs HMAC verification."
      }
    ]
  },

  # 19. jwks-key-rotation-caching
  "jwks-key-rotation-caching": {
    "topicId": "jwks-key-rotation-caching",
    "title": "JWKS Dynamic Key Rotation & Cache-Stampede Protection",
    "subtitle": "Observe Key ID (kid) matching across key rotation windows with rate-limited remote fetches",
    "nodes": [
      { "id": "token", "label": "Incoming Request", "role": "kid: 'key_2026_q2'", "iconType": "client", "x": 12, "y": 50 },
      { "id": "cache", "label": "Local Memory Cache", "role": "JWKS Cache (24h)", "iconType": "redis", "x": 45, "y": 50 },
      { "id": "jwks", "label": "JWKS Endpoint", "role": "/.well-known/jwks.json", "iconType": "auth", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Token Arrives with Key ID (kid)",
        "description": "Incoming request has JWT header { kid: 'key_2026_q2' }. Gateway checks local cache for matching public key.",
        "activeNodeIds": ["token", "cache"],
        "packet": { "from": "token", "to": "cache", "label": "Lookup kid: 'key_2026_q2'", "type": "request" },
        "payloadData": { "kid": "key_2026_q2", "cacheStatus": "HIT", "cachedKeysCount": 2 },
        "securityStatus": "normal",
        "securityNote": "Matching public key found in local cache in 50 microseconds."
      },
      {
        "step": 2,
        "stageTitle": "Zero-Downtime Key Rotation Window",
        "description": "IdP rotates keys: both Q1 and Q2 keys are published on JWKS simultaneously so older in-flight tokens still verify.",
        "activeNodeIds": ["jwks", "cache"],
        "payloadData": { "activeKeys": ["key_2026_q1 (retiring)", "key_2026_q2 (active)"], "downtime": "0 seconds" },
        "securityStatus": "verified",
        "securityNote": "Dual-key publication ensures zero dropped requests during key rotation."
      },
      {
        "step": 3,
        "stageTitle": "Cache-Stampede Protection",
        "description": "If an attacker floods with random unknown kid values, gateway enforces 30s cooldown before refetching JWKS.",
        "activeNodeIds": ["cache"],
        "payloadData": { "cooldownSeconds": 30, "stampedePrevented": True, "dosResistance": "ACTIVE" },
        "securityStatus": "verified",
        "securityNote": "Rate-limited background refresh prevents denial of service against the IdP."
      }
    ]
  },

  # 20. jwt-revocation-blacklisting
  "jwt-revocation-blacklisting": {
    "topicId": "jwt-revocation-blacklisting",
    "title": "Stateless Token Revocation: Redis Denylist & Bloom Filters",
    "subtitle": "Watch sub-millisecond JTI blacklist lookups and bounded memory expiration in Redis",
    "nodes": [
      { "id": "client", "label": "Client Request", "role": "Bearer jti: '9a8f'", "iconType": "client", "x": 15, "y": 50 },
      { "id": "gateway", "label": "API Gateway", "role": "Stateless RS256 Check", "iconType": "gateway", "x": 50, "y": 50 },
      { "id": "redis", "label": "Redis Denylist", "role": "EXISTS revoked:jti", "iconType": "redis", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Stateless Signature & Claims Verification",
        "description": "Gateway validates RS256 signature and checks exp > now statelessly without touching any database.",
        "activeNodeIds": ["client", "gateway"],
        "packet": { "from": "client", "to": "gateway", "label": "Authorization: Bearer <token>", "type": "request" },
        "payloadData": { "jti": "9a8f2c", "exp": "Valid (10m remaining)", "signature": "VALID" },
        "securityStatus": "normal",
        "securityNote": "Stateless cryptographic check complete."
      },
      {
        "step": 2,
        "stageTitle": "Sub-Millisecond Redis Denylist Check",
        "description": "Gateway queries Redis: EXISTS revoked:9a8f2c. Redis responds false in 300 microseconds. Request permitted!",
        "activeNodeIds": ["gateway", "redis"],
        "packet": { "from": "gateway", "to": "redis", "label": "EXISTS revoked:9a8f2c", "type": "crypto" },
        "payloadData": { "isRevoked": False, "redisLatency": "300us", "result": "PERMIT" },
        "securityStatus": "verified",
        "securityNote": "Hybrid design: Stateless performance with instant revocation capabilities."
      },
      {
        "step": 3,
        "stageTitle": "Token Compromise & Bounded TTL Storage",
        "description": "User reports device stolen. Gateway executes SET revoked:9a8f2c 1 EX 600. Redis auto-purges when token expires naturally!",
        "activeNodeIds": ["gateway", "redis"],
        "packet": { "from": "gateway", "to": "redis", "label": "SET revoked:9a8f2c EX 600", "type": "blocked" },
        "payloadData": { "autoPurgeSeconds": 600, "memoryLeakPrevented": True, "stolenTokenBlocked": True },
        "securityStatus": "verified",
        "securityNote": "Memory bounded: Blacklist entries automatically delete themselves once tokens expire."
      }
    ]
  },

  # 21. rbac-role-based-access
  "rbac-role-based-access": {
    "topicId": "rbac-role-based-access",
    "title": "Role-Based Access Control (RBAC) & Hierarchy Expansion",
    "subtitle": "Watch role hierarchies expand into discrete permissions and stop privilege escalation",
    "nodes": [
      { "id": "user", "label": "User (Alice)", "role": "Role: 'Editor'", "iconType": "user", "x": 12, "y": 50 },
      { "id": "hierarchy", "label": "Role Hierarchy", "role": "Editor > Viewer", "iconType": "gateway", "x": 42, "y": 50 },
      { "id": "perms", "label": "Effective Permissions", "role": "Permission Set", "iconType": "lock", "x": 70, "y": 50 },
      { "id": "guard", "label": "API Route Guard", "role": "doc:delete check", "iconType": "auth", "x": 90, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Role Assignment & Hierarchy Resolution",
        "description": "Alice is assigned 'Editor'. The hierarchy inherits all permissions from 'Viewer' automatically.",
        "activeNodeIds": ["user", "hierarchy"],
        "payloadData": { "assignedRole": "Editor", "inherits": ["Viewer"], "rolesExplosionPrevented": True },
        "securityStatus": "normal",
        "securityNote": "Hierarchy keeps role definitions clean and maintainable."
      },
      {
        "step": 2,
        "stageTitle": "Permission Set Aggregation",
        "description": "Engine aggregates effective permissions: ['doc:read', 'comment:create', 'doc:create', 'doc:update'].",
        "activeNodeIds": ["hierarchy", "perms"],
        "payloadData": { "permissionsCount": 4, "canDelete": False },
        "securityStatus": "verified",
        "securityNote": "Application code checks granular permission strings, never role names."
      },
      {
        "step": 3,
        "stageTitle": "Privilege Escalation Attempt Intercepted",
        "description": "Alice attempts DELETE /api/documents/42. Route guard checks hasPermission('doc:delete'). Denied with 403!",
        "activeNodeIds": ["perms", "guard"],
        "packet": { "from": "perms", "to": "guard", "label": "Check 'doc:delete' -> MISSING", "type": "blocked" },
        "payloadData": { "required": "doc:delete", "present": False, "httpStatus": 403 },
        "securityStatus": "blocked",
        "securityNote": "RBAC protects sensitive state transitions at the perimeter."
      }
    ]
  },

  # 22. abac-attribute-based-access
  "abac-attribute-based-access": {
    "topicId": "abac-attribute-based-access",
    "title": "Attribute-Based Access Control (ABAC) Policy Decision Engine",
    "subtitle": "Evaluate dynamic 4-dimensional attributes: Subject, Resource, Action, and Environment",
    "nodes": [
      { "id": "subject", "label": "Subject Claims", "role": "Dept: Finance, L3", "iconType": "user", "x": 15, "y": 20 },
      { "id": "resource", "label": "Resource Metadata", "role": "Confidential, Finance", "iconType": "database", "x": 15, "y": 80 },
      { "id": "pdp", "label": "Policy Decision Point", "role": "OPA / Rego Engine", "iconType": "hsm", "x": 55, "y": 50 },
      { "id": "env", "label": "Environment Context", "role": "14:00 UTC, Corporate VPN", "iconType": "gateway", "x": 88, "y": 20 },
      { "id": "pep", "label": "Policy Enforcement", "role": "Gate Keeper", "iconType": "auth", "x": 88, "y": 80 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Contextual Attribute Collection",
        "description": "PEP collects attributes across all 4 dimensions: Subject, Resource, Action, and Environment.",
        "activeNodeIds": ["subject", "resource", "env", "pdp"],
        "packet": { "from": "subject", "to": "pdp", "label": "Collect Attributes", "type": "request" },
        "payloadData": { "subjectDept": "Finance", "resourceDept": "Finance", "isVpn": True, "timeUtc": 14 },
        "securityStatus": "normal",
        "securityNote": "Dynamic context allows expressive policies impossible in static RBAC."
      },
      {
        "step": 2,
        "stageTitle": "Declarative Policy Evaluation (PDP)",
        "description": "PDP evaluates rule: subject.dept == resource.dept AND environment.isVpn AND business_hours. Decision: PERMIT!",
        "activeNodeIds": ["pdp"],
        "payloadData": { "departmentMatch": True, "vpnSatisfied": True, "clearanceOk": True, "decision": "PERMIT" },
        "securityStatus": "verified",
        "securityNote": "Policy evaluated in under 1 millisecond using in-memory indexed policy graph."
      },
      {
        "step": 3,
        "stageTitle": "Policy Enforcement Point Admits Operation",
        "description": "PEP executes the decision, releasing the confidential document download stream.",
        "activeNodeIds": ["pdp", "pep"],
        "packet": { "from": "pdp", "to": "pep", "label": "Decision: PERMIT (200 OK)", "type": "response" },
        "payloadData": { "httpStatus": 200, "accessGranted": True },
        "securityStatus": "verified",
        "securityNote": "Fine-grained, zero-trust contextual authorization enforced."
      }
    ]
  },

  # 23. rebac-relationship-based-access
  "rebac-relationship-based-access": {
    "topicId": "rebac-relationship-based-access",
    "title": "Relationship-Based Access Control (ReBAC / Google Zanzibar)",
    "subtitle": "Traverse relation graph tuples from User -> Team -> Parent Folder -> Nested Document",
    "nodes": [
      { "id": "alice", "label": "user:alice", "role": "Subject", "iconType": "user", "x": 12, "y": 50 },
      { "id": "team", "label": "team:growth", "role": "Group Tuple", "iconType": "gateway", "x": 38, "y": 50 },
      { "id": "folder", "label": "folder:marketing", "role": "Parent Resource", "iconType": "database", "x": 64, "y": 50 },
      { "id": "doc", "label": "doc:q4_plan", "role": "Target Object", "iconType": "lock", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Permission Check: Can Alice EDIT doc:q4_plan?",
        "description": "Client queries Zanzibar engine: check(doc:q4_plan, 'editor', user:alice).",
        "activeNodeIds": ["alice", "doc"],
        "payloadData": { "target": "doc:q4_plan", "relation": "editor", "subject": "user:alice" },
        "securityStatus": "normal",
        "securityNote": "Direct tuple check finds no immediate relationship on the document."
      },
      {
        "step": 2,
        "stageTitle": "Graph Edge Traversal: Parent Hierarchy",
        "description": "Engine traverses tuple (doc:q4_plan, parent, folder:marketing). Permissions inherit from folder!",
        "activeNodeIds": ["doc", "folder"],
        "packet": { "from": "doc", "to": "folder", "label": "Inherits parent: folder:marketing", "type": "crypto" },
        "payloadData": { "relationFound": "parent", "parentObject": "folder:marketing" },
        "securityStatus": "verified",
        "securityNote": "Hierarchy edge traversed in sub-millisecond."
      },
      {
        "step": 3,
        "stageTitle": "Group Membership Resolution",
        "description": "Folder has editor 'team:growth#member'. Engine traverses membership: (team:growth, member, user:alice) FOUND!",
        "activeNodeIds": ["folder", "team", "alice"],
        "packet": { "from": "team", "to": "alice", "label": "Alice is Member of Team Growth!", "type": "response" },
        "payloadData": { "path": "alice -> team:growth -> folder:marketing -> doc:q4_plan", "result": "ALLOW" },
        "securityStatus": "verified",
        "securityNote": "Graph path complete! User inherits editor privileges on the nested document."
      }
    ]
  },

  # 24. idor-bola-object-authorization
  "idor-bola-object-authorization": {
    "topicId": "idor-bola-object-authorization",
    "title": "Object-Level Authorization: IDOR / BOLA Defense Barrier",
    "subtitle": "Simulate cross-tenant ID tampering and observe the database tenant perimeter defense",
    "nodes": [
      { "id": "attacker", "label": "Attacker (Org Acme)", "role": "id: usr_acme_1", "iconType": "attacker", "x": 15, "y": 50 },
      { "id": "gateway", "label": "API Gateway", "role": "Authentication OK", "iconType": "gateway", "x": 45, "y": 50 },
      { "id": "db", "label": "PostgreSQL DB", "role": "Multi-Tenant Barrier", "iconType": "database", "x": 80, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Attacker Tampering with Object ID",
        "description": "Attacker (Org Acme) requests invoice 9942 belonging to victim Beta Corp: GET /api/invoices/9942.",
        "activeNodeIds": ["attacker", "gateway"],
        "packet": { "from": "attacker", "to": "gateway", "label": "GET /api/invoices/9942", "type": "request" },
        "payloadData": { "caller": "usr_acme_1", "callerOrg": "org_acme", "targetInvoiceId": 9942, "targetOwner": "org_beta" },
        "securityStatus": "warning",
        "securityNote": "Authentication is valid (caller is a known user), but caller does NOT own invoice 9942."
      },
      {
        "step": 2,
        "stageTitle": "Flawed Query (Vulnerability Demonstration)",
        "description": "Vulnerable code: SELECT * FROM invoices WHERE id = 9942. This leaks Beta Corp's invoice!",
        "activeNodeIds": ["gateway", "db"],
        "packet": { "from": "gateway", "to": "db", "label": "VULNERABLE: SELECT WHERE id = 9942", "type": "blocked" },
        "payloadData": { "query": "SELECT * FROM invoices WHERE id = $1", "leakedRecord": "Beta Corp $50,000 Invoice" },
        "securityStatus": "blocked",
        "securityNote": "Broken Object-Level Authorization (OWASP API Top 10 #1): Zero tenant scoping."
      },
      {
        "step": 3,
        "stageTitle": "Hardened CosmosApp Multi-Tenant Query",
        "description": "CosmosApp query enforces: WHERE id = 9942 AND organization_id = 'org_acme'.",
        "activeNodeIds": ["gateway", "db"],
        "packet": { "from": "gateway", "to": "db", "label": "HARDENED: WHERE id = 9942 AND org = 'acme'", "type": "crypto" },
        "payloadData": { "query": "WHERE id = $1 AND organization_id = $2", "rowsReturned": 0 },
        "securityStatus": "verified",
        "securityNote": "Tenant boundary enforced at database level. Zero rows returned."
      },
      {
        "step": 4,
        "stageTitle": "Anti-Enumeration 404 Response",
        "description": "CosmosApp responds with 404 Not Found (not 403), preventing the attacker from confirming invoice 9942 exists.",
        "activeNodeIds": ["gateway", "attacker"],
        "packet": { "from": "gateway", "to": "attacker", "label": "404 Not Found", "type": "response" },
        "payloadData": { "httpStatus": 404, "message": "Invoice not found", "dataLeaked": False },
        "securityStatus": "verified",
        "securityNote": "Complete BOLA/IDOR immunity: Multi-tenant scoping + anti-enumeration response."
      }
    ]
  },

  # 25. xss-csp-defense-in-depth
  "xss-csp-defense-in-depth": {
    "topicId": "xss-csp-defense-in-depth",
    "title": "Cross-Site Scripting (XSS) Defenses & Nonce-Based CSP",
    "subtitle": "Watch context-aware output encoding and cryptographic response nonces block script injection",
    "nodes": [
      { "id": "attacker", "label": "Attacker Payload", "role": "<script>alert(1)</script>", "iconType": "attacker", "x": 12, "y": 50 },
      { "id": "sanitizer", "label": "DOMPurify Sanitizer", "role": "Output Encoding", "iconType": "gateway", "x": 42, "y": 50 },
      { "id": "csp", "label": "Browser CSP Core", "role": "script-src 'nonce-...'", "iconType": "hsm", "x": 72, "y": 50 },
      { "id": "dom", "label": "Rendered DOM", "role": "Safe Text Output", "iconType": "client", "x": 90, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Malicious Script Injection Attempt",
        "description": "Attacker submits a stored comment with embedded JavaScript payload intended to steal cookies.",
        "activeNodeIds": ["attacker", "sanitizer"],
        "packet": { "from": "attacker", "to": "sanitizer", "label": "Submit <script>alert(1)</script>", "type": "request" },
        "payloadData": { "input": "<script>steal(document.cookie)</script>", "threat": "Stored XSS" },
        "securityStatus": "warning",
        "securityNote": "Untrusted input must never be inserted into DOM without sanitization."
      },
      {
        "step": 2,
        "stageTitle": "Context-Aware HTML Encoding (Layer 1)",
        "description": "DOMPurify encodes '<' as '&lt;'. The string becomes inert characters that cannot be executed by the browser HTML parser.",
        "activeNodeIds": ["sanitizer"],
        "payloadData": { "encodedOutput": "&lt;script&gt;steal()&lt;/script&gt;", "executable": False },
        "securityStatus": "verified",
        "securityNote": "Context-encoding renders characters completely safe as text nodes."
      },
      {
        "step": 3,
        "stageTitle": "Cryptographic Nonce Evaluation (Layer 2 - CSP)",
        "description": "Even if unencoded HTML slips through, the browser CSP requires script-src 'nonce-rAnd0m'. Injected script lacks nonce and is BLOCKED!",
        "activeNodeIds": ["sanitizer", "csp"],
        "packet": { "from": "sanitizer", "to": "csp", "label": "Validate Script Nonce -> REJECTED", "type": "blocked" },
        "payloadData": { "requiredNonce": "rAnd0m992", "scriptNonce": "NONE", "cspAction": "REFUSE_EXECUTION" },
        "securityStatus": "blocked",
        "securityNote": "Content Security Policy provides an unbypassable second layer of hardware-level defense."
      }
    ]
  },

  # 26. cors-security-preflights
  "cors-security-preflights": {
    "topicId": "cors-security-preflights",
    "title": "Cross-Origin Resource Sharing (CORS) & Preflight Handshake",
    "subtitle": "Watch OPTIONS preflight negotiations and credential restrictions defend against cross-origin data theft",
    "nodes": [
      { "id": "browser", "label": "Browser (cosmos.app)", "role": "Origin: cosmos.app", "iconType": "client", "x": 15, "y": 50 },
      { "id": "api", "label": "API (api.cosmos.app)", "role": "Allowed Origin Whitelist", "iconType": "gateway", "x": 55, "y": 50 },
      { "id": "evil", "label": "evil.com", "role": "Untrusted Origin", "iconType": "attacker", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Preflight OPTIONS Query Dispatched",
        "description": "Browser detects cross-origin DELETE request. Dispatches OPTIONS preflight to verify server permissions.",
        "activeNodeIds": ["browser", "api"],
        "packet": { "from": "browser", "to": "api", "label": "OPTIONS /api/data (Origin: cosmos.app)", "type": "request" },
        "payloadData": { "requestMethod": "DELETE", "requestHeaders": "X-CSRF-Token, Authorization" },
        "securityStatus": "normal",
        "securityNote": "Preflight protects server from processing mutating requests without origin clearance."
      },
      {
        "step": 2,
        "stageTitle": "Origin Whitelist Clearance",
        "description": "API checks origin 'https://cosmos.app' against whitelist. Returns Access-Control-Allow-Origin with credentials: True.",
        "activeNodeIds": ["api", "browser"],
        "packet": { "from": "api", "to": "browser", "label": "204 No Content (Allowed)", "type": "response" },
        "payloadData": { "allowOrigin": "https://cosmos.app", "allowCredentials": True, "maxAge": 86400 },
        "securityStatus": "verified",
        "securityNote": "Server never uses wildcard (*) with credentials."
      },
      {
        "step": 3,
        "stageTitle": "Untrusted Origin Blocked (evil.com)",
        "description": "If evil.com makes the same request, API omits CORS headers. The browser immediately drops the response!",
        "activeNodeIds": ["evil", "api"],
        "packet": { "from": "evil", "to": "api", "label": "Origin: https://evil.com -> BLOCKED", "type": "blocked" },
        "payloadData": { "origin": "https://evil.com", "corsAllowed": False, "dataReadByEvil": False },
        "securityStatus": "blocked",
        "securityNote": "Same-Origin Policy guarantees evil.com cannot read private API data."
      }
    ]
  },

  # 27. credential-stuffing-rate-limiting
  "credential-stuffing-rate-limiting": {
    "topicId": "credential-stuffing-rate-limiting",
    "title": "Credential Stuffing & Dual-Key Sliding-Window Rate Limiter",
    "subtitle": "Watch distributed residential proxy botnets get throttled by account-level and IP-level sliding windows",
    "nodes": [
      { "id": "botnet", "label": "Botnet (10,000 IPs)", "role": "Credential Stuffing Cluster", "iconType": "attacker", "x": 15, "y": 50 },
      { "id": "gateway", "label": "Edge Rate Limiter", "role": "Sliding-Window Redis", "iconType": "gateway", "x": 52, "y": 50 },
      { "id": "captcha", "label": "Turnstile Gate", "role": "Adaptive Proof-of-Work", "iconType": "lock", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Botnet Launches Distributed Attack",
        "description": "Botnet tests 5,000 leaked passwords across rotating proxy IPs to circumvent simple IP rate limits.",
        "activeNodeIds": ["botnet", "gateway"],
        "packet": { "from": "botnet", "to": "gateway", "label": "High-frequency POST /auth/login", "type": "request" },
        "payloadData": { "incomingRps": 500, "uniqueIps": 1200, "targetAccount": "admin@cosmos.app" },
        "securityStatus": "warning",
        "securityNote": "Per-IP rate limits alone fail against distributed residential proxy networks."
      },
      {
        "step": 2,
        "stageTitle": "Dual-Key Tracking in Redis (Account + IP)",
        "description": "CosmosApp tracks counters for BOTH IP subnet (/24) AND target email address. Account counter hits 5 failures!",
        "activeNodeIds": ["gateway"],
        "payloadData": { "accountFailures": 5, "windowSeconds": 900, "thresholdExceeded": True },
        "securityStatus": "verified",
        "securityNote": "Account-level rate limiting detects targeted credential spraying."
      },
      {
        "step": 3,
        "stageTitle": "Adaptive CAPTCHA Challenge Engaged",
        "description": "Gateway halts automated execution and demands Cloudflare Turnstile verification. Botnet is stopped in its tracks!",
        "activeNodeIds": ["gateway", "captcha"],
        "packet": { "from": "gateway", "to": "captcha", "label": "Trip Adaptive CAPTCHA Challenge", "type": "blocked" },
        "payloadData": { "challengeTriggered": "Turnstile", "botsThrottled": "100%", "accountProtected": True },
        "securityStatus": "verified",
        "securityNote": "Progressive friction stops bots while legitimate humans solve the challenge in seconds."
      }
    ]
  },

  # 28. api-key-security-design
  "api-key-security-design": {
    "topicId": "api-key-security-design",
    "title": "Developer API Key Prefixing & SHA-256 Storage",
    "subtitle": "Trace high-entropy key generation, SHA-256 database hashing, and automated secret scanning",
    "nodes": [
      { "id": "dev", "label": "Developer Client", "role": "SDK / Script", "iconType": "client", "x": 12, "y": 50 },
      { "id": "hasher", "label": "Key Engine", "role": "SHA-256 Hash", "iconType": "hsm", "x": 38, "y": 50 },
      { "id": "db", "label": "PostgreSQL DB", "role": "Hashed Keys Only", "iconType": "database", "x": 65, "y": 50 },
      { "id": "scanner", "label": "GitHub Secret Scanner", "role": "Pattern: cosmos_live_", "iconType": "auth", "x": 88, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Prefixed High-Entropy Key Generation",
        "description": "Server generates 32 bytes of crypto entropy formatted with recognizable prefix: cosmos_live_9a8f2c...",
        "activeNodeIds": ["dev", "hasher"],
        "payloadData": { "fullKey": "cosmos_live_9a8f2c...", "entropyBits": 256, "prefix": "cosmos_live_" },
        "securityStatus": "normal",
        "securityNote": "Prefix enables automated regex detection across code repositories."
      },
      {
        "step": 2,
        "stageTitle": "SHA-256 Storage (Zero Plaintext Secrets)",
        "description": "Server computes SHA-256(fullKey). Only hash is stored in database. Full key shown to developer exactly ONCE.",
        "activeNodeIds": ["hasher", "db"],
        "packet": { "from": "hasher", "to": "db", "label": "Store SHA-256 Hash", "type": "crypto" },
        "payloadData": { "keyHash": "e3b0c442...", "storedPlaintext": "NONE", "fastVerificationMs": 0.4 },
        "securityStatus": "verified",
        "securityNote": "If database leaks, attacker cannot extract usable API keys."
      },
      {
        "step": 3,
        "stageTitle": "Accidental Commit & Instant Revocation",
        "description": "Developer accidentally commits key to public GitHub repo. GitHub Secret Scanning flags prefix and notifies CosmosApp!",
        "activeNodeIds": ["dev", "scanner", "db"],
        "packet": { "from": "scanner", "to": "db", "label": "Revocation Webhook (Key Leaked!)", "type": "blocked" },
        "payloadData": { "detectedBy": "GitHub Secret Scanning", "revocationStatus": "INSTANTLY_REVOKED" },
        "securityStatus": "verified",
        "securityNote": "Prefixing transforms passive compromise into automated instant revocation."
      }
    ]
  },

  # 29. mtls-zero-trust-architecture
  "mtls-zero-trust-architecture": {
    "topicId": "mtls-zero-trust-architecture",
    "title": "Mutual TLS (mTLS) & Zero Trust Cryptographic Handshake",
    "subtitle": "Watch two-way X.509 certificate exchange and SPIFFE identity validation between microservices",
    "nodes": [
      { "id": "billing", "label": "Billing Service", "role": "TLS Client (X.509)", "iconType": "client", "x": 15, "y": 50 },
      { "id": "ca", "label": "Internal Private CA", "role": "Root Trust Anchor", "iconType": "hsm", "x": 50, "y": 15 },
      { "id": "payment", "label": "Payment Service", "role": "TLS Server (X.509)", "iconType": "database", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Two-Way Certificate Handshake Initiated",
        "description": "Billing initiates TLS. Payment server presents its X.509 certificate AND issues a CertificateRequest to the client.",
        "activeNodeIds": ["billing", "payment"],
        "packet": { "from": "payment", "to": "billing", "label": "ServerHello + CertificateRequest", "type": "request" },
        "payloadData": { "tlsVersion": "TLS 1.3", "mutualAuthMandatory": True },
        "securityStatus": "normal",
        "securityNote": "In mTLS, both sides must present cryptographic proof of identity."
      },
      {
        "step": 2,
        "stageTitle": "Client Certificate & Private Key Proof",
        "description": "Billing presents its X.509 cert containing SPIFFE ID 'spiffe://cosmos/billing' and signs handshake data with its private key.",
        "activeNodeIds": ["billing", "payment", "ca"],
        "packet": { "from": "billing", "to": "payment", "label": "ClientCertificate + CertificateVerify", "type": "crypto" },
        "payloadData": { "clientSpiffeId": "spiffe://cosmos/billing", "caSignature": "VALID" },
        "securityStatus": "verified",
        "securityNote": "Payment server verifies billing certificate against internal Root CA."
      },
      {
        "step": 3,
        "stageTitle": "Encrypted Zero-Trust RPC Tunnel",
        "description": "Handshake complete. High-throughput gRPC messages travel over an encrypted, mutually authenticated tunnel.",
        "activeNodeIds": ["billing", "payment"],
        "packet": { "from": "billing", "to": "payment", "label": "ExecutePayment() [AES-256-GCM]", "type": "response" },
        "payloadData": { "transportSecurity": "AES-256-GCM", "manInTheMiddleImmune": True, "zeroTrustCompliant": True },
        "securityStatus": "verified",
        "securityNote": "Network perimeter is irrelevant; identity is cryptographically guaranteed."
      }
    ]
  },

  # 30. http-security-headers-defense
  "http-security-headers-defense": {
    "topicId": "http-security-headers-defense",
    "title": "HTTP Security Headers Defense Perimeter",
    "subtitle": "Watch HSTS Preload, nosniff, and frame-ancestors block SSL stripping, MIME confusion, and clickjacking",
    "nodes": [
      { "id": "browser", "label": "User Browser", "role": "Hardware Enforcement", "iconType": "client", "x": 15, "y": 50 },
      { "id": "edge", "label": "Edge Security Proxy", "role": "Headers Injector", "iconType": "gateway", "x": 50, "y": 50 },
      { "id": "attacker", "label": "Attacker Framing Site", "role": "Clickjacking / Sniffing", "iconType": "attacker", "x": 85, "y": 50 }
    ],
    "stages": [
      {
        "step": 1,
        "stageTitle": "Strict-Transport-Security (HSTS Preload)",
        "description": "Edge injects HSTS: max-age=63072000; includeSubDomains; preload. Browser forbids unencrypted HTTP forever!",
        "activeNodeIds": ["edge", "browser"],
        "packet": { "from": "edge", "to": "browser", "label": "Strict-Transport-Security: max-age=2y; preload", "type": "response" },
        "payloadData": { "hstsPreload": True, "sslStrippingImmune": True },
        "securityStatus": "verified",
        "securityNote": "Browser hardcodes HTTPS; attacks cannot downgrade connection to HTTP."
      },
      {
        "step": 2,
        "stageTitle": "X-Content-Type-Options: nosniff",
        "description": "Browser refuses to execute uploaded files (e.g. avatar.png) as JavaScript. MIME-confusion attacks neutralized.",
        "activeNodeIds": ["browser"],
        "payloadData": { "mimeSniffing": "DISABLED", "xContentOptions": "nosniff" },
        "securityStatus": "verified",
        "securityNote": "Stops attackers from executing scripts disguised as image uploads."
      },
      {
        "step": 3,
        "stageTitle": "Clickjacking Frame Lockdown",
        "description": "Attacker tries to embed CosmosApp in a hidden <iframe> on evil.com. X-Frame-Options: DENY blocks the frame!",
        "activeNodeIds": ["attacker", "browser"],
        "packet": { "from": "attacker", "to": "browser", "label": "<iframe src='cosmos.app'> -> BLOCKED", "type": "blocked" },
        "payloadData": { "xFrameOptions": "DENY", "clickjackingPrevented": True },
        "securityStatus": "blocked",
        "securityNote": "Transparent clickjacking overlays are impossible."
      }
    ]
  }
}

print(f"Loaded {len(scenarios)} complete bespoke animation scenarios.")

# Generate topicAnimations.ts content
ts_code = """// 3Blue1Brown-style Animation Scenarios for all 30 AuthCosmos Lessons
// Each scenario contains interactive stages, active nodes, animated packets,
// state transformations, payload inspection, and security outcome indicators.

export interface AnimationNode {
  id: string;
  label: string;
  role: string;
  iconType: 'user' | 'client' | 'gateway' | 'auth' | 'redis' | 'database' | 'hsm' | 'attacker' | 'clock' | 'lock';
  x: number; // percentage on canvas (0 to 100)
  y: number; // percentage on canvas (0 to 100)
}

export interface AnimationStage {
  step: number;
  stageTitle: string;
  description: string;
  activeNodeIds: string[];
  packet?: {
    from: string;
    to: string;
    label: string;
    type: 'request' | 'response' | 'blocked' | 'crypto';
  };
  payloadData: Record<string, string | number | boolean | string[]>;
  securityStatus: 'normal' | 'verified' | 'blocked' | 'warning';
  securityNote: string;
  highlightAction?: string;
}

export interface TopicAnimationScenario {
  topicId: string;
  title: string;
  subtitle: string;
  nodes: AnimationNode[];
  stages: AnimationStage[];
}

export const TOPIC_ANIMATIONS: Record<string, TopicAnimationScenario> = """ + json.dumps(scenarios, indent=2) + """;

export function getAnimationScenario(topicId: string, topicTitle: string, category: string): TopicAnimationScenario {
  if (TOPIC_ANIMATIONS[topicId]) {
    return TOPIC_ANIMATIONS[topicId];
  }

  return {
    topicId,
    title: `${topicTitle} Handshake Simulation`,
    subtitle: `Step through the architectural state changes of ${topicTitle}`,
    nodes: [
      { id: 'client', label: 'Client / Origin', role: 'Initiating Entity', iconType: 'client', x: 15, y: 50 },
      { id: 'pep', label: 'Security Gateway', role: 'Enforcement Point', iconType: 'gateway', x: 50, y: 50 },
      { id: 'backend', label: 'Protected Service', role: 'Identity & Resource', iconType: 'database', x: 85, y: 50 },
    ],
    stages: [
      {
        step: 1,
        stageTitle: 'Inbound Request & Protocol Handshake',
        description: `Client initiates secure handshake for ${topicTitle} across the transport boundary.`,
        activeNodeIds: ['client', 'pep'],
        packet: { from: 'client', to: 'pep', label: 'Initiate Request', type: 'request' },
        payloadData: { protocol: 'HTTPS / TLS 1.3', category, status: 'Handshake Initiated' },
        securityStatus: 'normal',
        securityNote: 'Transport security established. Perimeter evaluates incoming assertions.'
      },
      {
        step: 2,
        stageTitle: 'Cryptographic & Policy Evaluation',
        description: 'Security Gateway inspects headers, validates tokens/hashes, and computes authorization decision.',
        activeNodeIds: ['pep'],
        payloadData: { cryptographicProof: 'Computed', policyValidation: 'Evaluating rules', defense: 'Active' },
        securityStatus: 'verified',
        securityNote: 'Rules evaluated in real time: verifying integrity, expiration, and tenant constraints.'
      },
      {
        step: 3,
        stageTitle: 'Secure Execution on Protected Service',
        description: 'Assertion verified! Gateway dispatches authorized operation to the backend resource service.',
        activeNodeIds: ['pep', 'backend'],
        packet: { from: 'pep', to: 'backend', label: 'Authorized RPC', type: 'response' },
        payloadData: { permission: 'GRANTED', isolationBoundaries: 'Enforced', latencyMs: 2 },
        securityStatus: 'verified',
        securityNote: 'Zero Trust verified: Backend receives pre-validated, cryptographically authenticated context.'
      },
      {
        step: 4,
        stageTitle: 'Verified Response Dispatched to Client',
        description: 'Operation completes successfully and returns protected response with hardened security headers.',
        activeNodeIds: ['backend', 'client'],
        packet: { from: 'backend', to: 'client', label: '200 OK (Secure)', type: 'response' },
        payloadData: { httpStatus: 200, integrityVerified: true, executionComplete: true },
        securityStatus: 'verified',
        securityNote: 'Full defense-in-depth loop closed without leaking internal system state.'
      }
    ]
  };
}
"""

with open("/home/subhajit/project/cscosmos/src/components/visualizers/authviz/data/topicAnimations.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("Successfully wrote full 30-topic animations to topicAnimations.ts!")
