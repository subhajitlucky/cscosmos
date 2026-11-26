export type CProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type CProblemType = 'mcq' | 'output';

export interface CProblem {
  id: string;
  number: number;
  chapterId: string;
  title: string;
  difficulty: CProblemDifficulty;
  type: CProblemType;
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
}

export const cProblems: CProblem[] = [
  {
    id: 'valid-identifier',
    number: 1,
    chapterId: 'c-language-basics',
    title: 'Valid Identifier',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which of these is a valid C identifier?',
    options: ['2player', 'player_2', 'return', 'int'],
    answer: 1,
    explanation:
      'player_2 starts with a letter and contains only letters, digits, and an underscore. The others start with a digit or use reserved keywords.',
    hint: 'An identifier cannot start with a digit and cannot be a keyword.',
  },
  {
    id: 'escape-newline',
    number: 2,
    chapterId: 'c-data-types',
    title: 'Escape Sequence',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which escape sequence represents a newline?',
    options: ['\\n', '\\t', '\\0', '\\\\'],
    answer: 0,
    explanation:
      '\\n is the newline character, \\t is a tab, \\0 is the null character, and \\\\ is a backslash.',
    hint: 'The letter n stands for newline.',
  },
  {
    id: 'integer-division',
    number: 3,
    chapterId: 'operators-and-expressions',
    title: 'Integer Division',
    difficulty: 'Easy',
    type: 'output',
    prompt: 'What does this program print?',
    code: String.raw`#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    printf("%d\n", a / b);
    return 0;
}`,
    options: ['3.5', '3', '4', '2'],
    answer: 1,
    explanation:
      'Both operands are int, so the division is integer division. The fractional part is truncated and the program prints 3.',
    hint: 'C does not promote int to double automatically. Ask what type the result of int / int has.',
  },
  {
    id: 'scanf-address',
    number: 4,
    chapterId: 'console-output-input',
    title: 'Reading an Integer Safely',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which call correctly reads an integer into the variable n?',
    options: ['scanf("%d", n);', 'scanf("%d", &n);', 'scanf("%f", &n);', 'scanf("%c", n);'],
    answer: 1,
    explanation:
      'scanf needs the address of the destination object. The %d conversion expects an int *, so pass &n.',
    hint: 'scanf does not receive a value; it receives the location where the value should be stored.',
  },
  {
    id: 'safe-line-input',
    number: 5,
    chapterId: 'character-string-io',
    title: 'Reading a Line Safely',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which function safely reads a line into a sized buffer?',
    options: ['gets', 'fgets', 'scanf("%s")', 'getchar'],
    answer: 1,
    explanation:
      'fgets(buffer, size, stdin) reads at most size - 1 characters and always terminates the buffer. gets cannot know the destination size.',
    hint: 'Look for the function that takes a buffer and a size.',
  },
  {
    id: 'short-circuit',
    number: 6,
    chapterId: 'if-else-logic',
    title: 'Short-Circuit Logic',
    difficulty: 'Medium',
    type: 'output',
    prompt: 'What is printed?',
    code: String.raw`int x = 0;
if (x != 0 && 10 / x > 1) {
    printf("A");
} else {
    printf("B");
}`,
    options: ['A', 'B', 'Nothing', 'Division by zero'],
    answer: 1,
    explanation:
      'The left operand x != 0 is false, so && short-circuits and the division is never evaluated. The else branch prints B.',
    hint: 'Does && evaluate its right operand when the left operand is false?',
  },
  {
    id: 'switch-fallthrough',
    number: 7,
    chapterId: 'switch-ternary',
    title: 'Switch Fall-Through',
    difficulty: 'Medium',
    type: 'output',
    prompt: 'What is printed when choice is 2?',
    code: String.raw`switch (choice) {
case 1:
    printf("one ");
case 2:
    printf("two ");
case 3:
    printf("three ");
    break;
default:
    printf("other ");
}`,
    options: ['two ', 'two three ', 'one two three ', 'other '],
    answer: 1,
    explanation:
      'Execution enters at case 2, prints "two ", and falls through into case 3 because case 2 has no break. It prints "three " and then stops at the break.',
    hint: 'Find the matching case label, then follow execution downward until a break or the end of the switch.',
  },
  {
    id: 'loop-output',
    number: 8,
    chapterId: 'for-while-loops',
    title: 'Loop Output',
    difficulty: 'Easy',
    type: 'output',
    prompt: 'What does this loop print?',
    code: String.raw`for (int i = 0; i < 4; i++) {
    printf("%d", i);
}`,
    options: ['1234', '0123', '01234', '123'],
    answer: 1,
    explanation:
      'i starts at 0 and the loop runs while i < 4, so the body executes for 0, 1, 2, and 3. The output is 0123.',
    hint: 'List the values of i for each iteration, including the first and last.',
  },
  {
    id: 'do-while-once',
    number: 9,
    chapterId: 'do-while-break-continue',
    title: 'Bottom-Tested Loop',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How many times does the body of this loop execute?',
    code: String.raw`int i = 10;
do {
    printf("%d ", i);
} while (i < 5);`,
    options: ['Zero times', 'Once', 'Five times', 'Forever'],
    answer: 1,
    explanation:
      'A do-while checks its condition after the body. The body runs once, prints 10, and then the condition 10 < 5 is false, so the loop stops.',
    hint: 'The condition is tested after the body, not before it.',
  },
  {
    id: 'static-counter',
    number: 10,
    chapterId: 'storage-classes',
    title: 'Static Local Counter',
    difficulty: 'Medium',
    type: 'output',
    prompt: 'What does main print?',
    code: String.raw`int next_id(void) {
    static int id = 0;
    return ++id;
}

int main(void) {
    printf("%d ", next_id());
    printf("%d ", next_id());
    printf("%d\n", next_id());
    return 0;
}`,
    options: ['1 2 3', '1 1 1', '0 1 2', '3 3 3'],
    answer: 0,
    explanation:
      'The static local id is initialized once and keeps its value between calls. Each call increments it, so the output is 1 2 3.',
    hint: 'A static local is not reinitialized on every call. Track the value across all three calls.',
  },
  {
    id: 'array-valid-index',
    number: 11,
    chapterId: 'arrays-1d',
    title: 'Valid Array Index',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What are the valid indexes for int a[5];?',
    options: ['1 through 5', '0 through 4', '0 through 5', '1 through 4'],
    answer: 1,
    explanation:
      'C arrays are zero-indexed, so a five-element array has valid indexes 0, 1, 2, 3, and 4.',
    hint: 'The first element is at index 0, and the last is at size - 1.',
  },
  {
    id: 'array-partial-init',
    number: 12,
    chapterId: 'array-init-bounds',
    title: 'Partial Array Initialization',
    difficulty: 'Easy',
    type: 'output',
    prompt: 'What is printed?',
    code: String.raw`int a[5] = {10, 20};
printf("%d %d\n", a[1], a[4]);`,
    options: ['20 0', '20 5', '10 0', '20 garbage'],
    answer: 0,
    explanation:
      'The first two elements receive 10 and 20. The remaining elements are zero-initialized, so a[4] is 0.',
    hint: 'When an initializer list is shorter than the array, C fills the rest with zeroes.',
  },
  {
    id: 'array-2d-size',
    number: 13,
    chapterId: 'arrays-2d',
    title: 'Two-Dimensional Size',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How many elements does int a[3][4]; contain?',
    options: ['7', '12', '3', '4'],
    answer: 1,
    explanation:
      'The array has 3 rows and 4 columns, so it contains 3 × 4 = 12 elements.',
    hint: 'Multiply the number of rows by the number of columns.',
  },
  {
    id: 'string-sizeof',
    number: 14,
    chapterId: 'strings-representation',
    title: 'String Storage',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How many bytes does the array char s[] = "cat"; occupy?',
    options: ['3', '4', '5', 'It depends on the compiler'],
    answer: 1,
    explanation:
      'The array stores c, a, t, and the null terminator, so its size is four bytes. strlen would return three, but sizeof includes the terminator.',
    hint: 'A C string always needs one extra byte for the null character.',
  },
  {
    id: 'strcmp-result',
    number: 15,
    chapterId: 'string-library',
    title: 'String Comparison',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does strcmp("apple", "apple") return?',
    options: ['1', '-1', '0', 'The length'],
    answer: 2,
    explanation:
      'strcmp returns zero when the two strings are equal. A positive or negative value indicates the lexicographic ordering.',
    hint: 'Zero means equal for strcmp.',
  },
  {
    id: 'prototype-purpose',
    number: 16,
    chapterId: 'function-interface',
    title: 'Prototype Purpose',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the purpose of a function prototype?',
    options: [
      'To execute the function',
      'To tell the compiler the function signature before it is used',
      'To allocate local variables',
      'To link the function',
    ],
    answer: 1,
    explanation:
      'A prototype declares the return type and parameter types so the compiler can check calls before the definition appears.',
    hint: 'A prototype is a declaration, not a definition.',
  },
  {
    id: 'recursion-base',
    number: 17,
    chapterId: 'recursion',
    title: 'Recursion Base Case',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which part of a recursive function prevents infinite recursion?',
    options: ['The return type', 'The base case', 'The prototype', 'The stack'],
    answer: 1,
    explanation:
      'The base case stops the recursion when the input reaches a terminating condition.',
    hint: 'Every recursive function needs a condition that does not recurse.',
  },
  {
    id: 'call-by-value',
    number: 18,
    chapterId: 'call-by-value-reference',
    title: 'Call by Value',
    difficulty: 'Medium',
    type: 'output',
    prompt: 'What does main print?',
    code: String.raw`void bump(int n) {
    n = n + 1;
}

int main(void) {
    int x = 5;
    bump(x);
    printf("%d\n", x);
    return 0;
}`,
    options: ['5', '6', '0', 'Undefined'],
    answer: 0,
    explanation:
      'C passes x by value. bump receives a copy, increments the copy, and the original x remains 5.',
    hint: 'Ask whether the function receives the variable itself or a copy of its value.',
  },
  {
    id: 'address-dereference',
    number: 19,
    chapterId: 'pointer-address',
    title: 'Write Through a Pointer',
    difficulty: 'Medium',
    type: 'output',
    prompt: 'What is printed?',
    code: String.raw`int x = 7;
int *p = &x;
*p = 9;
printf("%d\n", x);`,
    options: ['7', '9', '0', 'The address of x'],
    answer: 1,
    explanation:
      'p stores the address of x. Dereferencing p with *p gives access to x, so *p = 9 changes x to 9.',
    hint: 'The pointer and the variable refer to the same object.',
  },
  {
    id: 'pointer-arithmetic',
    number: 20,
    chapterId: 'pointer-arithmetic',
    title: 'Pointer Arithmetic',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'If int *p holds address 1000 and sizeof(int) is 4, what address does p + 1 hold?',
    options: ['1001', '1004', '1000 + sizeof(int *)', 'Undefined'],
    answer: 1,
    explanation:
      'Pointer arithmetic is scaled by the pointed-to type. One int is four bytes, so p + 1 advances by four bytes to 1004.',
    hint: 'The compiler multiplies the integer offset by the size of the pointed-to type.',
  },
  {
    id: 'argv-zero',
    number: 21,
    chapterId: 'array-of-pointers',
    title: 'Command-Line Arguments',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is argv[0]?',
    options: ['The first user argument', 'The program name', 'NULL', 'The argument count'],
    answer: 1,
    explanation:
      'argv[0] is the name used to invoke the program; user arguments start at argv[1].',
    hint: 'The argument count is argc; the array of argument strings is argv.',
  },
  {
    id: 'double-dereference',
    number: 22,
    chapterId: 'pointers-to-pointers',
    title: 'Double Dereference',
    difficulty: 'Medium',
    type: 'output',
    prompt: 'What is printed?',
    code: String.raw`int x = 42;
int *p = &x;
int **pp = &p;
printf("%d\n", **pp);`,
    options: ['The address of x', 'The address of p', '42', 'NULL'],
    answer: 2,
    explanation:
      'pp points to p, and p points to x. One dereference follows pp to p; the second follows p to x, so **pp is 42.',
    hint: 'Follow the chain one level at a time: pp -> p -> x.',
  },
  {
    id: 'struct-member-access',
    number: 23,
    chapterId: 'struct-declaration',
    title: 'Structure Member Access',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'If s is a struct Student object, which expression accesses its name member?',
    options: ['s->name', 's.name', '*s.name', '&s.name'],
    answer: 1,
    explanation:
      'The dot operator accesses a member of a structure object. The arrow operator is for pointers to structures.',
    hint: 'Use a dot for an object and an arrow for a pointer.',
  },
  {
    id: 'struct-array-access',
    number: 24,
    chapterId: 'struct-arrays-nesting',
    title: 'Array of Structures',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'If students is an array of struct Student, how do you access the name of the second student?',
    options: ['students.name[1]', 'students[1].name', 'students[1]->name', 'students->name[1]'],
    answer: 1,
    explanation:
      'First index the array, then use the dot operator to access the member: students[1].name.',
    hint: 'Array indexing comes first, then member access.',
  },
  {
    id: 'struct-arrow',
    number: 25,
    chapterId: 'struct-pointers',
    title: 'Access Through a Pointer',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'If p is a pointer to struct Node, which expression accesses its value member?',
    options: ['p.value', 'p->value', '*p.value', '&p.value'],
    answer: 1,
    explanation:
      'The -> operator dereferences the pointer and accesses the member: p->value is equivalent to (*p).value.',
    hint: 'A dot needs a structure object; an arrow needs a pointer to a structure.',
  },
  {
    id: 'struct-padding',
    number: 26,
    chapterId: 'struct-functions-layout',
    title: 'Structure Padding',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the most likely sizeof(struct Example) on a typical system?',
    code: String.raw`struct Example {
    char c;
    int i;
};`,
    options: ['5', '8', '4', '1'],
    answer: 1,
    explanation:
      'The char occupies one byte, but the compiler usually inserts padding so the int starts at a four-byte boundary. The total is commonly eight bytes. The exact size is implementation-defined.',
    hint: 'Alignment can insert unused bytes between members.',
  },
  {
    id: 'union-size',
    number: 27,
    chapterId: 'union-syntax',
    title: 'Union Memory',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is sizeof(union Value) for the union below?',
    code: String.raw`union Value {
    int i;      /* 4 bytes */
    double d;   /* 8 bytes */
};`,
    options: ['4', '8', '12', '16'],
    answer: 1,
    explanation:
      'Union members overlap in memory, so the union is at least as large as its largest member. The double is eight bytes, so the union is eight bytes (before any alignment padding).',
    hint: 'A union does not add the sizes of its members; it shares one block.',
  },
  {
    id: 'union-tag-purpose',
    number: 28,
    chapterId: 'tagged-anonymous-unions',
    title: 'Tagged Union',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the purpose of the tag in a tagged union?',
    options: ['To align the union', 'To record which member is active', 'To allocate memory', 'To sort the members'],
    answer: 1,
    explanation:
      'The tag stores which alternative is currently valid so the program can read the correct union member.',
    hint: 'A raw union does not remember which member was last written.',
  },
  {
    id: 'fopen-failure',
    number: 29,
    chapterId: 'file-pointer-modes',
    title: 'Detecting fopen Failure',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does fopen return when it cannot open a file?',
    options: ['0', 'NULL', 'EOF', '-1'],
    answer: 1,
    explanation:
      'fopen returns a null pointer on failure. Always compare the result with NULL before using the FILE pointer.',
    hint: 'It returns a pointer, so failure is represented by a null pointer.',
  },
  {
    id: 'feof-semantics',
    number: 30,
    chapterId: 'file-read-write',
    title: 'EOF Semantics',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does feof(fp) report?',
    options: [
      'That the next read will fail',
      'That a previous read already reached EOF',
      'The current file position',
      'The file size',
    ],
    answer: 1,
    explanation:
      'feof becomes true only after a read has attempted to go past the end of the file. Loop on the read function return value, not on feof.',
    hint: 'feof is a report about the past, not a prediction about the next read.',
  },
  {
    id: 'malloc-failure',
    number: 31,
    chapterId: 'malloc-free',
    title: 'malloc Failure',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does malloc return when it cannot satisfy a request?',
    options: ['0 bytes', 'NULL', 'EOF', '-1'],
    answer: 1,
    explanation:
      'malloc returns a null pointer on failure. Check the result before using the block.',
    hint: 'malloc returns a pointer; failure is a null pointer.',
  },
  {
    id: 'calloc-zero',
    number: 32,
    chapterId: 'calloc-realloc',
    title: 'Zero-Initialized Allocation',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which allocation function zero-initializes the returned memory?',
    options: ['malloc', 'calloc', 'realloc', 'free'],
    answer: 1,
    explanation:
      'calloc(count, size) allocates space for count objects and sets every byte to zero. malloc leaves the memory uninitialized.',
    hint: 'The name calloc stands for contiguous allocation and it clears the block.',
  },
  {
    id: 'bitwise-and',
    number: 33,
    chapterId: 'bitwise-operators',
    title: 'Bitwise AND',
    difficulty: 'Medium',
    type: 'output',
    prompt: 'What is printed in decimal?',
    code: String.raw`unsigned a = 12;  /* binary 1100 */
unsigned b = 10;  /* binary 1010 */
printf("%u\n", a & b);`,
    options: ['14', '8', '6', '2'],
    answer: 1,
    explanation:
      'AND keeps a bit only when both operands have a 1: 1100 & 1010 = 1000, which is 8 in decimal.',
    hint: 'Write both operands with four bits and compare each column.',
  },
  {
    id: 'set-bit-two',
    number: 34,
    chapterId: 'bitwise-masks',
    title: 'Setting a Bit',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which expression sets bit 2 of x while leaving the other bits unchanged?',
    options: ['x |= (1u << 2);', 'x &= (1u << 2);', 'x ^= (1u << 2);', 'x = ~(1u << 2);'],
    answer: 0,
    explanation:
      'OR with a mask that has a 1 in bit 2 sets that bit. AND would clear the other bits, XOR would toggle, and assignment would replace the value.',
    hint: 'Which bitwise operator copies a 1 into the result when the mask has a 1?',
  },
  {
    id: 'atoi-prefix',
    number: 35,
    chapterId: 'misc-functions',
    title: 'atoi Stops at Non-Digits',
    difficulty: 'Easy',
    type: 'output',
    prompt: 'What does atoi("12abc") return?',
    code: String.raw`printf("%d\n", atoi("12abc"));`,
    options: ['12', '0', 'Error', 'abc'],
    answer: 0,
    explanation:
      'atoi skips leading whitespace, converts the leading numeric characters, and stops at the first character that cannot be part of a number. It returns 12.',
    hint: 'atoi does not validate the whole string; it stops as soon as the number ends.',
  },
  {
    id: 'escape-and-float',
    number: 36,
    chapterId: 'c-data-types',
    title: 'Escape & Float Constants',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which statement about C constants is correct?',
    options: [
      '19.95 is a float constant',
      '19.95f is a float constant',
      '19.95L is a float constant',
      "'f' is a float constant",
    ],
    answer: 1,
    explanation:
      'The f suffix makes a floating literal float. Without a suffix it is double; L makes it long double; and \'f\' is a character constant.',
    hint: 'Look at the suffix on the floating literal.',
  },
  {
    id: 'array-element-count',
    number: 37,
    chapterId: 'arrays-1d',
    title: 'Array Element Count',
    difficulty: 'Easy',
    type: 'output',
    prompt: 'What is printed on a platform where sizeof(int) is 4?',
    code: String.raw`int a[5];
printf("%zu\n", sizeof(a) / sizeof(a[0]));`,
    options: ['5', '4', '20', '1'],
    answer: 0,
    explanation:
      'sizeof(a) is the size of the whole array (20 bytes), and sizeof(a[0]) is the size of one element (4 bytes). Their quotient is the element count: 5.',
    hint: 'Divide the size of the array by the size of one element.',
  },
  {
    id: 'recursion-vs-iteration',
    number: 38,
    chapterId: 'recursion',
    title: 'Recursion vs Iteration',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which statement is true about recursive and iterative subprograms?',
    options: [
      'Recursion always uses less memory',
      'Iteration can replace recursion, but may need an explicit stack',
      'Recursion does not need a base case',
      'Iteration cannot return a value',
    ],
    answer: 1,
    explanation:
      'Recursion and iteration are equivalent in power. An iterative version can replace a recursive one, but it may need an explicit stack to remember pending work.',
    hint: 'Think about how each version stores pending work.',
  },
  {
    id: 'union-active-member',
    number: 39,
    chapterId: 'tagged-anonymous-unions',
    title: 'Active Union Member',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'After this code runs, which union member is the active representation?',
    code: String.raw`union Payload {
    struct { int x, y; } point;
    char raw[16];
};

struct Variant {
    enum { POINT, RAW } tag;
    union Payload value;
} v;

v.tag = POINT;
v.value.point.x = 3;`,
    options: ['point', 'raw', 'Both point and raw', 'None'],
    answer: 0,
    explanation:
      'The last write was through v.value.point.x, so the point structure is the active representation. The tag records that choice; raw is not valid until it is written and the tag is updated.',
    hint: 'The union stores one representation at a time; the last write decides which one.',
  },
  {
    id: 'file-position',
    number: 40,
    chapterId: 'file-pointer-modes',
    title: 'File Positioning',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which pair reports and changes the current file position?',
    options: ['ftell / fseek', 'feof / ferror', 'fgetc / fputc', 'fopen / fclose'],
    answer: 0,
    explanation:
      'ftell returns the current position, and fseek moves it. rewind returns to the beginning. feof and ferror report state, and fgetc/fputc read and write characters.',
    hint: 'Look for the tell/seek pair.',
  },
  {
    id: 'mask-all-bits',
    number: 41,
    chapterId: 'bitwise-masks',
    title: 'Testing All Masked Bits',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which expression is true only when both the READ and WRITE bits are set?',
    code: String.raw`#define READ  (1u << 0)
#define WRITE (1u << 1)`,
    options: [
      '(perms & READ) != 0',
      '(perms & (READ | WRITE)) == (READ | WRITE)',
      '(perms & READ) == 0',
      '(perms | WRITE) == 0',
    ],
    answer: 1,
    explanation:
      'The first expression tests only READ. The second masks both bits and requires the result to contain both bits, so it is true only when READ and WRITE are both set.',
    hint: 'To require all bits, compare the masked value against the full mask.',
  },
];

export const cProblemById = new Map(cProblems.map((problem) => [problem.id, problem]));

export function getCProblem(id: string | undefined): CProblem | undefined {
  return id ? cProblemById.get(id) : undefined;
}

export function getAdjacentCProblems(id: string): {
  previous?: CProblem;
  next?: CProblem;
} {
  const index = cProblems.findIndex((problem) => problem.id === id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? cProblems[index - 1] : undefined,
    next: index < cProblems.length - 1 ? cProblems[index + 1] : undefined,
  };
}
