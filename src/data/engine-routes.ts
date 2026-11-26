import type { DomainKey } from './domains';

/**
 * Authoritative mapping between a catalog topic and its engine.
 *
 * Canonical URL: /[domain]/[topicSlug]
 * Engine URL:    /[topicSlug]
 * Engine source: src/components/visualizers/[engineDir]
 *
 * `next.config.ts` derives the canonical rewrite and redirect from this map.
 */
export interface EngineRoute {
  domain: DomainKey;
  topicSlug: string;
  engineDir: string;
  crossListedDomains?: DomainKey[];
}

export const engineRoutes: EngineRoute[] = [
  { domain: 'corecs', topicSlug: 'program-cosmos', engineDir: 'programviz' },
  { domain: 'fullstack', topicSlug: 'webprotocols', engineDir: 'webprotocolsviz' },
  { domain: 'security', topicSlug: 'websecurity', engineDir: 'websecureviz', crossListedDomains: ['fullstack'] },
  { domain: 'fullstack', topicSlug: 'html-cosmos', engineDir: 'htmlviz' },
  { domain: 'fullstack', topicSlug: 'css-cosmos', engineDir: 'cssviz' },
  { domain: 'fullstack', topicSlug: 'jsviz', engineDir: 'jsviz' },
  { domain: 'fullstack', topicSlug: 'tsviz', engineDir: 'tsviz' },
  { domain: 'fullstack', topicSlug: 'browseruniverse', engineDir: 'browseruniverse' },
  { domain: 'fullstack', topicSlug: 'reactcosmos', engineDir: 'reactcosmos' },
  { domain: 'fullstack', topicSlug: 'nextjscosmos', engineDir: 'nextjscosmos' },
  { domain: 'fullstack', topicSlug: 'vuecosmos', engineDir: 'vuecosmos' },
  { domain: 'fullstack', topicSlug: 'sveltecosmos', engineDir: 'sveltecosmos' },
  { domain: 'fullstack', topicSlug: 'tailwindcosmos', engineDir: 'tailwindcosmos' },
  { domain: 'advanced', topicSlug: 'wasmcosmos', engineDir: 'wasmcosmos' },
  { domain: 'advanced', topicSlug: 'xrcosmos', engineDir: 'xrcosmos' },
  { domain: 'advanced', topicSlug: 'crossplatformviz', engineDir: 'crossplatformviz' },
  { domain: 'fullstack', topicSlug: 'nodecosmos', engineDir: 'nodecosmos' },
  { domain: 'fullstack', topicSlug: 'golangviz', engineDir: 'golangviz' },
  { domain: 'fullstack', topicSlug: 'rustviz', engineDir: 'rustviz' },
  { domain: 'fullstack', topicSlug: 'fastapicosmos', engineDir: 'fastapicosmos' },
  { domain: 'fullstack', topicSlug: 'apiviz', engineDir: 'apiviz' },
  { domain: 'security', topicSlug: 'authviz', engineDir: 'authviz', crossListedDomains: ['fullstack'] },
  { domain: 'fullstack', topicSlug: 'sqlcosmos', engineDir: 'sqlcosmos' },
  { domain: 'fullstack', topicSlug: 'mongocosmos', engineDir: 'mongocosmos' },
  { domain: 'advanced', topicSlug: 'synccosmos', engineDir: 'synccosmos' },
  { domain: 'devops', topicSlug: 'dockercosmos', engineDir: 'dockercosmos', crossListedDomains: ['fullstack'] },
  { domain: 'advanced', topicSlug: 'mqviz', engineDir: 'mqviz' },
  { domain: 'advanced', topicSlug: 'microservicesviz', engineDir: 'microservicesviz' },
  { domain: 'advanced', topicSlug: 'lldcosmos', engineDir: 'lldcosmos' },
  { domain: 'advanced', topicSlug: 'systemdesignviz', engineDir: 'systemdesignviz' },
  { domain: 'ai', topicSlug: 'aicosmos', engineDir: 'aicosmos' },
  { domain: 'dsa', topicSlug: 'arrayviz', engineDir: 'arrayviz' },
  { domain: 'dsa', topicSlug: 'stringalgoviz', engineDir: 'stringalgoviz' },
  { domain: 'web3', topicSlug: 'blockchainviz', engineDir: 'blockchainviz' },
  { domain: 'web3', topicSlug: 'cryptviz', engineDir: 'cryptviz', crossListedDomains: ['security'] },
  { domain: 'web3', topicSlug: 'merkletreeviz', engineDir: 'merkletreeviz' },
  { domain: 'web3', topicSlug: 'patriciatrie', engineDir: 'patriciatrie' },
  { domain: 'web3', topicSlug: 'consensusviz', engineDir: 'consensusviz' },
  { domain: 'web3', topicSlug: 'ptopblockchain', engineDir: 'ptopblockchain' },
  { domain: 'web3', topicSlug: 'evminternals', engineDir: 'evminternals' },
  { domain: 'web3', topicSlug: 'solidityviz', engineDir: 'solidityviz' },
  { domain: 'devops', topicSlug: 'gitcosmos', engineDir: 'gitcosmos', crossListedDomains: ['fullstack'] },
  { domain: 'devops', topicSlug: 'k8scosmos', engineDir: 'k8scosmos' },
  { domain: 'devops', topicSlug: 'cloudcosmos', engineDir: 'cloudcosmos' },
  { domain: 'devops', topicSlug: 'loadbalancing', engineDir: 'loadbalancing' },
  { domain: 'ai', topicSlug: 'aimathviz', engineDir: 'aimathviz' },
];
