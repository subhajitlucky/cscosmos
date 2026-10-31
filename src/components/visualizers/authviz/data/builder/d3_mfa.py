topics = [
  # 9. MFA TOTP & HOTP
  {
    "id": "mfa-totp-hotp-rfc6238",
    "title": "Multi-Factor Authentication: TOTP (RFC 6238), HOTP (RFC 4226) & Emergency Backup Codes",
    "category": "cryptography-passwords",
    "difficulty": "Intermediate",
    "summary": "Time-Based One-Time Passwords (TOTP, RFC 6238) compute short-lived 6-digit codes by hashing the current Unix epoch time block with a shared Base32 secret using HMAC-SHA1. Defenses require replay prevention, clock drift tolerance (+/- 1 step), and hashed emergency backup recovery codes.",
    "whyExists": "Passwords are frequently stolen via phishing, breaches, and malware. Multi-Factor Authentication (MFA) requires proving possession of a physical authenticator device. Even if an attacker learns the password, they cannot generate the rotating 30-second cryptographic passcode.",
    "mentalModel": "The Synchronized Clock Safe: Both you and the bank possess identical copies of an encrypted codebook and perfectly synchronized wristwatches. Every 30 seconds, you turn to the page matching the current minute to read a temporary 6-digit access code.",
    "architectureDiagram": """[ User Phone (Google Authenticator) ]         [ CosmosApp Server ]
                  │                                           │
   Shared Secret: │ JBSWY3DPEHPK3PXP          Shared Secret:  │ JBSWY3DPEHPK3PXP
   Current Time:  │ T = Math.floor(now / 30)  Current Time:   │ T = Math.floor(now / 30)
   HMAC-SHA1:     │ hash(Secret, T)           HMAC-SHA1:      │ hash(Secret, T)
   Dynamic Trunc: │ 6-digit Code: 482910      Expected Code:  │ 482910
                  │                                           │
                  ├── (1) Submits code: 482910 ──────────────►│
                  │                                           ├── Verify Code == Expected
                  │                                           ├── Check Replay Cache in Redis
                  │                                           │   (Prevent reuse in same 30s window)
                  │◄── (2) 200 OK (MFA Verified) ─────────────┤""",
    "cosmosAppStory": "CosmosApp introduces MFA for sensitive workspace settings. When Bob enables 2FA, CosmosApp generates a 160-bit crypto secret and displays a QR code formatted as otpauth://totp/CosmosApp:bob@cosmos.io?secret=JBSWY3DPEHPK3PXP. Bob scans it with his authenticator app. CosmosApp provides 10 single-use emergency backup codes hashed with Argon2id for account recovery.",
    "stepByStep": [
      "Step 1: Server generates a 20-byte cryptographically secure random secret, encoded in Base32.",
      "Step 2: Server renders an otpauth:// URI in a QR code for the authenticator app to scan.",
      "Step 3: User inputs the currently displayed 6-digit code to prove synchronization before MFA activation.",
      "Step 4: Server computes HMAC-SHA1(secret, floor(now / 30)) and dynamically truncates to 6 digits.",
      "Step 5: If code matches within +/- 1 time step (allowing 30s clock drift), MFA is enabled.",
      "Step 6: The used code is stored in Redis with a 60-second TTL to prevent replay attacks during the same time window."
    ],
    "misconceptions": [
      "TOTP requires an internet connection on the authenticator app (TOTP is completely offline; it depends only on the shared secret and Unix timestamp).",
      "SMS OTP is just as secure as TOTP (SMS is vulnerable to SIM-swapping, SS7 interception, and telecom social engineering; TOTP is stored in local device memory)."
    ],
    "codeSnippet": """import crypto from 'node:crypto';

// CosmosApp TOTP Verification Algorithm (RFC 6238):
export function generateTotp(secretBase32: string, timeStepWindow = 0): string {
  const secret = Buffer.from(base32Decode(secretBase32));
  const timeStep = Math.floor(Date.now() / 1000 / 30) + timeStepWindow;
  
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(timeStep));

  // 1. Compute HMAC-SHA1
  const hmac = crypto.createHmac('sha1', secret).update(timeBuffer).digest();

  // 2. Dynamic Truncation (Extract 4 bytes starting at offset)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  // 3. Modulo 1,000,000 for 6-digit code
  const otp = (binary % 1_000_000).toString().padStart(6, '0');
  return otp;
}""",
    "takeaways": [
      "TOTP relies purely on a shared secret and synchronized Unix timestamps, functioning entirely offline.",
      "Always store consumed codes in a short-lived cache (Redis) to prevent code replay within the 30-second window.",
      "Provide users with single-use, hashed emergency backup codes to ensure account recovery if their device is lost."
    ],
    "commonPitfall": {
      "mistake": "Failing to check for code reuse within the same 30-second time window, allowing an attacker who intercepts the code to replay it.",
      "fix": "Record consumed OTP codes in Redis with a 90-second expiration and reject duplicate submissions."
    },
    "knowledgeCheck": {
      "question": "Why does a TOTP authenticator app like Google Authenticator work even when the mobile phone has zero network or internet connection?",
      "answer": "TOTP is mathematically computed locally from the stored shared secret and the phone's internal hardware clock, requiring no network communication."
    },
    "nextTopicId": "webauthn-passkeys-fido2"
  },
  # 10. WebAuthn & FIDO2 Passkeys
  {
    "id": "webauthn-passkeys-fido2",
    "title": "WebAuthn & FIDO2: Biometric Hardware Passkeys, Secure Enclaves & Phishing Defense",
    "category": "cryptography-passwords",
    "difficulty": "Expert",
    "summary": "WebAuthn (FIDO2) replaces shared secrets with asymmetric public-key cryptography bound to hardware security modules (Apple Secure Enclave, YubiKey, Windows Hello). Because the browser hardware cryptographically signs the origin domain, passkeys are mathematically immune to phishing.",
    "whyExists": "Phishing sites (e.g., evil-bank.com disguised as bank.com) can trick users into typing passwords and even TOTP 6-digit codes. WebAuthn eliminates this threat: the browser signs challenges using an asymmetric key pair strictly scoped to the relying party's domain (RP ID). The hardware will never sign for a phishing domain.",
    "mentalModel": "The Royal Signet Ring with Built-In GPS: Unlike passwords (which you speak aloud to anyone who asks), a Passkey is a signet ring built into your laptop's secure silicon. It verifies the GPS location and building blueprint (origin domain) of the requesting entity before embossing its cryptographic stamp.",
    "architectureDiagram": """[ Browser / TouchID Secure Enclave ]              [ CosmosApp Server (RP) ]
                 │                                            │
                 │◄── (1) GET /auth/challenge (random 32b) ───┤
                 │                                            │
  1. Check Origin: 'cosmos.app' matches rpId?                 │
  2. Prompt TouchID / Fingerprint                             │
  3. Sign challenge using Hardware Private Key                │
                 │                                            │
                 ├── (2) POST /auth/verify ──────────────────►│
                 │   { authenticatorData, clientDataJSON,     │
                 │     signature }                            │
                 │                                            ├── Verify Signature with Alice's Public Key
                 │                                            ├── Verify Origin == 'https://cosmos.app'
                 │                                            ├── Verify Challenge == session.challenge
                 │◄── (3) 200 OK (Phishing-Proof Login) ──────┤""",
    "cosmosAppStory": "CosmosApp implements WebAuthn Passkeys. Alice registers her MacBook's TouchID. The Secure Enclave creates an asymmetric P-256 key pair, sending only the public key to CosmosApp. When logging in, CosmosApp sends a cryptographic challenge. Alice taps TouchID; the hardware signs the challenge. An attacker spoofing CosmosApp on fake-cosmos.app cannot prompt the passkey because the browser validates the origin.",
    "stepByStep": [
      "Step 1: Client requests registration or authentication options from server.",
      "Step 2: Server generates a cryptographically random challenge and stores it in the user's session.",
      "Step 3: Client invokes navigator.credentials.create() or navigator.credentials.get().",
      "Step 4: Device authenticates user via biometrics or PIN and signs the challenge with the hardware private key.",
      "Step 5: Client transmits the signed assertion (authenticatorData, clientDataJSON, signature) to server.",
      "Step 6: Server verifies the signature using the stored public key, validates the origin and RP ID, and checks the challenge."
    ],
    "misconceptions": [
      "Biometric data (fingerprint/face) is sent to the server (Biometric data never leaves the local Secure Enclave; only a digital signature is sent).",
      "Passkeys can be stolen if the server database is breached (The server stores only public keys; public keys cannot be used to forge authentication signatures)."
    ],
    "codeSnippet": """import { verifyAuthenticationResponse } from '@simplewebauthn/server';

// CosmosApp WebAuthn Verification:
export async function verifyPasskeyLogin(req: Request, userPasskey: PasskeyCredential) {
  const body = await req.json();
  const expectedChallenge = await getSessionChallenge(req);

  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge,
    expectedOrigin: 'https://cosmos.app',
    expectedRPID: 'cosmos.app',
    authenticator: {
      credentialPublicKey: userPasskey.publicKey,
      credentialID: userPasskey.id,
      counter: userPasskey.counter,
    },
  });

  if (!verification.verified) throw new Error('Passkey verification failed');

  // Update signature counter to prevent replay
  await updateCredentialCounter(userPasskey.id, verification.authenticationInfo.newCounter);
  return { success: true };
}""",
    "takeaways": [
      "WebAuthn passkeys are mathematically phishing-resistant because private keys are hardware-bound and origin-scoped.",
      "Servers only store public keys, completely neutralizing the risk of credential theft via database leaks.",
      "Always enforce signature counters to detect and prevent cloned hardware authenticators."
    ],
    "commonPitfall": {
      "mistake": "Failing to verify the origin and RP ID on the server, allowing an attacker to relay assertions from other domains.",
      "fix": "Strictly validate that clientDataJSON.origin matches the exact domain and protocol of the application."
    },
    "knowledgeCheck": {
      "question": "Why are WebAuthn passkeys completely immune to phishing attacks, unlike passwords and TOTP codes?",
      "answer": "The browser checks the Relying Party ID (domain name) before triggering the hardware authenticator; the private key will never sign an assertion for a spoofed phishing domain."
    },
    "nextTopicId": "oauth2-core-framework-roles"
  }
]
