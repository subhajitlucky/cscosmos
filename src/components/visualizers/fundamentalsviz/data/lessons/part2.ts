import type { ITLesson } from './types';

export const part2Lessons: ITLesson[] = [
  {
    chapterId: 'number-systems',
    hook:
      'A single byte can be a letter, a signed number, or part of an address; only the agreed representation tells you which.',
    plainEnglish:
      'Number systems are different ways of writing the same value, and data representation is the set of rules that gives those bits meaning.',
    oneIdea:
      'Every base is positional, every signed format trades range for negatives, and every character code is a mapping from symbols to numbers.',
    whyItMatters:
      'Exams and real systems ask you to convert bases, read hex dumps, detect overflow, and decode text. These skills turn raw bit patterns into numbers, text, and diagnosable errors.',
    objectives: [
      'Convert integers among binary, octal, decimal and hexadecimal using place value and bit grouping.',
      'Add and subtract in binary, octal and hexadecimal, then check the result in decimal.',
      'Encode decimal digits in BCD and excess-3, and represent signed integers in sign-magnitude, 1’s and 2’s complement.',
      'Distinguish ASCII, EBCDIC and Unicode, and relate bits, bytes and word size to storage limits.',
    ],
    sections: [
      {
        title: 'Positional notation and bases',
        body:
          'In a positional number system, the value of a digit depends on its position. Each position carries a weight equal to the base raised to a power. The base, also called the radix, is the count of distinct digits the system uses. Decimal has base 10 and digits 0–9. Binary has base 2 and digits 0 and 1. Octal has base 8 and digits 0–7. Hexadecimal has base 16 and uses 0–9 plus A–F, where A is 10 and F is 15. To evaluate a numeral, multiply each digit by its weight and add the products. The rightmost position has weight base^0 = 1; the next has base^1; and so on. Fractional positions use negative powers. For example, binary 1011 means 1×8 + 0×4 + 1×2 + 1×1 = 11. Hex 2F means 2×16 + 15×1 = 47. The subscript often shows the base, as in 1011₂ or 2F₁₆. Without that mark, 11 could mean eleven, three, or nine. Each digit is limited to base − 1, and the method works for any base greater than one.',
        code: `Position:   3    2    1    0
Weight 2^:  8    4    2    1
Binary:     1    0    1    1   -> 8 + 0 + 2 + 1 = 11

Hex 2F = 2×16 + 15×1 = 47`,
      },
      {
        title: 'Converting between bases',
        body:
          'Conversion is easiest when you move through a base you already know. Binary to decimal: write the place values and add the switched-on weights. Binary 1101 0110 is 128 + 64 + 16 + 4 + 2 = 214. Decimal to binary: divide repeatedly by 2, record the remainders, and read them upward. One hundred fifty-six gives 1001 1100. Octal and hexadecimal are shortcuts for binary. Every octal digit is exactly three bits; every hex digit is exactly four bits. A nibble is four bits, or half a byte. Group from the binary point outward, pad the ends with zeros, then translate each group. Thus 1001 1100 is 9C in hex and 234 in octal. Going back, replace each octal or hex digit with its three- or four-bit pattern. Hex is preferred in computing because two digits describe one byte exactly. Octal survives in file permissions. Decimal remains the interface for people. Mastering one direction makes the reverse mechanical. Check each conversion by expanding the result back into decimal.',
        code: `Decimal 156:
156 ÷ 2 = 78 r 0
 78 ÷ 2 = 39 r 0
 39 ÷ 2 = 19 r 1
 19 ÷ 2 =  9 r 1
  9 ÷ 2 =  4 r 1
  4 ÷ 2 =  2 r 0
  2 ÷ 2 =  1 r 0
  1 ÷ 2 =  0 r 1   -> 1001 1100

1001 1100 = 9C hex = 234 octal = 156 decimal
Grouping: 1001|1100 -> 9|C ; 010|011|100 -> 2|3|4`,
      },
      {
        title: 'Arithmetic in binary, octal and hexadecimal',
        body:
          'Addition in any base follows the same rule: add column by column, and carry when the sum reaches the base. In binary, 1 + 1 = 10, so write 0 and carry 1. Add 1011 and 0110: from the right, 1 + 0 = 1, 1 + 1 = 10 (write 0, carry 1), 0 + 1 + 1 = 10 (write 0, carry 1), and 1 + 0 + 1 = 10, giving 10001, or 17. Subtraction borrows the base, not ten. In binary, borrowing adds 2 to the current column. In octal, 7 + 1 = 10 and a borrow adds 8. In hex, F + 1 = 10 and a borrow adds 16. Letters make hex column sums easy to misread, so convert them mentally to 10–15. Multiplication is repeated shift-and-add in binary: 1101 × 101 is 1101 + 0000 shifted + 1101 shifted twice, giving 1000001. Hex multiplication is rarely done by hand; convert to binary or decimal. Always verify by converting the operands and result to decimal.',
        code: `Binary:  1011 + 0110 = 10001   (11 + 6 = 17)
Octal:    17 +  25 =   44      (15 + 21 = 36)
Hex:      2A +  17 =   41      (42 + 23 = 65)

  1011
+ 0110
------
 10001  -> carry 1 when a column reaches 2`,
      },
      {
        title: 'BCD and excess-3',
        body:
          'Binary-coded decimal, or BCD, stores each decimal digit separately in four bits. The common form is called 8421 BCD because the bit weights are 8, 4, 2, and 1. The number 259 becomes 0010 0101 1001, not the pure binary 1 0000 0011. BCD makes decimal display easy, since each nibble maps to one digit, but it wastes the six patterns 1010 through 1111 and needs correction logic after addition. Add 6 whenever a nibble sum exceeds 9 or produces a carry. Excess-3 is a related code formed by adding 3 to each decimal digit before encoding it in binary. Digit 0 becomes 0011, 4 becomes 0111, and 9 becomes 1100. The code is self-complementing: inverting every bit of an excess-3 digit gives the code for 9 minus that digit. That property simplifies nine’s-complement subtraction. Both codes appear in decimal displays, calculators, and older exam questions. A BCD adder therefore needs a correction stage beyond ordinary binary addition. Neither code is a general replacement for binary arithmetic.',
        code: `Decimal   8421 BCD   Excess-3
0         0000       0011
1         0001       0100
4         0100       0111
9         1001       1100

259 in BCD: 0010 0101 1001`,
      },
      {
        title: 'Signed integers: sign-magnitude, 1’s and 2’s complement',
        body:
          'Unsigned binary cannot express negative values, so three schemes add a sign. In sign-magnitude, the leftmost bit is the sign, 0 for positive and 1 for negative, and the rest is the magnitude. So 0000 0101 is +5 and 1000 0101 is −5. This scheme has two zeros, 0000 0000 and 1000 0000, and addition needs separate sign logic. In 1’s complement, negative values are formed by inverting every bit: −5 is 1111 1010. It also has two zeros, and addition requires an end-around carry, meaning an extra carry out of the leftmost bit is added back at the right. In 2’s complement, invert every bit and add one: −5 is 1111 1011. There is one zero, and addition and subtraction use ordinary binary addition. The 8-bit range is −128 to +127. The leftmost bit still shows the sign, but its place value is −128, not −0. That is why 1000 0000 represents −128 and not zero. To subtract, take the 2’s complement of the subtrahend and add. The same rules extend to 16 or 32 bits; only the range and the sign-bit position change.',
        code: `+5        0000 0101
1's comp  1111 1010
2's comp  1111 1011  = -5

-45:  +45 = 0010 1101
      invert 1101 0010
      add 1  1101 0011

Check: 1101 0011 = -128 + 64 + 16 + 2 + 1 = -45`,
      },
      {
        title: 'Characters, bits, bytes and word size',
        body:
          'Computers store text as numeric codes. ASCII, the American Standard Code for Information Interchange, assigns seven-bit codes to 128 characters: A is 65, a is 97, and 0 is 48. An eighth bit is often added for parity, a simple error-check bit, or for extended characters. EBCDIC, the Extended Binary Coded Decimal Interchange Code, is an eight-bit IBM mainframe code. Its letters are not contiguous, which makes sorting and conversion harder. ASCII and EBCDIC are legacy single-byte sets; neither can represent the world’s scripts. Unicode assigns a code point to every character and now covers more than 150,000 of them. UTF-8, a variable-length byte encoding, preserves ASCII in the first 128 code points and uses up to four bytes for the rest. A bit is one binary digit. Eight bits form a byte, the usual addressable unit. Word size is the number of bits a processor handles at once, such as 32 or 64. Larger words allow wider integers and addresses. A byte can therefore hold one ASCII character or one 8-bit integer, but not both meanings at once.',
        code: `ASCII (7-bit):  A = 65 = 100 0001
                a = 97 = 110 0001
                0 = 48 = 011 0000

Units:  1 byte = 8 bits
        1 KiB  = 1024 bytes
        1 MiB  = 1024 KiB
Word:   width of the CPU's natural register, e.g. 32 or 64 bits`,
      },
    ],
    example: {
      title: 'Representing −45 in eight bits',
      scenario:
        'An exam asks for the 8-bit 2’s complement form of −45 and its signed decimal check. The candidate must show each step, not just the final pattern.',
      steps: [
        {
          action: 'Write the magnitude +45 in 8-bit binary.',
          result: '45 = 32 + 8 + 4 + 1, so the pattern is 0010 1101.',
        },
        {
          action: 'Invert every bit to form the 1’s complement.',
          result: '0010 1101 becomes 1101 0010.',
        },
        {
          action: 'Add 1 to the least significant bit.',
          result:
            '1101 0010 + 1 = 1101 0011, which is −45. Check: −128 + 64 + 16 + 2 + 1 = −45.',
        },
      ],
      conclusion:
        'The 2’s complement of +45 is 1101 0011. The same pattern means 211 if read as unsigned, so the interpretation must always be stated.',
    },
    tradeoff: {
      gain:
        'Hexadecimal compresses four bits into one digit and aligns with byte boundaries, so addresses, colours and masks stay short.',
      cost:
        'People must convert to decimal to judge magnitude, and one wrong hex digit changes the value by up to fifteen place units.',
      verdict:
        'Use hex for bit-level work, decimal for human-facing values, and binary when teaching or writing explicit masks; state the base every time.',
    },
    terms: [
      {
        term: 'Positional notation',
        definition:
          'A number system in which each digit is multiplied by a power of the base determined by its position in the numeral.',
      },
      {
        term: 'Two’s complement',
        definition:
          'A signed binary format formed by inverting every bit of a value and adding one; an n-bit value ranges from −2^(n−1) to 2^(n−1) − 1.',
      },
    ],
    keyTakeaways: [
      'The base sets the digit set and place weights, so the same digits can mean different values in different bases.',
      'Grouping three bits per octal digit and four bits per hex digit makes conversion mechanical.',
      'BCD encodes decimal digits, while 2’s complement encodes signed integers; the two formats answer different questions.',
      'ASCII and EBCDIC are legacy code sets, while UTF-8 encodes all of Unicode and remains compatible with ASCII.',
    ],
    pitfalls: [
      'Reading 10 as ten in every base; 10₂ is two, 10₈ is eight, and 10₁₆ is sixteen.',
      'Adding BCD nibbles without the +6 correction, so 1001 + 0001 becomes 1010 instead of 0001 0000.',
      'Treating the sign bit of a 2’s complement number as a separate minus sign; the leftmost bit carries the negative place value.',
    ],
    focusPoints: [
      'Place-value expansion and grouping bits for base conversion.',
      'The invert-and-add-one procedure for 2’s complement.',
      'The distinction between digit codes, character codes and storage units.',
    ],
    quiz: [
      {
        question: 'What is binary 1101 0110 in hexadecimal?',
        options: ['D6', 'B6', 'E6', '6D'],
        answer: 0,
        explanation:
          'Group the bits as 1101 and 0110. The first group is D (13) and the second is 6, so the value is D6, or 214 in decimal. Reversing the groups gives 6D, which is a different value.',
      },
      {
        question:
          'The 8-bit 2’s complement pattern 1001 1100 represents which decimal value?',
        options: ['−100', '−99', '156', '−28'],
        answer: 0,
        explanation:
          'Invert 1001 1100 to get 0110 0011, then add one to get 0110 0100, which is 100. The leading 1 marks the original pattern as negative, so the value is −100. Read as unsigned, the same bits would be 156.',
      },
    ],
  },
  {
    chapterId: 'boolean-algebra',
    hook:
      'Two circuits that look completely different can compute exactly the same function, and Boolean algebra proves it without building either one.',
    plainEnglish:
      'Boolean algebra is the mathematics of true and false values, and logic circuits are the gates that carry out its operations in hardware.',
    oneIdea:
      'Every digital circuit, from a gate to a processor, is a Boolean function; laws and truth tables let you simplify that function before you wire it.',
    whyItMatters:
      'Simplification lowers chip cost, power use and delay. Truth tables and gate behaviour also explain adders, registers and control logic, which appear throughout computer organization exams.',
    objectives: [
      'State the basic Boolean operations and build truth tables for expressions with up to three variables.',
      'Apply the laws, identities and DeMorgan’s theorems to simplify Boolean expressions.',
      'Write functions in sum-of-products and product-of-sums form and describe the seven common logic gates.',
      'Distinguish combinational from sequential circuits and explain the roles of flip-flops, registers and accumulators.',
    ],
    sections: [
      {
        title: 'Constants, variables and operations',
        body:
          'Boolean algebra deals with values that are either 0 or 1. A Boolean constant is fixed at 0 (false) or 1 (true). A Boolean variable is a symbol such as A or B that can take either value. Three basic operations combine them. NOT, written A′ or ¬A, inverts the value. AND, written A·B or AB, is 1 only when both inputs are 1; it behaves like multiplication. OR, written A + B, is 1 when at least one input is 1; it behaves like addition, except 1 + 1 = 1. These definitions are complete: every larger expression is built from them. Precedence is NOT first, then AND, then OR, with brackets overriding it. A truth table lists every input combination and the resulting output. With n variables there are 2^n rows, so two variables need four rows and three need eight. Truth tables are the ground truth for checking a law, a gate, or a simplified circuit.',
        code: `A B | A' | A·B | A+B
0 0 | 1  |  0  |  0
0 1 | 1  |  0  |  1
1 0 | 0  |  0  |  1
1 1 | 0  |  1  |  1`,
      },
      {
        title: 'Laws and identities',
        body:
          'Boolean laws let you rewrite an expression without changing its truth table. Identity: A + 0 = A and A·1 = A. Null: A + 1 = 1 and A·0 = 0. Idempotent: A + A = A and A·A = A. Complement: A + A′ = 1 and A·A′ = 0. Double negation: (A′)′ = A. Commutative: A + B = B + A and AB = BA. Associative: (A + B) + C = A + (B + C), and likewise for AND. Distributive: A(B + C) = AB + AC and A + BC = (A + B)(A + C). Absorption: A + AB = A and A(A + B) = A. These are not arbitrary rules; each can be checked by enumerating inputs. Two more useful forms are A + A′B = A + B and AB + A′C = AB + A′C + BC, the consensus theorem. Learn the small set and derive the rest rather than memorizing dozens of near-duplicates.',
        code: `Identity     A + 0 = A        A · 1 = A
Null         A + 1 = 1        A · 0 = 0
Idempotent   A + A = A        A · A = A
Complement   A + A' = 1       A · A' = 0
Absorption   A + AB = A       A(A + B) = A
Distributive A(B + C) = AB + AC`,
      },
      {
        title: 'DeMorgan’s theorems',
        body:
          'DeMorgan’s theorems describe how NOT passes through AND and OR. The first says (A·B)′ = A′ + B′: the complement of an AND is the OR of the complements. The second says (A + B)′ = A′·B′: the complement of an OR is the AND of the complements. In words, break the bar and change the operator. The rule extends to any number of variables, so (ABC)′ = A′ + B′ + C′. It also applies to whole expressions, provided you change every operator and complement every term. Engineers use it to convert between AND-OR and OR-AND forms, which matters when only NAND or NOR gates are available. A NAND gate is an AND followed by NOT, so it implements (AB)′ directly. A NOR gate implements (A + B)′. DeMorgan’s laws explain why either gate type alone can build any circuit. Verify each law with a four-row truth table before trusting it. The table makes the equality visible row by row.',
        code: `(A·B)' = A' + B'
(A+B)' = A'·B'

A B | (A·B)' | A' + B' | (A+B)' | A'·B'
0 0 |   1    |    1    |   1    |   1
0 1 |   1    |    1    |   0    |   0
1 0 |   1    |    1    |   0    |   0
1 1 |   0    |    0    |   0    |   0`,
      },
      {
        title: 'The seven common logic gates',
        body:
          'Logic gates are physical circuits that implement Boolean operations. AND outputs 1 only when all inputs are 1. OR outputs 1 when any input is 1. NOT, also called an inverter, outputs the opposite value. NAND is AND followed by NOT; NOR is OR followed by NOT. XOR, exclusive OR, outputs 1 when the inputs differ, which makes it useful for addition and parity, a check bit that makes the number of 1s odd or even. XNOR is its complement and outputs 1 when the inputs match. NAND and NOR are called universal gates because either can implement AND, OR, and NOT with suitable wiring. That is why chip libraries often standardize on one type. XOR has no direct universal claim, but it is cheap in arithmetic circuits. Gate symbols matter in exams: a small circle at the output means inversion, and a curved input side marks OR while a straight side marks AND. Propagation delay is the time a gate takes to settle after an input changes, and fan-out is how many inputs one output can drive. Power also shapes real designs, but truth tables define logical behaviour.',
        code: `A B | AND | OR | NAND | NOR | XOR | XNOR
0 0 |  0  | 0  |  1   |  1  |  0  |  1
0 1 |  0  | 1  |  1   |  0  |  1  |  0
1 0 |  0  | 1  |  1   |  0  |  1  |  0
1 1 |  1  | 1  |  0   |  0  |  0  |  1

NOT: 0 -> 1, 1 -> 0`,
      },
      {
        title: 'SOP, POS and simplification',
        body:
          'Any Boolean function can be written as a sum of products, or SOP: an OR of AND terms. Each product is a minterm when it contains every variable exactly once, in true or complemented form. The function is 1 for the minterms listed. An alternative is product of sums, or POS: an AND of OR terms. A maxterm is an OR term with every variable once, false for exactly one input combination. The function is 0 for the maxterms listed. SOP maps naturally to AND gates feeding an OR gate; POS maps to OR gates feeding an AND gate. Simplification reduces gate count and delay. Use Boolean laws to remove redundant terms, or a Karnaugh map to group adjacent 1s in powers of two. Groups may wrap around edges and may overlap. Each group becomes one product term with the changing variable removed. A Karnaugh map handles up to four variables comfortably; beyond that, tabular methods or software are safer. Do not stop at a form that is merely different; stop when no literal can be removed. Always check the simplified expression against the original truth table.',
        code: `F = A'BC + AB'C + ABC' + ABC
  = BC(A' + A) + AC(B' + B) + AB(C' + C)
  = BC + AC + AB`,
      },
      {
        title: 'Combinational versus sequential circuits',
        body:
          'A combinational circuit’s output depends only on the present inputs. Adders, multiplexers, decoders, and the gates above are combinational. Feed the same inputs and you always get the same output. A sequential circuit also depends on past inputs, because it contains memory. Its output is a function of present inputs and the stored state. A flip-flop is the basic one-bit memory element. An SR flip-flop sets or resets its output; a D flip-flop copies the input on a clock edge; a JK flip-flop can toggle. A register is a group of flip-flops that stores a word, often with a shared clock. An accumulator is a register that holds a running result, such as the sum in a processor’s arithmetic unit. It is central to a simple stored-program machine, because it feeds one operand back into every arithmetic step. Sequential circuits use stored state to remember the past. Clocked sequential circuits use a clock to order events. Combinational circuits do not, although real gates still take time to settle.',
        code: `Combinational: output = f(inputs)
  adder, decoder, multiplexer, arithmetic unit logic

Sequential: output = f(inputs, stored state)
  SR flip-flop: set / reset / hold
  D flip-flop:  Q(next) = D at clock edge
  Register:     n flip-flops hold n bits
  Accumulator:  register + adder feedback loop`,
      },
    ],
    example: {
      title: 'Simplifying a three-variable expression',
      scenario:
        'An exam gives F = AB + A(B + C) + B(B + C) and asks for the simplest sum-of-products form. The marks are for the laws used, not for a guess.',
      steps: [
        {
          action: 'Distribute AND over OR in both bracketed terms.',
          result: 'F = AB + AB + AC + B + BC.',
        },
        {
          action: 'Apply idempotence to AB + AB and absorption to B + BC.',
          result: 'AB + AB = AB, and B + BC = B(1 + C) = B, so F = AB + AC + B.',
        },
        {
          action: 'Absorb AB into B, because B + AB = B(1 + A) = B.',
          result: 'F = B + AC, a two-term expression that needs one OR gate and one AND gate instead of the original circuit.',
        },
      ],
      conclusion:
        'The original and simplified expressions have the same truth table. Simplification removed redundant terms rather than changing the function.',
    },
    tradeoff: {
      gain:
        'Simplified two-level logic cuts gate count and propagation delay, and a truth table gives an unambiguous specification.',
      cost:
        'Chasing the absolute minimum can add inverted inputs and shared-term wiring, and sequential state introduces clocking and timing hazards.',
      verdict:
        'Simplify until the function is clear, correct and fast enough, then stop; a readable circuit that meets timing beats a minimal one nobody can debug.',
    },
    terms: [
      {
        term: 'Sum of products (SOP)',
        definition:
          'A Boolean expression written as an OR of AND terms, where each product selects input combinations that make the function 1.',
      },
      {
        term: 'Flip-flop',
        definition:
          'A two-state sequential circuit that stores one bit and changes state only in response to defined inputs or a clock edge.',
      },
    ],
    keyTakeaways: [
      'Boolean values are 0 and 1, and NOT, AND and OR are enough to build every expression.',
      'Laws and DeMorgan’s theorems allow rewriting without changing the truth table.',
      'SOP and POS are two standard forms; Karnaugh maps group adjacent 1s to simplify SOP expressions.',
      'Combinational outputs depend on present inputs, while sequential outputs also depend on stored state.',
    ],
    pitfalls: [
      'Writing (A + B)′ as A′ + B′; DeMorgan’s theorem requires changing OR to AND, so the correct result is A′·B′.',
      'Assuming 1 + 1 equals 2 in Boolean algebra; the OR of two true values is still 1.',
      'Treating a flip-flop as combinational, then wondering why the circuit needs a clock.',
    ],
    focusPoints: [
      'Truth-table construction and the seven gate output patterns.',
      'DeMorgan transformations and algebraic simplification laws.',
      'The boundary between combinational logic and clocked sequential storage.',
    ],
    quiz: [
      {
        question: 'Which expression is equivalent to A + A′B?',
        options: ['A + B', 'AB', 'A', 'B'],
        answer: 0,
        explanation:
          'Use A + A′B = (A + A′)(A + B) = 1·(A + B) = A + B. The term A′B covers the case where A is 0 and B is 1, so B must remain in the result.',
      },
      {
        question: 'Which device is a sequential circuit?',
        options: [
          'A 2-to-1 multiplexer',
          'A 4-bit binary adder',
          'A D flip-flop',
          'A 3-to-8 decoder',
        ],
        answer: 2,
        explanation:
          'A D flip-flop stores one bit and its next output depends on the clock edge, so it has memory and is sequential. Multiplexers, adders and decoders depend only on present inputs and are combinational.',
      },
    ],
  },
];
