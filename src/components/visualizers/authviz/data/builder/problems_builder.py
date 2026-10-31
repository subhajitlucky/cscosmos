# 60 Curated Practice Problems for the 30-Lesson AuthCosmos Curriculum (2 per topic)

problems = [
  # Topic 1: authn-vs-authz-foundations
  {
    "id": 1,
    "topicId": "authn-vs-authz-foundations",
    "category": "Authorization & RBAC",
    "difficulty": "Beginner",
    "question": "What is the primary difference between Authentication (AuthN) and Authorization (AuthZ)?",
    "options": [
      "Authentication verifies who an entity is; Authorization evaluates what permissions that entity possesses.",
      "Authentication encrypts network traffic; Authorization handles user password hashing.",
      "Authentication assigns user roles; Authorization handles single sign-on (SSO).",
      "Authentication always returns HTTP 403; Authorization always returns HTTP 401."
    ],
    "correctIndex": 0,
    "explanation": "Authentication establishes and verifies identity ('Who are you?'). Authorization determines access rights and permissions ('What are you permitted to do?')."
  },
  {
    "id": 2,
    "topicId": "authn-vs-authz-foundations",
    "category": "Authorization & RBAC",
    "difficulty": "Beginner",
    "question": "Which HTTP status code should an API return when an authenticated employee attempts to delete a sensitive corporate record without having the necessary administrative permissions?",
    "options": [
      "HTTP 401 Unauthorized",
      "HTTP 403 Forbidden",
      "HTTP 400 Bad Request",
      "HTTP 405 Method Not Allowed"
    ],
    "correctIndex": 1,
    "explanation": "HTTP 403 Forbidden indicates the server understands who the caller is (authenticated), but refuses to authorize the specific action due to insufficient permissions."
  },

  # Topic 2: passwords-salting-argon2id
  {
    "id": 3,
    "topicId": "passwords-salting-argon2id",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "Why is the Argon2id hashing algorithm considered superior to standard fast hashing algorithms like SHA-256 for storing user passwords?",
    "options": [
      "Argon2id produces a shorter hash string that saves database storage.",
      "Argon2id is memory-hard, requiring substantial RAM per hash to defeat mass parallel GPU and ASIC cracking rigs.",
      "Argon2id is a symmetric encryption algorithm that can be reversed using a secret key.",
      "Argon2id eliminates the need for unique cryptographic salts."
    ],
    "correctIndex": 1,
    "explanation": "Argon2id introduces memory-hardness (m_cost), forcing each hash calculation to allocate substantial RAM (e.g. 64 MB), which prevents attackers from running millions of parallel guesses on GPUs or ASICs."
  },
  {
    "id": 4,
    "topicId": "passwords-salting-argon2id",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "What attack vector is neutralized by generating a unique, cryptographically random salt for every user password?",
    "options": [
      "Cross-Site Scripting (XSS)",
      "Precomputed Rainbow Table attacks and identical hash collision detection across users",
      "Timing side-channel attacks during password verification",
      "Man-in-the-Middle (MITM) attacks during TLS negotiation"
    ],
    "correctIndex": 1,
    "explanation": "A unique salt ensures that two users with identical passwords produce completely different hash outputs, rendering precomputed rainbow tables useless."
  },

  # Topic 3: registration-email-verification
  {
    "id": 5,
    "topicId": "registration-email-verification",
    "category": "Cryptography & Passwords",
    "difficulty": "Beginner",
    "question": "Why should an application store the SHA-256 hash of an email verification token in the database rather than the raw plaintext token?",
    "options": [
      "To compress the token length from 64 bytes to 32 bytes.",
      "If the database is leaked via SQL injection or backup exposure, attackers cannot use leaked tokens to activate or hijack accounts.",
      "Because email clients cannot parse SHA-256 strings.",
      "To allow the user to log in using the token instead of a password."
    ],
    "correctIndex": 1,
    "explanation": "Storing only the cryptographic hash of verification tokens protects against database leakage; an attacker reading database rows cannot activate pending accounts or verify fraudulent addresses."
  },
  {
    "id": 6,
    "topicId": "registration-email-verification",
    "category": "Cryptography & Passwords",
    "difficulty": "Beginner",
    "question": "How should a registration endpoint respond when a visitor attempts to register with an email address that is already registered, in order to prevent user enumeration?",
    "options": [
      "Return HTTP 409 Conflict with 'This email is already registered.'",
      "Return a generic success message ('If your email is eligible, a verification link was sent') with uniform response timing.",
      "Redirect immediately to the password reset page.",
      "Display the user's existing profile picture to confirm their account."
    ],
    "correctIndex": 1,
    "explanation": "Generic responses and uniform execution timing prevent automated botnets from harvesting and enumerating whether high-profile targets hold accounts on the platform."
  },

  # Topic 4: account-recovery-password-reset
  {
    "id": 7,
    "topicId": "account-recovery-password-reset",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "What critical session security operation must be executed on the server immediately when a user successfully resets their password?",
    "options": [
      "Extend the lifetime of all existing session cookies by 24 hours.",
      "Immediately invalidate all existing active sessions, cookies, and refresh token families across all devices.",
      "Send an SMS to the user with the new password in plaintext.",
      "Re-encrypt the user's uploaded files using the new password."
    ],
    "correctIndex": 1,
    "explanation": "Password resets frequently occur after account compromise; revoking all existing sessions and refresh tokens ensures that any unauthorized actor holding an active session is evicted immediately."
  },
  {
    "id": 8,
    "topicId": "account-recovery-password-reset",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "What is the recommended maximum validity lifespan for a password reset token?",
    "options": [
      "7 to 14 days",
      "24 to 48 hours",
      "15 to 30 minutes",
      "Indefinite until consumed"
    ],
    "correctIndex": 2,
    "explanation": "Because password reset tokens grant immediate, unauthenticated account takeover, NIST SP 800-63B recommends short expiration windows (15 to 30 minutes) and strict single-use invalidation."
  },

  # Topic 5: session-lifecycle-security
  {
    "id": 9,
    "topicId": "session-lifecycle-security",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "What attack is eliminated by regenerating the session identifier immediately upon successful user login or privilege elevation?",
    "options": [
      "Cross-Site Scripting (XSS)",
      "Session Fixation",
      "Distributed Denial of Service (DDoS)",
      "SQL Injection"
    ],
    "correctIndex": 1,
    "explanation": "Session Fixation occurs when an attacker tricks a victim into using a known pre-generated session ID. Regenerating the session ID upon authentication ensures the attacker's pre-set ID is invalidated."
  },
  {
    "id": 10,
    "topicId": "session-lifecycle-security",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "Why must an enterprise session system enforce an absolute maximum timeout in addition to a sliding idle timeout?",
    "options": [
      "To prevent Redis database memory exhaustion.",
      "Without an absolute timeout, an active session or an attacker holding a compromised connection can stay authenticated perpetually.",
      "Because HTTP/2 does not support cookies older than 60 minutes.",
      "To force browsers to clear local caching headers."
    ],
    "correctIndex": 1,
    "explanation": "Sliding idle timeouts only expire inactive sessions. An absolute timeout enforces a hard deadline (e.g. 8–12 hours) after which re-authentication is mandatory regardless of recent activity."
  },

  # Topic 6: cookies-vs-tokens-storage
  {
    "id": 11,
    "topicId": "cookies-vs-tokens-storage",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "Why is storing sensitive session JWTs in browser localStorage considered a major security risk?",
    "options": [
      "localStorage has a 4KB storage limit.",
      "Any Cross-Site Scripting (XSS) vulnerability allows malicious JavaScript to immediately read and exfiltrate the token via localStorage.getItem().",
      "localStorage tokens are automatically transmitted on cross-origin image requests.",
      "localStorage does not persist data across page refreshes."
    ],
    "correctIndex": 1,
    "explanation": "JavaScript has full programmatic access to localStorage. If an attacker injects a single script via XSS, they can steal all stored tokens and impersonate the user indefinitely."
  },
  {
    "id": 12,
    "topicId": "cookies-vs-tokens-storage",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "What browser security behavior does the 'HttpOnly' flag enforce on a cookie?",
    "options": [
      "It requires the cookie to be encrypted using RSA-2048.",
      "It makes the cookie completely inaccessible to client-side JavaScript APIs (like document.cookie), preventing XSS token theft.",
      "It forces the browser to send the cookie only on HTTP requests, never HTTPS.",
      "It automatically generates a CSRF synchronizer token for every form."
    ],
    "correctIndex": 1,
    "explanation": "The HttpOnly flag instructs the browser that the cookie must not be exposed to DOM scripts. Even if malicious JavaScript executes on the page, it cannot read the cookie value."
  },

  # Topic 7: csrf-protection-synchronizer
  {
    "id": 13,
    "topicId": "csrf-protection-synchronizer",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "How does Cross-Site Request Forgery (CSRF) exploit the default behavior of web browsers?",
    "options": [
      "By stealing the user's master password from browser memory.",
      "By causing the victim's browser to make an unauthorized request to a site where the user is authenticated, taking advantage of cookies being sent automatically.",
      "By decrypting HTTPS network packets on public Wi-Fi networks.",
      "By modifying server-side database records without sending HTTP requests."
    ],
    "correctIndex": 1,
    "explanation": "Browsers automatically attach ambient credentials (cookies) to cross-origin requests. A malicious website can submit a hidden form to bank.com and the browser will automatically include the user's session cookie."
  },
  {
    "id": 14,
    "topicId": "csrf-protection-synchronizer",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "Why does requiring a custom HTTP header such as 'X-CSRF-Token' protect APIs from cross-origin CSRF attacks?",
    "options": [
      "Custom headers encrypt the request payload using TLS.",
      "Browsers enforce the Same-Origin Policy for custom headers; cross-origin sites cannot set custom headers without a CORS preflight approval.",
      "Custom headers force the server to execute an Argon2id verification.",
      "Cookies cannot be attached to requests that include custom headers."
    ],
    "correctIndex": 1,
    "explanation": "Under the Same-Origin Policy, a third-party website cannot attach arbitrary custom headers to requests without triggering a CORS preflight OPTIONS check, which the server will deny."
  },

  # Topic 8: distributed-sessions-redis
  {
    "id": 15,
    "topicId": "distributed-sessions-redis",
    "category": "Sessions & Cookies",
    "difficulty": "Advanced",
    "question": "What is the primary architectural downside of using 'Sticky Sessions' (session affinity) on a load balancer instead of a distributed session store like Redis?",
    "options": [
      "Sticky sessions require all clients to support WebSockets.",
      "If a server node crashes or restarts, all user sessions hosted on that node are lost, and traffic cannot be evenly balanced across nodes.",
      "Sticky sessions do not support HTTPS.",
      "Load balancers cannot read cookies under any circumstances."
    ],
    "correctIndex": 1,
    "explanation": "Sticky sessions bind a user to a specific server instance. If that instance fails, is deployed, or auto-scales down, all connected users are abruptly logged out, and load balancing becomes uneven."
  },
  {
    "id": 16,
    "topicId": "distributed-sessions-redis",
    "category": "Sessions & Cookies",
    "difficulty": "Advanced",
    "question": "How does a distributed Redis cluster achieve instant, global session revocation when an administrator suspends a compromised account?",
    "options": [
      "By sending a push notification to all browsers to delete their cookies.",
      "By executing DEL sess:<id> in Redis, causing all application servers to fail session lookup on the very next HTTP request.",
      "By rewriting the server's TLS certificates in real time.",
      "By blocking the user's residential IP address at the edge router."
    ],
    "correctIndex": 1,
    "explanation": "Because all application servers query the central Redis cluster for session validity, deleting the session key in Redis instantly invalidates the session across every server in under a millisecond."
  },

  # Topic 9: mfa-totp-hotp-rfc6238
  {
    "id": 17,
    "topicId": "mfa-totp-hotp-rfc6238",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "How is a Time-Based One-Time Password (TOTP, RFC 6238) mathematically calculated by an authenticator application?",
    "options": [
      "By sending an encrypted SMS to the server's mobile carrier.",
      "By hashing the current 30-second Unix time step counter with the shared Base32 secret using HMAC-SHA1 and dynamically truncating the result.",
      "By querying the server's public REST API over HTTPS for the current active code.",
      "By generating a random number seeded with the phone's battery level."
    ],
    "correctIndex": 1,
    "explanation": "TOTP computes T = floor(UnixTime / 30), computes HMAC-SHA1(Secret, T), and extracts a 6-digit number via 4-bit dynamic offset truncation. The process runs completely offline."
  },
  {
    "id": 18,
    "topicId": "mfa-totp-hotp-rfc6238",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "What defense must a server implement to prevent replay attacks during the 30-second validity window of a TOTP code?",
    "options": [
      "Require users to enter their password twice.",
      "Store consumed OTP codes in a short-lived cache (Redis) with a 60–90 second TTL and reject duplicate submissions of the same code.",
      "Change the shared secret every time a code is verified.",
      "Enforce mandatory biometric face scans on every OTP submission."
    ],
    "correctIndex": 1,
    "explanation": "Within the 30-second window, an intercepted OTP remains mathematically valid unless the server marks that specific code as consumed in a short-lived cache."
  },

  # Topic 10: webauthn-passkeys-fido2
  {
    "id": 19,
    "topicId": "webauthn-passkeys-fido2",
    "category": "Cryptography & Passwords",
    "difficulty": "Expert",
    "question": "Why are WebAuthn / FIDO2 Passkeys mathematically immune to credential phishing attacks, unlike passwords and TOTP codes?",
    "options": [
      "Because passkeys are stored in the cloud encrypted with AES-256.",
      "The client browser enforces that the hardware private key only signs challenges for the exact origin domain (RP ID); it will never sign for a phishing domain.",
      "Because passkeys require an active mobile phone Bluetooth connection.",
      "Because WebAuthn disables HTML form submission on untrusted websites."
    ],
    "correctIndex": 1,
    "explanation": "WebAuthn binds cryptographic assertions to the Relying Party ID (domain name) verified by the browser. If a user visits fake-bank.com, the browser passes fake-bank.com to the hardware, which refuses to sign with the real bank.com key."
  },
  {
    "id": 20,
    "topicId": "webauthn-passkeys-fido2",
    "category": "Cryptography & Passwords",
    "difficulty": "Expert",
    "question": "What credential data does the relying party server store in its database during WebAuthn passkey registration?",
    "options": [
      "The user's raw fingerprint and biometric template.",
      "The hardware authenticator's asymmetric public key and credential ID.",
      "The private key encrypted with the user's master password.",
      "A symmetric HMAC shared secret."
    ],
    "correctIndex": 1,
    "explanation": "WebAuthn uses asymmetric public-key cryptography. The private key never leaves the device's Secure Enclave; the server only stores the public key, credential ID, and signature counter."
  },

  # Topic 11: oauth2-core-framework-roles
  {
    "id": 21,
    "topicId": "oauth2-core-framework-roles",
    "category": "OAuth & OIDC",
    "difficulty": "Beginner",
    "question": "Which of the following is NOT one of the four primary roles defined by the OAuth 2.0 framework (RFC 6749)?",
    "options": [
      "Resource Owner",
      "Client Application",
      "Certificate Authority",
      "Authorization Server"
    ],
    "correctIndex": 2,
    "explanation": "The four standard roles in RFC 6749 are: Resource Owner (user), Client (app), Authorization Server (IdP), and Resource Server (API). Certificate Authorities are part of PKI/TLS, not OAuth core roles."
  },
  {
    "id": 22,
    "topicId": "oauth2-core-framework-roles",
    "category": "OAuth & OIDC",
    "difficulty": "Beginner",
    "question": "What is the primary security benefit of OAuth 2.0 delegated authorization compared to traditional credential sharing?",
    "options": [
      "Clients receive scoped, time-limited, and revocable access tokens without ever seeing or storing the user's password.",
      "OAuth 2.0 automatically encrypts the client application's database.",
      "OAuth 2.0 eliminates the need for transport-layer security (TLS).",
      "OAuth 2.0 enables clients to change the user's password on the resource server."
    ],
    "correctIndex": 0,
    "explanation": "OAuth 2.0 lets users grant third-party applications limited access (scopes) to their resources without handing over their actual account passwords."
  },

  # Topic 12: oauth2-pkce-flow-rfc9700
  {
    "id": 23,
    "topicId": "oauth2-pkce-flow-rfc9700",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "Why does RFC 9700 (OAuth 2.0 Security Best Current Practice) mandate the use of PKCE with the S256 method for public clients?",
    "options": [
      "To compress the size of access tokens sent across mobile cellular networks.",
      "Because public clients cannot securely protect a client secret, making authorization code interception attacks possible without a cryptographic proof of possession.",
      "To replace the state parameter with a faster hash function.",
      "To allow clients to generate their own access tokens locally without contacting the server."
    ],
    "correctIndex": 1,
    "explanation": "Public clients (SPAs, native mobile apps) cannot maintain the confidentiality of a client secret. PKCE binds the code exchange to the specific client instance that created the initial code_challenge."
  },
  {
    "id": 24,
    "topicId": "oauth2-pkce-flow-rfc9700",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "In the PKCE protocol, what string is transmitted in the initial authorization request URL to the /authorize endpoint?",
    "options": [
      "The plaintext code_verifier",
      "The BASE64URL-encoded SHA-256 hash of the code_verifier (the code_challenge)",
      "The client's RSA private key",
      "The user's password hashed with bcrypt"
    ],
    "correctIndex": 1,
    "explanation": "The client computes code_challenge = base64url(sha256(code_verifier)) and sends this challenge in the /authorize request. The raw code_verifier remains secret until the token exchange step."
  },

  # Topic 13: oauth2-machine-to-machine
  {
    "id": 25,
    "topicId": "oauth2-machine-to-machine",
    "category": "OAuth & OIDC",
    "difficulty": "Intermediate",
    "question": "Which OAuth 2.0 grant type is designed specifically for automated daemon services, scheduled cron jobs, and microservice-to-microservice communication without human interaction?",
    "options": [
      "Authorization Code Grant with PKCE",
      "Implicit Grant",
      "Client Credentials Grant",
      "Resource Owner Password Credentials Grant"
    ],
    "correctIndex": 2,
    "explanation": "The Client Credentials Grant (RFC 6749 §4.4) authenticates machines and services directly using their own registered client credentials without an end-user present."
  },
  {
    "id": 26,
    "topicId": "oauth2-machine-to-machine",
    "category": "OAuth & OIDC",
    "difficulty": "Intermediate",
    "question": "Why does the OAuth 2.0 specification state that Refresh Tokens should NOT be issued for the Client Credentials Grant?",
    "options": [
      "Because machine tokens are valid perpetually and never expire.",
      "Because the client is a confidential client holding long-lived credentials, allowing it to request a new access token directly whenever needed.",
      "Because refresh tokens cannot be transmitted over HTTP/2.",
      "Because machine-to-machine communication only supports symmetric HS256 tokens."
    ],
    "correctIndex": 1,
    "explanation": "Since the background service already possesses its client credentials (client_id and client_secret), it can request a fresh access token at any time without needing an intermediate refresh token."
  },

  # Topic 14: refresh-tokens-rotation
  {
    "id": 27,
    "topicId": "refresh-tokens-rotation",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "What is the core operational principle of Refresh Token Rotation (RTR)?",
    "options": [
      "Refresh tokens never change, but access tokens rotate every 30 seconds.",
      "Every time a refresh token is exchanged, it is immediately invalidated and a brand-new refresh token is issued to the client.",
      "The client rotates between three different authorization servers on each request.",
      "Refresh tokens are encrypted with a new RSA key pair every hour."
    ],
    "correctIndex": 1,
    "explanation": "Under Refresh Token Rotation, each refresh token can be used exactly once. Using it invalidates it and produces a replacement token, bounding the lifespan of any single token."
  },
  {
    "id": 28,
    "topicId": "refresh-tokens-rotation",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "What action must an authorization server take when a previously consumed refresh token is presented for exchange (replay detection)?",
    "options": [
      "Ignore the request and return the existing active access token.",
      "Immediately revoke the entire token family (including the active token), terminating all sessions for that lineage.",
      "Generate a new authorization code and email it to the user.",
      "Downgrade the user's role to read-only."
    ],
    "correctIndex": 1,
    "explanation": "Presenting an already-consumed token indicates token theft (either by the attacker or the victim). The server must revoke the entire token family immediately to cut off unauthorized access."
  },

  # Topic 15: openid-connect-oidc-identity
  {
    "id": 29,
    "topicId": "openid-connect-oidc-identity",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "What is the primary role of the ID Token in an OpenID Connect (OIDC) flow?",
    "options": [
      "To serve as a bearer token for querying backend microservice APIs.",
      "To provide the client application with cryptographically verifiable assertions about the user's authentication event and identity.",
      "To encrypt database records in transit.",
      "To replace the need for HTTPS during login."
    ],
    "correctIndex": 1,
    "explanation": "The ID Token is a signed JWT intended specifically for consumption by the client application, containing claims verifying the user's identity (sub, email, auth_time, iss, aud)."
  },
  {
    "id": 30,
    "topicId": "openid-connect-oidc-identity",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "How does the 'nonce' claim in an OpenID Connect ID Token protect against replay attacks?",
    "options": [
      "It limits the token to a single IP address.",
      "It binds the client's initial authorization request to the resulting ID token, allowing the client to verify that the token was not replayed from a previous session.",
      "It hashes the client secret so it cannot be read in transit.",
      "It forces the ID token to expire in 5 seconds."
    ],
    "correctIndex": 1,
    "explanation": "The client generates a unique nonce and checks that the returned ID Token contains that exact nonce value, proving the token was created in direct response to the current authentication request."
  },

  # Topic 16: enterprise-sso-saml-vs-oidc
  {
    "id": 31,
    "topicId": "enterprise-sso-saml-vs-oidc",
    "category": "OAuth & OIDC",
    "difficulty": "Expert",
    "question": "What vulnerability in XML digital signature verification can allow an attacker to bypass SAML 2.0 authentication?",
    "options": [
      "XML Signature Wrapping (XSW)",
      "Cross-Site Scripting (XSS)",
      "Timing Side-Channel on AES-GCM",
      "Padding Oracle on RSA-OAEP"
    ],
    "correctIndex": 0,
    "explanation": "XML Signature Wrapping (XSW) exploits ambiguities in XML parsers by shifting the genuinely signed XML block elsewhere in the document and injecting an untrusted forged assertion that the application logic evaluates."
  },
  {
    "id": 32,
    "topicId": "enterprise-sso-saml-vs-oidc",
    "category": "OAuth & OIDC",
    "difficulty": "Expert",
    "question": "How do modern identity architectures compare SAML 2.0 and OpenID Connect (OIDC)?",
    "options": [
      "SAML 2.0 uses compact JSON/JWT tokens, while OIDC uses complex XML assertions.",
      "SAML 2.0 is an enterprise standard relying on signed XML assertions, whereas OIDC is a modern RESTful standard using JSON/JWTs over OAuth 2.0.",
      "OIDC requires client desktop software, while SAML works only on mobile devices.",
      "SAML 2.0 does not support Single Sign-On."
    ],
    "correctIndex": 1,
    "explanation": "SAML 2.0 is an XML-based federation standard deeply rooted in enterprise IdPs; OIDC is a lightweight, mobile-friendly identity layer built on OAuth 2.0 using JSON Web Tokens."
  },

  # Topic 17: jwt-architecture-claims
  {
    "id": 33,
    "topicId": "jwt-architecture-claims",
    "category": "JWT & Signatures",
    "difficulty": "Intermediate",
    "question": "What are the three dot-separated components of a standard JSON Web Token (JWT)?",
    "options": [
      "Header, Payload, Signature",
      "Public Key, Private Key, Ciphertext",
      "Algorithm, Nonce, Checksum",
      "Issuer, Subject, Audience"
    ],
    "correctIndex": 0,
    "explanation": "A standard JWT consists of three Base64URL-encoded segments separated by periods: Header (metadata and algorithm), Payload (claims), and Signature (cryptographic proof of integrity)."
  },
  {
    "id": 34,
    "topicId": "jwt-architecture-claims",
    "category": "JWT & Signatures",
    "difficulty": "Intermediate",
    "question": "Which standard JWT claim specifies the exact timestamp after which the token must be rejected as expired?",
    "options": [
      "iat (Issued At)",
      "exp (Expiration Time)",
      "nbf (Not Before)",
      "jti (JWT ID)"
    ],
    "correctIndex": 1,
    "explanation": "The 'exp' claim is a Unix timestamp indicating when the token expires. Resource servers must reject any token where currentTime >= exp."
  },

  # Topic 18: jwt-digital-signatures-rs256
  {
    "id": 35,
    "topicId": "jwt-digital-signatures-rs256",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "What is an 'Algorithm Confusion' attack on a JWT verification implementation?",
    "options": [
      "An attacker sends a JWT with no signature and expects the server to accept it.",
      "An attacker crafts a token with header 'alg: HS256' and signs it using the server's public RSA key as the symmetric HMAC secret.",
      "An attacker replaces AES-128 with AES-256 in an encrypted JWE.",
      "An attacker overflows the token payload buffer with invalid UTF-8 bytes."
    ],
    "correctIndex": 1,
    "explanation": "If a server expects RS256 but allows the token header to choose the algorithm, an attacker can specify HS256 and sign with the server's publicly known RSA public key, which the naive server treats as a symmetric HMAC secret."
  },
  {
    "id": 36,
    "topicId": "jwt-digital-signatures-rs256",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "Why is RS256/ES256 strongly preferred over HS256 in microservice architectures with dozens of independent services?",
    "options": [
      "RS256 tokens are smaller in byte size than HS256 tokens.",
      "With HS256, every verifying service must hold the shared secret and can forge tokens; with RS256, only the identity provider holds the private key to sign.",
      "HS256 requires hardware security modules (HSM) on every machine.",
      "RS256 executes 10 times faster than HMAC on standard CPUs."
    ],
    "correctIndex": 1,
    "explanation": "In an asymmetric scheme (RS256), resource servers only hold the public key to verify signatures; a compromise of a microservice does not allow the attacker to forge authentication tokens."
  },

  # Topic 19: jwks-key-rotation-caching
  {
    "id": 37,
    "topicId": "jwks-key-rotation-caching",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "What is the purpose of the 'kid' (Key ID) header in a JSON Web Token?",
    "options": [
      "It specifies the user's account ID.",
      "It identifies which specific public key in a JWKS set was used to sign the token, enabling zero-downtime key rotation.",
      "It determines the encryption cipher used for payload fields.",
      "It counts how many times the token has been refreshed."
    ],
    "correctIndex": 1,
    "explanation": "The 'kid' header tells the verifying party which key in the JWKS was used for signing, allowing new keys to be introduced and old keys retired seamlessly."
  },
  {
    "id": 38,
    "topicId": "jwks-key-rotation-caching",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "How must an API gateway protect against 'Cache Stampede' denial-of-service attacks when verifying JWKS keys?",
    "options": [
      "By fetching the remote JWKS endpoint on every incoming HTTP request.",
      "By caching JWKS keys and enforcing a cooldown rate limit (e.g. max 1 remote fetch per 30s) when an unknown 'kid' is encountered.",
      "By disabling key rotation completely.",
      "By requiring clients to send the public key inside the token payload."
    ],
    "correctIndex": 1,
    "explanation": "If every unknown 'kid' triggered an immediate remote HTTP fetch, an attacker could flood the API with randomized 'kid' values to overwhelm the identity server. A cooldown window prevents this denial-of-service."
  },

  # Topic 20: jwt-revocation-blacklisting
  {
    "id": 39,
    "topicId": "jwt-revocation-blacklisting",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "How can an application revoke an individual stateless JWT access token before its expiration without storing every issued token in a database?",
    "options": [
      "By remotely modifying the token stored in the user's browser memory.",
      "By storing the revoked token's unique 'jti' in a Redis denylist with a TTL equal to the token's remaining lifespan.",
      "By changing the private key of the identity server on every logout.",
      "By issuing a DNS revocation record."
    ],
    "correctIndex": 1,
    "explanation": "Storing only revoked token IDs (jti) in Redis with automatic TTL expiration keeps memory usage tiny and bounded, because entries automatically purge themselves once the token's natural expiration passes."
  },
  {
    "id": 40,
    "topicId": "jwt-revocation-blacklisting",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "How can an application implement instant 'Log out of all devices' for a user without maintaining a large list of individual revoked token IDs?",
    "options": [
      "Embed a 'token_version' or 'issued_at' timestamp claim in the token, and store the user's current valid version in the database or Redis.",
      "Block the user's MAC address at the cloud firewall.",
      "Require the user to reinstall their mobile application.",
      "Regenerate the SSL certificates on the API gateway."
    ],
    "correctIndex": 0,
    "explanation": "By checking that token.ver >= user.min_token_ver, incrementing the user's version counter instantly invalidates all previously issued tokens across all of the user's devices with a single integer update."
  },

  # Topic 21: rbac-role-based-access
  {
    "id": 41,
    "topicId": "rbac-role-based-access",
    "category": "Authorization & RBAC",
    "difficulty": "Beginner",
    "question": "Why is checking granular permissions (e.g. hasPermission('doc:delete')) considered an architectural best practice over checking role names (e.g. if (user.role === 'admin'))?",
    "options": [
      "Role names cannot be stored in relational databases.",
      "Checking permissions decouples application logic from role assignments, allowing new roles to be created without modifying application source code.",
      "Checking permissions eliminates the need for SQL indexes.",
      "Role names are automatically encrypted by the operating system."
    ],
    "correctIndex": 1,
    "explanation": "If code checks role names directly, creating a new role (like 'ComplianceAuditor') requires hunting down and altering dozens of if-statements across the codebase. Checking permissions keeps code modular and extensible."
  },
  {
    "id": 42,
    "topicId": "rbac-role-based-access",
    "category": "Authorization & RBAC",
    "difficulty": "Beginner",
    "question": "What is 'Role Hierarchy' in a Role-Based Access Control system?",
    "options": [
      "Sorting users alphabetically by their last name.",
      "An inheritance structure where higher-level roles automatically inherit all permissions granted to lower-level roles.",
      "A database constraint that allows each user to have only one role.",
      "A network firewall rule that prioritizes admin packets."
    ],
    "correctIndex": 1,
    "explanation": "A role hierarchy (e.g. Owner > Admin > Member > Viewer) ensures that higher-privilege roles inherit all capabilities of subordinate roles, preventing redundant permission assignments."
  },

  # Topic 22: abac-attribute-based-access
  {
    "id": 43,
    "topicId": "abac-attribute-based-access",
    "category": "Authorization & RBAC",
    "difficulty": "Advanced",
    "question": "Which of the following authorization policies can be expressed natively in ABAC but CANNOT be modeled cleanly in pure RBAC?",
    "options": [
      "Only users with the 'Manager' role can create projects.",
      "A doctor can only view a patient's medical record if the doctor is currently assigned as that patient's primary care physician and the request originates during the doctor's scheduled shift.",
      "Admins can invite new team members.",
      "Viewers cannot delete documents."
    ],
    "correctIndex": 1,
    "explanation": "ABAC evaluates dynamic relationships between subject attributes, resource attributes, and environmental variables (shift schedule, assignment match) that cannot be captured by static roles."
  },
  {
    "id": 44,
    "topicId": "abac-attribute-based-access",
    "category": "Authorization & RBAC",
    "difficulty": "Advanced",
    "question": "What is the architectural role of a Policy Decision Point (PDP) in an enterprise authorization architecture?",
    "options": [
      "It intercepts incoming HTTP network packets and routes them to servers.",
      "It evaluates the requested action against contextual attributes and declarative access policies to return a Permit or Deny decision.",
      "It encrypts user passwords in database storage.",
      "It generates SSL/TLS certificates for API domains."
    ],
    "correctIndex": 1,
    "explanation": "The PDP is the central policy evaluation engine (e.g. Open Policy Agent) that receives authorization queries and evaluates policies to decide Permit or Deny."
  },

  # Topic 23: rebac-relationship-based-access
  {
    "id": 45,
    "topicId": "rebac-relationship-based-access",
    "category": "Authorization & RBAC",
    "difficulty": "Expert",
    "question": "How does Relationship-Based Access Control (ReBAC, Google Zanzibar model) determine whether a user has permission to access a document nested in a folder?",
    "options": [
      "By reading the user's static 'role' column from the database.",
      "By traversing a directed graph of relation tuples linking the user, group memberships, and parent-child resource hierarchies.",
      "By hashing the document title with the user's password.",
      "By prompting the user for a TOTP MFA code."
    ],
    "correctIndex": 1,
    "explanation": "ReBAC evaluates permissions by traversing edges in a relationship graph (e.g. user:alice -> member -> team:eng -> editor -> folder:infra -> parent -> doc:guide)."
  },
  {
    "id": 46,
    "topicId": "rebac-relationship-based-access",
    "category": "Authorization & RBAC",
    "difficulty": "Expert",
    "question": "In the Google Zanzibar ReBAC notation, what does the tuple 'doc:budget#viewer@team:finance#member' signify?",
    "options": [
      "The budget document is owned by a user named 'team'.",
      "Any user who is a 'member' of 'team:finance' has the 'viewer' relation on 'doc:budget'.",
      "The finance team has been deleted from the budget document.",
      "The budget document is encrypted using the finance team's public key."
    ],
    "correctIndex": 1,
    "explanation": "Zanzibar tuples represent relations between objects and subjects. This tuple grants viewer access on doc:budget to any subject who belongs to team:finance as a member."
  },

  # Topic 24: idor-bola-object-authorization
  {
    "id": 47,
    "topicId": "idor-bola-object-authorization",
    "category": "Authorization & RBAC",
    "difficulty": "Intermediate",
    "question": "Why is Broken Object-Level Authorization (BOLA/IDOR) ranked as the #1 threat on the OWASP API Security Top 10?",
    "options": [
      "Because it bypasses TLS encryption on public networks.",
      "Because APIs frequently expose direct object identifiers in endpoints, and failing to validate user ownership allows authenticated callers to read or alter other tenants' data.",
      "Because it causes server CPUs to overheat during hash computation.",
      "Because it disables CORS protections on modern web browsers."
    ],
    "correctIndex": 1,
    "explanation": "BOLA/IDOR occurs when an API endpoint uses client-supplied IDs without verifying that the authenticated user owns or has rights to that specific object, allowing unauthorized data exfiltration."
  },
  {
    "id": 48,
    "topicId": "idor-bola-object-authorization",
    "category": "Authorization & RBAC",
    "difficulty": "Intermediate",
    "question": "What is the most effective database-level defense against IDOR/BOLA vulnerabilities in multi-tenant SaaS applications?",
    "options": [
      "Changing all auto-increment integer IDs to UUIDv4.",
      "Mandating that every database query explicitly filters by the authenticated user's organization_id (e.g. WHERE id = $1 AND org_id = $2).",
      "Encrypting the database connection string.",
      "Adding a CAPTCHA to every API endpoint."
    ],
    "correctIndex": 1,
    "explanation": "Scoping database queries directly with the verified tenant/organization ID from the session guarantees that queries return zero rows if an attacker attempts to access another tenant's object ID."
  },

  # Topic 25: xss-csp-defense-in-depth
  {
    "id": 49,
    "topicId": "xss-csp-defense-in-depth",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "How does a Content Security Policy (CSP) with cryptographic nonces neutralize Cross-Site Scripting (XSS) attacks?",
    "options": [
      "It encrypts all HTML tags sent over HTTPS.",
      "The browser will only execute inline <script> tags that include a nonce matching the unique random nonce generated by the server for that specific HTTP response.",
      "It blocks users from typing punctuation characters into input fields.",
      "It disables JavaScript execution across the entire operating system."
    ],
    "correctIndex": 1,
    "explanation": "Because an attacker cannot predict the unique cryptographic nonce generated by the server for each page load, any script injected via XSS will lack the valid nonce and will be blocked by the browser."
  },
  {
    "id": 50,
    "topicId": "xss-csp-defense-in-depth",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "Why is context-aware output encoding essential when rendering untrusted user input into web pages?",
    "options": [
      "Different contexts (HTML body, attributes, JavaScript variables, URLs) have distinct syntax rules; characters safe in HTML body can be dangerous inside attributes or script contexts.",
      "Output encoding compresses the page to speed up page rendering.",
      "Output encoding prevents SQL injection in the browser.",
      "Context-aware encoding removes all CSS styles from the application."
    ],
    "correctIndex": 0,
    "explanation": "Standard HTML entity escaping (&lt;) is insufficient inside an attribute (e.g. <a href=\"...\">) or a JavaScript block where quotes or javascript: pseudo-protocols can still trigger execution."
  },

  # Topic 26: cors-security-preflights
  {
    "id": 51,
    "topicId": "cors-security-preflights",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "What is the purpose of an HTTP OPTIONS 'preflight' request in Cross-Origin Resource Sharing (CORS)?",
    "options": [
      "To negotiate the TLS cipher suite between client and server.",
      "To ask the target server in advance whether the requesting origin is allowed to send the specific HTTP method and custom headers before executing the actual request.",
      "To download the server's public SSH keys.",
      "To measure network ping latency before transferring large files."
    ],
    "correctIndex": 1,
    "explanation": "Before sending non-simple or state-modifying cross-origin requests, the browser sends an OPTIONS preflight to verify that the server explicitly permits cross-origin communication from that origin."
  },
  {
    "id": 52,
    "topicId": "cors-security-preflights",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "What browser security rule prevents an API from combining 'Access-Control-Allow-Origin: *' with 'Access-Control-Allow-Credentials: true'?",
    "options": [
      "The browser network stack crashes when wildcard origins are parsed.",
      "Modern browsers explicitly reject responses combining wildcard origins with credentials to prevent malicious websites from reading authenticated private user data.",
      "HTTP/2 specifications forbid asterisks in header values.",
      "Wildcard origins disable cookie transmission at the operating system level."
    ],
    "correctIndex": 1,
    "explanation": "The CORS specification explicitly prohibits combining a wildcard origin (*) with credentials: true. If this were permitted, any malicious website on the internet could read authenticated responses."
  },

  # Topic 27: credential-stuffing-rate-limiting
  {
    "id": 53,
    "topicId": "credential-stuffing-rate-limiting",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "Why is rate limiting solely by client IP address ineffective against sophisticated credential stuffing botnets?",
    "options": [
      "Because IP addresses cannot be parsed by Redis.",
      "Because botnets distribute their attacks across tens of thousands of rotating residential proxy IPs, keeping requests per individual IP very low.",
      "Because IP headers are encrypted by TLS.",
      "Because browsers randomize their IP address on every HTTP request."
    ],
    "correctIndex": 1,
    "explanation": "Botnets use distributed residential proxy networks to send only 1 or 2 requests per IP address, easily bypassing simple per-IP rate limits unless targeted accounts are also tracked."
  },
  {
    "id": 54,
    "topicId": "credential-stuffing-rate-limiting",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "How does the 'k-Anonymity' model used by HaveIBeenPwned allow applications to check if a user's password has been breached without exposing the password to third parties?",
    "options": [
      "The client sends the first 5 characters of the password's SHA-1 hash; the server returns all matching hashes, and the client checks for a match locally.",
      "The password is encrypted with the user's email address.",
      "The application uploads the plaintext password over an encrypted WebSocket.",
      "The server queries the third party using a randomized proxy network."
    ],
    "correctIndex": 0,
    "explanation": "Under k-Anonymity, the client only sends the first 5 characters of the SHA-1 hash (a prefix). The service returns a list of matching hashes, and the client checks locally if the full hash is present."
  },

  # Topic 28: api-key-security-design
  {
    "id": 55,
    "topicId": "api-key-security-design",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "Why should developer API keys begin with recognizable prefixes like 'sk_live_' or 'cosmos_live_'?",
    "options": [
      "To tell the database which partition to store the key in.",
      "To enable automated secret scanning engines (like GitHub Secret Scanning) to detect accidentally committed keys in code repositories and alert the issuing service.",
      "To encrypt the key in transit without needing TLS.",
      "To reduce the computational cost of hashing the key."
    ],
    "correctIndex": 1,
    "explanation": "High-entropy strings look like random noise; distinct prefixes allow automated scanners on GitHub, GitLab, and CI logs to identify leaked credentials immediately."
  },
  {
    "id": 56,
    "topicId": "api-key-security-design",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "Why should high-entropy API keys be hashed with SHA-256 in the database rather than Argon2id?",
    "options": [
      "SHA-256 is stronger than Argon2id against brute-force attacks.",
      "API keys possess 256 bits of high entropy (unguessable by brute-force), so fast SHA-256 hashing provides complete security while avoiding high CPU latency on frequent API requests.",
      "Argon2id cannot process strings longer than 16 characters.",
      "SHA-256 is a reversible encryption standard."
    ],
    "correctIndex": 1,
    "explanation": "Argon2id's memory-hardness is needed for human passwords because humans pick low-entropy strings. API keys have 256 bits of true cryptographic entropy, making fast SHA-256 hashing optimal for sub-millisecond API performance."
  },

  # Topic 29: mtls-zero-trust-architecture
  {
    "id": 57,
    "topicId": "mtls-zero-trust-architecture",
    "category": "Resilience & Defense",
    "difficulty": "Advanced",
    "question": "What is the core premise of the 'Zero Trust' architecture model in enterprise cloud infrastructure?",
    "options": [
      "Never trust employees; all source code must be written by AI.",
      "Never trust, always verify: assume the internal network is compromised and cryptographically authenticate and authorize every request, even inside the perimeter.",
      "Disable all outgoing internet connections across the company.",
      "Do not use databases or persistent storage."
    ],
    "correctIndex": 1,
    "explanation": "Zero Trust rejects the old 'castle-and-moat' model. It assumes attackers already have access to the internal network, requiring every service-to-service connection to be explicitly authenticated and encrypted."
  },
  {
    "id": 58,
    "topicId": "mtls-zero-trust-architecture",
    "category": "Resilience & Defense",
    "difficulty": "Advanced",
    "question": "In a Mutual TLS (mTLS) handshake, how does the server verify the caller's identity?",
    "options": [
      "The caller presents a valid OAuth 2.0 access token in an HTTP header.",
      "The server requests a client certificate; the client presents an X.509 certificate and proves possession of the matching private key via a digital signature.",
      "The server checks the caller's IP address against a firewall whitelist.",
      "The caller sends their password encrypted with AES-256."
    ],
    "correctIndex": 1,
    "explanation": "In mTLS, both sides present X.509 certificates. The client signs handshake data with its private key, proving its machine identity directly to the server at the transport layer."
  },

  # Topic 30: http-security-headers-defense
  {
    "id": 59,
    "topicId": "http-security-headers-defense",
    "category": "Resilience & Defense",
    "difficulty": "Beginner",
    "question": "What security vulnerability is mitigated by configuring the 'Strict-Transport-Security' (HSTS) header with the 'preload' directive?",
    "options": [
      "SQL Injection",
      "SSL Stripping and man-in-the-middle attacks on the user's initial unencrypted HTTP connection",
      "Cross-Site Scripting (XSS)",
      "Denial of Service (DoS)"
    ],
    "correctIndex": 1,
    "explanation": "HSTS Preload ensures that web browsers hardcode HTTPS for the domain; the browser will never attempt an insecure HTTP connection, defeating SSL-stripping attacks even on the very first visit."
  },
  {
    "id": 60,
    "topicId": "http-security-headers-defense",
    "category": "Resilience & Defense",
    "difficulty": "Beginner",
    "question": "Which HTTP security header prevents malicious websites from embedding your application inside a hidden <iframe> to launch Clickjacking attacks?",
    "options": [
      "X-Content-Type-Options: nosniff",
      "X-Frame-Options: DENY (and CSP frame-ancestors 'none')",
      "Referrer-Policy: no-referrer",
      "Access-Control-Allow-Origin: *"
    ],
    "correctIndex": 1,
    "explanation": "X-Frame-Options: DENY (or CSP frame-ancestors 'none') instructs the browser to refuse rendering the page in an iframe, preventing clickjacking attacks where transparent frames overlay legitimate UI buttons."
  }
]
