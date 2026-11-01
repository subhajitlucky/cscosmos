// 52 Comprehensive Practice Questions for Web Security (XSS, CSRF, CSP, CORS)
// Ordered pedagogically across Beginner, Intermediate, and Advanced difficulties.

export interface SecurityProblem {
  id: number;
  topicId: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SECURITY_CATEGORIES = [
  { id: 'same-origin-policy', name: 'Same-Origin Policy (SOP)' },
  { id: 'cors-architecture', name: 'CORS' },
  { id: 'xss-cross-site-scripting', name: 'Cross-Site Scripting (XSS)' },
  { id: 'csrf-and-samesite', name: 'CSRF & Anti-Forgery' },
  { id: 'content-security-policy', name: 'Content Security Policy (CSP)' },
  { id: 'cookie-security-architecture', name: 'Cookie Security & SameSite' },
  { id: 'clickjacking-defense', name: 'Clickjacking & Framing' },
  { id: 'modern-web-defense-stack', name: 'Defense-in-Depth & Headers' },
];

export const SECURITY_PROBLEMS: SecurityProblem[] = [
  // --- 1. Same-Origin Policy (SOP) ---
  {
    id: 1,
    topicId: 'same-origin-policy',
    category: 'Same-Origin Policy (SOP)',
    difficulty: 'Beginner',
    question: 'Which three components define an Origin according to the W3C / WHATWG specification?',
    options: [
      'Scheme (protocol), Host (domain), and Port',
      'Protocol, Domain name, and URL Path',
      'Host, IP address, and Subnet mask',
      'Domain name, Port, and Query parameters'
    ],
    correctIndex: 0,
    explanation: 'An origin is uniquely determined by the tuple of URI scheme (e.g. https), hostname (e.g. example.com), and port number (e.g. 443). Path and query strings are ignored when comparing origins.'
  },
  {
    id: 2,
    topicId: 'same-origin-policy',
    category: 'Same-Origin Policy (SOP)',
    difficulty: 'Beginner',
    question: 'Under the Same-Origin Policy, which of the following pairs share the exact SAME origin?',
    options: [
      'http://example.com:80 and https://example.com:443',
      'https://example.com/api/users and https://example.com/profile',
      'https://example.com and https://sub.example.com',
      'http://localhost:3000 and http://localhost:8080'
    ],
    correctIndex: 1,
    explanation: 'Both URLs use the https scheme, the example.com host, and default port 443. Different paths (/api/users vs /profile) do not change the origin.'
  },
  {
    id: 3,
    topicId: 'same-origin-policy',
    category: 'Same-Origin Policy (SOP)',
    difficulty: 'Intermediate',
    question: 'By default, what type of cross-origin interaction does the browser Same-Origin Policy strictly block?',
    options: [
      'Cross-origin embedding of <img> tags',
      'Cross-origin writes via standard HTML form POST submissions',
      'Cross-origin reads of response data via JavaScript fetch() or XMLHttpRequest',
      'Cross-origin navigation when clicking an <a> hyperlink'
    ],
    correctIndex: 2,
    explanation: 'SOP is asymmetric: it freely permits cross-origin writes (form POST, link clicks) and embedding (images, scripts, styles), but strictly prevents scripts from reading cross-origin response bodies or DOM contents.'
  },
  {
    id: 4,
    topicId: 'same-origin-policy',
    category: 'Same-Origin Policy (SOP)',
    difficulty: 'Intermediate',
    question: 'If siteA.com embeds siteB.com inside an <iframe>, what happens if JavaScript on siteA attempts to read document.getElementById on the iframe\'s contentDocument?',
    options: [
      'The browser executes the query if siteB does not send X-Frame-Options.',
      'The browser throws a SecurityError DOMException prohibiting cross-origin DOM access.',
      'The browser prompts the user with an interactive permission dialog.',
      'The read succeeds, but all string values are hashed.'
    ],
    correctIndex: 1,
    explanation: 'The browser strictly isolates iframe DOM trees across different origins. Attempting to access contentDocument or contentWindow.document across origins throws a SecurityError DOMException.'
  },
  {
    id: 5,
    topicId: 'same-origin-policy',
    category: 'Same-Origin Policy (SOP)',
    difficulty: 'Advanced',
    question: 'Why was the historical document.domain setter deprecated and deactivated by default in modern browsers (Chrome 115+)?',
    options: [
      'It caused severe memory leaks in the V8 garbage collector.',
      'It allowed a compromised subdomain (e.g. attacker.example.com) to access sensitive origins (e.g. vault.example.com) by relaxing document.domain to example.com.',
      'It conflicted with HTTP/3 QUIC connection migration.',
      'It prevented Service Workers from caching subresources.'
    ],
    correctIndex: 1,
    explanation: 'Relaxing document.domain allowed any compromised sub-domain to unilaterally lower its origin boundary and inspect the DOM or cookies of any other sibling sub-domain that did the same, completely undermining SOP.'
  },
  {
    id: 6,
    topicId: 'same-origin-policy',
    category: 'Same-Origin Policy (SOP)',
    difficulty: 'Advanced',
    question: 'What is the "Opaque Origin" generated by browsers for sandbox iframes or data: URIs?',
    options: [
      'An encrypted hash of the client IP address.',
      'A special unique origin that does not match any other origin, even itself in another document.',
      'An origin that automatically inherits the parent window\'s credentials.',
      'A temporary origin valid for exactly 60 seconds.'
    ],
    correctIndex: 1,
    explanation: 'An opaque origin is serialized as "null" and is completely unique. It fails all equality checks with any other origin, strictly isolating sandboxed content from accessing storage or network resources.'
  },

  // --- 2. CORS (Cross-Origin Resource Sharing) ---
  {
    id: 7,
    topicId: 'cors-architecture',
    category: 'CORS',
    difficulty: 'Beginner',
    question: 'What is the primary role of CORS in browser security?',
    options: [
      'To prevent attackers from sending requests to backend servers.',
      'To provide a mechanism for servers to explicitly allow browsers to read their responses cross-origin.',
      'To encrypt cross-origin HTTP payload data.',
      'To replace TLS/HTTPS certificates.'
    ],
    correctIndex: 1,
    explanation: 'CORS does not protect servers from receiving requests (requests are often sent anyway); rather, it instructs the browser whether the client-side JavaScript is permitted to inspect the response.'
  },
  {
    id: 8,
    topicId: 'cors-architecture',
    category: 'CORS',
    difficulty: 'Beginner',
    question: 'Which HTTP method is dispatched by the browser during an automatic CORS Preflight check?',
    options: ['HEAD', 'GET', 'OPTIONS', 'TRACE'],
    correctIndex: 2,
    explanation: 'Before dispatching a non-simple cross-origin request, the browser sends an HTTP OPTIONS preflight request to verify allowed methods, headers, and credentials.'
  },
  {
    id: 9,
    topicId: 'cors-architecture',
    category: 'CORS',
    difficulty: 'Intermediate',
    question: 'Which of the following requests is considered a "Simple Request" that DOES NOT trigger a CORS preflight?',
    options: [
      'GET request with Content-Type: application/json',
      'POST request with Content-Type: application/x-www-form-urlencoded and no custom headers',
      'DELETE request with standard authorization bearer header',
      'PUT request with custom X-Client-Version header'
    ],
    correctIndex: 1,
    explanation: 'Simple requests only use GET, HEAD, or POST methods with simple headers and Content-Type restricted to text/plain, multipart/form-data, or application/x-www-form-urlencoded.'
  },
  {
    id: 10,
    topicId: 'cors-architecture',
    category: 'CORS',
    difficulty: 'Intermediate',
    question: 'What critical security vulnerability is introduced if a server dynamically reflects the incoming Origin header and sets Access-Control-Allow-Credentials: true?',
    options: [
      'It breaks SSL/TLS handshakes for mobile clients.',
      'Any malicious website can send credentialed requests and read private user data.',
      'It causes CORS preflight cache exhaustion.',
      'The browser rejects the response with an NS_ERROR_INVALID_HEADER.'
    ],
    correctIndex: 1,
    explanation: 'The browser prohibits `Access-Control-Allow-Origin: *` when credentials are included. However, naively reflecting the `Origin` header bypasses this restriction and allows any arbitrary malicious website to read authenticated user data.'
  },
  {
    id: 11,
    topicId: 'cors-architecture',
    category: 'CORS',
    difficulty: 'Intermediate',
    question: 'What header must the server return if JavaScript needs to read custom response headers like X-RateLimit-Remaining?',
    options: [
      'Access-Control-Allow-Headers',
      'Access-Control-Expose-Headers: X-RateLimit-Remaining',
      'Access-Control-Allow-Origin',
      'Access-Control-Max-Age'
    ],
    correctIndex: 1,
    explanation: 'By default, cross-origin JavaScript can only read CORS-safelisted response headers (Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma). Custom headers require Access-Control-Expose-Headers.'
  },
  {
    id: 12,
    topicId: 'cors-architecture',
    category: 'CORS',
    difficulty: 'Advanced',
    question: 'What is the purpose of the Access-Control-Max-Age response header?',
    options: [
      'Specifies the lifespan of the user session cookie.',
      'Caches the result of the preflight OPTIONS check in seconds so future requests skip the preflight roundtrip.',
      'Forces HTTP/2 stream multiplexing timeout.',
      'Sets the browser HSTS preload timer.'
    ],
    correctIndex: 1,
    explanation: 'Access-Control-Max-Age informs the browser how many seconds it can cache the preflight OPTIONS response, avoiding repeated preflight roundtrips for subsequent requests matching that origin and path.'
  },
  {
    id: 13,
    topicId: 'cors-architecture',
    category: 'CORS',
    difficulty: 'Advanced',
    question: 'Why does a failed CORS check still result in the server processing state-changing operations on non-preflighted POST requests?',
    options: [
      'Because CORS is a server-side firewall protocol.',
      'Because simple POST requests are dispatched immediately; the browser only blocks JS from reading the response when CORS headers are missing.',
      'Because HTTP/1.1 pipelining ignores browser policies.',
      'Because CORS headers are validated on the TCP handshake level.'
    ],
    correctIndex: 1,
    explanation: 'For simple requests, the browser sends the HTTP POST payload immediately. If the server does not return Access-Control-Allow-Origin, the browser conceals the response from JS, but the server has already executed the database change!'
  },

  // --- 3. Cross-Site Scripting (XSS) ---
  {
    id: 14,
    topicId: 'xss-cross-site-scripting',
    category: 'Cross-Site Scripting (XSS)',
    difficulty: 'Beginner',
    question: 'What is the core mechanism of a Cross-Site Scripting (XSS) attack?',
    options: [
      'Overwhelming a web server with high-volume TCP SYN packets.',
      'Injecting malicious client-side JavaScript into a trusted website that executes in victims\' browsers.',
      'Intercepting plain-text Wi-Fi packets on a public hotspot.',
      'Guessing database passwords via brute-force dictionary attacks.'
    ],
    correctIndex: 1,
    explanation: 'XSS occurs when an application includes untrusted, unescaped data in a web page without proper validation or encoding, allowing an attacker to execute arbitrary JavaScript in the victim\'s session context.'
  },
  {
    id: 15,
    topicId: 'xss-cross-site-scripting',
    category: 'Cross-Site Scripting (XSS)',
    difficulty: 'Beginner',
    question: 'What is Stored (Persistent) XSS?',
    options: [
      'Malicious input reflected immediately in a single HTTP response (e.g. search query).',
      'Malicious code stored permanently in the database and delivered to any user viewing that content.',
      'XSS that only executes inside a web worker thread.',
      'Payloads stored in the browser\'s IndexedDB by an offline service worker.'
    ],
    correctIndex: 1,
    explanation: 'Stored XSS happens when malicious payload is saved to the backend database (like forum comments, user bios) and later served to unsuspecting visitors without sanitization.'
  },
  {
    id: 16,
    topicId: 'xss-cross-site-scripting',
    category: 'Cross-Site Scripting (XSS)',
    difficulty: 'Intermediate',
    question: 'What is DOM-based XSS, and how does it differ from Reflected XSS?',
    options: [
      'DOM-based XSS occurs entirely client-side when JS reads untrusted data from a source (e.g. location.hash) into a dangerous sink without hitting the server.',
      'DOM-based XSS only attacks XML parsers on the backend.',
      'DOM-based XSS requires root SSH access to the web server.',
      'There is no difference; DOM-based XSS is an outdated synonym for Reflected XSS.'
    ],
    correctIndex: 0,
    explanation: 'In DOM XSS, the server response is clean; the vulnerability arises client-side when JavaScript code takes an untrusted source (like location.search, location.hash) and writes it into a dangerous sink (like innerHTML, eval).'
  },
  {
    id: 17,
    topicId: 'xss-cross-site-scripting',
    category: 'Cross-Site Scripting (XSS)',
    difficulty: 'Intermediate',
    question: 'Which of the following DOM properties / methods is considered a dangerous sink that can lead to DOM XSS?',
    options: [
      'element.textContent = value',
      'element.innerText = value',
      'element.innerHTML = value',
      'element.setAttribute("title", value)'
    ],
    correctIndex: 2,
    explanation: 'Assigning to element.innerHTML forces the browser HTML parser to parse the string as markup, executing <script> or <img onerror=...> tags. textContent and innerText treat input as harmless literal text.'
  },
  {
    id: 18,
    topicId: 'xss-cross-site-scripting',
    category: 'Cross-Site Scripting (XSS)',
    difficulty: 'Intermediate',
    question: 'Why is simple regex replacement of "<script>" tags insufficient to prevent XSS?',
    options: [
      'Because script tags are case-sensitive.',
      'Attackers can bypass it using alternative tags with event handlers (e.g. <img src=x onerror=alert(1)>), SVG tags, or nested tags (<scr<script>ipt>).',
      'Because modern JavaScript engines execute comments as code.',
      'Because HTTP headers cannot be inspected with regular expressions.'
    ],
    correctIndex: 1,
    explanation: 'Blacklist filtering is notoriously brittle. Attackers use hundreds of alternative HTML injection vectors: event handlers (onload, onerror, onfocus), protocol handlers (javascript:), and malformed nested tokens.'
  },
  {
    id: 19,
    topicId: 'xss-cross-site-scripting',
    category: 'Cross-Site Scripting (XSS)',
    difficulty: 'Advanced',
    question: 'How do W3C Trusted Types defend against DOM-based XSS in modern enterprise applications?',
    options: [
      'They block all CSS style rules loaded from external CDNs.',
      'They lock down DOM sinks so that passing raw strings throws a TypeError; values must be vetted through a cryptographic or sanitizing policy object.',
      'They enforce HTTPS certificates on every DOM node.',
      'They convert all client-side JavaScript into WebAssembly at compile time.'
    ],
    correctIndex: 1,
    explanation: 'Trusted Types require developers to pass typed objects (TrustedHTML, TrustedScriptURL) into dangerous sinks instead of arbitrary strings, preventing unsafe string assignments across the entire application.'
  },
  {
    id: 20,
    topicId: 'xss-cross-site-scripting',
    category: 'Cross-Site Scripting (XSS)',
    difficulty: 'Advanced',
    question: 'If an attacker discovers XSS on an application where session cookies have the HttpOnly flag, what impact can they still achieve?',
    options: [
      'None; HttpOnly completely neutralizes all forms of XSS.',
      'They can steal the user\'s password from the browser autofill, capture keystrokes, exfiltrate localStorage tokens, and perform actions on the user\'s behalf via fetch.',
      'They can only read the user\'s local IP address.',
      'They can modify the server\'s TLS configuration.'
    ],
    correctIndex: 1,
    explanation: 'HttpOnly prevents document.cookie theft, but an attacker with arbitrary JS execution can still dispatch authenticated requests (cookies are attached automatically by the browser), keylog input fields, and modify UI contents.'
  },

  // --- 4. CSRF & State Management ---
  {
    id: 21,
    topicId: 'csrf-and-samesite',
    category: 'CSRF & Anti-Forgery',
    difficulty: 'Beginner',
    question: 'What is Cross-Site Request Forgery (CSRF)?',
    options: [
      'An attack that tricks a victim\'s browser into executing unwanted actions on an application where they are currently authenticated.',
      'An attack that alters DNS records to redirect traffic.',
      'Stealing SSL private keys from the host server.',
      'Exploiting buffer overflows in the browser rendering engine.'
    ],
    correctIndex: 0,
    explanation: 'CSRF exploits the ambient authority of the browser: when a victim visits evil.com, evil.com submits a form targeting target.com, and the browser automatically includes target.com\'s session cookies.'
  },
  {
    id: 22,
    topicId: 'csrf-and-samesite',
    category: 'CSRF & Anti-Forgery',
    difficulty: 'Beginner',
    question: 'Why does the browser automatically attach cookies on cross-site requests by default in legacy web architecture?',
    options: [
      'To verify the hardware serial number of the client.',
      'Cookies are historically scoped to the destination domain regardless of which website originated the HTTP request.',
      'It was a bug introduced in Netscape Navigator that cannot be removed.',
      'Because TCP handshakes demand session state.'
    ],
    correctIndex: 1,
    explanation: 'Historically, cookies were scoped strictly by destination domain. The browser viewed every request to target.com as belonging to target.com, attaching all matching cookies without considering origin context.'
  },
  {
    id: 23,
    topicId: 'csrf-and-samesite',
    category: 'CSRF & Anti-Forgery',
    difficulty: 'Intermediate',
    question: 'How does the Synchronizer Token Pattern (Anti-CSRF token) protect against CSRF attacks?',
    options: [
      'It encrypts the entire HTTP body with AES-256.',
      'The server generates a unique, unpredictable token bound to the user session; evil.com cannot read or guess it due to the Same-Origin Policy.',
      'It disables JavaScript execution on foreign origins.',
      'It forces the browser to prompt the user for their PIN on every POST.'
    ],
    correctIndex: 1,
    explanation: 'Because evil.com cannot read target.com\'s DOM or response due to SOP, it cannot learn the unpredictable CSRF token. When evil.com submits a forged form, the request lacks the valid token and the server rejects it.'
  },
  {
    id: 24,
    topicId: 'csrf-and-samesite',
    category: 'CSRF & Anti-Forgery',
    difficulty: 'Intermediate',
    question: 'How does the Double Submit Cookie pattern work for stateless APIs?',
    options: [
      'The client stores two identical cookies on different subdomains.',
      'The server sets a random token in a cookie; the client reads it via JS and sends it in a custom header (e.g. X-CSRF-Token); the server verifies cookie and header match.',
      'The browser sends two simultaneous POST requests to verify checksums.',
      'The client sends the user password twice.'
    ],
    correctIndex: 1,
    explanation: 'In Double Submit, the server doesn\'t store token state. An attacker on evil.com cannot read the cookie due to SOP, so they cannot copy the cookie value into the required custom request header.'
  },
  {
    id: 25,
    topicId: 'csrf-and-samesite',
    category: 'CSRF & Anti-Forgery',
    difficulty: 'Advanced',
    question: 'What is a "Login CSRF" attack?',
    options: [
      'An attacker uses automated bots to guess passwords on the login form.',
      'An attacker tricks a victim into authenticating into the ATTACKER\'S account, allowing the attacker to monitor or capture subsequent activity (e.g. stored search history or payment cards).',
      'An attacker intercepts TLS packets during the initial login exchange.',
      'An attacker bypasses two-factor authentication via SIM swapping.'
    ],
    correctIndex: 1,
    explanation: 'In Login CSRF, the attacker crafts a forged request that signs the victim into the attacker\'s credentials. The victim then uploads sensitive files or credit card info into an account controlled by the attacker.'
  },
  {
    id: 26,
    topicId: 'csrf-and-samesite',
    category: 'CSRF & Anti-Forgery',
    difficulty: 'Advanced',
    question: 'What is the modern Sec-Fetch-Site request header, and how does it stop CSRF?',
    options: [
      'A header that disables browser caching on cross-origin requests.',
      'A Fetch Metadata header automatically set by the browser indicating the relationship between the initiator\'s origin and the target ("same-origin", "cross-site", "same-site"); servers can reject cross-site state mutations.',
      'A header that verifies cryptographic hardware signatures.',
      'A header that stores the TLS handshake version.'
    ],
    correctIndex: 1,
    explanation: 'Sec-Fetch-Site is part of Fetch Metadata headers. Because it is set by the browser and cannot be modified by JavaScript, a server can simply drop any POST request where `Sec-Fetch-Site === "cross-site"`.'
  },

  // --- 5. Content Security Policy (CSP) ---
  {
    id: 27,
    topicId: 'content-security-policy',
    category: 'Content Security Policy (CSP)',
    difficulty: 'Beginner',
    question: 'How is a Content Security Policy (CSP) communicated from the web server to the browser?',
    options: [
      'Via the Content-Security-Policy HTTP response header or a <meta http-equiv="Content-Security-Policy"> tag',
      'Via the robots.txt file in the server root',
      'Via an entry in the DNS TXT record',
      'Via the TLS certificate Common Name field'
    ],
    correctIndex: 0,
    explanation: 'CSP is primarily delivered via the Content-Security-Policy HTTP response header, and can also be defined inside the HTML <head> via <meta http-equiv="Content-Security-Policy" content="...">.'
  },
  {
    id: 28,
    topicId: 'content-security-policy',
    category: 'Content Security Policy (CSP)',
    difficulty: 'Beginner',
    question: 'What does the default-src directive in a Content Security Policy do?',
    options: [
      'Defines the fallback policy for resource types that are not explicitly specified in the CSP.',
      'Restricts the default gateway router IP address.',
      'Defines the default homepage URL when a 404 occurs.',
      'Overrides all other specific directives even when declared.'
    ],
    correctIndex: 0,
    explanation: 'default-src serves as the fallback for most fetch directives (such as script-src, style-src, img-src, connect-src, font-src) when they are not explicitly declared.'
  },
  {
    id: 29,
    topicId: 'content-security-policy',
    category: 'Content Security Policy (CSP)',
    difficulty: 'Intermediate',
    question: 'By default, does Content-Security-Policy: default-src \'self\' allow inline <script> tags to execute?',
    options: [
      'Yes, inline scripts are always allowed.',
      'No, CSP blocks all inline scripts unless \'unsafe-inline\' or a matching cryptographic nonce/hash is declared.',
      'Yes, but only if the script is shorter than 256 bytes.',
      'Only if the inline script is executed within an onload event.'
    ],
    correctIndex: 1,
    explanation: 'One of CSP\'s most powerful defenses is blocking inline scripts by default. Without \'unsafe-inline\' or a valid nonce/hash, the browser refuses to execute inline code, mitigating reflected and stored XSS.'
  },
  {
    id: 30,
    topicId: 'content-security-policy',
    category: 'Content Security Policy (CSP)',
    difficulty: 'Intermediate',
    question: 'How does a CSP Cryptographic Nonce work to safely permit specific inline scripts?',
    options: [
      'The server generates a cryptographically random, single-use token per HTTP response (e.g. nonce-xyz), includes it in the CSP header, and only scripts with matching attribute <script nonce="xyz"> can run.',
      'The browser calculates the MD5 hash of the server domain name.',
      'The nonce is stored in a permanent cookie across all user sessions.',
      'The server signs the script with an SSH private key.'
    ],
    correctIndex: 0,
    explanation: 'A nonce (number used once) must be unpredictable and unique for each HTTP request. Attackers injecting scripts via XSS cannot guess the nonce for that specific request, preventing their injected tags from running.'
  },
  {
    id: 31,
    topicId: 'content-security-policy',
    category: 'Content Security Policy (CSP)',
    difficulty: 'Intermediate',
    question: 'What is the purpose of Content-Security-Policy-Report-Only?',
    options: [
      'It creates an encrypted audit log saved to the client SSD.',
      'It monitors and reports policy violations to a reporting endpoint without blocking any resources or scripts, ideal for testing policies before enforcement.',
      'It disables CSP on developer workstations.',
      'It blocks resources but suppresses all browser console error messages.'
    ],
    correctIndex: 1,
    explanation: 'Content-Security-Policy-Report-Only allows teams to test aggressive CSP rules in production without breaking user experience, sending violation JSON telemetry to a collector endpoint.'
  },
  {
    id: 32,
    topicId: 'content-security-policy',
    category: 'Content Security Policy (CSP)',
    difficulty: 'Advanced',
    question: 'What does the \'strict-dynamic\' keyword in script-src do in CSP Level 3?',
    options: [
      'It disables all dynamic imports via import().',
      'It allows scripts that were authorized by a valid nonce to dynamically load and append additional child scripts to the DOM without requiring nonces on the children.',
      'It prohibits the use of Object.defineProperty.',
      'It forces all JavaScript to run in strict mode (\'use strict\').'
    ],
    correctIndex: 1,
    explanation: '\'strict-dynamic\' simplifies modern module bundling: once a root script executes because it has a valid nonce, trust cascades to any child script it programmatically inserts via document.createElement(\'script\').'
  },
  {
    id: 33,
    topicId: 'content-security-policy',
    category: 'Content Security Policy (CSP)',
    difficulty: 'Advanced',
    question: 'Why is domain allowlisting (e.g. script-src https://*.googleapis.com) considered brittle and often insecure in modern CSP?',
    options: [
      'Because Google APIs are deprecated.',
      'Allowlisted domains frequently host JSONP endpoints or outdated JS libraries that can be exploited for CSP bypasses.',
      'Because wildcard DNS records cannot be parsed by browsers.',
      'Because domain allowlists disable gzip compression.'
    ],
    correctIndex: 1,
    explanation: 'Large CDNs frequently host JSONP endpoints (which return executable JS) or vulnerable Angular/jQuery versions. An attacker can craft a payload pointing to an allowlisted CDN URL, executing arbitrary code and bypassing the CSP.'
  },

  // --- 6. Cookie Security & SameSite ---
  {
    id: 34,
    topicId: 'cookie-security-architecture',
    category: 'Cookie Security & SameSite',
    difficulty: 'Beginner',
    question: 'What does the HttpOnly attribute on a Set-Cookie header accomplish?',
    options: [
      'Ensures the cookie is only transmitted over HTTP, never HTTPS.',
      'Prevents client-side scripts (JavaScript) from accessing document.cookie, shielding session tokens from XSS theft.',
      'Forces the cookie to expire when the browser window closes.',
      'Restricts the cookie to localhost IP addresses.'
    ],
    correctIndex: 1,
    explanation: 'HttpOnly instructs the browser that the cookie should not be exposed through Document.cookie APIs, preventing client-side malicious scripts from reading sensitive authentication tokens.'
  },
  {
    id: 35,
    topicId: 'cookie-security-architecture',
    category: 'Cookie Security & SameSite',
    difficulty: 'Beginner',
    question: 'What does the Secure cookie flag guarantee?',
    options: [
      'The cookie is encrypted with AES-GCM on the client disk.',
      'The browser will only transmit the cookie over encrypted HTTPS connections, never over unencrypted plaintext HTTP.',
      'The cookie cannot be overwritten by server responses.',
      'The cookie is only sent if the user has two-factor authentication enabled.'
    ],
    correctIndex: 1,
    explanation: 'The Secure attribute ensures the browser will never include the cookie in unencrypted HTTP requests, protecting against network eavesdropping and man-in-the-middle sniffing.'
  },
  {
    id: 36,
    topicId: 'cookie-security-architecture',
    category: 'Cookie Security & SameSite',
    difficulty: 'Intermediate',
    question: 'How does SameSite=Strict behave when a user clicks a link on external-blog.com pointing to banking.com?',
    options: [
      'The banking.com session cookie is withheld on the initial cross-site navigation, requiring the user to refresh or navigate same-site to activate the session.',
      'The banking.com cookie is included normally.',
      'The browser throws an HTTP 403 Forbidden error before opening the tab.',
      'The external-blog.com website can read the banking.com cookie.'
    ],
    correctIndex: 0,
    explanation: 'SameSite=Strict prevents the cookie from being sent on any cross-site request, even top-level navigation links. The cookie is only sent if the navigation originated from the same site.'
  },
  {
    id: 37,
    topicId: 'cookie-security-architecture',
    category: 'Cookie Security & SameSite',
    difficulty: 'Intermediate',
    question: 'What is the default cookie behavior under Chrome\'s "SameSite=Lax by default" policy?',
    options: [
      'Cookies are blocked on all requests.',
      'Cookies are withheld on cross-site subresource requests (images, iframes, fetch/XHR, POST forms), but included on top-level safe GET navigations (e.g. clicking a link).',
      'Cookies are sent freely everywhere with no restrictions.',
      'Cookies are only saved in session storage.'
    ],
    correctIndex: 1,
    explanation: 'SameSite=Lax provides balanced security: it blocks cookies on cross-site POST requests, iframes, and AJAX calls (mitigating typical CSRF), while preserving user sessions when following a normal hyperlink to the site.'
  },
  {
    id: 38,
    topicId: 'cookie-security-architecture',
    category: 'Cookie Security & SameSite',
    difficulty: 'Intermediate',
    question: 'What requirement must be met to set SameSite=None on modern browsers?',
    options: [
      'The cookie must have a lifetime under 10 minutes.',
      'The cookie MUST also declare the Secure attribute, requiring HTTPS.',
      'The cookie must be signed with a PGP key.',
      'The server must return Access-Control-Allow-Origin: *.'
    ],
    correctIndex: 1,
    explanation: 'According to the RFC specification and browser enforcement, setting SameSite=None without the Secure attribute causes modern browsers to reject and drop the cookie completely.'
  },
  {
    id: 39,
    topicId: 'cookie-security-architecture',
    category: 'Cookie Security & SameSite',
    difficulty: 'Advanced',
    question: 'What is the Cookie Prefix __Host- and what restrictions does the browser enforce on it?',
    options: [
      'It requires the cookie to be set from an HTTPS origin, without a Domain attribute (bound strictly to the host), and with Path=/.',
      'It marks the cookie for exclusive use by local Docker containers.',
      'It permits the cookie to be shared with all subdomains unconditionally.',
      'It restricts the cookie to WebSocket connections only.'
    ],
    correctIndex: 0,
    explanation: 'Cookie prefixes like __Host- provide cryptographic defense against subdomain cookie tossing: the browser rejects any Set-Cookie header with __Host- unless it is Secure, has no Domain attribute, and sets Path=/.'
  },

  // --- 7. Clickjacking & Framing ---
  {
    id: 40,
    topicId: 'clickjacking-defense',
    category: 'Clickjacking & Framing',
    difficulty: 'Beginner',
    question: 'What is a Clickjacking (UI Redressing) attack?',
    options: [
      'Intercepting user mouse clicks over wireless Bluetooth connections.',
      'Tricking a user into clicking an invisible or obscured iframe element (e.g. "Delete Account" or "Confirm Payment") while they think they are clicking a visible decoy button.',
      'Speed-clicking a submit button to cause race conditions in the database.',
      'Stealing mouse coordinates to fingerprint user identity.'
    ],
    correctIndex: 1,
    explanation: 'In clickjacking, the attacker overlays an invisible, high-opacity iframe containing the target application over an enticing decoy game or button, tricking the victim into executing unintended privileged clicks.'
  },
  {
    id: 41,
    topicId: 'clickjacking-defense',
    category: 'Clickjacking & Framing',
    difficulty: 'Beginner',
    question: 'Which legacy HTTP response header was created specifically to prevent framing of a website?',
    options: [
      'X-Frame-Options',
      'X-XSS-Protection',
      'X-Content-Type-Options',
      'Strict-Transport-Security'
    ],
    correctIndex: 0,
    explanation: 'X-Frame-Options (with values DENY or SAMEORIGIN) was introduced to inform browsers whether a page can be rendered inside an <iframe>, <frame>, or <object>.'
  },
  {
    id: 42,
    topicId: 'clickjacking-defense',
    category: 'Clickjacking & Framing',
    difficulty: 'Intermediate',
    question: 'What is the modern, more granular CSP directive that supersedes X-Frame-Options?',
    options: [
      'frame-ancestors',
      'child-src',
      'frame-src',
      'sandbox'
    ],
    correctIndex: 0,
    explanation: 'CSP\'s frame-ancestors directive (e.g. Content-Security-Policy: frame-ancestors \'none\' or frame-ancestors https://trusted-partner.com) supersedes X-Frame-Options and allows allowlisting multiple parent origins.'
  },
  {
    id: 43,
    topicId: 'clickjacking-defense',
    category: 'Clickjacking & Framing',
    difficulty: 'Intermediate',
    question: 'What is the difference between frame-src and frame-ancestors in Content Security Policy?',
    options: [
      'They are identical and can be used interchangeably.',
      'frame-src controls what URLs THIS page can embed as iframes; frame-ancestors controls who can embed THIS page as an iframe.',
      'frame-src is for mobile browsers; frame-ancestors is for desktop.',
      'frame-ancestors only applies to PDF documents.'
    ],
    correctIndex: 1,
    explanation: 'frame-src restricts the outgoing frame URLs that the current document can create, whereas frame-ancestors restricts the incoming parent origins that are allowed to embed the current document.'
  },
  {
    id: 44,
    topicId: 'clickjacking-defense',
    category: 'Clickjacking & Framing',
    difficulty: 'Advanced',
    question: 'Why were historical client-side JavaScript frame-busting scripts (e.g. if (top != self) top.location = self.location) vulnerable to bypass?',
    options: [
      'Attackers could neutralize them by embedding the frame with the HTML5 iframe sandbox attribute without allow-top-navigation, or hooking onbeforeunload.',
      'Because JavaScript runs after the page finishes rendering.',
      'Because window.top is a read-only constant.',
      'Because CSS stylesheets execute before JavaScript.'
    ],
    correctIndex: 0,
    explanation: 'An attacker framing the site could add <iframe sandbox="allow-scripts allow-forms"> (omitting allow-top-navigation), which allows scripts inside the iframe to run while blocking top-level navigation attempts!'
  },

  // --- 8. Defense-in-Depth & Headers ---
  {
    id: 45,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Beginner',
    question: 'What does the X-Content-Type-Options: nosniff header protect against?',
    options: [
      'Prevents browsers from MIME-sniffing a response away from the declared Content-Type, mitigating script execution disguised as images or text.',
      'Disables gzip compression on JSON APIs.',
      'Enforces HTTPS encryption on image subresources.',
      'Blocks malicious file downloads larger than 10MB.'
    ],
    correctIndex: 0,
    explanation: 'Without nosniff, some browsers inspect file bytes and execute scripts even if the server declared Content-Type: text/plain or image/jpeg, allowing file upload attacks to turn into XSS.'
  },
  {
    id: 46,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Beginner',
    question: 'What does HTTP Strict Transport Security (HSTS) do?',
    options: [
      'Instructs the browser to interact with the host solely over HTTPS connections, automatically converting insecure http:// requests to https:// for max-age seconds.',
      'Verifies that the server CPU has AES hardware acceleration enabled.',
      'Blocks cross-origin WebSocket connections.',
      'Prevents users from using browser DevTools.'
    ],
    correctIndex: 0,
    explanation: 'HSTS (Strict-Transport-Security: max-age=31536000; includeSubDomains; preload) prevents SSL-stripping attacks by forcing the browser to transparently upgrade all requests to HTTPS before transmitting anything over the wire.'
  },
  {
    id: 47,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Intermediate',
    question: 'How does Subresource Integrity (SRI) protect applications loading external scripts from CDNs?',
    options: [
      'It monitors CDN uptime and fails over to secondary mirrors.',
      'The browser calculates the cryptographic hash (e.g. sha384) of the downloaded script and compares it to the integrity attribute; if altered, the script is rejected.',
      'It obfuscates the CDN URL in network traffic.',
      'It compiles the CDN script with WebAssembly.'
    ],
    correctIndex: 1,
    explanation: 'SRI ensures that if a third-party CDN is hacked and malicious code is injected into a hosted library (e.g. analytics.js), the hash mismatch causes the browser to block script execution.'
  },
  {
    id: 48,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Intermediate',
    question: 'What does the Referrer-Policy: strict-origin-when-cross-origin header do?',
    options: [
      'Sends the full URL for same-origin requests, only the origin (scheme + host + port) for cross-origin HTTPS requests, and no referrer when downgrading from HTTPS to HTTP.',
      'Blocks all outgoing requests from sending cookies.',
      'Encrypts the Referer header using client public keys.',
      'Permits third-party analytics trackers to read the full query string.'
    ],
    correctIndex: 0,
    explanation: 'strict-origin-when-cross-origin prevents sensitive URL tokens, search queries, or internal paths from leaking to third-party domains when users click outbound links or fetch external assets.'
  },
  {
    id: 49,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Intermediate',
    question: 'What is the purpose of the Permissions-Policy (formerly Feature-Policy) HTTP header?',
    options: [
      'Allows servers to selectively enable or disable powerful browser hardware APIs (e.g. geolocation, camera, microphone, accelerometer) for the current origin and iframes.',
      'Sets user role permissions in the backend database.',
      'Controls operating system file read/write permissions.',
      'Authorizes OAuth2 tokens across domains.'
    ],
    correctIndex: 0,
    explanation: 'Permissions-Policy allows developers to restrict device features (e.g. Permissions-Policy: camera=(), microphone=(), geolocation=()), neutralizing malicious ad iframes or compromised dependencies attempting hardware surveillance.'
  },
  {
    id: 50,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Advanced',
    question: 'What is the Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP) combination required for?',
    options: [
      'Cross-Origin Isolation to enable high-resolution timers (performance.now()) and SharedArrayBuffer without risking Spectre microarchitectural side-channel attacks.',
      'Replacing OAuth2 tokens with Kerberos tickets.',
      'Disabling CSS flexbox layout computation in background tabs.',
      'Allowing web pages to access Bluetooth devices without user approval.'
    ],
    correctIndex: 0,
    explanation: 'Spectre side-channel attacks allowed malicious pages to read process memory via precision timers and SharedArrayBuffer. Modern browsers require Cross-Origin Isolation (COOP: same-origin and COEP: require-corp) to re-enable these powerful features safely.'
  },
  {
    id: 51,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Advanced',
    question: 'What is Cross-Origin Resource Policy (CORP) and how does it prevent XS-Leaks?',
    options: [
      'A header (Cross-Origin-Resource-Policy: same-origin) that instructs the browser to block other origins from loading resources (like images or scripts) via <img> or <script> tags.',
      'A policy that disables database transactions during high traffic.',
      'A client-side encryption framework for IndexedDB.',
      'A header that disables browser service workers.'
    ],
    correctIndex: 0,
    explanation: 'Even if SOP prevents reading data, attackers could infer state (e.g. is user logged in?) by embedding images and measuring onload/onerror or rendering timing (XS-Leaks). CORP blocks the browser from even loading the resource cross-origin.'
  },
  {
    id: 52,
    topicId: 'modern-web-defense-stack',
    category: 'Defense-in-Depth & Headers',
    difficulty: 'Advanced',
    question: 'Why should the legacy header X-XSS-Protection: 1; mode=block be disabled or replaced by modern CSP?',
    options: [
      'The legacy XSS Auditor had design flaws that attackers exploited to create new side-channel vulnerabilities and block legitimate scripts.',
      'Because it used too much battery power on smartphones.',
      'Because modern JavaScript engines do not support Unicode.',
      'Because it is only compatible with Internet Explorer 6.'
    ],
    correctIndex: 0,
    explanation: 'The heuristic XSS filters in legacy browsers could be tricked into selectively disabling legitimate page scripts (creating security vulnerabilities) and introduced user search leak vectors. Modern security recommends X-XSS-Protection: 0 in favor of Content Security Policy.'
  }
];
