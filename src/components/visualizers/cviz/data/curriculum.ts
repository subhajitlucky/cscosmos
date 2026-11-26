export type CLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CCategory =
  | 'Foundations'
  | 'Control Flow'
  | 'Functions & Storage'
  | 'Arrays & Strings'
  | 'Pointers & Memory'
  | 'Aggregate Types'
  | 'Files, Bits & Utilities';

export interface CChapter {
  id: string;
  number: number;
  title: string;
  category: CCategory;
  difficulty: CLevel;
  estimatedMinutes: number;
  examWeight: 'High' | 'Medium' | 'Low';
  summary: string;
  concepts: string[];
  prerequisites: string[];
  visualizerKey?: 'pointers' | 'arrays' | 'structs' | 'file-io' | 'bitwise';
}

export const cCategories: readonly (CCategory | 'All')[] = [
  'All',
  'Foundations',
  'Control Flow',
  'Functions & Storage',
  'Arrays & Strings',
  'Pointers & Memory',
  'Aggregate Types',
  'Files, Bits & Utilities',
] as const;

export const cChapters: CChapter[] = [
  {
    id: 'c-language-basics',
    number: 1,
    title: 'C Language Basics',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    examWeight: 'High',
    summary:
      'The shape of a C program, the character set, identifiers, keywords, and the rules that make a source file valid.',
    concepts: [
      'C character set and source file structure',
      'Identifiers and naming rules',
      'ANSI C keywords and reserved words',
      'main(), functions, statements, and blocks',
      'Comments and basic program layout',
    ],
    prerequisites: [],
  },
  {
    id: 'c-data-types',
    number: 2,
    title: 'Data Types, Constants & Qualifiers',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'int, float, double, and char; constants, qualifiers, escape sequences, and the sizeof operator.',
    concepts: [
      'Data types: int, float, double, char',
      'Constants and literal types',
      'Qualifiers: long, short, unsigned, signed',
      'Escape sequences and character constants',
      'sizeof and portable size assumptions',
    ],
    prerequisites: ['c-language-basics'],
  },
  {
    id: 'operators-and-expressions',
    number: 3,
    title: 'Operators, Expressions & Preprocessor',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Arithmetic expressions, operator precedence, preprocessor directives, header files, symbolic constants, and the translation pipeline.',
    concepts: [
      'Arithmetic expressions and built-in operators',
      'Operator precedence and associativity',
      'Integer division and type promotion',
      '#include, #define, and header files',
      'Symbolic constants and comments',
      'Translation: preprocessing, compiling, assembling, linking',
    ],
    prerequisites: ['c-data-types'],
  },
  {
    id: 'console-output-input',
    number: 4,
    title: 'printf, scanf & Formatted I/O',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Format strings, conversion specifiers, width and precision, addresses in scanf, and input validation.',
    concepts: [
      'printf() and format specifiers',
      'Width, precision, and padding flags',
      'scanf() and the address-of operator',
      'Return values and input validation',
      'Common format-string mistakes',
    ],
    prerequisites: ['c-data-types'],
  },
  {
    id: 'character-string-io',
    number: 5,
    title: 'Character & String I/O',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    examWeight: 'High',
    summary:
      'getchar, putchar, getch, gets, puts, and fgets — which functions are safe, and what they return.',
    concepts: [
      'getch(), getchar(), and putchar()',
      'gets() versus fgets()',
      'puts() and newline behaviour',
      'EOF and input loops',
      'Buffer limits and safe string input',
    ],
    prerequisites: ['console-output-input'],
  },
  {
    id: 'if-else-logic',
    number: 6,
    title: 'if/else, Relational & Logical Operators',
    category: 'Control Flow',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Branch with if, if-else, nested conditions, compound relational tests, and short-circuit logical operators.',
    concepts: [
      'if statement and if-else construct',
      'Relational operators',
      'Logical operators && and ||',
      'Compound relational tests',
      'Nested if and the else-if ladder',
    ],
    prerequisites: ['operators-and-expressions'],
  },
  {
    id: 'switch-ternary',
    number: 7,
    title: 'switch, case & Ternary',
    category: 'Control Flow',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    examWeight: 'High',
    summary:
      'Select among integer cases with switch, control fall-through with break, and write compact decisions with the ternary operator.',
    concepts: [
      'switch statement and case labels',
      'break, fall-through, and default',
      'Allowed types for switch',
      'Conditional (ternary) operator',
      'Choosing between if-else and switch',
    ],
    prerequisites: ['if-else-logic'],
  },
  {
    id: 'for-while-loops',
    number: 8,
    title: 'for, while & Nested Loops',
    category: 'Control Flow',
    difficulty: 'Beginner',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Top-tested loops, loop variants, nested iteration, and how to trace a loop by hand.',
    concepts: [
      'Concept of a loop and loop control variable',
      'for loop and its variants',
      'while loop',
      'Nested for and nested while loops',
      'Tracing iteration counts',
    ],
    prerequisites: ['if-else-logic'],
    visualizerKey: 'arrays',
  },
  {
    id: 'do-while-break-continue',
    number: 9,
    title: 'do-while, break & continue',
    category: 'Control Flow',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    examWeight: 'High',
    summary:
      'Bottom-tested loops, early exit, skipping an iteration, increment/decrement operators, and choosing the right loop.',
    concepts: [
      'do-while loop and bottom-tested execution',
      'break and continue',
      'Prefix versus postfix increment/decrement',
      'Comparison between for, while, and do-while',
      'Off-by-one and infinite-loop pitfalls',
    ],
    prerequisites: ['for-while-loops'],
  },
  {
    id: 'storage-classes',
    number: 10,
    title: 'Storage Classes & Scope',
    category: 'Functions & Storage',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Automatic, register, static, and external storage classes; scope, lifetime, and linkage.',
    concepts: [
      'Automatic storage class',
      'Register storage class',
      'Static local and global variables',
      'External storage class and extern',
      'Scope, lifetime, and linkage',
    ],
    prerequisites: ['c-language-basics', 'function-interface'],
  },
  {
    id: 'arrays-1d',
    number: 11,
    title: 'One-Dimensional Arrays',
    category: 'Arrays & Strings',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Collections, contiguous storage, declaration syntax, indexing, index types, and referring to individual elements.',
    concepts: [
      'Concept of a collection and array features',
      'Types of collections supported by C',
      'Declaration syntax, dimension, and size',
      'Index variable, index type, and positional value',
      'Referring to individual elements',
      'Reading and writing elements',
    ],
    prerequisites: ['for-while-loops'],
    visualizerKey: 'arrays',
  },
  {
    id: 'array-init-bounds',
    number: 12,
    title: 'Array Initialization & Bounds',
    category: 'Arrays & Strings',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    examWeight: 'High',
    summary:
      'Initializer lists, partial initialization, size inference, bounds checking, and the undefined behaviour of an out-of-range index.',
    concepts: [
      'Array initialization and initializer lists',
      'Partial initialization and zero-fill',
      'Size inference and the size option',
      'Bounds checking in C',
      'Undefined behaviour and memory corruption',
    ],
    prerequisites: ['arrays-1d'],
    visualizerKey: 'arrays',
  },
  {
    id: 'arrays-2d',
    number: 13,
    title: 'Two-Dimensional Arrays',
    category: 'Arrays & Strings',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Rows and columns, row-major storage, nested loops, and passing a 2-D array to a function.',
    concepts: [
      'Two-dimensional array syntax',
      'Rows, columns, and dimension nesting',
      'Row-major memory layout',
      'Nested-loop traversal',
      'Passing 2-D arrays to functions',
    ],
    prerequisites: ['array-init-bounds'],
    visualizerKey: 'arrays',
  },
  {
    id: 'strings-representation',
    number: 14,
    title: 'Strings as Character Arrays',
    category: 'Arrays & Strings',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    examWeight: 'High',
    summary:
      'C has no string type. A string is a null-terminated char array, and the terminator is part of the storage.',
    concepts: [
      'Strings as null-terminated char arrays',
      'The null character and visible length',
      'String literals and char arrays',
      'String versus one-dimensional char array',
      'sizeof versus strlen',
    ],
    prerequisites: ['arrays-1d'],
  },
  {
    id: 'string-library',
    number: 15,
    title: 'String Library & Safe Input',
    category: 'Arrays & Strings',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'strlen, strcpy, strcat, strcmp, and the input functions that do or do not respect buffer size.',
    concepts: [
      'strlen(), strcpy(), strcat(), strcmp()',
      'Return conventions and comparison',
      'Destination capacity and buffer overruns',
      'fgets() and newline handling',
      'Why gets() is unsafe',
    ],
    prerequisites: ['strings-representation'],
  },
  {
    id: 'function-interface',
    number: 16,
    title: 'Function Interface & Return Values',
    category: 'Functions & Storage',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Prototypes, parameters, return values, local variables, void, and the contract between caller and callee.',
    concepts: [
      'Concept of a subprogram and its interface',
      'Arguments, parameters, and return statements',
      'Function declaration and prototypes',
      'Local variables and default return type',
      'void and functions without a return value',
    ],
    prerequisites: ['c-language-basics'],
  },
  {
    id: 'recursion',
    number: 17,
    title: 'Recursion & Iterative Subprograms',
    category: 'Functions & Storage',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Base cases, recursive calls, stack frames, and when an iterative solution is the better choice.',
    concepts: [
      'Iterative versus recursive subprograms',
      'Base case and recursive case',
      'Factorial and Fibonacci traces',
      'Stack usage and recursion depth',
      'Converting recursion to iteration',
    ],
    prerequisites: ['function-interface'],
  },
  {
    id: 'call-by-value-reference',
    number: 18,
    title: 'Call by Value vs Call by Reference',
    category: 'Functions & Storage',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    examWeight: 'High',
    summary:
      'C always passes by value. Learn how pointers simulate reference semantics and what that means for arrays and structs.',
    concepts: [
      'Call by value semantics',
      'Passing addresses to modify the caller',
      'Call by reference simulation with pointers',
      'Arrays decay to pointers when passed',
      'Return values versus output parameters',
    ],
    prerequisites: ['function-interface', 'pointer-address'],
  },
  {
    id: 'pointer-address',
    number: 19,
    title: 'Pointers, Address & Dereference',
    category: 'Pointers & Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'A pointer is an address with a type. Master the address-of operator, indirection, pointer declaration, and pointer types.',
    concepts: [
      'Pointer as an address variable',
      'Pointer data type and declaration syntax',
      'Address-of operator &',
      'Indirection operator *',
      'Pointers to different data types',
      'NULL and uninitialized pointers',
    ],
    prerequisites: ['arrays-1d', 'function-interface'],
    visualizerKey: 'pointers',
  },
  {
    id: 'pointer-arithmetic',
    number: 20,
    title: 'Pointer Arithmetic & Arrays',
    category: 'Pointers & Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Pointer arithmetic scales by the pointed-to type. Learn why a[i] equals *(a + i) and how unary ++ and -- move a pointer.',
    concepts: [
      'Pointer arithmetic and scaling',
      'Array name as a pointer',
      'Pointers and one-dimensional arrays',
      'Unary ++ and -- on pointers',
      'Bounds and one-past-the-end rules',
    ],
    prerequisites: ['pointer-address'],
    visualizerKey: 'pointers',
  },
  {
    id: 'array-of-pointers',
    number: 21,
    title: 'Array of Pointers & Command-Line Arguments',
    category: 'Pointers & Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Store several addresses in an array, build arrays of strings, and read argv from main().',
    concepts: [
      'Array of pointers',
      'Array of strings as char *names[]',
      'main(int argc, char *argv[])',
      'argv[0], argv[argc], and argument validation',
      'Pointer arrays versus two-dimensional arrays',
    ],
    prerequisites: ['pointer-arithmetic'],
    visualizerKey: 'pointers',
  },
  {
    id: 'pointers-to-pointers',
    number: 22,
    title: 'Pointers to Pointers & Pointer Types',
    category: 'Pointers & Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    examWeight: 'Medium',
    summary:
      'Follow multi-level indirection, read complex pointer declarations, and understand const-qualified pointers.',
    concepts: [
      'Pointer to a pointer (int **)',
      'Dereference chains and validity',
      'Pointer to function and pointer to array basics',
      'const and pointer constness',
      'Reading complex declarations',
    ],
    prerequisites: ['array-of-pointers'],
    visualizerKey: 'pointers',
  },
  {
    id: 'struct-declaration',
    number: 23,
    title: 'Structure Declaration & Member Access',
    category: 'Aggregate Types',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Declare a structure type, initialize structure variables, and access members with the dot operator.',
    concepts: [
      'Structure as a homogeneous and heterogeneous collection',
      'Possible applications of structures',
      'Declaration syntax and structure variables',
      'Initialization and designated initializers',
      'Member operator .',
      'Arrays as members of a structure',
    ],
    prerequisites: ['arrays-1d', 'strings-representation'],
    visualizerKey: 'structs',
  },
  {
    id: 'struct-arrays-nesting',
    number: 24,
    title: 'Arrays of Structures & Nested Structures',
    category: 'Aggregate Types',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Build collections of records, nest one structure inside another, and compare arrays with structures.',
    concepts: [
      'Arrays of structures',
      'Nested structures',
      'Anonymous structures',
      'Difference between array and structure collections',
      'Traversing an array of records',
    ],
    prerequisites: ['struct-declaration'],
    visualizerKey: 'structs',
  },
  {
    id: 'struct-pointers',
    number: 25,
    title: 'Pointers to Structures & Self-Reference',
    category: 'Aggregate Types',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Use pointers to structures, the -> operator, and self-referential nodes to build linked structures.',
    concepts: [
      'Pointer to a structure',
      'Member selector operator ->',
      'Comparison of * and ->',
      'Pointer as a member of a structure',
      'Self-referential structures and linked nodes',
    ],
    prerequisites: ['struct-declaration', 'pointer-address'],
    visualizerKey: 'structs',
  },
  {
    id: 'struct-functions-layout',
    number: 26,
    title: 'Structures in Functions & Memory Layout',
    category: 'Aggregate Types',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    examWeight: 'Medium',
    summary:
      'Pass and return structures, choose by value or by pointer, and understand padding, alignment, and layout.',
    concepts: [
      'Structures as function arguments',
      'Structures as return types',
      'Pass by value versus pass by pointer',
      'Padding and alignment',
      'sizeof and struct layout',
    ],
    prerequisites: ['struct-pointers'],
    visualizerKey: 'structs',
  },
  {
    id: 'union-syntax',
    number: 27,
    title: 'Union Syntax & Shared Memory',
    category: 'Aggregate Types',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    examWeight: 'Medium',
    summary:
      'Union members share one block of memory. Learn the syntax, size rules, and why only one member is valid at a time.',
    concepts: [
      'Union as a shared-memory collection',
      'Union declaration and use',
      'Union size and alignment',
      'Comparison of array, structure, and union',
      'Array of unions and array as a member of a union',
      'Union versus structure memory',
    ],
    prerequisites: ['struct-declaration'],
    visualizerKey: 'structs',
  },
  {
    id: 'tagged-anonymous-unions',
    number: 28,
    title: 'Tagged & Anonymous Unions',
    category: 'Aggregate Types',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    examWeight: 'Medium',
    summary:
      'Use a tag to track the active union member, save memory with union members inside structures, and read anonymous unions safely.',
    concepts: [
      'Tagged unions',
      'Union as a member of a structure',
      'Structure as a member of a union and array as a member of a union',
      'Memory saving and generic data types',
      'Anonymous unions',
    ],
    prerequisites: ['union-syntax'],
    visualizerKey: 'structs',
  },
  {
    id: 'file-pointer-modes',
    number: 29,
    title: 'FILE Pointer, fopen & Modes',
    category: 'Files, Bits & Utilities',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    examWeight: 'High',
    summary:
      'Open and close streams, choose the right mode, check for NULL, and understand the FILE handle.',
    concepts: [
      'Concept of a file and text versus binary',
      'The predefined FILE pointer and stdio.h',
      'FILE structure members and stream state',
      'fopen() modes: r, w, a, r+, rb, wb',
      'fclose() and flushing',
      'Error handling with NULL and perror',
    ],
    prerequisites: ['strings-representation'],
    visualizerKey: 'file-io',
  },
  {
    id: 'file-read-write',
    number: 30,
    title: 'Reading, Writing & EOF',
    category: 'Files, Bits & Utilities',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Read and write characters, strings, and formatted data; detect EOF correctly and handle read errors.',
    concepts: [
      'Character I/O: fgetc, getc, fputc, putc',
      'String I/O: fgets, fputs',
      'Formatted I/O: fprintf, fscanf',
      'feof and ferror semantics',
      'Reliable read loops',
    ],
    prerequisites: ['file-pointer-modes'],
    visualizerKey: 'file-io',
  },
  {
    id: 'malloc-free',
    number: 31,
    title: 'malloc, free & Heap Lifetime',
    category: 'Pointers & Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Allocate memory at runtime, check for NULL, use it through a typed pointer, and return it with free.',
    concepts: [
      'Dynamic environment and runtime memory',
      'Stack versus heap allocation',
      'malloc() and sizeof',
      'free() and pointer lifetime',
      'NULL checks and ownership',
    ],
    prerequisites: ['pointer-address'],
    visualizerKey: 'pointers',
  },
  {
    id: 'calloc-realloc',
    number: 32,
    title: 'calloc, realloc & Memory Bugs',
    category: 'Pointers & Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    examWeight: 'High',
    summary:
      'Zero-initialize allocations, resize blocks safely, and recognize leaks, double frees, and dangling pointers.',
    concepts: [
      'calloc() and zero initialization',
      'realloc() and preserving data',
      'Temporary pointers and realloc failure',
      'Memory leaks and double free',
      'Dangling pointers and NULL-after-free',
    ],
    prerequisites: ['malloc-free'],
    visualizerKey: 'pointers',
  },
  {
    id: 'bitwise-operators',
    number: 33,
    title: 'Bitwise Operators & Shifts',
    category: 'Files, Bits & Utilities',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    examWeight: 'Medium',
    summary:
      'AND, OR, XOR, NOT, left shift, and right shift — what each operator does to every bit position.',
    concepts: [
      'Bitwise AND, OR, XOR, NOT',
      'Left shift and right shift',
      'Bitwise versus logical operators',
      'Uses and limitations',
      'Unsigned arithmetic and portability',
    ],
    prerequisites: ['c-data-types'],
    visualizerKey: 'bitwise',
  },
  {
    id: 'bitwise-masks',
    number: 34,
    title: 'Masks, Flags & Bit Manipulation',
    category: 'Files, Bits & Utilities',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    examWeight: 'Medium',
    summary:
      'Set, clear, toggle, and test individual bits with masks — the foundation of flags, permissions, and registers.',
    concepts: [
      'Masks and bit positions',
      'Bitwise relational idioms',
      'Setting and clearing bits',
      'Toggling and testing bits',
      'Flags and permission bitfields',
      'Bitwise relational idioms',
    ],
    prerequisites: ['bitwise-operators'],
    visualizerKey: 'bitwise',
  },
  {
    id: 'misc-functions',
    number: 35,
    title: 'Miscellaneous Library Functions',
    category: 'Files, Bits & Utilities',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    examWeight: 'Medium',
    summary:
      'atoi, atof, atol, toupper, tolower, isalnum, isalpha, isdigit, and exit — the small tools that show up in exams.',
    concepts: [
      'atof(), atoi(), atol()',
      'toupper() and tolower()',
      'isalnum(), isalpha(), isdigit()',
      'exit() and program termination',
      'Choosing the right standard-library helper',
    ],
    prerequisites: ['c-language-basics', 'function-interface'],
  },
];

export const cChapterById = new Map(cChapters.map((chapter) => [chapter.id, chapter]));

export function getCChapter(id: string | undefined): CChapter | undefined {
  return id ? cChapterById.get(id) : undefined;
}

export function getCChapterIndex(id: string): number {
  return cChapters.findIndex((chapter) => chapter.id === id);
}

export function getAdjacentCChapters(id: string): {
  previous?: CChapter;
  next?: CChapter;
} {
  const index = getCChapterIndex(id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? cChapters[index - 1] : undefined,
    next: index < cChapters.length - 1 ? cChapters[index + 1] : undefined,
  };
}
