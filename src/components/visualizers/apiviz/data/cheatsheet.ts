export interface ApiCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    tip: string;
  }[];
}

export const API_CHEATSHEET: ApiCheatSheetSection[] = [
  {
    id: 'graphql-patterns',
    title: 'GraphQL Schema & DataLoader Patterns',
    category: 'GraphQL',
    snippets: [
      {
        title: 'Per-Request DataLoader Factory',
        description: 'Creates isolated DataLoader instances for each HTTP request',
        code: `function createLoaders(db: Database) {
  return {
    userLoader: new DataLoader(async (ids: readonly string[]) => {
      const users = await db.users.findMany({ where: { id: { in: [...ids] } } });
      const map = new Map(users.map(u => [u.id, u]));
      return ids.map(id => map.get(id) || null);
    }),
  };
}`,
        tip: 'Pass loaders into the GraphQL context to ensure request isolation.'
      }
    ]
  },
  {
    id: 'rest-standards',
    title: 'REST API Best Practices & Idempotency',
    category: 'REST',
    snippets: [
      {
        title: 'RFC 7807 Problem Details Error Format',
        description: 'Standardized machine-readable error responses',
        code: `// Content-Type: application/problem+json
{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Insufficient Funds",
  "status": 422,
  "detail": "Your current account balance of $12.50 cannot cover the $40.00 withdrawal.",
  "instance": "/accounts/123/withdrawals/456"
}`,
        tip: 'Use standard RFC 7807 format for clean API client error handling.'
      }
    ]
  }
];
