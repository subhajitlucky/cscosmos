export interface Topic {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'coming-soon';
  description: string;
  analogy: string;
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
      { id: 'what-is-api', name: 'What is an API', slug: 'what-is-api', status: 'active', description: 'The interface between software components.', analogy: 'A restaurant menu providing a list of dishes you can order without knowing how the kitchen works.' },
      { id: 'client-server', name: 'Client–Server Model', slug: 'client-server', status: 'active', description: 'The request-response architecture.', analogy: 'A customer (client) ordering coffee from a barista (server).' },
      { id: 'http-basics', name: 'HTTP Basics', slug: 'http-basics', status: 'active', description: 'Methods, Headers, and Status Codes.', analogy: 'Sending a letter: the address is the URL, the stamp is the header, and the content is the payload.' }
    ]
  },
  {
    id: 'rest',
    name: 'REST Design Mastery',
    topics: [
      { id: 'rest-constraints', name: 'REST Constraints', slug: 'rest-constraints', status: 'active', description: 'The six guiding principles of REST.', analogy: 'The rules of a sport that ensure every game follows the same structure.' },
      { id: 'resource-modeling', name: 'Resource Modeling', slug: 'resource-modeling', status: 'coming-soon', description: 'Thinking in terms of nouns, not verbs.', analogy: 'Organizing a library by books (resources) rather than actions like "borrowing".' },
      { id: 'url-naming', name: 'URL Design & Naming', slug: 'url-naming', status: 'coming-soon', description: 'Creating intuitive and consistent paths.', analogy: 'Clear signage in a building that tells you exactly where you are.' },
      { id: 'idempotency', name: 'Idempotency & Safety', slug: 'idempotency', status: 'coming-soon', description: 'Ensuring repeated requests have the same effect.', analogy: 'An elevator button: pressing it multiple times doesn\'t make the elevator go faster or to a different floor.' }
    ]
  },
  {
    id: 'graphql',
    name: 'GraphQL Deep Dive',
    topics: [
      { id: 'graphql-schema', name: 'GraphQL Schema & Types', slug: 'graphql-schema', status: 'active', description: 'Defining the shape of your data.', analogy: 'A blueprint for a custom-built house where you choose exactly which rooms you want.' },
      { id: 'resolvers', name: 'Resolvers & Execution', slug: 'resolvers', status: 'coming-soon', description: 'How data is fetched for each field.', analogy: 'A coordinator gathering ingredients from different shops to fulfill a specific recipe.' },
      { id: 'n-plus-1', name: 'N+1 Problem', slug: 'n-plus-1', status: 'coming-soon', description: 'The common performance trap in nested fetching.', analogy: 'Going to the store for each individual item on your list instead of buying them all in one trip.' }
    ]
  },
  {
    id: 'security',
    name: 'API Security & Auth',
    topics: [
      { id: 'auth-models', name: 'Authentication (Keys, OAuth, JWT)', slug: 'auth-models', status: 'active', description: 'Verifying who the user is.', analogy: 'A passport (JWT) or a physical key (API Key) used to gain entry.' },
      { id: 'rate-limiting', name: 'Rate Limiting & Throttling', slug: 'rate-limiting', status: 'coming-soon', description: 'Protecting the server from overload.', analogy: 'A bouncer at a club limiting how many people can enter per minute.' }
    ]
  },
  {
    id: 'performance',
    name: 'Performance & Caching',
    topics: [
      { id: 'caching-flow', name: 'Caching (HTTP, CDN, Client)', slug: 'caching-flow', status: 'active', description: 'Storing responses for faster future access.', analogy: 'Keeping a snack in your pocket instead of going back to the fridge every time you\'re hungry.' }
    ]
  },
  {
    id: 'evolution',
    name: 'Evolution & Versioning',
    topics: [
      { id: 'versioning', name: 'Versioning Strategies', slug: 'versioning', status: 'coming-soon', description: 'Managing changes without breaking clients.', analogy: 'Updating a recipe while still allowing people to order the "Classic" version.' },
      { id: 'backward-compatibility', name: 'Backward Compatibility', slug: 'backward-compatibility', status: 'coming-soon', description: 'Ensuring old clients still work.', analogy: 'New light bulbs that still fit into old sockets.' }
    ]
  }
];
