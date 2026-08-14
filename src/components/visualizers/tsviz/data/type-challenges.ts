export interface TypeChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  category: 'Tuples' | 'Unions' | 'Objects' | 'Template Literals' | 'Recursion';
  instructions: string;
  starterCode: string;
  solution: string;
  tests: {
    description: string;
    typeExpression: string;
    expectedType: string;
  }[];
  explanation: string;
}

export const TYPE_CHALLENGES: TypeChallenge[] = [
  {
    id: 'first-of-array',
    title: 'First of Array',
    difficulty: 'Easy',
    category: 'Tuples',
    instructions: 'Implement a generic type First<T> that takes an Array T and returns its first element type. If the array is empty, return never.',
    starterCode: `type First<T extends any[]> = any;`,
    solution: `type First<T extends any[]> = T extends [infer Head, ...any[]] ? Head : never;`,
    tests: [
      {
        description: 'Extracts first string element from tuple',
        typeExpression: "First<['a', 'b', 'c']>",
        expectedType: "'a'"
      },
      {
        description: 'Extracts first numeric element from tuple',
        typeExpression: 'First<[1, 2, 3]>',
        expectedType: '1'
      },
      {
        description: 'Returns never for empty array',
        typeExpression: 'First<[]>',
        expectedType: 'never'
      }
    ],
    explanation: 'Using pattern matching with the infer keyword: T extends [infer Head, ...any[]] ? Head : never cleanly handles non-empty tuples and returns never when empty.'
  },
  {
    id: 'tuple-to-union',
    title: 'Tuple to Union',
    difficulty: 'Easy',
    category: 'Tuples',
    instructions: 'Implement a generic type TupleToUnion<T> that converts a tuple array into a union of its elements.',
    starterCode: `type TupleToUnion<T extends any[]> = any;`,
    solution: `type TupleToUnion<T extends any[]> = T[number];`,
    tests: [
      {
        description: 'Converts tuple of strings into string union',
        typeExpression: "TupleToUnion<['123', '456', '789']>",
        expectedType: "'123' | '456' | '789'"
      },
      {
        description: 'Converts mixed tuple into union',
        typeExpression: "TupleToUnion<[123, 'abc', true]>",
        expectedType: "123 | 'abc' | true"
      }
    ],
    explanation: 'Indexing an array type with [number] (T[number]) queries the element type across all numeric indices, producing a union of all members.'
  },
  {
    id: 'my-awaited',
    title: 'My Awaited',
    difficulty: 'Medium',
    category: 'Recursion',
    instructions: 'Implement your own version of the standard Awaited<T> utility type that recursively unwraps nested Promise types.',
    starterCode: `type MyAwaited<T> = any;`,
    solution: `type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U extends PromiseLike<any> ? MyAwaited<U> : U : never;`,
    tests: [
      {
        description: 'Unwraps single Promise<string>',
        typeExpression: 'MyAwaited<Promise<string>>',
        expectedType: 'string'
      },
      {
        description: 'Recursively unwraps deeply nested Promise<Promise<number>>',
        typeExpression: 'MyAwaited<Promise<Promise<number>>>',
        expectedType: 'number'
      }
    ],
    explanation: 'Uses conditional types with infer U and recurses (MyAwaited<U>) if U is itself a PromiseLike type.'
  },
  {
    id: 'deep-readonly',
    title: 'Deep Readonly',
    category: 'Objects',
    difficulty: 'Medium',
    instructions: 'Implement a generic DeepReadonly<T> that makes every property (and nested sub-properties) of an object readonly recursively.',
    starterCode: `type DeepReadonly<T> = any;`,
    solution: `type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends Function ? T[K] : T[K] extends object ? DeepReadonly<T[K]> : T[K]; };`,
    tests: [
      {
        description: 'Makes top-level and nested properties readonly',
        typeExpression: "DeepReadonly<{ x: { a: 1; b: 'hi' }; y: string }>",
        expectedType: "{ readonly x: { readonly a: 1; readonly b: 'hi' }; readonly y: string }"
      }
    ],
    explanation: 'Maps over all keys [K in keyof T] and if T[K] is an object (and not a function), recursively invokes DeepReadonly<T[K]>.'
  },
  {
    id: 'my-exclude',
    title: 'My Exclude',
    category: 'Unions',
    difficulty: 'Easy',
    instructions: 'Implement the built-in Exclude<T, U> type that excludes members of union U from union T.',
    starterCode: `type MyExclude<T, U> = any;`,
    solution: `type MyExclude<T, U> = T extends U ? never : T;`,
    tests: [
      {
        description: 'Excludes specific string members',
        typeExpression: "MyExclude<'a' | 'b' | 'c', 'a'>",
        expectedType: "'b' | 'c'"
      },
      {
        description: 'Excludes multiple union variants',
        typeExpression: "MyExclude<'a' | 'b' | 'c', 'a' | 'b'>",
        expectedType: "'c'"
      }
    ],
    explanation: 'Leverages distributive conditional types: when T is a naked type parameter, T extends U distributes over each union member and filters out matches with never.'
  },
  {
    id: 'kebab-case',
    title: 'CamelCase to KebabCase',
    category: 'Template Literals',
    difficulty: 'Hard',
    instructions: 'Implement a type KebabCase<S> that converts a camelCase string to kebab-case (e.g. "fooBarBaz" -> "foo-bar-baz").',
    starterCode: `type KebabCase<S extends string> = any;`,
    solution: `type KebabCase<S extends string> = S extends \`\${infer C}\${infer Rest}\` ? Rest extends Uncapitalize<Rest> ? \`\${Lowercase<C>}\${KebabCase<Rest>}\` : \`\${Lowercase<C>}-\${KebabCase<Rest>}\` : S;`,
    tests: [
      {
        description: 'Converts single camelCase word',
        typeExpression: "KebabCase<'fooBar'>",
        expectedType: "'foo-bar'"
      },
      {
        description: 'Converts multi-word identifier',
        typeExpression: "KebabCase<'doSomethingSpecial'>",
        expectedType: "'do-something-special'"
      }
    ],
    explanation: 'Recursively deconstructs string with template literal infer and checks if the remaining tail starts with an uppercase character.'
  }
];
