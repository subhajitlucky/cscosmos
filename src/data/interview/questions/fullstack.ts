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
          kind: 'step-flow',
          nodes: [
            { id: 'browser', label: 'Browser' },
            { id: 'os', label: 'Resolver', sublabel: 'recursive cache' },
            { id: 'root', label: 'Root DNS' },
            { id: 'tld', label: 'TLD .com' },
            { id: 'auth', label: 'Authoritative DNS' },
          ],
          phases: [
            { id: 'p1', caption: 'Browser cache miss — the hostname is unknown locally.', activeNodeIds: ['browser'] },
            { id: 'p2', caption: 'The recursive resolver misses its own cache — ask the network.', packets: [{ from: 'browser', to: 'os', label: 'resolve?' }], activeNodeIds: ['os'] },
            { id: 'p3', caption: 'Recursive resolver asks a root server where .com lives.', packets: [{ from: 'os', to: 'root', label: '?' }], activeNodeIds: ['root'] },
            { id: 'p4', caption: 'Root delegates to the .com TLD servers.', packets: [{ from: 'root', to: 'tld', label: '.com →' }], doneNodeIds: ['root'], activeNodeIds: ['tld'] },
            { id: 'p5', caption: 'TLD delegates to the authoritative nameserver.', packets: [{ from: 'tld', to: 'auth', label: 'auth NS' }], doneNodeIds: ['root', 'tld'], activeNodeIds: ['auth'] },
            { id: 'p6', caption: 'The answer (A/AAAA record) travels back and is cached at every hop with a TTL — future lookups stop early.', packets: [{ from: 'auth', to: 'os', label: '93.184.216.34' }], doneNodeIds: ['root', 'tld', 'auth', 'os'] },
          ],
        },
      },
      {
        title: 'TCP handshake',
        body: 'The browser opens a TCP connection with the three-way handshake: the client sends SYN with a random sequence number, the server answers SYN-ACK acknowledging it and offering its own, and the client ACKs back. Both sides now agree the channel works in both directions and share initial sequence numbers. That costs one full round trip — roughly 10-150 ms depending on distance — before a single byte of HTTP is sent. Real pages amortize it: keep-alive reuses the socket for many requests, and TCP Fast Open can shave a round trip off repeat connections. This RTT tax is exactly why HTTP/3 dropped TCP for QUIC over UDP, where transport and crypto handshakes fuse into one round trip.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'server', label: 'Server' },
          ],
          phases: [
            { id: 'p1', caption: 'Client sends SYN with a random sequence number.', packets: [{ from: 'client', to: 'server', label: 'SYN seq=x' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'Server replies SYN-ACK: acknowledges x, offers its own seq y.', packets: [{ from: 'server', to: 'client', label: 'SYN-ACK ack=x+1 seq=y' }], doneNodeIds: ['client'], activeNodeIds: ['server'] },
            { id: 'p3', caption: 'Client ACKs. The connection is established — 1 RTT spent.', packets: [{ from: 'client', to: 'server', label: 'ACK ack=y+1' }], doneNodeIds: ['client', 'server'] },
            { id: 'p4', caption: 'The socket is kept alive and reused for later requests — no new handshake.', doneNodeIds: ['client', 'server'] },
          ],
        },
      },
      {
        title: 'TLS handshake',
        body: 'Because the URL is HTTPS, a TLS handshake wraps the raw TCP stream. The client sends ClientHello with its supported cipher suites, TLS version, a random nonce, and the SNI hostname so the server can choose the right certificate before any encryption exists. The server replies with its certificate chain and proves it holds the matching private key; the client validates the chain against trusted roots, checks the hostname, and rejects anything expired or mis-issued. Both sides then perform an ephemeral ECDHE exchange — the shared secret never travels — and derive the same session keys; a Finished exchange proves the handshake was not tampered with. TLS 1.3 finishes in one round trip, and session resumption (tickets or PSK) lets returning visitors skip most of it.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'client', label: 'Client' },
            { id: 'server', label: 'Server' },
            { id: 'ca', label: 'CA Trust Store' },
          ],
          phases: [
            { id: 'p1', caption: 'ClientHello: supported ciphers + SNI hostname.', packets: [{ from: 'client', to: 'server', label: 'ClientHello' }], activeNodeIds: ['client'] },
            { id: 'p2', caption: 'ServerCertificate: the chain proving who the server is.', packets: [{ from: 'server', to: 'client', label: 'cert chain' }], doneNodeIds: ['client'], activeNodeIds: ['server'] },
            { id: 'p3', caption: 'Client verifies the chain against trusted roots.', packets: [{ from: 'client', to: 'ca', label: 'verify' }], activeNodeIds: ['ca'] },
            { id: 'p4', caption: 'ECDHE key exchange — both sides derive the same session key.', packets: [{ from: 'client', to: 'server', label: 'ECDHE share' }, { from: 'server', to: 'client', label: 'ECDHE share' }], doneNodeIds: ['ca', 'client', 'server'] },
            { id: 'p5', caption: 'Finished: the encrypted channel is established. TLS 1.3 needs just 1 RTT.', packets: [{ from: 'client', to: 'server', label: 'Finished ✓' }], doneNodeIds: ['ca', 'client', 'server'] },
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
          kind: 'step-flow',
          nodes: [
            { id: 'browser', label: 'Browser' },
            { id: 'cdn', label: 'CDN / LB' },
            { id: 'server', label: 'App Server' },
            { id: 'db', label: 'Database' },
          ],
          phases: [
            { id: 'p1', caption: 'GET / — request headers include Host and cookies.', packets: [{ from: 'browser', to: 'cdn', label: 'GET /' }], activeNodeIds: ['browser'] },
            { id: 'p2', caption: 'CDN checks its cache; a miss forwards to the origin.', packets: [{ from: 'cdn', to: 'server', label: 'forward' }], doneNodeIds: ['browser'], activeNodeIds: ['cdn', 'server'] },
            { id: 'p3', caption: 'The app queries the database.', packets: [{ from: 'server', to: 'db', label: 'SELECT' }], activeNodeIds: ['db'] },
            { id: 'p4', caption: 'Rows return and the server builds the response.', packets: [{ from: 'db', to: 'server', label: 'rows' }], doneNodeIds: ['db'], activeNodeIds: ['server'] },
            { id: 'p5', caption: '200 OK + HTML travels back; the CDN caches it per Cache-Control.', packets: [{ from: 'server', to: 'browser', label: '200 OK' }], doneNodeIds: ['browser', 'cdn', 'server', 'db'] },
          ],
        },
      },
      {
        title: 'Parsing, layout, paint',
        body: 'While the HTML streams in, a preload scanner keeps fetching images, fonts, and scripts in parallel, so the tokenizer is not the only thing working. Tokens build the DOM; CSS builds the CSSOM; DOM and CSSOM combine into the render tree of visible nodes; layout computes exact geometry for every box; paint records draw calls; the compositor stitches layers on the GPU. CSS is render-blocking — the browser refuses to paint before the CSSOM exists, which is why critical CSS is inlined and the rest deferred. A synchronous <script> in the head blocks the parser until it executes; defer and async load it without stopping parsing. After first paint, the framework hydrates the server-rendered HTML and attaches event listeners.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'html', label: 'HTML bytes' },
            { id: 'dom', label: 'DOM + CSSOM' },
            { id: 'render', label: 'Render Tree' },
            { id: 'layout', label: 'Layout' },
            { id: 'paint', label: 'Paint + Composite' },
          ],
          phases: [
            { id: 'p1', caption: 'Bytes stream in and are tokenized incrementally.', activeNodeIds: ['html'] },
            { id: 'p2', caption: 'Tokens become DOM nodes; CSS becomes the CSSOM.', packets: [{ from: 'html', to: 'dom' }], activeNodeIds: ['dom'] },
            { id: 'p3', caption: 'Visible nodes merge into the render tree.', packets: [{ from: 'dom', to: 'render' }], doneNodeIds: ['html'], activeNodeIds: ['render'] },
            { id: 'p4', caption: 'Layout computes the exact geometry of every box.', packets: [{ from: 'render', to: 'layout' }], doneNodeIds: ['dom'], activeNodeIds: ['layout'] },
            { id: 'p5', caption: 'Paint records draw calls; the compositor puts pixels on screen.', packets: [{ from: 'layout', to: 'paint' }], doneNodeIds: ['render', 'html'], activeNodeIds: ['paint'] },
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
          kind: 'code-trace',
          language: 'tsx',
          code: `useEffect(() => {
  console.log('subscribe');
  const sub = chat.subscribe(roomId, onMessage);
  return () => {
    console.log('unsubscribe');
    sub.unsubscribe();
  };
}, [roomId]);`,
          frames: [
            { id: 'f1', caption: 'First render: the component body runs before any effect.', activeLines: [1], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '0' }, { name: 'cleanupRuns', value: '0' }] },
            { id: 'f2', caption: 'StrictMode renders the body a second time with the same values — still before any effect.', activeLines: [1], variables: [{ name: 'renderCount', value: '2', changed: true }, { name: 'effectRuns', value: '0' }, { name: 'cleanupRuns', value: '0' }] },
            { id: 'f3', caption: 'Effect setup runs for the first time and logs subscribe.', activeLines: [2, 3], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }], output: 'subscribe' },
            { id: 'f4', caption: 'StrictMode tears that effect down immediately and cleanup runs.', activeLines: [4, 5, 6], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }], output: 'subscribe\nunsubscribe' },
            { id: 'f5', caption: 'Setup runs a second time — subscribe fires again, and only that subscription stays live.', activeLines: [2, 3], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }], output: 'subscribe\nunsubscribe\nsubscribe' },
          ],
        },
      },
      {
        title: 'StrictMode is a debugger',
        body: `StrictMode is not a linter or a scaffold you should strip out; it is a deliberate correctness harness. StrictMode double-invokes render logic in development — component bodies, initializers passed to useState and useMemo, and state updater functions — so that non-idempotent code fails loudly on your machine instead of silently in production. React 18 added the effect half of that simulation: in development each effect runs setup, cleanup, then setup again, to prepare apps for concurrent rendering, where a component can be mounted, paused, and discarded before it ever commits. The animation walks the full dev lifecycle — render, render, setup, cleanup, setup — before the user ever sees a symptom. Any effect that connects, subscribes, or starts a timer must return a cleanup that fully reverses its setup. When the cleanup is complete, the remount becomes invisible: same final state, one live connection, no leaked listener. The double invoke is the test; the cleanup is the answer.`,
        animation: {
          kind: 'code-trace',
          language: 'tsx',
          code: `function Child() {
  console.log('render');
  useEffect(() => {
    console.log('effect setup');
    return () => console.log('effect cleanup');
  }, []);
  return <p>ready</p>;
}`,
          frames: [
            { id: 'f1', caption: 'First render: React invokes the component body.', activeLines: [2], variables: [{ name: 'renderCount', value: '1', changed: true }, { name: 'effectRuns', value: '0' }, { name: 'cleanupRuns', value: '0' }], output: 'render' },
            { id: 'f2', caption: 'StrictMode renders the body a second time — same values, still before any effect.', activeLines: [2], variables: [{ name: 'renderCount', value: '2', changed: true }, { name: 'effectRuns', value: '0' }, { name: 'cleanupRuns', value: '0' }], output: 'render\nrender' },
            { id: 'f3', caption: 'Only now does the effect setup run, after the commit.', activeLines: [4], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }], output: 'render\nrender\neffect setup' },
            { id: 'f4', caption: 'StrictMode immediately runs the returned cleanup.', activeLines: [5], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }], output: 'render\nrender\neffect setup\neffect cleanup' },
            { id: 'f5', caption: 'Setup runs again: one active effect, and setup had to be re-entrant.', activeLines: [4], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }], output: 'render\nrender\neffect setup\neffect cleanup\neffect setup' },
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
          kind: 'code-trace',
          language: 'tsx',
          code: `function ChatRoom({ roomId }: { roomId: string }) {
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
          frames: [
            { id: 'f1', caption: 'First render completes with an empty message list.', activeLines: [2], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '0' }, { name: 'cleanupRuns', value: '0' }] },
            { id: 'f2', caption: 'StrictMode renders the body a second time — same values, still before any effect.', activeLines: [2], variables: [{ name: 'renderCount', value: '2', changed: true }, { name: 'effectRuns', value: '0' }, { name: 'cleanupRuns', value: '0' }] },
            { id: 'f3', caption: 'Effect setup runs and subscribes to the room.', activeLines: [4, 5, 6], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }], output: 'setup general' },
            { id: 'f4', caption: 'StrictMode fires the cleanup returned by that effect.', activeLines: [7, 8, 9], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }], output: 'setup general\ncleanup general' },
            { id: 'f5', caption: 'Setup runs a second time — only that subscription stays live, so the cleanup prevented a leak.', activeLines: [4, 5, 6], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }], output: 'setup general\ncleanup general\nsetup general' },
            { id: 'f6', caption: 'Production skips the simulation: setup once, cleanup only on unmount.', activeLines: [4, 5], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '0' }], output: 'setup general' },
          ],
        },
      },
      {
        title: 'Production still needs cleanup',
        body: `Production never double-invokes on mount, so where do cleanups come from? Dependency changes and unmounts. The animation follows roomId switching from general to random: React first runs the previous effect's cleanup to leave the general room, then runs the new setup to join random. Only one subscription is ever live. Leave the screen and the final cleanup runs on unmount. This is the deeper lesson of the StrictMode question: the dev-mode simulation is just an accelerated version of lifecycle events that happen all the time in production. Every dependency change is a mini remount, and every navigation away is a cleanup. An effect that only cleans up correctly when it is convenient will leak subscriptions, stale timers, and out-of-order responses. Writing effects that tolerate arbitrary setup and cleanup ordering is the same skill as handling routes correctly.`,
        animation: {
          kind: 'code-trace',
          language: 'tsx',
          code: `useEffect(() => {
  console.log('join', roomId);
  const sub = chat.subscribe(roomId, onMessage);
  return () => {
    console.log('leave', roomId);
    sub.unsubscribe();
  };
}, [roomId]);`,
          frames: [
            { id: 'f1', caption: 'Mount with roomId "general" — one subscription.', activeLines: [1, 2, 3], variables: [{ name: 'roomId', value: 'general' }, { name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }], output: 'join general' },
            { id: 'f2', caption: 'Switch to "random": React cleans up the old room first.', activeLines: [4, 5, 6], variables: [{ name: 'roomId', value: 'random', changed: true }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }], output: 'join general\nleave general' },
            { id: 'f3', caption: 'Then setup runs for the new room.', activeLines: [1, 2, 3], variables: [{ name: 'roomId', value: 'random' }, { name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }], output: 'join general\nleave general\njoin random' },
            { id: 'f4', caption: 'Only the "random" subscription is live.', activeLines: [3, 6], variables: [{ name: 'roomId', value: 'random' }, { name: 'effectRuns', value: '2' }, { name: 'cleanupRuns', value: '1' }] },
            { id: 'f5', caption: 'Leaving the screen runs the final cleanup on unmount.', activeLines: [4, 5, 6], variables: [{ name: 'roomId', value: 'random' }, { name: 'effectRuns', value: '2' }, { name: 'cleanupRuns', value: '2', changed: true }], output: 'join general\nleave general\njoin random\nleave random' },
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
          kind: 'code-trace',
          language: 'tsx',
          code: `useEffect(() => {
  const controller = new AbortController();

  fetch('/api/rooms/' + roomId, { signal: controller.signal })
    .then((res) => res.json())
    .then(setRoom)
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort();
}, [roomId]);`,
          frames: [
            { id: 'f1', caption: 'First setup starts a fetch with an abort signal.', activeLines: [2, 4], variables: [{ name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }, { name: 'requests', value: '1', changed: true }] },
            { id: 'f2', caption: 'StrictMode cleanup aborts the in-flight request.', activeLines: [11], variables: [{ name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }, { name: 'requests', value: '1' }] },
            { id: 'f3', caption: 'Second setup starts a fresh request that will win.', activeLines: [2, 4], variables: [{ name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }, { name: 'requests', value: '2', changed: true }] },
            { id: 'f4', caption: 'The aborted request rejects with AbortError and is ignored.', activeLines: [7, 8], variables: [{ name: 'effectRuns', value: '2' }, { name: 'cleanupRuns', value: '1' }, { name: 'requests', value: '1', changed: true }] },
            { id: 'f5', caption: 'Only one response reaches setRoom — the effect is idempotent.', activeLines: [5, 6], variables: [{ name: 'effectRuns', value: '2' }, { name: 'cleanupRuns', value: '1' }, { name: 'requests', value: '1' }] },
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
          kind: 'timeline',
          lanes: [
            { id: 'stack', label: 'Call Stack', kind: 'call' },
            { id: 'micro', label: 'Microtask Queue', kind: 'microtask' },
            { id: 'macro', label: 'Macrotask Queue', kind: 'macrotask' },
          ],
          frames: [
            { id: 'f1', caption: 'The script task starts: line 1 prints A synchronously.', marks: [{ laneId: 'stack', label: 'log A', status: 'active' }] },
            { id: 'f2', caption: 'setTimeout queues B in the macrotask queue and returns.', marks: [{ laneId: 'stack', label: 'register timer', status: 'active' }, { laneId: 'macro', label: 'B (timeout 0)', status: 'active' }] },
            { id: 'f3', caption: 'Promise.then queues C as a microtask — still no execution.', marks: [{ laneId: 'stack', label: 'register .then', status: 'active' }, { laneId: 'micro', label: 'C (.then)', status: 'active' }, { laneId: 'macro', label: 'B (timeout 0)', status: 'active' }] },
            { id: 'f4', caption: 'Line 4 prints D; the task runs to completion before any queue drains.', marks: [{ laneId: 'stack', label: 'log D', status: 'done' }, { laneId: 'micro', label: 'C waiting', status: 'active' }, { laneId: 'macro', label: 'B waiting', status: 'active' }] },
            { id: 'f5', caption: 'Draining produces A D C B: sync first, microtasks next, then the timer.', marks: [{ laneId: 'stack', label: 'A and D printed', status: 'done' }, { laneId: 'micro', label: 'C printed', status: 'done' }, { laneId: 'macro', label: 'B printed', status: 'done' }] },
          ],
        },
      },
      {
        title: 'Synchronous code owns the stack',
        body: `The first rule of the event loop is run-to-completion: once a task starts, the engine never pauses it to run a queued callback. The entire script is a single task, so every synchronous statement executes before the engine even looks at the queues. This is why a long synchronous loop blocks timers, clicks, and painting, and why setTimeout(fn, 0) is a request to queue rather than a command to run now. In the animation, watch the call-stack lane: logging A, registering the timer, registering the promise callback, and logging D all happen inside one unbroken task. The microtask and macrotask lanes are only bookkeeping at this point; nothing queued can preempt live JavaScript. The zero-millisecond delay says nothing about when the callback runs, only about the minimum wait once the queue becomes eligible.`,
        animation: {
          kind: 'timeline',
          lanes: [
            { id: 'stack', label: 'Call Stack', kind: 'call' },
            { id: 'micro', label: 'Microtask Queue', kind: 'microtask' },
            { id: 'macro', label: 'Macrotask Queue', kind: 'macrotask' },
          ],
          frames: [
            { id: 'f1', caption: 'One script task begins and will not be interrupted.', marks: [{ laneId: 'stack', label: 'script start', status: 'active' }] },
            { id: 'f2', caption: "console.log('A') executes on the stack immediately.", marks: [{ laneId: 'stack', label: 'log A', status: 'active' }] },
            { id: 'f3', caption: 'setTimeout only registers B in the macrotask queue.', marks: [{ laneId: 'stack', label: 'register timer', status: 'active' }, { laneId: 'macro', label: 'B queued', status: 'active' }] },
            { id: 'f4', caption: 'Promise.then only registers C in the microtask queue.', marks: [{ laneId: 'stack', label: 'register .then', status: 'active' }, { laneId: 'micro', label: 'C queued', status: 'active' }] },
            { id: 'f5', caption: "console.log('D') completes the task with the queues untouched.", marks: [{ laneId: 'stack', label: 'log D', status: 'done' }, { laneId: 'micro', label: 'C queued', status: 'active' }, { laneId: 'macro', label: 'B queued', status: 'active' }] },
          ],
        },
      },
      {
        title: 'The microtask queue drains',
        body: `When the current task ends, the engine does not move straight to timers. It first drains the entire microtask queue to exhaustion: promise callbacks, queueMicrotask callbacks, and MutationObserver records. If a microtask queues another microtask, that new one also runs in the same drain, before the loop is allowed to proceed. This is why the code after await feels immediate — it is a microtask continuation, not a brand-new task. In the animation, C runs on the microtask lane while B still sits untouched in the macrotask lane. A promise chain that keeps rescheduling itself would keep that lane spinning and starve timers and rendering completely. The event loop escapes to a macrotask only when the microtask queue is empty, which is the rule that decides C before B in our snippet.`,
        animation: {
          kind: 'timeline',
          lanes: [
            { id: 'stack', label: 'Call Stack', kind: 'call' },
            { id: 'micro', label: 'Microtask Queue', kind: 'microtask' },
            { id: 'macro', label: 'Macrotask Queue', kind: 'macrotask' },
          ],
          frames: [
            { id: 'f1', caption: 'The script task ends; C is first in the microtask queue.', marks: [{ laneId: 'micro', label: 'C (.then)', status: 'active' }] },
            { id: 'f2', caption: 'The engine runs C immediately and it prints.', marks: [{ laneId: 'micro', label: 'C prints', status: 'done' }] },
            { id: 'f3', caption: 'Any microtask queued by C would run during this same drain.', marks: [{ laneId: 'micro', label: 'nested microtask', status: 'active' }] },
            { id: 'f4', caption: 'The microtask queue is empty; B has still not run.', marks: [{ laneId: 'micro', label: 'queue empty', status: 'done' }, { laneId: 'macro', label: 'B waiting', status: 'active' }] },
            { id: 'f5', caption: 'Only an empty microtask queue lets the loop pick B.', marks: [{ laneId: 'macro', label: 'B eligible', status: 'active' }] },
          ],
        },
      },
      {
        title: 'One macrotask per turn',
        body: `Once the microtask queue empties, the browser gets an opportunity to render, and then the loop takes exactly one macrotask — in this snippet, the timer callback B. Running B enters JavaScript as a fresh task, and anything it queues starts the cycle over: after B finishes, microtasks drain again, render may happen, and the next macrotask is selected. This one-at-a-time discipline is what keeps pages responsive; timers never batch-fire in parallel. Watch the animation: C is marked done on the microtask lane, B runs alone on the macrotask lane, a render phase appears between tasks, and the loop checks the queues again. Putting the phases together explains the output: the script prints A and D synchronously, the microtask queue prints C, and the first macrotask prints B.`,
        animation: {
          kind: 'timeline',
          lanes: [
            { id: 'stack', label: 'Call Stack', kind: 'call' },
            { id: 'micro', label: 'Microtask Queue', kind: 'microtask' },
            { id: 'macro', label: 'Macrotask Queue', kind: 'macrotask' },
            { id: 'render', label: 'Render / Paint', kind: 'render' },
          ],
          frames: [
            { id: 'f1', caption: 'The microtask drain is complete, so the loop may render.', marks: [{ laneId: 'micro', label: 'C printed', status: 'done' }, { laneId: 'render', label: 'paint opportunity', status: 'active' }] },
            { id: 'f2', caption: 'The loop takes exactly one macrotask: B.', marks: [{ laneId: 'macro', label: 'B prints', status: 'active' }] },
            { id: 'f3', caption: 'Anything B queues drains as microtasks immediately after it.', marks: [{ laneId: 'macro', label: 'B prints', status: 'done' }, { laneId: 'micro', label: 'B microtasks', status: 'active' }] },
            { id: 'f4', caption: 'Then another render opportunity before the next task.', marks: [{ laneId: 'render', label: 'paint', status: 'active' }] },
            { id: 'f5', caption: 'The next macrotask waits for another full turn.', marks: [{ laneId: 'macro', label: 'next timer', status: 'active' }] },
            { id: 'f6', caption: 'The complete order is A D C B.', marks: [{ laneId: 'stack', label: 'A D C B', status: 'done' }] },
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
          kind: 'timeline',
          lanes: [
            { id: 'stack', label: 'Call Stack', kind: 'call' },
            { id: 'micro', label: 'Microtask Queue', kind: 'microtask' },
            { id: 'macro', label: 'Macrotask Queue', kind: 'macrotask' },
            { id: 'render', label: 'Render / Paint', kind: 'render' },
          ],
          frames: [
            { id: 'f1', caption: 'Timer B is queued, then a self-rescheduling async loop starts.', marks: [{ laneId: 'macro', label: 'B waiting', status: 'active' }, { laneId: 'stack', label: 'async loop', status: 'active' }] },
            { id: 'f2', caption: 'Each iteration queues another microtask.', marks: [{ laneId: 'micro', label: 'microtask n', status: 'active' }] },
            { id: 'f3', caption: 'The drain never reaches empty, so B never gets a turn.', marks: [{ laneId: 'micro', label: 'microtask n+1', status: 'active' }, { laneId: 'macro', label: 'B waiting', status: 'active' }] },
            { id: 'f4', caption: 'The browser cannot paint between microtasks.', marks: [{ laneId: 'render', label: 'paint starved', status: 'active' }] },
            { id: 'f5', caption: 'Yield a macrotask (setTimeout, scheduler.yield) to break starvation.', marks: [{ laneId: 'macro', label: 'yield', status: 'active' }, { laneId: 'render', label: 'paint resumes', status: 'done' }] },
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
          kind: 'step-flow',
          nodes: [
            { id: 'query', label: 'Query', sublabel: 'email = ?' },
            { id: 'heap1', label: 'Heap Page 1' },
            { id: 'heap2', label: 'Heap Page 2' },
            { id: 'heapn', label: 'Heap Page N' },
            { id: 'rows', label: 'Rows Tested' },
          ],
          phases: [
            { id: 'p1', caption: 'The query arrives with an equality filter on an unindexed column.', activeNodeIds: ['query'] },
            { id: 'p2', caption: 'The sequential scan reads heap page 1, testing every row.', packets: [{ from: 'query', to: 'heap1' }], activeNodeIds: ['heap1'] },
            { id: 'p3', caption: 'No match in page 1 — page 2 is next.', packets: [{ from: 'heap1', to: 'heap2' }], doneNodeIds: ['heap1'], activeNodeIds: ['heap2'] },
            { id: 'p4', caption: 'The scan continues page after page with no shortcut.', packets: [{ from: 'heap2', to: 'heapn' }], doneNodeIds: ['heap1', 'heap2'], activeNodeIds: ['heapn'] },
            { id: 'p5', caption: 'Every row in every page is compared against the filter.', doneNodeIds: ['heap1', 'heap2', 'heapn'], activeNodeIds: ['rows'] },
            { id: 'p6', caption: 'Total I/O is O(n) pages even though only one row matches.', doneNodeIds: ['heap1', 'heap2', 'heapn', 'rows'] },
          ],
        },
      },
      {
        title: 'What a B+Tree buys',
        body: `A B+Tree keeps keys sorted in a shallow, wide tree: the root and internal nodes hold separator keys that route a search, and the leaves hold the actual keys in sorted order, linked sideways for range scans. A three- or four-level tree covers millions of rows because each page fans out to hundreds of children. Searching one email walks root, then internal, then leaf: a handful of page reads instead of tens of thousands. The animation shows that descent — at every node the search key routes down a single branch, so the remaining search space shrinks by fan-out at each level. Insertions and deletions keep the tree balanced through page splits and merges, which is a maintenance cost paid on every write. Range queries are a B+Tree strength: find the first leaf, then follow sibling pointers instead of descending again.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'query', label: 'Query' },
            { id: 'root', label: 'B+Tree Root' },
            { id: 'internal', label: 'Internal Node' },
            { id: 'leaf', label: 'Leaf Page', sublabel: 'sorted keys' },
            { id: 'leaf2', label: 'Next Leaf' },
            { id: 'row', label: 'Heap Row' },
          ],
          phases: [
            { id: 'p1', caption: 'A lookup enters at the root — no heap pages touched yet.', activeNodeIds: ['query'] },
            { id: 'p2', caption: 'Separator keys route the search to exactly one child.', packets: [{ from: 'query', to: 'root' }], activeNodeIds: ['root'] },
            { id: 'p3', caption: 'The internal node narrows the range further.', packets: [{ from: 'root', to: 'internal' }], doneNodeIds: ['root'], activeNodeIds: ['internal'] },
            { id: 'p4', caption: 'The leaf page holds the keys in sorted order.', packets: [{ from: 'internal', to: 'leaf' }], doneNodeIds: ['internal'], activeNodeIds: ['leaf'] },
            { id: 'p5', caption: 'Range scans walk sibling leaf pointers without descending again.', packets: [{ from: 'leaf', to: 'leaf2' }], doneNodeIds: ['leaf'], activeNodeIds: ['leaf2'] },
            { id: 'p6', caption: 'Every leaf entry points at a heap row — that fetch is the next cost.', packets: [{ from: 'leaf2', to: 'row', label: 'row pointer' }], activeNodeIds: ['leaf2', 'row'] },
          ],
        },
      },
      {
        title: 'Walk an indexed lookup',
        body: `Put the pipeline together. The query arrives with a predicate, and the planner decides the cheapest access path; with an equality filter on an indexed column it chooses the B+Tree. The search starts at the root page, compares the key against separator values, and follows the single child page that can contain the target. At the leaf page the key is found among sorted entries, and the leaf's row pointer identifies the heap page and slot; a final page read fetches the actual row. That is O(log n) index page reads plus one row fetch, versus O(n) heap reads for a scan. Watch the animation's active node move one step per phase: every arrow is a real page I/O, and there are only a handful of them. Without a covering index, the row fetch is an extra random read — the hidden second cost.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'query', label: 'Query', sublabel: 'email = ?' },
            { id: 'planner', label: 'Planner' },
            { id: 'root', label: 'B+Tree Root' },
            { id: 'internal', label: 'Internal Node' },
            { id: 'leaf', label: 'Leaf Page', sublabel: 'sorted keys' },
            { id: 'row', label: 'Row Fetch' },
          ],
          phases: [
            { id: 'p1', caption: 'The query enters the planner with an equality filter.', activeNodeIds: ['query'] },
            { id: 'p2', caption: 'Planner estimates selectivity and picks the email index.', packets: [{ from: 'query', to: 'planner' }], activeNodeIds: ['planner'] },
            { id: 'p3', caption: 'Descend from the root: separator keys choose a branch.', packets: [{ from: 'planner', to: 'root' }], doneNodeIds: ['query'], activeNodeIds: ['root'] },
            { id: 'p4', caption: 'The internal node routes to the leaf that can hold the key.', packets: [{ from: 'root', to: 'internal' }], doneNodeIds: ['root'], activeNodeIds: ['internal'] },
            { id: 'p5', caption: 'The leaf holds sorted keys; find the entry and its row pointer.', packets: [{ from: 'internal', to: 'leaf' }], doneNodeIds: ['internal'], activeNodeIds: ['leaf'] },
            { id: 'p6', caption: 'Fetch the heap row by pointer — the lookup is done.', packets: [{ from: 'leaf', to: 'row' }], doneNodeIds: ['leaf'], activeNodeIds: ['row'] },
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
          kind: 'step-flow',
          nodes: [
            { id: 'query', label: 'Query' },
            { id: 'planner', label: 'Planner' },
            { id: 'index', label: 'Composite Index', sublabel: '(last_name, first_name, birth_date)' },
            { id: 'leaf', label: 'Leaf Pages', sublabel: 'all ranges' },
            { id: 'heap', label: 'Heap Rows' },
          ],
          phases: [
            { id: 'p1', caption: "WHERE last_name = 'Patel' — a usable leftmost prefix.", activeNodeIds: ['query'] },
            { id: 'p2', caption: 'The planner matches the prefix and picks the composite index.', packets: [{ from: 'query', to: 'planner' }], activeNodeIds: ['planner'] },
            { id: 'p3', caption: 'The seek lands at the Patel range; every Patel row is contiguous there.', packets: [{ from: 'planner', to: 'index' }], doneNodeIds: ['query'], activeNodeIds: ['index'] },
            { id: 'p4', caption: 'Filtering on first_name alone has no anchor, so every leaf is scanned.', packets: [{ from: 'index', to: 'leaf', label: 'full index scan' }], doneNodeIds: ['planner'], activeNodeIds: ['leaf'] },
            { id: 'p5', caption: 'Only entries that survive the index filter fetch heap rows.', packets: [{ from: 'leaf', to: 'heap', label: 'row pointer' }], doneNodeIds: ['index'], activeNodeIds: ['leaf', 'heap'] },
            { id: 'p6', caption: 'Column order decides which of these plans can seek.', doneNodeIds: ['query', 'planner', 'index', 'leaf', 'heap'], activeNodeIds: ['index'] },
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
          kind: 'step-flow',
          nodes: [
            { id: 'insert', label: 'INSERT' },
            { id: 'index', label: 'Index Maintenance' },
            { id: 'buffer', label: 'Buffer Pool' },
            { id: 'planner', label: 'Planner' },
            { id: 'scan', label: 'Sequential Scan' },
            { id: 'fetch', label: 'Heap Row Fetch' },
          ],
          phases: [
            { id: 'p1', caption: 'A write arrives and updates the heap row first.', activeNodeIds: ['insert'] },
            { id: 'p2', caption: 'Every index on the table must be updated too — write amplification.', packets: [{ from: 'insert', to: 'index' }], activeNodeIds: ['index'] },
            { id: 'p3', caption: 'Page splits and dirty pages compete for the buffer pool.', packets: [{ from: 'index', to: 'buffer' }], activeNodeIds: ['buffer'] },
            { id: 'p4', caption: 'A read with poor selectivity reaches the planner.', packets: [{ from: 'buffer', to: 'planner' }], doneNodeIds: ['buffer'], activeNodeIds: ['planner'] },
            { id: 'p5', caption: 'The estimate says scanning beats the index plus random fetches.', packets: [{ from: 'planner', to: 'scan' }], doneNodeIds: ['planner'], activeNodeIds: ['scan'] },
            { id: 'p6', caption: 'A non-covering index would add one heap fetch per match.', doneNodeIds: ['insert', 'index', 'scan'], activeNodeIds: ['fetch'] },
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
          kind: 'step-flow',
          nodes: [
            { id: 'page', label: 'app.example.com', sublabel: 'Page JavaScript' },
            { id: 'browser', label: 'Browser', sublabel: 'Same-origin policy' },
            { id: 'api', label: 'api.other.com', sublabel: 'Your API server' },
          ],
          phases: [
            { id: 'p1', caption: 'fetch() leaves the page carrying an Origin header — the browser always tells the server who is asking.', packets: [{ from: 'page', to: 'api', label: 'GET /data · Origin' }], activeNodeIds: ['page'] },
            { id: 'p2', caption: 'The server answers normally: 200 with JSON. It has no idea the browser may reject the read.', packets: [{ from: 'api', to: 'page', label: '200 JSON' }], doneNodeIds: ['page'], activeNodeIds: ['api'] },
            { id: 'p3', caption: 'The browser compares response headers to the page origin: no matching Access-Control-Allow-Origin, so the body is withheld.', activeNodeIds: ['browser'], errorNodeIds: ['api'] },
            { id: 'p4', caption: 'JavaScript sees only a TypeError — the request happened, the read was denied. curl and Postman never hit this check.', doneNodeIds: ['page', 'api', 'browser'] },
          ],
        },
      },
      {
        title: 'Simple or non-simple: what triggers the OPTIONS call',
        body: `Not every cross-origin request pays a preflight. The specification defines a "simple" shape — GET, HEAD or POST, only safelisted headers, and Content-Type restricted to text/plain, multipart/form-data or application/x-www-form-urlencoded. Anything else is non-simple: a PUT or DELETE, a custom header like Authorization, or the everyday Content-Type: application/json. Non-simple requests cannot leave immediately; the browser must first ask the other origin for permission, because a blind request could already have side effects — a DELETE that fires before the browser decides the response may not be read is too late to undo. Compare the two panels: the left column is sent straight through, the right column is gated.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Simple request — sent straight through',
          afterLabel: 'Non-simple — gated behind a preflight',
          before: [
            { text: 'GET, HEAD, POST — only these three verbs', tone: 'success' },
            { text: 'Safelisted headers only: Accept, Accept-Language, Content-Language, Range', tone: 'success' },
            { text: 'Content-Type limited to text/plain, multipart/form-data, x-www-form-urlencoded', tone: 'success' },
            { text: 'No streamed body, no event listeners attached', tone: 'neutral' },
          ],
          after: [
            { text: 'PUT, PATCH, DELETE — or any verb outside the tiny list', tone: 'danger' },
            { text: 'Any custom header: Authorization, X-Request-Id, X-CSRF-Token…', tone: 'danger' },
            { text: 'Content-Type: application/json — the everyday trigger', tone: 'danger' },
            { text: 'Any of the above combined with credentials: "include"', tone: 'danger' },
          ],
          frames: [
            { id: 'f1', caption: 'Start with the method: GET and POST survive, PUT and DELETE do not.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'Then the headers: anything outside the safelist forces a preflight.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'JSON request bodies are the most common trigger in day-to-day web work.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'Stay inside the simple shape and the browser skips OPTIONS entirely.', beforeIndex: 3, afterIndex: 3 },
          ],
        },
      },
      {
        title: 'The OPTIONS handshake',
        body: `The preflight is an HTTP request the browser composes on its own — you cannot opt out of it. It sends OPTIONS with Access-Control-Request-Method and Access-Control-Request-Headers describing exactly what the real request intends to do. The server must reply with Access-Control-Allow-Origin, -Methods and -Headers that cover it. Only then does the browser release the actual request. The approval is cached for the duration of Access-Control-Max-Age, which is why the OPTIONS row often disappears from the Network tab on refresh. Watch the sequence: negotiate, cache, then the real PUT travels — a preflight is a round trip, so it is latency worth understanding and worth caching.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'browser', label: 'Browser', sublabel: 'app.example.com' },
            { id: 'api', label: 'API server', sublabel: 'api.other.com' },
          ],
          phases: [
            { id: 'p1', caption: 'The browser sends OPTIONS carrying Access-Control-Request-Method: PUT and Access-Control-Request-Headers: authorization.', packets: [{ from: 'browser', to: 'api', label: 'OPTIONS · ACRM/ACRH' }], activeNodeIds: ['browser'] },
            { id: 'p2', caption: 'The server must answer with Allow-Origin, Allow-Methods and Allow-Headers echoing what it permits.', packets: [{ from: 'api', to: 'browser', label: 'ACAO · ACAM · ACAH' }], activeNodeIds: ['api'] },
            { id: 'p3', caption: 'The browser stores the approval for Access-Control-Max-Age seconds — repeat calls skip the OPTIONS round trip.', activeNodeIds: ['browser'] },
            { id: 'p4', caption: 'Only now does the real request go out, carrying the actual JSON body or Authorization header.', packets: [{ from: 'browser', to: 'api', label: 'PUT · Authorization' }], activeNodeIds: ['api'] },
            { id: 'p5', caption: 'The response returns with headers that match, so this time the browser releases the body to JavaScript.', packets: [{ from: 'api', to: 'browser', label: '200 + ACAO' }], doneNodeIds: ['browser', 'api'] },
          ],
        },
      },
      {
        title: 'The response headers that grant access',
        body: `Every granting header carries one rule that trips people up. Allow-Origin must match the page origin exactly — the wildcard * works only for requests without credentials, and with cookies or Authorization it is rejected outright; the server has to echo the exact origin and add Access-Control-Allow-Credentials: true. Allow-Methods and Allow-Headers must name everything the real request uses, and one missing entry fails the whole preflight even if the rest is perfect. Max-Age is the performance lever most teams forget: with it, the browser stops asking on every call. Read the response headers like a contract — each line is one clause of what the browser is about to permit.`,
        animation: {
          kind: 'code-trace',
          language: 'http',
          code: `HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, PUT, DELETE
Access-Control-Allow-Headers: authorization, content-type
Access-Control-Max-Age: 600
Access-Control-Allow-Credentials: true`,
          frames: [
            { id: 'f1', caption: 'Allow-Origin must match the page origin exactly; * is only legal for credential-free requests.', activeLines: [2], variables: [{ name: 'page origin', value: 'app.example.com' }] },
            { id: 'f2', caption: 'Allow-Methods and Allow-Headers must cover everything the real request uses — one miss fails the preflight.', activeLines: [3, 4], variables: [{ name: 'method', value: 'PUT' }, { name: 'header', value: 'authorization', changed: true }] },
            { id: 'f3', caption: 'Max-Age caches the approval: this one header removes an OPTIONS round trip from every later call.', activeLines: [5], variables: [{ name: 'preflight cache', value: '600 s' }] },
            { id: 'f4', caption: 'With cookies attached, * is forbidden everywhere: echo the exact origin and set Allow-Credentials.', activeLines: [6], variables: [{ name: 'credentials', value: 'include' }] },
          ],
        },
      },
      {
        title: 'Debugging it in sixty seconds',
        body: `Treat the client error as a symptom, not a diagnosis. Open the Network tab and look for the OPTIONS row: if it is red, missing, or answered 404/405, the API is refusing to negotiate and the real request never ran. If OPTIONS is green but the real request is flagged, compare the granted headers against what the request actually sends — a missing method or header entry is the usual culprit. Then fix it where it lives: server-side middleware or gateway configuration, never in the fetch options, because the client cannot lift a browser-enforced block. When you do not control the API, proxy the call through your own origin — a Next.js rewrite or nginx location — and the browser never sees a cross-origin request at all.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'What the browser shows you',
          afterLabel: 'Where the fix actually lives',
          before: [
            { text: 'fetch() rejects — TypeError: Failed to fetch', tone: 'danger' },
            { text: 'Console: "Access to fetch … blocked by CORS policy"', tone: 'danger' },
            { text: 'Network tab: an OPTIONS row in red, or the real request flagged', tone: 'neutral' },
            { text: 'Server logs show the request arrived — only the read was blocked', tone: 'neutral' },
          ],
          after: [
            { text: 'Answer OPTIONS with ACAO/ACAM/ACAH — cors() middleware or gateway config', tone: 'success' },
            { text: 'Client-side code cannot lift the block — clever fetch options included', tone: 'neutral' },
            { text: 'No control over the API? Proxy through your own origin (Next.js rewrites, nginx)', tone: 'success' },
            { text: 'Cache the approval with Max-Age: every failed preflight is a round trip paid per call', tone: 'neutral' },
          ],
          frames: [
            { id: 'f1', caption: 'Start at the Network tab — the message in the catch block is only a symptom.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'A red or missing OPTIONS row points at the negotiation: the server must answer it.', beforeIndex: 2, afterIndex: 0 },
            { id: 'f3', caption: 'The fix lives server-side or in a same-origin proxy — never in the client.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f4', caption: 'And cache the approval so the handshake is paid once, not on every request.', beforeIndex: 3, afterIndex: 3 },
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
          kind: 'code-trace',
          language: 'js',
          code: `const posts = await Post.findAll({ limit: 100 });

for (const post of posts) {
  post.author = await User.findByPk(post.authorId);
}

return posts;`,
          frames: [
            { id: 'f1', caption: 'The handler starts clean: one query for the list of posts.', activeLines: [1], variables: [{ name: 'queries', value: '1' }], output: 'SELECT * FROM posts LIMIT 100;' },
            { id: 'f2', caption: 'The loop opens and touches the first row\u2019s relation.', activeLines: [3], variables: [{ name: 'row', value: '1 of 100' }], output: 'SELECT * FROM users WHERE id = 17;' },
            { id: 'f3', caption: 'Every iteration is its own round trip — the classic N+1.', activeLines: [4], variables: [{ name: 'queries', value: '101', changed: true }], output: '\u2026 99 more single-row SELECTs' },
            { id: 'f4', caption: 'The page looks correct; the cost only scales with the number of rows.', activeLines: [6], variables: [{ name: 'total queries', value: '101 = 1 + N' }] },
          ],
        },
      },
      {
        title: 'Why lazy loading keeps it silent',
        body: `The ORM did not lie to you: it returned proxies, not data. When the first query loads 100 posts, relation fields like post.author are placeholders that promise to fetch later — the moment any code reads one, the ORM issues a query behind the scenes. That laziness is a feature at small scale, which is why it is the default; it becomes a trap when the access happens inside a loop, a serializer, or a template. Notice where the loop actually runs: sometimes it is a visible for-loop, but just as often it is toJSON(), a presenter layer, or GraphQL resolving each author field separately. Watch the animation — the trigger is not your query call, it is the innocent property access, which is why grepping for find() calls never finds this bug.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'endpoint', label: 'GET /feed', sublabel: 'Handler' },
            { id: 'orm', label: 'ORM', sublabel: 'post.author proxy' },
            { id: 'db', label: 'Database' },
          ],
          phases: [
            { id: 'p1', caption: 'The handler asks for the list; the ORM translates it to a single SELECT.', packets: [{ from: 'endpoint', to: 'orm', label: 'findAll(100)' }], activeNodeIds: ['endpoint'] },
            { id: 'p2', caption: 'The ORM returns 100 rows plus 100 lazy placeholders — no author data yet.', packets: [{ from: 'orm', to: 'endpoint', label: '100 rows + proxies' }], doneNodeIds: ['endpoint'], activeNodeIds: ['orm'] },
            { id: 'p3', caption: 'The serializer reads post.author on the first row, and the proxy fires a query.', packets: [{ from: 'orm', to: 'db', label: 'WHERE id = 1' }], activeNodeIds: ['orm'] },
            { id: 'p4', caption: 'One row comes back — and the next property access repeats the whole trip.', packets: [{ from: 'db', to: 'orm', label: '1 row' }], activeNodeIds: ['db'] },
            { id: 'p5', caption: 'By the end the innocent serializer has paid 100 serialized round trips nobody sees.', doneNodeIds: ['db'], activeNodeIds: ['orm'], errorNodeIds: [] },
          ],
        },
      },
      {
        title: 'The waterfall: why N round trips compound',
        body: `A single query against a local database feels free — fractions of a millisecond — so the loop looks harmless in development. Production changes the arithmetic: every query crosses a network, checks out a connection, parses and plans, and the awaits are strictly serialized, so each round trip waits for the one before it. At only 1 ms per trip, 100 rows add 100 ms of pure waiting before rendering starts; under load, connection polling and lock waits make it far worse, and p99 latency sails past the timeouts. The animation shows the shape that should be burned into memory: a staircase of round trips instead of one step. N+1 is not a SQL problem — the queries are individually fast — it is a round-trip multiplication problem, which is why batching survives even when a join is inconvenient.`,
        animation: {
          kind: 'timeline',
          lanes: [
            { id: 'app', label: 'App server', kind: 'call' },
            { id: 'db', label: 'Database round trips', kind: 'custom' },
          ],
          frames: [
            { id: 'f1', caption: 'The request arrives and the list query leaves the app.', marks: [{ laneId: 'app', label: 'GET /feed', status: 'active' }] },
            { id: 'f2', caption: 'The list returns and the loop begins its first lookup.', marks: [{ laneId: 'db', label: 'query 1 (list)', status: 'done' }, { laneId: 'app', label: 'loop begins', status: 'active' }] },
            { id: 'f3', caption: 'Each author lookup waits for the previous one — strictly serialized.', marks: [{ laneId: 'app', label: 'awaiting\u2026', status: 'active' }, { laneId: 'db', label: 'queries 2\u201350', status: 'active' }] },
            { id: 'f4', caption: 'At ~1 ms per trip, 100 rows add ~100 ms before rendering starts.', marks: [{ laneId: 'db', label: 'queries 51\u2013101', status: 'active' }] },
            { id: 'f5', caption: 'One eager load collapses this entire waterfall into a single round trip.', marks: [{ laneId: 'app', label: '200 OK', status: 'done' }, { laneId: 'db', label: '1 joined query', status: 'done' }] },
          ],
        },
      },
      {
        title: 'Fix one: eager loading with a join',
        body: `The smallest change with the biggest payoff: tell the ORM upfront that you will need the authors, so it plans a single query instead of a discovery sequence. In most ORMs that is an include, with, or populate option that compiles to a JOIN, and the query count drops from 101 to 1 regardless of row count. The trade-off to name out loud: a join to a belongs-to relation is safe, but joining a has-many relation multiplies parent rows — 100 posts with 10 comments each return 1000 rows with the post payload duplicated, which is often worse than a second query. Compare the panels: the left column is the same code with one line removed, the right column is the same intent expressed as one statement. Interviewers are listening for whether you know the join's row-multiplication caveat, not just the incantation.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Lazy loop — 1 + N queries',
          afterLabel: 'Eager load — 1 query',
          before: [
            { text: 'const posts = await Post.findAll({ limit: 100 });', tone: 'neutral' },
            { text: 'for (const post of posts) {', tone: 'neutral' },
            { text: '  post.author = await User.findByPk(post.authorId); // per row', tone: 'danger' },
            { text: '} // total: 101 queries', tone: 'danger' },
            { text: '// latency grows linearly with row count', tone: 'danger' },
          ],
          after: [
            { text: 'const posts = await Post.findAll({', tone: 'neutral' },
            { text: "  include: [{ model: User, as: 'author' }], // JOIN", tone: 'success' },
            { text: '  limit: 100,', tone: 'neutral' },
            { text: '}); // total: 1 query', tone: 'success' },
            { text: '// rows arrive with authors attached', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'Start from the loop: each iteration is its own SELECT.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'That one lazy line costs a round trip per row.', beforeIndex: 2, afterIndex: 1 },
            { id: 'f3', caption: '101 queries versus 1 — same data, different round-trip math.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f4', caption: 'The join delivers rows with authors already attached.', beforeIndex: 4, afterIndex: 4 },
            { id: 'f5', caption: 'Rule of thumb: join for belongs-to, batch for has-many fan-out.', beforeIndex: 1, afterIndex: 2 },
          ],
        },
      },
      {
        title: 'Fix two: batch the lookups (DataLoader)',
        body: `Joins do not cover every case — GraphQL resolvers run per field per object by design, and has-many relations multiply rows under a join — so the second cure is batching. The hairdresser trick: instead of each resolver querying immediately, it hands its key to a loader that waits until the next tick, collects every key requested so far, and fires one WHERE id IN (…) query for the whole set, then distributes rows back to the callers that asked. DataLoader is the canonical implementation, and its per-request cache means a repeated key costs nothing extra. Watch the animation: 100 individual asks become one batched question at the database. Two limits to respect — chunk huge ID lists to stay under parameter limits, and scope the cache per request so stale rows never leak between users.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'resolvers', label: 'Field resolvers', sublabel: 'authors for 100 posts' },
            { id: 'dataloader', label: 'DataLoader', sublabel: 'per-request batch queue' },
            { id: 'db', label: 'Database', sublabel: 'one IN query' },
          ],
          phases: [
            { id: 'p1', caption: 'Each resolver asks only for its own key — and the loader defers instead of querying.', packets: [{ from: 'resolvers', to: 'dataloader', label: 'authorId 17' }], activeNodeIds: ['resolvers'] },
            { id: 'p2', caption: 'Within a single tick the queue collects every key — nothing has hit the database yet.', activeNodeIds: ['dataloader'] },
            { id: 'p3', caption: 'The next tick fires one batched query instead of one hundred.', packets: [{ from: 'dataloader', to: 'db', label: 'WHERE id IN (\u2026 100)' }], activeNodeIds: ['dataloader'] },
            { id: 'p4', caption: 'The database returns all rows in a single round trip.', packets: [{ from: 'db', to: 'dataloader', label: '100 rows' }], doneNodeIds: ['dataloader'], activeNodeIds: ['db'] },
            { id: 'p5', caption: 'The loader hands each resolver exactly its key — repeat keys served from the per-request cache.', packets: [{ from: 'dataloader', to: 'resolvers', label: 'distributed rows' }], doneNodeIds: ['db', 'dataloader', 'resolvers'] },
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
          kind: 'timeline',
          lanes: [
            { id: 'net', label: 'Network', kind: 'custom' },
            { id: 'screen', label: 'What the user sees', kind: 'render' },
          ],
          frames: [
            { id: 'f1', caption: 'The server answers in milliseconds — with an empty HTML shell.', marks: [{ laneId: 'net', label: 'HTML shell (no content)', status: 'active' }, { laneId: 'screen', label: 'blank page', status: 'active' }] },
            { id: 'f2', caption: 'The browser downloads and parses the JavaScript bundle — the real app is still arriving.', marks: [{ laneId: 'net', label: 'app.js bundle', status: 'active' }, { laneId: 'screen', label: 'blank page', status: 'active' }] },
            { id: 'f3', caption: 'Only now does the app fetch its data from the API.', marks: [{ laneId: 'net', label: 'GET /api/feed', status: 'active' }, { laneId: 'screen', label: 'still blank', status: 'active' }] },
            { id: 'f4', caption: 'Content finally paints — often seconds after navigation on slow connections.', marks: [{ laneId: 'net', label: 'done', status: 'done' }, { laneId: 'screen', label: 'first content', status: 'done' }] },
            { id: 'f5', caption: 'Everything afterwards is fast: client routing never reloads the app.', marks: [{ laneId: 'screen', label: 'instant client routing', status: 'done' }] },
          ],
        },
      },
      {
        title: 'Static: build once, serve from the edge',
        body: `The opposite pole: render every page to HTML at deploy time, with its data already baked in, and copy the files to CDN caches worldwide. A visitor anywhere gets finished HTML from a nearby edge in single-digit milliseconds — no origin server, no database, no per-request render. This is the cheapest and fastest strategy, and it scales by default on a CDN budget. Its one weakness is the freshness clock: content is as old as the last deploy. That is perfect for blogs, docs, and marketing pages whose changes you control, and wrong for anything that changes on its own schedule. Watch the animation: the build is the only expensive step, and the visitor never touches the origin.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'build', label: 'Build pipeline', sublabel: 'CI at deploy time' },
            { id: 'edge', label: 'CDN edge', sublabel: 'cached HTML' },
            { id: 'user', label: 'Visitor', sublabel: 'finished HTML in the first byte' },
          ],
          phases: [
            { id: 'p1', caption: 'At deploy time every static route is rendered to HTML with its data baked in.', activeNodeIds: ['build'] },
            { id: 'p2', caption: 'The output is copied to edge caches worldwide.', packets: [{ from: 'build', to: 'edge', label: 'static HTML + assets' }], doneNodeIds: ['build'], activeNodeIds: ['edge'] },
            { id: 'p3', caption: 'A visitor is served from a nearby cache — no origin, no database, milliseconds.', packets: [{ from: 'edge', to: 'user', label: 'HTML' }], activeNodeIds: ['edge'] },
            { id: 'p4', caption: 'JavaScript still hydrates the page for interactivity, but the content was already visible.', doneNodeIds: ['edge'], activeNodeIds: ['user'] },
            { id: 'p5', caption: 'The freshness clock is the deploy: content stays as built until the next release.', doneNodeIds: ['edge', 'user'] },
          ],
        },
      },
      {
        title: 'Per request: server-render the answer',
        body: `When the page depends on who is asking — a dashboard, an account page, a search result — no shared cache can hold it. SSR renders the HTML on every request: the server runs the data queries, produces complete markup for this specific user, and sends it back ready to paint. First paint shows real content, crawlers and previews see full HTML, and personalization is safe because nothing is shared. The price is structural: every request pays render time plus query time, the CDN helps little because responses are per-user, and the server fleet must scale with traffic instead of a static file cache. The design instinct to voice: cache what is shareable, render what is personal, and never let a CDN cache a page containing someone else's name.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'user', label: 'Visitor', sublabel: 'sends cookies' },
            { id: 'server', label: 'App server', sublabel: 'renders HTML per request' },
            { id: 'db', label: 'Database', sublabel: 'fresh rows' },
          ],
          phases: [
            { id: 'p1', caption: 'The request reaches the origin — no shared cache can answer, because the response may be personal.', packets: [{ from: 'user', to: 'server', label: 'GET /dashboard + cookie' }], activeNodeIds: ['user'] },
            { id: 'p2', caption: 'The server queries exactly the data this user is allowed to see.', packets: [{ from: 'server', to: 'db', label: 'SELECT \u2026 WHERE user_id = ?' }], doneNodeIds: ['user'], activeNodeIds: ['server'] },
            { id: 'p3', caption: 'Rows return and the framework renders complete HTML for this request.', packets: [{ from: 'db', to: 'server', label: 'rows' }], activeNodeIds: ['db'] },
            { id: 'p4', caption: 'The visitor receives finished HTML: first paint has real content, and crawlers see it too.', packets: [{ from: 'server', to: 'user', label: 'full HTML' }], doneNodeIds: ['db'], activeNodeIds: ['server'] },
            { id: 'p5', caption: 'The structural price: every request pays render + query time, and the CDN mostly cannot help.', doneNodeIds: ['server', 'user'] },
          ],
        },
      },
      {
        title: 'The middle ground: ISR (stale-while-revalidate)',
        body: `Most content is not per-user and not per-deploy either: product listings, news, catalogs — shared by everyone, changing on their own schedule. ISR treats the page as a cached static file with a TTL, and adds one rule that makes it scale: when the cache expires, the next visitor still gets the stale copy instantly while a single background rebuild runs. Freshness arrives seconds later, for everyone, without any visitor waiting and without a rebuild per request. This is the stale-while-revalidate family of design — the same move HTTP caching uses — and it is why the pattern dominates e-commerce and content sites. Watch the animation: precisely one rebuild per interval, no matter how many visitors hit the stale window.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'user', label: 'Visitor' },
            { id: 'edge', label: 'CDN edge', sublabel: 'page cache + TTL' },
            { id: 'origin', label: 'Origin', sublabel: 'background rebuild' },
          ],
          phases: [
            { id: 'p1', caption: 'Cache is warm: the visitor gets the static page instantly — the normal path.', packets: [{ from: 'edge', to: 'user', label: 'cached HTML' }], activeNodeIds: ['edge'] },
            { id: 'p2', caption: 'The TTL expires. The next visitor still gets the stale page immediately — nobody waits for a rebuild.', packets: [{ from: 'edge', to: 'user', label: 'stale HTML (fast)' }], activeNodeIds: ['edge'] },
            { id: 'p3', caption: 'In the background the edge triggers exactly one rebuild — not one per visitor.', packets: [{ from: 'edge', to: 'origin', label: 'revalidate trigger' }], activeNodeIds: ['edge'] },
            { id: 'p4', caption: 'The origin regenerates HTML with fresh data and stores it back in the cache.', packets: [{ from: 'origin', to: 'edge', label: 'fresh page' }], activeNodeIds: ['origin'] },
            { id: 'p5', caption: 'Every later request is a cache hit again. One rebuild per interval, CDN speed for everyone.', doneNodeIds: ['origin', 'edge', 'user'] },
          ],
        },
      },
      {
        title: 'Making the decision per route',
        body: `The real interview answer is a mapping, not a favorite. Start from the content clock: if you control when content changes, static wins — SSG, or ISR when it changes between deploys. If each response depends on the requester, the cache is off the table: SSR, with per-user cache keys only if you are certain about the boundaries. If SEO and first paint are business-critical, the blank shell of CSR is disqualified before performance even enters the conversation. And when none of the hard constraints apply — a logged-in internal tool, an interactive editor — CSR quietly wins on simplicity and infrastructure cost. Modern frameworks make this per-route, so one app can mix all four; the skill being tested is knowing which clock each route runs on, and naming the one constraint that eliminates an option outright.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Your constraint',
          afterLabel: 'The decision it forces',
          before: [
            { text: 'Content changes on a schedule you control (blog, docs, marketing)', tone: 'neutral' },
            { text: 'The response depends on who is logged in (dashboard, account)', tone: 'neutral' },
            { text: 'SEO and first paint are business-critical, data is public', tone: 'neutral' },
            { text: 'Internal tool behind auth, SEO irrelevant, interactivity heavy', tone: 'neutral' },
          ],
          after: [
            { text: 'SSG — or ISR when content changes between deploys', tone: 'success' },
            { text: 'SSR with per-user cache keys, never a shared CDN entry', tone: 'success' },
            { text: 'SSG or SSR — never a bare CSR shell; HTML must exist at the first byte', tone: 'success' },
            { text: 'CSR is the right answer: simplest, cheapest, fastest to build', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'Start from the content clock: who decides when this page changes?', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'Personalization is a hard wall: cached HTML cannot be per-user.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'SEO and first paint eliminate the blank shell outright.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'And when no hard constraint applies, CSR wins on simplicity and cost.', beforeIndex: 3, afterIndex: 3 },
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
          kind: 'timeline',
          lanes: [
            { id: 't1', label: 'Transaction 1', kind: 'custom' },
            { id: 't2', label: 'Transaction 2', kind: 'custom' },
          ],
          frames: [
            { id: 'f1', caption: 'Two transactions start. T2 updates a row but has not committed.', marks: [{ laneId: 't1', label: 'BEGIN', status: 'active' }, { laneId: 't2', label: 'BEGIN \u2192 UPDATE balance = 0 (uncommitted)', status: 'active' }] },
            { id: 'f2', caption: 'Under READ UNCOMMITTED, T1 can read that uncommitted value — a dirty read.', marks: [{ laneId: 't1', label: 'SELECT balance \u2192 0', status: 'active' }, { laneId: 't2', label: 'still uncommitted', status: 'active' }] },
            { id: 'f3', caption: 'T2 hits an error and rolls back. The 0 never existed.', marks: [{ laneId: 't1', label: 'acts on 0', status: 'active' }, { laneId: 't2', label: 'ROLLBACK', status: 'done' }] },
            { id: 'f4', caption: 'T1 made a decision on data that was never real — the classic dirty read.', marks: [{ laneId: 't1', label: 'decision built on a ghost', status: 'done' }, { laneId: 't2', label: 'ROLLBACK', status: 'done' }] },
          ],
        },
      },
      {
        title: 'READ COMMITTED: fresh per statement, so re-reads drift',
        body: `Most engines — Postgres, Oracle, SQL Server — default to READ COMMITTED, and it feels safe: every statement sees a fresh snapshot, and dirty reads are impossible. The trap is across statements inside one transaction. T1 reads balance = 100, decides, and reads again — meanwhile T2 committed an update to 50 in between. Both reads are perfectly honest; they just describe different worlds, and any invariant T1 computed from the first read is now wrong. Watch the animation: nothing T1 did caused it, which is what makes this the most common production anomaly. It is invisible in single-statement operations and lethal in read-then-act flows — exactly the shape of payment, inventory, and seat-booking code.`,
        animation: {
          kind: 'timeline',
          lanes: [
            { id: 't1', label: 'Transaction 1', kind: 'custom' },
            { id: 't2', label: 'Transaction 2', kind: 'custom' },
          ],
          frames: [
            { id: 'f1', caption: 'T1 starts and reads balance = 100. It will read again later in the same transaction.', marks: [{ laneId: 't1', label: 'SELECT \u2192 100', status: 'active' }, { laneId: 't2', label: 'BEGIN', status: 'active' }] },
            { id: 'f2', caption: 'T2 updates the same row to 50 and commits — between T1\u2019s two reads.', marks: [{ laneId: 't2', label: 'UPDATE \u2192 50 \u00b7 COMMIT', status: 'active' }, { laneId: 't1', label: 'computing\u2026', status: 'active' }] },
            { id: 'f3', caption: 'T1 re-reads the row inside the same transaction — and sees 50. The value changed under it.', marks: [{ laneId: 't1', label: 'SELECT \u2192 50 (changed!)', status: 'active' }, { laneId: 't2', label: 'committed', status: 'done' }] },
            { id: 'f4', caption: 'Two reads, one transaction, two worlds. READ COMMITTED allows exactly this.', marks: [{ laneId: 't1', label: 'inconsistent snapshot', status: 'done' }, { laneId: 't2', label: 'committed', status: 'done' }] },
          ],
        },
      },
      {
        title: 'REPEATABLE READ: stable rows, moving sets',
        body: `REPEATABLE READ freezes one snapshot for the entire transaction: read the same row twice and you get the same answer, no matter who commits in between. What the standard still allows is a phantom — T1 counts the rows matching a predicate, T2 inserts a matching row and commits, and T1's second count returns one more. Nothing T1 read changed; the set it asked about did, which is why phantoms break range-based invariants like "the sum of pending orders" or "no two overlapping bookings". The honest nuance to volunteer: real engines are stronger than the textbook. Postgres REPEATABLE READ is snapshot isolation and blocks phantoms too, and InnoDB adds gap locks on locking reads — so name your engine before reciting the table.`,
        animation: {
          kind: 'timeline',
          lanes: [
            { id: 't1', label: 'Transaction 1', kind: 'custom' },
            { id: 't2', label: 'Transaction 2', kind: 'custom' },
          ],
          frames: [
            { id: 'f1', caption: 'T1 counts the rows matching a predicate: three pending orders.', marks: [{ laneId: 't1', label: 'COUNT(*) WHERE status=\u2018pending\u2019 \u2192 3', status: 'active' }, { laneId: 't2', label: 'BEGIN', status: 'active' }] },
            { id: 'f2', caption: 'T2 inserts a matching order and commits.', marks: [{ laneId: 't2', label: 'INSERT + COMMIT', status: 'active' }, { laneId: 't1', label: 'work continues', status: 'active' }] },
            { id: 'f3', caption: 'T1 repeats the identical count — and gets 4. It read no changed row, yet the answer moved.', marks: [{ laneId: 't1', label: 'COUNT \u2192 4 (phantom row)', status: 'active' }, { laneId: 't2', label: 'committed', status: 'done' }] },
            { id: 'f4', caption: 'The standard allows this at REPEATABLE READ; Postgres and InnoDB are stronger — but write skew still slips through.', marks: [{ laneId: 't1', label: 'set changed, rows didn\u2019t', status: 'done' }, { laneId: 't2', label: 'committed', status: 'done' }] },
          ],
        },
      },
      {
        title: 'SERIALIZABLE: conflicts become your retries',
        body: `SERIALIZABLE makes the database detect when concurrent transactions could not have run one after another in some order, and aborts one of them instead of committing a contradiction. It also closes the anomaly the screenshot-famous table forgets: write skew — two transactions that each read an overlapping set and write different rows, staying invisible to snapshot isolation. The bargain is explicit: the failure moves into the application, which must catch serialization errors (SQLSTATE 40001 in Postgres) and retry, bounded and idempotent. Watch the animation: T2 is aborted on a state that moved, then retried fresh. Interviewers are listening for that retry loop — calling SERIALIZABLE "just a safer setting" without owning the retries is the failure mode.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 't1', label: 'Transaction 1' },
            { id: 't2', label: 'Transaction 2' },
            { id: 'db', label: 'Database', sublabel: 'serialization conflict detector' },
          ],
          phases: [
            { id: 'p1', caption: 'Both transactions read the row they are about to change — each believes it knows the current state.', packets: [{ from: 't1', to: 'db', label: 'read x' }, { from: 't2', to: 'db', label: 'read x' }], activeNodeIds: ['t1', 't2'] },
            { id: 'p2', caption: 'T1 writes first and commits: the state every later writer assumed has moved.', packets: [{ from: 't1', to: 'db', label: 'write x \u00b7 COMMIT' }], activeNodeIds: ['t1'] },
            { id: 'p3', caption: 'T2 writes against the old state. SERIALIZABLE refuses to guess and aborts one side: 40001.', packets: [{ from: 't2', to: 'db', label: 'write x' }], doneNodeIds: ['t1'], activeNodeIds: ['db'], errorNodeIds: ['t2'] },
            { id: 'p4', caption: 'The application catches the serialization failure and retries T2 on fresh state — bounded, idempotent.', packets: [{ from: 't2', to: 'db', label: 'retry transaction' }], doneNodeIds: ['db'], activeNodeIds: ['t2'] },
            { id: 'p5', caption: 'That is the bargain: no silent anomalies, and the retry loop is now part of your architecture.', doneNodeIds: ['t1', 'db', 't2'] },
          ],
        },
      },
      {
        title: 'What to actually do about it',
        body: `The practical answer is a toolkit, matched to the shape of the bug. Read-modify-write on a hot row — check balance, then update — is a lost update under many defaults; fix it with a lock (SELECT \u2026 FOR UPDATE) or optimistic locking (a version column and a retry on mismatch). Invariants spanning rows want SERIALIZABLE plus a bounded retry loop, not a pile of hope. Job queues want SELECT \u2026 FOR UPDATE SKIP LOCKED, which is the modern pattern for letting workers take different rows without fighting. And the universal rules: know your engine\u2019s default before the incident, and never hold a transaction open across an HTTP call or user think-time — long transactions turn contention into outages.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Where defaults surprise you',
          afterLabel: 'The toolbox you reach for',
          before: [
            { text: 'Postgres defaults to READ COMMITTED — every statement gets a fresh snapshot', tone: 'neutral' },
            { text: 'MySQL InnoDB defaults to REPEATABLE READ — stronger than the standard', tone: 'neutral' },
            { text: 'Check-then-update (read balance \u2192 write balance) is a lost update in waiting', tone: 'danger' },
            { text: 'ORMs auto-commit single statements, so "transactions" you never wrote still interleave', tone: 'danger' },
          ],
          after: [
            { text: 'SELECT \u2026 FOR UPDATE to lock rows you are about to mutate', tone: 'success' },
            { text: 'Version column + WHERE version = n: optimistic locking, retry on conflict', tone: 'success' },
            { text: 'SERIALIZABLE + bounded retry loop for invariants spanning rows', tone: 'success' },
            { text: 'FOR UPDATE SKIP LOCKED for job queues; keep transactions short and lock-free of users', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'First, know your engine\u2019s default — the anomaly table differs from the textbook.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'Then the classic bug: check-then-update without a lock.', beforeIndex: 2, afterIndex: 0 },
            { id: 'f3', caption: 'For hot rows, pessimistic or optimistic locking turns conflicts into retries.', beforeIndex: 3, afterIndex: 1 },
            { id: 'f4', caption: 'For queues and cross-row invariants: SKIP LOCKED and SERIALIZABLE, with retries as a first-class citizen.', beforeIndex: 1, afterIndex: 3 },
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
];
