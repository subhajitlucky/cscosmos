// 50 Comprehensive Practice Questions for Authentication, OAuth 2.0 & Identity Architecture
// Ordered pedagogically from Beginner to Advanced/Expert.
// Covers all 19 core modules in the AuthCosmos curriculum.

export interface AuthProblem {
  id: number;
  topicId: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AuthProblemCategory {
  id: string;
  name: string;
  count: number;
}

export const AUTH_PROBLEM_CATEGORIES: { id: string; name: string }[] = [
  { id: 'all', name: 'All Topics (50)' },
  { id: 'OAuth & OIDC', name: 'OAuth 2.0 & OIDC' },
  { id: 'JWT & Signatures', name: 'JWT & Digital Signatures' },
  { id: 'Sessions & Cookies', name: 'Sessions & Cookie Security' },
  { id: 'Authorization & RBAC', name: 'Authorization & Policy Engines' },
  { id: 'Cryptography & Passwords', name: 'Cryptography & Passwords' },
  { id: 'Resilience & Defense', name: 'Resilience & Attack Defenses' },
];

export const AUTH_PROBLEMS: AuthProblem[] = [
  {
    "id": 1,
    "topicId": "oauth2-pkce-flow-security",
    "category": "OAuth & OIDC",
    "difficulty": "Beginner",
    "question": "Why was PKCE (Proof Key for Code Exchange, RFC 7636) originally created for public clients like SPAs and Mobile Apps?",
    "options": [
      "To encrypt the payload of JWT access tokens in transit.",
      "Because public clients cannot safely store a client secret, making authorization code interception possible.",
      "To replace HTTPS with a custom cryptographic network tunnel.",
      "To eliminate the need for an authorization server entirely."
    ],
    "correctIndex": 1,
    "explanation": "Public clients (React SPAs, mobile apps) execute on client hardware where anyone can inspect memory or source code. PKCE replaces static client secrets with dynamically generated one-time code verifiers and hashes."
  },
  {
    "id": 2,
    "topicId": "oauth2-pkce-flow-security",
    "category": "OAuth & OIDC",
    "difficulty": "Intermediate",
    "question": "Which hashing method should always be used for code_challenge_method in modern OAuth 2.0 PKCE implementations?",
    "options": [
      "plain (unhashed code verifier string)",
      "MD5",
      "S256 (SHA-256 Base64URL encoded)",
      "bcrypt"
    ],
    "correctIndex": 2,
    "explanation": "RFC 7636 and OAuth 2.1 strictly mandate code_challenge_method=S256. The plain method provides zero protection if the authorization request URL query parameters are intercepted."
  },
  {
    "id": 3,
    "topicId": "oauth2-pkce-flow-security",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "In an OAuth 2.0 PKCE flow, what is the role of the \"state\" parameter, and why is PKCE alone not sufficient?",
    "options": [
      "PKCE handles token encryption, while state is used to set the user avatar.",
      "State binds the callback to the initiating browser session, preventing Login CSRF where an attacker tricks a victim into signing into the attacker account.",
      "State is used by the authorization server to compute the SHA-256 hash of the password.",
      "State is deprecated in OAuth 2.1 and has no cryptographic security benefit."
    ],
    "correctIndex": 1,
    "explanation": "PKCE ensures that only the client that started the code request can exchange the authorization code. However, state proves that the user returning to /callback is the same user who initiated the login in that specific browser session, preventing login CSRF."
  },
  {
    "id": 4,
    "topicId": "oauth2-pkce-flow-security",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "Why does OAuth 2.1 officially deprecate the legacy Implicit Grant flow (response_type=token)?",
    "options": [
      "Implicit flow exposes access tokens directly in the URL hash fragment, leaving them vulnerable to browser history, referer leaks, and script interception.",
      "Implicit flow requires client secrets which mobile apps cannot store.",
      "Implicit flow only supports symmetric HS256 encryption.",
      "Implicit flow is too slow because it requires three server round-trips."
    ],
    "correctIndex": 0,
    "explanation": "In the Implicit Flow, access tokens are returned in the URI fragment directly to the user-agent. OAuth 2.1 mandates Authorization Code with PKCE so tokens are only transferred over direct back-channel POST requests."
  },
  {
    "id": 5,
    "topicId": "jwt-structure-rs256-vs-hs256",
    "category": "JWT & Signatures",
    "difficulty": "Beginner",
    "question": "What are the three components of a JSON Web Token (JWT) separated by dots?",
    "options": [
      "Username.Password.Salt",
      "Header.Payload.Signature",
      "Origin.Referer.Cookie",
      "Algorithm.PublicKey.PrivateKey"
    ],
    "correctIndex": 1,
    "explanation": "A JWT is structured as three Base64URL-encoded JSON objects concatenated with periods: [Base64Header].[Base64Payload].[Signature]."
  },
  {
    "id": 6,
    "topicId": "jwt-structure-rs256-vs-hs256",
    "category": "JWT & Signatures",
    "difficulty": "Intermediate",
    "question": "What is the critical architectural difference between HS256 and RS256 for signing JWTs in a microservice ecosystem?",
    "options": [
      "HS256 is asymmetric; RS256 is symmetric.",
      "HS256 uses a symmetric shared secret known to all services; RS256 uses an asymmetric private key to sign and public keys (JWKS) for microservices to verify.",
      "RS256 can only be verified by an active database connection to the IdP.",
      "HS256 does not support expiration (exp) claims."
    ],
    "correctIndex": 1,
    "explanation": "In RS256, only the identity provider holds the private key to sign tokens. Downstream microservices only need the public key to verify signatures, preventing any service from forging tokens."
  },
  {
    "id": 7,
    "topicId": "jwt-structure-rs256-vs-hs256",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "How did the infamous \"alg: none\" JWT signature vulnerability operate in vulnerable libraries?",
    "options": [
      "Attackers cracked the 2048-bit RSA key using quantum computing.",
      "Attackers sent alg: \"none\" with an empty signature; vulnerable parsers accepted the token as valid without verifying cryptographic integrity.",
      "Attackers reversed the Base64URL encoding algorithm to extract the server private key.",
      "Attackers changed the exp claim to 0."
    ],
    "correctIndex": 1,
    "explanation": "The JWT specification defined \"none\" for unsecured tokens. Flawed verification libraries trusted the header's alg parameter unconditionally, allowing attackers to forge arbitrary admin claims by stripping the signature."
  },
  {
    "id": 8,
    "topicId": "jwt-structure-rs256-vs-hs256",
    "category": "JWT & Signatures",
    "difficulty": "Expert",
    "question": "What is the \"Key Confusion / Algorithm Confusion\" attack between RS256 and HS256?",
    "options": [
      "An attacker forces the server to use MD5 instead of SHA-256.",
      "An attacker signs a token using the server's public RSA key as the HMAC shared secret with HS256; if the server expects RS256 but allows HS256, it verifies the signature against its own public key.",
      "An attacker sends multiple JWTs simultaneously to trigger a race condition in the crypto engine.",
      "An attacker changes the token encoding from UTF-8 to UTF-16."
    ],
    "correctIndex": 1,
    "explanation": "Because public RSA keys are publicly accessible, if an API server verifies a token with HS256 while using the public RSA key file as the HMAC secret string, the attacker's forged token passes verification unless algorithms are strictly whitelisted."
  },
  {
    "id": 9,
    "topicId": "session-cookies-vs-bearer-tokens",
    "category": "Sessions & Cookies",
    "difficulty": "Beginner",
    "question": "Why is storing authentication JWTs in browser localStorage considered risky for high-security applications?",
    "options": [
      "LocalStorage is limited to 100 bytes of data.",
      "LocalStorage is accessible to any JavaScript running on the page, meaning any Cross-Site Scripting (XSS) vulnerability allows immediate token exfiltration.",
      "LocalStorage automatically deletes tokens after 60 seconds.",
      "LocalStorage can only be read over HTTP, not HTTPS."
    ],
    "correctIndex": 1,
    "explanation": "LocalStorage has no protection against malicious JavaScript. If an attacker injects a script via XSS, they can execute localStorage.getItem(\"token\") and exfiltrate the session."
  },
  {
    "id": 10,
    "topicId": "session-cookies-vs-bearer-tokens",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "What combination of cookie attributes provides maximum defense against both XSS token theft and CSRF attacks?",
    "options": [
      "Domain=.com; Path=/; Max-Age=3600",
      "HttpOnly; Secure; SameSite=Lax (or Strict)",
      "SameSite=None; Partitioned",
      "HttpOnly; Secure=false"
    ],
    "correctIndex": 1,
    "explanation": "HttpOnly prevents JavaScript from reading document.cookie (neutralizing XSS exfiltration); Secure ensures transport only over HTTPS; SameSite=Lax/Strict restricts cookie transmission on cross-site requests."
  },
  {
    "id": 11,
    "topicId": "session-cookies-vs-bearer-tokens",
    "category": "Sessions & Cookies",
    "difficulty": "Advanced",
    "question": "In modern Single Page Applications (Next.js / React), what is the \"Backend for Frontend\" (BFF) pattern for token management?",
    "options": [
      "The SPA stores the access token directly in IndexedDB with an AES key.",
      "A dedicated server-side proxy handles the OAuth exchange, stores tokens in encrypted HttpOnly session cookies, and attaches Bearer tokens when forwarding requests to internal microservices.",
      "The browser executes WebAssembly to simulate an entire OAuth 2.0 authorization server locally.",
      "A database trigger generates new tokens directly inside PostgreSQL."
    ],
    "correctIndex": 1,
    "explanation": "The BFF pattern keeps raw access and refresh tokens out of browser reach. The browser only sees an HttpOnly session cookie, while the lightweight BFF layer converts cookie requests into Bearer-authenticated API calls."
  },
  {
    "id": 12,
    "topicId": "rbac-vs-abac-access-control",
    "category": "Authorization & RBAC",
    "difficulty": "Beginner",
    "question": "What is the primary characteristic of Role-Based Access Control (RBAC)?",
    "options": [
      "Permissions are evaluated dynamically based on the current GPS location of the user.",
      "Users are assigned to roles (e.g. Admin, Editor, Viewer), and permissions are bound to those roles.",
      "Access is determined exclusively by biometric fingerprints.",
      "Every single file has an individual password that the user must type."
    ],
    "correctIndex": 1,
    "explanation": "RBAC groups permissions into roles, and assigns users to roles. It is straightforward and predictable, but lacks contextual flexibility."
  },
  {
    "id": 13,
    "topicId": "rbac-vs-abac-access-control",
    "category": "Authorization & RBAC",
    "difficulty": "Intermediate",
    "question": "When is Attribute-Based Access Control (ABAC) required over standard RBAC?",
    "options": [
      "When an application has fewer than 10 total users.",
      "When decisions require contextual attributes such as resource owner ID, time of day, department boundaries, or network subnet.",
      "When the database does not support foreign keys.",
      "When users authenticate without passwords."
    ],
    "correctIndex": 1,
    "explanation": "ABAC evaluates policies like: \"Allow user to edit document IF user.department == doc.department AND doc.status == 'draft' AND currentTime is businessHours\". RBAC would suffer from role explosion to model this."
  },
  {
    "id": 14,
    "topicId": "rbac-vs-abac-access-control",
    "category": "Authorization & RBAC",
    "difficulty": "Advanced",
    "question": "In modern policy engines like Open Policy Agent (OPA) or AWS Cedar, what is the role of a Policy Decision Point (PDP)?",
    "options": [
      "It manages the physical hard drives in the data center.",
      "It receives authorization queries with subject, action, and resource attributes, evaluates declarative policy rules, and returns an Allow/Deny decision.",
      "It rotates SSL certificates every 24 hours.",
      "It generates RSA public-private key pairs for user logins."
    ],
    "correctIndex": 1,
    "explanation": "A Policy Decision Point (PDP) decouples policy evaluation from application logic. The application (Policy Enforcement Point / PEP) asks the PDP: \"Can user X perform action Y on resource Z?\", and enforces the PDP's decision."
  },
  {
    "id": 15,
    "topicId": "password-hashing-argon2id-bcrypt",
    "category": "Cryptography & Passwords",
    "difficulty": "Beginner",
    "question": "Why is fast cryptographic hashing like SHA-256 or MD5 dangerous for storing user passwords?",
    "options": [
      "SHA-256 is vulnerable to collision attacks where two users have the same name.",
      "Modern GPUs and ASICs can compute billions of SHA-256 hashes per second, allowing rapid offline brute-forcing of leaked password hashes.",
      "SHA-256 produces hashes that are too long for database VARCHAR fields.",
      "SHA-256 automatically sends passwords in cleartext over the network."
    ],
    "correctIndex": 1,
    "explanation": "General-purpose hash functions are designed for speed. Password hashing functions (Argon2id, bcrypt) are deliberately designed to be computationally expensive and tunable to resist GPU cracking."
  },
  {
    "id": 16,
    "topicId": "password-hashing-argon2id-bcrypt",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "What unique architectural property makes Argon2id the recommended winner of the Password Hashing Competition over bcrypt?",
    "options": [
      "Argon2id uses less than 1 kilobyte of memory.",
      "Argon2id is memory-hard (tunable memory cost parameter m), neutralizing specialized GPU/ASIC parallel cracking, and combines Argon2d and Argon2i to defend against side-channel attacks.",
      "Argon2id does not require salt values.",
      "Argon2id operates directly in client-side HTML without backend servers."
    ],
    "correctIndex": 1,
    "explanation": "Argon2id requires a configurable amount of physical RAM (e.g. 64 MB per hash). GPUs have thousands of cores but limited memory per core, making mass parallel cracking economically and physically unfeasible."
  },
  {
    "id": 17,
    "topicId": "password-hashing-argon2id-bcrypt",
    "category": "Cryptography & Passwords",
    "difficulty": "Advanced",
    "question": "What is the purpose of a cryptographic \"Salt\" in password hashing?",
    "options": [
      "To encrypt the password using a symmetric secret key.",
      "To ensure that identical passwords produce completely different hash outputs, defeating pre-computed Rainbow Table attacks.",
      "To compress long passwords down to 8 characters.",
      "To prevent the user from typing their password wrong."
    ],
    "correctIndex": 1,
    "explanation": "Without a unique random salt, if two users share the password \"Password123!\", their hashes would match. A salt forces an attacker to compute a dedicated dictionary attack for each individual user."
  },
  {
    "id": 18,
    "topicId": "openid-connect-oidc-id-tokens",
    "category": "OAuth & OIDC",
    "difficulty": "Intermediate",
    "question": "What is the difference between an OAuth 2.0 Access Token and an OpenID Connect (OIDC) ID Token?",
    "options": [
      "Access Tokens are for authentication; ID Tokens are for database queries.",
      "Access Tokens are bearer credentials intended for resource servers to authorize API calls; ID Tokens are JWTs intended for the client to prove user identity and session claims.",
      "ID Tokens cannot be decoded by the frontend.",
      "Access Tokens must always be signed with HMAC-SHA1."
    ],
    "correctIndex": 1,
    "explanation": "OAuth 2.0 is an authorization framework (gives API access). OIDC is an identity layer on top of OAuth 2.0 (returns an ID Token asserting who the user is, when they logged in, and their profile claims)."
  },
  {
    "id": 19,
    "topicId": "openid-connect-oidc-id-tokens",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "How do downstream microservices find the correct public key to verify a newly issued JWT when the IdP rotates keys in its JWKS (.well-known/jwks.json)?",
    "options": [
      "The microservice decrypts the token with the database password.",
      "The microservice reads the \"kid\" (Key ID) header in the JWT and matches it to the corresponding key in the cached JWKS public key set.",
      "The microservice requests the user's password to re-verify the signature.",
      "The microservice discards the signature and trusts the payload."
    ],
    "correctIndex": 1,
    "explanation": "The JWT header contains `kid: \"key_2026_01\"`. The microservice looks up this `kid` in its cached JWKS document. If absent, it refreshes the JWKS endpoint to fetch the new key."
  },
  {
    "id": 20,
    "topicId": "webauthn-passkeys-fido2",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "Why are WebAuthn / FIDO2 Passkeys mathematically resistant to phishing attacks?",
    "options": [
      "Because they require a 64-character master password.",
      "The browser cryptographically binds the challenge signature to the exact origin domain (e.g. accounts.google.com), so a credential harvested on evil-google.com cannot be signed or validated.",
      "They only work when the user is connected to a corporate VPN.",
      "They transmit the private key directly to the server for cloud backup."
    ],
    "correctIndex": 1,
    "explanation": "WebAuthn authenticator challenges are scoped strictly to the Top-Level Origin (Relying Party ID). Even if a victim enters a phishing website, the hardware authenticator refuses to sign challenges for the legitimate domain."
  },
  {
    "id": 21,
    "topicId": "webauthn-passkeys-fido2",
    "category": "Cryptography & Passwords",
    "difficulty": "Expert",
    "question": "Where is the private key stored in a hardware WebAuthn Passkey (e.g. YubiKey or Apple Secure Enclave)?",
    "options": [
      "In a SQLite file in the browser profile directory.",
      "In a tamper-resistant hardware enclave / security processor that never allows the private key bytes to be extracted or exported.",
      "In the server database encrypted with bcrypt.",
      "In the domain DNS TXT records."
    ],
    "correctIndex": 1,
    "explanation": "Hardware authenticators generate asymmetric key pairs internally. The private key remains permanently inside the secure enclave; only cryptographic signatures created using the private key ever leave the device."
  },
  {
    "id": 22,
    "topicId": "multi-factor-authentication-totp",
    "category": "OAuth & OIDC",
    "difficulty": "Intermediate",
    "question": "How does a Time-Based One-Time Password (TOTP RFC 6238) app like Google Authenticator calculate a 6-digit code without an internet connection?",
    "options": [
      "It sends an encrypted SMS via satellite.",
      "It hashes a shared Base32 secret key and the current 30-second UNIX epoch timestep using HMAC-SHA1 and truncates the result to 6 digits.",
      "It generates a random number and transmits it over Bluetooth to the server.",
      "It reads the device SIM card IMSI number."
    ],
    "correctIndex": 1,
    "explanation": "TOTP computes T = floor(UnixTimestamp / 30). Both the phone app and the server know the shared secret and the current UTC time, so both independently compute the exact same HMAC hash without needing network communication."
  },
  {
    "id": 23,
    "topicId": "multi-factor-authentication-totp",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "Why do production TOTP verification engines check timesteps [T - 1, T, T + 1]?",
    "options": [
      "To allow the user to use the same code 3 times.",
      "To accommodate minor clock drift (±30 seconds) between the user's mobile phone and the backend authentication servers.",
      "To speed up CPU computation by caching three hashes.",
      "To support legacy 8-digit codes."
    ],
    "correctIndex": 1,
    "explanation": "If a user enters a code right as the timer expires, or if the client device clock is slightly unsynchronized, checking adjacent windows provides a seamless user experience while strictly invalidating used timesteps against replay."
  },
  {
    "id": 24,
    "topicId": "saml2-enterprise-sso",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "What format do SAML 2.0 identity assertions use to communicate user identity between an IdP (Okta) and an SP (Service Provider)?",
    "options": [
      "Base64-encoded Protobuf",
      "XML documents signed with XML-DSig cryptographic signatures",
      "Raw JSON strings with AES-GCM",
      "YAML files transmitted via SSH"
    ],
    "correctIndex": 1,
    "explanation": "SAML 2.0 is an XML-based standard. Identity assertions contain user attributes and authorization statements enveloped in XML digital signatures verified with X.509 public certificates."
  },
  {
    "id": 25,
    "topicId": "saml2-enterprise-sso",
    "category": "OAuth & OIDC",
    "difficulty": "Expert",
    "question": "What is the \"SAML XML Signature Wrapping (XSW)\" attack?",
    "options": [
      "An attacker modifies the XML structure to inject an unsigned or differently scoped assertion while leaving the original signed block intact, tricking flawed parsers into validating the original signature but evaluating the attacker's forged assertion.",
      "An attacker intercepts the TLS handshake to strip encryption.",
      "An attacker floods the IdP with malformed XML entities to cause a Denial of Service.",
      "An attacker decrypts the SAML token using rainbow tables."
    ],
    "correctIndex": 0,
    "explanation": "XML Signature Wrapping exploits discrepancies between how the signature verification logic locates the signed XML element and how the application logic extracts user identity claims from the XML DOM tree."
  },
  {
    "id": 26,
    "topicId": "token-revocation-blacklisting",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "Why are stateless JWT access tokens notoriously difficult to revoke immediately upon user logout or password reset?",
    "options": [
      "Because JWTs cannot be parsed without the server private key.",
      "Because any microservice with the public key verifies the token offline using its cryptographic signature and expiration time, without querying the central database.",
      "Because web browsers refuse to delete tokens from memory.",
      "Because the HTTP/2 specification forbids invalidating tokens."
    ],
    "correctIndex": 1,
    "explanation": "The primary benefit of JWTs—offline decentralized verification—is also their primary drawback. Until a token reaches its \"exp\" timestamp, it remains mathematically valid unless services perform a stateful check against a blacklist."
  },
  {
    "id": 27,
    "topicId": "token-revocation-blacklisting",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "What is the standard industry architecture to balance the performance of stateless JWTs with instant revocation capability?",
    "options": [
      "Issue access tokens that never expire, and check SQL databases on every sub-resource request.",
      "Issue ultra-short-lived access tokens (5 to 15 minutes), paired with stateful refresh tokens stored in Redis with immediate revocation and Refresh Token Rotation.",
      "Store all JWTs in Git repositories.",
      "Require users to complete a CAPTCHA on every API request."
    ],
    "correctIndex": 1,
    "explanation": "Short-lived access tokens limit the window of exposure for compromised tokens to minutes. Refresh tokens are stateful and rotated on every exchange; revoking the refresh token in Redis cuts off future access immediately."
  },
  {
    "id": 28,
    "topicId": "csrf-token-synchronizer-pattern",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "How does the Synchronizer Token Pattern defend against Cross-Site Request Forgery (CSRF)?",
    "options": [
      "By encrypting the database with AES-256.",
      "By requiring state-changing requests (POST/PUT/DELETE) to submit a cryptographically random, unguessable token in an HTTP header or body that malicious third-party sites cannot read due to the Same-Origin Policy.",
      "By blocking all incoming traffic from mobile devices.",
      "By requiring passwords on every form submission."
    ],
    "correctIndex": 1,
    "explanation": "Browsers automatically attach ambient session cookies to cross-site requests. A custom CSRF token in a header (e.g. X-CSRF-Token) cannot be forged or read by a cross-site malicious page, proving the request originated from the authentic web application."
  },
  {
    "id": 29,
    "topicId": "csrf-token-synchronizer-pattern",
    "category": "Sessions & Cookies",
    "difficulty": "Advanced",
    "question": "Why does cookie attribute \"SameSite=Lax\" NOT completely replace CSRF tokens for sensitive state-changing operations?",
    "options": [
      "SameSite=Lax only works on Linux servers.",
      "SameSite=Lax still attaches cookies on top-level GET navigations (e.g. clicking an external link), meaning if a sensitive operation can be triggered via GET, it remains vulnerable to CSRF.",
      "SameSite=Lax is ignored by all modern Chromium browsers.",
      "SameSite=Lax disables HTTPS encryption."
    ],
    "correctIndex": 1,
    "explanation": "SameSite=Lax permits cookies on \"safe\" top-level navigations (e.g. following an incoming link). If developers violate REST guidelines and allow state-changing actions via GET (e.g. /delete-account?id=5), SameSite=Lax will send the cookie!"
  },
  {
    "id": 30,
    "topicId": "xss-token-theft-mitigations",
    "category": "Sessions & Cookies",
    "difficulty": "Beginner",
    "question": "What is Stored (Persistent) Cross-Site Scripting (XSS)?",
    "options": [
      "When an attacker steals hard drives from the server rack.",
      "When malicious script payload is saved in the database (e.g. in a comment or profile bio) and executed in the browsers of all users who view that data.",
      "When an attacker uses a proxy to tamper with HTTP responses locally.",
      "When a user forgets their password."
    ],
    "correctIndex": 1,
    "explanation": "Stored XSS occurs when untrusted input is permanently saved to a database without proper sanitization/encoding. When victim browsers render the page, the injected JavaScript executes in the context of the user session."
  },
  {
    "id": 31,
    "topicId": "xss-token-theft-mitigations",
    "category": "Sessions & Cookies",
    "difficulty": "Advanced",
    "question": "What does a Content Security Policy (CSP) directive \"script-src 'self'\" prevent?",
    "options": [
      "It prevents users from typing in form input fields.",
      "It blocks execution of inline scripts (<script>alert(1)</script>) and disallows loading scripts from unauthorized third-party domains.",
      "It forces all CSS styling to be written in Tailwind.",
      "It disables JavaScript in the browser entirely."
    ],
    "correctIndex": 1,
    "explanation": "A strict CSP directive `script-src 'self'` instructs the browser to execute scripts only from the exact same origin and disables arbitrary inline script injection, substantially mitigating XSS exploitation."
  },
  {
    "id": 32,
    "topicId": "cors-preflight-credentials",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "Why does a browser issue an HTTP OPTIONS \"Preflight\" request before sending certain cross-origin API calls?",
    "options": [
      "To test if the internet connection is active.",
      "To check with the target server if the cross-origin method (PUT/DELETE) and custom headers (Authorization) are permitted before sending the actual request.",
      "To verify the server's SSL certificate chain.",
      "To download the server's favicon."
    ],
    "correctIndex": 1,
    "explanation": "For non-simple requests (methods other than GET/POST/HEAD, or custom headers like Authorization), the browser sends an OPTIONS preflight to verify server consent before executing potentially destructive actions."
  },
  {
    "id": 33,
    "topicId": "cors-preflight-credentials",
    "category": "Sessions & Cookies",
    "difficulty": "Advanced",
    "question": "Why will a browser reject an API response if the server responds with Access-Control-Allow-Origin: * when Access-Control-Allow-Credentials: true is set?",
    "options": [
      "Because the browser runs out of memory.",
      "The CORS specification explicitly forbids wildcard origins (*) when credentials (cookies, HTTP auth) are requested, to prevent arbitrary malicious sites from harvesting authenticated user data.",
      "Because wildcard origins are only valid for WebSocket connections.",
      "Because CORS requires an RSA public key when credentials are true."
    ],
    "correctIndex": 1,
    "explanation": "Allowing `*` with credentials would allow any malicious website on the internet to send credentialed requests to your API and read confidential response data. The server must echo the exact allowed origin explicitly."
  },
  {
    "id": 34,
    "topicId": "api-key-management-hashing",
    "category": "Cryptography & Passwords",
    "difficulty": "Intermediate",
    "question": "Why do companies like Stripe prefix developer API keys with readable prefixes like \"sk_live_\" or \"pk_test_\"?",
    "options": [
      "To make them look longer in documentation.",
      "To enable automated secret scanners (e.g. GitHub Secret Scanning) to detect leaked keys instantly and allow routing logic to distinguish key types before database lookups.",
      "Because Base64 encoding requires prefixes to decode properly.",
      "To satisfy legacy RFC 2616 header length requirements."
    ],
    "correctIndex": 1,
    "explanation": "Prefixes allow security tools, regex scanners, and developers to immediately detect leaked production secrets and distinguish public publishable keys from secret keys without querying a database."
  },
  {
    "id": 35,
    "topicId": "api-key-management-hashing",
    "category": "Cryptography & Passwords",
    "difficulty": "Advanced",
    "question": "How should developer API keys be stored in a backend database?",
    "options": [
      "In plaintext so developers can view their full key in the dashboard whenever needed.",
      "Hashed using a one-way cryptographic hash (e.g. SHA-256), storing only the hash and the first few characters (e.g. sk_live_...4f2a) for display.",
      "Encoded in Base64.",
      "Encrypted with the user's password."
    ],
    "correctIndex": 1,
    "explanation": "API keys act like passwords for servers. Storing one-way SHA-256 hashes ensures that if the database is leaked or accessed by employees, the raw API keys cannot be stolen."
  },
  {
    "id": 36,
    "topicId": "distributed-session-stores-redis",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "What problem occurs when storing session data in single-server memory (e.g. Node.js memory) when horizontally scaling backend API instances?",
    "options": [
      "The database crashes from too many idle connections.",
      "Subsequent requests routed to different server instances by the load balancer cannot find the session, forcing the user to log in repeatedly.",
      "The server runs out of disk space.",
      "The browser rejects all incoming cookies."
    ],
    "correctIndex": 1,
    "explanation": "In-memory session state is isolated to one server. If Server A logs the user in, but the load balancer routes the next request to Server B, Server B has no record of the session unless shared storage is used."
  },
  {
    "id": 37,
    "topicId": "distributed-session-stores-redis",
    "category": "Sessions & Cookies",
    "difficulty": "Advanced",
    "question": "Why is Redis preferred over relational databases (PostgreSQL/MySQL) for distributed session storage?",
    "options": [
      "Redis doesn't require network connections.",
      "Redis provides in-memory sub-millisecond key-value lookups with native TTL (Time-To-Live) expiration, automatically cleaning up expired sessions without cron jobs.",
      "Redis guarantees ACID transactions across 50 data centers simultaneously.",
      "Redis encrypts data using quantum-resistant algorithms by default."
    ],
    "correctIndex": 1,
    "explanation": "Sessions are read on virtually every single HTTP request. Redis provides ultra-low latency RAM lookups and automatically purges expired sessions via native key TTL."
  },
  {
    "id": 38,
    "topicId": "mtls-zero-trust-service-auth",
    "category": "Cryptography & Passwords",
    "difficulty": "Advanced",
    "question": "How does Mutual TLS (mTLS) differ from standard HTTPS / TLS?",
    "options": [
      "mTLS uses 512-bit keys instead of 256-bit keys.",
      "In standard TLS, only the server proves its identity with an X.509 certificate; in mTLS, BOTH the client and the server present and verify X.509 certificates issued by a trusted Private CA.",
      "mTLS does not encrypt traffic, it only authenticates.",
      "mTLS is designed exclusively for home Wi-Fi networks."
    ],
    "correctIndex": 1,
    "explanation": "mTLS enforces bidirectional cryptographic identity. In Zero Trust service meshes (Istio, Linkerd), every microservice verifies the caller's client certificate before accepting TCP connections."
  },
  {
    "id": 39,
    "topicId": "mtls-zero-trust-service-auth",
    "category": "Cryptography & Passwords",
    "difficulty": "Expert",
    "question": "Why is mTLS considered superior to Bearer tokens for internal Service-to-Service authentication in high-security architectures?",
    "options": [
      "mTLS is immune to token exfiltration because authentication is bound to the TLS connection handshake and private key possession, rather than an easily replayable bearer string in an HTTP header.",
      "mTLS requires no certificates or keys.",
      "mTLS works over UDP without handshakes.",
      "mTLS removes the need for firewalls."
    ],
    "correctIndex": 0,
    "explanation": "Bearer tokens can be intercepted or accidentally logged in proxy access logs and replayed by an attacker. mTLS requires proving possession of a private key during the cryptographic TLS handshake."
  },
  {
    "id": 40,
    "topicId": "oauth-scopes-fine-grained-permissions",
    "category": "Authorization & RBAC",
    "difficulty": "Beginner",
    "question": "What is the Principle of Least Privilege in authentication and access control?",
    "options": [
      "Always give users root/admin access so they can troubleshoot issues.",
      "Every user, program, or service should be granted only the minimum necessary permissions required to perform its designated task.",
      "Never allow users to change their passwords.",
      "Restrict API access to daytime hours only."
    ],
    "correctIndex": 1,
    "explanation": "Least Privilege minimizes the blast radius of a security compromise. If an application only needs to read profile info, it should never be granted scopes to modify account settings."
  },
  {
    "id": 41,
    "topicId": "oauth-scopes-fine-grained-permissions",
    "category": "Authorization & RBAC",
    "difficulty": "Intermediate",
    "question": "What is the semantic difference between OAuth 2.0 \"Scopes\" and internal user \"Permissions\"?",
    "options": [
      "Scopes are for databases; permissions are for web pages.",
      "Scopes represent authorization boundaries consented to by the user for a third-party app (e.g. read:email); internal permissions define what the user themselves is actually allowed to perform in the system.",
      "Scopes are numeric codes; permissions are text strings.",
      "There is no difference; they are exact synonyms in RFC 6749."
    ],
    "correctIndex": 1,
    "explanation": "Scopes act as an attenuation mask. If an admin user authorizes an app with scope \"read:reports\", the token can only read reports, even though the user themselves has permission to delete the database."
  },
  {
    "id": 42,
    "topicId": "rate-limiting-brute-force-protection",
    "category": "Resilience & Defense",
    "difficulty": "Intermediate",
    "question": "What is Credential Stuffing, and how does it differ from a standard dictionary brute-force attack?",
    "options": [
      "Credential stuffing physically steals server RAM.",
      "Credential stuffing uses automated scripts to test millions of username/password pairs leaked from other websites, exploiting human password reuse across services.",
      "Credential stuffing cracks passwords using quantum decryption.",
      "Credential stuffing only targets government servers."
    ],
    "correctIndex": 1,
    "explanation": "Because millions of users reuse the exact same password on multiple services, attackers take data breach dumps from one site and systematically test those credentials against other popular platforms."
  },
  {
    "id": 43,
    "topicId": "rate-limiting-brute-force-protection",
    "category": "Resilience & Defense",
    "difficulty": "Advanced",
    "question": "Why should account lockout mechanisms avoid indefinitely locking accounts solely based on failed login attempts from any IP address?",
    "options": [
      "Because databases cannot record failed logins.",
      "Because an attacker can deliberately trigger failed logins for an executive or VIP username to cause a permanent Denial of Service (Denial of Login) attack.",
      "Because users will sue the company if locked out.",
      "Because account lockout weakens password hashing algorithms."
    ],
    "correctIndex": 1,
    "explanation": "Naïve account lockout turns into an easy DoS vector. Best practice combines IP-based exponential backoff, CAPTCHA challenges, and sending secure email unlock tokens rather than permanently locking the account."
  },
  {
    "id": 44,
    "topicId": "security-headers-hsts-csp-permissions",
    "category": "Sessions & Cookies",
    "difficulty": "Beginner",
    "question": "What does the HTTP response header \"Strict-Transport-Security: max-age=31536000; includeSubDomains\" (HSTS) instruct the browser to do?",
    "options": [
      "Delete all user cookies after one year.",
      "Enforce that the browser must communicate with the domain exclusively over HTTPS, automatically upgrading all HTTP requests before sending network packets.",
      "Disable JavaScript execution on all subdomains.",
      "Block all incoming search engine crawlers."
    ],
    "correctIndex": 1,
    "explanation": "HSTS prevents SSL-stripping man-in-the-middle attacks. Once received, the browser will never attempt an insecure HTTP connection to that domain for the specified max-age duration."
  },
  {
    "id": 45,
    "topicId": "security-headers-hsts-csp-permissions",
    "category": "Sessions & Cookies",
    "difficulty": "Intermediate",
    "question": "What attack vector does the header \"X-Content-Type-Options: nosniff\" prevent?",
    "options": [
      "SQL Injection in form inputs.",
      "MIME-type sniffing attacks, where a browser tries to execute a user-uploaded image (.jpg) containing hidden JavaScript as executable script or HTML.",
      "Denial of Service attacks.",
      "DNS cache poisoning."
    ],
    "correctIndex": 1,
    "explanation": "If a user uploads a malicious script disguised as a photo, legacy browsers might \"sniff\" the bytes and execute it. `nosniff` forces the browser to strictly honor the declared Content-Type header."
  },
  {
    "id": 46,
    "topicId": "jwt-structure-rs256-vs-hs256",
    "category": "JWT & Signatures",
    "difficulty": "Advanced",
    "question": "What does the standard JWT claim \"aud\" (Audience) enforce, and what security risk arises if an API fails to validate it?",
    "options": [
      "It records the audio volume of the user device.",
      "It identifies the intended recipients of the JWT; without validation, an access token issued for Service A could be forwarded and accepted by Service B as a valid authorization credential.",
      "It records the user's physical GPS coordinates.",
      "It defines the font family used to render user names."
    ],
    "correctIndex": 1,
    "explanation": "The Audience claim ensures tokens cannot be misused across different resource servers. If Service B does not verify `aud === \"https://service-b.corp.io\"`, an attacker who legitimately holds a token for Service A can replay it against Service B."
  },
  {
    "id": 47,
    "topicId": "token-revocation-blacklisting",
    "category": "JWT & Signatures",
    "difficulty": "Expert",
    "question": "What is a Redis Bloom Filter, and why is it used for high-throughput JWT revocation checks?",
    "options": [
      "A graphics rendering filter for user avatars.",
      "A space-efficient probabilistic data structure that can test whether a token JTI is in the revocation set with zero false negatives and sub-millisecond RAM lookups.",
      "An encryption algorithm used to sign JWTs.",
      "A tool to rotate SSL certificates."
    ],
    "correctIndex": 1,
    "explanation": "Storing millions of revoked token IDs (JTIs) in a standard hash set consumes massive RAM. A Bloom Filter uses a tiny fraction of memory to determine if a token is definitely not revoked, eliminating expensive lookups for 99.9% of requests."
  },
  {
    "id": 48,
    "topicId": "oauth2-pkce-flow-security",
    "category": "OAuth & OIDC",
    "difficulty": "Advanced",
    "question": "What is \"Refresh Token Rotation\", and how does it detect token theft?",
    "options": [
      "Rotating the token color in the user interface every 10 seconds.",
      "Every time a refresh token is used, the server invalidates it and issues a brand-new refresh token; if an invalidated token is ever presented again, the server detects compromise and revokes the entire token family.",
      "Replacing refresh tokens with static passwords.",
      "Forcing users to re-type their password every 5 minutes."
    ],
    "correctIndex": 1,
    "explanation": "With Refresh Token Rotation, each refresh token is strictly single-use. If an attacker and a legitimate user both attempt to use the same refresh token, the server immediately detects reuse and terminates the entire session."
  },
  {
    "id": 49,
    "topicId": "webauthn-passkeys-fido2",
    "category": "Cryptography & Passwords",
    "difficulty": "Advanced",
    "question": "In WebAuthn authentication, what is the purpose of the \"Authenticator Data Sign Count\" (counter) verified by the server?",
    "options": [
      "To charge the user per login.",
      "To detect cloned authenticators; if the incoming sign counter is less than or equal to the previously recorded counter, the private key has been cloned and access is denied.",
      "To measure biometric response latency.",
      "To determine how many devices a user owns."
    ],
    "correctIndex": 1,
    "explanation": "Hardware authenticators increment an internal signature counter with every assertion. If an attacker manages to clone the hardware token state, the server detects the counter running backwards or repeating and blocks the session."
  },
  {
    "id": 50,
    "topicId": "mtls-zero-trust-service-auth",
    "category": "Cryptography & Passwords",
    "difficulty": "Expert",
    "question": "In a Zero Trust microservice architecture, why is network perimeter defense (VPC/Firewalls) alone considered insufficient without identity-based mTLS and token authorization?",
    "options": [
      "Because firewalls slow down CPU performance by 50%.",
      "Because once an attacker or insider breaches any single container or VPN entry point, an unauthenticated internal network allows unhindered lateral movement to all databases and APIs.",
      "Because firewalls do not support IPv6.",
      "Because modern web browsers do not work inside VPCs."
    ],
    "correctIndex": 1,
    "explanation": "Zero Trust assumes the internal network is already hostile (\"Never Trust, Always Verify\"). Perimeter firewalls cannot protect against lateral movement from compromised microservices; every single inter-service call must be cryptographically authenticated."
  }
];
