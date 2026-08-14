export interface TsErrorItem {
  code: string;
  title: string;
  errorMessage: string;
  badCode: string;
  goodCode: string;
  explanation: string;
}

export const TS_ERRORS: TsErrorItem[] = [
  {
    code: 'TS2322',
    title: 'Type is not assignable to type',
    errorMessage: "Type 'string' is not assignable to type 'number'.",
    badCode: `let age: number = 25;\nage = "26"; // ❌ TS2322`,
    goodCode: `let age: number = 25;\nage = 26; // ✅ Correct numeric assignment`,
    explanation: 'TypeScript prevents assigning a value whose type does not match or subtype the declared variable type.'
  },
  {
    code: 'TS2339',
    title: 'Property does not exist on type',
    errorMessage: "Property 'email' does not exist on type 'User'.",
    badCode: `interface User { id: string; name: string; }\nconst u: User = { id: '1', name: 'Bob' };\nconsole.log(u.email); // ❌ TS2339`,
    goodCode: `interface User { id: string; name: string; email?: string; }\nconst u: User = { id: '1', name: 'Bob' };\nconsole.log(u.email); // ✅ Optional property declared`,
    explanation: 'Accessing properties that were not declared on the interface/type contract triggers TS2339 to prevent runtime undefined errors.'
  },
  {
    code: 'TS2571',
    title: 'Object is of type unknown',
    errorMessage: "Object is of type 'unknown'.",
    badCode: `function handle(data: unknown) {\n  console.log(data.trim()); // ❌ TS2571\n}`,
    goodCode: `function handle(data: unknown) {\n  if (typeof data === 'string') {\n    console.log(data.trim()); // ✅ Narrowed via typeof\n  }\n}`,
    explanation: '"unknown" is the type-safe counterpart of "any". You must perform type narrowing before performing any operations on it.'
  },
  {
    code: 'TS2345',
    title: 'Argument type not assignable to parameter',
    errorMessage: "Argument of type 'string | null' is not assignable to parameter of type 'string'.",
    badCode: `function greet(name: string) {}\nconst input: string | null = null;\ngreet(input); // ❌ TS2345 (strictNullChecks)`,
    goodCode: `function greet(name: string) {}\nconst input: string | null = null;\nif (input !== null) {\n  greet(input); // ✅ Null-checked\n}`,
    explanation: 'When strictNullChecks is enabled (default in modern tsconfig), null and undefined must be explicitly handled before calling functions.'
  },
  {
    code: 'TS7053',
    title: 'Element implicitly has an any type',
    errorMessage: "Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Config'.",
    badCode: `const config = { theme: 'dark', lang: 'en' };\nfunction get(key: string) {\n  return config[key]; // ❌ TS7053\n}`,
    goodCode: `const config = { theme: 'dark', lang: 'en' };\nfunction get(key: keyof typeof config) {\n  return config[key]; // ✅ Keyof constraint\n}`,
    explanation: 'Indexing an object with an arbitrary string is dangerous because the key might not exist. Constrain the key with keyof typeof.'
  }
];
