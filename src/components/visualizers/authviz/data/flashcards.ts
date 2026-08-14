export interface AuthFlashcard {
  id: string;
  category: 'OAuth & OIDC' | 'JWT & Cryptography' | 'Web Storage & Cookies' | 'Authorization & Access Control';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const AUTH_FLASHCARDS: AuthFlashcard[] = [
  {
    id: 'af-1',
    category: 'OAuth & OIDC',
    difficulty: 'Senior',
    question: 'How does the PKCE (Proof Key for Code Exchange) flow protect Single Page Apps from Authorization Code interception?',
    answer: 'The client creates a random Code Verifier and sends its SHA-256 hash (Code Challenge) to the /authorize endpoint. When the user logs in and the Auth Code is returned, an attacker intercepting the code cannot exchange it for tokens because they do not know the original secret Code Verifier string, which never left the legitimate client browser memory.',
    code: `// Code Challenge = Base64Url(SHA256(CodeVerifier))
code_challenge_method = "S256"`,
    tip: 'PKCE completely replaces the deprecated Implicit Grant flow in OAuth 2.1.'
  },
  {
    id: 'af-2',
    category: 'JWT & Cryptography',
    difficulty: 'Senior',
    question: 'What is the "None" algorithm vulnerability in JWT libraries, and how do you prevent it?',
    answer: 'Some vulnerable JWT libraries accepted tokens with the header {"alg": "none"}, treating them as unsigned tokens and skipping signature verification entirely. An attacker could forge an {"role": "admin"} payload and omit the signature. Prevention requires explicitly passing a whitelist of accepted algorithms (e.g. algorithms: ["RS256"]) during jwt.verify().',
    code: `// Enforce whitelist:
jwt.verify(token, pubKey, { algorithms: ['RS256'] });`,
    tip: 'Never rely on the header alg property to decide which verification algorithm to execute.'
  },
  {
    id: 'af-3',
    category: 'Web Storage & Cookies',
    difficulty: 'Mid',
    question: 'Why should refresh tokens be stored in HttpOnly cookies rather than LocalStorage?',
    answer: 'LocalStorage is accessible to all JavaScript running on the origin domain. If a third-party npm package, analytics script, or XSS flaw executes malicious JavaScript, it can instantly steal the token with localStorage.getItem("token"). HttpOnly cookies cannot be read by JavaScript (document.cookie), making XSS token theft impossible.',
    code: `Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict`,
    tip: 'Pair HttpOnly cookies with SameSite=Lax/Strict to prevent CSRF cross-origin attacks.'
  },
  {
    id: 'af-4',
    category: 'JWT & Cryptography',
    difficulty: 'Senior',
    question: 'Why is Argon2id the OWASP-recommended standard for password hashing over SHA-256?',
    answer: 'SHA-256 is designed for fast file checksums; modern GPUs can calculate over 100 billion SHA-256 hashes per second, making brute-force dictionary attacks trivial. Argon2id is a memory-hard function that requires tens of megabytes of RAM per hash calculation, making GPU, FPGA, and ASIC hardware cracking clusters prohibitively slow and expensive.',
    code: `argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536 })`,
    tip: 'Argon2id won the Password Hashing Competition (PHC) due to its resistance against GPU cracking and side-channel timing attacks.'
  }
];
