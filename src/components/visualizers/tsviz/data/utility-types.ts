export interface UtilityTypeDoc {
  id: string;
  name: string;
  category: 'Objects' | 'Unions' | 'Functions' | 'Async';
  description: string;
  definition: string;
  exampleInput: string;
  exampleOutput: string;
}

export const UTILITY_TYPES: UtilityTypeDoc[] = [
  {
    id: 'partial',
    name: 'Partial<T>',
    category: 'Objects',
    description: 'Constructs a type with all properties of T set to optional.',
    definition: 'type Partial<T> = { [P in keyof T]?: T[P]; };',
    exampleInput: 'interface User { id: string; name: string; email: string; }',
    exampleOutput: 'type Result = Partial<User>;\n// { id?: string; name?: string; email?: string; }'
  },
  {
    id: 'required',
    name: 'Required<T>',
    category: 'Objects',
    description: 'Constructs a type with all properties of T set to required (removes ?).',
    definition: 'type Required<T> = { [P in keyof T]-?: T[P]; };',
    exampleInput: 'interface Config { host?: string; port?: number; }',
    exampleOutput: 'type Result = Required<Config>;\n// { host: string; port: number; }'
  },
  {
    id: 'readonly',
    name: 'Readonly<T>',
    category: 'Objects',
    description: 'Constructs a type with all properties of T set to readonly (cannot be reassigned).',
    definition: 'type Readonly<T> = { readonly [P in keyof T]: T[P]; };',
    exampleInput: 'interface Todo { title: string; done: boolean; }',
    exampleOutput: 'type Result = Readonly<Todo>;\n// { readonly title: string; readonly done: boolean; }'
  },
  {
    id: 'record',
    name: 'Record<Keys, Type>',
    category: 'Objects',
    description: 'Constructs an object type whose property keys are Keys and whose property values are Type.',
    definition: 'type Record<K extends keyof any, T> = { [P in K]: T; };',
    exampleInput: 'type Role = "admin" | "editor" | "viewer";',
    exampleOutput: 'type RolePermissions = Record<Role, string[]>;\n// { admin: string[]; editor: string[]; viewer: string[]; }'
  },
  {
    id: 'pick',
    name: 'Pick<T, Keys>',
    category: 'Objects',
    description: 'Constructs a type by picking the set of properties Keys from T.',
    definition: 'type Pick<T, K extends keyof T> = { [P in K]: T[P]; };',
    exampleInput: 'interface Article { id: string; title: string; body: string; createdAt: Date; }',
    exampleOutput: 'type ArticlePreview = Pick<Article, "id" | "title">;\n// { id: string; title: string; }'
  },
  {
    id: 'omit',
    name: 'Omit<T, Keys>',
    category: 'Objects',
    description: 'Constructs a type by picking all properties from T and then removing Keys.',
    definition: 'type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;',
    exampleInput: 'interface UserAccount { id: string; name: string; passwordHash: string; }',
    exampleOutput: 'type PublicUser = Omit<UserAccount, "passwordHash">;\n// { id: string; name: string; }'
  },
  {
    id: 'exclude',
    name: 'Exclude<UnionType, ExcludedMembers>',
    category: 'Unions',
    description: 'Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers.',
    definition: 'type Exclude<T, U> = T extends U ? never : T;',
    exampleInput: 'type Status = "pending" | "active" | "archived" | "deleted";',
    exampleOutput: 'type ActiveStatus = Exclude<Status, "archived" | "deleted">;\n// "pending" | "active"'
  },
  {
    id: 'extract',
    name: 'Extract<Type, Union>',
    category: 'Unions',
    description: 'Constructs a type by extracting from Type all union members that are assignable to Union.',
    definition: 'type Extract<T, U> = T extends U ? T : never;',
    exampleInput: 'type Mixed = string | number | (() => void) | boolean;',
    exampleOutput: 'type FunctionsOnly = Extract<Mixed, Function>;\n// () => void'
  },
  {
    id: 'nonnullable',
    name: 'NonNullable<T>',
    category: 'Unions',
    description: 'Constructs a type by excluding null and undefined from T.',
    definition: 'type NonNullable<T> = T & {};',
    exampleInput: 'type MaybeString = string | null | undefined;',
    exampleOutput: 'type SafeString = NonNullable<MaybeString>;\n// string'
  },
  {
    id: 'returntype',
    name: 'ReturnType<Type>',
    category: 'Functions',
    description: 'Constructs a type consisting of the return type of function Type.',
    definition: 'type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;',
    exampleInput: 'function createUser() { return { id: 1, name: "Alice", active: true }; }',
    exampleOutput: 'type User = ReturnType<typeof createUser>;\n// { id: number; name: string; active: boolean; }'
  },
  {
    id: 'parameters',
    name: 'Parameters<Type>',
    category: 'Functions',
    description: 'Constructs a tuple type from the types used in the parameters of a function type Type.',
    definition: 'type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;',
    exampleInput: 'function sendEmail(to: string, subject: string, retries: number) {}',
    exampleOutput: 'type EmailArgs = Parameters<typeof sendEmail>;\n// [to: string, subject: string, retries: number]'
  },
  {
    id: 'awaited',
    name: 'Awaited<Type>',
    category: 'Async',
    description: 'Models operations like await in async functions, recursively unwrapping Promises.',
    definition: 'type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;',
    exampleInput: 'type AsyncData = Promise<Promise<{ token: string }>>;',
    exampleOutput: 'type FinalData = Awaited<AsyncData>;\n// { token: string }'
  }
];
