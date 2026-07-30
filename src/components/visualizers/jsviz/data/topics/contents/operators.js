const operators = {
    definition: "Operators are symbols that perform operations on values (operands). JavaScript provides arithmetic, logical, comparison, and several modern convenience operators like optional chaining and nullish coalescing.",

    syntax: `// 1. Arithmetic
1 + 2; 5 - 3; 10 * 2; 10 / 2; 10 % 3; 2 ** 3;

// 2. Comparison
5 > 3; 5 === 5; 5 !== 3;

// 3. Logical
true && false; true || false; !true;

// 4. Modern JS Operators
const value = a ?? "fallback";  // Nullish Coalescing
const name = user?.profile?.id; // Optional Chaining
`,

    examples: [
        {
            code: `// 1. Nullish Coalescing (??) vs OR (||)
let count = 0;

let result1 = count || 10; // OR sees 0 as falsy
console.log(result1); // 10 (Maybe not what you wanted!)

let result2 = count ?? 10; // Nullish only looks for null/undefined
console.log(result2); // 0 (Correct!)`,
            explanation: "The `||` operator returns the right side if the left is *any* falsy value (0, '', false). The `??` operator only returns the right side if the left is `null` or `undefined`."
        },
        {
            code: `// 2. Optional Chaining (?.)
const user = { 
  id: 1, 
  // profile is missing
};

// console.log(user.profile.name); // ❌ Throws Error
console.log(user.profile?.name); // ✅ undefined (Safe!)`,
            explanation: "Optional chaining `?.` stops evaluation if the value before it is `null` or `undefined`, preventing the dreaded 'Cannot read property of undefined' error."
        },
        {
            code: `// 3. Strict Equality (===) vs Loose (==)
console.log(5 == "5");  // true (Coercion happens)
console.log(5 === "5"); // false (Type must match)
console.log(null == undefined); // true
console.log(null === undefined); // false`,
            explanation: "Always use `===` (strict equality) to avoid unexpected type coercion bugs."
        }
    ],

    useCases: [
        "**Arithmetic** for calculations, increments, and string concatenation.",
        "**Optional Chaining** when dealing with API responses where data might be nested or missing.",
        "**Nullish Coalescing** for setting default values when `0` or `false` are valid inputs.",
        "**Ternary Operator (`? :`)** for quick conditional assignments in JSX or templates."
    ],

    memoryModel: `### **How Operators Work**

**1. Evaluation:**
- JS Engine evaluates expressions from left to right, following **operator precedence** (PEMDAS).
- Intermediary values are stored in **temporary registers** in the CPU or on the **Stack**.

**2. Short-circuiting:**
- For \`&&\` and \`||\`, the engine stops as soon as the result is certain.
- If \`a\` is false in \`a && b\`, \`b\` is never even looked at in memory.

**3. Type Coercion:**
- If types don't match, JS will often convert them automatically (Coercion) in the **Stack** before performing the operation.`,

    visualizationType: 'variables'
};

export default operators;

