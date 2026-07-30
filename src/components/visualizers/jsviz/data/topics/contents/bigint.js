/* eslint-disable */
const bigint = {
    definition: "**BigInt** (introduced in ES2020) is a numeric primitive that can represent integers with arbitrary precision. Unlike the \`Number\` type, BigInt doesn't lose precision at very high values (beyond \`2^53 - 1\`).",

    syntax: `// 1. Literal (n suffix)
const large = 9007199254740991n;

// 2. Constructor
const big = BigInt("9007199254740991");

// 3. Comparison
10n > 5; // true
10n == 10; // true
10n === 10; // false (Types differ)
`,

    examples: [
        {
            code: `// 1. Precise Large Numbers
const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991

console.log(maxSafe + 1); // 9007199254740992
console.log(maxSafe + 2); // 9007199254740992 (Incorrect!)

const big = BigInt(maxSafe);
console.log(big + 1n); // 9007199254740992n
console.log(big + 2n); // 9007199254740993n (Correct!)`,
            explanation: "BigInt allows you to perform exact integer math on numbers larger than what the standard `Number` type can handle."
        },
        {
            code: `// 2. No Mixing with Numbers
const big = 10n;
const num = 5;

// console.log(big + num); // ❌ TypeError
console.log(big + BigInt(num)); // ✅ 15n`,
            explanation: "You cannot mix BigInts and regular Numbers in math operations to avoid accidental precision loss. You must explicitly convert one type to the other."
        },
        {
            code: `// 3. Integer Division
console.log(5n / 2n); // 2n (Not 2.5n!)`,
            explanation: "Division with BigInts always rounds towards zero (it truncates the decimal) because BigInt only represents whole integers."
        }
    ],

    useCases: [
        "**Financial Tech**: Handling large currency amounts or transaction IDs.",
        "**Cryptography**: Working with large prime numbers or hashes.",
        "**Database IDs**: Managing 64-bit or 128-bit IDs from SQL databases.",
        "**Scientific Computing**: High-precision integer simulations."
    ],

    memoryModel: `### **Arbitrary Precision Storage**

**1. Variable Sizing:**
- Unlike Numbers (which are always 8 bytes), BigInts are stored in the **Heap** as a dynamically sized structure.
- The more digits you have, the more **RAM** the BigInt consumes.

**2. Storage Format:**
- Internally, BigInts are stored as an array of "digits" (usually in base 2^32 or base 2^64). 
- The engine uses **Arbitrary-Precision Arithmetic** algorithms to perform operations on these arrays.

**3. Performance:**
- BigInt math is significantly slower than standard Number math because it cannot be performed in a single **CPU instruction**. It requires multiple cycles to process the digit arrays.`,

    visualizationType: 'variables'
};

export default bigint;

