export interface AuthTopic {
  id: string;
  title: string;
  category: 'oauth-oidc' | 'jwt-tokens' | 'sessions-cookies' | 'authz-rbac' | 'cryptography-passwords';
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
    }
  }
];
