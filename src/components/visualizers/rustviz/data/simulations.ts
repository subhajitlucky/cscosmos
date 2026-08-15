export interface OwnershipStep {
  stepIndex: number;
  codeLine: number;
  codeSnippet: string;
  explanation: string;
  stackFrames: {
    name: string;
    variables: {
      name: string;
      type: string;
      value: string;
      heapAddress?: string;
      status: 'active' | 'moved' | 'dropped' | 'borrowed';
      capacity?: number;
      length?: number;
    }[];
  }[];
  heapAllocations: {
    address: string;
    content: string;
    owner: string;
    isFreed: boolean;
  }[];
}

export interface BorrowStep {
  stepIndex: number;
  codeLine: number;
  codeSnippet: string;
  explanation: string;
  variableState: {
    name: string;
    value: string;
    status: 'owned' | 'immutable_loan' | 'mutable_loan' | 'frozen';
    borrowCount: number;
  }[];
  activeLoans: {
    loanId: string;
    borrower: string;
    target: string;
    kind: 'shared' | 'exclusive';
    scopeSpan: string;
  }[];
  isConflict: boolean;
  compilerDiagnostic?: string;
}

export interface LifetimeScenario {
  id: string;
  title: string;
  description: string;
  code: string;
  lifetimes: {
    name: string;
    color: string;
    startLine: number;
    endLine: number;
    description: string;
  }[];
  isValid: boolean;
  errorReason?: string;
}

export const ownershipScenarios: { id: string; title: string; steps: OwnershipStep[] }[] = [
  {
    id: 'string-move',
    title: 'Heap String Move Semantics',
    steps: [
      {
        stepIndex: 1,
        codeLine: 2,
        codeSnippet: 'let s1 = String::from("Ferris");',
        explanation: 'Memory allocated: s1 stack descriptor (ptr: 0x5010, cap: 8, len: 6) points to heap address 0x5010 containing "Ferris".',
        stackFrames: [
          {
            name: 'main()',
            variables: [
              { name: 's1', type: 'String', value: 'ptr: 0x5010', heapAddress: '0x5010', status: 'active', capacity: 8, length: 6 }
            ]
          }
        ],
        heapAllocations: [
          { address: '0x5010', content: '[\'F\', \'e\', \'r\', \'r\', \'i\', \'s\']', owner: 's1', isFreed: false }
        ]
      },
      {
        stepIndex: 2,
        codeLine: 3,
        codeSnippet: 'let s2 = s1;',
        explanation: 'Move occurs: s1 stack data is copied into s2. Ownership of heap buffer 0x5010 is transferred to s2. s1 is marked INVALID.',
        stackFrames: [
          {
            name: 'main()',
            variables: [
              { name: 's1', type: 'String', value: '<INVALIDATED / MOVED>', status: 'moved' },
              { name: 's2', type: 'String', value: 'ptr: 0x5010', heapAddress: '0x5010', status: 'active', capacity: 8, length: 6 }
            ]
          }
        ],
        heapAllocations: [
          { address: '0x5010', content: '[\'F\', \'e\', \'r\', \'r\', \'i\', \'s\']', owner: 's2', isFreed: false }
        ]
      },
      {
        stepIndex: 3,
        codeLine: 4,
        codeSnippet: 'println!("{}", s2);',
        explanation: 's2 is valid and prints "Ferris". Any attempt to access s1 now triggers compiler error E0382.',
        stackFrames: [
          {
            name: 'main()',
            variables: [
              { name: 's1', type: 'String', value: '<INVALIDATED / MOVED>', status: 'moved' },
              { name: 's2', type: 'String', value: 'ptr: 0x5010', heapAddress: '0x5010', status: 'active', capacity: 8, length: 6 }
            ]
          }
        ],
        heapAllocations: [
          { address: '0x5010', content: '[\'F\', \'e\', \'r\', \'r\', \'i\', \'s\']', owner: 's2', isFreed: false }
        ]
      },
      {
        stepIndex: 4,
        codeLine: 5,
        codeSnippet: '} // Scope exit: RAII Drop',
        explanation: 'Scope ends: s2 falls out of scope. Its Drop implementation executes, freeing heap address 0x5010. s1 was moved, so no double-free occurs.',
        stackFrames: [],
        heapAllocations: [
          { address: '0x5010', content: '<DEALLOCATED>', owner: 'none', isFreed: true }
        ]
      }
    ]
  },
  {
    id: 'clone-deep-copy',
    title: 'Explicit Deep Clone (.clone())',
    steps: [
      {
        stepIndex: 1,
        codeLine: 2,
        codeSnippet: 'let s1 = String::from("Rust");',
        explanation: 's1 created on stack, pointing to heap buffer 0x7000.',
        stackFrames: [
          {
            name: 'main()',
            variables: [
              { name: 's1', type: 'String', value: 'ptr: 0x7000', heapAddress: '0x7000', status: 'active', capacity: 4, length: 4 }
            ]
          }
        ],
        heapAllocations: [
          { address: '0x7000', content: '[\'R\', \'u\', \'s\', \'t\']', owner: 's1', isFreed: false }
        ]
      },
      {
        stepIndex: 2,
        codeLine: 3,
        codeSnippet: 'let s2 = s1.clone();',
        explanation: 's1.clone() allocates a NEW separate heap buffer at 0x8000. Both s1 and s2 remain active owners of their own buffers.',
        stackFrames: [
          {
            name: 'main()',
            variables: [
              { name: 's1', type: 'String', value: 'ptr: 0x7000', heapAddress: '0x7000', status: 'active', capacity: 4, length: 4 },
              { name: 's2', type: 'String', value: 'ptr: 0x8000', heapAddress: '0x8000', status: 'active', capacity: 4, length: 4 }
            ]
          }
        ],
        heapAllocations: [
          { address: '0x7000', content: '[\'R\', \'u\', \'s\', \'t\']', owner: 's1', isFreed: false },
          { address: '0x8000', content: '[\'R\', \'u\', \'s\', \'t\']', owner: 's2', isFreed: false }
        ]
      }
    ]
  }
];

export const borrowScenarios: { id: string; title: string; steps: BorrowStep[] }[] = [
  {
    id: 'aliasing-conflict',
    title: 'Aliasing Conflict (Reader + Writer)',
    steps: [
      {
        stepIndex: 1,
        codeLine: 2,
        codeSnippet: 'let mut data = vec![10, 20];',
        explanation: 'data is an owned, mutable vector initialized on stack.',
        variableState: [
          { name: 'data', value: 'vec![10, 20]', status: 'owned', borrowCount: 0 }
        ],
        activeLoans: [],
        isConflict: false
      },
      {
        stepIndex: 2,
        codeLine: 3,
        codeSnippet: 'let r1 = &data;',
        explanation: 'Shared loan created: r1 borrows data immutably (&data). data is now FROZEN against mutation.',
        variableState: [
          { name: 'data', value: 'vec![10, 20]', status: 'frozen', borrowCount: 1 },
          { name: 'r1', value: '&data', status: 'immutable_loan', borrowCount: 0 }
        ],
        activeLoans: [
          { loanId: 'loan-1', borrower: 'r1', target: 'data', kind: 'shared', scopeSpan: 'lines 3..5' }
        ],
        isConflict: false
      },
      {
        stepIndex: 3,
        codeLine: 4,
        codeSnippet: 'data.push(30); // ERROR!',
        explanation: 'Compiler halts with E0502: Cannot borrow `data` as mutable because it is currently borrowed as immutable by `r1`.',
        variableState: [
          { name: 'data', value: 'vec![10, 20]', status: 'frozen', borrowCount: 1 },
          { name: 'r1', value: '&data', status: 'immutable_loan', borrowCount: 0 }
        ],
        activeLoans: [
          { loanId: 'loan-1', borrower: 'r1', target: 'data', kind: 'shared', scopeSpan: 'lines 3..5' }
        ],
        isConflict: true,
        compilerDiagnostic: 'error[E0502]: cannot borrow `data` as mutable because it is also borrowed as immutable by `r1`'
      }
    ]
  }
];

export const lifetimeScenarios: LifetimeScenario[] = [
  {
    id: 'valid-lifetime',
    title: 'Valid Nested Lifetime (\'a outlives \'b)',
    description: 'The owned data outlives all references pointing into it.',
    code: `fn main() {
    let outer_string = String::from("Safe & Sound"); // Lifetime 'a
    let r: &str;
    {
        r = &outer_string; // Reference lives in 'b, data lives in 'a
        println!("Inner read: {}", r);
    }
    println!("Outer read: {}", outer_string);
}`,
    lifetimes: [
      { name: "'a (outer_string)", color: "var(--rust-emerald)", startLine: 2, endLine: 8, description: "Stack life of outer_string" },
      { name: "'b (r reference)", color: "var(--rust-cyan)", startLine: 5, endLine: 6, description: "Active loan of r" }
    ],
    isValid: true
  },
  {
    id: 'invalid-dangling',
    title: 'Invalid Dangling Reference (E0597)',
    description: 'The reference attempts to outlive the scope of the variable it points to.',
    code: `fn main() {
    let r;
    {
        let local_string = String::from("Short lived"); // Lifetime 'b
        r = &local_string; // Error: 'b ends at line 6!
    }
    println!("{}", r); // Dangling reference read in 'a!
}`,
    lifetimes: [
      { name: "'a (r)", color: "var(--rust-rose)", startLine: 2, endLine: 7, description: "Requested span of r" },
      { name: "'b (local_string)", color: "var(--rust-amber)", startLine: 4, endLine: 6, description: "Actual life of local_string" }
    ],
    isValid: false,
    errorReason: "local_string is dropped at line 6, but r is read at line 7."
  }
];
