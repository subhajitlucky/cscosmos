export type DBMSWalkthrough =
  | { kind: 'erd'; cardinality: '1:1' | '1:N' | 'M:N' }
  | { kind: 'algebra'; operation: 'selection' | 'projection' | 'join' }
  | { kind: 'normalization'; form: '1NF' | '2NF' | '3NF' }
  | { kind: 'transaction-states' }
  | { kind: 'locking' };
