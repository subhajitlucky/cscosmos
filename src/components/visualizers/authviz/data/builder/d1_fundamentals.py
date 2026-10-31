topics = [
  {
    "id": "authn-vs-authz-foundations",
    "title": "Authentication vs Authorization & Identity Management Foundations",
    "category": "authz-rbac",
    "difficulty": "Beginner",
    "summary": "Authentication verifies identity ('Who are you?'), whereas Authorization evaluates permissions ('What are you allowed to do?'). Conflating these two concepts causes severe architectural vulnerabilities, such as mistaking an authenticated session for an authorized administrative action.",
    "whyExists": "In any multi-user application, identifying an entity and granting access to resources are distinct security boundaries. An application must first establish trust in an identity (Authentication - 401 Unauthorized if invalid) before it can evaluate access policies (Authorization - 403 Forbidden if not permitted).",
    "mentalModel": "The Airport Passport Control vs Boarding Gate: Handing your passport to the border officer proves your citizenship and identity (Authentication). Once stamped, you cannot simply walk onto Flight 402; the gate agent must check whether your ticket grants you a seat on that specific plane (Authorization).",
    "architectureDiagram": """[ Client / User ]
       │
       ▼ (1) Presents Credentials (Password, TOTP, WebAuthn)
[ Authentication Engine (AuthN) ] ── (401 Unauthorized if failed)
       │ (Verified Identity: user_id = 42)
       ▼ (2) Evaluates Access Policy (Role, Tenant, Resource)
[ Authorization Engine (AuthZ) ] ── (403 Forbidden if denied)
       │ (Access Granted)
       ▼ (3) Execute Business Operation
[ Resource Database / API ]""",
    "cosmosAppStory": "CosmosApp launches its platform. When Alice submits her username and password, CosmosApp performs Authentication (AuthN). Once Alice is verified, CosmosApp checks whether Alice is authorized to access the 'Project Apollo' billing records (AuthZ). If Alice is not on the finance team, CosmosApp responds with 403 Forbidden.",
    "stepByStep": [
      "Step 1: Client submits authentication credentials (e.g., credentials or cryptographic assertion) to the identity endpoint.",
      "Step 2: Identity provider verifies credentials against stored cryptographic hashes; if invalid, immediately returns HTTP 401 Unauthorized.",
      "Step 3: Identity context is established and attached to the request (e.g. user_id, organization_id, assigned_roles).",
      "Step 4: Request reaches the Policy Enforcement Point (PEP) guarding the requested API route.",
      "Step 5: Authorization engine checks user permissions against resource constraints; if disallowed, returns HTTP 403 Forbidden.",
      "Step 6: If authorized, the resource controller processes the request and returns HTTP 200 OK."
    ],
    "misconceptions": [
      "HTTP 401 means 'Forbidden' (In HTTP specs, 401 means 'Unauthenticated / Credentials Required', while 403 means 'Authenticated but Forbidden').",
      "A valid user session or JWT automatically means the user can perform any operation."
    ],
    "codeSnippet": """// CosmosApp Middleware: Clear separation of AuthN and AuthZ
export async function authMiddleware(req: Request) {
  // 1. AUTHENTICATION: Prove WHO the caller is
  const session = await getSessionFromCookie(req);
  if (!session) {
    return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401 });
  }

  // 2. AUTHORIZATION: Prove WHAT the caller is allowed to do
  const hasPermission = await checkPolicy({
    userId: session.userId,
    action: "document:delete",
    resourceId: req.params.docId
  });

  if (!hasPermission) {
    return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
  }

  return next();
}""",
    "takeaways": [
      "Authentication establishes identity (401 Unauthorized); Authorization determines permissions (403 Forbidden).",
      "Never allow the authentication layer to grant implicit access without a distinct authorization policy check.",
      "Always log authentication failures as potential credential attacks and authorization failures as potential privilege escalation or BOLA attempts."
    ],
    "commonPitfall": {
      "mistake": "Returning 401 Unauthorized when an authenticated user tries to access another tenant's record.",
      "fix": "Return 403 Forbidden (or 404 Not Found to prevent enumeration) because the caller is fully authenticated (identity is known), but their authorization does not permit accessing that specific tenant resource."
    },
    "knowledgeCheck": {
      "question": "Which HTTP status code should be returned when a valid, authenticated standard user attempts to delete an organization-wide billing profile without administrative privileges?",
      "answer": "HTTP 403 Forbidden (The caller is recognized and authenticated, but lacks the necessary authorization permissions for this action)."
    },
    "nextTopicId": "passwords-salting-argon2id"
  },
  {
    "id": "passwords-salting-argon2id",
    "title": "Password Authentication: Cryptographic Salting, Peppering & Memory-Hard Hashing",
    "category": "cryptography-passwords",
    "difficulty": "Intermediate",
    "summary": "Standard cryptographic hashes (SHA-256, MD5) execute in nanoseconds, rendering them vulnerable to GPU cracking clusters. Secure password storage requires memory-hard algorithms (Argon2id, bcrypt) with high-entropy cryptographic salts and optional server peppers.",
    "whyExists": "Databases are frequently breached. If passwords were stored in plaintext or fast hashes, attackers could crack billions of passwords per second offline using GPUs. Password hashing functions deliberately introduce computational time and physical RAM requirements to defeat offline brute-force attacks.",
    "mentalModel": "The Safe with a Cement Lock: Fast hashing (SHA-256) is like a padlock that can be picked in 1 millisecond; an attacker with 1,000 picks opens every locker instantly. Argon2id is like pouring 64 megabytes of quick-drying cement around each lock; cracking each individual lock requires 500 milliseconds and massive physical space, rendering parallel cracking unfeasible.",
    "architectureDiagram": """[ Plaintext Password ] ──┐
                         ├──► [ Argon2id Function ] ──► [ $argon2id$v=19$m=65536,t=3,p=4$salt$hash ]
[ 16-byte Crypto Salt ] ─┤      (Requires 64MB RAM
[ Server Pepper (Key) ] ─┘       + 3 CPU iterations)
                                        │
                                        ▼ Stored in Database
                                  [ PostgreSQL User Row ]""",
    "cosmosAppStory": "CosmosApp stores user passwords upon signup. Rather than using legacy MD5 or fast SHA-256, CosmosApp configures Argon2id with 64 MB of RAM cost (m=65536) and 3 iterations (t=3). Each user receives a unique 16-byte random salt generated by crypto.getRandomValues(). If the database is ever leaked, an attacker cannot compute rainbow tables or brute-force hashes on GPUs.",
    "stepByStep": [
      "Step 1: User submits their chosen password over TLS.",
      "Step 2: Server generates a unique 16-byte cryptographically secure random salt.",
      "Step 3: Server combines the password, salt, and optional secret server pepper.",
      "Step 4: Argon2id allocates the configured memory buffer (e.g. 64 MB) and executes memory-hard iterations.",
      "Step 5: The resulting hash is formatted with its algorithm version and parameters and stored in the database.",
      "Step 6: On login, the server extracts the stored salt and parameters, re-hashes the submitted password, and performs a constant-time comparison."
    ],
    "misconceptions": [
      "Hashing is encryption (Encryption is reversible with a key; hashing is a one-way mathematical function).",
      "Adding a static salt across all users is safe (A static salt allows attackers to build a single rainbow table for all users)."
    ],
    "codeSnippet": """import { hash, verify } from '@node-rs/argon2';
import crypto from 'node:crypto';

// Recommended OWASP Argon2id Parameters:
const ARGON2_CONFIG = {
  memoryCost: 65536, // 64 MB RAM
  timeCost: 3,       // 3 iterations
  parallelism: 4,    // 4 CPU threads
  outputLen: 32,
};

// 1. Hash password upon registration:
export async function hashPassword(plaintext: string): Promise<string> {
  return await hash(plaintext, ARGON2_CONFIG);
}

// 2. Verify password upon login with constant-time check:
export async function verifyPassword(submitted: string, storedHash: string): Promise<boolean> {
  return await verify(storedHash, submitted);
}""",
    "takeaways": [
      "Always use Argon2id (or bcrypt with cost >= 12) for password storage; never use SHA-256, SHA-512, or MD5.",
      "Every password must have an independent, cryptographically random salt to defeat rainbow tables.",
      "Always verify hashes using constant-time comparison to prevent timing side-channel attacks."
    ],
    "commonPitfall": {
      "mistake": "Using fast SHA-256 with a salt for passwords. Modern GPUs test over 10 billion salted SHA-256 hashes per second.",
      "fix": "Use Argon2id with OWASP recommended parameters (64 MB memory, 3 iterations) so each hash requires non-trivial RAM and CPU."
    },
    "knowledgeCheck": {
      "question": "Why does Argon2id require substantial RAM (e.g. 64 MB per hash) rather than just CPU cycles?",
      "answer": "GPUs and ASIC cracking rigs possess thousands of compute cores but very little memory per core. Forcing each hash to consume 64 MB of RAM prevents mass parallelization on GPUs."
    },
    "nextTopicId": "registration-email-verification"
  },
  {
    "id": "registration-email-verification",
    "title": "User Registration, Email Verification & Account Lifecycle Workflows",
    "category": "cryptography-passwords",
    "difficulty": "Beginner",
    "summary": "A secure registration workflow validates email format, enforces password entropy rules, prevents user enumeration, and issues single-use cryptographically random verification tokens that expire quickly.",
    "whyExists": "Without email verification, attackers can register fake accounts using victims' emails, polluting databases, triggering account takeover vulnerabilities, or exploiting automated signup abuse.",
    "mentalModel": "The Certified Mail Receipt: When opening a bank account online, the bank doesn't activate wire transfers until you enter the secret activation code mailed to your physical address, proving you genuinely control that mailbox.",
    "architectureDiagram": """[ Client ] ──(POST /register)──► [ CosmosApp API ]
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                 [ Generate 32-byte Token ]   [ Save User (status: 'pending') ]
                 [ SHA-256 Hash Token     ]
                 [ Store Hash in DB (24h) ]
                         │
                         ▼ (Send Email Link)
                 [ User Mailbox: /verify?token=rawToken ]
                         │
                         ▼ (GET /verify?token=rawToken)
                 [ CosmosApp: Verify SHA256(rawToken) == db.hash ]
                         │
                         ▼ (Activate User: status = 'active')""",
    "cosmosAppStory": "Alice registers for CosmosApp with alice@cosmos.io. CosmosApp generates a 32-byte crypto random string, hashes it with SHA-256 before storing it in PostgreSQL with an expiration timestamp of 24 hours, and emails the plaintext link to Alice. Storing the hash in the database ensures that a leaked DB backup does not allow attackers to verify pending accounts.",
    "stepByStep": [
      "Step 1: User submits email, display name, and password over HTTPS.",
      "Step 2: Server checks if the email already exists; returns a generic success response to prevent account enumeration.",
      "Step 3: Server hashes the password with Argon2id and generates a 32-byte random verification token.",
      "Step 4: Server hashes the verification token with SHA-256 and saves it with a 24-hour expiration.",
      "Step 5: An email is dispatched with a link containing the raw verification token.",
      "Step 6: User clicks the link; server hashes the submitted token and matches it against the database to activate the account."
    ],
    "misconceptions": [
      "Storing verification tokens in plaintext in the database is safe (If the DB leaks, attackers can verify all accounts and take over unverified addresses).",
      "Displaying 'Email already registered' is good UX (It enables attackers to enumerate whether high-profile targets hold accounts on the platform)."
    ],
    "codeSnippet": """// CosmosApp Email Verification Token Generation:
import crypto from 'node:crypto';

export function createVerificationToken() {
  // 1. High-entropy random token sent to the user:
  const rawToken = crypto.randomBytes(32).toString('hex');

  // 2. Stored hash saved in the database:
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return { rawToken, tokenHash, expiresAt };
}""",
    "takeaways": [
      "Always store the SHA-256 hash of verification tokens in the database, never the plaintext token.",
      "Set strict expiration windows (15 minutes to 24 hours) and ensure tokens are strictly single-use.",
      "Adopt anti-enumeration responses on registration endpoints to prevent user harvesting."
    ],
    "commonPitfall": {
      "mistake": "Reusing the same verification token across multiple clicks or failing to invalidate it upon first use.",
      "fix": "Immediately delete or set used_at = NOW() upon first successful activation."
    },
    "knowledgeCheck": {
      "question": "Why should email verification tokens be hashed with SHA-256 in the database rather than stored as plaintext?",
      "answer": "If the database is leaked via SQL injection or backup exposure, an attacker cannot read the plaintext tokens from the database to activate accounts or steal unverified addresses."
    },
    "nextTopicId": "account-recovery-password-reset"
  },
  {
    "id": "account-recovery-password-reset",
    "title": "Secure Account Recovery, Password Reset Tokens & Defense Against Takeovers",
    "category": "cryptography-passwords",
    "difficulty": "Intermediate",
    "summary": "Password reset is the most targeted account takeover vector. A secure reset pipeline uses short-lived (15 min) single-use hashed tokens, invalidates all existing active sessions upon password change, and notifies the original email address.",
    "whyExists": "Users inevitably forget passwords. Without secure recovery, users are permanently locked out. However, flawed reset mechanisms (predictable tokens, lack of expiration, or failure to revoke old sessions) allow attackers to hijack accounts permanently.",
    "mentalModel": "The Burner Vault Key: When you lose your safe key, the bank issues a temporary one-time key that melts and destroys itself after 15 minutes. Once you open the safe and change the combination, all previously existing duplicate keys are rendered physically inert.",
    "architectureDiagram": """[ Attacker / User ] ──(POST /forgot-password)──► [ CosmosApp API ]
                                                  │
                                  ┌───────────────┴───────────────┐
                                  ▼                               ▼
                      [ Email Found? ]                     [ Anti-Enumeration: ]
                        │                                  "If your email exists,
                        ├─► Yes: Generate Token (15m TTL)  a link was sent."
                        │        Hash with SHA-256
                        │        Send Email
                        └─► No:  Do nothing (same timing)
                                  │
                                  ▼ (User clicks /reset-password?token=...)
                      [ Verify Token Hash & Check TTL ]
                                  │
                                  ▼ (Valid Token)
                      [ Update Password with Argon2id ]
                      [ DESTROY all active sessions in Redis ]
                      [ Send Security Notification Email ]""",
    "cosmosAppStory": "Bob forgets his CosmosApp password. He requests a reset. CosmosApp returns 'If your account exists, a link was sent' regardless of whether the email is registered. Bob receives an email with an expiring token (15 mins). Upon submitting his new password, CosmosApp updates Bob's Argon2id hash and immediately revokes all of Bob's active sessions in Redis, kicking out any potential intruder.",
    "stepByStep": [
      "Step 1: User requests password reset for an email address.",
      "Step 2: Server responds with uniform HTTP 200 response to prevent email harvesting.",
      "Step 3: If user exists, server generates a cryptographically secure 32-byte reset token, hashes it with SHA-256, and stores the hash with a 15-minute expiration.",
      "Step 4: User receives email and clicks the reset link.",
      "Step 5: Server validates token hash, ensures current time < expires_at, and ensures token has not been used.",
      "Step 6: Server updates the password hash, marks token as consumed, and revokes all active session IDs in Redis."
    ],
    "misconceptions": [
      "Allowing password reset links to remain valid for 24 hours is standard (Reset tokens grant direct account takeover and should expire in 15 minutes).",
      "Keeping existing sessions logged in after a password reset is fine (If an attacker had stolen a session cookie, failing to revoke sessions lets them maintain access)."
    ],
    "codeSnippet": """// CosmosApp Password Reset Session Revocation:
export async function executePasswordReset(rawToken: string, newPasswordPlaintext: string) {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const record = await db.query('SELECT * FROM reset_tokens WHERE token_hash = $1', [tokenHash]);

  if (!record || record.expires_at < new Date() || record.used) {
    throw new Error('Invalid or expired reset token');
  }

  // 1. Hash new password:
  const newHash = await hashPassword(newPasswordPlaintext);

  // 2. Mark token used:
  await db.query('UPDATE reset_tokens SET used = true WHERE id = $1', [record.id]);
  await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, record.user_id]);

  // 3. CRITICAL: Revoke all active Redis sessions for this user!
  await redis.del(`user_sessions:${record.user_id}`);
  await sendSecurityEmail(record.user_id, 'Your password was recently updated.');
}""",
    "takeaways": [
      "Reset tokens must have a strict 15-minute expiration and be strictly single-use.",
      "Always invalidate every active user session and refresh token family when a password is reset.",
      "Never reveal whether an email exists in the database during password reset requests."
    ],
    "commonPitfall": {
      "mistake": "Leaving active sessions valid after a password reset, allowing an attacker with a hijacked session to remain authenticated.",
      "fix": "Destroy all active session IDs and refresh tokens across Redis and database tables immediately upon password change."
    },
    "knowledgeCheck": {
      "question": "What critical security operation must be performed alongside updating the password hash during a password reset?",
      "answer": "Invalidating all existing active sessions, cookies, and refresh token families to immediately evict any unauthorized actors holding active sessions."
    },
    "nextTopicId": "session-lifecycle-security"
  }
]
