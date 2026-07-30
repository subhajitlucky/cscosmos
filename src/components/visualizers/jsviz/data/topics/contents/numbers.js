const numbers = {
    definition: "In JavaScript, **Numbers** are 64-bit double-precision binary floating-point values (IEEE 754). This single type handles both integers and decimals, which leads to some unique behaviors like precision limits.",

    syntax: `// 1. Literal numbers
const int = 42;
const dec = 3.14;
const exp = 1e6; // 1,000,000

// 2. Constants (Number object)
Number.MAX_SAFE_INTEGER;
Number.MIN_VALUE;
Number.NaN;

// 3. Methods
(12.345).toFixed(2); // "12.35"
Number.parseInt("10px"); // 10
Number.isFinite(Infinity); // false
`,

    examples: [
        {
            code: `// 1. The 0.1 + 0.2 Paradox
const result = 0.1 + 0.2;
console.log(result); // 0.30000000000000004
console.log(result === 0.3); // false`,
            explanation: "Due to how binary floating-point math works, some decimals cannot be represented exactly. For financial calculations, always work with cents (integers) or use libraries like `decimal.js`."
        },
        {
            code: `// 2. Safe Integers
const max = Number.MAX_SAFE_INTEGER; // 2^53 - 1
console.log(max);
console.log(max + 1); // ✅ Works
console.log(max + 2); // ❌ Same result as max+1 (Precision lost!)`,
            explanation: "JavaScript numbers only guarantee precision up to ~15-17 significant digits. If you need larger numbers, use `BigInt`."
        },
        {
            code: `// 3. Special Values
console.log(1 / 0);      // Infinity
console.log(-1 / 0);     // -Infinity
console.log(0 / 0);      // NaN (Not a Number)
console.log(typeof NaN); // "number" (The ultimate irony)`,
            explanation: "Infinity and NaN are technically part of the Number type. NaN results from failed math operations like `Math.sqrt(-1)`."
        }
    ],

    useCases: [
        "**General Math**: Counters, indices, and simple calculations.",
        "**Formatting**: Using `.toLocaleString()` to display currency correctly.",
        "**Parsing**: Extracting numbers from CSS strings or user input using `parseInt`.",
        "**Validation**: Checking if a value is safe to use with `Number.isSafeInteger()`."
    ],

    memoryModel: `### **Binary Representation**

**1. IEEE 754 Standard:**
- Every number takes **8 bytes (64 bits)** in memory.
- **1 bit** for sign, **11 bits** for exponent, and **52 bits** for fraction (mantissa).

**2. Storage Location:**
- Small integers are often optimized by engines (like V8) to stay in the **Stack** as 31-bit or 32-bit values (called SMIs). 
- Larger numbers or doubles are stored in the **Heap** as "heap numbers."

**3. CPU Context:**
- Math operations are performed directly by the **Floating Point Unit (FPU)** in the CPU. 
- **Performance:** Adding two optimized integers is significantly faster than adding two heap-allocated doubles.`,

    visualizationType: 'variables'
};

export default numbers;

