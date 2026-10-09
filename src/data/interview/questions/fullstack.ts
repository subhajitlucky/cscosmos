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
        body: 'Before any network traffic, the browser checks its own HTTP cache and the OS resolver cache. On a miss, a recursive DNS lookup runs: root servers point to the TLD servers, the TLD points to the authoritative nameserver, and the authoritative server returns the IP. Watch the query walk the hierarchy — each hop is a chance to answer from cache instead.',
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'browser', label: 'Browser' },
            { id: 'os', label: 'OS Resolver', sublabel: 'cache' },
            { id: 'root', label: 'Root DNS' },
            { id: 'tld', label: 'TLD .com' },
            { id: 'auth', label: 'Authoritative DNS' },
          ],
          phases: [
            { id: 'p1', caption: 'Browser cache miss — the hostname is unknown locally.', activeNodeIds: ['browser'] },
            { id: 'p2', caption: 'OS resolver cache miss — ask the network.', packets: [{ from: 'browser', to: 'os', label: 'resolve?' }], activeNodeIds: ['os'] },
            { id: 'p3', caption: 'Recursive resolver asks a root server where .com lives.', packets: [{ from: 'os', to: 'root', label: '?' }], activeNodeIds: ['root'] },
            { id: 'p4', caption: 'Root delegates to the .com TLD servers.', packets: [{ from: 'root', to: 'tld', label: '.com →' }], doneNodeIds: ['root'], activeNodeIds: ['tld'] },
            { id: 'p5', caption: 'TLD delegates to the authoritative nameserver.', packets: [{ from: 'tld', to: 'auth', label: 'auth NS' }], doneNodeIds: ['root', 'tld'], activeNodeIds: ['auth'] },
            { id: 'p6', caption: 'The answer (A/AAAA record) travels back and is cached at every hop.', packets: [{ from: 'auth', to: 'os', label: '93.184.216.34' }], doneNodeIds: ['root', 'tld', 'auth', 'os'] },
          ],
        },
      },
      {
        title: 'TCP handshake',
        body: 'The browser opens a TCP connection with the three-way handshake: SYN, SYN-ACK, ACK. This proves both directions work and agrees on initial sequence numbers. It costs one full round trip before a single byte of HTTP is sent — which is exactly why HTTP/3 moved to QUIC over UDP, where the transport and crypto handshakes happen together.',
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
          ],
        },
      },
      {
        title: 'TLS handshake',
        body: 'Because the URL is HTTPS, a TLS handshake upgrades the raw TCP stream. The client sends ClientHello (cipher suites, TLS version, and SNI so the server can pick the right certificate), the server responds with its certificate chain, both sides derive the same session keys via ECDHE, and a Finished exchange proves the handshake was not tampered with. From here on everything is encrypted.',
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
            { id: 'p5', caption: 'Finished: encrypted channel established. 1-2 more RTTs spent.', packets: [{ from: 'client', to: 'server', label: 'Finished ✓' }], doneNodeIds: ['ca', 'client', 'server'] },
          ],
        },
      },
      {
        title: 'HTTP request and response',
        body: 'The browser sends an HTTP GET with headers like Host, User-Agent, Accept-Encoding, and any cookies for the domain. The server (often behind a CDN, load balancer, and reverse proxy) routes the request, executes application code and queries, then returns a status code, headers, and a body. Caching headers such as Cache-Control decide whether the next visit even needs this trip.',
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
        body: 'The HTML is tokenized into a DOM tree; CSS is parsed into the CSSOM. The two combine into a render tree, layout computes geometry for every visible box, paint fills pixels, and the compositor stitches layers onto the screen. A parser-blocking <script> in the head halts HTML parsing until it downloads and executes — which is why modern sites defer scripts and preload critical assets.',
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
      'DNS cache poisoning / low TTL: a low TTL means more lookups but faster failover — interviewers like the trade-off.',
      'TLS session resumption: the second visit can skip the full handshake via session tickets.',
      'HTTP/2 multiplexing: one connection carries many requests, so the old "6 connections per host" limit disappears.',
      'Parser-blocking scripts: a sync <script> in <head> delays first paint — mention defer/async.',
      'Service workers can intercept the request entirely and answer from cache before DNS is ever consulted.',
    ],
    followUps: [
      { q: 'Where would you add a cache to make this faster?', a: 'At every layer: browser HTTP cache, DNS cache, CDN edge, reverse proxy, then application-level caches like Redis.' },
      { q: 'Why is DNS usually UDP and not TCP?', a: 'Queries are small and need speed; UDP avoids handshake overhead. TCP is used for zone transfers and truncated large responses.' },
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
        body: `Open a fresh React 18 app, put a fetch or a subscription inside useEffect, and the network tab shows the work twice — while the production build shows it once. Candidates usually blame the fetch, the cache, or the dev server. The real trigger is StrictMode, which React enables in development templates. Watch the first animation: the console prints subscribe, unsubscribe, subscribe in a tight rhythm, then goes quiet. That rhythm is the fingerprint of an intentional mount, cleanup, and remount cycle. The important question is not how to silence the duplicate log — it is why React insists your effect survive a teardown it never asked you to write. If the effect is correct, the double invoke is harmless; if it is not, StrictMode has just exposed a bug that a real unmount or dependency change would eventually trigger in production.`,
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
            { id: 'f1', caption: 'First setup runs and logs subscribe.', activeLines: [2, 3], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }], output: 'subscribe' },
            { id: 'f2', caption: 'StrictMode tears the effect down immediately and cleanup runs.', activeLines: [4, 5, 6], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }], output: 'subscribe\nunsubscribe' },
            { id: 'f3', caption: 'React mounts it again — subscribe fires a second time.', activeLines: [2, 3], variables: [{ name: 'renderCount', value: '2', changed: true }, { name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }], output: 'subscribe\nunsubscribe\nsubscribe' },
            { id: 'f4', caption: 'Only the second subscription stays live; cleanup removed the first.', activeLines: [3, 6], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '2' }, { name: 'cleanupRuns', value: '1' }], output: 'subscribe\nunsubscribe\nsubscribe' },
            { id: 'f5', caption: 'A production build runs the same effect exactly once — no teardown in between.', activeLines: [2, 3], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '0' }], output: 'subscribe' },
          ],
        },
      },
      {
        title: 'StrictMode is a debugger',
        body: `StrictMode is not a linter or a scaffold you should strip out; it is a deliberate correctness harness. In development React double-invokes component bodies, state updater functions, and effect setup/cleanup so that non-idempotent code fails loudly on your machine instead of silently in production. The animation walks the full lifecycle — mount, cleanup, remount — before the user ever sees a symptom. React chose this in version 18 to prepare apps for concurrent rendering, where a component can be mounted, paused, and discarded before it ever commits. Any effect that connects, subscribes, or starts a timer must return a cleanup that fully reverses its setup. When the cleanup is complete, the remount becomes invisible: same final state, one live connection, no leaked listener. The double invoke is the test; the cleanup is the answer.`,
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
            { id: 'f1', caption: 'React renders the component body.', activeLines: [2], variables: [{ name: 'renderCount', value: '1', changed: true }, { name: 'effectRuns', value: '0' }, { name: 'cleanupRuns', value: '0' }], output: 'render' },
            { id: 'f2', caption: 'The effect setup runs after the commit.', activeLines: [4], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }], output: 'render\neffect setup' },
            { id: 'f3', caption: 'StrictMode immediately runs the returned cleanup.', activeLines: [5], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }], output: 'render\neffect setup\neffect cleanup' },
            { id: 'f4', caption: 'The component body is invoked again, then setup runs again.', activeLines: [2, 4], variables: [{ name: 'renderCount', value: '2', changed: true }, { name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }], output: 'render\neffect setup\neffect cleanup\nrender\neffect setup' },
            { id: 'f5', caption: 'Net result: one active effect, but setup had to be re-entrant.', activeLines: [4, 5], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '2' }, { name: 'cleanupRuns', value: '1' }] },
          ],
        },
      },
      {
        title: 'Trace the lifecycle counters',
        body: `Now trace the counters. renderCount tracks how many times the component body runs, effectRuns counts setup functions, and cleanupRuns counts teardowns. In development the component body renders once, setup runs, and StrictMode immediately invokes the returned cleanup — cleanupRuns becomes one before the tree ever re-renders for the user. React then invokes the body and setup a second time, so effectRuns reaches two while only the second subscription stays live. Watch the final frame: production does not run this simulation, so you see one render, one setup, and zero cleanups until the component actually unmounts. The counters make the rule concrete — whenever setup runs, cleanup must be able to run too, in any order, without leaving duplicate subscriptions, timers, or listeners behind. If your cleanup is complete, the counters are boring in production and healthy in development.`,
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
            { id: 'f2', caption: 'Effect setup runs and subscribes to the room.', activeLines: [4, 5, 6], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1', changed: true }, { name: 'cleanupRuns', value: '0' }], output: 'setup general' },
            { id: 'f3', caption: 'StrictMode fires the cleanup returned by that effect.', activeLines: [7, 8, 9], variables: [{ name: 'renderCount', value: '1' }, { name: 'effectRuns', value: '1' }, { name: 'cleanupRuns', value: '1', changed: true }], output: 'setup general\ncleanup general' },
            { id: 'f4', caption: 'The component remounts and setup runs a second time.', activeLines: [4, 5, 6], variables: [{ name: 'renderCount', value: '2', changed: true }, { name: 'effectRuns', value: '2', changed: true }, { name: 'cleanupRuns', value: '1' }], output: 'setup general\ncleanup general\nsetup general' },
            { id: 'f5', caption: 'One subscription stays live — the cleanup prevented a leak.', activeLines: [6, 9], variables: [{ name: 'renderCount', value: '2' }, { name: 'effectRuns', value: '2' }, { name: 'cleanupRuns', value: '1' }] },
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
      'State from the first run clobbers the second: abort the stale request (AbortController) or ignore it with a cancelled flag in cleanup.',
      'Not resetting refs, intervals, or third-party widgets in cleanup: return a teardown that reverses every side effect the setup started.',
      'Removing StrictMode to hide the duplicate: the missing cleanup is still a bug and will fire on route changes and dependency changes in production.',
      'Guarding setup with a mountedRef: refs survive the simulated remount, so the second setup is skipped after the first was cleaned up — leaving zero live subscriptions.',
      'Double-counting analytics events in development: decide deliberately which events must fire once and dedupe them outside the effect rather than disabling the check.',
    ],
    followUps: [
      { q: 'Why does StrictMode not double-invoke in production?', a: 'It is a development-only correctness check: the simulation exists to catch non-idempotent effects, and shipping it would make users pay for developer tooling.' },
      { q: 'How do you fix a fetching effect that runs twice?', a: 'Pass an AbortController signal to fetch and abort it in the cleanup; the stale response then never reaches setState.' },
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
        body: `The mental model gets subtle in real code. Browsers clamp nested setTimeout(0) calls to roughly four milliseconds after five levels, so a "zero" timer is never truly immediate and can interleave with rendering. An unbounded await loop that keeps queueing microtasks starves timers and painting, freezing the tab. Awaiting an already-resolved promise still suspends and resumes through the microtask queue, so post-await code jumps ahead of timers. In Node, process.nextTick runs before promise microtasks and setImmediate lands in the check phase rather than the timer phase. Watch the final animation: the microtask lane keeps refilling instead of draining, the render lane never activates, and the timer waits forever. That picture is microtask starvation, and it is the root cause behind many "the UI froze" bug reports. Yield to a macrotask periodically in long async loops.`,
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
      'Calling requestAnimationFrame a microtask: rAF runs in the render phase, after microtasks drain and before paint, not before timers.',
    ],
    followUps: [
      { q: 'Why does Promise.resolve().then run before setTimeout(0)?', a: 'Microtasks drain at the end of the current task, while timers are macrotasks that need a later loop turn. The engine always empties microtasks first.' },
      { q: 'What if the promise chain queues more .then callbacks?', a: 'They run inside the same microtask drain, before any macrotask, because the drain continues until the microtask queue is empty.' },
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
            { id: 'p3', caption: 'The seek lands at the Patel range; first_name narrows within it.', packets: [{ from: 'planner', to: 'index' }], doneNodeIds: ['query'], activeNodeIds: ['index'] },
            { id: 'p4', caption: 'Filtering on first_name alone has no anchor, so every leaf is scanned.', packets: [{ from: 'index', to: 'leaf', label: 'full index scan' }], doneNodeIds: ['planner'], activeNodeIds: ['leaf'] },
            { id: 'p5', caption: 'Only entries that survive the index filter fetch heap rows.', packets: [{ from: 'leaf', to: 'heap', label: 'row pointer' }], doneNodeIds: ['index'], activeNodeIds: ['leaf', 'heap'] },
            { id: 'p6', caption: 'Column order decides which of these plans can seek.', doneNodeIds: ['query', 'planner', 'index', 'leaf', 'heap'], activeNodeIds: ['index'] },
          ],
        },
      },
      {
        title: 'When an index hurts',
        body: `Indexes are not free. Every write must update each index, which means more page splits, more buffer-pool pressure, and a slower INSERT/UPDATE path — write amplification. A low-cardinality column such as status rarely helps: when a query matches a large fraction of the table, the planner estimates that a sequential scan costs fewer page reads than bouncing between index and heap pages, and it ignores the index. Non-covering indexes pay an extra random row fetch per match, so returning most of the table through an index can be slower than scanning it. Watch the animation: the write path maintains the tree on every insert, and the planner branch estimates that it should skip the index. The judgment answer is to index for the queries you actually run, verify with EXPLAIN ANALYZE, and remove indexes whose write cost outweighs their read wins.`,
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
      { q: 'Why would the planner ignore an index that exists?', a: 'Cost estimation: with low selectivity or stale statistics it predicts that scanning fewer pages sequentially beats many random index and heap reads.' },
      { q: 'What does EXPLAIN ANALYZE tell you?', a: 'The chosen plan, actual row counts, and per-node timing — including whether a sequential scan ran where you expected an index scan.' },
    ],
    relatedEngine: { label: 'Explore the SQL Cosmos visualizer', href: '/fullstack/sqlcosmos' },
  },
];
