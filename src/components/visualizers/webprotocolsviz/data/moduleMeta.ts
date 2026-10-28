export type ModuleDifficulty = 'Beginner' | 'Intermediate';

export interface ModuleMeta {
  difficulty: ModuleDifficulty;
  minutes: number;
}

/** Per-lesson pacing. Keep the total close to the topic estimate in topic-meta.ts. */
export const MODULE_META: Record<string, ModuleMeta> = {
  'http-intro': { difficulty: 'Beginner', minutes: 3 },
  'request-response': { difficulty: 'Beginner', minutes: 3 },
  methods: { difficulty: 'Beginner', minutes: 2 },
  'headers-intro': { difficulty: 'Beginner', minutes: 2 },
  'request-headers': { difficulty: 'Beginner', minutes: 2 },
  'response-headers': { difficulty: 'Beginner', minutes: 2 },
  'status-codes': { difficulty: 'Beginner', minutes: 3 },
  'caching-basics': { difficulty: 'Beginner', minutes: 3 },
  'cache-control': { difficulty: 'Intermediate', minutes: 3 },
  'etag-last-modified': { difficulty: 'Intermediate', minutes: 3 },
  'browser-vs-cdn': { difficulty: 'Intermediate', minutes: 3 },
  https: { difficulty: 'Intermediate', minutes: 4 },
  cookies: { difficulty: 'Intermediate', minutes: 3 },
  performance: { difficulty: 'Intermediate', minutes: 4 },
};
