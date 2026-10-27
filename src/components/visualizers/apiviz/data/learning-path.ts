/**
 * FS-27c — the learning path now carries the material each *subject* needs.
 *
 * Before this fix every id rendered the same request/response trace, so `Topic` held
 * only words (name/description/analogy) and the page had nothing else to work with.
 * The types below add three things per topic:
 *
 *   visual      — how this subject is taught (the plan; drives the locked-page label
 *                 and must match `render.kind` once the lesson is written)
 *   constraints — 2 subject-specific trade-offs, replacing the two hardcoded bullets
 *                 that every topic used to show
 *   specimen    — an *illustrative* message for this subject, replacing the fabricated
 *                 `GET /api/v1/resources/<slug>` that every topic used to show
 *   render?     — the input the topic's own visualization consumes. Authored only for
 *                 `active` topics: a `coming-soon` topic has no walkthrough, so it has
 *                 no render data either.
 *
 * Everything here is either the engine's own authored copy or a generic, true statement
 * about the technology (an HTTP verb's safety/idempotency, a status code's meaning).
 * No third-party API, version number or product is described. `<placeholders>` are
 * placeholders; `api.example` is the reserved documentation domain.
 */

export type TopicVisual =
  | 'interface-contract'
  | 'round-trip'
  | 'http-message'
  | 'resource-verbs'
  | 'schema-resolution'
  | 'auth-gate'
  | 'cache-flow';

export type TopicRender =
  | {
      kind: 'interface-contract';
      /** Operations a caller may use. The implementation behind them stays unknown. */
      calls: string[];
    }
  | {
      kind: 'round-trip';
      /** Hops of one exchange, each on a lane, in time order. */
      hops: { lane: 'client' | 'wire' | 'server'; text: string }[];
    }
  | {
      kind: 'http-message';
      /** The bands of a request/response message, annotated. */
      bands: { band: 'start-line' | 'headers' | 'body' | 'status'; text: string }[];
    }
  | {
      kind: 'resource-verbs';
      /** Verb semantics: the properties are HTTP's, the note is authored. */
      verbs: {
        verb: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        safe: boolean;
        idempotent: boolean;
        cacheable: boolean;
        note: string;
      }[];
    }
  | {
      kind: 'schema-resolution';
      /** The ladder from declared schema to returned fields. */
      steps: { node: string; detail: string }[];
    }
  | {
      kind: 'auth-gate';
      /** Gates a request passes, and the status it gets when a gate rejects it. */
      gates: { gate: string; onFail: string | null }[];
    }
  | {
      kind: 'cache-flow';
      /** Cache layers a request walks, and what a hit/miss means at each. */
      layers: { layer: string; hit: string; miss: string }[];
    };

export interface Topic {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'coming-soon';
  description: string;
  analogy: string;
  visual: TopicVisual;
  constraints: string[];
  specimen: string;
  render?: TopicRender;
}

export interface Domain {
  id: string;
  name: string;
  topics: Topic[];
}

export const learningPath: Domain[] = [
  {
    id: 'fundamentals',
    name: 'API Fundamentals',
    topics: [
      {
        id: 'what-is-api',
        name: 'What is an API',
        slug: 'what-is-api',
        status: 'active',
        description: 'The interface between software components.',
        analogy:
          'A restaurant menu providing a list of dishes you can order without knowing how the kitchen works.',
        visual: 'interface-contract',
        constraints: [
          'A stable interface lets the implementation change without touching a single caller.',
          'Whatever the interface hides, callers cannot depend on — that is both the point and the cost.',
          'An interface that leaks its internals stops being an interface: callers couple to the implementation.',
        ],
        specimen: [
          'CONSUMER  total(orderId: "<order-id>")',
          'RESULT    { total, currency }',
          'HIDDEN    storage engine, indexes, retry policy',
        ].join('\n'),
        render: {
          kind: 'interface-contract',
          calls: [
            'total(orderId) → { total, currency }',
            'refund(orderId) → { refunded }',
            'findOrders(cursor) → { orders, nextCursor }',
          ],
        },
      },
      {
        id: 'client-server',
        name: 'Client–Server Model',
        slug: 'client-server',
        status: 'active',
        description: 'The request-response architecture.',
        analogy: 'A customer (client) ordering coffee from a barista (server).',
        visual: 'round-trip',
        constraints: [
          'A server that keeps no per-client state can be restarted or replicated without losing a session.',
          'Every round trip costs latency; every response a client can reuse removes one.',
        ],
        specimen: [
          'REQUEST   GET /reports/<report-id>',
          'HOST      api.example',
          'RESPONSE  200 OK + body',
          'KEPT      nothing about this exchange',
        ].join('\n'),
        render: {
          kind: 'round-trip',
          hops: [
            { lane: 'client', text: 'compose the request' },
            { lane: 'wire', text: 'request travels to the server' },
            { lane: 'server', text: 'handler runs, response is built' },
            { lane: 'wire', text: 'response travels back' },
            { lane: 'client', text: 'client reads the response' },
            { lane: 'server', text: 'server keeps nothing about this exchange' },
          ],
        },
      },
      {
        id: 'http-basics',
        name: 'HTTP Basics',
        slug: 'http-basics',
        status: 'active',
        description: 'Methods, Headers, and Status Codes.',
        analogy:
          'Sending a letter: the address is the URL, the stamp is the header, and the content is the payload.',
        visual: 'http-message',
        constraints: [
          'Status codes carry the outcome; a 200 with an error body breaks every generic client.',
          'Methods differ in safety and idempotency, and caches and proxies act on those properties.',
        ],
        specimen: [
          'GET /articles/<article-id> HTTP/1.1',
          'Host: api.example',
          'Accept: application/json',
          '---',
          'HTTP/1.1 200 OK',
          'Content-Type: application/json',
        ].join('\n'),
        render: {
          kind: 'http-message',
          bands: [
            { band: 'start-line', text: 'method, target and version — the one line a proxy must parse' },
            { band: 'headers', text: 'metadata about the message: content type, credentials, caching directives' },
            { band: 'body', text: 'the representation itself; absent for methods that only describe an intent' },
            { band: 'status', text: '2xx accepted, 4xx the caller must change something, 5xx the server must' },
          ],
        },
      },
    ],
  },
  {
    id: 'rest',
    name: 'REST Design Mastery',
    topics: [
      {
        id: 'rest-constraints',
        name: 'REST Constraints',
        slug: 'rest-constraints',
        status: 'active',
        description: 'The six guiding principles of REST.',
        analogy: 'The rules of a sport that ensure every game follows the same structure.',
        visual: 'resource-verbs',
        constraints: [
          'Statelessness moves session state into every request, which makes each request bigger.',
          'A uniform interface trades per-endpoint tailoring for cacheability and predictability.',
          'Layered intermediaries can only help if they can act on the message alone.',
        ],
        specimen: [
          'GET    /orders/<order-id>   reads, changes nothing',
          'PUT    /orders/<order-id>   same request repeated → same end state',
          'DELETE /orders/<order-id>   repeated → still gone',
        ].join('\n'),
        render: {
          kind: 'resource-verbs',
          verbs: [
            {
              verb: 'GET',
              safe: true,
              idempotent: true,
              cacheable: true,
              note: 'retrieves a representation; repeating it changes nothing, so it may be retried and cached freely',
            },
            {
              verb: 'POST',
              safe: false,
              idempotent: false,
              cacheable: false,
              note: 'asks the server to create or process; repeating it may create a second resource',
            },
            {
              verb: 'PUT',
              safe: false,
              idempotent: true,
              cacheable: false,
              note: 'replaces the target with the enclosed representation; the same body twice lands the same state',
            },
            {
              verb: 'PATCH',
              safe: false,
              idempotent: false,
              cacheable: false,
              note: 'applies a partial modification; whether a repeat is harmless depends on the patch itself',
            },
            {
              verb: 'DELETE',
              safe: false,
              idempotent: true,
              cacheable: false,
              note: 'removes the target; deleting an already-deleted target still ends with it gone',
            },
          ],
        },
      },
      {
        id: 'resource-modeling',
        name: 'Resource Modeling',
        slug: 'resource-modeling',
        status: 'coming-soon',
        description: 'Thinking in terms of nouns, not verbs.',
        analogy: 'Organizing a library by books (resources) rather than actions like "borrowing".',
        visual: 'resource-verbs',
        constraints: [
          'Nouns keep the URL space stable while the operations available on it change.',
          'Modelling an action as a resource can bend a domain into awkward paths.',
        ],
        specimen: [
          'COLLECTION   /orders',
          'MEMBER       /orders/<order-id>',
          'SUBRESOURCE  /orders/<order-id>/items',
        ].join('\n'),
      },
      {
        id: 'url-naming',
        name: 'URL Design & Naming',
        slug: 'url-naming',
        status: 'coming-soon',
        description: 'Creating intuitive and consistent paths.',
        analogy: 'Clear signage in a building that tells you exactly where you are.',
        visual: 'resource-verbs',
        constraints: [
          'Consistent, lowercase, hyphenated segments survive copy-paste and case-insensitive hosts.',
          'A deep hierarchy is hard to change once clients have hard-coded it.',
        ],
        specimen: [
          'PREFER  /orders/<order-id>/items',
          'AVOID   /getOrderItems?orderId=<order-id>',
        ].join('\n'),
      },
      {
        id: 'idempotency',
        name: 'Idempotency & Safety',
        slug: 'idempotency',
        status: 'coming-soon',
        description: 'Ensuring repeated requests have the same effect.',
        analogy:
          "An elevator button: pressing it multiple times doesn't make the elevator go faster or to a different floor.",
        visual: 'resource-verbs',
        constraints: [
          'Retries are unavoidable on an unreliable network; repeating a request must not repeat its effect.',
          'Idempotency keys buy that guarantee with server-side state that has to be stored and expired.',
        ],
        specimen: [
          'POST /payments HTTP/1.1',
          'Idempotency-Key: <client-generated-key>',
          '---',
          'replay with the same key → one effect, same reply',
        ].join('\n'),
      },
    ],
  },
  {
    id: 'graphql',
    name: 'GraphQL Deep Dive',
    topics: [
      {
        id: 'graphql-schema',
        name: 'GraphQL Schema & Types',
        slug: 'graphql-schema',
        status: 'active',
        description: 'Defining the shape of your data.',
        analogy: 'A blueprint for a custom-built house where you choose exactly which rooms you want.',
        visual: 'schema-resolution',
        constraints: [
          'The schema is the contract: a client can select only the fields the schema declares.',
          'A single endpoint removes URL-shaped caching; responses are cached per field instead.',
        ],
        specimen: [
          'POST /graphql HTTP/1.1',
          'Content-Type: application/json',
          '---',
          'query { order(id: "<order-id>") { id total } }',
        ].join('\n'),
        render: {
          kind: 'schema-resolution',
          steps: [
            { node: 'schema', detail: 'declares which types and which fields exist at all' },
            { node: 'operation', detail: 'selects a subset of those fields, nested to any depth' },
            { node: 'validation', detail: 'rejects any selection the schema does not declare' },
            { node: 'execution', detail: 'walks the selection set field by field' },
            { node: 'response', detail: 'carries exactly the selected fields and nothing else' },
          ],
        },
      },
      {
        id: 'resolvers',
        name: 'Resolvers & Execution',
        slug: 'resolvers',
        status: 'coming-soon',
        description: 'How data is fetched for each field.',
        analogy: 'A coordinator gathering ingredients from different shops to fulfill a specific recipe.',
        visual: 'schema-resolution',
        constraints: [
          'Every field resolves independently, so a nested selection can multiply the work.',
          'Batching at the resolver removes repeated fetches but adds a request-scoped cache to manage.',
        ],
        specimen: [
          'Query.order   → one fetch',
          'Order.total   → computed from Order.items',
          'Order.items   → one more fetch',
        ].join('\n'),
      },
      {
        id: 'n-plus-1',
        name: 'N+1 Problem',
        slug: 'n-plus-1',
        status: 'coming-soon',
        description: 'The common performance trap in nested fetching.',
        analogy: 'Going to the store for each individual item on your list instead of buying them all in one trip.',
        visual: 'schema-resolution',
        constraints: [
          'One query per parent row scales with the size of the result set, not with the request.',
          'Batching defers work by a tick — invisible to the caller, and easy to misconfigure.',
        ],
        specimen: [
          'list orders        → 1 query',
          "each order's items → N queries",
          'batched loader     → 1 query for N keys',
        ].join('\n'),
      },
    ],
  },
  {
    id: 'security',
    name: 'API Security & Auth',
    topics: [
      {
        id: 'auth-models',
        name: 'Authentication (Keys, OAuth, JWT)',
        slug: 'auth-models',
        status: 'active',
        description: 'Verifying who the user is.',
        analogy: 'A passport (JWT) or a physical key (API Key) used to gain entry.',
        visual: 'auth-gate',
        constraints: [
          'Authentication says who is calling; authorization says what they are allowed to do.',
          'A credential is only as strong as its verification and its expiry — an unverified token is just a string.',
        ],
        specimen: [
          'GET /orders HTTP/1.1',
          'Authorization: Bearer <token>',
          '---',
          '401 Unauthorized  credential missing, malformed or expired',
          '403 Forbidden     credential valid, permission missing',
        ].join('\n'),
        render: {
          kind: 'auth-gate',
          gates: [
            { gate: 'credential present', onFail: '401 Unauthorized' },
            { gate: 'credential verifies and has not expired', onFail: '401 Unauthorized' },
            { gate: 'scope permits this operation', onFail: '403 Forbidden' },
            { gate: 'handler runs', onFail: null },
          ],
        },
      },
      {
        id: 'rate-limiting',
        name: 'Rate Limiting & Throttling',
        slug: 'rate-limiting',
        status: 'coming-soon',
        description: 'Protecting the server from overload.',
        analogy: 'A bouncer at a club limiting how many people can enter per minute.',
        visual: 'auth-gate',
        constraints: [
          'A limit that only counts per replica leaks as soon as you run more than one replica.',
          'Aggressive limits protect the origin and reject legitimate bursts along with the abusive ones.',
        ],
        specimen: [
          'LIMIT   N requests per key, per window',
          'ALLOW   under the limit → handler runs',
          'REJECT  over the limit  → 429 + Retry-After: <seconds>',
        ].join('\n'),
      },
    ],
  },
  {
    id: 'performance',
    name: 'Performance & Caching',
    topics: [
      {
        id: 'caching-flow',
        name: 'Caching (HTTP, CDN, Client)',
        slug: 'caching-flow',
        status: 'active',
        description: 'Storing responses for faster future access.',
        analogy: "Keeping a snack in your pocket instead of going back to the fridge every time you're hungry.",
        visual: 'cache-flow',
        constraints: [
          'A cached copy is only correct while its freshness lifetime holds.',
          'Revalidation costs one conditional request instead of a full response body.',
          'A shared cache answers for many clients at once, so one wrong header is wrong for all of them.',
        ],
        specimen: [
          'GET /reports/<report-id> HTTP/1.1',
          'If-None-Match: "<entity-tag>"',
          '---',
          '304 Not Modified    the cached copy is still valid',
          'Cache-Control: max-age=<seconds>',
        ].join('\n'),
        render: {
          kind: 'cache-flow',
          layers: [
            {
              layer: 'client cache',
              hit: 'the response never leaves the device',
              miss: 'the request goes out on the network',
            },
            {
              layer: 'shared cache',
              hit: 'one stored copy answers many clients',
              miss: 'the request reaches the origin',
            },
            {
              layer: 'origin',
              hit: 'freshness headers let the copy be reused',
              miss: 'the representation is built from scratch',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'evolution',
    name: 'Evolution & Versioning',
    topics: [
      {
        id: 'versioning',
        name: 'Versioning Strategies',
        slug: 'versioning',
        status: 'coming-soon',
        description: 'Managing changes without breaking clients.',
        analogy: 'Updating a recipe while still allowing people to order the "Classic" version.',
        visual: 'http-message',
        constraints: [
          'Additive change is cheaper than a parallel version; every version multiplies what must be maintained.',
          'An old version can only be removed once client telemetry shows nobody still asks for it.',
        ],
        specimen: [
          'GET /orders/<order-id> HTTP/1.1',
          'Accept: application/vnd.example.v2+json',
          '---',
          'the version can live in the path, a query parameter, or the media type',
        ].join('\n'),
      },
      {
        id: 'backward-compatibility',
        name: 'Backward Compatibility',
        slug: 'backward-compatibility',
        status: 'coming-soon',
        description: 'Ensuring old clients still work.',
        analogy: 'New light bulbs that still fit into old sockets.',
        visual: 'interface-contract',
        constraints: [
          'Adding an optional field is safe; removing or retyping a field clients read is not.',
          'Compatibility has to be measured against real client traffic, not against intent.',
        ],
        specimen: [
          'ADD     optional field       old clients ignore it',
          'REMOVE  a field clients read breaks them',
        ].join('\n'),
      },
    ],
  },
];
