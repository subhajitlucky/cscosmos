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
  { domain: 'fullstack', topicSlug: 'program-cosmos', engineDir: 'programviz' },
  { domain: 'fullstack', topicSlug: 'webprotocols', engineDir: 'webprotocolsviz' },
  { domain: 'fullstack', topicSlug: 'websecurity', engineDir: 'websecureviz' },
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
  { domain: 'fullstack', topicSlug: 'wasmcosmos', engineDir: 'wasmcosmos' },
  { domain: 'fullstack', topicSlug: 'xrcosmos', engineDir: 'xrcosmos' },
  { domain: 'fullstack', topicSlug: 'crossplatformviz', engineDir: 'crossplatformviz' },
  { domain: 'fullstack', topicSlug: 'nodecosmos', engineDir: 'nodecosmos' },
  { domain: 'fullstack', topicSlug: 'golangviz', engineDir: 'golangviz' },
  { domain: 'fullstack', topicSlug: 'rustviz', engineDir: 'rustviz' },
  { domain: 'fullstack', topicSlug: 'fastapicosmos', engineDir: 'fastapicosmos' },
  { domain: 'fullstack', topicSlug: 'apiviz', engineDir: 'apiviz' },
  { domain: 'fullstack', topicSlug: 'authviz', engineDir: 'authviz' },
  { domain: 'fullstack', topicSlug: 'sqlcosmos', engineDir: 'sqlcosmos' },
  { domain: 'fullstack', topicSlug: 'mongocosmos', engineDir: 'mongocosmos' },
  { domain: 'fullstack', topicSlug: 'redisviz', engineDir: 'redisviz' },
  { domain: 'fullstack', topicSlug: 'synccosmos', engineDir: 'synccosmos' },
  { domain: 'fullstack', topicSlug: 'dockercosmos', engineDir: 'dockercosmos', crossListedDomains: ['devops'] },
  { domain: 'fullstack', topicSlug: 'mqviz', engineDir: 'mqviz' },
  { domain: 'fullstack', topicSlug: 'microservicesviz', engineDir: 'microservicesviz' },
  { domain: 'fullstack', topicSlug: 'lldcosmos', engineDir: 'lldcosmos' },
  { domain: 'fullstack', topicSlug: 'systemdesignviz', engineDir: 'systemdesignviz' },
  { domain: 'fullstack', topicSlug: 'aicosmos', engineDir: 'aicosmos' },
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
  { domain: 'security', topicSlug: 'software-defined-radio-sdr-and-signal-hacking', engineDir: 'sdrviz' },
  { domain: 'security', topicSlug: 'penetration-testing-and-red-teaming-exploits-c2', engineDir: 'redteamviz' },
  { domain: 'security', topicSlug: 'digital-forensics-and-incident-response-dfir', engineDir: 'dfirviz' },
  { domain: 'security', topicSlug: 'malware-analysis-and-sandbox-internals', engineDir: 'malwareviz' },
  { domain: 'security', topicSlug: 'reverse-engineering-and-assembly-low-level-code', engineDir: 'remasmviz', crossListedDomains: ['advanced'] },
  { domain: 'security', topicSlug: 'hardware-security-and-side-channel-attacks-spectre-meltdown', engineDir: 'sidechanviz', crossListedDomains: ['advanced'] },
  { domain: 'security', topicSlug: 'zero-trust-architecture-and-iam', engineDir: 'zerotrustviz' },
  { domain: 'security', topicSlug: 'security-engineering-threat-models', engineDir: 'threatmodelviz', crossListedDomains: ['advanced'] },
  { domain: 'corecs', topicSlug: 'operating-systems-internals-processes-memory', engineDir: 'osviz' },
  { domain: 'corecs', topicSlug: 'memory-allocators-and-virtual-memory-malloc-paging', engineDir: 'mallocviz' },
  { domain: 'corecs', topicSlug: 'linkers-loaders-and-executables-elf-pe', engineDir: 'linkerviz' },
  { domain: 'corecs', topicSlug: 'java-and-jvm-internals-garbage-collection-bytecode', engineDir: 'jvmviz' },
  { domain: 'corecs', topicSlug: 'computer-architecture-cpu-caches', engineDir: 'cpuviz' },
  { domain: 'corecs', topicSlug: 'computer-networks-internals-tcpip', engineDir: 'tcpviz' },
  { domain: 'corecs', topicSlug: 'database-internals-indexes-transactions', engineDir: 'dbviz' },
  { domain: 'corecs', topicSlug: 'compilers-and-runtime-internals-ast-bytecode', engineDir: 'compilerviz' },
  { domain: 'corecs', topicSlug: 'theory-of-computation-automata-languages-complexity', engineDir: 'tocviz' },
  { domain: 'corecs', topicSlug: 'quantum-computing-internals-qubits-gates-circuits', engineDir: 'qubitviz' },
  { domain: 'corecs', topicSlug: 'dna-storage-and-molecular-computing', engineDir: 'dnaviz' },
  { domain: 'corecs', topicSlug: 'computational-biology-and-bioinformatics-crispr-alphaifold', engineDir: 'bioviz' },
  { domain: 'corecs', topicSlug: 'gpu-architecture-and-parallelism-cuda-simd-shaders', engineDir: 'gpuviz' },
  { domain: 'corecs', topicSlug: 'risc-v-and-custom-silicon-open-hardware', engineDir: 'riscviz' },
  { domain: 'corecs', topicSlug: 'formal-methods-and-tla-the-math-of-correctness', engineDir: 'tlaviz' },
  { domain: 'devops', topicSlug: 'gitcosmos', engineDir: 'gitcosmos' },
  { domain: 'devops', topicSlug: 'k8scosmos', engineDir: 'k8scosmos' },
  { domain: 'devops', topicSlug: 'cloudcosmos', engineDir: 'cloudcosmos' },
  { domain: 'devops', topicSlug: 'loadbalancing', engineDir: 'loadbalancing' },
  { domain: 'ai', topicSlug: 'aimathviz', engineDir: 'aimathviz' },
];
