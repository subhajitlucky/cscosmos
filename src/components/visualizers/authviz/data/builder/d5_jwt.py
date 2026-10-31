topics = [
  # 17. JWT Architecture & Claims
  {
    "id": "jwt-architecture-claims",
    "title": "JSON Web Tokens (JWT): Header, Payload Claims & The Standard Token Validation Checklist",
    "category": "jwt-tokens",
    "difficulty": "Intermediate",
    "summary": "A JSON Web Token (RFC 7519) is a compact, URL-safe means of representing claims to be transferred between two parties. Encoded as three Base64URL-encoded segments separated by dots (Header.Payload.Signature), safe consumption requires executing an exhaustive 6-point cryptographic and temporal validation checklist.",
    "whyExists": "Microservices need a stateless way to trust caller identity without querying a central database for every single HTTP request. A digitally signed JWT contains the user ID, tenant ID, and permissions directly in its payload, verifiable purely through mathematics.",
    "mentalModel": "The Airline Boarding Pass: Printed with your passenger name, flight number, seat, and gate, accompanied by a high-density 2D barcode signed by the airline. Any gate agent or baggage handler can verify the pass offline using the barcode scanner without querying the central reservations database.",
    "architectureDiagram": """[ Base64URL(Header) ] . [ Base64URL(Payload) ] . [ Base64URL(Signature) ]
         │                        │                         │
         ▼                        ▼                         ▼
  { "alg": "RS256",        { "sub": "usr_42",        Digital signature computed over:
    "typ": "JWT",            "iss": "cosmos.app",    SHA256(Header + "." + Payload)
    "kid": "key_2026" }      "aud": "cosmos-api",    using IdP's Private Key
                             "exp": 1735689600 }
                                  │
                                  ▼
[ 6-Point Token Validation Checklist: ]
  1. Verify Alg header against whitelist (Reject 'none'!)
  2. Verify Signature with IdP Public Key
  3. Verify exp (Expiration Time > now)
  4. Verify nbf (Not Before <= now)
  5. Verify iss (Issuer matches trusted IdP URL)
  6. Verify aud (Audience matches our API identifier)""",
    "cosmosAppStory": "CosmosApp microservices process incoming requests bearing Bearer JWTs. Every microservice runs the 6-point validation pipeline before routing requests. If a token has expired by even 1 second, or was issued for a different audience (e.g. mobile app rather than internal API), it is immediately rejected with HTTP 401.",
    "stepByStep": [
      "Step 1: Extract the Bearer token from the incoming HTTP Authorization header.",
      "Step 2: Split token string into exactly three segments delimited by periods ('.').",
      "Step 3: Decode header; verify that 'alg' is in the strictly permitted whitelist (e.g., ['RS256', 'ES256']).",
      "Step 4: Verify the cryptographic signature over (Header + '.' + Payload) using the matching public key.",
      "Step 5: Inspect temporal claims: ensure current time < exp (with optional 30s clock skew tolerance) and >= nbf.",
      "Step 6: Inspect structural claims: ensure iss matches the expected Identity Provider and aud matches this API service.",
    ],
    "misconceptions": [
      "JWTs are encrypted by default (Standard JWTs are JWS - signed, not encrypted; anyone who reads the token can decode the Base64 payload in plaintext).",
      "Valid signature means the token is trusted (Signature only proves integrity; you must also validate exp, iss, and aud)."
    ],
    "codeSnippet": """import { jwtVerify } from 'jose';

// CosmosApp Comprehensive 6-Point JWT Validator:
export async function validateCosmosJwt(rawToken: string, publicKey: CryptoKey) {
  try {
    const { payload, protectedHeader } = await jwtVerify(rawToken, publicKey, {
      issuer: 'https://auth.cosmos.app',
      audience: 'https://api.cosmos.app',
      algorithms: ['RS256', 'ES256'], // Explicit algorithm whitelist!
      clockTolerance: 30,             // 30 seconds max clock skew
    });

    return { valid: true, user: payload };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}""",
    "takeaways": [
      "JWT payloads are encoded, not encrypted; never store passwords, unhashed secrets, or PII in JWT claims.",
      "Always validate all standard claims: alg, signature, exp, nbf, iss, and aud.",
      "Keep access token expiration windows short (10–15 minutes) to mitigate token theft risk."
    ],
    "commonPitfall": {
      "mistake": "Decoding a JWT payload using jsonwebtoken.decode() or atob() without verifying the signature and claims.",
      "fix": "Always use a cryptographic verification library (jwtVerify) that checks the signature before trusting claims."
    },
    "knowledgeCheck": {
      "question": "Can an attacker read sensitive data (such as an email address or role) stored inside a standard signed JWT (JWS)?",
      "answer": "Yes. Standard JWTs are Base64URL-encoded, not encrypted. Anyone who intercepts the token can decode and read the JSON payload."
    },
    "nextTopicId": "jwt-digital-signatures-rs256"
  },
  # 18. Digital Signatures: RS256 vs HS256 & Algorithm Confusion
  {
    "id": "jwt-digital-signatures-rs256",
    "title": "Asymmetric Digital Signatures (RS256/ES256) vs Shared Secrets (HS256) & Algorithm Confusion",
    "category": "jwt-tokens",
    "difficulty": "Advanced",
    "summary": "HS256 uses a symmetric shared secret where every party that verifies a token can also forge one. RS256/ES256 use asymmetric cryptography where only the authorization server holds the private key to sign, while resource servers use the public key to verify. Defenses must prevent Algorithm Confusion (substituting public keys as HMAC secrets) and 'alg: none' attacks.",
    "whyExists": "In a microservice ecosystem of 30 services, distributing a shared symmetric secret (HS256) means any compromised service can forge tokens for the entire company. Asymmetric keys decouple signing from verification. However, naive validation code can be tricked into verifying RS256 tokens as HS256 using the public key as the secret.",
    "mentalModel": "The Royal Signet Ring vs The Shared Passphrase: With HS256, all 100 border guards know the royal secret passphrase; any rogue guard can whisper it to forge entrance passes. With RS256, only the King holds the golden signet ring (private key), while every guard carries an open plaster imprint (public key) to check seals.",
    "architectureDiagram": """[ Attacker Payload: alg: "HS256" ]
              │
              ▼ (Attacker signs token with IdP's PUBLIC RSA KEY as HMAC secret!)
[ Vulnerable Resource Server ]
       │
       ├── Reads header: alg = "HS256"
       ├── Naive code: secret = getPublicKey()
       ├── Verifies HMAC(secret, Header.Payload) ──► FORGERY ACCEPTED! (CRITICAL BREACH)
       │
[ Hardened CosmosApp Resource Server ]
       │
       ├── Enforces STRICT whitelist: algorithms = ['RS256']
       ├── Header says "HS256" ──► REJECT IMMEDIATELY (Algorithm Mismatch!)""",
    "cosmosAppStory": "CosmosApp migrates its microservices to RS256. To defend against the famous 'alg: none' and Algorithm Confusion attacks, CosmosApp hardcodes an algorithm whitelist on every API gateway. If an attacker submits a token signed with HS256 using CosmosApp's public certificate as an HMAC key, the gateway rejects the token before executing any verification math.",
    "stepByStep": [
      "Step 1: Auth server generates an RSA-2048 or ECDSA P-256 key pair.",
      "Step 2: Private key is stored strictly inside AWS KMS or HashiCorp Vault; public key is published on JWKS.",
      "Step 3: Auth server signs JWTs using the private key, setting header alg='RS256' and kid='key_1'.",
      "Step 4: Resource server receives token and checks that alg exactly matches the expected algorithm in its whitelist.",
      "Step 5: Resource server fetches the public key corresponding to kid and verifies the signature.",
      "Step 6: If alg does not match the whitelist or signature verification fails, returns HTTP 401.",
    ],
    "misconceptions": [
      "Trusting the 'alg' header in the token to decide which verification algorithm to use (The token's header is controlled by the untrusted caller; the server must dictate allowed algorithms).",
      "HS256 is obsolete for all use cases (HS256 is appropriate for single monolith architectures where only one server ever creates and verifies tokens)."
    ],
    "codeSnippet": """import jwt from 'jsonwebtoken';

// CosmosApp RS256 Token Verification (Immunized against Algorithm Confusion):
export function verifyRs256Token(token: string, rsaPublicKey: string) {
  return jwt.verify(token, rsaPublicKey, {
    // CRITICAL: Force RS256! Never allow dynamic alg selection from header!
    algorithms: ['RS256'],
    issuer: 'https://auth.cosmos.app',
    audience: 'https://api.cosmos.app',
  });
}""",
    "takeaways": [
      "Always use asymmetric algorithms (RS256, ES256) for multi-service or third-party token verification.",
      "Never allow the token's header 'alg' parameter to dictate the cryptographic algorithm used by the server.",
      "Explicitly reject tokens specifying 'alg: none' or unexpected symmetric algorithms."
    ],
    "commonPitfall": {
      "mistake": "Accepting whatever algorithm is specified in the JWT header without an explicit whitelist, enabling Algorithm Confusion attacks.",
      "fix": "Always pass an explicit algorithms: ['RS256'] option to the verification function."
    },
    "knowledgeCheck": {
      "question": "How does an Algorithm Confusion attack exploit an asymmetric JWT implementation?",
      "answer": "The attacker changes the header to HS256 (symmetric) and signs the token using the server's publicly available RSA public key as the HMAC secret, tricking a vulnerable server into accepting it."
    },
    "nextTopicId": "jwks-key-rotation-caching"
  },
  # 19. JWKS Dynamic Key Rotation & Caching
  {
    "id": "jwks-key-rotation-caching",
    "title": "Dynamic Key Management: JWKS Endpoints, Public Key Rotation (kid) & Cache-Stampede Protection",
    "category": "jwt-tokens",
    "difficulty": "Advanced",
    "summary": "A JSON Web Key Set (JWKS, RFC 7517) is an HTTP endpoint published by an Authorization Server exposing public keys in standardized JSON format. Key rotation allows servers to retire old keys and adopt new ones without application downtime by matching the Key ID (kid) in the token header, protected by caching and rate limiting against cache stampedes.",
    "whyExists": "Cryptographic keys must be rotated periodically (e.g. every 90 days) or immediately if suspected of compromise. If public keys were hardcoded in every microservice, rotating a key would require redeploying 50 applications simultaneously. JWKS enables automated, zero-downtime key discovery.",
    "mentalModel": "The Embassy Passport Bulletin: Rather than printing every border guard a new physical handbook every time an ambassador's signature changes, the embassy publishes the current valid signature seals on an official public bulletin board. Guards check the bulletin and keep a cached copy in their booth.",
    "architectureDiagram": """[ CosmosApp Auth Server ] ──(Publishes JWKS)──► https://auth.cosmos.app/.well-known/jwks.json
                                                  { "keys": [
                                                      { "kid": "key_2026_q1", "alg": "RS256", "n": "...", "e": "AQAB" },
                                                      { "kid": "key_2026_q2", "alg": "RS256", "n": "...", "e": "AQAB" }
                                                  ] }
                                                         │
                                                         ▼ (Cached for 24h in Redis / Local RAM)
                                              [ Microservice API Gateway ]
                                                         │
                                    ├── Incoming Token Header: { "kid": "key_2026_q2" }
                                    ├── Lookup in Local Cache ──► Found! Verify Signature.
                                    └── Unknown kid? ──► Rate-limited single background fetch (stampede defense)""",
    "cosmosAppStory": "CosmosApp conducts quarterly cryptographic key rotations. To prepare for Q2, it generates a new RSA key pair ('key_2026_q2') and adds its public key to its JWKS endpoint alongside 'key_2026_q1'. Microservices cache the JWKS for 24 hours. When CosmosApp begins signing new tokens with Q2, microservices seamlessly match the kid without dropped requests or redeployments.",
    "stepByStep": [
      "Step 1: Auth Server exposes public keys as a JSON structure at /.well-known/jwks.json.",
      "Step 2: Microservices fetch the JWKS on startup and store keys in a local in-memory cache.",
      "Step 3: Incoming request arrives; microservice inspects JWT header to extract the Key ID ('kid').",
      "Step 4: If key with matching 'kid' exists in cache, it verifies the signature immediately.",
      "Step 5: If 'kid' is unknown (indicating recent key rotation), microservice triggers a rate-limited cache refresh.",
      "Step 6: If 'kid' is still missing after refresh, token is rejected as untrusted."
    ],
    "misconceptions": [
      "Microservices should fetch JWKS on every single incoming API request (Fetching JWKS per request destroys performance and allows DoS attacks; JWKS must be aggressively cached).",
      "Any unknown kid should trigger an immediate remote JWKS fetch (Attackers can flood servers with random kid values to trigger a cache stampede / denial of service)."
    ],
    "codeSnippet": """import { createRemoteJWKSet, jwtVerify } from 'jose';

// CosmosApp Hardened JWKS Verification with Caching & Rate Limiting:
const jwksUri = new URL('https://auth.cosmos.app/.well-known/jwks.json');

const JWKS = createRemoteJWKSet(jwksUri, {
  cacheMaxAge: 24 * 60 * 60 * 1000, // Cache public keys for 24 hours
  cooldownDuration: 30 * 1000,      // Max 1 remote fetch per 30s for unknown kid (stampede defense!)
});

export async function verifyWithJwks(token: string) {
  return await jwtVerify(token, JWKS, {
    issuer: 'https://auth.cosmos.app',
    audience: 'https://api.cosmos.app',
  });
}""",
    "takeaways": [
      "JWKS decouples key rotation on the identity provider from microservice deployments.",
      "Always match keys using the Key ID ('kid') header parameter.",
      "Enforce cooldown limits on remote JWKS fetches to prevent cache-stampede denial-of-service attacks."
    ],
    "commonPitfall": {
      "mistake": "Fetching the JWKS URL synchronously on every incoming request when an unknown 'kid' is encountered.",
      "fix": "Use a rate-limited cooldown window (e.g. 1 fetch per 30 seconds) to defend against cache-stampede attacks."
    },
    "knowledgeCheck": {
      "question": "What is the purpose of the 'kid' (Key ID) header parameter in a JSON Web Token?",
      "answer": "It informs the verifying service which specific public key in a JWKS set was used to sign the token, enabling zero-downtime key rotation."
    },
    "nextTopicId": "jwt-revocation-blacklisting"
  },
  # 20. Stateless Token Revocation & Blacklisting
  {
    "id": "jwt-revocation-blacklisting",
    "title": "Stateless Token Revocation: Short-Lived Access Tokens, Redis Blacklists & Bloom Filters",
    "category": "jwt-tokens",
    "difficulty": "Advanced",
    "summary": "Because JWTs are self-contained and validated statelessly, revoking an access token before its natural expiration requires hybrid revocation architectures: extremely short lifetimes (5–15 min), distributed Redis denylists indexed by JWT ID (jti), user-level token versioning, or probabilistic Bloom filters.",
    "whyExists": "If an employee is fired, an account is breached, or a smartphone is lost, an active 24-hour JWT allows unauthorized access until it expires. True statelessness and instant revocation are fundamentally in tension; applications require a performant revocation tier.",
    "mentalModel": "The Stolen Wristband Bulletin: A music festival issues printed wristbands valid for 2 hours. If a thief steals a wristband, the security guards keep a small whiteboard of stolen wristband numbers (jti blacklist) at the gate for the remaining 2 hours until the stolen band naturally expires.",
    "architectureDiagram": """[ Client ] ──(Authorization: Bearer <token>)──► [ API Gateway ]
                                                      │
                                                      ├── Step 1: Verify RS256 Signature & Claims (Stateless)
                                                      │
                                                      ├── Step 2: Check Redis Blacklist:
                                                      │           EXISTS blacklist:{jti}
                                                      │           ├── Found ──► 401 Unauthorized (Revoked Token!)
                                                      │           └── Not Found ──►
                                                      │
                                                      ├── Step 3: Check User Token Version:
                                                      │           token.ver >= user.min_token_ver
                                                      │           ├── False ──► 401 Unauthorized (All Tokens Revoked!)
                                                      │           └── True ──► 200 OK (Allowed)""",
    "cosmosAppStory": "CosmosApp gives users a 'Log out of all devices' button. When clicked, CosmosApp increments Alice's token_version counter in Redis and PostgreSQL from 1 to 2. When microservices validate Alice's access token, they verify that the token's ver claim matches or exceeds the user's active version, immediately invalidating all older tokens across all devices.",
    "stepByStep": [
      "Step 1: Auth server embeds a unique UUID ('jti') and a 'ver' (token version) claim in each issued JWT.",
      "Step 2: Access token lifetimes are configured to a strict maximum of 15 minutes.",
      "Step 3: To revoke an individual token, its 'jti' is inserted into a Redis set with a TTL equal to the token's remaining lifetime.",
      "Step 4: To revoke all sessions for a user, the user's minimum valid token version is incremented in Redis.",
      "Step 5: API gateways verify the cryptographic signature and then check Redis for 'jti' or token version validity in sub-milliseconds.",
      "Step 6: When the token's original 'exp' timestamp passes, Redis automatically purges the blacklist entry via key expiration."
    ],
    "misconceptions": [
      "You don't need revocation if you use JWTs (Real-world security compliance requires the ability to instantly terminate compromised user access).",
      "Blacklists in Redis grow infinitely large (Blacklist entries only need a TTL matching the token's remaining lifetime, after which they expire automatically)."
    ],
    "codeSnippet": """import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// CosmosApp Hybrid Token Revocation Validator:
export async function isTokenRevoked(jti: string, userId: string, tokenVer: number): Promise<boolean> {
  // 1. Check if specific token JTI is blacklisted:
  const isBlacklisted = await redis.exists(`revoked_jti:${jti}`);
  if (isBlacklisted) return true;

  // 2. Check if user performed a global session revocation:
  const minVer = await redis.get(`user_min_ver:${userId}`);
  if (minVer && tokenVer < parseInt(minVer, 10)) {
    return true; // All tokens before this version are revoked
  }

  return false;
}

export async function revokeIndividualToken(jti: string, remainingSeconds: number) {
  // Key auto-deletes when token reaches its natural expiration:
  await redis.set(`revoked_jti:${jti}`, '1', 'EX', remainingSeconds);
}""",
    "takeaways": [
      "Keep access token lifetimes short (10–15 minutes) to minimize the active revocation window.",
      "Use 'jti' blacklist entries in Redis configured with automatic TTL expiration.",
      "Use user-level 'token_version' or 'issued_at' timestamps for instant multi-device account logouts."
    ],
    "commonPitfall": {
      "mistake": "Issuing 7-day access tokens statelessly without any revocation mechanism.",
      "fix": "Issue 15-minute access tokens paired with rotating refresh tokens and a Redis-backed 'jti' denylist."
    },
    "knowledgeCheck": {
      "question": "Why is the memory footprint of a Redis JWT blacklist bounded and manageable, even for applications with millions of users?",
      "answer": "Because blacklist entries only need a Redis TTL equal to the token's remaining lifetime (e.g., 10 minutes), after which Redis automatically deletes them."
    },
    "nextTopicId": "rbac-role-based-access"
  }
]
