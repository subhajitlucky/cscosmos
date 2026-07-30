const regex = {
    definition: "**Regular Expressions (Regex)** are patterns used to match character combinations in strings. In JavaScript, they are objects that provide a powerful way to search, extract, and replace text data.",

    syntax: `// 1. Literal Creation
const re = /pattern/flags;

// 2. Constructor Creation
const re2 = new RegExp("pattern", "flags");

// 3. Flags
// g: Global (don't stop at first match)
// i: Case-insensitive
// m: Multiline
// u: Unicode
// y: Sticky
`,

    examples: [
        {
            code: `// 1. Basic Search & Validation
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
const testEmail = "subhajit@example.com";

console.log(emailPattern.test(testEmail)); // true
console.log(emailPattern.test("bad-email")); // false`,
            explanation: "The `.test()` method is the fastest way to check if a string matches a pattern. It returns a simple boolean."
        },
        {
            code: `// 2. Extracting Data (Groups)
const dateStr = "2025-12-17";
const pattern = /^(\\d{4})-(\\d{2})-(\\d{2})$/;

const match = dateStr.match(pattern);
if (match) {
  console.log("Year:", match[1]);  // 2025
  console.log("Month:", match[2]); // 12
  console.log("Day:", match[3]);   // 17
}`,
            explanation: "Parentheses `()` create **Capture Groups**. When using `.match()`, you can extract specific parts of the pattern from the result array."
        },
        {
            code: `// 3. Replace with Pattern
const text = "JS is fun. JS is fast.";
const clean = text.replace(/JS/g, "JavaScript");

console.log(clean); // "JavaScript is fun. JavaScript is fast."`,
            explanation: "The global flag `/g` ensures that all occurrences are replaced, not just the first one. Regular strings in `.replace()` only replace the first match."
        }
    ],

    useCases: [
        "**Form Validation**: Checking emails, passwords, and phone numbers.",
        "**Data Extraction**: Pulling info (like links or hashtags) out of large text blocks.",
        "**Search & Highlight**: Finding keywords in a document.",
        "**Log Parsing**: Formatting server logs for better readability."
    ],

    memoryModel: `### **Regex in Memory**

**1. Object Allocation:**
- A Regex literal is created only once when the script is loaded.
- A Regex constructor creates a **new object** in the **Heap** every time it runs.

**2. The State Machine:**
- Internally, the engine compiles your Regex into a **Deterministic Finite Automaton (DFA)** or NFA.
- This state machine lives in the **RAM** and is used by the **CPU** to quickly walk through the target string.

**3. Performance (ReDoS):**
- Some patterns (like "greedy" quantifiers) can cause "catastrophic backtracking," making the **CPU** work exponentially harder. 
- **Safety:** Always avoid nested quantifiers like \`(a+)+\` which can freeze the browser.`,

    visualizationType: 'variables'
};

export default regex;

