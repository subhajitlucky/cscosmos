export interface AuthTopic {
  id: string;
  title: string;
  category: 'oauth-oidc' | 'jwt-tokens' | 'sessions-cookies' | 'authz-rbac' | 'cryptography-passwords' | 'resilience-security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const AUTH_TOPICS: AuthTopic[] = [
  {
    id: 'oauth2-pkce-flow-security',
    title: 'OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange)',
    category: 'oauth-oidc',
    difficulty: 'Advanced',
    summary: 'PKCE eliminates the need for client secrets in public Single Page Apps (React/Next.js) and Mobile Apps. The client generates a random Code Verifier and sends its SHA-256 Code Challenge; the authorization server verifies the hash on token exchange.',
    mentalModel: 'The Tamper-Evident Half-Ticket: Before sending a messenger to pick up your concert pass, you rip a ticket in half (Code Verifier) and give the box office a photo of the unique jagged rip line (Code Challenge). When the messenger arrives with the authorization code, only the person presenting the matching half-ticket can claim the real wristband.',
    codeSnippet: `// 1. Client generates high-entropy random string (Code Verifier):
const codeVerifier = generateRandomString(64);

// 2. Client computes SHA-256 hash (Code Challenge):
const codeChallenge = base64UrlEncode(sha256(codeVerifier));

// 3. User redirects to Auth0/Google with challenge:
// GET /authorize?response_type=code&client_id=...&code_challenge=\${codeChallenge}&code_challenge_method=S256

// 4. Client exchanges received Auth Code + Verifier for Tokens:
// POST /oauth/token { code: "auth_code_123", code_verifier: codeVerifier }`,
    takeaways: [
      'Eliminates Client Secrets in Browsers: Public web clients cannot safely store a client secret; PKCE prevents authorization code interception attacks.',
      'S256 Challenge Method: Always use SHA-256 hashing (code_challenge_method=S256) rather than plain text.',
      'Industry Mandate: OAuth 2.1 officially deprecates the legacy Implicit Flow in favor of Authorization Code with PKCE.'
    ],
    commonPitfall: {
      mistake: 'Using the legacy OAuth 2.0 Implicit Grant flow (tokens returned directly in URL hash fragments), exposing access tokens in browser history and Referer headers.',
      fix: 'Always use Authorization Code Flow with PKCE for all Single Page Apps and mobile clients.'
    },
    nextTopicId: 'jwt-structure-rs256-vs-hs256'
  },
  {
    id: 'jwt-structure-rs256-vs-hs256',
    title: 'JSON Web Tokens (JWT): Header, Payload Claims & RS256 vs HS256',
    category: 'jwt-tokens',
    difficulty: 'Advanced',
    summary: 'JWTs encode claims into 3 Base64URL-encoded segments separated by dots: Header.Payload.Signature. HS256 uses a symmetric shared secret, while RS256 uses an asymmetric private key to sign and a public key (JWKS) to verify across microservices.',
    mentalModel: 'The Notarized Government Passport: The passport lists your photo and birthdate (Payload Claims). The government notary stamps it with an embossed wax seal (RS256 Digital Signature). Any border officer worldwide can verify the seal using the public notary stamp without calling headquarters.',
    codeSnippet: `// JWT Format: [Base64Header].[Base64Payload].[Signature]

// Header: { "alg": "RS256", "typ": "JWT", "kid": "key_2026_01" }
// Payload: { "sub": "usr_942", "role": "admin", "exp": 1723650000, "iss": "https://auth.corp.io" }

// Node.js Verification with RS256 Public Key:
import jwt from 'jsonwebtoken';

function verifyAccessToken(token: string, publicKeyPem: string) {
  return jwt.verify(token, publicKeyPem, {
    algorithms: ['RS256'], // Explicitly whitelist algorithm!
    issuer: 'https://auth.corp.io',
    audience: 'https://api.corp.io'
  });
}`,
    takeaways: [
      'Stateless Verification: Microservices verify RS256 signatures locally using cached public keys without querying the auth database.',
      'Standard Claims: sub (subject), iss (issuer), aud (audience), exp (expiration time), nbf (not before).',
      'RS256 vs HS256: RS256 allows downstream microservices to verify tokens without trusting them with the private signing secret.'
    ],
    commonPitfall: {
      mistake: 'Failing to whitelist algorithms during verification, allowing attackers to forge tokens with "alg": "none" or swap RS256 public keys into HS256 secrets.',
      fix: 'Explicitly enforce { algorithms: ["RS256"] } during jwt.verify().'
    },
    nextTopicId: 'session-cookies-vs-bearer-tokens'
  },
  {
    id: 'session-cookies-vs-bearer-tokens',
    title: 'Storage & Transport Security: HttpOnly SameSite Cookies vs Bearer Tokens',
    category: 'sessions-cookies',
    difficulty: 'Intermediate',
    summary: 'Storing JWTs in LocalStorage leaves them vulnerable to instant theft via Cross-Site Scripting (XSS). HttpOnly, Secure, SameSite=Strict cookies cannot be accessed by malicious JavaScript, completely eliminating XSS token exfiltration.',
    mentalModel: 'The Safe Deposit Box in the Bank Vault: LocalStorage is leaving your wallet on the coffee table (any JavaScript on the page can steal it). An HttpOnly cookie is putting your money in a bank vault that only the armored delivery truck (the browser HTTP request engine) can access.',
    codeSnippet: `// Secure Cookie Header (Set by Backend):
// Set-Cookie: session_token=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Domain=corp.io

// 1. HttpOnly: Blocks document.cookie access in JavaScript (Stops XSS token theft!)
// 2. Secure: Transmitted strictly over encrypted HTTPS
// 3. SameSite=Lax: Prevents Cross-Site Request Forgery (CSRF) on cross-origin POSTs`,
    takeaways: [
      'HttpOnly: Prevents any script on the page (XSS shims, compromised npm packages) from reading the session credential.',
      'SameSite=Strict vs Lax: SameSite=Lax permits top-level navigation links while blocking cross-origin form submissions and image tags.',
      'Token Storage Rule: Store Refresh Tokens in HttpOnly cookies and keep Access Tokens in memory.'
    ],
    commonPitfall: {
      mistake: 'Storing long-lived JWT access/refresh tokens in localStorage or sessionStorage where any XSS vulnerability immediately compromises the user account.',
      fix: 'Store authentication tokens in HttpOnly, Secure, SameSite=Lax cookies.'
    },
    nextTopicId: 'rbac-vs-abac-access-control'
  },
  {
    id: 'rbac-vs-abac-access-control',
    title: 'Authorization Engines: Role-Based (RBAC) vs Attribute-Based (ABAC)',
    category: 'authz-rbac',
    difficulty: 'Intermediate',
    summary: 'RBAC grants permissions based on static user roles (Admin, Editor, Viewer). ABAC (Policy Decision Points) evaluates fine-grained dynamic attributes (User Department, Document Owner ID, IP Geolocation, Working Hours).',
    mentalModel: 'The Hospital Access Badge vs The Doctor On-Call Policy: RBAC is a plastic badge that says "Doctor" (opens the doctor lounge). ABAC checks: "Is this Doctor currently assigned to Patient #102, is the current time within their shift, and are they inside the surgical wing?"',
    codeSnippet: `// ABAC Policy Engine Evaluation:
interface PolicyContext {
  user: { id: string; role: string; department: string; ip: string };
  resource: { id: string; ownerId: string; confidentiality: string };
  environment: { currentHour: number; isVpn: boolean };
}

function canEditDocument(ctx: PolicyContext): boolean {
  // 1. Admins can edit anything:
  if (ctx.user.role === 'ADMIN') return true;
  
  // 2. Resource owner can edit if connected via secure corporate VPN:
  if (ctx.user.id === ctx.resource.ownerId && ctx.environment.isVpn) return true;
  
  // 3. Deny by default:
  return false;
}`,
    takeaways: [
      'Role Explosion in RBAC: As permissions grow complex, RBAC creates dozens of rigid roles (BillingAdminUS, BillingAdminEU).',
      'ABAC Dynamism: Expresses contextual policies (e.g. "Only doctors on active shift in the pediatric department can view pediatric charts").',
      'Modern Engines: Open Policy Agent (OPA / Rego), AWS Cedar, Casbin.'
    ],
    commonPitfall: {
      mistake: 'Hardcoding static role checks (e.g. if (user.role === "admin")) across hundreds of route handlers, making policy updates impossible without code rewrites.',
      fix: 'Use centralized policy evaluation middleware with ABAC / permission sets.'
    },
    nextTopicId: 'password-hashing-argon2id-bcrypt'
  },
  {
    id: 'password-hashing-argon2id-bcrypt',
    title: 'Password Hashing: Argon2id vs bcrypt vs PBKDF2 & Salt Hardness',
    category: 'cryptography-passwords',
    difficulty: 'Advanced',
    summary: 'Standard cryptographic hashes (SHA-256, MD5) execute in nanoseconds, making them dangerously susceptible to GPU brute-force attacks. Password hashing functions (Argon2id, bcrypt) are computationally expensive and memory-hard, enforcing unique random salts per user.',
    mentalModel: 'The Vault Lock with a Sand Timer: SHA-256 is a lock that opens in 1 microsecond (a thief can try 1,000,000,000 keys per second). Argon2id forces the lock to wait 300 milliseconds and fill a 64MB memory bucket on every single guess, making GPU cracking economically impossible.',
    codeSnippet: `// Argon2id Password Hashing (OWASP Recommendation):
import argon2 from 'argon2';

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id, // Hybrid memory-hard & side-channel resistant
    memoryCost: 65536,     // 64 MB of RAM per hash
    timeCost: 3,           // 3 iterations
    parallelism: 4         // 4 threads
  });
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}`,
    takeaways: [
      'Unique Cryptographic Salt: Prevents precomputed Rainbow Table attacks by ensuring two identical passwords produce completely different hash outputs.',
      'Memory Hardness: Argon2id requires large chunks of RAM, rendering ASIC/GPU hardware clusters ineffective.',
      'Work Factor Scaling: Hash complexity can be tuned upwards over time as computer hardware gets faster.'
    ],
    commonPitfall: {
      mistake: 'Hashing passwords with fast algorithms like SHA-256 or MD5, even with a salt; modern GPUs can compute over 100 billion SHA-256 hashes per second.',
      fix: 'Always use Argon2id, bcrypt (cost factor >= 12), or PBKDF2 (>= 600,000 iterations).'
    },
    nextTopicId: 'openid-connect-oidc-id-tokens'
  },
  {
    id: 'openid-connect-oidc-id-tokens',
    title: 'OpenID Connect (OIDC): Identity Layer, ID Tokens & JWKS Key Rotation',
    category: 'oauth-oidc',
    difficulty: 'Advanced',
    summary: 'OIDC is an identity layer built on top of OAuth 2.0. While OAuth 2.0 provides authorization (Access Tokens for API access), OIDC provides authentication (ID Tokens in JWT format containing user identity claims, signed by the IdP).',
    mentalModel: 'The Hotel Room Keycard vs Government ID: The Access Token is your hotel room keycard (grants access to Room 304, but doesn\'t say who you are). The ID Token is your driver\'s license (proves your name, photo, and identity to the hotel front desk).',
    codeSnippet: `// OIDC Discovery: GET /.well-known/openid-configuration
// Returns jwks_uri: "https://auth.corp.io/.well-known/jwks.json"

// JWKS Public Key Set:
{
  "keys": [
    {
      "kty": "RSA",
      "kid": "key_2026_01",
      "use": "sig",
      "alg": "RS256",
      "n": "u1g...public_modulus...",
      "e": "AQAB"
    }
  ]
}`,
    takeaways: [
      'Access Token vs ID Token: Access Tokens are meant for API resource servers; ID Tokens are meant for client applications to render user profiles.',
      'JWKS Key Rotation: Auth servers publish public keys at /.well-known/jwks.json with matching kid (Key ID) headers, enabling seamless zero-downtime key rotation.'
    ],
    commonPitfall: {
      mistake: 'Using an OAuth 2.0 Access Token to authenticate a user on the client side instead of validating an OIDC ID Token.',
      fix: 'Use OIDC ID Tokens for client-side user identification and Access Tokens strictly for API authorization.'
    },
    nextTopicId: 'webauthn-passkeys-fido2'
  },
  {
    id: 'webauthn-passkeys-fido2',
    title: 'WebAuthn & FIDO2: Biometric Hardware Passkeys & Phishing Defense',
    category: 'cryptography-passwords',
    difficulty: 'Expert',
    summary: 'WebAuthn replaces passwords with asymmetric public-key cryptography stored in device hardware Secure Enclaves (TouchID, FaceID, YubiKey). Login challenges are signed by device private keys bound strictly to origin domain names, making credential phishing mathematically impossible.',
    mentalModel: 'The Domain-Locked Biometric Safe: TouchID signs a cryptographic challenge directly on your laptop TPM chip. Because the browser binds the signature strictly to "login.bank.com", a phishing clone at "login.fake-bank.com" cannot trick your device into signing.',
    codeSnippet: `// Browser WebAuthn API:
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: serverChallengeUint8,
    rp: { name: "Corp Portal", id: "corp.io" },
    user: { id: userIdUint8, name: "alice@corp.io", displayName: "Alice" },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256
    authenticatorSelection: { userVerification: "required" }
  }
});`,
    takeaways: [
      'Zero Server-Side Passwords: The server stores only public keys; a database breach reveals zero credentials.',
      'Phishing Resistance: Hardware binds cryptographic signatures strictly to the browser\'s actual TLS origin domain.'
    ],
    commonPitfall: {
      mistake: 'Failing to verify the clientDataJSON challenge and origin on the backend server during passkey registration/login.',
      fix: 'Always parse and verify clientDataJSON on the backend before accepting WebAuthn credentials.'
    },
    nextTopicId: 'multi-factor-authentication-totp'
  },
  {
    id: 'multi-factor-authentication-totp',
    title: 'Time-Based One-Time Passwords (TOTP RFC 6238) & 30s Timesteps',
    category: 'oauth-oidc',
    difficulty: 'Intermediate',
    summary: 'TOTP computes dynamic 6-digit codes by taking a shared Base32 secret key and a 30-second epoch time counter (T = floor(UnixTime / 30)), hashing them with HMAC-SHA1 and performing 4-bit dynamic truncation.',
    mentalModel: 'The Synchronized Atomic Watches: You and the bank both hold identical secret formulas and synchronized clocks. Every 30 seconds, both watches advance by 1 tick, computing the exact same 6-digit number without any network connection.',
    codeSnippet: `import { createHmac } from 'crypto';

function generateTOTP(secretBase32: string, timeStepSeconds = 30): string {
  const counter = Math.floor(Date.now() / 1000 / timeStepSeconds);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));
  
  const hmac = createHmac('sha1', base32Decode(secretBase32)).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return code.toString().padStart(6, '0');
}`,
    takeaways: [
      'Clock Drift Tolerance: Production servers verify code at T-1, T, and T+1 (±30 seconds) to account for client device clock skew.',
      'Air-Gapped Operation: Works completely offline on mobile devices (Google Authenticator) with zero SMS/carrier interception risks.'
    ],
    commonPitfall: {
      mistake: 'Allowing the same 6-digit TOTP code to be used multiple times within its 30-second window (vulnerable to replay attacks).',
      fix: 'Store used TOTP tokens in Redis for 60 seconds and reject duplicate attempts.'
    },
    nextTopicId: 'saml2-enterprise-sso'
  },
  {
    id: 'saml2-enterprise-sso',
    title: 'Enterprise Single Sign-On (SSO): SAML 2.0 vs OIDC & XML Signatures',
    category: 'oauth-oidc',
    difficulty: 'Expert',
    summary: 'SAML 2.0 exchanges XML-based assertions between an Identity Provider (Okta, Azure AD) and a Service Provider (enterprise SaaS application). Authentication occurs via browser POST/Redirect bindings with XML digital signatures.',
    mentalModel: 'The Corporate Security Escort: You arrive at an enterprise skyscraper (SaaS app). The guard directs you to the corporate identity office (Okta). The corporate office hands you an official signed wax-sealed letter (SAML XML Assertion) that the building guard accepts.',
    codeSnippet: `<!-- SAML 2.0 XML Assertion: -->
<saml:Assertion ID="_abc123" IssueInstant="2026-08-14T10:00:00Z">
  <saml:Issuer>https://idp.okta.com/exk123</saml:Issuer>
  <saml:Subject>
    <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">alice@corp.com</saml:NameID>
  </saml:Subject>
  <ds:Signature>...</ds:Signature>
</saml:Assertion>`,
    takeaways: [
      'Enterprise Standard: Ubiquitous in Fortune 500 IT departments for central employee onboarding and offboarding.',
      'XML Signature Wrapping (XSW): High-severity security vulnerability where attackers inject forged assertions outside the signature validation scope.'
    ],
    commonPitfall: {
      mistake: 'Validating SAML XML assertions using standard DOM parsers without strict schema validation, enabling XML Signature Wrapping attacks.',
      fix: 'Use enterprise-grade SAML libraries (Passport-SAML, node-saml) that strictly enforce signature target URI references.'
    },
    nextTopicId: 'token-revocation-blacklisting'
  },
  {
    id: 'token-revocation-blacklisting',
    title: 'JWT Revocation & Blacklisting: Short-Lived Tokens vs Redis Bloom Filters',
    category: 'jwt-tokens',
    difficulty: 'Advanced',
    summary: 'Stateless JWTs cannot be revoked natively before their exp timestamp. Architectures enforce instant logout via Short-Lived Access Tokens (15 mins) + Refresh Token Rotation with Redis Blacklists or Bloom Filters.',
    mentalModel: 'The 15-Minute Visitor Badge: Instead of issuing a permanent visitor pass that requires guards to check a 10,000-person banned list on every door, you issue a 15-minute temporary badge. If an employee is fired, their badge expires in minutes without global locks.',
    codeSnippet: `// Redis Token Blacklist on Instant Logout:
async function logoutUser(jti: string, exp: number) {
  const ttlSeconds = Math.max(0, exp - Math.floor(Date.now() / 1000));
  // Store revoked token JTI with remaining lifetime TTL:
  await redis.set(\`blacklist:\${jti}\`, 'revoked', 'EX', ttlSeconds);
}

// Fast In-Memory Check:
async function isTokenRevoked(jti: string): Promise<boolean> {
  const result = await redis.get(\`blacklist:\${jti}\`);
  return result !== null;
}`,
    takeaways: [
      'Short-Lived Access Tokens (10-15 mins): Limits the damage window of an unrevoked stolen token.',
      'Refresh Token Rotation: Every refresh token use emits a NEW refresh token and invalidates the old one; reusing an old refresh token invalidates the entire token family (theft detection!).'
    ],
    commonPitfall: {
      mistake: 'Issuing stateless JWT access tokens with 30-day expiration times and no revocation mechanism.',
      fix: 'Set access token expiration to 15 minutes, paired with rotating refresh tokens stored in HttpOnly cookies.'
    },
    nextTopicId: 'csrf-token-synchronizer-pattern'
  },
  {
    id: 'csrf-token-synchronizer-pattern',
    title: 'Cross-Site Request Forgery (CSRF): Synchronizer Tokens & SameSite Cookies',
    category: 'sessions-cookies',
    difficulty: 'Intermediate',
    summary: 'CSRF tricks an authenticated user\'s browser into sending unauthorized POST requests to a vulnerable server. Mitigated via SameSite=Lax/Strict cookie attributes and Synchronizer CSRF Token headers (X-CSRF-Token).',
    mentalModel: 'The Forged Delivery Check: A scammer mails an invoice pretending to be you because the post office automatically attaches your return address (session cookie). The bank demands a secret one-time transaction stamp (CSRF Token) that only your legitimate banking dashboard knows.',
    codeSnippet: `// Double Submit CSRF Cookie Pattern:
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const cookieToken = req.cookies['csrf_token'];
    const headerToken = req.headers['x-csrf-token'];
    if (!cookieToken || cookieToken !== headerToken) {
      return res.status(403).json({ error: 'CSRF token mismatch' });
    }
  }
  next();
});`,
    takeaways: [
      'SameSite=Lax: Modern browser default that blocks cookies on cross-site POSTs, but permits top-level GET navigation.',
      'Synchronizer Token: Random cryptographic token generated per session and verified on all state-changing HTTP mutations.'
    ],
    commonPitfall: {
      mistake: 'Relying exclusively on SameSite cookies for CSRF defense on older browsers or mobile webviews that default to SameSite=None.',
      fix: 'Implement defense-in-depth with custom X-CSRF-Token headers or Origin/Referer header verification.'
    },
    nextTopicId: 'xss-token-theft-mitigations'
  },
  {
    id: 'xss-token-theft-mitigations',
    title: 'Cross-Site Scripting (XSS) Defenses & Content Security Policy (CSP)',
    category: 'sessions-cookies',
    difficulty: 'Advanced',
    summary: 'XSS injects malicious JavaScript into trusted web pages (Stored, Reflected, DOM-based). Defenses require strict Context-Aware Output Encoding and Content Security Policy (CSP) headers restricting script-src execution.',
    mentalModel: 'The Restaurant Food Quality Inspector: CSP is a strict checklist at the restaurant door forbidding any foreign ingredients (untrusted scripts) from entering the kitchen, ensuring only pre-approved chefs (trusted domains) can cook.',
    codeSnippet: `// Content-Security-Policy (CSP) HTTP Header:
// Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m123' https://trusted-cdn.com; object-src 'none';

// Nonce-based Script Execution (Next.js):
// <script nonce="rAnd0m123" src="/main.js"></script>`,
    takeaways: [
      'CSP script-src Nonces: Browser executes inline scripts only if they contain a cryptographically random matching nonce.',
      'DOMPurify Sanitization: Strips dangerous HTML event handlers (onload, onerror) before inserting user content into innerHTML.'
    ],
    commonPitfall: {
      mistake: 'Using dangerous innerHTML or React dangerouslySetInnerHTML without sanitizing user input through DOMPurify.',
      fix: 'Use textContent, React JSX auto-escaping, or DOMPurify.sanitize().'
    },
    nextTopicId: 'cors-preflight-credentials'
  },
  {
    id: 'cors-preflight-credentials',
    title: 'Cross-Origin Resource Sharing (CORS): Preflight OPTIONS & Credentials',
    category: 'sessions-cookies',
    difficulty: 'Intermediate',
    summary: 'CORS is a browser security mechanism that restricts cross-origin HTTP requests. Requests with custom headers or non-simple methods trigger an HTTP OPTIONS Preflight request to verify allowed origins, methods, and credentials.',
    mentalModel: 'The Embassy Passport Verification: Before a foreign diplomat (cross-origin script) enters the country with documents, the border guard sends an advance scout (OPTIONS Preflight) to check if their embassy has an active mutual treaty (Access-Control-Allow-Origin).',
    codeSnippet: `// Express.js Secure CORS Configuration:
import cors from 'cors';

app.use(cors({
  origin: ['https://app.corp.io', 'https://admin.corp.io'], // Explicit whitelist!
  credentials: true, // Allows HttpOnly session cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));`,
    takeaways: [
      'Never use Wildcard with Credentials: Browsers strictly reject Access-Control-Allow-Origin: * when Access-Control-Allow-Credentials: true.',
      'Browser-Enforced Security: CORS is enforced by the client browser, not the server; backend curl/Postman scripts bypass CORS entirely.'
    ],
    commonPitfall: {
      mistake: 'Setting Access-Control-Allow-Origin: * on authenticated endpoints requiring cookies or Authorization headers.',
      fix: 'Explicitly validate origin against a dynamic whitelist of approved domains.'
    },
    nextTopicId: 'api-key-management-hashing'
  },
  {
    id: 'api-key-management-hashing',
    title: 'Developer API Keys: Prefixing (sk_live_), SHA-256 Hashed Storage & Scopes',
    category: 'cryptography-passwords',
    difficulty: 'Intermediate',
    summary: 'Developer API keys authenticate programmatic machine-to-machine requests. Stripe-style API key design uses human-readable prefixes (sk_live_), high-entropy random bytes, and SHA-256 hashed storage in databases.',
    mentalModel: 'The Master Hotel Service Key: The key has a label on the handle (sk_live_orders) so developers know its purpose, but the lock mechanism inside the door only remembers the secret pin combination (SHA-256 hash in database).',
    codeSnippet: `import { randomBytes, createHash } from 'crypto';

function generateApiKey(): { rawKey: string; keyHash: string; prefix: string } {
  const secretBytes = randomBytes(24).toString('base64url');
  const rawKey = \`sk_live_\${secretBytes}\`; // Shown once to user!
  const keyHash = createHash('sha256').update(rawKey).digest('hex'); // Stored in DB
  return { rawKey, keyHash, prefix: 'sk_live_' };
}`,
    takeaways: [
      'Hash Stored Keys: The database stores only SHA-256 hashes of API keys; a database breach does not expose active developer keys.',
      'Show Key Once: Display the full API key in the UI only upon initial generation, prompting the developer to copy it to their secret manager.'
    ],
    commonPitfall: {
      mistake: 'Storing plaintext developer API keys in the database, allowing unauthorized internal employees or database dumps to compromise client systems.',
      fix: 'Always store cryptographic SHA-256 hashes of API keys in storage backends.'
    },
    nextTopicId: 'distributed-session-stores-redis'
  },
  {
    id: 'distributed-session-stores-redis',
    title: 'Distributed Session Storage: Sticky Sessions vs Redis Clusters',
    category: 'sessions-cookies',
    difficulty: 'Advanced',
    summary: 'Stateful sessions store user state on the server. Sticky load balancing pins users to single servers (vulnerable to server crashes). Distributed Redis session clusters share session state across all horizontal API nodes.',
    mentalModel: 'The Shared Hotel Front Desk Computer: If you check in at Front Desk 1, your room status is saved to the central cloud database (Redis). When you ask for a fresh towel at Front Desk 4, the clerk pulls up your active session instantly.',
    codeSnippet: `// Express Session with Redis Store (ioredis):
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL!);

app.use(session({
  store: new RedisStore({ client: redisClient, prefix: "sess:" }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 86400000 }
}));`,
    takeaways: [
      'Zero Server Affinity: Any server in the cluster can handle any request, simplifying horizontal autoscaling and blue-green deployments.',
      'Automatic Expiry: Redis key TTLs automatically clean up abandoned sessions without background garbage collection cron jobs.'
    ],
    commonPitfall: {
      mistake: 'Storing sessions in Node.js local memory (MemoryStore) in production; memory leaks occur and scaling to 2+ instances breaks logins.',
      fix: 'Use Redis or a distributed key-value store for session persistence across load-balanced instances.'
    },
    nextTopicId: 'mtls-zero-trust-service-auth'
  },
  {
    id: 'mtls-zero-trust-service-auth',
    title: 'Mutual TLS (mTLS) & Zero Trust Service-to-Service Authentication',
    category: 'cryptography-passwords',
    difficulty: 'Expert',
    summary: 'Standard TLS authenticates only the server to the client. Mutual TLS (mTLS) requires both client and server to present and verify X.509 cryptographic certificates issued by a private Certificate Authority (CA), enforcing Zero Trust in microservices.',
    mentalModel: 'The Secret Agent Handshake: In standard TLS, the agent asks to see the handler\'s badge. In mTLS, both the agent and the handler must present valid CIA credentials to each other before speaking a single word.',
    codeSnippet: `// Node.js HTTPS Server Enforcing mTLS Client Certificates:
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  ca: fs.readFileSync('internal-ca.pem'), // Trusted Private CA
  requestCert: true,                      // Demand client certificate
  rejectUnauthorized: true               // Reject if cert invalid or untrusted
};

https.createServer(options, (req, res) => {
  const clientCert = (req.socket as any).getPeerCertificate();
  res.end(\`Authenticated Service: \${clientCert.subject.CN}\`);
});`,
    takeaways: [
      'Cryptographic Identity: Every microservice in the service mesh (Istio, Linkerd) has a cryptographic identity tied to its private key.',
      'Zero Network Trust: Even if an attacker breaches the internal VPC network, they cannot spoof RPC calls without a valid X.509 certificate.'
    ],
    commonPitfall: {
      mistake: 'Relying solely on internal VPC private IP addresses for microservice security without cryptographic transport authentication.',
      fix: 'Enforce mTLS with automated certificate rotation across all internal RPC channels.'
    },
    nextTopicId: 'oauth-scopes-fine-grained-permissions'
  },
  {
    id: 'oauth-scopes-fine-grained-permissions',
    title: 'OAuth 2.0 Scopes, Claims & Principle of Least Privilege',
    category: 'authz-rbac',
    difficulty: 'Intermediate',
    summary: 'OAuth 2.0 scopes (e.g. read:profile, write:orders) limit the permissions granted to third-party applications. Resource servers inspect token scope claims before executing protected API operations.',
    mentalModel: 'The Valet Parking Key: When you give your car to a valet, you hand them a valet key (Scope: drive_only) that starts the engine but cannot open the locked glovebox or trunk.',
    codeSnippet: `// Express Scope Verification Middleware:
function requireScope(requiredScope: string) {
  return (req: any, res: any, next: any) => {
    const userScopes: string[] = req.auth?.scope?.split(' ') || [];
    if (!userScopes.includes(requiredScope)) {
      return res.status(403).json({ error: 'Insufficient scope', required: requiredScope });
    }
    next();
  };
}

app.post('/api/orders', requireScope('write:orders'), createOrderHandler);`,
    takeaways: [
      'Least Privilege: Third-party apps request only the minimal permissions required for their specific function.',
      'User Consent Gating: The authorization server presents the exact requested scope list to the user during login approval.'
    ],
    commonPitfall: {
      mistake: 'Requesting broad wildcard scopes (scope: admin:all) for simple client widgets, exposing users to severe over-permissioning risks.',
      fix: 'Split permissions into fine-grained read and write scopes (read:reports, write:reports).'
    },
    nextTopicId: 'rate-limiting-brute-force-protection'
  },
  {
    id: 'rate-limiting-brute-force-protection',
    title: 'Brute-Force & Credential Stuffing Defenses: Account Lockout & CAPTCHA',
    category: 'resilience-security',
    difficulty: 'Intermediate',
    summary: 'Credential stuffing uses billions of leaked username/password combinations to breach accounts. Defenses combine Exponential IP Rate Limiting, Account Lockout with email unlock tokens, and Adaptive CAPTCHAs.',
    mentalModel: 'The Bank ATM Pin Lock: If you enter the wrong ATM pin 3 times, the machine freezes your card and sends an SMS alert to your phone to stop automated key guessing.',
    codeSnippet: `// Redis Sliding Window Failed Login Limiter:
async function recordFailedLogin(email: string, ip: string): Promise<boolean> {
  const emailKey = \`failed:email:\${email}\`;
  const ipKey = \`failed:ip:\${ip}\`;
  
  const attempts = await redis.incr(emailKey);
  if (attempts === 1) await redis.expire(emailKey, 900); // 15 min window
  
  if (attempts >= 5) {
    // Lock account & require password reset:
    await lockAccountAndSendEmail(email);
    return true; // Account Locked!
  }
  return false;
}`,
    takeaways: [
      'Dual-Axis Rate Limiting: Limit both by originating IP (stops single-attacker floods) and by target account email (stops distributed botnets).',
      'HaveIBeenPwned API: Check new passwords against known breach databases during user registration.'
    ],
    commonPitfall: {
      mistake: 'Locking accounts permanently based solely on IP address, allowing attackers to DoS entire corporate VPN offices.',
      fix: 'Use adaptive CAPTCHA challenges and email verification links rather than global IP lockouts.'
    },
    nextTopicId: 'security-headers-hsts-csp-permissions'
  },
  {
    id: 'security-headers-hsts-csp-permissions',
    title: 'HTTP Security Headers: HSTS, X-Content-Type-Options & Permissions-Policy',
    category: 'sessions-cookies',
    difficulty: 'Beginner',
    summary: 'Security headers instruct browsers to enforce strict transport encryption, prevent MIME-sniffing drive-by downloads, and disable unused device hardware APIs (Camera, Microphone, Geolocation).',
    mentalModel: 'The Building Safety Regulations: Security headers are the fire safety codes and exit signs posted in the building lobby; the browser follows these rules automatically to protect visitors from rogue construction.',
    codeSnippet: `// Helmet.js Security Headers Configuration:
import helmet from 'helmet';

app.use(helmet({
  strictTransportSecurity: {
    maxAge: 31536000, // 1 Year HSTS
    includeSubDomains: true,
    preload: true
  },
  noSniff: true, // X-Content-Type-Options: nosniff
  xssFilter: true,
  frameguard: { action: 'deny' } // X-Frame-Options: DENY (Stops clickjacking!)
}));`,
    takeaways: [
      'HSTS (Strict-Transport-Security): Forces browsers to connect exclusively over HTTPS, preventing SSL-stripping Man-in-the-Middle attacks.',
      'X-Frame-Options: DENY: Prevents malicious sites from embedding your application inside invisible iframes (Clickjacking defense).'
    ],
    commonPitfall: {
      mistake: 'Deploying web applications over HTTPS without HSTS headers, allowing initial unencrypted HTTP redirect requests to be intercepted.',
      fix: 'Configure Strict-Transport-Security: max-age=31536000; includeSubDomains; preload.'
    }
  }
];
