/**
 * Playground utilities for TypeScript compilation and code execution
 *
 * This module provides utilities for:
 * - TypeScript code compilation
 * - Error parsing and formatting
 * - Code execution simulation
 */
import * as ts from "typescript";

const DIAGNOSTIC_PRELUDE = `declare const console: {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};
declare function setTimeout(handler: (...args: unknown[]) => void, timeout?: number, ...args: unknown[]): number;
declare function clearTimeout(handle?: number): void;
declare function setInterval(handler: (...args: unknown[]) => void, timeout?: number, ...args: unknown[]): number;
declare function clearInterval(handle?: number): void;`;

export interface CompilationResult {
  success: boolean;
  output?: string;
  errors: CompilationError[];
  warnings: CompilationError[];
}

export interface CompilationError {
  message: string;
  line?: number;
  column?: number;
  code?: string;
}

/**
 * Example code snippets for the playground
 */
export const exampleSnippets = {
  basic: {
    name: "Basic Types",
    code: `// Basic TypeScript types
let language: string = "TypeScript";
let years: number = 10;
let isActive: boolean = true;

console.log(\`Language: \${language}, Years: \${years}, Active: \${isActive}\`);`,
  },
  functions: {
    name: "Functions",
    code: `// Function with type annotations
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Arrow function
const add = (a: number, b: number): number => {
  return a + b;
};

console.log(greet("World"));
console.log(\`Sum: \${add(5, 3)}\`);`,
  },
  interfaces: {
    name: "Interfaces",
    code: `// Interface definition
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

// Using the interface
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true
};

console.log(user);`,
  },
  classes: {
    name: "Classes",
    code: `// Class with constructor and methods
class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  public speak(): void {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Dog extends Animal {
  public speak(): void {
    console.log(\`\${this.name} barks\`);
  }
}

const dog = new Dog("Buddy");
dog.speak();`,
  },
  generics: {
    name: "Generics",
    code: `// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic class
class Box<T> {
  private value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
}

const numberBox = new Box<number>(42);
const stringBox = new Box<string>("Hello");

console.log(numberBox.getValue());
console.log(stringBox.getValue());`,
  },
  async: {
    name: "Async/Await",
    code: `// Async function example
async function fetchData(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data fetched successfully!");
    }, 1000);
  });
}

async function main() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();`,
  },
};

export type ExampleKey = keyof typeof exampleSnippets;

export async function checkTypeScriptSyntax(code: string): Promise<CompilationResult> {
  const errors: CompilationError[] = [];
  const warnings: CompilationError[] = [];
  let output = "";

  // Basic string-based lint: flag raw 'any' without comment
  code.split("\n").forEach((line, index) => {
    const lineNum = index + 1;
    if (line.includes("any") && !line.trim().startsWith("//")) {
      warnings.push({
        message: "Consider using a more specific type instead of 'any'",
        line: lineNum,
      });
    }
  });

  // TypeScript diagnostics (as a module to avoid DOM global name collisions)
  const diagnostics = getDiagnostics(code);
  diagnostics.forEach((d) => errors.push(d));

  // Only attempt execution if we have no diagnostics
  if (errors.length === 0) {
    const runtimeSource = wrapForRuntime(code);
    const { js } = transpileToJs(runtimeSource, { includeDiagnostics: false, fileName: "playground-runtime.ts" });

    try {
      output = await executeJavaScript(js);
    } catch (error) {
      errors.push({
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    success: errors.length === 0,
    output: output || (errors.length ? "" : "No output"),
    errors,
    warnings,
  };
}

export function formatError(error: CompilationError): string {
  if (error.line && error.column) {
    return `Line ${error.line}, Column ${error.column}: ${error.message}`;
  } else if (error.line) {
    return `Line ${error.line}: ${error.message}`;
  }
  return error.message;
}

function transpileToJs(
  code: string,
  opts?: { includeDiagnostics?: boolean; fileName?: string }
): { js: string; diagnostics: CompilationError[] } {
  const fileName = opts?.fileName ?? "playground.ts";
  const sourceFile = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
      noLib: false,
      lib: ["es2020"],
    },
    reportDiagnostics: opts?.includeDiagnostics ?? true,
    fileName,
  });

  const diagnostics: CompilationError[] =
    transpiled.diagnostics?.map((diag) => {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start ?? 0);
      return {
        message: ts.flattenDiagnosticMessageText(diag.messageText, "\n"),
        line: line + 1,
        column: character + 1,
        code: diag.code.toString(),
      };
    }) ?? [];

  return { js: transpiled.outputText, diagnostics };
}

function getDiagnostics(code: string): CompilationError[] {
  const preludeLines = DIAGNOSTIC_PRELUDE.split("\n").length;
  const moduleCode = `${DIAGNOSTIC_PRELUDE}\n${code}\nexport {};`;
  const { diagnostics } = transpileToJs(moduleCode, { includeDiagnostics: true, fileName: "playground.ts" });

  return (
    diagnostics
      // Shift line numbers to align with user code (remove prelude offset)
      .map((d) => ({
        ...d,
        line: typeof d.line === "number" ? d.line - preludeLines : d.line,
      }))
      // Drop diagnostics that only reference the synthetic export or prelude
      .filter((d) => !d.line || d.line > 0)
  );
}

function wrapForRuntime(code: string): string {
  // Allow top-level await by wrapping in an async IIFE
  return `(async () => {\n${code}\n})();`;
}

async function executeJavaScript(js: string): Promise<string> {
  const logs: string[] = [];
  const pending: Promise<unknown>[] = [];

  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(stringifyArgs(args)),
    info: (...args: unknown[]) => logs.push(stringifyArgs(args)),
    warn: (...args: unknown[]) => logs.push(`[warn] ${stringifyArgs(args)}`),
    error: (...args: unknown[]) => logs.push(`[error] ${stringifyArgs(args)}`),
  };

  const sandboxSetTimeout = (fn: (...args: unknown[]) => unknown, delay = 0, ...args: unknown[]) => {
    const p = new Promise<void>((resolve) => {
      globalThis.setTimeout(() => {
        Promise.resolve()
          .then(() => fn(...args))
          .catch((err) => logs.push(`[error] ${stringifyValue(err)}`))
          .finally(() => resolve());
      }, delay);
    });
    pending.push(p);
    return pending.length;
  };

  const runner = new Function(
    "console",
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    `"use strict";${js}`
  );

  const result = runner(
    sandboxConsole,
    sandboxSetTimeout,
    () => undefined,
    sandboxSetTimeout,
    () => undefined
  );

  if (result instanceof Promise) {
    pending.push(result);
  }

  const timeout = new Promise<never>((_, reject) =>
    globalThis.setTimeout(() => reject(new Error("Execution timed out")), 2000)
  );

  if (pending.length > 0) {
    await Promise.race([Promise.allSettled(pending), timeout]);
  }

  return logs.length > 0 ? logs.join("\n") : "No output";
}

function stringifyArgs(args: unknown[]): string {
  return args.map(stringifyValue).join(" ");
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
