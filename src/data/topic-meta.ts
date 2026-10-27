import type { DomainKey } from './domains';

export type TopicDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TopicMeta {
  difficulty: TopicDifficulty;
  estimatedMinutes: number;
  tags: string[];
  prerequisites: string[];
  related: string[];
}

export const DOMAIN_DEFAULT_META: Record<DomainKey, Omit<TopicMeta, 'tags'>> = {
  fullstack: { difficulty: 'intermediate', estimatedMinutes: 45, prerequisites: [], related: [] },
  dsa: { difficulty: 'intermediate', estimatedMinutes: 40, prerequisites: [], related: [] },
  web3: { difficulty: 'advanced', estimatedMinutes: 60, prerequisites: [], related: [] },
  ai: { difficulty: 'advanced', estimatedMinutes: 60, prerequisites: [], related: [] },
  corecs: { difficulty: 'advanced', estimatedMinutes: 60, prerequisites: [], related: [] },
  devops: { difficulty: 'intermediate', estimatedMinutes: 50, prerequisites: [], related: [] },
  security: { difficulty: 'advanced', estimatedMinutes: 60, prerequisites: [], related: [] },
  advanced: { difficulty: 'advanced', estimatedMinutes: 70, prerequisites: [], related: [] },
};

const TOPIC_OVERRIDES: Record<string, Partial<TopicMeta>> = {
  'program-cosmos': {
    difficulty: 'beginner',
    estimatedMinutes: 35,
    tags: ['cpu', 'memory', 'execution'],
    related: ['computer-architecture-cpu-caches', 'operating-systems-internals-processes-memory', 'compilers-and-runtime-internals-ast-bytecode'],
  },
  'html-cosmos': {
    difficulty: 'beginner',
    estimatedMinutes: 30,
    tags: ['html', 'accessibility', 'semantics'],
    related: ['css-cosmos', 'browseruniverse', 'webprotocols'],
  },
  'css-cosmos': {
    difficulty: 'beginner',
    estimatedMinutes: 35,
    tags: ['css', 'layout', 'flexbox', 'grid'],
    prerequisites: ['html-cosmos'],
    related: ['tailwindcosmos', 'browseruniverse', 'reactcosmos'],
  },
  'webprotocols': {
    difficulty: 'beginner',
    estimatedMinutes: 40,
    tags: ['http', 'dns', 'tcp', 'networking'],
    prerequisites: ['program-cosmos'],
    related: ['websecurity', 'browseruniverse', 'apiviz'],
  },
  websecurity: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['xss', 'csrf', 'csp', 'cors'],
    prerequisites: ['webprotocols'],
    related: ['authviz', 'browseruniverse', 'zero-trust-architecture-and-iam'],
  },
  jsviz: {
    difficulty: 'beginner',
    estimatedMinutes: 40,
    tags: ['javascript', 'event-loop', 'memory'],
    related: ['tsviz', 'nodecosmos', 'browseruniverse'],
  },
  tsviz: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['typescript', 'types', 'compiler'],
    prerequisites: ['jsviz'],
    related: ['jsviz', 'reactcosmos', 'nextjscosmos'],
  },
  browseruniverse: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['browser', 'rendering', 'dom'],
    prerequisites: ['html-cosmos', 'css-cosmos'],
    related: ['jsviz', 'webprotocols', 'reactcosmos'],
  },
  reactcosmos: {
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    tags: ['react', 'fiber', 'hooks'],
    prerequisites: ['jsviz'],
    related: ['nextjscosmos', 'sveltecosmos', 'vuecosmos'],
  },
  nextjscosmos: {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['nextjs', 'rsc', 'ssr', 'routing'],
    prerequisites: ['reactcosmos'],
    related: ['reactcosmos', 'nodecosmos', 'browseruniverse'],
  },
  nodecosmos: {
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    tags: ['nodejs', 'event-loop', 'streams'],
    prerequisites: ['jsviz'],
    related: ['fastapicosmos', 'microservicesviz', 'apiviz'],
  },
  apiviz: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['api', 'rest', 'graphql', 'grpc'],
    prerequisites: ['webprotocols'],
    related: ['authviz', 'microservicesviz', 'systemdesignviz'],
  },
  sqlcosmos: {
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    tags: ['sql', 'indexes', 'mvcc'],
    related: ['database-internals-indexes-transactions', 'mongocosmos', 'systemdesignviz'],
  },
  mongocosmos: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['mongodb', 'bson', 'replication'],
    prerequisites: ['sqlcosmos'],
    related: ['sqlcosmos', 'database-internals-indexes-transactions', 'systemdesignviz'],
  },
  redisviz: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['redis', 'cache', 'eviction'],
    related: ['systemdesignviz', 'loadbalancing', 'sqlcosmos'],
  },
  dockercosmos: {
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    tags: ['docker', 'namespaces', 'cgroups'],
    prerequisites: ['operating-systems-internals-processes-memory'],
    related: ['k8scosmos', 'cloudcosmos', 'loadbalancing'],
  },
  k8scosmos: {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['kubernetes', 'pods', 'control-plane'],
    prerequisites: ['dockercosmos'],
    related: ['cloudcosmos', 'loadbalancing', 'microservicesviz'],
  },
  cloudcosmos: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['cloud', 'regions', 'autoscaling', 'cdn'],
    related: ['k8scosmos', 'loadbalancing', 'systemdesignviz'],
  },
  loadbalancing: {
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    tags: ['load-balancing', 'hashing', 'scaling'],
    related: ['systemdesignviz', 'cloudcosmos', 'microservicesviz'],
  },
  systemdesignviz: {
    difficulty: 'advanced',
    estimatedMinutes: 70,
    tags: ['system-design', 'raft', 'sharding', 'cap'],
    prerequisites: ['loadbalancing', 'sqlcosmos'],
    related: ['microservicesviz', 'mqviz', 'redisviz'],
  },
  microservicesviz: {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['microservices', 'saga', 'circuit-breaker'],
    prerequisites: ['apiviz'],
    related: ['mqviz', 'systemdesignviz', 'k8scosmos'],
  },
  mqviz: {
    difficulty: 'advanced',
    estimatedMinutes: 55,
    tags: ['kafka', 'queues', 'streaming'],
    related: ['microservicesviz', 'systemdesignviz', 'synccosmos'],
  },
  authviz: {
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    tags: ['auth', 'oauth', 'jwt', 'rbac'],
    prerequisites: ['websecurity'],
    related: ['websecurity', 'apiviz', 'zero-trust-architecture-and-iam'],
  },
  rustviz: {
    difficulty: 'advanced',
    estimatedMinutes: 70,
    tags: ['rust', 'ownership', 'borrowing'],
    related: ['memory-allocators-and-virtual-memory-malloc-paging', 'golangviz', 'compilers-and-runtime-internals-ast-bytecode'],
  },
  golangviz: {
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    tags: ['go', 'scheduler', 'channels'],
    related: ['rustviz', 'nodecosmos', 'microservicesviz'],
  },
  aicosmos: {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['ai', 'transformers', 'backprop'],
    related: ['aimathviz', 'ai-engineering-foundations'],
  },
  aimathviz: {
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    tags: ['math', 'linear-algebra', 'calculus'],
    related: ['aicosmos', 'arrayviz'],
  },
  blockchainviz: {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['blockchain', 'merkle', 'evm'],
    prerequisites: ['cryptviz'],
    related: ['merkletreeviz', 'patriciatrie', 'evminternals'],
  },
  cryptviz: {
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    tags: ['cryptography', 'hashing', 'signatures'],
    related: ['blockchainviz', 'authviz', 'merkletreeviz'],
  },
  arrayviz: {
    difficulty: 'beginner',
    estimatedMinutes: 35,
    tags: ['arrays', 'cache', 'sliding-window'],
    related: ['stringalgoviz', 'computer-architecture-cpu-caches'],
  },
  stringalgoviz: {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['strings', 'kmp', 'trie', 'suffix-array'],
    prerequisites: ['arrayviz'],
    related: ['arrayviz', 'compilers-and-runtime-internals-ast-bytecode'],
  },
  lldcosmos: {
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    tags: ['solid', 'design-patterns', 'lld'],
    related: ['systemdesignviz', 'microservicesviz', 'apiviz'],
  },
  'computer-architecture-cpu-caches': {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['cpu', 'cache', 'architecture'],
    related: ['program-cosmos', 'memory-allocators-and-virtual-memory-malloc-paging', 'compilers-and-runtime-internals-ast-bytecode'],
  },
  'operating-systems-internals-processes-memory': {
    difficulty: 'advanced',
    estimatedMinutes: 65,
    tags: ['os', 'processes', 'virtual-memory'],
    related: ['memory-allocators-and-virtual-memory-malloc-paging', 'computer-architecture-cpu-caches', 'dockercosmos'],
  },
  'database-internals-indexes-transactions': {
    difficulty: 'advanced',
    estimatedMinutes: 60,
    tags: ['database', 'btree', 'transactions'],
    prerequisites: ['sqlcosmos'],
    related: ['sqlcosmos', 'systemdesignviz', 'mongocosmos'],
  },
};

const STOP_WORDS = new Set(['with', 'from', 'into', 'your', 'that', 'this', 'and', 'the', 'for']);

function fallbackTags(name: string, domain: DomainKey): string[] {
  const words = name
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 3);
  return [...new Set([domain, ...words])];
}

export function getTopicMeta(slug: string, domain: DomainKey, name: string): TopicMeta {
  const base = DOMAIN_DEFAULT_META[domain];
  const override = TOPIC_OVERRIDES[slug] ?? {};
  return {
    difficulty: override.difficulty ?? base.difficulty,
    estimatedMinutes: override.estimatedMinutes ?? base.estimatedMinutes,
    tags: override.tags ?? fallbackTags(name, domain),
    prerequisites: override.prerequisites ?? base.prerequisites,
    related: override.related ?? base.related,
  };
}
