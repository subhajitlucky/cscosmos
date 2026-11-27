import type { ITLesson } from './types';

export const part2Lessons: ITLesson[] = [
  {
    chapterId: 'number-systems',
    intro:
      'Binary, octal, hexadecimal and decimal are positional number systems that write the same integer value with different radices. These notes cover place-value conversion, arithmetic in non-decimal bases, BCD and excess-3 codes, the three signed-integer formats, and the character and storage standards — ASCII, EBCDIC, Unicode, bits and bytes — that give bit patterns meaning.',
    sections: [
      {
        title: 'Positional notation and place value',
        bullets: [
          'A base-b numeral uses digits 0 to b−1; position i from the right carries weight b^i.',
          'Decimal 935 = 9×10² + 3×10¹ + 5×10⁰.',
          'Binary 1011₂ = 8 + 0 + 2 + 1 = 11₁₀; hexadecimal 2F₁₆ = 2×16 + 15 = 47₁₀.',
          'Fractional digits use negative powers: 0.101₂ = 1/2 + 1/8 = 0.625₁₀.',
          'Hex digits A–F stand for 10–15; 0x2F, 2F₁₆ and 47₁₀ are the same value.',
          'The same digits differ by base: 10₂ = 2, 10₈ = 8, 10₁₆ = 16.',
        ],
        code: `Position:    3    2    1    0
Weight 2^:   8    4    2    1
Binary:      1    0    1    1   = 8 + 0 + 2 + 1 = 11

Position:    1    0   -1   -2
Weight 2^:   2    1   1/2  1/4
Binary:      1    0    1    0   = 2 + 0 + 0.5 + 0 = 2.5

Subscript shows the base: 1011_2, 2F_16, 47_10`,
      },
      {
        title: 'Base conversion',
        bullets: [
          'Decimal to base b: divide by b repeatedly; the remainders, read bottom to top, are the digits.',
          'Base b to decimal: multiply each digit by its place weight b^i and add the products.',
          'Binary to octal: group 3 bits from the binary point; binary to hex: group 4 bits.',
          'Pad the first and last groups with zeros; 1001 1100₂ = 9C₁₆ = 234₈.',
          'Decimal 156 = 1001 1100₂; decimal 45 = 0010 1101₂ = 2D₁₆.',
          'Check by expanding the result: 234₈ = 2×64 + 3×8 + 4 = 156₁₀.',
        ],
        table: {
          caption: 'Decimal, binary, octal, hexadecimal and BCD equivalents',
          headers: ['Decimal', 'Binary', 'Octal', 'Hex', '8421 BCD'],
          rows: [
            ['0', '0000', '0', '0', '0000'],
            ['1', '0001', '1', '1', '0001'],
            ['5', '0101', '5', '5', '0101'],
            ['8', '1000', '10', '8', '1000'],
            ['10', '1010', '12', 'A', '0001 0000'],
            ['15', '1111', '17', 'F', '0001 0101'],
            ['16', '1 0000', '20', '10', '0001 0110'],
            ['31', '1 1111', '37', '1F', '0011 0001'],
            ['156', '1001 1100', '234', '9C', '0001 0101 0110'],
            ['255', '1111 1111', '377', 'FF', '0010 0101 0101'],
          ],
        },
        code: `156 ÷ 2 = 78  r 0
 78 ÷ 2 = 39  r 0
 39 ÷ 2 = 19  r 1
 19 ÷ 2 =  9  r 1
  9 ÷ 2 =  4  r 1
  4 ÷ 2 =  2  r 0
  2 ÷ 2 =  1  r 0
  1 ÷ 2 =  0  r 1   -> read up: 1001 1100

1001 1100 = 9C hex
1001 1100 = 010 011 100 = 234 octal

Expand: 234_8 = 2×64 + 3×8 + 4 = 156`,
      },
      {
        title: 'Binary, octal and hexadecimal arithmetic',
        bullets: [
          'Add column by column and carry 1 when a column sum reaches the base.',
          'Binary: 1+1 = 10₂ (write 0, carry 1); 1+1+1 = 11₂ (write 1, carry 1).',
          'Octal: 7+1 = 10₈; a borrow adds 8 to the current column.',
          'Hex: F+1 = 10₁₆; convert A–F to 10–15 before adding; a borrow adds 16.',
          'Binary subtraction borrows 2: 1101₂ − 0110₂ = 0111₂ (13 − 6 = 7).',
          'Binary multiplication is shift-and-add; multiplying by 2 appends a 0.',
          'Verify every result by converting operands and answer to decimal.',
        ],
        code: `Binary addition        Octal addition        Hex addition
  1 1 1  carry           1 1 carry            1 carry
  1 0 1 1               1 7                  2 A
+ 0 1 1 0             + 2 5                + 1 7
---------             -------              -------
1 0 0 0 1             4 4                  4 1
(11 + 6 = 17)         (15 + 21 = 36)       (42 + 23 = 65)

Binary subtraction     Octal subtraction     Hex subtraction
  1 1 0 1               5 2                  3 C
- 0 1 1 0             - 2 7                - 1 F
---------             -------              -------
  0 1 1 1               2 3                  1 D
(13 - 6 = 7)          (42 - 23 = 19)       (60 - 31 = 29)`,
      },
      {
        title: 'BCD and excess-3',
        bullets: [
          '8421 BCD stores each decimal digit in a 4-bit nibble with weights 8, 4, 2, 1.',
          'Patterns 1010–1111 are invalid in BCD; 259₁₀ = 0010 0101 1001.',
          'BCD addition: if a nibble sum exceeds 9 or a carry leaves the nibble, add 0110 to correct it.',
          'Example: 8 + 5 gives 1000 + 0101 = 1101; add 0110 → 1 0011, i.e. 13.',
          'Excess-3 adds 0011 to each digit’s BCD code: 0 → 0011, 4 → 0111, 9 → 1100.',
          'Excess-3 is self-complementing: inverting its bits gives the code for 9 − d.',
          'BCD uses 4 bits per digit, so it is not the compact binary encoding of the integer.',
        ],
        table: {
          caption: 'Decimal digits in 8421 BCD and excess-3',
          headers: ['Decimal', '8421 BCD', 'Excess-3'],
          rows: [
            ['0', '0000', '0011'],
            ['1', '0001', '0100'],
            ['2', '0010', '0101'],
            ['3', '0011', '0110'],
            ['4', '0100', '0111'],
            ['5', '0101', '1000'],
            ['6', '0110', '1001'],
            ['7', '0111', '1010'],
            ['8', '1000', '1011'],
            ['9', '1001', '1100'],
          ],
        },
        code: `259 in 8421 BCD:  0010 0101 1001
407 in excess-3:  4 -> 0111, 0 -> 0011, 7 -> 1010
                  => 0111 0011 1010

BCD addition 8 + 5:
   1000
 + 0101
 ------
   1101   invalid BCD digit (> 1001)
 + 0110   add correction
 ------
 1 0011   = 13 (carry 1, digit 3)

Excess-3 self-complement:
 4 = 0111 -> invert -> 1000 = excess-3 for 5, and 9 - 4 = 5`,
      },
      {
        title: 'Signed numbers: sign-magnitude, 1’s and 2’s complement',
        bullets: [
          'Unsigned n bits span 0 to 2ⁿ−1; 8 bits span 0–255.',
          'Sign-magnitude: leftmost bit is the sign (0 = +, 1 = −), remaining bits are magnitude; two zeros.',
          '1’s complement: invert every bit of the magnitude; two zeros; addition needs end-around carry.',
          '2’s complement: invert every bit and add 1; one zero; subtract by adding the 2’s complement.',
          'The 2’s complement sign bit has weight −2ⁿ⁻¹: 1000 0000 = −128 in 8 bits.',
          'Ranges: sign-magnitude and 1’s complement −(2ⁿ⁻¹−1) to +(2ⁿ⁻¹−1); 2’s complement −2ⁿ⁻¹ to 2ⁿ⁻¹−1.',
          'Form −45: +45 = 0010 1101 → invert = 1101 0010 → add 1 = 1101 0011.',
        ],
        table: {
          caption: '8-bit signed representations',
          headers: ['Value', 'Sign-magnitude', '1’s complement', '2’s complement'],
          rows: [
            ['+5', '0000 0101', '0000 0101', '0000 0101'],
            ['−5', '1000 0101', '1111 1010', '1111 1011'],
            ['+0', '0000 0000', '0000 0000', '0000 0000'],
            ['−0', '1000 0000', '1111 1111', 'none (0000 0000 = +0)'],
            ['+127', '0111 1111', '0111 1111', '0111 1111'],
            ['−127', '1111 1111', '1000 0000', '1000 0001'],
            ['−128', 'not representable', 'not representable', '1000 0000'],
          ],
        },
        code: `+45        = 0010 1101
1's comp   = 1101 0010
2's comp   = 1101 0011  = -45

Check: -128 + 64 + 16 + 2 + 1 = -45
Unsigned reading of 1101 0011 = 211`,
      },
      {
        title: 'Characters, bits, bytes and word size',
        bullets: [
          '1 bit = one binary digit; 1 nibble = 4 bits; 1 byte = 8 bits.',
          'ASCII is a 7-bit code for 128 characters: A = 65, a = 97, 0 = 48.',
          'EBCDIC is an 8-bit IBM mainframe code; its letters are not contiguous.',
          'Unicode assigns a code point to every character; UTF-8 encodes 1–4 bytes and matches ASCII below 128.',
          'Word size is the number of bits a CPU handles at once, e.g. 8, 16, 32 or 64.',
          'An n-bit field has 2ⁿ patterns: 8 bits = 256, 16 bits = 65,536.',
          'Storage: 1 KiB = 1024 B, 1 MiB = 1024 KiB, 1 GiB = 1024 MiB.',
        ],
        table: {
          caption: 'Character codes and storage units',
          headers: ['Code / unit', 'Size', 'Example'],
          rows: [
            ['ASCII', '7 bits, 128 codes', 'A = 65 = 100 0001'],
            ['EBCDIC', '8 bits, 256 codes', 'A = 193 = 1100 0001'],
            ['Unicode', 'code points to U+10FFFF', 'U+0041 = A'],
            ['UTF-8', '1–4 bytes per code point', 'A = 41₁₆ (1 byte)'],
            ['Byte', '8 bits', '256 values'],
            ['Word', 'CPU register width', '32 or 64 bits'],
          ],
        },
      },
    ],
    examPoints: [
      'Binary 1011 0110₂ = B6₁₆ = 266₈ = 182₁₀.',
      'Decimal 156 = 1001 1100₂ = 234₈ = 9C₁₆.',
      '8421 BCD for 259 is 0010 0101 1001; excess-3 for 4 is 0111.',
      'In 8-bit 2’s complement, −45 = 1101 0011 and the range is −128 to +127.',
      'The 1’s complement of 0000 0101 is 1111 1010; adding 1 gives the 2’s complement 1111 1011.',
      'A byte is 8 bits; ASCII A = 65, a = 97, 0 = 48; UTF-8 is ASCII-compatible.',
    ],
    keyTerms: [
      {
        term: 'Radix',
        definition:
          'The base of a positional number system; it fixes the digit set 0 to b−1 and the place weights b^i.',
      },
      {
        term: 'Two’s complement',
        definition:
          'An n-bit signed encoding in which a negative value is the bitwise inverse of its magnitude plus 1; its range is −2ⁿ⁻¹ to 2ⁿ⁻¹−1 and it has one zero.',
      },
      {
        term: 'BCD',
        definition:
          'Binary-Coded Decimal: each decimal digit is stored as a 4-bit 8421 code, and the six patterns 1010–1111 are unused.',
      },
    ],
    quiz: [
      {
        question: 'What is 2A₁₆ + 17₁₆?',
        options: ['3F₁₆', '41₁₆', '31₁₆', '4A₁₆'],
        answer: 1,
        explanation:
          '2A₁₆ = 42₁₀ and 17₁₆ = 23₁₀, so the sum is 65₁₀ = 4×16 + 1 = 41₁₆. Option 3F₁₆ is 63₁₀.',
      },
      {
        question: 'Which 8-bit pattern represents −5 in 2’s complement?',
        options: ['1000 0101', '1111 1010', '1111 1011', '0000 0101'],
        answer: 2,
        explanation:
          '+5 = 0000 0101. Invert to 1111 1010 (1’s complement), then add 1 to get 1111 1011. The pattern 1000 0101 is sign-magnitude −5.',
      },
    ],
  },
  {
    chapterId: 'boolean-algebra',
    intro:
      'Boolean algebra handles two values, 0 and 1, with NOT, AND and OR. Its laws and DeMorgan’s theorems rewrite expressions without changing truth tables, and the resulting function maps directly to logic gates. This chapter covers the seven common gates, sum-of-products and product-of-sums forms, simplification, and the division between combinational circuits and clocked sequential circuits built from flip-flops and registers.',
    sections: [
      {
        title: 'Constants, variables and the three operations',
        bullets: [
          'Boolean algebra uses two values: 0 (false) and 1 (true).',
          'A constant is fixed at 0 or 1; a variable such as A or B takes either value.',
          'NOT (A′ or ¬A) inverts: 0 → 1 and 1 → 0.',
          'AND (A·B or AB) is 1 only when both inputs are 1.',
          'OR (A+B) is 1 when at least one input is 1; 1+1 = 1, not 2.',
          'Precedence is NOT, then AND, then OR; brackets override; n variables give 2ⁿ truth-table rows.',
        ],
        code: `A B | A' | A·B | A+B
0 0 | 1  |  0  |  0
0 1 | 1  |  0  |  1
1 0 | 0  |  0  |  1
1 1 | 0  |  1  |  1`,
      },
      {
        title: 'Boolean laws and identities',
        bullets: [
          'Identity: A+0 = A, A·1 = A. Null: A+1 = 1, A·0 = 0.',
          'Idempotent: A+A = A, A·A = A. Complement: A+A′ = 1, A·A′ = 0.',
          'Double negation: (A′)′ = A.',
          'Commutative and associative laws allow reordering and regrouping of OR and AND terms.',
          'Distributive: A(B+C) = AB+AC and A+BC = (A+B)(A+C).',
          'Absorption: A+AB = A, A(A+B) = A. Consensus: AB+A′C+BC = AB+A′C.',
          'Every identity is proved by checking all input rows of a truth table.',
        ],
        table: {
          caption: 'Boolean laws and identities',
          headers: ['Law', 'OR form', 'AND form'],
          rows: [
            ['Identity', 'A + 0 = A', 'A · 1 = A'],
            ['Null (domination)', 'A + 1 = 1', 'A · 0 = 0'],
            ['Idempotent', 'A + A = A', 'A · A = A'],
            ['Complement', 'A + A′ = 1', 'A · A′ = 0'],
            ['Double negation', '(A′)′ = A', '—'],
            ['Commutative', 'A + B = B + A', 'A · B = B · A'],
            ['Associative', '(A + B) + C = A + (B + C)', '(A · B) · C = A · (B · C)'],
            ['Distributive', 'A + BC = (A + B)(A + C)', 'A(B + C) = AB + AC'],
            ['Absorption', 'A + AB = A', 'A(A + B) = A'],
            ['Consensus', 'AB + A′C + BC = AB + A′C', '(A + B)(A′ + C)(B + C) = (A + B)(A′ + C)'],
          ],
        },
      },
      {
        title: 'DeMorgan’s theorems and worked simplification',
        bullets: [
          '(A·B)′ = A′ + B′: the complement of an AND is the OR of the complements.',
          '(A+B)′ = A′·B′: the complement of an OR is the AND of the complements.',
          'General form: (ABC…)′ = A′+B′+C′+… and (A+B+C…)′ = A′B′C′…',
          'Rule: complement each variable, swap · with +, and remove the outer bar.',
          'NAND gives (AB)′ and NOR gives (A+B)′; either gate can build NOT, AND and OR.',
          'Do not write (A+B)′ as A′+B′; the operator must change.',
        ],
        code: `Simplify F = (A'B + AB')'

Step 1  (X + Y)' = X'Y'          DeMorgan
        F = (A'B)' · (AB')'

Step 2  (XY)' = X' + Y'          DeMorgan
        F = (A + B') · (A' + B)

Step 3  expand
        F = AA' + AB + A'B' + B'B

Step 4  AA' = 0, B'B = 0
        F = AB + A'B'            (XNOR)

Check: 00 -> 1, 01 -> 0, 10 -> 0, 11 -> 1`,
      },
      {
        title: 'Logic gates and their truth tables',
        bullets: [
          'AND: output 1 only when all inputs are 1.',
          'OR: output 1 when any input is 1.',
          'NOT: single-input inverter; a bubble on an input or output marks inversion.',
          'NAND = AND followed by NOT; NOR = OR followed by NOT; both are universal gates.',
          'XOR: output 1 when inputs differ. XNOR: output 1 when inputs match.',
          'XOR gives the sum bit of a half adder; XNOR detects equality.',
          'Truth tables define logic; propagation delay and fan-out are electrical limits.',
        ],
        table: {
          caption: 'Truth table for the seven common gates',
          headers: ['A', 'B', 'NOT A', 'AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'],
          rows: [
            ['0', '0', '1', '0', '0', '1', '1', '0', '1'],
            ['0', '1', '1', '0', '1', '1', '0', '1', '0'],
            ['1', '0', '0', '0', '1', '1', '0', '1', '0'],
            ['1', '1', '0', '1', '1', '0', '0', '0', '1'],
          ],
        },
      },
      {
        title: 'SOP, POS and simplification',
        bullets: [
          'Literal: a variable or its complement. A product term ANDs literals; a sum term ORs them.',
          'Minterm: a product term containing every variable once; it is 1 for exactly one row.',
          'Canonical SOP: OR of the minterms where F = 1; AND gates feed an OR gate.',
          'Maxterm: a sum term containing every variable once; it is 0 for exactly one row.',
          'Canonical POS: AND of the maxterms where F = 0; OR gates feed an AND gate.',
          'Example: F(A,B) = Σm(1,2,3) = A′B + AB′ + AB = A + B; ΠM(0) = (A + B).',
          'Karnaugh map: group adjacent 1s in 1, 2, 4 or 8 cells; drop the variable that changes inside a group, then verify against the truth table.',
        ],
        code: `F(A,B) = Σm(1,2,3)
       = A'B + AB' + AB
       = A'B + A(B' + B)
       = A'B + A
       = A + B

POS: F = ΠM(0) = (A + B)

K-map (A rows, B columns):
        B=0   B=1
A=0      0     1
A=1      1     1

Group the two 1s in column B=1 -> B
Group the two 1s in row A=1    -> A
F = A + B`,
      },
      {
        title: 'Combinational versus sequential circuits',
        bullets: [
          'Combinational: output depends only on present inputs; no memory; same inputs give the same output after propagation delay.',
          'Sequential: output depends on present inputs and stored state, so past inputs can affect the present output.',
          'SR flip-flop: set (S=1) forces Q=1, reset (R=1) forces Q=0; S=R=1 is invalid in the basic NOR latch.',
          'D flip-flop: Q(next) = D at the active clock edge. JK flip-flop toggles when J=K=1.',
          'Register: n flip-flops sharing a clock, storing an n-bit word.',
          'Accumulator: a register plus adder feedback; it holds a running arithmetic result.',
          'Clock period must cover clock-to-Q delay, the longest combinational delay, and flip-flop setup time.',
        ],
        table: {
          caption: 'Combinational versus sequential circuits',
          headers: ['Property', 'Combinational', 'Sequential'],
          rows: [
            ['Output depends on', 'Present inputs only', 'Present inputs and stored state'],
            ['Memory', 'None', 'Flip-flops or latches'],
            ['Clock', 'Not required', 'Usually clocked'],
            ['Examples', 'Adder, multiplexer, decoder, comparator', 'Flip-flop, register, counter, FSM'],
            ['Behaviour', 'Same inputs give the same output', 'Output can depend on input history'],
            ['Design limit', 'Longest propagation delay', 'Clock period and setup/hold times'],
          ],
        },
      },
    ],
    examPoints: [
      'A·0 = 0 and A+1 = 1 are the null laws; A+A′ = 1 and A·A′ = 0 are the complement laws.',
      'DeMorgan: (AB)′ = A′+B′ and (A+B)′ = A′B′.',
      'NAND and NOR are universal gates: either alone can implement NOT, AND and OR.',
      'XOR outputs 1 only when its inputs differ; XNOR outputs 1 when they match.',
      'SOP is an OR of AND terms; POS is an AND of OR terms.',
      'Combinational output depends on present inputs only; sequential output also depends on state stored in flip-flops.',
    ],
    keyTerms: [
      {
        term: 'Minterm',
        definition:
          'A product term containing every variable of the function exactly once, in true or complemented form; it is 1 for exactly one input combination.',
      },
      {
        term: 'Universal gate',
        definition:
          'A gate type, specifically NAND or NOR, from which NOT, AND and OR can be built, so any Boolean function can be realized.',
      },
      {
        term: 'Flip-flop',
        definition:
          'A bistable sequential circuit that stores one bit and changes state in response to defined inputs or a clock edge; it is the building block of registers.',
      },
    ],
    quiz: [
      {
        question: 'Which expression is equivalent to (A + B)′?',
        options: ['A′ + B′', 'A′B′', 'AB', 'A + B'],
        answer: 1,
        explanation:
          'DeMorgan’s theorem for OR states that (A+B)′ = A′·B′. Option A′+B′ is the complement of AB, not of A+B.',
      },
      {
        question: 'Which circuit is sequential?',
        options: [
          'A 4-bit binary adder',
          'A 2-to-1 multiplexer',
          'A D flip-flop',
          'A 3-to-8 decoder',
        ],
        answer: 2,
        explanation:
          'A D flip-flop stores one bit and updates on a clock edge, so its output depends on stored state. Adders, multiplexers and decoders depend only on present inputs and are combinational.',
      },
    ],
  },
];
