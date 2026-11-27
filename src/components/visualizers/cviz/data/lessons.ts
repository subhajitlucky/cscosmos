export interface CLessonSection {
  title: string;
  body: string;
  code?: string;
}

export interface CLessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

import type { CWalkthrough } from './walkthrough-types';

export interface CLesson {
  chapterId: string;
  hook: string;
  walkthrough?: CWalkthrough;
  sections: CLessonSection[];
  keyTakeaways: string[];
  pitfalls: string[];
  examTips: string[];
  quiz: CLessonQuiz[];
}

export const cLessons: Record<string, CLesson> = {
  'c-language-basics': {
    chapterId: 'c-language-basics',
    hook:
      'C is small enough to learn completely and close enough to the machine that every line has a cost. Start with the shape of a source file.',
    sections: [
      {
        title: 'A program is a collection of functions',
        body:
          'Execution begins at main(). Braces group statements into a block, a semicolon ends an expression statement, and declarations tell the compiler what a name means before it is used. Preprocessor lines begin with # and are handled before compilation. Everything else is either a declaration, a definition, or a statement.',
        code: String.raw`#include <stdio.h>

int main(void) {
    int answer = 42;
    printf("answer = %d\n", answer);
    return 0;
}`,
      },
      {
        title: 'Character set, identifiers, and keywords',
        body:
          'C source is written using a small character set: letters, digits, punctuation, and whitespace. Identifiers name variables, functions, and types. They must begin with a letter or underscore and may contain letters, digits, and underscores. Keywords such as int, if, return, and struct are reserved and cannot be reused as identifiers. Comments are removed before the compiler sees the code.',
        code: String.raw`/* valid identifiers */
int score;
int _internal;
int player2_score;

/* invalid: starts with a digit, or uses a keyword */
/* int 2player; */
/* int return; */`,
      },
    ],
    keyTakeaways: [
      'C programs are built from functions and start at main().',
      'Statements end with semicolons; blocks use braces.',
      'Identifiers follow naming rules and cannot be keywords.',
      'Comments are for humans and are removed before compilation.',
    ],
    pitfalls: [
      'Forgetting a semicolon or closing brace.',
      'Using a keyword as a variable name.',
      'Assuming whitespace changes meaning; C is free-form.',
    ],
    examTips: [
      'Expect questions on valid identifiers and keywords.',
      'Know that main is the entry point, not necessarily the first function in the file.',
    ],
    quiz: [
      {
        question: 'Which of these is a valid C identifier?',
        options: ['2player', 'player_2', 'return', 'int'],
        answer: 1,
        explanation:
          'player_2 starts with a letter and contains only letters, digits, and an underscore. The others start with a digit or use reserved keywords.',
      },
      {
        question: 'Where does execution begin in a standard C program?',
        options: ['The first function in the file', 'main()', 'The first #include', 'The last function'],
        answer: 1,
        explanation: 'The C runtime calls main() as the program entry point.',
      },
    ],
  },

  'c-data-types': {
    chapterId: 'c-data-types',
    hook:
      'A type tells the compiler how many bytes to reserve and how to interpret the bit pattern. Qualifiers adjust range and signedness.',
    sections: [
      {
        title: 'Core types and qualifiers',
        body:
          'The core types are int for whole numbers, float and double for real numbers, and char for a single character or small integer. Qualifiers refine them: short and long change the range, while signed and unsigned change how the bits are interpreted. sizeof reports the number of bytes a type or expression occupies, so use it instead of assuming a size.',
        code: String.raw`printf("char   = %zu byte\n", sizeof(char));
printf("int    = %zu bytes\n", sizeof(int));
printf("double = %zu bytes\n", sizeof(double));`,
      },
      {
        title: 'Constants and escape sequences',
        body:
          'A literal constant has a type: 42 is an int, 42.0 is a double, 19.95f is a float, and \'A\' is a char. The suffix matters: without f, a floating literal is a double. Escape sequences write characters that are hard to type or invisible. The full common set is \\a (alert), \\b (backspace), \\f (form feed), \\n (newline), \\r (carriage return), \\t (horizontal tab), \\v (vertical tab), \\\\ (backslash), \\\' (single quote), \\" (double quote), and \\? (question mark). Octal and hexadecimal escapes such as \\101 and \\x41 also produce a character. A symbolic constant created with #define or const gives a value a name.',
        code: String.raw`#define MAX_USERS 100
const double PI = 3.141592653589793;

float price = 19.95f;   /* float constant suffix */
double exact = 19.95;   /* double constant */

printf("alert=\a backspace=\b formfeed=\f newline=\n");
printf("carriage=\r tab=\t vertical=\v backslash=\\ quote=\"\n");
printf("octal A=\101 hex A=\x41\n");`,
      },
    ],
    keyTakeaways: [
      'int, float, double, and char are the core types.',
      'short/long change range; signed/unsigned change interpretation.',
      'sizeof is an operator that reports byte size.',
      'The f suffix makes a floating literal float; without it the literal is double.',
      'Escape sequences represent single special characters, including invisible control characters.',
    ],
    pitfalls: [
      'Assuming int is always four bytes.',
      'Mixing signed and unsigned values in comparisons.',
      'Forgetting that a char literal uses single quotes.',
      'Writing 19.95f when you meant a double, or 19.95 when you meant a float.',
    ],
    examTips: [
      'Expect sizeof and type-range questions.',
      'Know the full escape table, not just newline and tab.',
      'Remember the f suffix when a question distinguishes float from double constants.',
    ],
    quiz: [
      {
        question: 'Which operator reports the size of a type or expression in bytes?',
        options: ['size()', 'length()', 'sizeof', 'strlen()'],
        answer: 2,
        explanation:
          'sizeof is a compile-time operator. strlen() is a library function for null-terminated strings.',
      },
      {
        question: 'Which escape sequence represents the null character?',
        options: ['\\n', '\\t', '\\0', '\\\\'],
        answer: 2,
        explanation: '\\0 is the null character, used to terminate C strings.',
      },
      {
        question: 'Which literal is a float constant?',
        options: ['19.95', '19.95f', '19.95L', "'f'"],
        answer: 1,
        explanation:
          'The f suffix makes the literal a float. Without a suffix, 19.95 is a double; L makes it a long double, and \'f\' is a character constant.',
      },
    ],
  },

  'operators-and-expressions': {
    chapterId: 'operators-and-expressions',
    hook:
      'Expressions combine values with operators. Precedence decides what binds first, and integer division decides whether you get a fraction or a truncation.',
    sections: [
      {
        title: 'Arithmetic, precedence, and division',
        body:
          'Multiplication and division bind before addition and subtraction. Parentheses override precedence. Integer division truncates toward zero, so 5 / 2 is 2. Cast one operand to double when you need a fractional result. The modulo operator % gives the remainder and works only on integers.',
        code: String.raw`int a = 5, b = 2;
printf("%d\n", a / b);          /* 2 */
printf("%.2f\n", (double)a / b); /* 2.50 */
printf("%d\n", a % b);          /* 1 */`,
      },
      {
        title: 'Preprocessor and translation',
        body:
          'The preprocessor runs before compilation. #include pastes a header into the translation unit, #define performs token substitution, and conditional directives such as #ifdef include or exclude code. The compiler translates the source into an object file, and the linker combines object files into an executable. Understanding this pipeline explains why a missing prototype or header can fail at different stages.',
        code: String.raw`#include <stdio.h>
#define SQUARE(x) ((x) * (x))

int main(void) {
    printf("%d\n", SQUARE(5));
    return 0;
}`,
      },
    ],
    keyTakeaways: [
      'Multiplicative operators bind before additive operators.',
      'Integer division truncates; cast to double for a fraction.',
      '% is the integer remainder operator.',
      'The preprocessor handles includes, macros, and conditional compilation before the compiler.',
    ],
    pitfalls: [
      'Expecting 5 / 2 to be 2.5.',
      'Forgetting parentheses in a macro, causing precedence bugs.',
      'Using % with floating-point operands.',
    ],
    examTips: [
      'Trace expressions with precedence and parentheses.',
      'Expect questions on integer division and macro expansion.',
    ],
    quiz: [
      {
        question: 'What is the value of 7 / 2 in C when both operands are int?',
        options: ['3.5', '3', '4', '2'],
        answer: 1,
        explanation:
          'Integer division truncates toward zero, so 7 / 2 evaluates to 3. Cast one operand to double to get 3.5.',
      },
      {
        question: 'Which stage runs first: the preprocessor or the compiler?',
        options: ['Compiler', 'Preprocessor', 'Linker', 'Loader'],
        answer: 1,
        explanation:
          'The preprocessor runs first, expanding includes and macros before the compiler parses the translation unit.',
      },
    ],
  },

  'console-output-input': {
    chapterId: 'console-output-input',
    hook:
      'printf writes formatted text, scanf reads formatted input. The format string is a contract: get it wrong and the program misreads memory.',
    sections: [
      {
        title: 'printf and format specifiers',
        body:
          'printf writes to standard output. Common specifiers are %d for int, %f for double, %c for char, %s for a string, %u for unsigned, and %p for a pointer. Width, precision, and flags control padding and rounding, for example %05d or %.2f. The return value is the number of characters written, or a negative value on error.',
        code: String.raw`int age = 21;
double price = 19.5;
printf("age=%d price=%.2f\n", age, price);
printf("padded=%05d\n", 42);   /* 00042 */`,
      },
      {
        title: 'scanf, addresses, and validation',
        body:
          'scanf reads formatted input. Pass the address of the variable, not the variable itself: scanf("%d", &age). It returns the number of items successfully assigned, which lets you detect bad input. A string read with %s stops at whitespace and can overflow the destination, so limit the width or use fgets instead.',
        code: String.raw`int age;
if (scanf("%d", &age) != 1) {
    fprintf(stderr, "not a number\n");
    return 1;
}
printf("next year: %d\n", age + 1);`,
      },
    ],
    keyTakeaways: [
      'printf uses format specifiers; scanf needs the address of the destination.',
      'Check scanf return values to detect failed conversions.',
      '%s in scanf stops at whitespace and can overflow.',
      'Width and precision control output formatting.',
    ],
    pitfalls: [
      'Passing a value instead of an address to scanf.',
      'Leaving a newline in the input buffer after scanf.',
      'Using %s without a field width on untrusted input.',
    ],
    examTips: [
      'Predict output with width and precision flags.',
      'Know the return values of printf and scanf.',
    ],
    quiz: [
      {
        question: 'Which call correctly reads an int into variable n?',
        options: ['scanf("%d", n);', 'scanf("%d", &n);', 'scanf("%f", &n);', 'scanf("%c", n);'],
        answer: 1,
        explanation:
          'scanf needs the address of the destination, so use &n with the %d conversion.',
      },
      {
        question: 'What does printf return?',
        options: ['Nothing', 'The number of characters written', 'The last value printed', 'EOF'],
        answer: 1,
        explanation:
          'printf returns the number of characters written, or a negative value if an output error occurs.',
      },
    ],
  },

  'character-string-io': {
    chapterId: 'character-string-io',
    hook:
      'Character input is the lowest-level console tool in C. String input adds buffer sizes, terminators, and one famous unsafe function.',
    sections: [
      {
        title: 'Character I/O',
        body:
          'getchar() reads one character and returns EOF when input ends. putchar() writes one character. getch() is a non-standard console function that reads a key without echo on some compilers. The return type matters: getchar returns int so it can represent both an unsigned char and EOF.',
        code: String.raw`int ch;
while ((ch = getchar()) != EOF) {
    putchar(ch);
}`,
      },
      {
        title: 'String I/O and safe buffers',
        body:
          'gets() is unsafe because it cannot know the destination size; never use it in new code. fgets(buffer, size, stdin) reads a bounded line and keeps the newline if there is room. puts() writes a string followed by a newline. Always leave room for the null terminator and strip the newline if your program does not want it.',
        code: String.raw`char line[64];
if (fgets(line, sizeof line, stdin) != NULL) {
    size_t n = strlen(line);
    if (n > 0 && line[n - 1] == '\n') line[n - 1] = '\0';
    printf("you typed: %s\n", line);
}`,
      },
    ],
    keyTakeaways: [
      'getchar returns int so it can return EOF.',
      'putchar writes one character.',
      'fgets is bounded; gets is unsafe.',
      'fgets keeps the newline if it fits.',
    ],
    pitfalls: [
      'Storing getchar() in a char, which can hide EOF.',
      'Forgetting that fgets includes the newline.',
      'Using gets() with user input.',
    ],
    examTips: [
      'Know the return values of getchar and fgets.',
      'Expect a question on why gets() is dangerous.',
    ],
    quiz: [
      {
        question: 'What does getchar() return at end of input?',
        options: ['0', '-1 always', 'EOF', 'NULL'],
        answer: 2,
        explanation:
          'getchar() returns the next unsigned char as an int, or EOF when the stream ends. Compare against EOF for portability.',
      },
      {
        question: 'Which function safely reads a line into a sized buffer?',
        options: ['gets', 'fgets', 'scanf("%s")', 'getchar'],
        answer: 1,
        explanation:
          'fgets(buffer, size, stdin) reads at most size - 1 characters and always terminates the buffer.',
      },
    ],
  },

  'if-else-logic': {
    chapterId: 'if-else-logic',
    hook:
      'C treats zero as false and every non-zero value as true. Relational and logical operators turn that rule into decisions.',
    sections: [
      {
        title: 'if, if-else, and relational tests',
        body:
          'An if statement runs a block when its condition is non-zero. Relational operators compare values: <, <=, >, >=, ==, and !=. Use == for comparison and reserve = for assignment. An else attaches to the nearest unmatched if, so braces matter when nesting.',
        code: String.raw`int score = 72;
if (score >= 90) {
    printf("A\n");
} else if (score >= 60) {
    printf("pass\n");
} else {
    printf("retry\n");
}`,
      },
      {
        title: 'Logical operators and nesting',
        body:
          '&& means and, || means or, and ! negates a condition. Both && and || short-circuit: the right operand may not be evaluated if the result is already known. A compound relational test combines comparisons, but write it in the mathematical form the compiler expects. Deep nesting is hard to read; an else-if ladder or a helper function is often clearer.',
        code: String.raw`if (age >= 18 && age < 65) {
    printf("adult\n");
}

if (score < 0 || score > 100) {
    printf("invalid score\n");
}`,
      },
    ],
    keyTakeaways: [
      'Zero is false; any non-zero value is true.',
      '== compares; = assigns.',
      '&& and || short-circuit.',
      'else binds to the nearest unmatched if.',
    ],
    pitfalls: [
      'Writing if (x = 5) instead of if (x == 5).',
      'Assuming both sides of && are always evaluated.',
      'Forgetting braces around a multi-statement branch.',
    ],
    examTips: [
      'Trace short-circuit expressions carefully.',
      'Predict which else belongs to which if.',
    ],
    quiz: [
      {
        question: 'What is printed by if (0) printf("A"); else printf("B");?',
        options: ['A', 'B', 'Nothing', 'AB'],
        answer: 1,
        explanation: 'Zero is false, so the else branch runs and prints B.',
      },
      {
        question: 'What does short-circuit evaluation mean for &&?',
        options: [
          'Both operands are always evaluated',
          'The right operand may be skipped when the left is false',
          'The left operand is skipped',
          'It is undefined',
        ],
        answer: 1,
        explanation:
          'If the left operand of && is false, the result is already false, so the right operand is not evaluated.',
      },
    ],
  },

  'switch-ternary': {
    chapterId: 'switch-ternary',
    hook:
      'switch is a jump table for integer cases; the ternary operator is a compact if-else expression. Both are easy to misuse.',
    sections: [
      {
        title: 'switch, case labels, and break',
        body:
          'switch selects one of several integer or character cases. Each case label must be a constant expression. Without break, execution falls through into the next case. That can be intentional, but it is a common bug. The default label handles values that match no case.',
        code: String.raw`switch (choice) {
case 'a':
    printf("add\n");
    break;
case 'd':
    printf("delete\n");
    break;
default:
    printf("unknown\n");
}`,
      },
      {
        title: 'The conditional ternary operator',
        body:
          'The conditional operator is the only ternary operator in C: condition ? value_if_true : value_if_false. It is an expression, so it can be used inside a larger expression. Use it for short, clear choices; a full if-else is better when either branch needs multiple statements.',
        code: String.raw`int fee = (age < 18) ? 0 : 100;
int larger = (a > b) ? a : b;`,
      },
    ],
    keyTakeaways: [
      'switch works on integer and character values.',
      'Missing break causes fall-through.',
      'case labels must be constant expressions.',
      'The ternary operator returns one of two values.',
    ],
    pitfalls: [
      'Forgetting break in a switch.',
      'Using a non-constant expression as a case label.',
      'Nesting ternaries until the expression is unreadable.',
    ],
    examTips: [
      'Predict switch output with and without break.',
      'Know which types are allowed in switch.',
    ],
    quiz: [
      {
        question: 'What happens if a case has no break?',
        options: [
          'The switch exits immediately',
          'Execution falls through to the next case',
          'The compiler rejects it',
          'The default case runs',
        ],
        answer: 1,
        explanation:
          'Without break, control continues into the next case label until it reaches a break or the end of the switch.',
      },
      {
        question: 'What does (n > 0) ? 1 : -1 evaluate to when n is 5?',
        options: ['1', '-1', '5', '0'],
        answer: 0,
        explanation: 'The condition is true, so the ternary expression evaluates to 1.',
      },
    ],
  },

  'for-while-loops': {
    chapterId: 'for-while-loops',
    hook:
      'Loops repeat work. The interesting part is whether the condition is checked before the body, and what happens when loops are nested.',
    sections: [
      {
        title: 'for loops and loop variants',
        body:
          'A for loop groups initialization, condition, and update in one header. The loop runs while the condition is true. The update expression can be empty, and multiple expressions can be separated with commas. Keep the loop simple enough to trace by hand.',
        code: String.raw`for (int i = 0; i < 5; i++) {
    printf("%d ", i);
}

for (int i = 0, j = 10; i < j; i++, j--) {
    printf("%d %d\n", i, j);
}`,
      },
      {
        title: 'while and nested loops',
        body:
          'A while loop checks its condition before each iteration; use it when the number of iterations is not known in advance. A nested loop places one loop inside another. The inner loop completes for every iteration of the outer loop, so the total number of iterations is the product of the two counts.',
        code: String.raw`int n = 3;
while (n > 0) {
    printf("%d ", n--);
}

for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 3; col++) {
        printf("%d ", row * col);
    }
    printf("\n");
}`,
      },
    ],
    keyTakeaways: [
      'for and while are top-tested loops.',
      'The for header contains initialization, condition, and update.',
      'Nested loops multiply their iteration counts.',
      'while is useful when the iteration count is unknown.',
    ],
    pitfalls: [
      'Off-by-one errors in loop bounds.',
      'Changing the loop variable inside the body.',
      'Forgetting braces around a multi-statement loop body.',
    ],
    examTips: [
      'Trace loops with a table of iteration number and variable values.',
      'Expect nested-loop output questions with rows and columns.',
    ],
    quiz: [
      {
        question: 'How many times does for (int i = 0; i < 4; i++) run?',
        options: ['3', '4', '5', 'Infinite'],
        answer: 1,
        explanation: 'i takes the values 0, 1, 2, and 3, so the body runs four times.',
      },
      {
        question: 'How many total iterations does a loop with 3 outer and 4 inner iterations perform?',
        options: ['7', '12', '3', '4'],
        answer: 1,
        explanation:
          'The inner loop runs four times for each of the three outer iterations, so 3 × 4 = 12.',
      },
    ],
  },

  'do-while-break-continue': {
    chapterId: 'do-while-break-continue',
    hook:
      'A do-while loop always runs at least once. break and continue change the flow inside a loop, and choosing the right loop shape prevents off-by-one bugs.',
    sections: [
      {
        title: 'do-while and loop choice',
        body:
          'A do-while loop runs its body once and then checks the condition. That makes it a bottom-tested loop. Use for when the iteration count is known, while when it is not, and do-while when the body must run at least once. The update of the loop variable is just as important as the condition.',
        code: String.raw`int attempt = 0;
do {
    printf("attempt %d\n", ++attempt);
} while (attempt < 3);`,
      },
      {
        title: 'break, continue, and increments',
        body:
          'break exits the innermost loop or switch immediately. continue skips the rest of the current iteration and goes to the next condition check. Prefix increment ++i changes the value before it is used; postfix i++ uses the old value and then increments. In a loop update the difference rarely matters, but inside an expression it does.',
        code: String.raw`for (int i = 0; i < 10; i++) {
    if (i == 3) continue;
    if (i == 6) break;
    printf("%d ", i);
}`,
      },
    ],
    keyTakeaways: [
      'do-while is bottom-tested and runs at least once.',
      'break exits the innermost loop.',
      'continue skips to the next iteration.',
      'Prefix and postfix increments differ inside expressions.',
    ],
    pitfalls: [
      'Using do-while when zero iterations should be allowed.',
      'Forgetting to update the loop variable and creating an infinite loop.',
      'Assuming break exits all nested loops.',
    ],
    examTips: [
      'Know the output difference between while and do-while when the condition starts false.',
      'Trace break and continue through a loop.',
    ],
    quiz: [
      {
        question: 'How many times does the body of do { ... } while (0); execute?',
        options: ['Zero', 'Once', 'Twice', 'Infinite'],
        answer: 1,
        explanation:
          'A do-while checks its condition after the body, so the body always executes at least once.',
      },
      {
        question: 'What does continue do inside a loop?',
        options: [
          'Exits the loop',
          'Skips the rest of the current iteration',
          'Restarts the program',
          'Skips the next iteration only',
        ],
        answer: 1,
        explanation:
          'continue jumps to the loop update and condition check, skipping the remaining statements in the current iteration.',
      },
    ],
  },

  'storage-classes': {
    chapterId: 'storage-classes',
    hook:
      'Two variables with the same name can behave completely differently depending on where they live, how long they live, and which file can see them.',
    sections: [
      {
        title: 'Scope, lifetime, and linkage',
        body:
          'Scope is where a name is visible. Lifetime is how long its storage exists. Linkage describes whether other translation units can refer to it. A local variable inside a function has block scope and automatic lifetime by default. A global variable has file scope and static lifetime. These three ideas make the storage-class keywords predictable.',
      },
      {
        title: 'auto, register, static, and extern',
        body:
          'auto is the default for local variables. register is a hint that a variable should be kept in a CPU register if possible; modern compilers ignore it when they have better information, and you cannot take the address of a register variable. A static local keeps its value between calls while remaining invisible outside the function. A static global is private to its file. extern declares a name defined elsewhere.',
        code: String.raw`int next_id(void) {
    static int id = 0;   /* initialized once */
    return ++id;
}

/* file a.c */
int shared_value = 42;

/* file b.c */
extern int shared_value;`,
      },
    ],
    keyTakeaways: [
      'auto is the default local storage class.',
      'register is only a hint and forbids taking the address.',
      'static locals persist across calls but stay block-scoped.',
      'static globals are private to their translation unit.',
      'extern declares a name defined in another translation unit.',
    ],
    pitfalls: [
      'Thinking static means constant.',
      'Taking the address of a register variable.',
      'Defining the same external variable in multiple files.',
      'Assuming a static local is reinitialized on every call.',
    ],
    examTips: [
      'Predict the output of a function with a static local called multiple times.',
      'Know the difference between a declaration and a definition.',
    ],
    quiz: [
      {
        question: 'What does a static local variable preserve between function calls?',
        options: ['Its name', 'Its value', 'Its address only', 'Nothing'],
        answer: 1,
        explanation:
          'A static local keeps its stored value for the lifetime of the program while remaining visible only inside its block.',
      },
      {
        question: 'Which keyword declares a variable defined in another translation unit?',
        options: ['static', 'register', 'extern', 'auto'],
        answer: 2,
        explanation:
          'extern is a declaration that the definition exists elsewhere, allowing the linker to resolve it.',
      },
    ],
  },

  'arrays-1d': {
    chapterId: 'arrays-1d',
    walkthrough: { kind: 'array-walk' },
    hook:
      'An array is a contiguous block of same-typed elements. That layout is why indexing is fast and why an out-of-bounds index is dangerous.',
    sections: [
      {
        title: 'Collections and array declarations',
        body:
          'An array declaration gives the element type, a name, and a size: int scores[5]; creates five ints. The array is C\'s built-in homogeneous collection: every element has the same type. Structures and unions are the aggregate alternatives, and arrays can contain them. The array name refers to the whole collection, while an index selects one element. The index type is an integer, and the index variable is the value used to select an element. The position of an element is its index, starting at zero.',
        code: String.raw`int scores[5];       /* five ints */
scores[0] = 90;
scores[4] = 75;

for (int i = 0; i < 5; i++) {
    printf("%d ", scores[i]);
}`,
      },
      {
        title: 'Referring to individual elements',
        body:
          'Use the array name plus an index in brackets to read or write one element. Arrays are not checked at runtime, so the programmer must ensure the index is within bounds. Entering data into an array and reading it back usually happens in a loop. The array does not remember its length for you, so pass the length separately to functions.',
        code: String.raw`for (int i = 0; i < 5; i++) {
    scanf("%d", &scores[i]);
}

for (int i = 0; i < 5; i++) {
    printf("%d\n", scores[i]);
}`,
      },
      {
        title: 'The array type and the size option',
        body:
          'The declaration int scores[5] gives the array the type int[5]: the element type is int, and the size is part of the type. The name scores refers to the whole array. sizeof(scores) is the size of the whole array, sizeof(scores[0]) is the size of one element, and their quotient is the element count. When you initialize an array, you can omit the size and let the compiler infer it from the initializer list: int a[] = {1, 2, 3}; creates three elements.',
        code: String.raw`int scores[5];

printf("%zu\n", sizeof scores);                 /* whole array */
printf("%zu\n", sizeof scores[0]);              /* one element */
printf("%zu\n", sizeof scores / sizeof scores[0]); /* 5 */

int inferred[] = {1, 2, 3};                     /* size 3 */`,
      },
    ],
    keyTakeaways: [
      'Arrays store same-typed elements contiguously.',
      'Indexing starts at 0 and C does not bounds-check it.',
      'The array name refers to the whole collection.',
      'The size is part of the array type; sizeof(array) / sizeof(array[0]) gives the element count.',
      'When initializing, omit the size to let the compiler infer it.',
    ],
    pitfalls: [
      'Accessing one past the last element.',
      'Confusing the number of elements with the highest valid index.',
      'Using an uninitialized index variable.',
      'Dividing sizeof(pointer) by sizeof(element) after the array decays.',
    ],
    examTips: [
      'Trace array loops carefully.',
      'Know the valid index range for an array of size n.',
      'Expect questions on sizeof(array) versus sizeof(pointer).',
    ],
    quiz: [
      {
        question: 'What are the valid indexes for int a[5];?',
        options: ['1 through 5', '0 through 4', '0 through 5', '1 through 4'],
        answer: 1,
        explanation:
          'C arrays are zero-indexed, so a five-element array has valid indexes 0, 1, 2, 3, and 4.',
      },
      {
        question: 'What does the array name represent in most expressions?',
        options: ['The first element value', 'A pointer to the first element', 'The array length', 'A copy of the whole array'],
        answer: 1,
        explanation:
          'In most expressions, an array name decays to a pointer to its first element.',
      },
    ],
  },

  'array-init-bounds': {
    chapterId: 'array-init-bounds',
    hook:
      'Initializer lists fill an array, but C will not stop you from reading past the end. Bounds are your responsibility.',
    sections: [
      {
        title: 'Initialization and size inference',
        body:
          'An initializer list fills elements from left to right. If you provide fewer values than the size, the remaining elements are zero-initialized. If you omit the size, the compiler infers it from the initializer list. Designated initializers such as [2] = 30 make sparse initialization explicit.',
        code: String.raw`int a[5] = {10, 20, 30};       /* 10 20 30 0 0 */
int b[] = {1, 2, 3, 4};         /* size 4 */
int c[5] = {[2] = 30, [4] = 50};/* 0 0 30 0 50 */`,
      },
      {
        title: 'Bounds checking and undefined behaviour',
        body:
          'C does not check array bounds at runtime. Reading or writing outside the array is undefined behaviour. It may appear to work, corrupt another variable, or crash. The rule is simple: the valid indexes are 0 through size - 1. Static analysis tools can help, but the language will not save you.',
        code: String.raw`int a[3] = {1, 2, 3};

printf("%d\n", a[0]);  /* valid */
printf("%d\n", a[2]);  /* valid */
/* a[3] is out of bounds: undefined behaviour */`,
      },
    ],
    keyTakeaways: [
      'Partial initialization zero-fills the remaining elements.',
      'Omitting the size infers it from the initializer list.',
      'C does not bounds-check array access.',
      'Valid indexes are 0 through size - 1.',
    ],
    pitfalls: [
      'Assuming the compiler will catch an out-of-bounds index.',
      'Forgetting that a shorter initializer list zero-fills.',
      'Using a calculated index without validating it.',
    ],
    examTips: [
      'Know how partial initialization behaves.',
      'Expect questions on undefined behaviour from out-of-bounds access.',
    ],
    quiz: [
      {
        question: 'What is the value of the last element in int a[4] = {1, 2};?',
        options: ['Garbage', '2', '0', '1'],
        answer: 2,
        explanation:
          'When an initializer list is shorter than the array, the remaining elements are zero-initialized.',
      },
      {
        question: 'What happens when you access a[5] on int a[5];?',
        options: ['It returns 0', 'The compiler always rejects it', 'It is undefined behaviour', 'It wraps to a[0]'],
        answer: 2,
        explanation:
          'The valid indexes are 0 through 4. Accessing a[5] is outside the array and therefore undefined behaviour.',
      },
    ],
  },

  'arrays-2d': {
    chapterId: 'arrays-2d',
    hook:
      'A two-dimensional array is an array of arrays. Rows and columns are a mental model; memory is still one contiguous block.',
    sections: [
      {
        title: 'Rows, columns, and row-major layout',
        body:
          'int grid[3][4] has three rows and four columns. Elements are stored in row-major order, so the last index varies fastest. That means grid[0][0], grid[0][1], grid[0][2], and grid[0][3] are adjacent in memory before grid[1][0]. The first dimension is the number of rows; the second is the number of columns.',
        code: String.raw`int grid[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};`,
      },
      {
        title: 'Nested traversal and function parameters',
        body:
          'Nested loops are the natural way to traverse a 2-D array. The outer loop walks rows and the inner loop walks columns. When passing a 2-D array to a function, the column count must be part of the parameter type, because the compiler needs it to calculate row offsets.',
        code: String.raw`for (int r = 0; r < 3; r++) {
    for (int c = 0; c < 4; c++) {
        printf("%d ", grid[r][c]);
    }
    printf("\n");
}

void print_grid(int rows, int cols, int g[][4]);`,
      },
    ],
    keyTakeaways: [
      'A 2-D array is an array of arrays.',
      'Elements are stored in row-major order.',
      'Nested loops traverse rows and columns.',
      'The column count is required in a function parameter type.',
    ],
    pitfalls: [
      'Swapping row and column indexes.',
      'Assuming a 2-D array is stored column by column.',
      'Omitting the column count when passing it to a function.',
    ],
    examTips: [
      'Trace nested loops over 2-D arrays carefully.',
      'Know row-major order and the parameter syntax.',
    ],
    quiz: [
      {
        question: 'In int a[3][4], how many elements does the array contain?',
        options: ['7', '12', '3', '4'],
        answer: 1,
        explanation: 'The array has 3 rows and 4 columns, so it contains 3 × 4 = 12 elements.',
      },
      {
        question: 'Which element is stored immediately after a[0][3] in row-major order?',
        options: ['a[3][0]', 'a[1][0]', 'a[0][4]', 'a[1][1]'],
        answer: 1,
        explanation:
          'Row-major order stores all columns of row 0 first, so the next element is the first column of row 1: a[1][0].',
      },
    ],
  },

  'strings-representation': {
    chapterId: 'strings-representation',
    hook:
      'There is no string type in C. There is only a char array with a null byte at the end, and a library that trusts you to keep it there.',
    sections: [
      {
        title: 'Null-terminated character arrays',
        body:
          'A C string is a sequence of characters ending with the null character \'\\0\'. The terminator is not part of the visible text, but it is part of the array. String literals such as "hello" are stored as six characters including the terminator. A char array can hold a string only if it has room for the text plus one.',
        code: String.raw`char greeting[6] = "hello"; /* h e l l o \0 */
printf("%s\n", greeting);
printf("length = %zu\n", strlen(greeting)); /* 5 */`,
      },
      {
        title: 'sizeof versus strlen',
        body:
          'sizeof reports the number of bytes in the array, including the terminator. strlen counts the characters before the terminator. For char s[] = "cat", sizeof(s) is 4 and strlen(s) is 3. A missing terminator turns a string into a buffer overrun waiting to happen, because the string functions keep reading until they find a zero byte.',
        code: String.raw`char s[] = "cat";
printf("%zu\n", sizeof(s));  /* 4 */
printf("%zu\n", strlen(s));  /* 3 */`,
      },
    ],
    keyTakeaways: [
      'A C string is a char array ending in \'\\0\'.',
      'The visible length is strlen(); storage must include the terminator.',
      'sizeof includes the terminator; strlen does not.',
      'A missing terminator causes undefined behaviour.',
    ],
    pitfalls: [
      'Forgetting the extra byte for the null terminator.',
      'Calling strlen on a non-terminated array.',
      'Confusing sizeof and strlen.',
    ],
    examTips: [
      'Expect questions on strlen versus sizeof for a char array.',
      'Trace buffer contents after a string copy.',
    ],
    quiz: [
      {
        question: 'How many bytes does char s[] = "cat"; occupy?',
        options: ['3', '4', '5', 'Depends on the compiler'],
        answer: 1,
        explanation:
          'The array contains c, a, t, and the null terminator, so it occupies four bytes.',
      },
      {
        question: 'What does strlen("cat") return?',
        options: ['3', '4', '5', '0'],
        answer: 0,
        explanation:
          'strlen counts the characters before the null terminator, so it returns 3.',
      },
    ],
  },

  'string-library': {
    chapterId: 'string-library',
    hook:
      'The string library is small, fast, and trusting. Every function assumes you have already made room for the result.',
    sections: [
      {
        title: 'strlen, strcpy, strcat, and strcmp',
        body:
          'strlen returns the number of characters before the terminator. strcpy copies a source string into a destination; strcat appends a source to a destination; strcmp compares two strings lexicographically and returns zero when they are equal. None of these functions knows the destination capacity, so the caller must guarantee enough space.',
        code: String.raw`char name[32] = "Ada";
char full[64];

strcpy(full, name);
strcat(full, " Lovelace");
printf("%s\n", full);              /* Ada Lovelace */
printf("%d\n", strcmp(name, "Ada")); /* 0 */`,
      },
      {
        title: 'Safe input and termination bugs',
        body:
          'gets() cannot know the buffer size and was removed from modern C. fgets(buffer, size, stdin) reads at most size - 1 characters and always terminates the buffer. Remember that fgets keeps the newline if it fits, so you may need to strip it. A missing terminator turns a string into a buffer overrun waiting to happen.',
        code: String.raw`char line[32];
if (fgets(line, sizeof line, stdin)) {
    size_t n = strlen(line);
    if (n > 0 && line[n - 1] == '\n') line[n - 1] = '\0';
    printf("read: %s\n", line);
}`,
      },
    ],
    keyTakeaways: [
      'strlen counts before the terminator.',
      'strcpy and strcat do not check destination capacity.',
      'strcmp returns 0 for equal strings.',
      'Use fgets instead of gets.',
    ],
    pitfalls: [
      'Using strcpy into a buffer that is too small.',
      'Comparing strings with == instead of strcmp.',
      'Forgetting that fgets keeps the newline.',
    ],
    examTips: [
      'Trace strcpy/strcat buffer contents.',
      'Know the return convention of strcmp.',
    ],
    quiz: [
      {
        question: 'What does strcmp("apple", "apple") return?',
        options: ['1', '-1', '0', 'The length'],
        answer: 2,
        explanation: 'strcmp returns zero when the two strings are equal.',
      },
      {
        question: 'Which function safely copies a string into a sized buffer?',
        options: ['strcpy', 'strcat', 'fgets', 'gets'],
        answer: 2,
        explanation:
          'fgets reads a bounded line into a buffer and always terminates it. strcpy and strcat do not know the destination size.',
      },
    ],
  },

  'function-interface': {
    chapterId: 'function-interface',
    hook:
      'A function is C\'s unit of reuse and its unit of testing. A good interface hides the implementation and makes the contract obvious.',
    sections: [
      {
        title: 'Definition, prototype, and interface',
        body:
          'A function definition has a return type, a name, a parameter list, and a body. A declaration, or prototype, tells the compiler the signature before the definition appears. The interface is the signature plus the contract: what the arguments mean, what the return value represents, and what the function is allowed to change. Put prototypes in a header when several source files share the function.',
        code: String.raw`/* prototype */
int add(int a, int b);

int main(void) {
    printf("%d\n", add(2, 3));
    return 0;
}

int add(int a, int b) {
    return a + b;
}`,
      },
      {
        title: 'Return values, local variables, and void',
        body:
          'return ends the function and sends a value back to the caller. A function declared void returns nothing. Local variables live in the function\'s stack frame and disappear when it returns, so never return a pointer to a local variable. Modern C requires an explicit return type; older C assumed int when one was omitted.',
        code: String.raw`void print_banner(const char *text) {
    printf("== %s ==\n", text);
}

int square(int x) {
    int result = x * x;
    return result;
}`,
      },
      {
        title: 'Kinds of subprograms and return mechanics',
        body:
          'C supports user-defined functions, library functions, iterative functions, recursive functions, and functions that either return a value or return void. At the machine level, a small return value usually travels back in a register. A large structure returned by value may use a hidden pointer supplied by the caller. That mechanism is part of the platform ABI, not something the C source language guarantees.',
      },
    ],
    keyTakeaways: [
      'A prototype lets the compiler check calls before the definition.',
      'A function interface is a contract, not just a signature.',
      'C supports user-defined, library, iterative, and recursive subprograms.',
      'A function cannot safely return a pointer to a local.',
      'void means the function returns no value.',
    ],
    pitfalls: [
      'Returning the address of a local variable.',
      'Mismatching the prototype and the definition.',
      'Ignoring the return value of a function that reports errors.',
      'Assuming a large struct return is free; it may involve a hidden copy.',
    ],
    examTips: [
      'Know the difference between a declaration and a definition.',
      'Expect questions on prototypes, default return types, and void.',
    ],
    quiz: [
      {
        question: 'What is the purpose of a function prototype?',
        options: [
          'To execute the function',
          'To tell the compiler the function signature before it is used',
          'To allocate local variables',
          'To link the function',
        ],
        answer: 1,
        explanation:
          'A prototype declares the return type and parameter types so the compiler can check calls before the definition appears.',
      },
      {
        question: 'What does a void return type mean?',
        options: ['The function returns 0', 'The function returns nothing', 'The function cannot be called', 'The function returns a pointer'],
        answer: 1,
        explanation: 'void means the function does not return a value.',
      },
    ],
  },

  recursion: {
    chapterId: 'recursion',
    hook:
      'Recursion solves a problem by calling itself on a smaller input. Every recursive function needs a base case and enough stack space.',
    sections: [
      {
        title: 'Base case and recursive case',
        body:
          'A recursive function has two parts: a base case that stops the recursion, and a recursive case that calls the function with a smaller or simpler input. If the base case is missing or unreachable, the recursion continues until the stack is exhausted. The factorial function is the classic example: factorial(0) is 1, and factorial(n) is n times factorial(n - 1).',
        code: String.raw`int factorial(int n) {
    if (n <= 1) return 1;       /* base case */
    return n * factorial(n - 1);
}`,
      },
      {
        title: 'Stack frames and iteration',
        body:
          'Each recursive call creates a stack frame holding parameters and local variables. Deep recursion can overflow the stack. An iterative version uses a loop and constant stack space, which is often safer for large inputs. Recursion is clearest when the problem naturally decomposes into smaller subproblems, such as tree traversal.',
        code: String.raw`int factorial_iter(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}`,
      },
      {
        title: 'Similarities and trade-offs',
        body:
          'Iterative and recursive subprograms are equivalent in power. Both need a terminating condition, both can use local variables and return values, and both can be analyzed for time and space complexity. Recursion expresses the solution in terms of smaller subproblems; iteration expresses it as a repeated state update. A recursive function can always be rewritten iteratively, though the iterative version may need an explicit stack to remember pending work.',
      },
    ],
    keyTakeaways: [
      'Every recursive function needs a base case.',
      'The recursive case must move toward the base case.',
      'Each call consumes stack space.',
      'Iteration avoids deep recursion and often uses less memory.',
      'Recursion and iteration are equivalent in power but differ in how they store pending work.',
    ],
    pitfalls: [
      'Missing or unreachable base case.',
      'Forgetting to return the recursive result.',
      'Using recursion for very deep inputs.',
      'Assuming recursion is always faster than iteration.',
    ],
    examTips: [
      'Trace recursive calls and their return values.',
      'Know the difference between iterative and recursive subprograms.',
      'Expect a question asking you to rewrite a recursive function iteratively.',
    ],
    quiz: [
      {
        question: 'Which part of a recursive function prevents infinite recursion?',
        options: ['The return type', 'The base case', 'The prototype', 'The stack'],
        answer: 1,
        explanation:
          'The base case stops the recursion when the input reaches a terminating condition.',
      },
      {
        question: 'What happens if a recursive function never reaches its base case?',
        options: ['It returns 0', 'It runs forever or overflows the stack', 'The compiler fixes it', 'It becomes iterative'],
        answer: 1,
        explanation:
          'Each call adds a stack frame until the stack is exhausted, causing a crash or undefined behaviour.',
      },
    ],
  },

  'call-by-value-reference': {
    chapterId: 'call-by-value-reference',
    hook:
      'C always passes by value. To let a function modify the caller\'s variable, pass its address. That is how C simulates call by reference.',
    sections: [
      {
        title: 'Call by value',
        body:
          'When you pass an argument, the function receives a copy. Changing the parameter inside the function does not change the caller\'s variable. This is true for ints, floats, structs, and even pointers: the pointer is copied, but it still points to the same object. Arrays are different because the array name decays to a pointer.',
        code: String.raw`void bump(int n) {
    n = n + 1;      /* changes the copy only */
}

int x = 5;
bump(x);
printf("%d\n", x);  /* 5 */`,
      },
      {
        title: 'Call by reference with pointers',
        body:
          'To modify a caller\'s variable, pass its address and dereference the pointer inside the function. This is called call by reference in C, even though the language itself only passes values. The same technique lets a function return more than one result through output parameters.',
        code: String.raw`void bump(int *p) {
    (*p)++;
}

int x = 5;
bump(&x);
printf("%d\n", x);  /* 6 */`,
      },
    ],
    keyTakeaways: [
      'C passes arguments by value.',
      'A function receives a copy of each argument.',
      'Pass a pointer to modify the caller\'s variable.',
      'Arrays decay to pointers when passed.',
    ],
    pitfalls: [
      'Expecting a function to modify a value passed by value.',
      'Dereferencing a NULL pointer inside a function.',
      'Confusing a copied pointer with a copied pointee.',
    ],
    examTips: [
      'Predict the output of functions that modify parameters.',
      'Know the difference between call by value and call by reference.',
    ],
    quiz: [
      {
        question: 'What does C pass to a function by default?',
        options: ['A reference', 'A copy of the value', 'A pointer to the value', 'The variable name'],
        answer: 1,
        explanation:
          'C uses call by value. The function receives a copy; pass a pointer if it must modify the caller\'s variable.',
      },
      {
        question: 'How do you make a function modify an int variable from the caller?',
        options: ['Pass the int directly', 'Pass its address and dereference it', 'Return the int', 'Use a global only'],
        answer: 1,
        explanation:
          'Pass the address of the variable and use a pointer parameter; dereferencing the pointer modifies the original object.',
      },
    ],
  },

  'pointer-address': {
    chapterId: 'pointer-address',
    walkthrough: { kind: 'pointer-chain' },
    hook:
      'A pointer is just an address with a type. That type tells the compiler how many bytes to read and how far to move when you add one.',
    sections: [
      {
        title: 'Addresses, declaration, and dereference',
        body:
          'The & operator yields the address of an object. A pointer variable stores that address. The * operator dereferences a pointer, giving access to the object it points to. The type matters: int *p means p points to an int, so *p reads sizeof(int) bytes. An uninitialized pointer contains an indeterminate address; dereferencing it is undefined behaviour.',
        code: String.raw`int x = 42;
int *p = &x;      /* p stores the address of x */

printf("%d\n", x);    /* 42 */
printf("%d\n", *p);   /* 42, same object */
*p = 99;              /* writes through the pointer */
printf("%d\n", x);    /* 99 */`,
      },
      {
        title: 'Pointer types and NULL',
        body:
          'A pointer to int is a different type from a pointer to char, even if both hold addresses. The type controls dereference size and pointer arithmetic. A null pointer points to nothing and must not be dereferenced. Use NULL for clarity and check a pointer before dereferencing it when failure is possible.',
        code: String.raw`int *ip = NULL;
char *cp = NULL;

if (ip != NULL) {
    printf("%d\n", *ip);
}`,
      },
    ],
    keyTakeaways: [
      'A pointer stores an address; its type controls dereference size.',
      '& takes an address, * dereferences a pointer.',
      'Uninitialized pointers must not be dereferenced.',
      'NULL represents a pointer that points to nothing.',
    ],
    pitfalls: [
      'Dereferencing an uninitialized or null pointer.',
      'Confusing the pointer value with the value it points to.',
      'Assigning an int to a pointer without a cast.',
    ],
    examTips: [
      'Trace pointer values and dereferenced values step by step.',
      'Know the meaning of & and * in declarations and expressions.',
    ],
    quiz: [
      {
        question: 'What does *p do?',
        options: ['Returns the address stored in p', 'Returns the value p points to', 'Multiplies p by 2', 'Declares a pointer'],
        answer: 1,
        explanation:
          'The unary * operator dereferences a pointer, giving access to the object at the stored address.',
      },
      {
        question: 'What is the value of &x?',
        options: ['The value of x', 'The address of x', 'A copy of x', 'NULL'],
        answer: 1,
        explanation: 'The address-of operator & yields the memory address of its operand.',
      },
    ],
  },

  'pointer-arithmetic': {
    chapterId: 'pointer-arithmetic',
    walkthrough: { kind: 'array-walk' },
    hook:
      'Pointer arithmetic is scaled by the pointed-to type. If p points to an int and int is four bytes, p + 1 advances by four bytes.',
    sections: [
      {
        title: 'Scaling and array equivalence',
        body:
          'Adding 1 to a pointer moves it by one element, not one byte. The compiler multiplies the integer offset by the size of the pointed-to type. An array name decays to a pointer to its first element in most expressions, so a[i] is equivalent to *(a + i). The pointer must stay within the array or one past its end.',
        code: String.raw`int a[4] = {10, 20, 30, 40};
int *p = a;

printf("%d\n", *p);       /* 10 */
printf("%d\n", *(p + 2)); /* 30 */
printf("%d\n", p[3]);     /* 40 */`,
      },
      {
        title: 'Unary ++ and -- on pointers',
        body:
          'The ++ and -- operators move a pointer forward or backward by one element. They are useful for walking an array, but they mutate the pointer itself. Keep a separate pointer if you still need the original base address. Postfix and prefix forms differ in when the old value is used, just like with integers.',
        code: String.raw`int a[3] = {5, 10, 15};
int *p = a;

printf("%d\n", *p++);  /* prints 5, then p moves to a[1] */
printf("%d\n", *p);    /* 10 */
printf("%d\n", *++p);  /* p moves to a[2], prints 15 */`,
      },
    ],
    keyTakeaways: [
      'Pointer arithmetic moves in units of the pointed-to type.',
      'a[i] is equivalent to *(a + i).',
      'An array name decays to a pointer to its first element.',
      '++ and -- mutate the pointer itself.',
    ],
    pitfalls: [
      'Assuming p + 1 adds one byte.',
      'Going outside the bounds of an array.',
      'Losing the base pointer after incrementing it.',
    ],
    examTips: [
      'Trace pointer values and dereferenced values step by step.',
      'Know why a[i] equals *(a + i).',
    ],
    quiz: [
      {
        question: 'If int *p points to an int at address 1000 and int is 4 bytes, what is p + 1?',
        options: ['1001', '1004', '1000 + sizeof(int *)', 'Undefined'],
        answer: 1,
        explanation:
          'Pointer arithmetic is scaled by the pointed-to type, so p + 1 advances by one int, which is four bytes here.',
      },
      {
        question: 'Which expression is equivalent to a[2]?',
        options: ['*(a + 2)', '*(a + 1)', 'a + 2', '&a[2]'],
        answer: 0,
        explanation:
          'Array indexing is defined in terms of pointer arithmetic: a[2] means *(a + 2).',
      },
    ],
  },

  'array-of-pointers': {
    chapterId: 'array-of-pointers',
    hook:
      'An array of pointers stores several addresses. It is how C represents an array of strings and how main receives command-line arguments.',
    sections: [
      {
        title: 'Arrays of pointers and arrays of strings',
        body:
          'An array of pointers stores addresses, not the objects themselves. char *names[3] holds three pointers to char, which can point to three different strings. The strings themselves may live in read-only storage, so do not modify string literals. An array of pointers is not the same as a 2-D char array: the pointers can point to strings of different lengths.',
        code: String.raw`char *names[3] = {"Ada", "Grace", "Linus"};
for (int i = 0; i < 3; i++) {
    printf("%s\n", names[i]);
}`,
      },
      {
        title: 'Command-line arguments',
        body:
          'main can receive command-line arguments as int argc and char *argv[]. argc is the number of arguments, including the program name. argv[0] is the program name, argv[1] is the first user argument, and argv[argc] is a null pointer. Always check argc before reading an argument.',
        code: String.raw`int main(int argc, char *argv[]) {
    if (argc > 1) {
        printf("first arg: %s\n", argv[1]);
    }
    return 0;
}`,
      },
    ],
    keyTakeaways: [
      'An array of pointers stores addresses.',
      'char *names[] represents an array of strings.',
      'argc counts arguments including the program name.',
      'argv[argc] is a null pointer.',
    ],
    pitfalls: [
      'Modifying a string literal through a char * pointer.',
      'Reading argv[1] without checking argc.',
      'Confusing an array of pointers with a 2-D char array.',
    ],
    examTips: [
      'Know the relationship between argc and argv.',
      'Trace arrays of pointers and their targets.',
    ],
    quiz: [
      {
        question: 'What is argv[0]?',
        options: ['The first user argument', 'The program name', 'NULL', 'The argument count'],
        answer: 1,
        explanation:
          'argv[0] is the name used to invoke the program; user arguments start at argv[1].',
      },
      {
        question: 'What does char *names[3] declare?',
        options: ['Three characters', 'An array of three pointers to char', 'A 2-D char array', 'A single string'],
        answer: 1,
        explanation:
          'The declaration creates an array of three elements, each of type char *, so each element can point to a string.',
      },
    ],
  },

  'pointers-to-pointers': {
    chapterId: 'pointers-to-pointers',
    hook:
      'A pointer to a pointer adds one more hop. It is how functions modify a caller\'s pointer and how dynamic arrays of strings are managed.',
    sections: [
      {
        title: 'Multi-level indirection',
        body:
          'int **pp declares a pointer to a pointer to int. pp stores the address of a pointer variable; *pp is that pointer; **pp is the int it points to. Every level must be valid before you dereference it. Multi-level pointers appear in argv, dynamic 2-D arrays, and functions that allocate or replace a pointer for the caller.',
        code: String.raw`int x = 42;
int *p = &x;
int **pp = &p;

printf("%d\n", **pp);  /* 42 */
**pp = 7;
printf("%d\n", x);     /* 7 */`,
      },
      {
        title: 'const and complex declarations',
        body:
          'The position of const matters. const int *p means the pointed-to int cannot be changed through p; int *const p means the pointer itself cannot change. Reading complex declarations from the inside out helps: start at the identifier, then apply * and [] and () according to precedence. Function pointers and pointers to arrays follow the same rules.',
        code: String.raw`const int *p1;  /* pointer to const int */
int *const p2 = &x; /* const pointer to int */

/* read from the inside out */
int (*fp)(int);  /* pointer to function taking int, returning int */`,
      },
    ],
    keyTakeaways: [
      'int **pp is a pointer to a pointer to int.',
      'Every indirection level must be valid before dereference.',
      'const placement changes what is protected.',
      'Read complex declarations from the identifier outward.',
    ],
    pitfalls: [
      'Dereferencing a NULL intermediate pointer.',
      'Misreading const placement.',
      'Confusing a pointer to an array with an array of pointers.',
    ],
    examTips: [
      'Trace **pp and *pp carefully.',
      'Know the difference between pointer-to-const and const-pointer.',
    ],
    quiz: [
      {
        question: 'If pp is an int ** pointing to p, and p points to x, what is **pp?',
        options: ['The address of p', 'The address of x', 'The value of x', 'NULL'],
        answer: 2,
        explanation:
          'One dereference follows pp to p; the second follows p to x, so **pp is the value of x.',
      },
      {
        question: 'What does const int *p mean?',
        options: [
          'p cannot change',
          'The int pointed to by p cannot be changed through p',
          'Both p and the int are const',
          'p is a null pointer',
        ],
        answer: 1,
        explanation:
          'The const applies to the pointed-to int, not to the pointer itself. The pointer can be reassigned to another address.',
      },
    ],
  },

  'struct-declaration': {
    chapterId: 'struct-declaration',
    hook:
      'A structure is a blueprint for a record. It groups fields of different types into one object.',
    sections: [
      {
        title: 'Declaration, initialization, and member access',
        body:
          'A struct declaration defines a new type. Each member has its own type and name. An array is a homogeneous collection: every element has the same type. A structure is a heterogeneous collection: its members can have different types. Typical applications include records, linked nodes, configuration bundles, and function return values. Use the dot operator to access a member of a structure object. Initialization follows member order unless you use designated initializers, which are clearer and safer when fields change. Do not forget the semicolon after the closing brace.',
        code: String.raw`struct Student {
    int id;
    char name[32];
    double gpa;
};

struct Student s = {1, "Ada", 3.9};
printf("%s has GPA %.2f\n", s.name, s.gpa);

struct Student t = {.id = 2, .name = "Grace", .gpa = 3.8};`,
      },
      {
        title: 'Arrays as members',
        body:
          'A structure member can be an array. The array is stored inside the structure, so copying the structure copies the array as well. Use strcpy or a bounded copy to fill a char array member; assignment does not work for arrays. The structure size includes the array plus any padding.',
        code: String.raw`struct Classroom {
    char label[16];
    int seats;
};

struct Classroom room = {"Lab-A", 30};
printf("%s has %d seats\n", room.label, room.seats);`,
      },
    ],
    keyTakeaways: [
      'struct groups heterogeneous fields into one type.',
      'Use . to access a member of a structure object.',
      'Designated initializers make field order explicit.',
      'Arrays inside structures are copied with the structure.',
    ],
    pitfalls: [
      'Forgetting the semicolon after a struct definition.',
      'Trying to assign an array member directly.',
      'Assuming struct layout has no padding.',
    ],
    examTips: [
      'Trace member access and initialization.',
      'Know the difference between a structure type and a structure variable.',
    ],
    quiz: [
      {
        question: 'Which operator accesses a member of a structure object?',
        options: ['->', '.', '*', '&'],
        answer: 1,
        explanation:
          'The dot operator accesses a member of a structure object. The arrow operator is for pointers to structures.',
      },
      {
        question: 'What is missing if this declaration fails: struct Point { int x; int y; }',
        options: ['A semicolon after the closing brace', 'A return type', 'An initializer', 'A pointer'],
        answer: 0,
        explanation:
          'A structure declaration must end with a semicolon after the closing brace.',
      },
    ],
  },

  'struct-arrays-nesting': {
    chapterId: 'struct-arrays-nesting',
    hook:
      'Structures become powerful when you combine them: an array of records, a record inside a record, or a record with an anonymous inner structure.',
    sections: [
      {
        title: 'Arrays of structures and nested structures',
        body:
          'An array of structures stores several records contiguously. Access a field through two indexes: students[i].name. A nested structure places one structure inside another, and you chain the dot operator: outer.inner.field. Nested structures model real records such as an address inside a customer.',
        code: String.raw`struct Address {
    char city[32];
    char pin[8];
};

struct Customer {
    char name[32];
    struct Address address;
};

struct Customer c = {"Ada", {"London", "N1"}};
printf("%s lives in %s\n", c.name, c.address.city);`,
      },
      {
        title: 'Arrays of structures and anonymous structures',
        body:
          'An array of structures is traversed with a loop. An anonymous structure has no tag, so it can only be used through its variables. Anonymous members can also appear inside another structure, making their fields accessible directly. Use these features when they simplify the model, not to save a few characters.',
        code: String.raw`struct Student {
    char name[32];
    int score;
};

struct Student class_list[3] = {
    {"Ada", 95},
    {"Grace", 91},
    {"Linus", 88}
};

for (int i = 0; i < 3; i++) {
    printf("%s: %d\n", class_list[i].name, class_list[i].score);
}`,
      },
    ],
    keyTakeaways: [
      'An array of structures stores multiple records.',
      'Nested structures chain dot access.',
      'An array can be a member of a structure.',
      'Anonymous structures have no tag and are used through variables.',
    ],
    pitfalls: [
      'Forgetting the extra dot for a nested member.',
      'Mixing up the structure index and the member name.',
      'Using an anonymous structure where a reusable type is needed.',
    ],
    examTips: [
      'Trace nested member access and array indexing.',
      'Know the difference between an array of structures and a structure containing an array.',
    ],
    quiz: [
      {
        question: 'If students is an array of struct Student, how do you access the name of the second student?',
        options: ['students.name[1]', 'students[1].name', 'students[1]->name', 'students->name[1]'],
        answer: 1,
        explanation:
          'First index the array, then use the dot operator to access the member: students[1].name.',
      },
      {
        question: 'What is a nested structure?',
        options: [
          'A structure inside another structure',
          'An array of structures',
          'A pointer to a structure',
          'A structure with no members',
        ],
        answer: 0,
        explanation:
          'A nested structure is a structure type used as a member of another structure.',
      },
    ],
  },

  'struct-pointers': {
    chapterId: 'struct-pointers',
    hook:
      'Most real C code passes structures by pointer. The arrow operator is the shorthand that makes this readable.',
    sections: [
      {
        title: 'Pointers to structures and the -> operator',
        body:
          'When you have a pointer to a structure, p->member is shorthand for (*p).member. This is the normal way to traverse linked structures and to avoid copying large records into functions. Pass a pointer when a function should modify the original; pass the structure by value when a copy is acceptable.',
        code: String.raw`struct Student {
    int id;
    double gpa;
};

void promote(struct Student *s) {
    s->gpa += 0.1;          /* same as (*s).gpa += 0.1 */
}

struct Student s = {1, 3.9};
promote(&s);
printf("%.1f\n", s.gpa);    /* 4.0 */`,
      },
      {
        title: 'Self-referential structures',
        body:
          'A self-referential structure contains a pointer to its own type. This is how linked lists, trees, and graphs are built. A structure cannot contain an instance of itself because that would require infinite storage, but a pointer has a fixed size. A linked node typically stores a value and a next pointer.',
        code: String.raw`struct Node {
    int value;
    struct Node *next;   /* self-referential */
};

struct Node second = {2, NULL};
struct Node first = {1, &second};
printf("%d\n", first.next->value);  /* 2 */`,
      },
    ],
    keyTakeaways: [
      'p->member is equivalent to (*p).member.',
      'Passing a structure by pointer avoids copying and allows mutation.',
      'A self-referential structure stores a pointer to its own type.',
      'Linked lists and trees are built from self-referential nodes.',
    ],
    pitfalls: [
      'Using . on a pointer instead of ->.',
      'Trying to put an instance of a struct inside itself.',
      'Forgetting to initialize the next pointer to NULL.',
    ],
    examTips: [
      'Trace member access through pointers and linked nodes.',
      'Know the difference between -> and (*p).member.',
    ],
    quiz: [
      {
        question: 'If p is a pointer to struct Node, which expression accesses member value?',
        options: ['p.value', 'p->value', '*p.value', '&p.value'],
        answer: 1,
        explanation:
          'The -> operator dereferences the pointer and accesses the member in one step: p->value is (*p).value.',
      },
      {
        question: 'Why can a structure contain a pointer to its own type but not an instance of itself?',
        options: [
          'Pointers are faster',
          'An instance would require infinite storage',
          'C forbids all self-reference',
          'Structures cannot contain pointers',
        ],
        answer: 1,
        explanation:
          'A pointer has a fixed size, while an instance would recursively contain another full instance, requiring infinite storage.',
      },
    ],
  },

  'struct-functions-layout': {
    chapterId: 'struct-functions-layout',
    walkthrough: {
      kind: 'struct-layout',
      name: 'Example',
      fields: [
        { name: 'c', type: 'char', offset: 0, size: 1 },
        { name: 'i', type: 'int', offset: 4, size: 4 },
      ],
      padding: [{ offset: 1, size: 3 }],
      totalSize: 8,
    },
    hook:
      'Structures can be passed and returned by value, but that copies every field. Pointers are cheaper. Layout and padding decide how many bytes a structure really occupies.',
    sections: [
      {
        title: 'Passing and returning structures',
        body:
          'A function can take a structure by value, which copies the whole object, or by pointer, which copies only the address. Pass by pointer when the function should modify the original or when the structure is large. A function can return a structure by value; the compiler copies it back to the caller. Use a pointer return when the structure is dynamically allocated or owned elsewhere.',
        code: String.raw`struct Point { int x; int y; };

struct Point make_point(int x, int y) {
    struct Point p = {x, y};
    return p;
}

void move_point(struct Point *p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}`,
      },
      {
        title: 'Padding, alignment, and sizeof',
        body:
          'The compiler may insert padding between members so each member starts at an aligned address. As a result, sizeof(struct) can be larger than the sum of its member sizes. Reordering members can reduce padding. Do not assume a structure is a packed byte-for-byte representation unless you explicitly request packing.',
        code: String.raw`struct Example {
    char c;    /* 1 byte */
    int i;     /* 4 bytes, usually padded to 4-byte alignment */
};

printf("%zu\n", sizeof(struct Example)); /* often 8, not 5 */`,
      },
    ],
    keyTakeaways: [
      'Passing a structure by value copies all fields.',
      'Pass by pointer for mutation or large records.',
      'Functions can return structures by value.',
      'Padding and alignment make sizeof(struct) larger than the sum of members.',
    ],
    pitfalls: [
      'Assuming struct members are packed tightly.',
      'Copying a large structure by value in a hot path.',
      'Returning a pointer to a local structure.',
    ],
    examTips: [
      'Know why sizeof(struct) may be larger than expected.',
      'Choose by-value or by-pointer arguments based on mutation and size.',
    ],
    quiz: [
      {
        question: 'Why can sizeof(struct) be larger than the sum of its members?',
        options: ['Because of padding and alignment', 'Because structures store metadata', 'Because C adds a null terminator', 'Because of the preprocessor'],
        answer: 0,
        explanation:
          'The compiler may insert padding so each member is correctly aligned, increasing the total size.',
      },
      {
        question: 'When should you pass a structure by pointer instead of by value?',
        options: [
          'When the function must modify the original or the structure is large',
          'Always',
          'Never',
          'Only for arrays',
        ],
        answer: 0,
        explanation:
          'Passing by pointer avoids a full copy and lets the function modify the caller\'s structure.',
      },
    ],
  },

  'union-syntax': {
    chapterId: 'union-syntax',
    hook:
      'A union lets several types share one block of memory. Only one member is valid at a time, and the size is the size of the largest member.',
    sections: [
      {
        title: 'Union syntax and shared storage',
        body:
          'A union is declared like a structure, but its members overlap in memory. Writing one member overwrites the bytes used by the others. The union\'s size is at least the size of its largest member, plus any alignment padding. Use a separate tag field when you need to know which member is currently active.',
        code: String.raw`union Value {
    int i;
    float f;
    char bytes[4];
};

union Value v;
v.i = 65;
printf("%d\n", v.i);   /* 65 */
printf("%c\n", v.bytes[0]); /* depends on endianness */`,
      },
      {
        title: 'Union size and arrays of unions',
        body:
          'An array is a homogeneous indexed collection, a structure is a heterogeneous named record, and a union shares one storage block among alternatives. A structure gives every member its own storage, so the size is the sum of the members plus padding. A union gives every member the same starting address, so the size is the largest member. Arrays of unions are useful when each element can hold one of several representations. A union can also contain an array member; only that array is valid while it is the active member.',
        code: String.raw`union Number {
    int i;
    double d;
};

printf("%zu\n", sizeof(union Number)); /* at least 8 */`,
      },
      {
        title: 'Arrays of unions and array members',
        body:
          'An array of unions stores one alternative per element. A union can also contain an array member. In that case the array shares the union storage with the other members, and only the active member is valid. This is useful for fixed-size buffers that can be viewed as bytes, characters, or integers.',
        code: String.raw`union Value values[2];
values[0].i = 10;
values[1].f = 2.5f;

union Buffer {
    char text[16];
    int numbers[4];
};

union Buffer b;
strcpy(b.text, "hello");   /* text is active */
/* reading b.numbers now would be undefined behaviour */`,
      },
    ],
    keyTakeaways: [
      'Union members share the same storage.',
      'The size of a union is the size of its largest member (plus padding).',
      'Only the most recently written member should be read.',
      'Arrays of unions store one alternative per element.',
      'A union can contain an array member, but only the active member is valid.',
    ],
    pitfalls: [
      'Reading a union member other than the one last written.',
      'Assuming union bytes are portable across endianness.',
      'Confusing union size with the sum of member sizes.',
      'Forgetting that writing an array member overwrites the other members.',
    ],
    examTips: [
      'Compare sizeof(struct) and sizeof(union) with the same members.',
      'Know that a union stores one value at a time.',
      'Expect questions on arrays of unions and array members.',
    ],
    quiz: [
      {
        question: 'What is the size of a union containing an int (4 bytes) and a double (8 bytes)?',
        options: ['4', '8', '12', '16'],
        answer: 1,
        explanation:
          'Union members overlap, so the union is at least as large as its largest member, the double.',
      },
      {
        question: 'How many union members can hold a valid value at the same time?',
        options: ['All of them', 'Exactly one', 'Two', 'It depends on the compiler'],
        answer: 1,
        explanation:
          'Writing one member overwrites the shared storage, so only the last written member is valid.',
      },
    ],
  },

  'tagged-anonymous-unions': {
    chapterId: 'tagged-anonymous-unions',
    hook:
      'A raw union does not remember which member is active. A tag fixes that. An anonymous union removes one layer of names.',
    sections: [
      {
        title: 'Tagged unions',
        body:
          'A tagged union combines a tag field with a union of alternatives. The tag says which member is currently valid, and the union stores the value. This pattern is the C ancestor of sum types. A union member can itself be a structure or an array; the tag then selects that entire representation. Always update the tag when you write a new member.',
        code: String.raw`struct TaggedValue {
    enum { INT, FLOAT } tag;
    union {
        int i;
        float f;
    } value;
};

struct TaggedValue v;
v.tag = INT;
v.value.i = 42;`,
      },
      {
        title: 'Anonymous unions and memory saving',
        body:
          'An anonymous union has no member name, so its fields are accessed as if they belonged to the enclosing structure. This is convenient but can make the active field less obvious, so document the invariant. Unions save memory when only one of several representations is needed at a time, and they can model generic data types.',
        code: String.raw`struct Packet {
    int kind;
    union {
        int number;
        char text[16];
    };   /* anonymous union */
};

struct Packet p;
p.kind = 1;
p.number = 42;`,
      },
      {
        title: 'Structures and arrays inside a union',
        body:
          'A union member can be a structure or an array. The union then stores one complete representation at a time, and the tag tells you which one is active. A union can also be a member of a structure, which is the usual way to attach a tag to the payload.',
        code: String.raw`union Payload {
    struct { int x, y; } point;
    struct { char name[16]; } label;
    char raw[16];
};

struct Variant {
    enum { POINT, LABEL } tag;
    union Payload value;
};

struct Variant v;
v.tag = POINT;
v.value.point.x = 3;
v.value.point.y = 4;`,
      },
    ],
    keyTakeaways: [
      'A tag records which union member is active.',
      'A tagged union models alternatives safely.',
      'An anonymous union exposes its fields directly.',
      'Unions save memory when only one representation is needed.',
      'A union member can be a structure or an array; the tag selects the active representation.',
    ],
    pitfalls: [
      'Forgetting to update the tag after writing a member.',
      'Reading an anonymous union field without checking the tag.',
      'Assuming a union is a generic type without a tag.',
      'Accessing the wrong structure member after changing the tag.',
    ],
    examTips: [
      'Know the structure of a tagged union.',
      'Expect questions on union memory savings.',
      'Be able to read a union containing a structure or an array.',
    ],
    quiz: [
      {
        question: 'What is the purpose of the tag in a tagged union?',
        options: ['To align the union', 'To record which member is active', 'To allocate memory', 'To sort the members'],
        answer: 1,
        explanation:
          'The tag stores which alternative is currently valid so the program can read the correct union member.',
      },
      {
        question: 'How do you access a member of an anonymous union inside a struct?',
        options: ['Through an extra union name', 'Directly as if it were a struct member', 'Only through a pointer', 'It is not accessible'],
        answer: 1,
        explanation:
          'An anonymous union has no member name, so its fields are accessed directly through the enclosing structure.',
      },
    ],
  },

  'file-pointer-modes': {
    chapterId: 'file-pointer-modes',
    walkthrough: {
      kind: 'file-lifecycle',
      filename: 'data.txt',
      line: 'hello file\n',
    },
    hook:
      'Files turn a program into something that can remember. The FILE pointer is your handle, and the mode decides whether you read, write, or append.',
    sections: [
      {
        title: 'The FILE pointer and fopen modes',
        body:
          'stdio.h defines the FILE type and the functions that operate on streams. On many implementations FILE is a structure with fields for the buffer, current position, error indicator, and end-of-file indicator. The C standard treats those members as opaque: use ferror, feof, ftell, and fseek instead of reading them directly. fopen opens a file and returns a FILE pointer, or NULL on failure. Common modes are "r" for reading, "w" for writing (truncates), "a" for appending, "r+" for reading and writing, and "rb"/"wb" for binary. Always check the result before using the pointer.',
        code: String.raw`FILE *fp = fopen("data.txt", "w");
if (fp == NULL) {
    perror("fopen");
    return 1;
}
fprintf(fp, "hello file\n");
fclose(fp);`,
      },
      {
        title: 'Closing, flushing, and errors',
        body:
          'fclose releases the stream and flushes buffered output. Failing to close a file can lose data that is still in the buffer. ferror reports whether a stream error has occurred, and perror prints a human-readable message based on errno. The FILE structure itself is opaque; use the standard functions instead of poking at its members.',
        code: String.raw`FILE *fp = fopen("data.txt", "r");
if (!fp) {
    perror("data.txt");
    return 1;
}

/* read or write here */

if (fclose(fp) != 0) {
    perror("fclose");
}`,
      },
      {
        title: 'Inside the FILE handle and file positioning',
        body:
          'The standard treats FILE as an opaque object, but the concept is a stream state: a buffer, a current position, an error indicator, an end-of-file indicator, and mode/ownership flags. Do not access the fields directly. Use feof and ferror to read the indicators, clearerr to reset them, ftell to ask for the position, fseek to move it, and rewind to return to the beginning.',
        code: String.raw`FILE *fp = fopen("data.txt", "rb");
if (fp) {
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    rewind(fp);

    printf("size = %ld bytes\n", size);
    clearerr(fp);
    fclose(fp);
}`,
      },
    ],
    keyTakeaways: [
      'fopen returns NULL on failure; always check it.',
      'Mode "w" truncates, "a" appends, "r" reads.',
      'fclose flushes buffered output and releases the stream.',
      'ferror and perror help diagnose I/O failures.',
      'FILE is opaque stream state: use feof, ferror, clearerr, ftell, fseek, and rewind.',
    ],
    pitfalls: [
      'Using a FILE pointer without checking for NULL.',
      'Forgetting fclose and losing buffered writes.',
      'Using "w" when you meant "a" and erasing the file.',
      'Reading or writing FILE fields directly; the layout is not portable.',
    ],
    examTips: [
      'Know the fopen mode strings and their effects.',
      'Know the standard functions that expose FILE state: feof, ferror, clearerr, ftell, fseek, rewind.',
      'Expect questions on fopen failure and fclose.',
    ],
    quiz: [
      {
        question: 'What does fopen return when it cannot open a file?',
        options: ['0', 'NULL', 'EOF', '-1'],
        answer: 1,
        explanation:
          'fopen returns a null pointer on failure. Compare the result with NULL before using it.',
      },
      {
        question: 'Which mode opens a file for appending without truncating it?',
        options: ['"r"', '"w"', '"a"', '"r+"'],
        answer: 2,
        explanation:
          'Mode "a" appends to the end of the file and creates it if it does not exist.',
      },
    ],
  },

  'file-read-write': {
    chapterId: 'file-read-write',
    hook:
      'Reading and writing files uses the same ideas as console I/O, with one extra rule: test the read function, not feof.',
    sections: [
      {
        title: 'Character and string I/O',
        body:
          'fgetc reads one character and returns EOF at end of file. fputc writes one character. fgets reads a line into a buffer with a size limit, and fputs writes a string. These functions work on any stream, including stdin and stdout, which is why the same helpers appear in console and file code.',
        code: String.raw`FILE *fp = fopen("data.txt", "r");
char line[128];

if (fp) {
    while (fgets(line, sizeof line, fp) != NULL) {
        printf("%s", line);
    }
    fclose(fp);
}`,
      },
      {
        title: 'Formatted I/O and end of file',
        body:
          'fprintf and fscanf are the file versions of printf and scanf. They use the same format strings. feof does not predict the end of file; it reports that a read already hit EOF. The reliable pattern is to test the read function\'s return value, then optionally check feof or ferror to understand why it stopped.',
        code: String.raw`int value;
while (fscanf(fp, "%d", &value) == 1) {
    printf("read %d\n", value);
}

if (feof(fp)) {
    printf("end of file\n");
} else if (ferror(fp)) {
    perror("read error");
}`,
      },
    ],
    keyTakeaways: [
      'fgetc/fputc handle characters; fgets/fputs handle strings.',
      'fprintf/fscanf mirror printf/scanf for files.',
      'feof reports a past EOF, not an upcoming one.',
      'Loop on the read function\'s return value, not on feof.',
    ],
    pitfalls: [
      'Looping on feof instead of the read function\'s return value.',
      'Forgetting to close the file after reading.',
      'Ignoring ferror when a read stops early.',
    ],
    examTips: [
      'Trace a read loop that stops at EOF.',
      'Expect questions on feof and ferror semantics.',
    ],
    quiz: [
      {
        question: 'Which function reads a string from a file with a size limit?',
        options: ['fgetc', 'fgets', 'fscanf', 'fputs'],
        answer: 1,
        explanation:
          'fgets(buffer, size, stream) reads at most size - 1 characters and terminates the buffer.',
      },
      {
        question: 'What does feof(fp) report?',
        options: [
          'That the next read will fail',
          'That a previous read already reached EOF',
          'The current file position',
          'The file size',
        ],
        answer: 1,
        explanation:
          'feof becomes true only after a read has attempted to go past the end of the file.',
      },
    ],
  },

  'malloc-free': {
    chapterId: 'malloc-free',
    walkthrough: {
      kind: 'heap',
      bytes: 16,
      values: [10, 20, 30, 40],
    },
    hook:
      'The stack is automatic and bounded. The heap is manual and flexible. malloc gives you memory at runtime; free is the promise you make to give it back.',
    sections: [
      {
        title: 'Heap allocation with malloc',
        body:
          'malloc(size) reserves at least size bytes and returns a pointer to the block, or NULL if allocation fails. The memory is uninitialized. Casting the result of malloc is unnecessary in C. Use sizeof *pointer so the allocation stays correct if the pointed-to type changes. Always check for NULL before using the block.',
        code: String.raw`int *numbers = malloc(10 * sizeof *numbers);
if (numbers == NULL) {
    fprintf(stderr, "out of memory\n");
    return 1;
}

for (int i = 0; i < 10; i++) {
    numbers[i] = i * i;
}`,
      },
      {
        title: 'free and pointer lifetime',
        body:
          'free(pointer) releases the block. Every successful allocation needs a matching free, and you must not use the pointer after freeing it. Set the pointer to NULL after free to reduce dangling-pointer risk. Ownership should be clear: one part of the program is responsible for releasing each allocation.',
        code: String.raw`free(numbers);
numbers = NULL;   /* avoid a dangling pointer */`,
      },
    ],
    keyTakeaways: [
      'malloc returns uninitialized memory or NULL.',
      'Use sizeof *pointer to size the allocation.',
      'free releases a block; do not use the pointer afterward.',
      'Set pointers to NULL after free.',
    ],
    pitfalls: [
      'Forgetting to check malloc for NULL.',
      'Using memory after free.',
      'Losing the only pointer to a block and leaking it.',
    ],
    examTips: [
      'Know the malloc/free lifecycle.',
      'Expect questions on NULL checks and dangling pointers.',
    ],
    quiz: [
      {
        question: 'What does malloc return on failure?',
        options: ['0 bytes', 'NULL', 'EOF', '-1'],
        answer: 1,
        explanation:
          'malloc returns a null pointer when it cannot satisfy the request.',
      },
      {
        question: 'What should you do immediately after free(p)?',
        options: ['Use p', 'Set p = NULL', 'Free p again', 'Call malloc'],
        answer: 1,
        explanation:
          'Setting p to NULL after free prevents accidental use of a dangling pointer and makes a second free easier to detect.',
      },
    ],
  },

  'calloc-realloc': {
    chapterId: 'calloc-realloc',
    hook:
      'calloc zeroes memory, realloc resizes it, and both can fail. Handle failure before you overwrite your only pointer.',
    sections: [
      {
        title: 'calloc and realloc',
        body:
          'calloc(count, size) allocates space for an array and zero-initializes it. realloc(pointer, new_size) resizes an existing block, copying the old contents when it must move. Always assign realloc to a temporary pointer first; if it fails, the original block is still valid and must not be lost.',
        code: String.raw`int *a = calloc(5, sizeof *a);   /* all zeros */
int *tmp = realloc(a, 10 * sizeof *a);
if (tmp == NULL) {
    free(a);
    return 1;
}
a = tmp;`,
      },
      {
        title: 'Leaks, double free, and dangling pointers',
        body:
          'A memory leak is an allocation that is never freed. A double free releases the same block twice and corrupts the allocator. A dangling pointer still holds an address after the block was freed. Set pointers to NULL after free and design ownership rules so one part of the program is clearly responsible for each allocation.',
        code: String.raw`char *p = malloc(32);
if (p) {
    strcpy(p, "owned");
    printf("%s\n", p);
    free(p);
    p = NULL;
}`,
      },
    ],
    keyTakeaways: [
      'calloc zero-initializes the allocation.',
      'realloc may move the block; keep the old pointer until success.',
      'Free the original block if realloc fails.',
      'Leaks, double frees, and dangling pointers are the classic heap bugs.',
    ],
    pitfalls: [
      'Overwriting the original pointer with a failed realloc result.',
      'Freeing the same pointer twice.',
      'Using a pointer after free.',
    ],
    examTips: [
      'Know the difference between malloc, calloc, and realloc.',
      'Expect questions on leak and dangling-pointer scenarios.',
    ],
    quiz: [
      {
        question: 'Which function allocates zero-initialized memory for an array?',
        options: ['malloc', 'calloc', 'realloc', 'free'],
        answer: 1,
        explanation:
          'calloc(count, size) allocates space for count objects and initializes every byte to zero.',
      },
      {
        question: 'Why should you store realloc\'s result in a temporary pointer?',
        options: [
          'To make the code longer',
          'So the original pointer is not lost if realloc fails',
          'Because realloc returns void',
          'To zero the memory',
        ],
        answer: 1,
        explanation:
          'If realloc fails, it returns NULL and the original block is still valid. Assigning directly to the original pointer would lose the only reference.',
      },
    ],
  },

  'bitwise-operators': {
    chapterId: 'bitwise-operators',
    walkthrough: {
      kind: 'bitwise',
      mode: 'operators',
    },
    hook:
      'Bitwise operators see the binary underneath every integer. They are how C talks to hardware registers, flags, permissions, and packed formats.',
    sections: [
      {
        title: 'AND, OR, XOR, and NOT',
        body:
          'Bitwise AND (&) keeps a bit only when both operands have 1. OR (|) sets a bit when either operand has 1. XOR (^) sets a bit when the operands differ. NOT (~) flips every bit. These operators work independently on each bit position, which is why they are different from the logical operators &&, ||, and !.',
        code: String.raw`unsigned a = 12;  /* binary 1100 */
unsigned b = 10;  /* binary 1010 */

printf("%u\n", a & b);  /* 1000 */
printf("%u\n", a | b);  /* 1110 */
printf("%u\n", a ^ b);  /* 0110 */
printf("%u\n", ~a & 0xF); /* 0011 */`,
      },
      {
        title: 'Left and right shift',
        body:
          'Left shift (<<) moves bits toward the most significant end and fills with zeros. It is equivalent to multiplying by a power of two for unsigned values that do not overflow. Right shift (>>) moves bits toward the least significant end. For unsigned values it fills with zeros; for signed negative values the result is implementation-defined in older C standards, so prefer unsigned types for bit manipulation.',
        code: String.raw`unsigned x = 5;       /* 0101 */
printf("%u\n", x << 1); /* 1010 = 10 */
printf("%u\n", x >> 1); /* 0010 = 2 */

unsigned flag = 1u << 3; /* 0000 1000 */`,
      },
    ],
    keyTakeaways: [
      'Bitwise operators work on individual bits; logical operators work on truth values.',
      'AND tests/clears, OR sets, XOR toggles, NOT flips.',
      'Left shift multiplies by powers of two; right shift divides for unsigned values.',
      'Use unsigned types for portable bit manipulation.',
    ],
    pitfalls: [
      'Confusing & with && and | with ||.',
      'Shifting by a negative amount or by the width of the type.',
      'Assuming right shift of a negative signed value is portable.',
    ],
    examTips: [
      'Compute small bitwise expressions in binary.',
      'Expect questions on shift results and operator precedence.',
    ],
    quiz: [
      {
        question: 'What is binary 1100 & binary 1010?',
        options: ['1110', '1000', '0110', '0010'],
        answer: 1,
        explanation:
          'AND keeps a bit only where both operands have a 1, so 1100 & 1010 = 1000.',
      },
      {
        question: 'What does x << 1 do to an unsigned integer for values that do not overflow?',
        options: ['Divides by 2', 'Multiplies by 2', 'Adds 1', 'Flips every bit'],
        answer: 1,
        explanation:
          'A left shift by one moves each bit one position toward the most significant end, multiplying the value by 2.',
      },
    ],
  },

  'bitwise-masks': {
    chapterId: 'bitwise-masks',
    walkthrough: {
      kind: 'bitwise',
      mode: 'masks',
    },
    hook:
      'A mask is a value with ones where you care. Once you know the four mask idioms, flags and registers stop looking like magic.',
    sections: [
      {
        title: 'Mask idioms',
        body:
          'Use AND to test a bit, OR to set it, AND with the complement to clear it, and XOR to toggle it. The mask has a 1 in the bit position you want to affect and zeros elsewhere. Shifting 1u by n creates a mask for bit n. Parenthesize the mask and the complement to keep precedence clear. Masks also support relational idioms: (x & MASK) != 0 tests whether any masked bit is set, and (x & MASK) == MASK tests whether every masked bit is set.',
        code: String.raw`#define READ   (1u << 0)
#define WRITE  (1u << 1)
#define EXEC   (1u << 2)

unsigned perms = READ | WRITE;  /* set bits */
perms |= EXEC;                  /* add execute */
perms &= ~WRITE;                /* clear write */
int can_read = (perms & READ) != 0;`,
      },
      {
        title: 'Flags, registers, and bitfields',
        body:
          'Flags pack several boolean values into one integer. Permission bits, device registers, and network headers use the same idea. Always use unsigned types and fixed-width masks when the exact bit layout matters. Be careful with sign extension and with shifts whose count is greater than or equal to the width of the type.',
        code: String.raw`#define FLAG_A (1u << 0)
#define FLAG_B (1u << 1)
#define FLAG_C (1u << 2)

unsigned flags = 0;
flags |= FLAG_A | FLAG_C;

if (flags & FLAG_A) {
    printf("A is set\n");
}`,
      },
      {
        title: 'Relational mask idioms',
        body:
          'A mask expression becomes a relational test when you compare the masked value. (x & MASK) != 0 is true when any masked bit is set. (x & MASK) == MASK is true only when every masked bit is set. (x & MASK) == 0 is true when none of the masked bits are set. Parenthesize the mask expression before comparing, because equality has lower precedence than bitwise AND in some expressions and higher in others.',
        code: String.raw`#define READ   (1u << 0)
#define WRITE  (1u << 1)
#define EXEC   (1u << 2)

unsigned perms = READ | WRITE;

if ((perms & READ) != 0) {
    printf("read allowed\n");
}

if ((perms & (READ | WRITE)) == (READ | WRITE)) {
    printf("read and write allowed\n");
}

if ((perms & EXEC) == 0) {
    printf("execute denied\n");
}`,
      },
    ],
    keyTakeaways: [
      'OR sets, AND clears, XOR toggles, AND tests.',
      '1u << n creates a mask for bit n.',
      'Flags pack multiple booleans into one integer.',
      'Use unsigned types and parenthesize masks.',
      '(x & MASK) != 0 tests any bit; (x & MASK) == MASK tests all bits.',
    ],
    pitfalls: [
      'Using & instead of && in a boolean context.',
      'Forgetting parentheses around a mask or complement.',
      'Shifting by the width of the type.',
      'Testing a single bit when the mask contains several bits.',
    ],
    examTips: [
      'Know the idioms for setting, clearing, toggling, and testing a bit.',
      'Know the difference between testing any masked bit and testing all masked bits.',
      'Expect questions on mask expressions and precedence.',
    ],
    quiz: [
      {
        question: 'Which expression sets bit 2 of x?',
        options: ['x |= (1u << 2);', 'x &= (1u << 2);', 'x ^= (1u << 2);', 'x = ~(1u << 2);'],
        answer: 0,
        explanation:
          'OR with a mask that has a 1 in bit 2 sets that bit while leaving the other bits unchanged.',
      },
      {
        question: 'Which expression clears bit 3 of x?',
        options: ['x |= (1u << 3);', 'x &= ~(1u << 3);', 'x ^= (1u << 3);', 'x = (1u << 3);'],
        answer: 1,
        explanation:
          'AND with the complement of the mask keeps every bit except bit 3, which becomes 0.',
      },
    ],
  },

  'misc-functions': {
    chapterId: 'misc-functions',
    hook:
      'The last chapter is a toolbox: small standard-library functions that convert text to numbers, classify characters, change case, and end a program cleanly.',
    sections: [
      {
        title: 'Numeric conversions',
        body:
          'atoi converts a string to int, atol to long, and atof to double. They skip leading whitespace and stop at the first character that cannot be part of the number. They cannot report overflow or distinguish "0" from invalid input, so use strtol or strtod when you need robust error checking.',
        code: String.raw`int n = atoi("42");
long big = atol("123456");
double price = atof("19.95");

printf("%d %ld %.2f\n", n, big, price);`,
      },
      {
        title: 'Character classification and case conversion',
        body:
          'ctype.h provides isalpha, isdigit, isalnum, isspace, and friends. They return non-zero for true and zero for false. toupper and tolower convert a single character when the conversion is defined; otherwise they return the character unchanged. These functions expect an unsigned char value or EOF, so cast when working with plain char.',
        code: String.raw`char c = 'a';
if (isalpha((unsigned char)c)) {
    printf("%c\n", toupper((unsigned char)c)); /* A */
}

if (isdigit((unsigned char)'7')) {
    printf("digit\n");
}`,
      },
      {
        title: 'Program termination with exit',
        body:
          'exit(status) ends the program immediately. A status of 0 or EXIT_SUCCESS reports success; EXIT_FAILURE reports failure. Returning from main is equivalent to calling exit with the returned value. Registered atexit handlers run during exit, and open streams are flushed, but local variables are not unwound like exceptions in other languages.',
        code: String.raw`#include <stdlib.h>

if (argc != 2) {
    fprintf(stderr, "usage: %s file\n", argv[0]);
    exit(EXIT_FAILURE);
}

exit(EXIT_SUCCESS);`,
      },
    ],
    keyTakeaways: [
      'atoi/atol/atof convert strings but cannot report overflow.',
      'isdigit, isalpha, and isalnum return non-zero for true.',
      'toupper/tolower convert one character at a time.',
      'exit ends the program and flushes streams.',
      'EXIT_SUCCESS and EXIT_FAILURE are the portable status values.',
    ],
    pitfalls: [
      'Using atoi on untrusted input without checking for errors.',
      'Passing a negative char to ctype functions without casting to unsigned char.',
      'Assuming exit runs destructors or unwinds the stack.',
    ],
    examTips: [
      'Know the return conventions of ctype functions.',
      'Expect questions on atoi behavior with non-numeric input.',
    ],
    quiz: [
      {
        question: 'What does atoi("12abc") return?',
        options: ['12', '0', 'Error', 'abc'],
        answer: 0,
        explanation:
          'atoi converts the leading numeric part and stops at the first non-numeric character, so it returns 12.',
      },
      {
        question: 'Which function tests whether a character is a digit?',
        options: ['isdigit', 'isalpha', 'toupper', 'atoi'],
        answer: 0,
        explanation:
          'isdigit returns non-zero when the character is one of 0 through 9.',
      },
    ],
  },
};

export const cLessonByChapter = (chapterId: string): CLesson | undefined =>
  cLessons[chapterId];
