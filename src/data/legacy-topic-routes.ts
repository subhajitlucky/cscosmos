export interface LegacyTopicRoute {
  domain: string;
  slug: string;
  rootPath: string;
  aliases?: string[];
}

export const legacyTopicRoutes: LegacyTopicRoute[] = [
  {
    "domain": "fullstack",
    "slug": "program-cosmos",
    "rootPath": "program-cosmos"
  },
  {
    "domain": "fullstack",
    "slug": "webprotocols",
    "rootPath": "webprotocols"
  },
  {
    "domain": "fullstack",
    "slug": "websecurity",
    "rootPath": "websecurity"
  },
  {
    "domain": "fullstack",
    "slug": "html-cosmos",
    "rootPath": "html-cosmos"
  },
  {
    "domain": "fullstack",
    "slug": "css-cosmos",
    "rootPath": "css-cosmos"
  },
  {
    "domain": "fullstack",
    "slug": "jsviz",
    "rootPath": "jsviz"
  },
  {
    "domain": "fullstack",
    "slug": "tsviz",
    "rootPath": "tsviz"
  },
  {
    "domain": "fullstack",
    "slug": "browseruniverse",
    "rootPath": "browseruniverse"
  },
  {
    "domain": "fullstack",
    "slug": "reactcosmos",
    "rootPath": "reactcosmos"
  },
  {
    "domain": "fullstack",
    "slug": "nextjscosmos",
    "rootPath": "nextjscosmos"
  },
  {
    "domain": "fullstack",
    "slug": "vuecosmos",
    "rootPath": "vuecosmos"
  },
  {
    "domain": "fullstack",
    "slug": "sveltecosmos",
    "rootPath": "sveltecosmos"
  },
  {
    "domain": "fullstack",
    "slug": "tailwindcosmos",
    "rootPath": "tailwindcosmos"
  },
  {
    "domain": "fullstack",
    "slug": "wasmcosmos",
    "rootPath": "wasmcosmos"
  },
  {
    "domain": "fullstack",
    "slug": "xrcosmos",
    "rootPath": "xrcosmos"
  },
  {
    "domain": "fullstack",
    "slug": "crossplatformviz",
    "rootPath": "crossplatformviz"
  },
  {
    "domain": "fullstack",
    "slug": "nodecosmos",
    "rootPath": "nodecosmos"
  },
  {
    "domain": "fullstack",
    "slug": "golangviz",
    "rootPath": "golangviz"
  },
  {
    "domain": "fullstack",
    "slug": "rustviz",
    "rootPath": "rustviz"
  },
  {
    "domain": "fullstack",
    "slug": "fastapicosmos",
    "rootPath": "fastapicosmos"
  },
  {
    "domain": "fullstack",
    "slug": "apiviz",
    "rootPath": "apiviz"
  },
  {
    "domain": "fullstack",
    "slug": "authviz",
    "rootPath": "authviz"
  },
  {
    "domain": "fullstack",
    "slug": "sqlcosmos",
    "rootPath": "sqlcosmos"
  },
  {
    "domain": "fullstack",
    "slug": "mongocosmos",
    "rootPath": "mongocosmos"
  },
  {
    "domain": "fullstack",
    "slug": "redisviz",
    "rootPath": "redisviz"
  },
  {
    "domain": "fullstack",
    "slug": "synccosmos",
    "rootPath": "synccosmos"
  },
  {
    "domain": "fullstack",
    "slug": "dockercosmos",
    "rootPath": "dockercosmos",
    "aliases": [
      "devops"
    ]
  },
  {
    "domain": "fullstack",
    "slug": "mqviz",
    "rootPath": "mqviz"
  },
  {
    "domain": "fullstack",
    "slug": "microservicesviz",
    "rootPath": "microservicesviz"
  },
  {
    "domain": "fullstack",
    "slug": "lldcosmos",
    "rootPath": "lldcosmos"
  },
  {
    "domain": "fullstack",
    "slug": "systemdesignviz",
    "rootPath": "systemdesignviz"
  },
  {
    "domain": "fullstack",
    "slug": "aicosmos",
    "rootPath": "aicosmos"
  },
  {
    "domain": "dsa",
    "slug": "arrayviz",
    "rootPath": "arrayviz"
  },
  {
    "domain": "dsa",
    "slug": "stringalgoviz",
    "rootPath": "stringalgoviz"
  },
  {
    "domain": "web3",
    "slug": "blockchainviz",
    "rootPath": "blockchainviz"
  },
  {
    "domain": "web3",
    "slug": "cryptviz",
    "rootPath": "cryptviz",
    "aliases": [
      "security"
    ]
  },
  {
    "domain": "web3",
    "slug": "merkletreeviz",
    "rootPath": "merkletreeviz"
  },
  {
    "domain": "web3",
    "slug": "patriciatrie",
    "rootPath": "patriciatrie"
  },
  {
    "domain": "web3",
    "slug": "consensusviz",
    "rootPath": "consensusviz"
  },
  {
    "domain": "web3",
    "slug": "ptopblockchain",
    "rootPath": "ptopblockchain"
  },
  {
    "domain": "web3",
    "slug": "evminternals",
    "rootPath": "evminternals"
  },
  {
    "domain": "web3",
    "slug": "solidityviz",
    "rootPath": "solidityviz"
  },
  {
    "domain": "security",
    "slug": "software-defined-radio-sdr-and-signal-hacking",
    "rootPath": "software-defined-radio-sdr-and-signal-hacking"
  },
  {
    "domain": "security",
    "slug": "penetration-testing-and-red-teaming-exploits-c2",
    "rootPath": "penetration-testing-and-red-teaming-exploits-c2"
  },
  {
    "domain": "security",
    "slug": "digital-forensics-and-incident-response-dfir",
    "rootPath": "digital-forensics-and-incident-response-dfir"
  },
  {
    "domain": "security",
    "slug": "malware-analysis-and-sandbox-internals",
    "rootPath": "malware-analysis-and-sandbox-internals"
  },
  {
    "domain": "security",
    "slug": "reverse-engineering-and-assembly-low-level-code",
    "rootPath": "reverse-engineering-and-assembly-low-level-code",
    "aliases": [
      "advanced"
    ]
  },
  {
    "domain": "security",
    "slug": "hardware-security-and-side-channel-attacks-spectre-meltdown",
    "rootPath": "hardware-security-and-side-channel-attacks-spectre-meltdown",
    "aliases": [
      "advanced"
    ]
  },
  {
    "domain": "security",
    "slug": "zero-trust-architecture-and-iam",
    "rootPath": "zero-trust-architecture-and-iam"
  },
  {
    "domain": "security",
    "slug": "security-engineering-threat-models",
    "rootPath": "security-engineering-threat-models",
    "aliases": [
      "advanced"
    ]
  },
  {
    "domain": "corecs",
    "slug": "operating-systems-internals-processes-memory",
    "rootPath": "operating-systems-internals-processes-memory"
  },
  {
    "domain": "corecs",
    "slug": "memory-allocators-and-virtual-memory-malloc-paging",
    "rootPath": "memory-allocators-and-virtual-memory-malloc-paging"
  },
  {
    "domain": "corecs",
    "slug": "linkers-loaders-and-executables-elf-pe",
    "rootPath": "linkers-loaders-and-executables-elf-pe"
  },
  {
    "domain": "corecs",
    "slug": "java-and-jvm-internals-garbage-collection-bytecode",
    "rootPath": "java-and-jvm-internals-garbage-collection-bytecode"
  },
  {
    "domain": "corecs",
    "slug": "computer-architecture-cpu-caches",
    "rootPath": "computer-architecture-cpu-caches"
  },
  {
    "domain": "corecs",
    "slug": "computer-networks-internals-tcpip",
    "rootPath": "computer-networks-internals-tcpip"
  },
  {
    "domain": "corecs",
    "slug": "database-internals-indexes-transactions",
    "rootPath": "database-internals-indexes-transactions"
  },
  {
    "domain": "corecs",
    "slug": "compilers-and-runtime-internals-ast-bytecode",
    "rootPath": "compilers-and-runtime-internals-ast-bytecode"
  },
  {
    "domain": "corecs",
    "slug": "theory-of-computation-automata-languages-complexity",
    "rootPath": "theory-of-computation-automata-languages-complexity"
  },
  {
    "domain": "corecs",
    "slug": "quantum-computing-internals-qubits-gates-circuits",
    "rootPath": "quantum-computing-internals-qubits-gates-circuits"
  },
  {
    "domain": "corecs",
    "slug": "dna-storage-and-molecular-computing",
    "rootPath": "dna-storage-and-molecular-computing"
  },
  {
    "domain": "corecs",
    "slug": "computational-biology-and-bioinformatics-crispr-alphaifold",
    "rootPath": "computational-biology-and-bioinformatics-crispr-alphaifold"
  },
  {
    "domain": "corecs",
    "slug": "gpu-architecture-and-parallelism-cuda-simd-shaders",
    "rootPath": "gpu-architecture-and-parallelism-cuda-simd-shaders"
  },
  {
    "domain": "corecs",
    "slug": "risc-v-and-custom-silicon-open-hardware",
    "rootPath": "risc-v-and-custom-silicon-open-hardware"
  },
  {
    "domain": "corecs",
    "slug": "formal-methods-and-tla-the-math-of-correctness",
    "rootPath": "formal-methods-and-tla-the-math-of-correctness"
  },
  {
    "domain": "devops",
    "slug": "gitcosmos",
    "rootPath": "gitcosmos"
  },
  {
    "domain": "devops",
    "slug": "k8scosmos",
    "rootPath": "k8scosmos"
  },
  {
    "domain": "devops",
    "slug": "cloudcosmos",
    "rootPath": "cloudcosmos"
  },
  {
    "domain": "devops",
    "slug": "loadbalancing",
    "rootPath": "loadbalancing"
  },
  {
    "domain": "ai",
    "slug": "aimathviz",
    "rootPath": "aimathviz"
  }
];
