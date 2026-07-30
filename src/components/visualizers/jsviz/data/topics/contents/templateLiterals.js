const templateLiterals = {
    definition: "**Template Literals** (introduced in ES6) are string literals allowing embedded expressions. You can use multi-line strings and string interpolation features with them, providing a much cleaner alternative to old-style concatenation.",

    syntax: `// 1. Backticks instead of quotes
const str = \`Hello\`;

// 2. Expression Interpolation
const name = "Alex";
const greet = \`Hi, \${name}!\`;

// 3. Multi-line
const block = \`
  Line 1
  Line 2
\`;

// 4. Tagged Templates
function myTag(strings, ...values) {
  return strings[0] + values[0];
}
const result = myTag\`I am \${25} years old\`;
`,

    examples: [
        {
            code: `// 1. Clean HTML Generation
const user = { name: "Subhajit", role: "Admin" };

const html = \`
  <div class="user-card">
    <h2>\${user.name}</h2>
    <p>Role: \${user.role}</p>
  </div>
\`;

console.log(html);`,
            explanation: "Template literals make building HTML strings or complex message blocks incredibly readable by preserving whitespace and newlines."
        },
        {
            code: `// 2. Logic inside \${}
const price = 100;
const tax = 0.15;

const total = \`Total: $\${(price * (1 + tax)).toFixed(2)}\`;
console.log(total); // "Total: $115.00"`,
            explanation: "You can put any valid JavaScript expression inside `${}`—not just variables, but function calls and math operations too."
        },
        {
            code: `// 3. Tagged Template Power
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    return \`\${acc}\${str}<strong>\${values[i] || ''}</strong>\`;
  }, '');
}

const name = "JSViz";
const msg = highlight\`Welcome to \${name}!\`;
console.log(msg); // "Welcome to <strong>JSViz</strong>!"`,
            explanation: "Tagged templates allow you to parse template literals with a function. This is how libraries like `styled-components` or `lit-html` work."
        }
    ],

    useCases: [
        "**String Interpolation**: Combining text and variables without messy `+` symbols.",
        "**Multi-line Strings**: Writing SQL queries, HTML templates, or long log messages.",
        "**Localization**: Passing strings to a tag function for automatic translation.",
        "**Security**: Using tag functions to escape user input before inserting into the DOM."
    ],

    memoryModel: `### **String Construction**

**1. Evaluation Phase:**
- The engine evaluates every expression inside \`\${}\` first in the **Stack**.
- It then concatenates the static parts and dynamic results into a **new String object**.

**2. Constant Strings:**
- Static parts of the template are stored in the **String Pool** in the **Heap** to save memory.

**3. Performance:**
- While template literals are slightly more complex to parse than single quotes, modern engines optimize them heavily. They are generally faster than manual concatenation using \`+\` for multiple variables.`,

    visualizationType: 'variables'
};

export default templateLiterals;

