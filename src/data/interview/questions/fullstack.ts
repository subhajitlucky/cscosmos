import type { InterviewQuestion } from '../types';

export const fullstackQuestions: InterviewQuestion[] = [
  {
    slug: 'what-happens-when-you-type-a-url',
    category: 'fullstack',
    topic: 'Browser',
    title: 'What happens when you type a URL and press Enter?',
    difficulty: 'beginner',
    frequency: 'very-often',
    round: 'phone-screen',
    type: 'concept',
    tags: ['dns', 'tls', 'http', 'rendering'],
    oneLiner: 'The classic warm-up question that secretly tests how deep your mental model of the web goes.',
    whyAsked:
      'Interviewers use this to map the boundary of your knowledge. Anyone can say "DNS then HTTP"; strong candidates can narrate caching layers, connection setup, and rendering without hand-waving. It also reveals whether you understand the web as a system rather than a stack of unrelated buzzwords.',
    mentalModel:
      'Think of it as a delivery pipeline: resolve the address (DNS), open a secure lane (TCP + TLS), place the order (HTTP), then assemble the package (parsing, layout, paint). Every stage has a cache that can short-circuit the previous stage.',
    steps: [
      {
        title: 'Browser cache and DNS resolution',
        body: 'Before any network traffic, the browser checks its own HTTP cache and the operating system checks its DNS cache; only on a miss does the query reach a recursive resolver, which checks its own cache before leaving the machine. Every cache miss then walks the hierarchy: a root server delegates to the TLD servers for .com, the TLD delegates to the domain’s authoritative nameserver, and the authoritative server returns the A/AAAA record. Each answer carries a TTL, so the very next lookup can short-circuit at any hop — the full hierarchy walk happens only once per TTL. Watch the packets: every arrow is a round trip that caching can eliminate. DNS usually runs over UDP because a query fits in one packet; TCP takes over for large responses and zone transfers.',
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'browser', icon: '🌐', label: 'Browser' },
            { id: 'guide', icon: '🧭', label: 'Guide' },
            { id: 'names', icon: '📋', label: 'Name server' },
          ],
          frames: [
            { id: 'f1', caption: 'You type a URL and press Enter. ⌨️', shout: { text: 'TYPE A URL', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'type', icon: '⌨️', at: 'you', effect: 'pop' }] },
            { id: 'f2', caption: 'The browser checks its own little address book first. 📖', shout: { text: 'CHECK NOTES', tone: 'info' }, cast: [{ id: 'browser', state: 'working' }], tokens: [{ id: 'book', icon: '📖', label: 'its notes', at: 'browser', effect: 'pop' }] },
            { id: 'f3', caption: 'Not there! The browser asks the guide up the chain. 🧭', shout: { text: 'ASK THE GUIDE', tone: 'info' }, cast: [{ id: 'guide', state: 'working' }], tokens: [{ id: 'ask', icon: '❓', label: 'where is it?', from: 'browser', to: 'guide' }] },
            { id: 'f4', caption: 'The name server knows: 93.184.216.34 📍', shout: { text: 'FOUND IT!', tone: 'good' }, mood: 'good', cast: [{ id: 'names', state: 'done' }, { id: 'browser', state: 'happy' }], tokens: [{ id: 'addr', icon: '📍', label: '93.184.216.34', from: 'names', to: 'browser' }] },
            { id: 'f5', caption: 'Everyone keeps a copy — next time it is instant. ⚡', shout: { text: 'REMEMBERS ⚡', tone: 'good' }, mood: 'good', cast: [{ id: 'browser', state: 'done' }], tokens: [{ id: 'fast', icon: '⚡', label: 'saved', at: 'browser', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'TCP handshake',
        body: 'The browser opens a TCP connection with the three-way handshake: the client sends SYN with a random sequence number, the server answers SYN-ACK acknowledging it and offering its own, and the client ACKs back. Both sides now agree the channel works in both directions and share initial sequence numbers. That costs one full round trip — roughly 10-150 ms depending on distance — before a single byte of HTTP is sent. Real pages amortize it: keep-alive reuses the socket for many requests, and TCP Fast Open can shave a round trip off repeat connections. This RTT tax is exactly why HTTP/3 dropped TCP for QUIC over UDP, where transport and crypto handshakes fuse into one round trip.',
        animation: {
          kind: 'story',
          cast: [
            { id: 'client', icon: '💻', label: 'Your computer' },
            { id: 'server', icon: '🖥️', label: 'Website' },
          ],
          frames: [
            { id: 'f1', caption: 'Your computer calls out: “Can we talk?”', shout: { text: 'CAN WE TALK?', tone: 'info' }, cast: [{ id: 'client', state: 'working' }], tokens: [{ id: 'syn', icon: '💬', label: 'SYN', from: 'client', to: 'server' }] },
            { id: 'f2', caption: 'The website: “Yes! Can you hear me?”', shout: { text: 'YES, YOU?', tone: 'info' }, cast: [{ id: 'server', state: 'working' }], tokens: [{ id: 'synack', icon: '💬', label: 'SYN-ACK', from: 'server', to: 'client' }] },
            { id: 'f3', caption: '“Loud and clear!” Both sides agree the line works.', shout: { text: 'CONNECTED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'client', state: 'done' }, { id: 'server', state: 'done' }], tokens: [{ id: 'ack', icon: '💬', label: 'ACK', from: 'client', to: 'server' }, { id: 'link', icon: '🤝', at: 'server', effect: 'pop' }] },
            { id: 'f4', caption: 'Three hello messages: one full round trip spent.', shout: { text: '1 ROUND TRIP', tone: 'info' }, cast: [{ id: 'client', state: 'done' }, { id: 'server', state: 'done' }], tokens: [{ id: 'clock', icon: '⏱️', label: 'paid once', at: 'client', effect: 'float' }] },
            { id: 'f5', caption: 'The line stays open — the next page skips this.', shout: { text: 'LINE STAYS OPEN ♻️', tone: 'good' }, mood: 'good', cast: [{ id: 'client', state: 'happy' }, { id: 'server', state: 'happy' }], tokens: [{ id: 'reuse', icon: '♻️', label: 'keep-alive', at: 'server', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'TLS handshake',
        body: 'Because the URL is HTTPS, a TLS handshake wraps the raw TCP stream. The client sends ClientHello with its supported cipher suites, TLS version, a random nonce, and the SNI hostname so the server can choose the right certificate before any encryption exists. The server replies with its certificate chain and proves it holds the matching private key; the client validates the chain against trusted roots, checks the hostname, and rejects anything expired or mis-issued. Both sides then perform an ephemeral ECDHE exchange — the shared secret never travels — and derive the same session keys; a Finished exchange proves the handshake was not tampered with. TLS 1.3 finishes in one round trip, and session resumption (tickets or PSK) lets returning visitors skip most of it.',
        animation: {
          kind: 'story',
          cast: [
            { id: 'client', icon: '💻', label: 'Your computer' },
            { id: 'server', icon: '🖥️', label: 'Website' },
            { id: 'guard', icon: '🛡️', label: 'Trust guard' },
          ],
          frames: [
            { id: 'f1', caption: '“Hello! Here are the secret codes I know.” 🗣️', shout: { text: 'HELLO!', tone: 'info' }, cast: [{ id: 'client', state: 'working' }], tokens: [{ id: 'hello', icon: '🗣️', label: 'hello', from: 'client', to: 'server' }] },
            { id: 'f2', caption: 'The website shows its ID card. 🪪', shout: { text: 'SHOW MY ID', tone: 'info' }, cast: [{ id: 'server', state: 'working' }], tokens: [{ id: 'id', icon: '🪪', label: 'certificate', from: 'server', to: 'client' }] },
            { id: 'f3', caption: 'The trust guard stamps it: genuine! ✅', shout: { text: 'ID CHECKS OUT', tone: 'good' }, mood: 'good', cast: [{ id: 'guard', state: 'done' }], tokens: [{ id: 'stamp', icon: '✅', label: 'genuine', at: 'guard', effect: 'pop' }] },
            { id: 'f4', caption: 'They whisper a secret only the two of them know. 🤫', shout: { text: 'SHARED SECRET', tone: 'info' }, cast: [{ id: 'client', state: 'working' }, { id: 'server', state: 'working' }], tokens: [{ id: 's1', icon: '🤫', at: 'client', effect: 'pop' }, { id: 's2', icon: '🤫', at: 'server', effect: 'pop' }] },
            { id: 'f5', caption: '🔒 The secret tunnel is locked — nobody can peek inside.', shout: { text: 'LOCKED TUNNEL 🔒', tone: 'good' }, mood: 'good', cast: [{ id: 'client', state: 'happy' }, { id: 'server', state: 'happy' }], tokens: [{ id: 'lock', icon: '🔒', label: 'encrypted', at: 'server', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'HTTP request and response',
        body: 'The browser sends an HTTP request: method and path, then headers like Host, Accept, Accept-Encoding, and the cookies for that domain. It usually hits a CDN edge first, which answers from cache on a hit or forwards to an origin behind a load balancer on a miss; the app queries its data stores and returns a status code, headers, and a body. Compression (br or gzip) shrinks the transfer, and caching headers decide whether the next visit needs this trip at all: Cache-Control max-age lets the browser skip the network, while an ETag enables a cheap 304 Not Modified revalidation. Watch the request make the full round trip — the response headers are why the second visit is nearly free.',
        code: {
          language: 'http',
          source: `GET / HTTP/2
Host: example.com
Accept: text/html,application/xhtml+xml
Accept-Encoding: br, gzip
Cookie: session=abc123

HTTP/2 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: br
Cache-Control: public, max-age=600
ETag: "a1b2c3"`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'browser', icon: '🙋', label: 'Browser' },
            { id: 'pantry', icon: '📦', label: 'Nearby pantry' },
            { id: 'kitchen', icon: '🧑‍🍳', label: 'Kitchen' },
            { id: 'fridge', icon: '🗄️', label: 'Fridge' },
          ],
          frames: [
            { id: 'f1', caption: 'The browser places the order: “Please send the page!” 📨', shout: { text: 'ORDER: GET /', tone: 'info' }, cast: [{ id: 'browser', state: 'working' }], tokens: [{ id: 'get', icon: '📨', label: 'GET /', from: 'browser', to: 'pantry' }] },
            { id: 'f2', caption: 'Not on the shelf? The order goes to the kitchen. 🧑‍🍳', shout: { text: 'OFF TO THE KITCHEN', tone: 'info' }, cast: [{ id: 'pantry', state: 'done' }, { id: 'kitchen', state: 'working' }], tokens: [{ id: 'forward', icon: '📨', label: 'not cached', from: 'pantry', to: 'kitchen' }] },
            { id: 'f3', caption: 'The kitchen checks the fridge for ingredients. 🗄️', shout: { text: 'CHECK THE FRIDGE', tone: 'info' }, cast: [{ id: 'fridge', state: 'working' }], tokens: [{ id: 'select', icon: '📋', label: 'SELECT', from: 'kitchen', to: 'fridge' }] },
            { id: 'f4', caption: 'Ingredients return — the kitchen cooks your page. 🍲', shout: { text: 'FRESH PAGE 🍲', tone: 'good' }, mood: 'good', cast: [{ id: 'kitchen', state: 'done' }, { id: 'browser', state: 'happy' }], tokens: [{ id: 'page', icon: '🍲', label: 'page', from: 'kitchen', to: 'browser' }] },
            { id: 'f5', caption: 'The pantry keeps a copy — the next visit is instant. ⚡', shout: { text: 'CACHED NEXT TIME', tone: 'good' }, mood: 'good', cast: [{ id: 'pantry', state: 'done' }], tokens: [{ id: 'copy', icon: '📦', label: 'copy saved', at: 'pantry', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Parsing, layout, paint',
        body: 'While the HTML streams in, a preload scanner keeps fetching images, fonts, and scripts in parallel, so the tokenizer is not the only thing working. Tokens build the DOM; CSS builds the CSSOM; DOM and CSSOM combine into the render tree of visible nodes; layout computes exact geometry for every box; paint records draw calls; the compositor stitches layers on the GPU. CSS is render-blocking — the browser refuses to paint before the CSSOM exists, which is why critical CSS is inlined and the rest deferred. A synchronous <script> in the head blocks the parser until it executes; defer and async load it without stopping parsing. After first paint, the framework hydrates the server-rendered HTML and attaches event listeners.',
        animation: {
          kind: 'story',
          cast: [
            { id: 'pieces', icon: '🧩', label: 'Page pieces' },
            { id: 'tree', icon: '🌳', label: 'The tree' },
            { id: 'ruler', icon: '📐', label: 'Measurer' },
            { id: 'brush', icon: '🖌️', label: 'Painter' },
            { id: 'screen', icon: '📺', label: 'Your screen' },
          ],
          frames: [
            { id: 'f1', caption: 'The page arrives as little puzzle pieces. 🧩', shout: { text: 'PIECES ARRIVE', tone: 'info' }, cast: [{ id: 'pieces', state: 'working' }], tokens: [{ id: 'box', icon: '📦', label: 'code', at: 'pieces', effect: 'pop' }] },
            { id: 'f2', caption: 'The pieces snap into a tree, with colors 🎨 painted on.', shout: { text: 'BUILD THE TREE', tone: 'info' }, cast: [{ id: 'tree', state: 'working' }], tokens: [{ id: 'treePiece', icon: '🌳', from: 'pieces', to: 'tree' }, { id: 'color', icon: '🎨', label: 'styles', at: 'tree', effect: 'pop' }] },
            { id: 'f3', caption: 'The measurer finds the exact size of every box. 📐', shout: { text: 'MEASURE IT', tone: 'info' }, cast: [{ id: 'tree', state: 'done' }, { id: 'ruler', state: 'working' }], tokens: [{ id: 'measure', icon: '📏', label: 'exact', from: 'tree', to: 'ruler' }] },
            { id: 'f4', caption: 'The painter colors every single pixel. 🖌️', shout: { text: 'PAINT IT', tone: 'info' }, cast: [{ id: 'ruler', state: 'done' }, { id: 'brush', state: 'working' }], tokens: [{ id: 'paint', icon: '🎨', label: 'colors', from: 'ruler', to: 'brush' }] },
            { id: 'f5', caption: 'Your screen shows the page — and buttons wake up. ✨', shout: { text: 'YOU SEE IT! 🖼️', tone: 'good' }, mood: 'good', cast: [{ id: 'screen', state: 'happy' }, { id: 'brush', state: 'done' }], tokens: [{ id: 'pic', icon: '🖼️', label: 'the page', from: 'brush', to: 'screen' }, { id: 'wake', icon: '✨', at: 'screen', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Cache-Control: max-age skips the network entirely, no-store forbids caching, and ETag adds a conditional 304 path — know which one the response asks for.',
      'DNS TTL is a trade-off: a low TTL makes failover fast but multiplies lookups; a long TTL is faster until the record changes.',
      'HTTP/2 multiplexes many requests over one connection, so the old "6 connections per host" limit disappears — do not cite it as a current limit.',
      'Render-blocking CSS and synchronous scripts delay first paint: inline critical CSS, defer the rest, and preload what the first screen needs.',
      'Service workers can answer from cache before DNS is ever consulted; preconnect and dns-prefetch warm connections during idle time.',
    ],
    followUps: [
      { q: 'Where would you add a cache to make this faster?', a: 'At every layer: browser HTTP cache, DNS cache, CDN edge, reverse proxy, then application-level caches like Redis.' },
      { q: 'Why is DNS usually UDP and not TCP?', a: 'Queries are small and need speed; UDP avoids handshake overhead. TCP is used for zone transfers and truncated large responses.' },
      { q: 'What happens on a repeat visit to the same page?', a: 'The browser may skip DNS, reuse the open connection, and serve from HTTP cache; if max-age expired it revalidates with If-None-Match, and the server replies 304 without a body.' },
      { q: 'What changes with HTTP/3?', a: 'QUIC runs over UDP and fuses transport + TLS handshakes into one round trip, and removes head-of-line blocking across streams.' },
    ],
    relatedEngine: { label: 'Explore the Browser Universe visualizer', href: '/fullstack/browseruniverse' },
  },
  {
    slug: 'useeffect-runs-twice-strict-mode',
    category: 'fullstack',
    topic: 'React',
    title: 'Why does my useEffect run twice in Strict Mode?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'coding',
    type: 'debugging',
    tags: ['react', 'useeffect', 'strict-mode', 'cleanup'],
    oneLiner: 'Your effect fires twice in development and once in production — the right answer is cleanup, not removing StrictMode.',
    whyAsked:
      'Interviewers want to see whether you understand why React 18 StrictMode double-invokes effects — mount, simulated unmount, remount — and whether you reach for the correct fix. The tell is whether a candidate disables StrictMode to silence a symptom or writes an effect that survives being set up and torn down twice.',
    mentalModel:
      'In development, StrictMode deliberately mounts, cleans up, and remounts every component to prove your effects are resilient. Effects must be idempotent: setup and cleanup should be able to run in any order and any number of times. Production invokes the effect exactly once, so code that only works because it never cleaned up is a latent bug.',
    steps: [
      {
        title: 'The duplicated network calls',
        body: `Open a fresh React 18 app, put a fetch or a subscription inside useEffect, and the network tab shows the work twice — while the production build shows it once. Candidates usually blame the fetch, the cache, or the dev server. The real trigger is StrictMode, which React enables in development templates. Watch the first animation: React renders the component twice before any effect runs, then the console prints subscribe, unsubscribe, subscribe in a tight rhythm and goes quiet. That rhythm is the fingerprint of an intentional effect setup, cleanup, and setup cycle. The important question is not how to silence the duplicate log — it is why React insists your effect survive a teardown it never asked you to write. If the effect is correct, the double invoke is harmless; if it is not, StrictMode has just exposed a bug that a real unmount or dependency change would eventually trigger in production.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'react', icon: '🎭', label: 'React (dev)' },
            { id: 'chat', icon: '💬', label: 'Chat room' },
          ],
          frames: [
            { id: 'f1', caption: 'In development, React practices every move twice. ✌️', shout: { text: 'DEV DRILL 🧪', tone: 'info' }, cast: [{ id: 'react', state: 'working' }], tokens: [{ id: 'drill', icon: '🧪', label: 'just testing', at: 'react', effect: 'pop' }] },
            { id: 'f2', caption: 'Round one: your effect subscribes to the room. 🔔', shout: { text: 'SUBSCRIBE #1', tone: 'info' }, cast: [{ id: 'react', state: 'working' }], tokens: [{ id: 'sub1', icon: '🔔', label: 'subscribed', from: 'react', to: 'chat' }] },
            { id: 'f3', caption: 'React immediately takes it back — it is testing you! ↩️', shout: { text: 'TAKE IT BACK', tone: 'info' }, cast: [{ id: 'react', state: 'working' }], tokens: [{ id: 'unsub', icon: '↩️', label: 'unsubscribed', from: 'chat', to: 'react' }] },
            { id: 'f4', caption: 'Round two: subscribe again. This one stays. 🔔', shout: { text: 'SUBSCRIBE #2 ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'react', state: 'done' }, { id: 'chat', state: 'done' }], tokens: [{ id: 'sub2', icon: '🔔', label: 'stays live', from: 'react', to: 'chat' }] },
            { id: 'f5', caption: 'Only one subscription is live. Nothing leaked. ✅', shout: { text: 'ONE LIVE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'chat', state: 'happy' }], tokens: [{ id: 'ok', icon: '✅', label: 'no leak', at: 'chat', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'StrictMode is a debugger',
        body: `StrictMode is not a linter or a scaffold you should strip out; it is a deliberate correctness harness. StrictMode double-invokes render logic in development — component bodies, initializers passed to useState and useMemo, and state updater functions — so that non-idempotent code fails loudly on your machine instead of silently in production. React 18 added the effect half of that simulation: in development each effect runs setup, cleanup, then setup again, to prepare apps for concurrent rendering, where a component can be mounted, paused, and discarded before it ever commits. The animation walks the full dev lifecycle — render, render, setup, cleanup, setup — before the user ever sees a symptom. Any effect that connects, subscribes, or starts a timer must return a cleanup that fully reverses its setup. When the cleanup is complete, the remount becomes invisible: same final state, one live connection, no leaked listener. The double invoke is the test; the cleanup is the answer.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'coach', icon: '🧑‍🏫', label: 'StrictMode' },
            { id: 'code', icon: '🧩', label: 'Your code' },
            { id: 'user', icon: '👤', label: 'Real user' },
          ],
          frames: [
            { id: 'f1', caption: 'StrictMode is a careful coach, not a bug. 🧑‍🏫', shout: { text: 'SAFETY COACH', tone: 'info' }, cast: [{ id: 'coach', state: 'working' }], tokens: [{ id: 'whistle', icon: '📣', label: 'drills', at: 'coach', effect: 'pop' }] },
            { id: 'f2', caption: 'The coach makes your code show its move twice. ✌️', shout: { text: 'DO IT TWICE', tone: 'info' }, cast: [{ id: 'code', state: 'working' }], tokens: [{ id: 'twice', icon: '✌️', label: 'again!', at: 'code', effect: 'pop' }] },
            { id: 'f3', caption: 'Only while building — never for real users. 🚧', shout: { text: 'DEV MODE ONLY 🚧', tone: 'info' }, cast: [{ id: 'user', state: 'idle' }], tokens: [{ id: 'fence', icon: '🚧', label: 'not in prod', at: 'coach', effect: 'pop' }] },
            { id: 'f4', caption: 'If round two is clean, your code passes. ✅', shout: { text: 'YOUR CODE PASSES', tone: 'good' }, mood: 'good', cast: [{ id: 'code', state: 'done' }], tokens: [{ id: 'pass', icon: '✅', label: 'idempotent', at: 'code', effect: 'pop' }] },
            { id: 'f5', caption: 'Real users run it once — and it is already safe. 🎉', shout: { text: 'SAFE FOR REAL 🎉', tone: 'good' }, mood: 'good', cast: [{ id: 'user', state: 'happy' }, { id: 'coach', state: 'done' }], tokens: [{ id: 'party', icon: '🎉', label: 'no bugs', at: 'user', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Trace the lifecycle counters',
        body: `Now trace the counters. renderCount tracks how many times the component body runs, effectRuns counts setup functions, and cleanupRuns counts teardowns. In development StrictMode renders the body twice before any effect runs; then setup runs, StrictMode immediately invokes the returned cleanup — cleanupRuns becomes one only after that second render — and setup runs a second time, so effectRuns reaches two while only the second subscription stays live. Watch the final frame: production does not run this simulation, so you see one render, one setup, and zero cleanups until the component actually unmounts. The counters make the rule concrete — whenever setup runs, cleanup must be able to run too, in any order, without leaving duplicate subscriptions, timers, or listeners behind. If your cleanup is complete, the counters are boring in production and healthy in development.`,
        code: {
          language: 'tsx',
          source: `function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    console.log('setup', roomId);
    const sub = chat.subscribe(roomId, setMessages);
    return () => {
      console.log('cleanup', roomId);
      sub.unsubscribe();
    };
  }, [roomId]);

  return <ul>{messages.map((m) => <li key={m}>{m}</li>)}</ul>;
}`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'react', icon: '🎭', label: 'React' },
            { id: 'effect', icon: '⚡', label: 'Your effect' },
            { id: 'tally', icon: '📊', label: 'Tally board' },
          ],
          frames: [
            { id: 'f1', caption: 'In dev, React plays the whole scene twice. ✌️', shout: { text: 'DEV: TWICE', tone: 'info' }, cast: [{ id: 'react', state: 'working' }], tokens: [{ id: 'two', icon: '✌️', label: '2 renders', at: 'react', effect: 'pop' }] },
            { id: 'f2', caption: 'Your effect switches ON for the first time. 🟢', shout: { text: 'ON #1', tone: 'info' }, cast: [{ id: 'effect', state: 'working' }], tokens: [{ id: 'on1', icon: '🟢', label: 'run 1', from: 'react', to: 'effect' }] },
            { id: 'f3', caption: 'React switches it OFF right away — part of the test. 🔴', shout: { text: 'OFF — TEST!', tone: 'info' }, cast: [{ id: 'react', state: 'working' }], tokens: [{ id: 'off1', icon: '🔴', label: 'stopped', from: 'effect', to: 'react' }] },
            { id: 'f4', caption: 'ON again — the second run is the one that counts. 🟢', shout: { text: 'ON #2 ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'effect', state: 'done' }], tokens: [{ id: 'on2', icon: '🟢', label: 'run 2', from: 'react', to: 'effect' }, { id: 'count', icon: '🔢', label: '2 on / 1 off', at: 'tally', effect: 'pop' }] },
            { id: 'f5', caption: 'For real users: ON once, OFF only when you leave. 1️⃣', shout: { text: 'REAL LIFE: ONCE', tone: 'good' }, mood: 'good', cast: [{ id: 'react', state: 'done' }, { id: 'tally', state: 'done' }], tokens: [{ id: 'prod', icon: '1️⃣', label: 'production', at: 'effect', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Production still needs cleanup',
        body: `Production never double-invokes on mount, so where do cleanups come from? Dependency changes and unmounts. The animation follows roomId switching from general to random: React first runs the previous effect's cleanup to leave the general room, then runs the new setup to join random. Only one subscription is ever live. Leave the screen and the final cleanup runs on unmount. This is the deeper lesson of the StrictMode question: the dev-mode simulation is just an accelerated version of lifecycle events that happen all the time in production. Every dependency change is a mini remount, and every navigation away is a cleanup. An effect that only cleans up correctly when it is convenient will leak subscriptions, stale timers, and out-of-order responses. Writing effects that tolerate arbitrary setup and cleanup ordering is the same skill as handling routes correctly.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'roomA', icon: '🚪', label: 'Old room' },
            { id: 'roomB', icon: '🏠', label: 'New room' },
          ],
          frames: [
            { id: 'f1', caption: 'You are inside the old room, listening. 🔔', shout: { text: 'IN OLD ROOM', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'listen1', icon: '🔔', label: 'live', at: 'roomA', effect: 'pop' }] },
            { id: 'f2', caption: 'You switch rooms — leave the old one first! 🚪', shout: { text: 'LEAVE FIRST', tone: 'info' }, cast: [{ id: 'roomA', state: 'done' }], tokens: [{ id: 'leave', icon: '👋', label: 'goodbye', from: 'you', to: 'roomA' }] },
            { id: 'f3', caption: 'Then join the new room and listen there. 🏠', shout: { text: 'JOIN THE NEW ONE', tone: 'info' }, cast: [{ id: 'roomB', state: 'working' }], tokens: [{ id: 'listen2', icon: '🔔', label: 'live', from: 'you', to: 'roomB' }] },
            { id: 'f4', caption: 'Only one room is connected now. Clean. ✅', shout: { text: 'ONLY ONE LIVE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'happy' }, { id: 'roomB', state: 'done' }], tokens: [{ id: 'one', icon: '1️⃣', label: 'connection', at: 'roomB', effect: 'pop' }] },
            { id: 'f5', caption: 'Leaving the page runs the same goodbye. 👋', shout: { text: 'CLEAN EXIT', tone: 'good' }, mood: 'good', cast: [{ id: 'roomB', state: 'done' }], tokens: [{ id: 'exit', icon: '👋', label: 'unsubscribed', from: 'you', to: 'roomB' }] },
          ],
        },
      },
      {
        title: 'Make effects idempotent',
        body: `The fix is to make setup and cleanup exact mirrors. Keep every resource — subscription, interval, AbortController, WebSocket — inside the effect closure and release it in the returned function. For fetches, pass an AbortController signal and abort in cleanup so a stale response cannot call setState; the abort rejects with AbortError, which you ignore. For timers, clear the interval. For analytics, decide explicitly which events must fire once and guard them outside the effect. Never disable StrictMode and never "fix" the duplicate with a mountedRef guard: refs survive the simulated remount, so the guard can skip the second setup after the first was cleaned up, leaving zero live subscriptions. Watch the animation: two setups run, but only the second fetch wins, and the first is aborted cleanly. Idempotent effects are the real production requirement.`,
        code: {
          language: 'tsx',
          source: `useEffect(() => {
  const controller = new AbortController();

  fetch('/api/rooms/' + roomId, { signal: controller.signal })
    .then((res) => res.json())
    .then(setRoom)
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort();
}, [roomId]);`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'net', icon: '🌐', label: 'Server' },
          ],
          frames: [
            { id: 'f1', caption: 'Request number one flies off to the server. 📨', shout: { text: 'REQUEST #1', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'req1', icon: '📨', label: 'room data', from: 'app', to: 'net' }] },
            { id: 'f2', caption: 'React cancels it mid-air — cleanly. ✋', shout: { text: 'ABORT #1', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'abort', icon: '✋', label: 'stop!', from: 'app', to: 'net' }] },
            { id: 'f3', caption: 'A fresh request flies out — this one wins. 📨', shout: { text: 'REQUEST #2', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'req2', icon: '📨', label: 'room data', from: 'app', to: 'net' }] },
            { id: 'f4', caption: 'The cancelled reply is politely ignored. 🙈', shout: { text: 'OLD REPLY IGNORED', tone: 'good' }, mood: 'good', cast: [{ id: 'net', state: 'working' }], tokens: [{ id: 'ignore', icon: '🙈', label: 'not this one', at: 'app', effect: 'pop' }] },
            { id: 'f5', caption: 'Only good data arrives. Same result every time. ✅', shout: { text: 'SAFE TO REPEAT ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'app', state: 'done' }, { id: 'net', state: 'done' }], tokens: [{ id: 'data', icon: '✅', label: 'one answer', from: 'net', to: 'app' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'State from the first run clobbers the second: abort the stale request (AbortController) or ignore it with a canceled flag in cleanup.',
      'Not resetting refs, intervals, or third-party widgets in cleanup: return a teardown that reverses every side effect the setup started.',
      'Removing StrictMode to hide the duplicate: the missing cleanup is still a bug and will fire on route changes and dependency changes in production.',
      'Guarding setup with a mountedRef: refs survive the simulated remount, so the second setup is skipped after the first was cleaned up — leaving zero live subscriptions.',
      'Double-counting analytics events in development: decide deliberately which events must fire once and dedupe them outside the effect rather than disabling the check.',
    ],
    followUps: [
      { q: 'Why does StrictMode not double-invoke in production?', a: 'It is a development-only correctness check: the simulation exists to catch non-idempotent effects, and shipping it would make users pay for developer tooling.' },
      { q: 'How do you fix a fetching effect that runs twice?', a: 'Pass an AbortController signal to fetch and abort it in the cleanup; the stale response then never reaches setState.' },
      { q: 'What if the work legitimately must run exactly once?', a: 'Move it out of render and effects: trigger it from an event handler or a module-level cache, or delegate to a library designed for it (React Query dedupes and cancels requests). Never "fix" it with a mountedRef guard, which reintroduces the leak.' },
      { q: 'Is it safe to keep a subscription in a ref to avoid double-subscribing?', a: 'No. The ref survives the simulated remount, so the second setup skips subscribing after the first was cleaned up, leaving zero live subscriptions. Make setup unconditional and cleanup complete.' },
    ],
    relatedEngine: { label: 'Explore the React Cosmos visualizer', href: '/fullstack/reactcosmos' },
  },
  {
    slug: 'event-loop-timeout-vs-promise-order',
    category: 'fullstack',
    topic: 'JavaScript',
    title: 'What does this event-loop snippet print?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'coding',
    type: 'coding',
    tags: ['javascript', 'event-loop', 'microtasks', 'promises', 'settimeout'],
    oneLiner: 'A four-line snippet that separates people who memorized "microtasks before macrotasks" from those who can run the queues in their head.',
    whyAsked:
      'This is a rite-of-passage JavaScript question because it compresses the event loop into four lines. Interviewers watch whether you reason about task queues in order instead of pattern-matching "promises are faster than timeouts". The follow-ups — timers clamping, starvation, rendering order — reveal whether you can apply the model to real asynchronous bugs.',
    mentalModel:
      'The event loop runs one task at a time. A task runs to completion, then the engine drains the entire microtask queue, optionally renders, and only then takes one macrotask. Repeat. Synchronous code is the first part of the current task, so it always prints before any queued callback.',
    steps: [
      {
        title: 'Predict the printed order',
        body: `Before running the snippet, say the order out loud. Most candidates answer A D B C, assuming promises and timers queue together, or A B C D, assuming a zero-millisecond timer fires immediately. The correct output is A D C B. The reasoning is mechanical, not mysterious. console.log('A') and console.log('D') are synchronous statements in the script's own task, so they run to completion immediately. setTimeout registers B in the macrotask queue and Promise.then registers C in the microtask queue, but neither callback can interrupt the running task. Watch the animation: A and D light up on the call-stack lane before anything moves on the microtask lane, and B waits even longer on the macrotask lane. Narrating this order in advance — sync, then all microtasks, then one macrotask — is exactly what the interviewer is listening for.`,
        code: {
          language: 'javascript',
          source: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'runner', icon: '🏃', label: 'Runner (JS)' },
            { id: 'fast', icon: '🎯', label: 'Promise lane' },
            { id: 'slow', icon: '⏰', label: 'Timer lane' },
          ],
          frames: [
            { id: 'f1', caption: '“A” prints right away — the runner is on the ball. 🅰️', shout: { text: 'A GOES FIRST', tone: 'info' }, cast: [{ id: 'runner', state: 'working' }], tokens: [{ id: 'a', icon: '🅰️', label: 'A printed', at: 'runner', effect: 'pop' }] },
            { id: 'f2', caption: 'A timer? It waits its turn in the slow lane. ⏰', shout: { text: 'B ENTERS THE LINE', tone: 'info' }, cast: [{ id: 'slow', state: 'working' }], tokens: [{ id: 'b', icon: '⏰', label: 'B waits', from: 'runner', to: 'slow' }] },
            { id: 'f3', caption: 'A promise? The fast lane! 🎯', shout: { text: 'C = FAST LANE', tone: 'info' }, cast: [{ id: 'fast', state: 'working' }], tokens: [{ id: 'c', icon: '🎯', label: 'C waits', from: 'runner', to: 'fast' }] },
            { id: 'f4', caption: '“D” prints — the runner finishes the script. 🅳', shout: { text: 'D FINISHES IT', tone: 'info' }, cast: [{ id: 'runner', state: 'done' }], tokens: [{ id: 'd', icon: '🅳', label: 'D printed', at: 'runner', effect: 'pop' }] },
            { id: 'f5', caption: 'Then the lanes: fast first, slow after. A D C B! 🎉', shout: { text: 'A D C B 🎉', tone: 'good' }, mood: 'good', cast: [{ id: 'fast', state: 'done' }, { id: 'slow', state: 'done' }], tokens: [{ id: 'cDone', icon: '✅', label: 'C', at: 'fast', effect: 'pop' }, { id: 'bDone', icon: '✅', label: 'B', at: 'slow', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Synchronous code owns the stack',
        body: `The first rule of the event loop is run-to-completion: once a task starts, the engine never pauses it to run a queued callback. The entire script is a single task, so every synchronous statement executes before the engine even looks at the queues. This is why a long synchronous loop blocks timers, clicks, and painting, and why setTimeout(fn, 0) is a request to queue rather than a command to run now. In the animation, watch the call-stack lane: logging A, registering the timer, registering the promise callback, and logging D all happen inside one unbroken task. The microtask and macrotask lanes are only bookkeeping at this point; nothing queued can preempt live JavaScript. The zero-millisecond delay says nothing about when the callback runs, only about the minimum wait once the queue becomes eligible.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'runner', icon: '🏃', label: 'Runner (JS)' },
            { id: 'fast', icon: '🎯', label: 'Promise notes' },
            { id: 'slow', icon: '⏰', label: 'Timer notes' },
          ],
          frames: [
            { id: 'f1', caption: 'The runner never stops mid-move. One turn at a time. 🏃', shout: { text: 'NO INTERRUPTIONS', tone: 'info' }, cast: [{ id: 'runner', state: 'working' }], tokens: [{ id: 'start', icon: '▶️', label: 'script starts', at: 'runner', effect: 'pop' }] },
            { id: 'f2', caption: '“A” prints — still the same turn. 🅰️', shout: { text: 'A PRINTS', tone: 'info' }, cast: [{ id: 'runner', state: 'working' }], tokens: [{ id: 'a', icon: '🅰️', label: 'A', at: 'runner', effect: 'pop' }] },
            { id: 'f3', caption: 'The timer and promise only leave sticky notes. 🗒️', shout: { text: 'STICKY NOTES', tone: 'info' }, cast: [{ id: 'slow', state: 'working' }, { id: 'fast', state: 'working' }], tokens: [{ id: 'noteB', icon: '🗒️', label: 'B note', from: 'runner', to: 'slow' }, { id: 'noteC', icon: '🗒️', label: 'C note', from: 'runner', to: 'fast' }] },
            { id: 'f4', caption: '“D” prints. The turn is done. 🅳', shout: { text: 'TURN IS OVER', tone: 'info' }, cast: [{ id: 'runner', state: 'done' }], tokens: [{ id: 'd', icon: '🅳', label: 'D', at: 'runner', effect: 'pop' }] },
            { id: 'f5', caption: 'Only now does anyone read the notes. 👀', shout: { text: 'NOTES ARE READ', tone: 'info' }, cast: [{ id: 'fast', state: 'working' }, { id: 'slow', state: 'working' }], tokens: [{ id: 'eyes', icon: '👀', label: 'next turn', at: 'fast', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'The microtask queue drains',
        body: `When the current task ends, the engine does not move straight to timers. It first drains the entire microtask queue to exhaustion: promise callbacks, queueMicrotask callbacks, and MutationObserver records. If a microtask queues another microtask, that new one also runs in the same drain, before the loop is allowed to proceed. This is why the code after await feels immediate — it is a microtask continuation, not a brand-new task. In the animation, C runs on the microtask lane while B still sits untouched in the macrotask lane. A promise chain that keeps rescheduling itself would keep that lane spinning and starve timers and rendering completely. The event loop escapes to a macrotask only when the microtask queue is empty, which is the rule that decides C before B in our snippet.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'runner', icon: '🏃', label: 'Runner (JS)' },
            { id: 'fast', icon: '🎯', label: 'Promise lane' },
            { id: 'slow', icon: '⏰', label: 'Timer lane' },
          ],
          frames: [
            { id: 'f1', caption: 'Turn over: the promise lane is served first. 🎯', shout: { text: 'PROMISES FIRST', tone: 'info' }, cast: [{ id: 'fast', state: 'working' }], tokens: [{ id: 'c', icon: '🎯', label: 'C runs', from: 'fast', to: 'runner' }] },
            { id: 'f2', caption: 'C prints right away. ✅', shout: { text: 'C PRINTS ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'runner', state: 'working' }], tokens: [{ id: 'cOk', icon: '✅', label: 'C done', at: 'runner', effect: 'pop' }] },
            { id: 'f3', caption: 'A promise can add another promise note — served now too. ➕', shout: { text: 'AND MORE!', tone: 'info' }, cast: [{ id: 'fast', state: 'working' }], tokens: [{ id: 'more', icon: '➕', label: 'another', at: 'fast', effect: 'pop' }] },
            { id: 'f4', caption: 'The promise lane must be completely empty first. 🧹', shout: { text: 'UNTIL EMPTY', tone: 'info' }, cast: [{ id: 'fast', state: 'done' }], tokens: [{ id: 'sweep', icon: '🧹', label: 'all cleared', at: 'fast', effect: 'pop' }] },
            { id: 'f5', caption: 'Only now may a timer move. B is still waiting. ⏰', shout: { text: 'TIMER STILL WAITS', tone: 'info' }, cast: [{ id: 'slow', state: 'working' }], tokens: [{ id: 'wait', icon: '⌛', label: 'B waiting', at: 'slow', effect: 'float' }] },
          ],
        },
      },
      {
        title: 'One macrotask per turn',
        body: `Once the microtask queue empties, the browser gets an opportunity to render, and then the loop takes exactly one macrotask — in this snippet, the timer callback B. Running B enters JavaScript as a fresh task, and anything it queues starts the cycle over: after B finishes, microtasks drain again, render may happen, and the next macrotask is selected. This one-at-a-time discipline is what keeps pages responsive; timers never batch-fire in parallel. Watch the animation: C is marked done on the microtask lane, B runs alone on the macrotask lane, a render phase appears between tasks, and the loop checks the queues again. Putting the phases together explains the output: the script prints A and D synchronously, the microtask queue prints C, and the first macrotask prints B.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'runner', icon: '🏃', label: 'Runner (JS)' },
            { id: 'slow', icon: '⏰', label: 'Timer lane' },
            { id: 'painter', icon: '🎨', label: 'Painter' },
          ],
          frames: [
            { id: 'f1', caption: 'Promise lane empty → the painter gets a turn. 🎨', shout: { text: 'PAINT BREAK', tone: 'info' }, cast: [{ id: 'painter', state: 'working' }], tokens: [{ id: 'brush', icon: '🖌️', label: 'paint now', at: 'painter', effect: 'pop' }] },
            { id: 'f2', caption: 'Now the timer B gets its turn — exactly one. 1️⃣', shout: { text: 'ONE TIMER ONLY', tone: 'info' }, cast: [{ id: 'slow', state: 'working' }], tokens: [{ id: 'b', icon: '⏰', label: 'B runs', from: 'slow', to: 'runner' }] },
            { id: 'f3', caption: 'Anything B adds goes back to the promise lane. ♻️', shout: { text: 'CYCLE REPEATS ♻️', tone: 'info' }, cast: [{ id: 'runner', state: 'working' }], tokens: [{ id: 'cycle', icon: '♻️', label: 'again', at: 'runner', effect: 'pop' }] },
            { id: 'f4', caption: 'Then paint again, then the next timer. 🖌️', shout: { text: 'PAINT, THEN NEXT', tone: 'info' }, cast: [{ id: 'painter', state: 'done' }, { id: 'slow', state: 'done' }], tokens: [{ id: 'next', icon: '🔜', label: 'next turn', at: 'slow', effect: 'float' }] },
            { id: 'f5', caption: 'The whole dance gives the order: A D C B. 🏁', shout: { text: 'A D C B 🏁', tone: 'good' }, mood: 'good', cast: [{ id: 'runner', state: 'happy' }], tokens: [{ id: 'flag', icon: '🏁', label: 'final order', at: 'runner', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Where this breaks in practice',
        body: `The mental model gets subtle in real code. Browsers clamp nested setTimeout(0) calls to roughly four milliseconds after five levels, so a "zero" timer is never truly immediate and can interleave with rendering. An unbounded await loop that keeps queueing microtasks starves timers and painting, freezing the tab. Awaiting an already-resolved promise still suspends and resumes through the microtask queue — the async variant below prints A D C B exactly like the .then version, because the post-await continuation is itself a microtask. In Node, process.nextTick runs before promise microtasks and setImmediate lands in the check phase rather than the timer phase. Watch the final animation: the microtask lane keeps refilling instead of draining, the render lane never activates, and the timer waits forever. That picture is microtask starvation, and it is the root cause behind many "the UI froze" bug reports. Yield to a macrotask periodically in long async loops.`,
        code: {
          language: 'javascript',
          source: `async function main() {
  console.log('A');
  await Promise.resolve();
  console.log('C'); // microtask continuation
}
main();
setTimeout(() => console.log('B'), 0);
console.log('D'); // prints: A D C B`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'runner', icon: '🏃', label: 'Runner (JS)' },
            { id: 'fast', icon: '🎯', label: 'Promise lane' },
            { id: 'timer', icon: '⏰', label: 'Timer' },
            { id: 'painter', icon: '🎨', label: 'Painter' },
          ],
          frames: [
            { id: 'f1', caption: 'A promise loop keeps refilling its own lane. 🔁', shout: { text: 'ENDLESS LOOP', tone: 'bad' }, mood: 'bad', cast: [{ id: 'fast', state: 'working' }], tokens: [{ id: 'loop', icon: '🔁', label: 'again…', at: 'fast', effect: 'pop' }] },
            { id: 'f2', caption: 'Every round adds more promise notes. ➕➕', shout: { text: 'IT NEVER EMPTIES', tone: 'bad' }, mood: 'bad', cast: [{ id: 'runner', state: 'working' }], tokens: [{ id: 'plus', icon: '➕', label: 'more', at: 'fast', effect: 'pop' }] },
            { id: 'f3', caption: 'The timer waits forever. 😩', shout: { text: 'TIMER STUCK!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'timer', state: 'crashed' }], tokens: [{ id: 'stuck', icon: '⌛', label: 'forever', at: 'timer', effect: 'float' }] },
            { id: 'f4', caption: 'The painter never gets a turn — the screen freezes. 🥶', shout: { text: 'SCREEN FREEZES!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'painter', state: 'crashed' }], tokens: [{ id: 'frozen', icon: '🥶', label: 'frozen', at: 'painter', effect: 'pop' }] },
            { id: 'f5', caption: 'Fix: give the loop a break — let a timer in. ☕', shout: { text: 'TAKE A BREAK ☕', tone: 'good' }, mood: 'good', cast: [{ id: 'timer', state: 'happy' }, { id: 'painter', state: 'happy' }], tokens: [{ id: 'coffee', icon: '☕', label: 'yield!', at: 'runner', effect: 'pop' }, { id: 'resume', icon: '🖌️', label: 'paint resumes', at: 'painter', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Assuming setTimeout(fn, 0) is immediate: browsers clamp nested timers to about 4 ms, so use queueMicrotask or MessageChannel when you truly need to yield immediately.',
      'Forgetting that code after await is a microtask: an async continuation still runs before any timer callback.',
      'Treating Node and browsers as identical: process.nextTick beats promise microtasks in Node, and setImmediate runs in the check phase, not the timer phase.',
      'Starving the loop with a promise chain that reschedules itself: insert a macrotask yield so rendering and timers can run.',
      'Calling requestAnimationFrame a microtask: rAF is a render-phase callback that fires before the next paint, not a microtask; relative to a timer it fires at the next render opportunity — never between synchronous code and the microtask queue.',
    ],
    followUps: [
      { q: 'Why does Promise.resolve().then run before setTimeout(0)?', a: 'Microtasks drain at the end of the current task, while timers are macrotasks that need a later loop turn. The engine always empties microtasks first.' },
      { q: 'What if the promise chain queues more .then callbacks?', a: 'They run inside the same microtask drain, before any macrotask, because the drain continues until the microtask queue is empty.' },
      { q: 'queueMicrotask vs Promise.resolve().then()?', a: 'Both schedule a microtask and run in FIFO order within the same drain; queueMicrotask is explicit and avoids allocating a promise, but makes no difference to ordering correctness.' },
      { q: 'How do you yield to rendering in a long async loop?', a: 'Await a macrotask-yielding primitive such as scheduler.yield, setTimeout, or requestAnimationFrame so the loop gets a chance to paint.' },
    ],
    relatedEngine: { label: 'Explore the JavaScript visualizer', href: '/fullstack/jsviz' },
  },
  {
    slug: 'database-indexes-btree-tradeoffs',
    category: 'fullstack',
    topic: 'Databases',
    title: 'How do database indexes work, and when do they hurt?',
    difficulty: 'intermediate',
    frequency: 'sometimes',
    round: 'concept',
    type: 'concept',
    tags: ['databases', 'indexes', 'b-tree', 'query-planner'],
    oneLiner: 'A B+Tree is a tiny table of contents that turns a million-row scan into a handful of page reads — until writes and row lookups tip the balance.',
    whyAsked:
      'Interviewers use indexes to test whether you connect query performance to physical storage instead of just syntax. Strong candidates explain page I/O, the leftmost-prefix rule for composite keys, and why the planner might ignore an index. It also probes judgment: knowing when not to add an index is as valuable as knowing how to add one.',
    mentalModel:
      'An index is a sorted B+Tree keyed by column values whose leaves point at rows. Lookups descend O(log n) pages instead of scanning O(n) pages, but every INSERT/UPDATE/DELETE must maintain the tree. Indexes accelerate reads for selective predicates — the first columns of a composite key and covering queries especially — and can slow writes and even reads when selectivity is poor.',
    steps: [
      {
        title: 'Full scans read every page',
        body: `Without an index, SELECT * FROM users WHERE email = ? forces the planner into a sequential scan: read every heap page, test every row, and stop only when the relation ends. Cost scales with table size and row width — ten million rows at roughly one hundred rows per page is about one hundred thousand page reads, and if the table does not fit in the buffer cache, many of those are physical disk I/Os. Watch the animation: the query touches heap page after heap page, and the rows-tested node grows without any bound tied to the predicate. The work is O(n) in pages regardless of how selective the filter is, because the heap has no ordering that helps. An index changes the shape of that work from linear scanning into logarithmic descent, which is the entire reason databases maintain a second copy of the keys.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'reader', icon: '🧑‍💼', label: 'Reader' },
            { id: 'book', icon: '📚', label: 'Big book' },
          ],
          frames: [
            { id: 'f1', caption: 'Find one name — but the book has no index. 🔍', shout: { text: 'FIND ONE NAME', tone: 'info' }, cast: [{ id: 'reader', state: 'working' }], tokens: [{ id: 'hunt', icon: '🔍', label: 'email = ?', at: 'reader', effect: 'pop' }] },
            { id: 'f2', caption: 'No shortcut: flip page 1 and read every line. 📖', shout: { text: 'PAGE 1… CHECK!', tone: 'info' }, cast: [{ id: 'book', state: 'working' }], tokens: [{ id: 'p1', icon: '📖', label: 'page 1', at: 'book', effect: 'pop' }] },
            { id: 'f3', caption: 'Page 2… page 3… no skipping allowed. 📖📖', shout: { text: 'PAGE BY PAGE', tone: 'info' }, cast: [{ id: 'book', state: 'working' }], tokens: [{ id: 'p2', icon: '📖', label: 'page 2', at: 'book', effect: 'pop' }] },
            { id: 'f4', caption: 'A million lines later — still flipping. 😩', shout: { text: 'SO SLOW!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'reader', state: 'crashed' }], tokens: [{ id: 'hourglass', icon: '⌛', label: 'forever', at: 'reader', effect: 'float' }] },
            { id: 'f5', caption: 'One match found, but the whole book was read. 🐌', shout: { text: 'EVERY PAGE READ', tone: 'bad' }, mood: 'bad', cast: [{ id: 'reader', state: 'crashed' }], tokens: [{ id: 'snail', icon: '🐌', label: 'O(n) pages', at: 'book', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'What a B+Tree buys',
        body: `A B+Tree keeps keys sorted in a shallow, wide tree: the root and internal nodes hold separator keys that route a search, and the leaves hold the actual keys in sorted order, linked sideways for range scans. A three- or four-level tree covers millions of rows because each page fans out to hundreds of children. Searching one email walks root, then internal, then leaf: a handful of page reads instead of tens of thousands. The animation shows that descent — at every node the search key routes down a single branch, so the remaining search space shrinks by fan-out at each level. Insertions and deletions keep the tree balanced through page splits and merges, which is a maintenance cost paid on every write. Range queries are a B+Tree strength: find the first leaf, then follow sibling pointers instead of descending again.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'reader', icon: '🧑‍💼', label: 'Reader' },
            { id: 'cards', icon: '🗂️', label: 'Card catalog' },
            { id: 'shelf', icon: '📚', label: 'The shelf' },
          ],
          frames: [
            { id: 'f1', caption: 'The catalog keeps every card in sorted order. 🗂️', shout: { text: 'SORTED CARDS', tone: 'info' }, cast: [{ id: 'cards', state: 'working' }], tokens: [{ id: 'catalog', icon: '🗂️', label: 'sorted', at: 'cards', effect: 'pop' }] },
            { id: 'f2', caption: 'Open the pile in the middle: before or after? ↔️', shout: { text: 'CHECK THE MIDDLE', tone: 'info' }, cast: [{ id: 'reader', state: 'working' }], tokens: [{ id: 'mid', icon: '↔️', label: 'half?', from: 'reader', to: 'cards' }] },
            { id: 'f3', caption: 'Every check throws away half the pile. ✂️', shout: { text: 'HALF EACH TIME', tone: 'info' }, cast: [{ id: 'cards', state: 'working' }], tokens: [{ id: 'cut', icon: '✂️', label: 'half gone', at: 'cards', effect: 'pop' }] },
            { id: 'f4', caption: 'A few looks and you land on the exact card. 🎯', shout: { text: 'A-HA, FOUND!', tone: 'good' }, mood: 'good', cast: [{ id: 'reader', state: 'happy' }], tokens: [{ id: 'hit', icon: '🎯', label: 'the card', at: 'cards', effect: 'pop' }] },
            { id: 'f5', caption: 'The card points at the shelf spot — go grab it. 📍', shout: { text: 'CARD → SHELF 📍', tone: 'info' }, cast: [{ id: 'shelf', state: 'working' }], tokens: [{ id: 'spot', icon: '📍', label: 'shelf spot', from: 'cards', to: 'shelf' }] },
          ],
        },
      },
      {
        title: 'Walk an indexed lookup',
        body: `Put the pipeline together. The query arrives with a predicate, and the planner decides the cheapest access path; with an equality filter on an indexed column it chooses the B+Tree. The search starts at the root page, compares the key against separator values, and follows the single child page that can contain the target. At the leaf page the key is found among sorted entries, and the leaf's row pointer identifies the heap page and slot; a final page read fetches the actual row. That is O(log n) index page reads plus one row fetch, versus O(n) heap reads for a scan. Watch the animation's active node move one step per phase: every arrow is a real page I/O, and there are only a handful of them. Without a covering index, the row fetch is an extra random read — the hidden second cost.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'seeker', icon: '🧑‍💼', label: 'Search' },
            { id: 'guide', icon: '🧭', label: 'Guide' },
            { id: 'tree', icon: '🌳', label: 'The tree' },
            { id: 'shelf', icon: '📚', label: 'Shelf' },
          ],
          frames: [
            { id: 'f1', caption: 'Your search starts: “find this email”. 🗺️', shout: { text: 'SEARCH STARTS', tone: 'info' }, cast: [{ id: 'seeker', state: 'working' }], tokens: [{ id: 'map', icon: '🗺️', label: 'email = ?', at: 'seeker', effect: 'pop' }] },
            { id: 'f2', caption: 'The guide picks the fastest road. 🧭', shout: { text: 'PICK THE PATH', tone: 'info' }, cast: [{ id: 'guide', state: 'working' }], tokens: [{ id: 'pick', icon: '🧭', label: 'use tree', from: 'seeker', to: 'guide' }] },
            { id: 'f3', caption: 'Down the tree: only a few hops. 🌳⬇️', shout: { text: 'FEW HOPS DOWN', tone: 'info' }, cast: [{ id: 'tree', state: 'working' }], tokens: [{ id: 'down', icon: '⬇️', label: 'hop hop hop', from: 'guide', to: 'tree' }] },
            { id: 'f4', caption: 'The tree hands back the exact spot. 📍', shout: { text: 'GOT THE SPOT!', tone: 'good' }, mood: 'good', cast: [{ id: 'seeker', state: 'happy' }], tokens: [{ id: 'spot', icon: '📍', label: 'found it', from: 'tree', to: 'seeker' }] },
            { id: 'f5', caption: 'One final grab on the shelf — and done. ✅', shout: { text: 'ONE FINAL GRAB ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'shelf', state: 'done' }], tokens: [{ id: 'row', icon: '✅', label: 'row fetched', from: 'seeker', to: 'shelf' }] },
          ],
        },
      },
      {
        title: 'Composite keys follow leftmost prefix',
        body: `A composite index on (last_name, first_name, birth_date) is sorted first by last name, then first name, then birth date — like a phone book. That ordering means the index can serve predicates on last_name, on last_name plus first_name, and on the full key. A query filtering only first_name cannot seek, because equal first names are scattered across every last-name range: the planner must scan the whole index or fall back to the heap. Range conditions stop the prefix too — last_name equality plus a birth_date range can locate the last-name range but cannot use birth_date as a search key because first_name intervenes. Put equality columns first and range columns last. Watch the animation: one query seeks straight to a leaf, while the other has no anchor and touches every leaf before any heap rows.`,
        code: {
          language: 'sql',
          source: `CREATE INDEX idx_users_name
  ON users (last_name, first_name, birth_date);

-- Uses the index: leftmost prefix
SELECT * FROM users WHERE last_name = 'Patel';

-- Uses the index: both prefix columns
SELECT * FROM users
WHERE last_name = 'Patel' AND first_name = 'Ana';

-- Cannot seek: first_name is not a leftmost column
SELECT * FROM users WHERE first_name = 'Ana';`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'lookup', icon: '🧑‍💼', label: 'Lookup' },
            { id: 'book', icon: '📖', label: 'Name book' },
            { id: 'rows', icon: '🗃️', label: 'The rows' },
          ],
          frames: [
            { id: 'f1', caption: 'The book is sorted: last name → first name → birthday. 📖', shout: { text: 'SORTED BY RULE', tone: 'info' }, cast: [{ id: 'book', state: 'working' }], tokens: [{ id: 'rule', icon: '🔤', label: 'A→Z', at: 'book', effect: 'pop' }] },
            { id: 'f2', caption: 'Search by LAST name: straight to that range. 🎯', shout: { text: 'LAST NAME = SEEK ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'lookup', state: 'working' }], tokens: [{ id: 'seek', icon: '🎯', label: 'Patel range', from: 'lookup', to: 'book' }] },
            { id: 'f3', caption: 'Add the FIRST name: even more precise. 🎯', shout: { text: 'ADD FIRST NAME ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'book', state: 'done' }], tokens: [{ id: 'seek2', icon: '🔬', label: 'narrow', at: 'book', effect: 'pop' }] },
            { id: 'f4', caption: 'FIRST name only? No anchor — every page gets flipped. 😩', shout: { text: 'NO LEFT ANCHOR!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'lookup', state: 'crashed' }], tokens: [{ id: 'flip', icon: '📖', label: 'all pages', at: 'book', effect: 'shake' }] },
            { id: 'f5', caption: 'Rule: sort by what you will look up first. 📏', shout: { text: 'LEFT FIRST ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'book', state: 'happy' }, { id: 'rows', state: 'done' }], tokens: [{ id: 'found', icon: '🗃️', label: 'rows found', from: 'book', to: 'rows' }] },
          ],
        },
      },
      {
        title: 'When an index hurts',
        body: `Indexes are not free. Every write must update each index, which means more page splits, more buffer-pool pressure, and a slower INSERT/UPDATE path — write amplification. A low-cardinality column such as status rarely helps: when a query matches a large fraction of the table, the planner estimates that a sequential scan costs fewer page reads than bouncing between index and heap pages, and it ignores the index. Non-covering indexes pay an extra random row fetch per match, so returning most of the table through an index can be slower than scanning it. When the index already contains every needed column and the visibility map marks the pages all-visible, that fetch disappears — an index-only scan. The judgment answer is to index for the queries you actually run, verify with EXPLAIN ANALYZE (below), and remove indexes whose write cost outweighs their read wins.`,
        code: {
          language: 'sql',
          source: `-- Low selectivity: the planner prefers the heap
EXPLAIN ANALYZE SELECT * FROM users WHERE status = 'active';
-- Seq Scan on users  (rows=98000)  Filter: (status = 'active')

-- High selectivity: the index wins
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'ada@example.com';
-- Index Scan using users_email_idx on users  (rows=1)`,
        },
        animation: {
          kind: 'story',
          cast: [
            { id: 'writer', icon: '✍️', label: 'Writer' },
            { id: 'cards', icon: '🗂️', label: 'The cards' },
            { id: 'guide', icon: '🧭', label: 'Planner' },
          ],
          frames: [
            { id: 'f1', caption: 'Every new row means new cards to file. ✍️', shout: { text: 'WRITES PAY TOO', tone: 'info' }, cast: [{ id: 'writer', state: 'working' }], tokens: [{ id: 'newrow', icon: '✍️', label: 'new row', at: 'writer', effect: 'pop' }] },
            { id: 'f2', caption: 'More cards = a heavier backpack on every write. 🎒', shout: { text: 'HEAVIER WRITES', tone: 'bad' }, mood: 'bad', cast: [{ id: 'cards', state: 'working' }], tokens: [{ id: 'pack', icon: '🎒', label: '10 indexes', at: 'cards', effect: 'pop' }] },
            { id: 'f3', caption: 'A fuzzy match, like “almost everyone”? Cards cannot help. 🤷', shout: { text: 'CARDS NO HELP', tone: 'bad' }, mood: 'bad', cast: [{ id: 'guide', state: 'idle', face: '🤷' }], tokens: [{ id: 'shrug', icon: '🌫️', label: 'too fuzzy', at: 'guide', effect: 'pop' }] },
            { id: 'f4', caption: 'Then it is cheaper to just walk the shelf. 🚶', shout: { text: 'JUST WALK IT', tone: 'info' }, cast: [{ id: 'guide', state: 'working' }], tokens: [{ id: 'walk', icon: '🚶', label: 'scan', at: 'guide', effect: 'float' }] },
            { id: 'f5', caption: 'Keep only the cards you really use. ✅', shout: { text: 'KEEP IT LEAN ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'cards', state: 'happy' }], tokens: [{ id: 'broom', icon: '🧹', label: 'drop extras', at: 'cards', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      "Leading wildcards (LIKE '%foo') cannot use a B+Tree: rewrite as a prefix LIKE 'foo%' or add a trigram/GIN index.",
      'Wrapping the indexed column in a function (WHERE lower(email) = ?) disables the index: index the expression or normalize on write.',
      'Adding an index for every foreign key without checking usage taxes every write — keep only the indexes that queries actually exercise.',
      'Forgetting that a non-covering index adds a random row fetch per match: extend the index to cover selected columns or accept the scan.',
      "Assuming an index is always faster: for low-selectivity predicates such as status = 'active', a sequential scan is often cheaper.",
    ],
    followUps: [
      { q: 'What is a covering index?', a: 'An index that contains every column the query needs, so the engine answers from the index alone and skips heap row fetches entirely.' },
      { q: 'How do you order columns in a composite index?', a: 'Equality-filtered columns first, then range columns, mirroring the leftmost-prefix rule; columns after a range cannot be used for seeking.' },
      { q: 'What is a partial index?', a: `An index with a WHERE clause, such as ON orders (created_at) WHERE status = 'pending': it is smaller, cheaper to maintain, and the planner can use it when the query carries the same predicate.` },
      { q: 'Why would the planner ignore an index that exists?', a: 'Cost estimation: with low selectivity or stale statistics it predicts that scanning fewer pages sequentially beats many random index and heap reads.' },
      { q: 'What does EXPLAIN ANALYZE tell you?', a: 'The chosen plan, estimated versus actual row counts, and per-node timing — including whether a sequential scan ran where you expected an index scan.' },
    ],
    relatedEngine: { label: 'Explore the SQL Cosmos visualizer', href: '/fullstack/sqlcosmos' },
  },
  {
    slug: 'cors-preflight-when-fetch-fails',
    category: 'fullstack',
    topic: 'Browser',
    title: 'Why does my fetch to another origin fail with a CORS error?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'concept',
    type: 'debugging',
    tags: ['cors', 'http', 'headers', 'browser-security', 'preflight'],
    oneLiner:
      'The request succeeds on the network, yet JavaScript never sees the response — CORS is the browser insisting the other origin opts in before the read is allowed.',
    whyAsked:
      'CORS questions separate people who copied "add cors() middleware" from people who understand the browser as an enforcing client. Interviewers listen for three things: that the browser — not the server — blocks the read, that non-simple requests pay an OPTIONS preflight before the real call, and that the fix is response headers or a same-origin proxy, never a client-side trick.',
    mentalModel:
      'The browser is a bouncer inside the club: requests walk out freely, but a response only comes back to JavaScript if the other origin explicitly signs the guest list (Access-Control-Allow-Origin). Non-simple calls must first send a scout (OPTIONS) to confirm the guest list covers the method and headers — and the approval ticket is cached until it expires.',
    steps: [
      {
        title: 'The browser, not the server, blocks the read',
        body: `The first surprise: the request is not stopped. It travels to the other origin, the server processes it and returns a perfectly normal 200 with JSON. Then the browser inspects the response and — if there is no Access-Control-Allow-Origin header matching the page's origin — it withholds the body from JavaScript. Your catch block sees a generic TypeError: Failed to fetch, while the Network tab shows a completed request. Watch the animation: the packet reaches the API and comes back, yet the last mile into the page is where the read is denied. This is why CORS exists at all: without it, any evil.example page you visit could silently call your bank's API and read the authenticated response using your cookies.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'page', icon: '👤', label: 'Your page' },
            { id: 'guard', icon: '🕴️', label: 'Browser guard' },
            { id: 'site', icon: '🏪', label: 'Other website' },
          ],
          frames: [
            { id: 'f1', caption: 'Your page phones the other website. 📞', shout: { text: 'MAKE THE CALL', tone: 'info' }, cast: [{ id: 'page', state: 'working' }], tokens: [{ id: 'call', icon: '📞', label: 'GET data', from: 'page', to: 'site' }] },
            { id: 'f2', caption: 'The website answers happily with the data. 📦', shout: { text: 'THEY ANSWER', tone: 'info' }, cast: [{ id: 'site', state: 'done' }], tokens: [{ id: 'parcel', icon: '📦', label: 'the data', from: 'site', to: 'page' }] },
            { id: 'f3', caption: 'But the browser guard steps in: “Show me the guest list!” 🕴️', shout: { text: 'GUARD STOPS IT!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'guard', state: 'working', face: '🚫' }], tokens: [{ id: 'stop', icon: '✋', label: 'not on the list', at: 'guard', effect: 'shake' }] },
            { id: 'f4', caption: 'No guest list means the data stays hidden from you. 🙈', shout: { text: 'DATA HIDDEN!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'page', state: 'idle', face: '😕' }], tokens: [{ id: 'hidden', icon: '🙈', label: 'cannot read', at: 'page', effect: 'pop' }] },
            { id: 'f5', caption: 'Postman walks in free — no guard in that door. 🤷', shout: { text: 'NO GUARD, NO RULE', tone: 'info' }, cast: [{ id: 'site', state: 'done' }], tokens: [{ id: 'free', icon: '🤷', label: 'curl is fine', at: 'site', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Simple or non-simple: what triggers the OPTIONS call',
        body: `Not every cross-origin request pays a preflight. The specification defines a "simple" shape — GET, HEAD or POST, only safelisted headers, and Content-Type restricted to text/plain, multipart/form-data or application/x-www-form-urlencoded. Anything else is non-simple: a PUT or DELETE, a custom header like Authorization, or the everyday Content-Type: application/json. Non-simple requests cannot leave immediately; the browser must first ask the other origin for permission, because a blind request could already have side effects — a DELETE that fires before the browser decides the response may not be read is too late to undo. Compare the two panels: the left column is sent straight through, the right column is gated.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'request', icon: '📨', label: 'Your request' },
            { id: 'guard', icon: '🕴️', label: 'Browser guard' },
            { id: 'site', icon: '🏪', label: 'Other website' },
          ],
          frames: [
            { id: 'f1', caption: 'A plain “hello” request (GET) just walks in. 🚶', shout: { text: 'SIMPLE: WALK IN', tone: 'good' }, mood: 'good', cast: [{ id: 'request', state: 'working' }], tokens: [{ id: 'hello', icon: '👋', label: 'GET hello', from: 'request', to: 'guard' }] },
            { id: 'f2', caption: 'Same for plain text and basic headers — no questions asked. ✅', shout: { text: 'STILL SIMPLE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'guard', state: 'done' }], tokens: [{ id: 'plain', icon: '✅', label: 'plain text', at: 'guard', effect: 'pop' }] },
            { id: 'f3', caption: 'But a fancy request — JSON, PUT, extra headers — carries a bag. 🎒', shout: { text: 'FANCY REQUEST!', tone: 'info' }, cast: [{ id: 'request', state: 'working' }], tokens: [{ id: 'bag', icon: '🎒', label: 'JSON + headers', at: 'request', effect: 'pop' }] },
            { id: 'f4', caption: 'The guard says: wait here — I must ask first! ✋', shout: { text: 'WAIT HERE!', tone: 'info' }, cast: [{ id: 'guard', state: 'working', face: '✋' }], tokens: [{ id: 'hold', icon: '⏸️', label: 'hold on', at: 'guard', effect: 'pop' }] },
            { id: 'f5', caption: 'Only fancy requests need permission — that is the rule. 🏁', shout: { text: 'THAT IS THE RULE', tone: 'info' }, cast: [{ id: 'request', state: 'idle' }, { id: 'guard', state: 'idle' }], tokens: [{ id: 'rule', icon: '🏁', label: 'simple vs not', at: 'site', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'The OPTIONS handshake',
        body: `The preflight is an HTTP request the browser composes on its own — you cannot opt out of it. It sends OPTIONS with Access-Control-Request-Method and Access-Control-Request-Headers describing exactly what the real request intends to do. The server must reply with Access-Control-Allow-Origin, -Methods and -Headers that cover it. Only then does the browser release the actual request. The approval is cached for the duration of Access-Control-Max-Age, which is why the OPTIONS row often disappears from the Network tab on refresh. Watch the sequence: negotiate, cache, then the real PUT travels — a preflight is a round trip, so it is latency worth understanding and worth caching.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'guard', icon: '🕴️', label: 'Your guard' },
            { id: 'doorman', icon: '🧑‍💼', label: 'Other door' },
          ],
          frames: [
            { id: 'f1', caption: 'Your guard phones ahead: “Can my friend come with JSON?” 📞', shout: { text: 'PHONE AHEAD ☎️', tone: 'info' }, cast: [{ id: 'guard', state: 'working' }], tokens: [{ id: 'ask', icon: '📞', label: 'OPTIONS: PUT + auth?', from: 'guard', to: 'doorman' }] },
            { id: 'f2', caption: 'The other door checks its rules and writes back. 📋', shout: { text: 'THEY CHECK RULES', tone: 'info' }, cast: [{ id: 'doorman', state: 'working' }], tokens: [{ id: 'rules', icon: '📋', label: 'allowed: PUT', from: 'doorman', to: 'guard' }] },
            { id: 'f3', caption: 'Permission stamped — and remembered for next time. 🎫', shout: { text: 'STAMPED 🎫', tone: 'good' }, mood: 'good', cast: [{ id: 'guard', state: 'working' }], tokens: [{ id: 'stamp', icon: '🎫', label: 'valid 10 min', at: 'guard', effect: 'pop' }] },
            { id: 'f4', caption: 'Now the real request may finally go. 📨', shout: { text: 'NOW GO!', tone: 'info' }, cast: [{ id: 'guard', state: 'done' }], tokens: [{ id: 'real', icon: '📨', label: 'PUT data', from: 'guard', to: 'doorman' }] },
            { id: 'f5', caption: 'The answer comes back — and you can read it. ✅', shout: { text: 'YOU CAN READ IT ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'doorman', state: 'done' }], tokens: [{ id: 'read', icon: '✅', label: 'allowed!', from: 'doorman', to: 'guard' }] },
          ],
        },
      },
      {
        title: 'The response headers that grant access',
        body: `Every granting header carries one rule that trips people up. Allow-Origin must match the page origin exactly — the wildcard * works only for requests without credentials, and with cookies or Authorization it is rejected outright; the server has to echo the exact origin and add Access-Control-Allow-Credentials: true. Allow-Methods and Allow-Headers must name everything the real request uses, and one missing entry fails the whole preflight even if the rest is perfect. Max-Age is the performance lever most teams forget: with it, the browser stops asking on every call. Read the response headers like a contract — each line is one clause of what the browser is about to permit.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'doorman', icon: '🧑‍💼', label: 'Other door' },
            { id: 'guard', icon: '🕴️', label: 'Your guard' },
          ],
          frames: [
            { id: 'f1', caption: 'The guest list must name your page — exactly. 📋', shout: { text: 'NAME IT EXACTLY', tone: 'info' }, cast: [{ id: 'doorman', state: 'working' }], tokens: [{ id: 'list', icon: '📋', label: 'guests: your page', at: 'doorman', effect: 'pop' }] },
            { id: 'f2', caption: 'The moves and bags allowed must be listed too. 📝', shout: { text: 'MATCH THE LIST', tone: 'info' }, cast: [{ id: 'doorman', state: 'working' }], tokens: [{ id: 'moves', icon: '📝', label: 'PUT + auth ✓', at: 'doorman', effect: 'pop' }] },
            { id: 'f3', caption: 'A “remember for 10 minutes” stamp skips repeat calls. ⏱️', shout: { text: 'REMEMBER 10 MIN', tone: 'info' }, cast: [{ id: 'guard', state: 'working' }], tokens: [{ id: 'clock', icon: '⏱️', label: 'stamped', at: 'guard', effect: 'pop' }] },
            { id: 'f4', caption: 'Cookies + passport? “Anyone” is NOT allowed. 🍪🚫', shout: { text: 'NOT “ANYONE”!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'doorman', state: 'idle', face: '🚫' }], tokens: [{ id: 'cookie', icon: '🍪', label: 'with cookies', at: 'guard', effect: 'shake' }] },
            { id: 'f5', caption: 'Name your page exactly, set the stamp — you are in. ✅', shout: { text: 'YOU ARE IN ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'guard', state: 'happy' }], tokens: [{ id: 'win', icon: '✅', label: 'allowed', at: 'guard', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Debugging it in sixty seconds',
        body: `Treat the client error as a symptom, not a diagnosis. Open the Network tab and look for the OPTIONS row: if it is red, missing, or answered 404/405, the API is refusing to negotiate and the real request never ran. If OPTIONS is green but the real request is flagged, compare the granted headers against what the request actually sends — a missing method or header entry is the usual culprit. Then fix it where it lives: server-side middleware or gateway configuration, never in the fetch options, because the client cannot lift a browser-enforced block. When you do not control the API, proxy the call through your own origin — a Next.js rewrite or nginx location — and the browser never sees a cross-origin request at all.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'detective', icon: '🕵️', label: 'Debugger' },
            { id: 'logs', icon: '🗂️', label: 'Network log' },
            { id: 'site', icon: '🏪', label: 'Other website' },
          ],
          frames: [
            { id: 'f1', caption: 'Start at the network log, not the error message. 🗂️', shout: { text: 'OPEN THE LOGS', tone: 'info' }, cast: [{ id: 'detective', state: 'working' }], tokens: [{ id: 'search', icon: '🔍', label: 'where did it fail?', at: 'logs', effect: 'pop' }] },
            { id: 'f2', caption: 'A red OPTIONS row? That is the clue. 🚩', shout: { text: 'CLUE FOUND!', tone: 'info' }, cast: [{ id: 'logs', state: 'done' }], tokens: [{ id: 'clue', icon: '🚩', label: 'OPTIONS failed', at: 'logs', effect: 'pop' }] },
            { id: 'f3', caption: 'The fix is on THEIR side — add the guest list. ✍️', shout: { text: 'FIX IS SERVER-SIDE', tone: 'info' }, cast: [{ id: 'site', state: 'working' }], tokens: [{ id: 'fix', icon: '✍️', label: 'add headers', from: 'detective', to: 'site' }] },
            { id: 'f4', caption: 'No control over them? Send calls through your own door. 🚚', shout: { text: 'USE YOUR OWN DOOR', tone: 'info' }, cast: [{ id: 'detective', state: 'working' }], tokens: [{ id: 'proxy', icon: '🚚', label: 'proxy', at: 'detective', effect: 'pop' }] },
            { id: 'f5', caption: 'Case closed: permission granted, calls flow. ✅', shout: { text: 'CASE CLOSED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'detective', state: 'happy' }, { id: 'site', state: 'done' }], tokens: [{ id: 'solved', icon: '✅', label: 'working', at: 'site', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'A failed preflight means the real request never happens: the browser aborts before your PUT exists on the network, so the server logs can look empty even though the client "sent" it.',
      'The wildcard ACAO value (*) is incompatible with credentialed requests — cookies or Authorization: include require the exact origin plus Access-Control-Allow-Credentials: true.',
      'CORS failures surface as a generic TypeError in JavaScript: the real reason is only in the console and the Network tab, so never debug them from the catch block alone.',
      'A 500 from the API can masquerade as a CORS failure when the error response is missing the ACAO header — the browser hides even the status code from JavaScript.',
      'The preflight cache is keyed per URL, method and header set, and browsers cap Max-Age (Chrome around two hours), so "it worked yesterday" can still mean a fresh OPTIONS today.',
    ],
    followUps: [
      { q: 'Does CORS protect the server or the user?', a: 'The user: it stops a site you visit from silently reading authenticated responses from other origins using your cookies. The server is not shielded — curl and any non-browser client ignore CORS entirely.' },
      { q: 'Why does Postman work when the browser fails?', a: 'CORS is enforced by the browser, not the network. Postman is not a browser, so it never performs the check and never withholds the response.' },
      { q: 'How do you pass cookies on a cross-origin request?', a: 'credentials: "include" in fetch on the client; on the server the exact origin in Allow-Origin plus Access-Control-Allow-Credentials: true — and SameSite=None; Secure on the cookie itself if it must travel cross-site.' },
      { q: 'What is the difference between the preflight and the real request?', a: 'The preflight is a browser-issued OPTIONS asking what is allowed; the real request carries the payload and only leaves if the preflight granted permission, with its response re-checked against Allow-Origin.' },
      { q: 'When is a CORS proxy acceptable?', a: 'When you do not control the API: route calls through your own origin (Next.js rewrites, nginx) so the browser sees a same-origin request; keep secrets, caching and rate limits on the proxy.' },
    ],
    relatedEngine: { label: 'Explore the API visualizer', href: '/fullstack/apiviz' },
  },
  {
    slug: 'n-plus-one-queries-orm',
    category: 'fullstack',
    topic: 'Databases',
    title: 'Why does a single page fire 101 database queries?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'concept',
    type: 'debugging',
    tags: ['orm', 'n+1', 'sql', 'dataloader', 'performance'],
    oneLiner:
      'One query becomes 101 because the ORM loads relations lazily — the fix is one join or one batch, but the interview is about proving you know why.',
    whyAsked:
      'N+1 is the most common production performance bug in web backends, and interviewers treat it as a fluency test: do you read what the ORM actually sends instead of trusting its API? Strong answers point at the query log as the source of truth, distinguish a join from a batched IN query, and know why GraphQL makes the pattern worse — one resolver runs per field, per object.',
    mentalModel:
      'The ORM is waitstaff that fetches one dish per trip: ask for 100 posts and you get the list, but each post.author is a separate walk to the kitchen. Eager loading orders everything in a single join; batching queues all the orders together and sends one combined request. The bill is measured in round trips, not rows.',
    steps: [
      {
        title: 'The loop that hides a hundred round trips',
        body: `Nothing in this handler looks wrong. It fetches a list, loops over it, and attaches an author to each row — idiomatic code in almost every ORM. The problem is invisible at the call site and obvious in the query log: line 1 fires one SELECT for the list, and the loop body fires one more SELECT per row. With 100 posts that is 101 queries, and with 10,000 posts it is 10,001. The page still renders correctly, which is exactly why the bug survives code review and ships to production. If there were a query-count assertion on this endpoint's tests, the number would read as "grows with row count" — the signature interviewers want you to recognize on sight.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'waiter', icon: '🤖', label: 'Waiter (ORM)' },
            { id: 'kitchen', icon: '🧑‍🍳', label: 'Kitchen (DB)' },
          ],
          frames: [
            { id: 'f1', caption: 'One order for a hundred meals — the list, not the food. 📋', shout: { text: 'ORDER: 100 MEALS', tone: 'info' }, cast: [{ id: 'waiter', state: 'working' }], tokens: [{ id: 'list', icon: '📋', label: 'the list', at: 'waiter', effect: 'pop' }] },
            { id: 'f2', caption: 'The waiter fetches each meal on its own trip. 🏃', shout: { text: 'ONE TRIP EACH?', tone: 'info' }, cast: [{ id: 'kitchen', state: 'working' }], tokens: [{ id: 'trip1', icon: '🏃', label: 'trip 1', from: 'waiter', to: 'kitchen' }] },
            { id: 'f3', caption: 'Trip 2… trip 3… a hundred little walks. 🏃🏃', shout: { text: '100 TRIPS?!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'waiter', state: 'working' }], tokens: [{ id: 'many', icon: '🔢', label: '101 trips', at: 'waiter', effect: 'pop' }] },
            { id: 'f4', caption: 'The food is right — delivered a hundred walks later. 😩', shout: { text: 'SO MANY TRIPS', tone: 'bad' }, mood: 'bad', cast: [{ id: 'waiter', state: 'crashed' }, { id: 'kitchen', state: 'done' }], tokens: [{ id: 'slow', icon: '🐌', label: 'scales with rows', at: 'waiter', effect: 'pop' }] },
            { id: 'f5', caption: 'That is N+1: one list, then N little trips. 📈', shout: { text: 'N + 1 TRIPS', tone: 'bad' }, mood: 'bad', cast: [{ id: 'waiter', state: 'crashed' }], tokens: [{ id: 'trend', icon: '📈', label: 'grows forever', at: 'kitchen', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Why lazy loading keeps it silent',
        body: `The ORM did not lie to you: it returned proxies, not data. When the first query loads 100 posts, relation fields like post.author are placeholders that promise to fetch later — the moment any code reads one, the ORM issues a query behind the scenes. That laziness is a feature at small scale, which is why it is the default; it becomes a trap when the access happens inside a loop, a serializer, or a template. Notice where the loop actually runs: sometimes it is a visible for-loop, but just as often it is toJSON(), a presenter layer, or GraphQL resolving each author field separately. Watch the animation — the trigger is not your query call, it is the innocent property access, which is why grepping for find() calls never finds this bug.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'cards', icon: '📇', label: 'Placeholder cards' },
            { id: 'kitchen', icon: '🧑‍🍳', label: 'Kitchen (DB)' },
          ],
          frames: [
            { id: 'f1', caption: 'The app asks for the list — and gets placeholder cards. 📇', shout: { text: 'PLACEHOLDERS!', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'cards', icon: '📇', label: '×100', from: 'app', to: 'cards' }] },
            { id: 'f2', caption: 'Every card says: “ask the kitchen when you need me.” 📝', shout: { text: 'PAY LATER', tone: 'info' }, cast: [{ id: 'cards', state: 'working' }], tokens: [{ id: 'iou', icon: '📝', label: 'lazy', at: 'cards', effect: 'pop' }] },
            { id: 'f3', caption: 'Touching card #1 secretly sends a waiter! 🏃', shout: { text: 'SNEAKY TRIP!', tone: 'info' }, cast: [{ id: 'kitchen', state: 'working' }], tokens: [{ id: 'secret', icon: '🏃', label: 'hidden query', from: 'cards', to: 'kitchen' }] },
            { id: 'f4', caption: 'The display step touches all 100 cards. 🏃🏃', shout: { text: 'ALL 100 TOUCHED', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'crashed' }], tokens: [{ id: 'storm', icon: '🌪️', label: '100 trips', at: 'kitchen', effect: 'pop' }] },
            { id: 'f5', caption: 'The loop hid in the display code — not in the query you wrote. 🙈', shout: { text: 'HIDDEN LOOP!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'cards', state: 'crashed' }], tokens: [{ id: 'hide', icon: '🙈', label: 'serializer loop', at: 'cards', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'The waterfall: why N round trips compound',
        body: `A single query against a local database feels free — fractions of a millisecond — so the loop looks harmless in development. Production changes the arithmetic: every query crosses a network, checks out a connection, parses and plans, and the awaits are strictly serialized, so each round trip waits for the one before it. At only 1 ms per trip, 100 rows add 100 ms of pure waiting before rendering starts; under load, connection polling and lock waits make it far worse, and p99 latency sails past the timeouts. The animation shows the shape that should be burned into memory: a staircase of round trips instead of one step. N+1 is not a SQL problem — the queries are individually fast — it is a round-trip multiplication problem, which is why batching survives even when a join is inconvenient.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'kitchen', icon: '🧑‍🍳', label: 'Kitchen (DB)' },
            { id: 'clock', icon: '⏰', label: 'Waiting time' },
          ],
          frames: [
            { id: 'f1', caption: 'Each little trip waits for the one before it. 🚶', shout: { text: 'ONE BY ONE', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'queue', icon: '🚶', label: 'queued', at: 'app', effect: 'pop' }] },
            { id: 'f2', caption: '1 ms per trip × 100 trips = 100 ms of pure waiting. ⏱️', shout: { text: '100 MS GONE', tone: 'bad' }, mood: 'bad', cast: [{ id: 'clock', state: 'working' }], tokens: [{ id: 'time', icon: '⏱️', label: '100 ms', at: 'clock', effect: 'pop' }] },
            { id: 'f3', caption: 'Under load, the little staircase grows steeper. 📈', shout: { text: 'WORSE UNDER LOAD', tone: 'bad' }, mood: 'bad', cast: [{ id: 'clock', state: 'crashed' }], tokens: [{ id: 'steeper', icon: '📈', label: 'timeouts', at: 'app', effect: 'pop' }] },
            { id: 'f4', caption: 'One big trip beats a hundred little walks. 🛒', shout: { text: 'ONE BIG TRIP!', tone: 'good' }, mood: 'good', cast: [{ id: 'kitchen', state: 'working' }], tokens: [{ id: 'cart', icon: '🛒', label: 'everything', from: 'app', to: 'kitchen' }] },
            { id: 'f5', caption: 'So count round trips — not rows. 📏', shout: { text: 'COUNT TRIPS', tone: 'info' }, cast: [{ id: 'kitchen', state: 'done' }], tokens: [{ id: 'ruler', icon: '📏', label: '1 trip', at: 'app', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Fix one: eager loading with a join',
        body: `The smallest change with the biggest payoff: tell the ORM upfront that you will need the authors, so it plans a single query instead of a discovery sequence. In most ORMs that is an include, with, or populate option that compiles to a JOIN, and the query count drops from 101 to 1 regardless of row count. The trade-off to name out loud: a join to a belongs-to relation is safe, but joining a has-many relation multiplies parent rows — 100 posts with 10 comments each return 1000 rows with the post payload duplicated, which is often worse than a second query. Compare the panels: the left column is the same code with one line removed, the right column is the same intent expressed as one statement. Interviewers are listening for whether you know the join's row-multiplication caveat, not just the incantation.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'smart', icon: '🤵', label: 'The smart cart' },
            { id: 'kitchen', icon: '🧑‍🍳', label: 'Kitchen (DB)' },
          ],
          frames: [
            { id: 'f1', caption: 'The lazy version: “I will walk. One hundred times.” 🏃', shout: { text: '100 WALKS', tone: 'bad' }, mood: 'bad', cast: [{ id: 'smart', state: 'crashed', face: '😩' }], tokens: [{ id: 'walks', icon: '🏃', label: '×100', at: 'smart', effect: 'pop' }] },
            { id: 'f2', caption: 'The smart version: “Bring everything on one cart.” 🛒', shout: { text: 'ONE CART!', tone: 'good' }, mood: 'good', cast: [{ id: 'smart', state: 'working' }], tokens: [{ id: 'cart', icon: '🛒', label: 'join it all', from: 'smart', to: 'kitchen' }] },
            { id: 'f3', caption: 'The cart arrives carrying meals AND their authors. 🍱', shout: { text: 'ALL AT ONCE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'kitchen', state: 'done' }], tokens: [{ id: 'tray', icon: '🍱', label: '1 query', from: 'kitchen', to: 'smart' }] },
            { id: 'f4', caption: 'Careful: 100 meals × 10 comments = 1,000 boxes. 📦', shout: { text: 'CART CAN OVERFLOW', tone: 'bad' }, mood: 'bad', cast: [{ id: 'smart', state: 'idle', face: '😳' }], tokens: [{ id: 'overflow', icon: '📦', label: '×1000', at: 'kitchen', effect: 'pop' }] },
            { id: 'f5', caption: 'One cart for side dishes; two smart trips for big families. 📏', shout: { text: 'PICK YOUR CART', tone: 'info' }, cast: [{ id: 'smart', state: 'done' }], tokens: [{ id: 'rulebook', icon: '📏', label: 'the rule', at: 'smart', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Fix two: batch the lookups (DataLoader)',
        body: `Joins do not cover every case — GraphQL resolvers run per field per object by design, and has-many relations multiply rows under a join — so the second cure is batching. The hairdresser trick: instead of each resolver querying immediately, it hands its key to a loader that waits until the next tick, collects every key requested so far, and fires one WHERE id IN (…) query for the whole set, then distributes rows back to the callers that asked. DataLoader is the canonical implementation, and its per-request cache means a repeated key costs nothing extra. Watch the animation: 100 individual asks become one batched question at the database. Two limits to respect — chunk huge ID lists to stay under parameter limits, and scope the cache per request so stale rows never leak between users.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'orders', icon: '🧑‍🤝‍🧑', label: '100 orders' },
            { id: 'collector', icon: '🗃️', label: 'Collector' },
            { id: 'kitchen', icon: '🧑‍🍳', label: 'Kitchen (DB)' },
          ],
          frames: [
            { id: 'f1', caption: 'Every order hands its little number to the collector. 🎫', shout: { text: 'COLLECT ORDERS', tone: 'info' }, cast: [{ id: 'orders', state: 'working' }], tokens: [{ id: 'id', icon: '🎫', label: 'id 17', from: 'orders', to: 'collector' }] },
            { id: 'f2', caption: 'No kitchen trips yet — wait for the whole group. ⏳', shout: { text: 'WAIT FOR ALL', tone: 'info' }, cast: [{ id: 'collector', state: 'working' }], tokens: [{ id: 'wait', icon: '⏳', label: '99 more…', at: 'collector', effect: 'pop' }] },
            { id: 'f3', caption: 'One big batch order goes to the kitchen! 📨', shout: { text: 'ONE BATCH!', tone: 'good' }, mood: 'good', cast: [{ id: 'kitchen', state: 'working' }], tokens: [{ id: 'batch', icon: '📨', label: 'all 100 ids', from: 'collector', to: 'kitchen' }] },
            { id: 'f4', caption: 'The kitchen cooks everything at once on one tray. 🍱', shout: { text: 'ALL COOKED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'kitchen', state: 'done' }], tokens: [{ id: 'tray', icon: '🍱', label: '1 trip', from: 'kitchen', to: 'collector' }] },
            { id: 'f5', caption: 'Each order gets exactly its meal. Repeat order? Free. ✅', shout: { text: 'EVERYONE SERVED', tone: 'good' }, mood: 'good', cast: [{ id: 'orders', state: 'happy' }], tokens: [{ id: 'served', icon: '🍽️', label: 'handed out', from: 'collector', to: 'orders' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Joins multiply rows for has-many relations: 100 posts × 10 comments returns 1000 rows with duplicated post payloads — a separate batched IN query usually costs less than the fan-out.',
      'The guilty loop often hides in the serialization layer: toJSON(), presenters, or template rendering can touch relations per row, so grep for property access, not just for query calls.',
      'Batching has a ceiling: WHERE id IN (…) with tens of thousands of keys hits bind-parameter and packet limits — chunk the ids (a few hundred to a thousand per batch) and paginate the parent list itself.',
      'Development data hides it completely: ten rows in a local database never show the problem, so assert query counts in tests and watch per-request query metrics in production.',
      'The DataLoader cache must be scoped to the request: a module-level cache leaks rows across users and upgrades a performance bug into a correctness and privacy bug.',
    ],
    followUps: [
      { q: 'What is a DataLoader?', a: 'A per-request utility that collects keys requested in the same tick, fires one batched query, and distributes results back — the standard cure for N+1 in GraphQL resolvers and any per-item lookup pattern.' },
      { q: 'When is a join worse than a batch query?', a: 'When it multiplies wide parent rows across many children, inflating payloads and memory; parents-first plus one IN query keeps rows minimal and is easy to cache — two round trips can beat one exploding join.' },
      { q: 'How do you detect N+1 in production?', a: 'Measure queries per request: ORM query logging in development, APM traces that count database calls per request in production — the N+1 signature is a count that grows linearly with row count.' },
      { q: 'Lazy, eager, and explicit loading — what is the difference?', a: 'Lazy fetches a relation on first access (the N+1 trap, and the default in most ORMs), eager fetches it upfront with the parent query via include/WITH, and explicit lets you trigger either on purpose when you know the access pattern.' },
      { q: 'Does N+1 matter if the database is on localhost?', a: 'Less visibly, not less really: round trips shrink to microseconds, but connection checkout, parsing, and planning still multiply by N — and the moment the database moves behind a network, the same code explodes.' },
    ],
    relatedEngine: { label: 'Explore the SQL Cosmos visualizer', href: '/fullstack/sqlcosmos' },
  },
  {
    slug: 'rendering-strategy-ssr-ssg-isr-csr',
    category: 'fullstack',
    topic: 'Architecture',
    title: 'How do you choose between CSR, SSR, SSG and ISR?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'system-design',
    type: 'design',
    tags: ['next.js', 'rendering', 'architecture', 'caching', 'trade-offs'],
    oneLiner:
      'Four acronyms, one question underneath: when is the HTML built? The architecture decision is picking per route — not per app.',
    whyAsked:
      'Rendering strategy is the first architecture decision in any modern fullstack app, and it exposes whether you weigh trade-offs or recite framework defaults. Interviewers listen for the axes: freshness, personalization, SEO, and cost. Strong candidates pick per route — a marketing page and an admin dashboard in the same app rarely want the same answer — and can name what each choice does to first paint, caching, and hydration.',
    mentalModel:
      'Reframe the acronyms as one clock: when is the HTML built? At build time (SSG), per request (SSR), after first paint in the browser (CSR), or at build time with scheduled rebuilds (ISR). Every trade-off follows from that clock plus one hard constraint: who is allowed to see this page — everyone, or only the person logged in? Cached HTML and personalization do not mix.',
    steps: [
      {
        title: 'Client-side: the blank first paint',
        body: `Start from the failure mode that made SSR popular again. In a pure CSR app the server ships a nearly empty HTML shell plus a JavaScript bundle; the browser must download, parse, and execute the bundle before it can fetch data and paint anything meaningful. The navigation looks instant on a fast laptop with a warm cache, and disastrous on a mid-range phone on 4G — the user stares at white for seconds. The trade-offs to name: per-request server cost drops to zero and client navigation is frictionless, but first paint is the slowest of all strategies, the HTML shell is invisible to crawlers and link previews, and every new user pays the full boot cost. Watch the animation: the screen lane stays blank until the very end, no matter how fast the server was.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'user', icon: '👤', label: 'Visitor' },
            { id: 'box', icon: '📦', label: 'Empty box' },
            { id: 'parts', icon: '🧰', label: 'Parts + recipe' },
          ],
          frames: [
            { id: 'f1', caption: 'A box arrives instantly — but there is nothing inside. 📦', shout: { text: 'EMPTY BOX!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'user', state: 'working' }], tokens: [{ id: 'empty', icon: '🕸️', label: 'nothing yet', at: 'box', effect: 'pop' }] },
            { id: 'f2', caption: 'The parts and the recipe are still shipping. 🧰🚚', shout: { text: 'PARTS SHIPPING…', tone: 'bad' }, mood: 'bad', cast: [{ id: 'parts', state: 'working' }], tokens: [{ id: 'shipping', icon: '🚚', label: 'on the way', from: 'parts', to: 'box' }] },
            { id: 'f3', caption: 'Only after the parts land can building start. 👨‍🍳', shout: { text: 'STILL WAITING…', tone: 'bad' }, mood: 'bad', cast: [{ id: 'user', state: 'idle', face: '😴' }], tokens: [{ id: 'wait', icon: '⏳', label: 'yawn', at: 'user', effect: 'float' }] },
            { id: 'f4', caption: 'Seconds later, the page finally appears. 🎨', shout: { text: 'FINALLY!', tone: 'info' }, cast: [{ id: 'user', state: 'happy' }, { id: 'box', state: 'done' }], tokens: [{ id: 'paint', icon: '🖼️', label: 'the page', at: 'box', effect: 'pop' }] },
            { id: 'f5', caption: 'Slow first bite, quick refills — that is CSR. 🐢➡️🐇', shout: { text: 'SLOW START, FAST AFTER', tone: 'info' }, cast: [{ id: 'user', state: 'happy' }], tokens: [{ id: 'fast', icon: '🐇', label: 'later clicks', at: 'user', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Static: build once, serve from the edge',
        body: `The opposite pole: render every page to HTML at deploy time, with its data already baked in, and copy the files to CDN caches worldwide. A visitor anywhere gets finished HTML from a nearby edge in single-digit milliseconds — no origin server, no database, no per-request render. This is the cheapest and fastest strategy, and it scales by default on a CDN budget. Its one weakness is the freshness clock: content is as old as the last deploy. That is perfect for blogs, docs, and marketing pages whose changes you control, and wrong for anything that changes on its own schedule. Watch the animation: the build is the only expensive step, and the visitor never touches the origin.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'factory', icon: '🏭', label: 'Factory (build)' },
            { id: 'warehouse', icon: '📦', label: 'Warehouse' },
            { id: 'user', icon: '👤', label: 'Visitor' },
          ],
          frames: [
            { id: 'f1', caption: 'At build time the factory makes every page once. 🔨', shout: { text: 'MADE ONCE', tone: 'info' }, cast: [{ id: 'factory', state: 'working' }], tokens: [{ id: 'build', icon: '🔨', label: 'all pages', at: 'factory', effect: 'pop' }] },
            { id: 'f2', caption: 'Copies are stocked in warehouses near everyone. 📦', shout: { text: 'STOCKED EVERYWHERE', tone: 'info' }, cast: [{ id: 'warehouse', state: 'working' }], tokens: [{ id: 'stock', icon: '📦', label: 'copies', from: 'factory', to: 'warehouse' }] },
            { id: 'f3', caption: 'A visitor grabs one off the shelf — instant. ⚡', shout: { text: 'INSTANT PICKUP ⚡', tone: 'good' }, mood: 'good', cast: [{ id: 'user', state: 'happy' }], tokens: [{ id: 'quick', icon: '⚡', label: 'milliseconds', from: 'warehouse', to: 'user' }] },
            { id: 'f4', caption: 'Fresh? Only as fresh as the last delivery. 📅', shout: { text: 'FRESH AS DEPLOY', tone: 'info' }, cast: [{ id: 'warehouse', state: 'done' }], tokens: [{ id: 'calendar', icon: '📅', label: 'last build', at: 'warehouse', effect: 'pop' }] },
            { id: 'f5', caption: 'Cheapest and fastest — until content changes. 🏆', shout: { text: 'FASTEST & CHEAPEST', tone: 'good' }, mood: 'good', cast: [{ id: 'user', state: 'done' }], tokens: [{ id: 'trophy', icon: '🏆', label: 'for static data', at: 'user', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Per request: server-render the answer',
        body: `When the page depends on who is asking — a dashboard, an account page, a search result — no shared cache can hold it. SSR renders the HTML on every request: the server runs the data queries, produces complete markup for this specific user, and sends it back ready to paint. First paint shows real content, crawlers and previews see full HTML, and personalization is safe because nothing is shared. The price is structural: every request pays render time plus query time, the CDN helps little because responses are per-user, and the server fleet must scale with traffic instead of a static file cache. The design instinct to voice: cache what is shareable, render what is personal, and never let a CDN cache a page containing someone else's name.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'user', icon: '🙋', label: 'Visitor' },
            { id: 'chef', icon: '🧑‍🍳', label: 'Chef (server)' },
            { id: 'fridge', icon: '🗄️', label: 'Fridge (DB)' },
          ],
          frames: [
            { id: 'f1', caption: 'This visitor wants it made fresh, just for them. 🙋', shout: { text: 'MADE FOR YOU', tone: 'info' }, cast: [{ id: 'user', state: 'working' }], tokens: [{ id: 'order', icon: '🙋', label: 'my own page', at: 'user', effect: 'pop' }] },
            { id: 'f2', caption: 'The chef starts cooking immediately. 🍳', shout: { text: 'COOKING NOW', tone: 'info' }, cast: [{ id: 'chef', state: 'working' }], tokens: [{ id: 'cook', icon: '🍳', label: 'per request', at: 'chef', effect: 'pop' }] },
            { id: 'f3', caption: 'Fresh ingredients from the fridge — only what suits you. 🧊', shout: { text: 'FRESH FROM FRIDGE', tone: 'info' }, cast: [{ id: 'fridge', state: 'working' }], tokens: [{ id: 'fresh', icon: '🧊', label: 'your rows', from: 'fridge', to: 'chef' }] },
            { id: 'f4', caption: 'The dish arrives fully cooked — nothing lukewarm. 🍲', shout: { text: 'FRESH PAGE 🍲', tone: 'good' }, mood: 'good', cast: [{ id: 'user', state: 'happy' }], tokens: [{ id: 'dish', icon: '🍲', label: 'done', from: 'chef', to: 'user' }] },
            { id: 'f5', caption: 'But every guest needs their own cooking — expensive. 💰', shout: { text: 'EVERY GUEST COOKS', tone: 'info' }, cast: [{ id: 'chef', state: 'done' }], tokens: [{ id: 'cost', icon: '💰', label: 'server cost', at: 'chef', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'The middle ground: ISR (stale-while-revalidate)',
        body: `Most content is not per-user and not per-deploy either: product listings, news, catalogs — shared by everyone, changing on their own schedule. ISR treats the page as a cached static file with a TTL, and adds one rule that makes it scale: when the cache expires, the next visitor still gets the stale copy instantly while a single background rebuild runs. Freshness arrives seconds later, for everyone, without any visitor waiting and without a rebuild per request. This is the stale-while-revalidate family of design — the same move HTTP caching uses — and it is why the pattern dominates e-commerce and content sites. Watch the animation: precisely one rebuild per interval, no matter how many visitors hit the stale window.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'warehouse', icon: '📦', label: 'Warehouse' },
            { id: 'chef', icon: '🧑‍🍳', label: 'Chef (origin)' },
            { id: 'user', icon: '👤', label: 'Visitor' },
          ],
          frames: [
            { id: 'f1', caption: 'Everyone grabs the pre-made meal — instant. ⚡', shout: { text: 'SERVE FAST ⚡', tone: 'good' }, mood: 'good', cast: [{ id: 'user', state: 'happy' }], tokens: [{ id: 'grab', icon: '⚡', label: 'no wait', from: 'warehouse', to: 'user' }] },
            { id: 'f2', caption: 'It has been sitting a while — aging past its timer. ⏳', shout: { text: 'IT IS AGING…', tone: 'info' }, cast: [{ id: 'warehouse', state: 'working' }], tokens: [{ id: 'age', icon: '⏳', label: 'a bit old', at: 'warehouse', effect: 'float' }] },
            { id: 'f3', caption: 'A new visitor still gets the old one — no waiting! 🏃', shout: { text: 'OLD IS FINE', tone: 'info' }, cast: [{ id: 'user', state: 'working' }], tokens: [{ id: 'stale', icon: '📦', label: 'yesterday’s', from: 'warehouse', to: 'user' }] },
            { id: 'f4', caption: 'Meanwhile the chef quietly cooks one fresh batch. 🔄', shout: { text: 'QUIET REFRESH', tone: 'info' }, cast: [{ id: 'chef', state: 'working' }], tokens: [{ id: 'refresh', icon: '🔄', label: 'in secret', from: 'warehouse', to: 'chef' }] },
            { id: 'f5', caption: 'One fresh batch for everyone. Nobody ever waited. 🎉', shout: { text: 'NOBODY WAITS ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'warehouse', state: 'done' }, { id: 'chef', state: 'done' }], tokens: [{ id: 'party', icon: '🎉', label: 'fresh + fast', at: 'user', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Making the decision per route',
        body: `The real interview answer is a mapping, not a favorite. Start from the content clock: if you control when content changes, static wins — SSG, or ISR when it changes between deploys. If each response depends on the requester, the cache is off the table: SSR, with per-user cache keys only if you are certain about the boundaries. If SEO and first paint are business-critical, the blank shell of CSR is disqualified before performance even enters the conversation. And when none of the hard constraints apply — a logged-in internal tool, an interactive editor — CSR quietly wins on simplicity and infrastructure cost. Modern frameworks make this per-route, so one app can mix all four; the skill being tested is knowing which clock each route runs on, and naming the one constraint that eliminates an option outright.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'blog', icon: '📝', label: 'Blog page' },
            { id: 'dash', icon: '📊', label: 'Dashboard' },
            { id: 'shop', icon: '🛒', label: 'Catalog' },
          ],
          frames: [
            { id: 'f1', caption: 'A blog that changes when YOU publish? Pre-make it. 📝', shout: { text: 'BLOG → PRE-MADE', tone: 'good' }, mood: 'good', cast: [{ id: 'blog', state: 'done' }], tokens: [{ id: 'static', icon: '📦', label: 'bake at build', at: 'blog', effect: 'pop' }] },
            { id: 'f2', caption: 'A private dashboard? Cook fresh per visitor. 📊', shout: { text: 'DASHBOARD → FRESH', tone: 'info' }, cast: [{ id: 'dash', state: 'working' }], tokens: [{ id: 'private', icon: '🙋', label: 'per person', at: 'dash', effect: 'pop' }] },
            { id: 'f3', caption: 'A big catalog? Pre-make AND refresh often. 🛒', shout: { text: 'CATALOG → PRE-MADE + REFRESH', tone: 'good' }, mood: 'good', cast: [{ id: 'shop', state: 'done' }], tokens: [{ id: 'isr', icon: '🔄', label: 'auto-refresh', at: 'shop', effect: 'pop' }] },
            { id: 'f4', caption: 'An internal tool? Even an empty box is fine. 🧰', shout: { text: 'INTERNAL → BOX IS OK', tone: 'info' }, cast: [{ id: 'dash', state: 'idle', face: '😎' }], tokens: [{ id: 'chill', icon: '🧰', label: 'no SEO', at: 'dash', effect: 'pop' }] },
            { id: 'f5', caption: 'No single winner — every page picks its own clock. 🏁', shout: { text: 'PICK PER PAGE 🏁', tone: 'good' }, mood: 'good', cast: [{ id: 'blog', state: 'happy' }, { id: 'shop', state: 'happy' }], tokens: [{ id: 'clock', icon: '⏰', label: 'each route', at: 'dash', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Cached HTML and auth do not mix: a CDN-cached SSR page served to the wrong user leaks data — vary the cache key per user/session or keep personalized fragments client-side.',
      'ISR serves stale on the expired hit: the first visitor after expiry gets the old page while the rebuild runs, so the design must tolerate one outdated response.',
      'SSG at scale means long builds: 100k product pages regenerated on every publish can be worse operationally than SSR behind a cache — shard, or move to on-demand revalidation.',
      'Hydration errors are the hidden invoice of SSR: server markup must match the first client render exactly, or the framework throws the HTML away and re-renders from scratch.',
      'CSR is not invisible to SEO but it is late: crawlers execute JavaScript today, yet first paint, social previews, and slow devices still suffer without prerendered HTML.',
    ],
    followUps: [
      { q: 'What is hydration?', a: 'The client-side process that attaches event handlers and state to server-rendered HTML. The HTML paints instantly; hydration is what makes it interactive — and mismatched markup forces a discard and re-render.' },
      { q: 'When would you pick CSR on purpose?', a: 'When the app lives behind auth, SEO is irrelevant, and interactivity dominates: internal tools, dashboards after login, editors. The blank shell costs nothing when users are already committed.' },
      { q: 'How do you mix strategies in one app?', a: 'Per route, not per app: static marketing and docs, ISR for the catalog, SSR for account pages, CSR islands for heavy widgets — modern frameworks make each route declare its own clock.' },
      { q: 'What does stale-while-revalidate mean?', a: 'Serve the cached (possibly expired) copy immediately and refresh it in the background for the next visitor — freshness with no one waiting. ISR, HTTP Cache-Control, and SWR cover the same pattern at three layers.' },
      { q: 'Is SSR slower than SSG for the user?', a: 'For first paint it can be: SSG serves a prebuilt file from the edge while SSR renders on the origin per request. But SSR beats CSR for first paint every time, because the content arrives in the HTML instead of after a JS boot.' },
    ],
    relatedEngine: { label: 'Explore the Next.js visualizer', href: '/fullstack/nextjscosmos' },
  },
  {
    slug: 'transaction-isolation-levels-anomalies',
    category: 'fullstack',
    topic: 'Databases',
    title: 'What do transaction isolation levels actually prevent?',
    difficulty: 'advanced',
    frequency: 'very-often',
    round: 'concept',
    type: 'concept',
    tags: ['sql', 'transactions', 'isolation', 'acid', 'concurrency'],
    oneLiner:
      'Every level answers one question — what may a transaction promise about what it read? — and stronger promises are paid for in conflicts and retries.',
    whyAsked:
      'Isolation levels are the sharpest test of whether you understand concurrency, because the happy-path answer ("wrap it in a transaction") is wrong in interesting ways. Interviewers listen for the anomaly ladder — dirty read, non-repeatable read, phantom — and for you to name your engine\u2019s default instead of reciting the textbook table. The strongest signal is knowing that real engines are stronger than the standard, and that SERIALIZABLE moves the failure into your retry loop.',
    mentalModel:
      'Each level is a promise about visibility. READ COMMITTED refreshes the snapshot per statement — you always see the latest committed world, so two statements can disagree. REPEATABLE READ freezes one snapshot for the whole transaction — reads are stable, but the set of rows can still shift under the standard. SERIALIZABLE adds conflict detection that aborts one side rather than letting a contradiction commit.',
    steps: [
      {
        title: 'Dirty reads: acting on data that never existed',
        body: `The weakest level, READ UNCOMMITTED, lets a transaction read rows another transaction has written but not yet committed. The nightmare scenario is short: T1 reads T2's uncommitted withdrawal and makes a decision — approve a loan, skip a re-check, send a confirmation — and then T2 rolls back. The 0 T1 acted on never existed in any committed state of the database. Watch the animation: nothing about T1's SQL is wrong; the contract under it was simply absent. This anomaly is why every serious engine refuses to ship READ UNCOMMITTED as a default, and why the interesting interview ground is a level up: what your default still allows after dirty reads are gone.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'shopperA', icon: '🧑‍🦰', label: 'Shopper A' },
            { id: 'shopperB', icon: '🧔', label: 'Shopper B' },
            { id: 'shelf', icon: '🏷️', label: 'Price tag' },
          ],
          frames: [
            { id: 'f1', caption: 'Shopper A starts writing a new price on the tag. ✍️', shout: { text: 'WRITING…', tone: 'info' }, cast: [{ id: 'shopperA', state: 'working' }], tokens: [{ id: 'write', icon: '✍️', label: 'new price', at: 'shelf', effect: 'pop' }] },
            { id: 'f2', caption: 'Before it is finished, B peeks at the tag. 👀', shout: { text: 'PEEKING!', tone: 'info' }, cast: [{ id: 'shopperB', state: 'working' }], tokens: [{ id: 'peek', icon: '👀', label: 'reads 0', from: 'shopperB', to: 'shelf' }] },
            { id: 'f3', caption: 'A changes their mind and erases everything. ↩️', shout: { text: 'NEVER MIND!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperA', state: 'idle' }], tokens: [{ id: 'erase', icon: '🧽', label: 'erased', at: 'shelf', effect: 'pop' }] },
            { id: 'f4', caption: 'B acted on a price that never really existed. 😵', shout: { text: 'GHOST PRICE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperB', state: 'crashed' }], tokens: [{ id: 'ghost', icon: '👻', label: 'never real', at: 'shopperB', effect: 'float' }] },
            { id: 'f5', caption: 'Reading unfinished writing = dirty read. 🧼🚫', shout: { text: 'DIRTY READ', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shelf', state: 'crashed' }], tokens: [{ id: 'dirty', icon: '🧼', label: 'uncommitted', at: 'shelf', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'READ COMMITTED: fresh per statement, so re-reads drift',
        body: `Most engines — Postgres, Oracle, SQL Server — default to READ COMMITTED, and it feels safe: every statement sees a fresh snapshot, and dirty reads are impossible. The trap is across statements inside one transaction. T1 reads balance = 100, decides, and reads again — meanwhile T2 committed an update to 50 in between. Both reads are perfectly honest; they just describe different worlds, and any invariant T1 computed from the first read is now wrong. Watch the animation: nothing T1 did caused it, which is what makes this the most common production anomaly. It is invisible in single-statement operations and lethal in read-then-act flows — exactly the shape of payment, inventory, and seat-booking code.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'shopperA', icon: '🧑‍🦰', label: 'Shopper A' },
            { id: 'shopperB', icon: '🧔', label: 'Shopper B' },
            { id: 'shelf', icon: '🏷️', label: 'Price tag' },
          ],
          frames: [
            { id: 'f1', caption: 'A looks at the tag: ₹100. 🏷️', shout: { text: 'LOOK: ₹100', tone: 'info' }, cast: [{ id: 'shopperA', state: 'working' }], tokens: [{ id: 'read1', icon: '🏷️', label: '₹100', from: 'shelf', to: 'shopperA' }] },
            { id: 'f2', caption: 'B quietly rewrites it to ₹50 and finalizes. ✍️', shout: { text: 'CHANGED TO ₹50', tone: 'info' }, cast: [{ id: 'shopperB', state: 'done' }], tokens: [{ id: 'write', icon: '✍️', label: '₹50', from: 'shopperB', to: 'shelf' }] },
            { id: 'f3', caption: 'A looks again — ₹50?! During the same visit! 😵', shout: { text: 'IT CHANGED!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperA', state: 'crashed' }], tokens: [{ id: 'read2', icon: '🏷️', label: '₹50?!', from: 'shelf', to: 'shopperA', effect: 'shake' }] },
            { id: 'f4', caption: 'Two looks, one visit, two different prices. 📚', shout: { text: 'TWO STORIES', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shelf', state: 'crashed' }], tokens: [{ id: 'books', icon: '📚', label: '₹100 then ₹50', at: 'shelf', effect: 'pop' }] },
            { id: 'f5', caption: 'That is a non-repeatable read. 🙈', shout: { text: 'NON-REPEATABLE', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperA', state: 'crashed', face: '🙈' }], tokens: [{ id: 'hide', icon: '🙈', label: 'trust nothing', at: 'shopperA', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'REPEATABLE READ: stable rows, moving sets',
        body: `REPEATABLE READ freezes one snapshot for the entire transaction: read the same row twice and you get the same answer, no matter who commits in between. What the standard still allows is a phantom — T1 counts the rows matching a predicate, T2 inserts a matching row and commits, and T1's second count returns one more. Nothing T1 read changed; the set it asked about did, which is why phantoms break range-based invariants like "the sum of pending orders" or "no two overlapping bookings". The honest nuance to volunteer: real engines are stronger than the textbook. Postgres REPEATABLE READ is snapshot isolation and blocks phantoms too, and InnoDB adds gap locks on locking reads — so name your engine before reciting the table.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'shopperA', icon: '🧑‍🦰', label: 'Shopper A' },
            { id: 'shopperB', icon: '🧔', label: 'Shopper B' },
            { id: 'shelf', icon: '🍎', label: 'Apple shelf' },
          ],
          frames: [
            { id: 'f1', caption: 'A counts the apples: three. 🍎🍎🍎', shout: { text: 'COUNT: 3', tone: 'info' }, cast: [{ id: 'shopperA', state: 'working' }], tokens: [{ id: 'count1', icon: '🧮', label: '3 apples', at: 'shelf', effect: 'pop' }] },
            { id: 'f2', caption: 'B quietly slips one more apple onto the shelf. 🍏', shout: { text: 'SLIPPED ONE IN', tone: 'info' }, cast: [{ id: 'shopperB', state: 'done' }], tokens: [{ id: 'slip', icon: '🍏', label: 'sneaky', from: 'shopperB', to: 'shelf' }] },
            { id: 'f3', caption: 'A counts again — four?! With the same careful eyes! 😵', shout: { text: 'COUNT: 4?!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperA', state: 'crashed' }], tokens: [{ id: 'count2', icon: '🧮', label: '4?!', at: 'shelf', effect: 'shake' }] },
            { id: 'f4', caption: 'No apple was changed — the pile itself grew. 👻', shout: { text: 'GHOST APPLE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shelf', state: 'crashed' }], tokens: [{ id: 'ghost', icon: '👻', label: 'new row', at: 'shelf', effect: 'float' }] },
            { id: 'f5', caption: 'A brand-new row appearing out of nowhere: a phantom read. 👻', shout: { text: 'PHANTOM READ', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperA', state: 'crashed', face: '😱' }], tokens: [{ id: 'scare', icon: '😱', label: 'spooked', at: 'shopperA', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'SERIALIZABLE: conflicts become your retries',
        body: `SERIALIZABLE makes the database detect when concurrent transactions could not have run one after another in some order, and aborts one of them instead of committing a contradiction. It also closes the anomaly the screenshot-famous table forgets: write skew — two transactions that each read an overlapping set and write different rows, staying invisible to snapshot isolation. The bargain is explicit: the failure moves into the application, which must catch serialization errors (SQLSTATE 40001 in Postgres) and retry, bounded and idempotent. Watch the animation: T2 is aborted on a state that moved, then retried fresh. Interviewers are listening for that retry loop — calling SERIALIZABLE "just a safer setting" without owning the retries is the failure mode.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'shopperA', icon: '🧑‍🦰', label: 'Shopper A' },
            { id: 'shopperB', icon: '🧔', label: 'Shopper B' },
            { id: 'referee', icon: '🧑‍⚖️', label: 'The referee (DB)' },
          ],
          frames: [
            { id: 'f1', caption: 'Both shoppers grab the same item at the same moment. ⚔️', shout: { text: 'CLASH!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperA', state: 'working' }, { id: 'shopperB', state: 'working' }], tokens: [{ id: 'grabA', icon: '✊', label: 'mine!', at: 'shopperA', effect: 'pop' }, { id: 'grabB', icon: '✊', label: 'mine!', at: 'shopperB', effect: 'pop' }] },
            { id: 'f2', caption: 'The referee steps in: “Stop right there!” 🛑', shout: { text: 'REFEREE!', tone: 'info' }, cast: [{ id: 'referee', state: 'working' }], tokens: [{ id: 'whistle', icon: '📣', label: 'halt', at: 'referee', effect: 'burst' }] },
            { id: 'f3', caption: 'One gets a red card — even though nothing was wrong. 🟥', shout: { text: 'RED CARD!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'shopperB', state: 'crashed' }], tokens: [{ id: 'card', icon: '🟥', label: 'aborted', at: 'shopperB', effect: 'pop' }] },
            { id: 'f4', caption: 'B calmly tries again with fresh eyes. 🔄', shout: { text: 'TRY AGAIN', tone: 'info' }, cast: [{ id: 'shopperB', state: 'working' }], tokens: [{ id: 'retry', icon: '🔄', label: 'fresh start', from: 'shopperB', to: 'referee' }] },
            { id: 'f5', caption: 'Safe and fair — but your app must handle the retries. 📋', shout: { text: 'RETRIES ARE YOURS', tone: 'info' }, cast: [{ id: 'referee', state: 'done' }], tokens: [{ id: 'rule', icon: '📋', label: 'wrap in retry', at: 'referee', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'What to actually do about it',
        body: `The practical answer is a toolkit, matched to the shape of the bug. Read-modify-write on a hot row — check balance, then update — is a lost update under many defaults; fix it with a lock (SELECT \u2026 FOR UPDATE) or optimistic locking (a version column and a retry on mismatch). Invariants spanning rows want SERIALIZABLE plus a bounded retry loop, not a pile of hope. Job queues want SELECT \u2026 FOR UPDATE SKIP LOCKED, which is the modern pattern for letting workers take different rows without fighting. And the universal rules: know your engine\u2019s default before the incident, and never hold a transaction open across an HTTP call or user think-time — long transactions turn contention into outages.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'shelf', icon: '📓', label: 'The data' },
            { id: 'referee', icon: '🧑‍⚖️', label: 'Database' },
          ],
          frames: [
            { id: 'f1', caption: 'Updating a hot item? Put a lock on it. 🔒', shout: { text: 'LOCK THE HOT ROW', tone: 'info' }, cast: [{ id: 'shelf', state: 'locked' }], tokens: [{ id: 'lock', icon: '🔒', label: 'mine now', at: 'shelf', effect: 'pop' }] },
            { id: 'f2', caption: 'No locks please? Version number + retry instead. 🔢', shout: { text: 'VERSION + RETRY', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'version', icon: '🔢', label: 'v7', at: 'you', effect: 'pop' }] },
            { id: 'f3', caption: 'Big promises across many items? Call the referee. 🧑‍⚖️', shout: { text: 'ASK THE REFEREE', tone: 'info' }, cast: [{ id: 'referee', state: 'working' }], tokens: [{ id: 'papers', icon: '📜', label: 'the invariant', at: 'referee', effect: 'pop' }] },
            { id: 'f4', caption: 'Job queue? Workers take different items — skip taken ones. 📦', shout: { text: 'SKIP TAKEN ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'shelf', state: 'working' }], tokens: [{ id: 'skip', icon: '📦', label: 'next one', at: 'shelf', effect: 'pop' }] },
            { id: 'f5', caption: 'And keep turns short — never hold while chatting. ⏱️', shout: { text: 'SHORT TURNS ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'happy' }, { id: 'referee', state: 'done' }], tokens: [{ id: 'clock', icon: '⏱️', label: 'quick!', at: 'you', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Snapshot isolation still allows write skew: two transactions each read an overlapping set and update different rows — only SERIALIZABLE (or explicit locking) catches it, which is the anomaly most candidates miss.',
      'Engine defaults are not the standard: Postgres READ COMMITTED and InnoDB REPEATABLE READ both behave stronger than the textbook table in places — never cite the table without naming the engine.',
      'Long transactions amplify everything: they widen every conflict window and hold back cleanup (Postgres vacuum, InnoDB history lists), so a slow transaction is a performance incident waiting for load.',
      'Serialization failures are workload, not bugs: SQLSTATE 40001 must be handled by a bounded, idempotent retry loop — unbounded retries under contention just move the outage.',
      'Never hold a transaction across an HTTP call, a queue publish, or human think-time: row locks become site-wide outages when the lock owner is waiting on something slower than the database.',
    ],
    followUps: [
      { q: 'What is the difference between a lock and a snapshot?', a: 'A lock is pessimistic: writers block readers or other writers. A snapshot is MVCC: readers see a consistent past version without blocking, and writers copy-then-swap — which is why high-read systems scale, and why anomalies move to the write side.' },
      { q: 'Give a concrete example of write skew.', a: 'Two doctors on call: each transaction checks that at least two doctors are on duty, then removes itself. Both read "2 on", both commit their removal — zero on call, valid under snapshot isolation, prevented only by SERIALIZABLE.' },
      { q: 'How does FOR UPDATE SKIP LOCKED help job queues?', a: 'Workers lock different rows without queueing behind each other: a worker skips rows already claimed and takes the next free one — parallel processing with no duplicate jobs and no worker starvation.' },
      { q: 'Are reads blocked by writers in Postgres or MySQL?', a: 'Not for plain reads: both use MVCC, so readers see a snapshot without waiting. Writers block only conflicting writers — and locking reads (FOR UPDATE) block, which is the whole point of taking a lock.' },
      { q: 'What is a deadlock and how do you prevent it?', a: 'Two transactions each hold a lock the other wants: the database detects the cycle and kills one victim (retriable). Prevent with consistent lock ordering, short transactions, and small batches — and always handle the victim error.' },
    ],
    relatedEngine: { label: 'Explore Database Internals', href: '/corecs/database-internals-indexes-transactions' },
  },
  {
    slug: 'exactly-once-payment-retries',
    category: 'fullstack',
    topic: 'Architecture',
    title: 'Design a payment that charges exactly once — through retries and crashes',
    difficulty: 'advanced',
    frequency: 'very-often',
    round: 'system-design',
    type: 'design',
    tags: ['payments', 'idempotency', 'outbox-pattern', 'queues', 'consistency'],
    oneLiner:
      'The card is charged but the crash eats the record — exactly-once charging is not inherited from any tool, it is built from a unique constraint, an outbox, and idempotent effects everywhere.',
    whyAsked:
      'Payment idempotency is the senior-interview litmus test: it compresses concurrency, distributed failure, and data modeling into one problem with a rupee amount attached. Candidates earn the offer by naming the crash window between an external side effect and a local write, putting the invariant in the database instead of a lock, closing dual writes with a transactional outbox, and treating retries and webhook replays as the default weather rather than the exception.',
    mentalModel:
      'Exactly-once delivery does not exist over unreliable networks — exactly-once effects do. Every step is rebuilt as at-least-once plus idempotent: requests carry a key the database can enforce once, state changes and events commit in the same transaction, consumers deduplicate by event id, and a reconciliation job compares your ledger against the provider\u2019s settlement when all else fails. The question is never "will it retry?" but "is it safe when it does?"',
    steps: [
      {
        title: 'The double charge: a crash inside the window',
        body: `Replay the incident slowly. Request A reaches the provider and the card is charged — a real, external, irreversible side effect. Before the API can write "paid" to PostgreSQL, the process dies. No row exists, so the state is indistinguishable from "nothing happened" — and when the user retries, request B sees an empty database and charges the card again. The deep point is that no database transaction spans the provider: the charge happens in the outside world, your record happens inside yours, and the gap between them is the bug. Watch the animation — the two charges are not caused by a race in your SQL; they are caused by a lost write around an external effect. Any system where a retry can re-trigger the external call without proof of prior execution will double-charge under exactly this sequence.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'bank', icon: '🏦', label: 'Bank' },
          ],
          frames: [
            { id: 'f1', caption: 'You tap Pay: ₹5,000.', shout: { text: 'PAY ₹5,000', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'pay1', icon: '💳', label: '₹5,000', at: 'you', effect: 'pop' }] },
            { id: 'f2', caption: 'The bank charges your card. ✅', shout: { text: 'CHARGED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'done' }, { id: 'bank', state: 'happy' }], tokens: [{ id: 'pay1', icon: '💰', label: '₹5,000', from: 'you', to: 'bank' }] },
            { id: 'f3', caption: 'Your app crashes 💥 before writing it down.', shout: { text: 'CRASH!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'crashed', face: '😵' }], tokens: [{ id: 'boom', icon: '💥', at: 'app', effect: 'burst' }] },
            { id: 'f4', caption: 'You tap Pay again — the app forgot.', shout: { text: 'PAY AGAIN 😬', tone: 'info' }, cast: [{ id: 'you', state: 'working' }, { id: 'app', state: 'idle', face: '🤔' }], tokens: [{ id: 'pay2', icon: '💳', label: '₹5,000', at: 'you', effect: 'pop' }] },
            { id: 'f5', caption: 'Charged twice 😱 — for one purchase.', shout: { text: 'CHARGED TWICE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'you', state: 'idle', face: '😱' }, { id: 'bank', state: 'done' }], tokens: [{ id: 'c1', icon: '💰', label: '₹5,000', at: 'bank' }, { id: 'c2', icon: '💰', label: '₹5,000', at: 'bank' }] },
          ],
        },
      },
      {
        title: 'Idempotency keys: the database enforces "once"',
        body: `The fix starts with a client-generated key — one per checkout attempt, not per HTTP retry — sent in a header like Idempotency-Key. Retries of the same attempt reuse the same key; a genuinely new attempt gets a new one. The crucial implementation detail: the key becomes a row with a UNIQUE constraint before the provider is called, so only one request in the entire fleet can own the attempt. A concurrent duplicate does not race into a second charge — it loses an INSERT and is answered deterministically: "in progress, try later", or the stored result once the winner finishes. When the charge succeeds, the receipt is stored against the key; every replay returns that receipt without touching the provider. Watch the animation: the app never needs to be clever about "checking" — the database simply refuses the second owner. This is the invariant behavior interviewers want: charge-once is not a promise the code makes, it is a constraint the storage keeps.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'safe', icon: '🗄️', label: 'Database' },
          ],
          frames: [
            { id: 'f1', caption: 'One ticket per payment. 🎫', shout: { text: 'ONE TICKET', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'ticket', icon: '🎫', label: 'key', at: 'you', effect: 'pop' }] },
            { id: 'f2', caption: 'The app shows the ticket first.', shout: { text: 'CHECK FIRST', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'ticket', icon: '🎫', label: 'key', from: 'you', to: 'safe' }] },
            { id: 'f3', caption: 'The database keeps it — one owner only.', shout: { text: 'KEPT 🔒', tone: 'good' }, mood: 'good', cast: [{ id: 'safe', state: 'locked' }], tokens: [{ id: 'kept', icon: '🎫', label: 'key', at: 'safe' }] },
            { id: 'f4', caption: 'A copy of the ticket arrives — refused. 🚫', shout: { text: 'REFUSED!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'safe', state: 'locked', face: '😤' }], tokens: [{ id: 'copy', icon: '🎫', label: 'same key', from: 'you', to: 'safe', effect: 'shake' }, { id: 'no', icon: '🚫', at: 'safe', effect: 'pop' }] },
            { id: 'f5', caption: 'Same ticket → same answer. Never charged twice. ✅', shout: { text: 'SAME ANSWER ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'safe', state: 'done' }], tokens: [{ id: 'ok', icon: '✅', at: 'safe', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Redis locks vs database constraints',
        body: `The tempting first design is a Redis lock: SET key NX EX 30, first request wins, others wait. It is fast and it demos well — and it is not correctness. A TTL can expire while the holder is paused in a GC cycle or a slow network call, and then two requests hold "the" lock at the exact moment that matters. A failed Redis node forgets the lock entirely; a failover can drop it. Locks are leases with an expiry date, and money cannot be protected by something that expires. The durable version puts the invariant in PostgreSQL: UNIQUE (idempotency_key) survives crashes, restarts, and failovers, and the loser of the race gets a deterministic duplicate-key error your tests can reproduce. The mature answer keeps both: Redis as the fast single-flight optimization to reduce pileups, Postgres as the source of truth that makes one charge unavoidable. Compare the panels — the difference is not speed, it is what happens at the worst possible moment.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'safe', icon: '🗄️', label: 'Database' },
            { id: 'bank', icon: '🏦', label: 'Bank' },
          ],
          frames: [
            { id: 'f1', caption: 'First try: a paper lock on the door. 📝', shout: { text: 'PAPER LOCK', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'paper', icon: '📝', label: 'lock', at: 'app', effect: 'pop' }] },
            { id: 'f2', caption: 'The paper lock melts while the app is busy. 🫠', shout: { text: 'IT MELTS…', tone: 'bad' }, mood: 'bad', cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'melting', icon: '🫠', label: 'expired', at: 'app', effect: 'burst' }] },
            { id: 'f3', caption: 'Two retries sneak in — both charge. 💰💰', shout: { text: 'TWO CHARGES!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'bank', state: 'done' }], tokens: [{ id: 'm1', icon: '💰', label: 'charge', at: 'bank' }, { id: 'm2', icon: '💰', label: 'charge', at: 'bank' }] },
            { id: 'f4', caption: 'Real fix: the lock lives in the database. 🔒', shout: { text: 'REAL LOCK 🔒', tone: 'good' }, mood: 'good', cast: [{ id: 'safe', state: 'locked' }], tokens: [{ id: 'lock', icon: '🔒', label: 'forever', at: 'safe', effect: 'pop' }] },
            { id: 'f5', caption: 'A late retry is refused. One charge survives. ✅', shout: { text: 'ONE CHARGE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'safe', state: 'done' }, { id: 'app', state: 'idle', face: '😅' }], tokens: [{ id: 'late', icon: '🚫', at: 'app', effect: 'pop' }, { id: 'survives', icon: '💰', label: '₹5,000', at: 'safe' }] },
          ],
        },
      },
      {
        title: 'The transactional outbox: closing the dual-write window',
        body: `Even with idempotency keys, the original crash window still exists between the charge and your database write — and a second one opens between the database write and publishing "payment.captured" to the queue. Two systems, one business fact, and no transaction spans both: that is the dual-write problem. The transactional outbox closes it by refusing to do two writes. One PostgreSQL transaction records the payment row and an outbox event together; they commit or roll back as a unit, so the event exists exactly when the state exists. A relay then reads unpublished events, publishes to the queue, and retries until the broker acknowledges — at-least-once delivery, by design. If the API crashes before commit, nothing happened at all; if it crashes after, the committed event still ships. Watch the animation: the payment and its event are born in the same transaction, and the relay only ever moves durable facts. Consumers deduplicate by event id, which upgrades at-least-once delivery into exactly-once effects.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'safe', icon: '🗄️', label: 'Database' },
            { id: 'box', icon: '📬', label: 'Outbox' },
            { id: 'queue', icon: '📦', label: 'Queue' },
          ],
          frames: [
            { id: 'f1', caption: 'The app writes two things in one go. 🧾✉️', shout: { text: 'ONE ACTION', tone: 'info' }, cast: [{ id: 'app', state: 'working' }], tokens: [{ id: 'receipt', icon: '🧾', label: 'record', at: 'app', effect: 'pop' }, { id: 'letter', icon: '✉️', label: 'news', at: 'app', effect: 'pop' }] },
            { id: 'f2', caption: 'Both are saved together — or not at all.', shout: { text: 'BOTH SAVED ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'safe', state: 'done' }], tokens: [{ id: 'receipt', icon: '🧾', label: 'record', from: 'app', to: 'safe' }, { id: 'letter', icon: '✉️', label: 'news', from: 'app', to: 'safe' }] },
            { id: 'f3', caption: 'A courier mails every saved letter. 📮', shout: { text: 'MAIL IT', tone: 'info' }, cast: [{ id: 'box', state: 'working' }], tokens: [{ id: 'letter', icon: '✉️', label: 'news', from: 'safe', to: 'box' }] },
            { id: 'f4', caption: 'The letter reaches the queue.', shout: { text: 'TO THE QUEUE', tone: 'info' }, cast: [{ id: 'queue', state: 'working' }, { id: 'box', state: 'done' }], tokens: [{ id: 'letter', icon: '✉️', label: 'news', from: 'box', to: 'queue' }] },
            { id: 'f5', caption: 'App crashes? The letter still ships. 💥', shout: { text: 'STILL SHIPS ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'app', state: 'crashed', face: '😵' }, { id: 'queue', state: 'done' }], tokens: [{ id: 'boom', icon: '💥', at: 'app', effect: 'burst' }, { id: 'shipped', icon: '✅', at: 'queue', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Webhooks, reconciliation, and proving it under fire',
        body: `The system is not done when the charge path is safe — it is done when the recovery path is boring. Provider webhooks will replay, arrive twice, or land during a deploy, so the endpoint does three things in order: verify the signature, persist the raw event durably, acknowledge, and only then process — idempotently, keyed by event id. Webhooks are also the authority on money movement: your API marks intent, but only the provider's events confirm capture, and a reconciliation job compares your ledger against the provider's settlement report to catch anything that slipped. Then you prove all of it: fire N concurrent identical requests and assert exactly one charge with N identical responses; kill the process between charge and DB write and assert recovery leaves a single charge; run controlled two-transaction interleavings and assert one wins while the other replays. The animation pairs the failure scenarios with the tests that pin each one — the senior signal is not knowing the patterns, it is being able to show they hold when the server dies.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'bank', icon: '🏦', label: 'Bank' },
            { id: 'app', icon: '🤖', label: 'Your app' },
            { id: 'books', icon: '📒', label: 'Your books' },
          ],
          frames: [
            { id: 'f1', caption: 'The bank sends the same receipt — twice. 📨📨', shout: { text: 'TWICE?!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'bank', state: 'working' }], tokens: [{ id: 'r1', icon: '📨', label: '#42', from: 'bank', to: 'app' }, { id: 'r2', icon: '📨', label: '#42', from: 'bank', to: 'app' }] },
            { id: 'f2', caption: 'Same receipt number → counted once. ✅', shout: { text: 'COUNTED ONCE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'app', state: 'done' }], tokens: [{ id: 'ok', icon: '✅', at: 'app', effect: 'pop' }, { id: 'dup', icon: '🚫', label: 'duplicate', at: 'app', effect: 'shake' }] },
            { id: 'f3', caption: 'Every night, a robot compares the books. 🔍', shout: { text: 'NIGHTLY CHECK', tone: 'info' }, cast: [{ id: 'books', state: 'working' }], tokens: [{ id: 'scan', icon: '🔍', label: 'check', at: 'books', effect: 'pop' }] },
            { id: 'f4', caption: 'A mismatch gets repaired — never guessed. 🔧', shout: { text: 'AUTO-REPAIR 🔧', tone: 'info' }, cast: [{ id: 'books', state: 'working' }], tokens: [{ id: 'fix', icon: '🔧', label: 'repair', at: 'books', effect: 'pop' }] },
            { id: 'f5', caption: 'Crash storms tested: always one charge. ✅', shout: { text: 'ONE CHARGE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'app', state: 'crashed', face: '😵' }, { id: 'books', state: 'done' }], tokens: [{ id: 'boom', icon: '💥', at: 'app', effect: 'burst' }, { id: 'final', icon: '✅', at: 'books', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Idempotency keys must be scoped to the request payload: reuse of the same key with a different amount or cart is an attack or a bug — store a request hash and reject mismatches with 409.',
      'In-flight duplicates need a state machine, not a lock: a second request hitting an in_progress key must get a deterministic "retry later" (or wait on the same row), never a second provider call.',
      'The provider webhook is the authority on money: never mark "captured" from your own request path alone — capture, refund, and settlement all reconcile against provider events and reports.',
      'Idempotency records cannot live forever or expire too soon: keys must outlive the provider\u2019s retry schedule (typically days), so sweep with a retention window and archive receipts instead of deleting them.',
      'Redis locks expire mid-flight under GC pauses, network stalls, or failovers — two holders at the worst moment; any design where correctness depends on the lease surviving is a double charge waiting for load.',
    ],
    followUps: [
      { q: 'What exactly is the transactional outbox pattern?', a: 'Write the business row and an event row in the same local transaction; a relay publishes pending events to the broker and retries until acked. It removes the dual-write window between your database and the queue without distributed transactions.' },
      { q: 'At-least-once vs exactly-once delivery?', a: 'Exactly-once delivery over unreliable networks is a lie; exactly-once effects are real. Deliver at-least-once, make every consumer idempotent (event ids, upserts, state machines), and the duplicates become invisible.' },
      { q: 'Why not just use a distributed lock for the whole flow?', a: 'Locks are leases, and leases expire: GC pauses, network partitions, and failovers create moments with two holders. A lock may optimize contention, but only a durable constraint can guarantee one charge.' },
      { q: 'How do idempotency keys differ from a unique constraint?', a: 'The key is the semantic contract the client carries across retries; the constraint is the enforcement mechanism that makes the contract real in storage. You need both — the key without the constraint is theater.' },
      { q: 'What should the user see while the outcome is unknown?', a: 'An explicit pending state, honestly surfaced: "payment processing", with the final state arriving via polling or webhook push. Never fake success, and never leave "failed" as a default for an unknown outcome — that invites a harmful retry.' },
    ],
    relatedEngine: { label: 'Explore the System Design visualizer', href: '/fullstack/systemdesignviz' },
  },
  {
    slug: 'csv-pipeline-10m-rows-live-progress',
    category: 'fullstack',
    topic: 'Architecture',
    title: 'Design a pipeline that ingests a 10-million-row CSV with live progress',
    difficulty: 'advanced',
    frequency: 'sometimes',
    round: 'system-design',
    type: 'design',
    tags: ['streams', 'queues', 'idempotency', 'websockets', 'postgres'],
    oneLiner:
      'A 10M-row upload is not one job — it is tens of thousands of small idempotent chunks, with Postgres as the only source of truth for progress and the WebSocket as its fast path.',
    whyAsked:
      'Bulk ingestion is where senior actually gets tested: memory-safe streaming, work distribution, at-least-once delivery made harmless, and progress that never lies after a crash. Interviewers watch for the chunk-transaction insight — idempotency and progress are the same design problem, solved by committing results and the done-mark together — and for treating the WebSocket as a cache of Postgres rather than a database of its own.',
    mentalModel:
      'Nobody ships one giant job; you ship chunks. Each chunk is a single database transaction that is safe to replay: the rows and the "done" mark commit together, so a crash either happened before the chunk (redeliver, no trace) or after (nothing to replay). Progress is derived from committed chunks — never a drifting counter — and every realtime channel is allowed to lose messages, because the snapshot endpoint always heals.',
    steps: [
      {
        title: 'Stream the upload — memory stays flat',
        body: `The first failure mode is buffering: reading the file into memory, or worse, into a string, kills the Node process at a few gigabytes. The fix is to never hold the file at all — the browser slices it into multipart parts, and the API pipes each part straight through to object storage as it arrives. Backpressure does the flow control: when storage is slow, the stream pauses instead of growing a buffer. When the upload completes, the API holds only a pointer and a job id, inserts the job row, and enqueues the chunking task — then answers 202 immediately. Watch the animation: the HTTP request finishes in seconds regardless of file size, and the heavy work happens entirely off the request path. This is also what keeps the API responsive for everyone else: an endpoint that streams cannot be the endpoint that stalls under a large upload.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'pipe', icon: '🚚', label: 'Streamer' },
            { id: 'store', icon: '📦', label: 'Storage' },
          ],
          frames: [
            { id: 'f1', caption: 'The giant book arrives in small bundles — never all at once. 📚', shout: { text: 'SMALL BUNDLES', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'bundle', icon: '📄', label: 'part 1 of 500', from: 'you', to: 'pipe' }] },
            { id: 'f2', caption: 'The streamer passes each bundle straight through. 🚚', shout: { text: 'PASS IT ON', tone: 'info' }, cast: [{ id: 'pipe', state: 'working' }], tokens: [{ id: 'pass', icon: '📄', label: 'keep moving', from: 'pipe', to: 'store' }] },
            { id: 'f3', caption: 'Nothing piles up in memory — no overflow! 🧠✅', shout: { text: 'NEVER BUFFERS ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'pipe', state: 'done' }], tokens: [{ id: 'flat', icon: '📏', label: 'flat memory', at: 'pipe', effect: 'pop' }] },
            { id: 'f4', caption: 'Upload done in seconds: “Here is your ticket!” 🎫', shout: { text: 'JOB TICKET 🎫', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'happy' }], tokens: [{ id: 'ticket', icon: '🎫', label: 'job #42', from: 'pipe', to: 'you' }] },
            { id: 'f5', caption: 'The heavy work happens behind the counter, later. 🏪', shout: { text: 'WORK LATER', tone: 'info' }, cast: [{ id: 'store', state: 'done' }], tokens: [{ id: 'counter', icon: '🏪', label: 'off the request', at: 'store', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Chunk the job, protect the neighbors',
        body: `The second classic failure: enqueuing the whole file as one queue message. A single 10-minute task cannot be parallelized, cannot be retried in parts, and a redelivery restarts it from zero. The design instead cuts the object into small chunks — tens of thousands of rows each, split on record boundaries so no row is torn — and every chunk becomes its own queue item carrying its job id and row range. That alone gives parallelism and partial retries. The fairness dimension: queue per tenant (or weighted lanes), so one customer's 10-million-row flood occupies their lane, not the pipe every other customer shares. Watch the animation: the chunker only ever streams and slices; workers pull chunks from lanes, round-robin across tenants, and each claim is a lease that expires if the worker dies. One job becomes tens of thousands of small, parallel, independently retryable units — and starvation is a scheduling decision you made, not an accident you discovered.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'book', icon: '📚', label: 'Big CSV' },
            { id: 'slicer', icon: '✂️', label: 'Slicer' },
            { id: 'lane', icon: '🚦', label: 'Your lane' },
            { id: 'workers', icon: '🧑‍🏭', label: 'Workers' },
          ],
          frames: [
            { id: 'f1', caption: 'One giant job cannot be shared or retried — so slice it! ✂️', shout: { text: 'SLICE THE BOOK!', tone: 'info' }, cast: [{ id: 'slicer', state: 'working' }], tokens: [{ id: 'scissors', icon: '✂️', label: 'ready', at: 'slicer', effect: 'pop' }] },
            { id: 'f2', caption: 'Ten thousand small pages, each numbered. 📄', shout: { text: 'SHRED INTO PAGES', tone: 'info' }, cast: [{ id: 'book', state: 'working' }], tokens: [{ id: 'page', icon: '📄', label: 'page 42', from: 'book', to: 'slicer' }] },
            { id: 'f3', caption: 'Pages land in YOUR lane — other customers keep moving. 🚦', shout: { text: 'ONE LANE EACH', tone: 'good' }, mood: 'good', cast: [{ id: 'lane', state: 'working' }], tokens: [{ id: 'toLane', icon: '📄', label: 'yours only', from: 'slicer', to: 'lane' }] },
            { id: 'f4', caption: 'Many workers take one page each. 🧑‍🏭🧑‍🏭', shout: { text: 'WORKERS PULL', tone: 'info' }, cast: [{ id: 'workers', state: 'working' }], tokens: [{ id: 'claim', icon: '📄', label: 'claim + ack', from: 'lane', to: 'workers' }] },
            { id: 'f5', caption: 'One huge job = many small pieces that can each die and retry. 🧩', shout: { text: 'SMALL & RETRYABLE', tone: 'good' }, mood: 'good', cast: [{ id: 'workers', state: 'done' }], tokens: [{ id: 'pieces', icon: '🧩', label: 'all shapes', at: 'workers', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Exactly-once chunks: commit the work and the mark together',
        body: `Here is the answer to the bonus question, stated as a design rule: never update progress separately from the work. Each chunk runs as one database transaction — insert the chunk's rows with a natural key, mark the chunk done, commit. Crash after 50,000 rows but before COMMIT? Those rows rolled back; the chunk never happened, and the queue redelivers it whole. On redelivery, ON CONFLICT makes the rows already committed by a partial earlier attempt a no-op — but there is nothing to detect and no offset to store, because the transaction boundary is the checkpoint. And progress? It is not a counter you increment; it is derived — COUNT the committed chunks, which can never drift from reality because it is computed from it. Read the code trace: the same BEGIN/COMMIT protects the rows, the done-mark, and therefore the progress number the user sees. Replay is not the failure path — it is the design.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'worker', icon: '🧑‍🏭', label: 'Worker' },
            { id: 'page', icon: '✉️', label: 'Sealed page' },
            { id: 'counter', icon: '📊', label: 'Progress' },
          ],
          frames: [
            { id: 'f1', caption: 'One page = one sealed envelope. Rows and the done-mark inside. ✉️', shout: { text: 'ONE SEALED PAGE', tone: 'info' }, cast: [{ id: 'worker', state: 'working' }], tokens: [{ id: 'envelope', icon: '✉️', label: 'rows + ✅', at: 'worker', effect: 'pop' }] },
            { id: 'f2', caption: 'Crash with the envelope open? It all vanishes — nothing half-saved. 💥', shout: { text: 'OOPS — CRASH!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'worker', state: 'crashed', face: '😵' }], tokens: [{ id: 'boom', icon: '💥', at: 'worker', effect: 'burst' }] },
            { id: 'f3', caption: 'The lane simply sends the same page again. 🚦', shout: { text: 'SENT AGAIN', tone: 'info' }, cast: [{ id: 'page', state: 'working' }], tokens: [{ id: 'resend', icon: '📄', label: 'page 42 again', from: 'page', to: 'worker' }] },
            { id: 'f4', caption: 'Redoing rows that are done? They bounce right off. 🛡️', shout: { text: 'DUPLICATES BOUNCE', tone: 'good' }, mood: 'good', cast: [{ id: 'worker', state: 'done' }], tokens: [{ id: 'shield', icon: '🛡️', label: 'no double work', at: 'worker', effect: 'pop' }] },
            { id: 'f5', caption: 'Progress = finished pages counted. Never a guessed number. 🧮', shout: { text: 'COUNT THE PAGES', tone: 'good' }, mood: 'good', cast: [{ id: 'counter', state: 'done' }], tokens: [{ id: 'tally', icon: '🧮', label: '42 of 200', at: 'counter', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Realtime progress: WebSockets as a cache of Postgres',
        body: `Progress has exactly one source of truth — the database — and the realtime channel is only its fast delivery. The worker that commits a chunk performs the progress update in the same transaction, then publishes a small event afterward (best-effort; lossy is acceptable precisely because Postgres holds the truth). Redis pub/sub fans the event to every WebSocket gateway instance, whichever one holds the user's connection, and the browser receives throttled updates — per second, never per row. Now the two hostile cases. Refresh or disconnect: the client re-fetches GET /jobs/:id for an authoritative snapshot, then resubscribes — missed events heal instantly, so the gateway can be stateless and disposable. Worker crash: the chunk's lease expires, the queue redelivers, and the replay is a no-op by construction from the previous step. Watch the animation: the database never moves, everything else is allowed to fail.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'workers', icon: '🧑‍🏭', label: 'Workers' },
            { id: 'meter', icon: '📊', label: 'True meter' },
            { id: 'screen', icon: '📺', label: 'Your screen' },
          ],
          frames: [
            { id: 'f1', caption: 'A page finishes — the meter ticks up. ✅', shout: { text: 'TICK!', tone: 'good' }, mood: 'good', cast: [{ id: 'workers', state: 'working' }], tokens: [{ id: 'done', icon: '✅', label: '+1 page', from: 'workers', to: 'meter' }] },
            { id: 'f2', caption: 'The meter whispers the news to every screen. 📣', shout: { text: 'BROADCAST', tone: 'info' }, cast: [{ id: 'meter', state: 'working' }], tokens: [{ id: 'news', icon: '📣', label: '62% done', from: 'meter', to: 'screen' }] },
            { id: 'f3', caption: 'You watch the bar fill up, live. 📈', shout: { text: 'LIVE PROGRESS', tone: 'good' }, mood: 'good', cast: [{ id: 'screen', state: 'happy' }], tokens: [{ id: 'bar', icon: '📈', label: 'still going…', at: 'screen', effect: 'pop' }] },
            { id: 'f4', caption: 'Refresh the page? You just ask the meter for the truth. 🔄', shout: { text: 'REFRESH? EASY', tone: 'info' }, cast: [{ id: 'screen', state: 'working' }], tokens: [{ id: 'ask', icon: '🔄', label: 'what is real?', from: 'screen', to: 'meter' }] },
            { id: 'f5', caption: 'Whispers can get lost — the meter never lies. 📊', shout: { text: 'TRUTH = THE METER', tone: 'good' }, mood: 'good', cast: [{ id: 'meter', state: 'done' }], tokens: [{ id: 'steady', icon: '📊', label: 'authoritative', at: 'meter', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'PostgreSQL when the table is 10 million rows deep',
        body: `At this scale the database patterns change shape. Rows go in as multi-row batches or COPY — tens of thousands at a time — because per-row inserts are 10 million round trips of overhead. Progress queries stop scanning: chunk-level state is tiny and indexed, so "how far are we" is O(chunks), not O(rows). Tables partition by job or by time range, which keeps per-job working sets small and lets retention be DROP PARTITION instead of a mass DELETE that bloats and locks. Indexes are chosen for the queries that actually run — the natural key's UNIQUE index carries both idempotency and lookups — and built with the workload in mind rather than reflexively on every column. Compare the panels: the left column is what happens when each row is an event, the right is what happens when the table is treated as a bulk store with a few sharp queries.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'loader', icon: '🧑‍🏭', label: 'Loader' },
            { id: 'cart', icon: '🛒', label: 'Batch cart' },
            { id: 'store', icon: '🏬', label: 'The big store (DB)' },
          ],
          frames: [
            { id: 'f1', caption: 'Handing over rows one grain at a time? Too slow! 🍬', shout: { text: 'NOT ONE BY ONE!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'loader', state: 'crashed' }], tokens: [{ id: 'grain', icon: '🍬', label: '1 of 10M', at: 'loader', effect: 'pop' }] },
            { id: 'f2', caption: 'Load a whole cart at once instead. 🛒', shout: { text: 'FULL CART LOADS', tone: 'good' }, mood: 'good', cast: [{ id: 'cart', state: 'working' }], tokens: [{ id: 'into', icon: '🛒', label: '10k rows', from: 'loader', to: 'store' }] },
            { id: 'f3', caption: 'Rent shelves per job — drop a whole shelf when done. 🗄️', shout: { text: 'PARTITION SHELVES', tone: 'info' }, cast: [{ id: 'store', state: 'working' }], tokens: [{ id: 'shelf', icon: '🗄️', label: 'job #42 shelf', at: 'store', effect: 'pop' }] },
            { id: 'f4', caption: 'Count small bins, never every grain. 🧮', shout: { text: 'COUNT BINS, NOT GRAINS', tone: 'info' }, cast: [{ id: 'store', state: 'working' }], tokens: [{ id: 'bins', icon: '🧮', label: '42 bins', at: 'cart', effect: 'pop' }] },
            { id: 'f5', caption: 'Clean shelves, fast loads, exact counts. ✅', shout: { text: 'CLEAN AND FAST ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'loader', state: 'happy' }, { id: 'store', state: 'done' }], tokens: [{ id: 'receipt', icon: '🧾', label: 'receipt ok', at: 'store', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Byte-range chunking can split a quoted CSV row in half: slice on record boundaries (or carry the trailing partial line into the next chunk) or the parser fails on valid files.',
      'Zombie workers originate from lease math: if the visibility timeout is shorter than a worst-case chunk, two workers can hold one chunk — the idempotent writes make it harmless, never the lease.',
      'Per-row WebSocket events melt the gateway on a 10M-row job: throttle to per-second aggregates, use per-job channels, and let reconnecting clients rely on the snapshot, not a backlog of events.',
      'Bounded queues per tenant are the fairness mechanism: without a cap on in-flight chunks per customer, one upload can saturate the entire worker pool even with separate lanes.',
      'A job must never query another job\u2019s half-written data: stage rows per job and only publish results when the job completes, so readers see all-or-nothing.',
    ],
    followUps: [
      { q: 'Why not process the whole file as one queue message?', a: 'One long-running message cannot parallelize, cannot be retried in parts, and redelivery restarts it from zero; queue item size limits and visibility timeouts make it worse — chunks are the unit of work for a reason.' },
      { q: 'What makes a worker safe to run twice?', a: 'Idempotent effects, not exactly-once delivery: a natural key with ON CONFLICT DO NOTHING, chunk-scoped transactions, and progress derived from committed state — replaying a chunk or an event must be a measurable no-op.' },
      { q: 'What happens if the WebSocket gateway dies mid-job?', a: 'Nothing durable: clients reconnect with backoff, re-fetch the snapshot endpoint, and resubscribe — gateways are stateless behind a load balancer, and pub/sub re-fans updates to whichever instance holds the new connection.' },
      { q: 'Why Redis pub/sub and not the queue itself for progress?', a: 'Progress is ephemeral and lossy-by-design: Postgres holds the truth, so a lost progress event is a cosmetic delay, not a correctness bug. Reusing the durable queue for chatty progress would add retention and replay burden for data nobody needs to replay.' },
      { q: 'How do you test a pipeline like this?', a: 'Chaos and invariants: kill workers mid-chunk and assert row counts and constraint violations; fire concurrent uploads from multiple tenants and assert fairness; replay every message twice and assert the outputs are bit-identical.' },
    ],
    relatedEngine: { label: 'Explore the System Design visualizer', href: '/fullstack/systemdesignviz' },
  },
  {
    slug: 'collaborative-editor-ot-crdt-conflicts',
    category: 'fullstack',
    topic: 'Architecture',
    title: 'Design real-time collaboration — and what survives a disconnect',
    difficulty: 'advanced',
    frequency: 'sometimes',
    round: 'system-design',
    type: 'design',
    tags: ['websockets', 'ot', 'crdt', 'redis', 'consistency'],
    oneLiner:
      'Operations are relative and go stale, so the real design question is who holds the order — a central transformer (OT) or a mergeable data structure (CRDT) — and what survives a disconnect.',
    whyAsked:
      'Collaborative editing compresses the hardest realtime problems into one room: concurrency, ordering, fan-out, persistence, and offline merge. Interviewers listen for whether you know the hard part is not WebSockets but intention — position 4 meant the old document, and replaying it against the new one corrupts meaning without any bug in the plumbing. Strong candidates separate the durable document from the ephemeral presence layer and can explain recovery without hand-waving "the server broadcasts, so it is fine".',
    mentalModel:
      'A document is shared mutable state at character granularity, and the whole architecture hangs on one decision: who decides the final order and meaning of edits. OT delegates that to a central authority that transforms each operation against the ones it missed. CRDTs bake identity into every atom so arrival order stops mattering entirely. Gateways, pub/sub, snapshots, and resync are plumbing arranged around that choice — get the choice wrong and the plumbing cannot save you.',
    steps: [
      {
        title: 'Why concurrent edits corrupt: position is a lie after edits',
        body: `The naive model — operations are positions in a string, apply them in arrival order — dies immediately in collaboration. User A, briefly offline, computes "insert 'very ' at position 4" against version 1 of the document. Meanwhile B deletes positions 4 through 8 and commits version 2. When A reconnects and the server applies insert(4), position 4 in version 2 is somewhere else entirely — inside a different word, or past the end. Nobody made a typo: "4" was a statement about an old document, and the document moved. Watch the animation: every frame is individually correct, and the sequence is still wrong. This is the staging problem every collaborative system must solve — not connection management, not fan-out, but the fact that an edit's meaning is relative to the state it was authored against.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'a', icon: '🧑‍🦰', label: 'Writer A' },
            { id: 'b', icon: '🧔', label: 'Writer B' },
            { id: 'page', icon: '📄', label: 'Shared page' },
          ],
          frames: [
            { id: 'f1', caption: 'A goes offline with a note: “add a word after word 4.” 📝', shout: { text: 'NOTE IN POCKET', tone: 'info' }, cast: [{ id: 'a', state: 'working' }], tokens: [{ id: 'note', icon: '📝', label: 'after word 4', at: 'a', effect: 'pop' }] },
            { id: 'f2', caption: 'Meanwhile B snips out words 4 to 8. ✂️', shout: { text: 'B SNIPS!', tone: 'info' }, cast: [{ id: 'b', state: 'working' }], tokens: [{ id: 'snip', icon: '✂️', label: 'words 4–8', from: 'b', to: 'page' }] },
            { id: 'f3', caption: 'A returns and drops the note at “word 4” — but word 4 moved! 😵', shout: { text: 'WRONG SPOT!', tone: 'bad' }, mood: 'bad', cast: [{ id: 'a', state: 'crashed' }], tokens: [{ id: 'place', icon: '📝', label: 'landed wrongly', from: 'a', to: 'page', effect: 'shake' }] },
            { id: 'f4', caption: 'Both writers did nothing wrong. The page still broke. 🧩', shout: { text: 'MESSED UP ANYWAY', tone: 'bad' }, mood: 'bad', cast: [{ id: 'page', state: 'crashed' }], tokens: [{ id: 'broken', icon: '🧩', label: 'misplaced', at: 'page', effect: 'pop' }] },
            { id: 'f5', caption: 'Positions lie once the page changes underneath. 📍', shout: { text: 'POSITIONS LIE', tone: 'bad' }, mood: 'bad', cast: [{ id: 'a', state: 'crashed', face: '😕' }, { id: 'b', state: 'idle' }], tokens: [{ id: 'ghost', icon: '📍', label: 'stale spot', at: 'page', effect: 'float' }] },
          ],
        },
      },
      {
        title: 'OT or CRDT: where conflict resolution lives',
        body: `Both families fix the stale-position problem, and the interview signal is knowing what each one really is. OT keeps operations relative and adds the missing ingredient: the server receives every op, orders them per document, and transforms each against everything it missed — insert(4) becomes insert(6) because the server knows v2 shifted it. It is what Google Docs runs, it keeps clients dumb, and it demands one authoritative order per document. CRDTs instead make every character or atom carry an identity, so operations reference atoms rather than offsets and merge is commutative — arrival order does not matter, ever. That buys offline-first and peer-to-peer, at the cost of metadata per atom and tombstones for deletions. The decision rule to say out loud: with a central server and short disconnects, OT is simpler; with long offline periods or no central authority, CRDTs pay for themselves.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'a', icon: '🧑‍🦰', label: 'Writer A' },
            { id: 'b', icon: '🧔', label: 'Writer B' },
            { id: 'ref', icon: '🧑‍⚖️', label: 'Referee' },
            { id: 'magic', icon: '📜', label: 'Magic paper' },
          ],
          frames: [
            { id: 'f1', caption: 'Two writers, one page. Who decides the final words? 🤔', shout: { text: 'WHO DECIDES?', tone: 'info' }, cast: [{ id: 'a', state: 'working' }, { id: 'b', state: 'working' }], tokens: [{ id: 'q', icon: '🤔', label: 'the big question', at: 'ref', effect: 'pop' }] },
            { id: 'f2', caption: 'Option 1: a referee numbers every single move. #️⃣', shout: { text: 'A REFEREE (OT)', tone: 'info' }, cast: [{ id: 'ref', state: 'working' }], tokens: [{ id: 'order', icon: '#️⃣', label: '1, 2, 3…', at: 'ref', effect: 'pop' }] },
            { id: 'f3', caption: 'Option 2: magic paper merges moves in any order. ✨', shout: { text: 'MAGIC PAPER (CRDT)', tone: 'info' }, cast: [{ id: 'magic', state: 'working' }], tokens: [{ id: 'sparkle', icon: '✨', label: 'merges anything', at: 'magic', effect: 'burst' }] },
            { id: 'f4', caption: 'Long trips offline? The magic paper wins. ✈️', shout: { text: 'OFFLINE → MAGIC', tone: 'info' }, cast: [{ id: 'magic', state: 'done' }], tokens: [{ id: 'plane', icon: '✈️', label: 'no referee needed', at: 'magic', effect: 'pop' }] },
            { id: 'f5', caption: 'A referee at home base? Simpler and proven. ✅', shout: { text: 'SERVER → REFEREE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'ref', state: 'happy' }], tokens: [{ id: 'proven', icon: '✅', label: 'battle-tested', at: 'ref', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Fan-out: one order per document, N gateway instances',
        body: `At 100,000 concurrent users the WebSocket tier cannot hold the truth — it holds sockets. Any gateway instance accepts a keystroke, wraps it with document id, client id, and the client\u2019s last-seen version, and routes it to the document\u2019s lane without interpreting it. The critical scalability insight: there is no global order — there is one order per document. A document actor (or a partitioned service keyed by document id) consumes that lane, transforms and sequences each op, and broadcasts the result on a per-document pub/sub channel. Redis fans the transformed op out to every gateway, each pushing to the sockets subscribed to that document. Watch the animation: 100k users, but a single writer per document — correctness comes from the per-document lane, scale comes from having 100k documents each with their own. Sticky sessions are an optimization for locality, never a correctness mechanism, because session migration would silently break ordering.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You' },
            { id: 'desks', icon: '☎️', label: 'Switchboards' },
            { id: 'lane', icon: '🚦', label: 'Page lane' },
          ],
          frames: [
            { id: 'f1', caption: 'Any switchboard catches your keystroke. ☎️', shout: { text: 'ANY DESK ANSWERS', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'key', icon: '⌨️', label: 'keystroke', from: 'you', to: 'desks' }] },
            { id: 'f2', caption: 'Every desk forwards to the page\u2019s own lane. 🚦', shout: { text: 'ONE LANE PER PAGE', tone: 'info' }, cast: [{ id: 'desks', state: 'working' }], tokens: [{ id: 'route', icon: '📨', label: 'to page #42', from: 'desks', to: 'lane' }] },
            { id: 'f3', caption: 'The lane numbers every move in one single line. 1️⃣2️⃣3️⃣', shout: { text: 'ONE ORDER', tone: 'info' }, cast: [{ id: 'lane', state: 'working' }], tokens: [{ id: 'numbers', icon: '🔢', label: 'v38, v39…', at: 'lane', effect: 'pop' }] },
            { id: 'f4', caption: 'The answer flies back to EVERY desk at once. 📣', shout: { text: 'TELL EVERYONE', tone: 'info' }, cast: [{ id: 'desks', state: 'working' }], tokens: [{ id: 'spread', icon: '📣', label: 'same order', from: 'lane', to: 'desks' }] },
            { id: 'f5', caption: 'Every screen applies the same order — all agree. ✅', shout: { text: 'ALL AGREE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'happy' }], tokens: [{ id: 'agree', icon: '✅', label: 'same page', from: 'desks', to: 'you' }] },
          ],
        },
      },
      {
        title: 'Persistence: append per op, snapshot on idle',
        body: `Writing PostgreSQL on every keystroke is the classic mistake: a fast typist generates tens of writes per second per user, and row-level updates of a live document serialize the hot path. The working state instead lives in the ordered op log — appends are cheap — and durability comes from periodic snapshots: after the document sits idle for a debounce window, or after every N operations, a snapshot of the versioned document is written to Postgres. Each snapshot carries its version number, making it a base that the op-log tail can replay onto. The failure question lands here: crash after broadcasting an update but before persisting? The op was already committed to the log with its version, and the clients that received it hold it too — recovery replays the log tail onto the last snapshot, and the worst case degrades to "the broadcast is ahead of storage", which resync repairs. Snapshotting also compacts: once durable, the log before the snapshot can be trimmed.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'note', icon: '📓', label: 'Quick notes (log)' },
            { id: 'archive', icon: '🗄️', label: 'Archive' },
          ],
          frames: [
            { id: 'f1', caption: 'Every keystroke is a quick scribble in the notebook. ✍️', shout: { text: 'QUICK NOTES', tone: 'info' }, cast: [{ id: 'note', state: 'working' }], tokens: [{ id: 'scribble', icon: '✍️', label: 'v1204', at: 'note', effect: 'pop' }] },
            { id: 'f2', caption: 'The notebook never stops to do a heavy rewrite. 🏃', shout: { text: 'KEEP MOVING', tone: 'info' }, cast: [{ id: 'note', state: 'working' }], tokens: [{ id: 'flow', icon: '🏃', label: 'never blocks', at: 'note', effect: 'float' }] },
            { id: 'f3', caption: 'When things get quiet, take a clean full snapshot. 📸', shout: { text: 'SNAPSHOT TIME', tone: 'info' }, cast: [{ id: 'archive', state: 'working' }], tokens: [{ id: 'photo', icon: '📸', label: 'v1204 full', from: 'note', to: 'archive' }] },
            { id: 'f4', caption: 'A crash before the snapshot? The notes still remember! 💥', shout: { text: 'NOTES SAVE YOU', tone: 'good' }, mood: 'good', cast: [{ id: 'note', state: 'working' }], tokens: [{ id: 'boom', icon: '💥', label: 'crash', at: 'archive', effect: 'burst' }, { id: 'tape', icon: '🎞️', label: 'the tail', at: 'note', effect: 'pop' }] },
            { id: 'f5', caption: 'Replay the notes onto the last snapshot — nothing lost. ✅', shout: { text: 'NOTHING LOST ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'archive', state: 'done' }, { id: 'note', state: 'done' }], tokens: [{ id: 'safe', icon: '✅', label: 'all recovered', at: 'archive', effect: 'pop' }] },
          ],
        },
      },
      {
        title: 'Reconnection: resume by version, converge by construction',
        body: `A disconnected user is not a lost user — they are a replica that fell behind, and the resync is a delta, never a full reload that would discard their local edits. The client reconnects announcing its last applied version (for OT) or its state vector (for CRDTs — a per-replica summary of what it has seen), and the server computes exactly the missing ops. OT transforms the user\u2019s buffered offline operations through every op they missed, in order; CRDTs merge the buffered atoms directly, because identity makes the merge order-independent. Now the bonus scenario: two users replace the same paragraph while a third deletes it. OT resolves it by definition, not by accident — the server serializes the three operations and the transform rules decide precisely how replace-vs-delete interacts, so the outcome is deterministic and testable. CRDTs resolve it structurally: the paragraph\u2019s atoms were deleted, and replacements targeting deleted atoms are absorbed or reinsert as defined — legitimate edits are not silently dropped, they are deterministically superseded and recoverable from the log. Watch the animation: announce, delta, apply, converge.`,
        animation: {
          kind: 'story',
          cast: [
            { id: 'you', icon: '👤', label: 'You (back online)' },
            { id: 'helper', icon: '🧑‍💼', label: 'Syncer' },
            { id: 'pad', icon: '📒', label: 'Page notebook' },
          ],
          frames: [
            { id: 'f1', caption: 'Back online: “I last saw page 38.” 🙋', shout: { text: 'CATCH ME UP!', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'say', icon: '🙋', label: 'v38', from: 'you', to: 'helper' }] },
            { id: 'f2', caption: 'The helper finds every move after 38. 🔍', shout: { text: 'FIND THE MISSING', tone: 'info' }, cast: [{ id: 'helper', state: 'working' }], tokens: [{ id: 'search', icon: '🔍', label: 'v39…v57', from: 'helper', to: 'pad' }] },
            { id: 'f3', caption: 'Your pocket notes get fitted in properly — never pasted blindly. 🧩', shout: { text: 'FIT THEM IN', tone: 'info' }, cast: [{ id: 'you', state: 'working' }], tokens: [{ id: 'fit', icon: '🧩', label: 'your edits', from: 'you', to: 'helper' }] },
            { id: 'f4', caption: 'Everyone lands on the same page 57. ✅', shout: { text: 'SAME PAGE ✓', tone: 'good' }, mood: 'good', cast: [{ id: 'you', state: 'happy' }, { id: 'helper', state: 'done' }], tokens: [{ id: 'same', icon: '✅', label: 'v57 for all', at: 'pad', effect: 'pop' }] },
            { id: 'f5', caption: 'Even delete-vs-replace clashes get a fair, open rule. ⚖️', shout: { text: 'NOTHING VANISHES', tone: 'good' }, mood: 'good', cast: [{ id: 'pad', state: 'done' }], tokens: [{ id: 'fair', icon: '⚖️', label: 'defined outcome', at: 'pad', effect: 'pop' }] },
          ],
        },
      },
    ],
    edgeCases: [
      'Presence, cursors, and typing indicators are ephemeral and lossy by design: never persist them as document state or replay them on reconnect — dropping a cursor is free, dropping an edit is data loss.',
      'A document is an ordering domain, not the system: forcing a global order across all documents is the scalability trap — one lane per document gives correctness and 100k documents give throughput.',
      'Snapshotting must never block editing: the snapshot is taken at a specific version while later ops keep appending, so the stop-the-world copy of a live structure is a latent outage.',
      'Undo/redo changes meaning under collaboration: per-user undo needs per-client operation history to "remove my last edit" from a merged state — a global undo stack will silently revert other people\u2019s work.',
      'Redis pub/sub is fire-and-forget: a gateway that was down misses updates, which is acceptable only because every client can recover via version-based resync — the day resync is broken, pub/sub losses become silent divergence.',
    ],
    followUps: [
      { q: 'When would you choose CRDTs over OT?', a: 'When offline-first or peer-to-peer is a product requirement: long disconnects, local-first apps, or no central authority. Libraries like Yjs make it practical, and the price is per-atom metadata, tombstones, and compaction — pay it deliberately, not by default.' },
      { q: 'How does Redis pub/sub survive 100,000 concurrent users?', a: 'It does not carry users — it carries document channels between gateways: connections stay on gateway instances, each document has one ordered lane, and pub/sub fans transformed ops to the instances holding subscribers. Fire-and-forget is fine because clients recover by version.' },
      { q: 'What is a state vector and why does resync need it?', a: 'A compact per-replica summary of what a client has already seen. Exchanging vectors lets the server compute exactly the missing operations — no full reload, no over-sending, and it works even when the client has made offline edits of its own.' },
      { q: 'Why is last-write-wins the wrong default for a document?', a: 'Granularity: replacing whole paragraphs because of one keystroke discards paragraphs of legitimate work. Even character-level LWW without identity misapplies stale offsets — you need identity or transformation, not a timestamp.' },
      { q: 'How do you guarantee every user sees the same document?', a: 'Deterministic convergence: OT applies the same op order and the same transform rules at every site; CRDT merges are commutative, associative, and idempotent by construction. Either way, convergence is a property of the algorithm — the network only decides when, not what.' },
    ],
    relatedEngine: { label: 'Explore the System Design visualizer', href: '/fullstack/systemdesignviz' },
  },
];
