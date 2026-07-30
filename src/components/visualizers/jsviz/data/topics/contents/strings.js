const strings = {
    definition: "Strings are sequences of characters used to represent text. In JavaScript, strings are **primitives**, meaning they are immutable, but they have access to a rich set of methods through a wrapper object.",

    syntax: `// 1. Creation
const s1 = 'Single';
const s2 = "Double";
const s3 = \`Template \${s1}\`; // Backticks

// 2. Access
s1[0]; // 'S'
s1.length; // 6

// 3. Methods (All return NEW strings)
s1.toUpperCase();
s1.split('');
s1.slice(0, 3);
`,

    examples: [
        {
            code: `// 1. Template Literals
const user = "Subhajit";
const points = 100;

// Multiline + Variable Interpolation
const msg = \`Hello \${user},
You have \${points} points.\`;

console.log(msg);`,
            explanation: "Backticks allow for multiline strings and embedding variables directly with `${}` syntax, replacing old-fashioned concatenation with `+`."
        },
        {
            code: `// 2. Searching & Checking
const email = "contact@example.com";

console.log(email.includes("@")); // true
console.log(email.startsWith("contact")); // true
console.log(email.endsWith(".com")); // true`,
            explanation: "Modern string methods make checking content much cleaner than using `indexOf() !== -1`."
        },
        {
            code: `// 3. Modification (Pure)
const raw = "  hello world  ";
const clean = raw.trim().replace("hello", "hi").toUpperCase();

console.log(clean); // "HI WORLD"
console.log(raw);   // "  hello world  " (Original remains untouched)`,
            explanation: "Strings are **immutable**. Methods like `trim()`, `replace()`, and `toUpperCase()` always return a **new string** and do not change the original."
        }
    ],

    useCases: [
        "**Text Input**: Handling user input from forms.",
        "**URL Construction**: Building dynamic API paths.",
        "**HTML Generation**: Using template literals to build components or templates.",
        "**Data Cleaning**: Trimming whitespace or normalizing casing before storage."
    ],

    memoryModel: `### **Strings in Memory**

**1. Primitive Storage:**
- Strings are stored in the **Stack** (if short) or a special **String Pool** in the **Heap**.
- Because they are immutable, the engine can optimize by pointing multiple variables to the same memory location if the strings are identical.

**2. Immutability:**
- When you "change" a string, the engine actually creates a **brand new string** in memory and updates the variable to point to the new address.
- Old unused strings are eventually cleaned up by the **Garbage Collector**.

**3. UTF-16:**
- JS strings are encoded in **UTF-16**. Most characters take 2 bytes, but some (like emojis) take 4 bytes. 
- **Performance:** Complex string building in loops should use an Array + \`join()\` to avoid creating thousands of intermediate strings in memory.`,

    visualizationType: 'variables'
};

export default strings;

