/* eslint-disable */
const json = {
    definition: "**JSON** (JavaScript Object Notation) is a lightweight data-interchange format. It is a text-based, language-independent format that is easy for humans to read/write and easy for machines to parse/generate.",

    syntax: `// 1. Serialization (Object to String)
JSON.stringify(obj);

// 2. Deserialization (String to Object)
JSON.parse(jsonString);

// 3. With Formatting (Pretty-print)
JSON.stringify(obj, null, 2);
`,

    examples: [
        {
            code: `// 1. Basic Parse & Stringify
const user = { id: 1, name: \"Subhajit\" };

const jsonString = JSON.stringify(user);
console.log(typeof jsonString); // \"string\"

const backToObj = JSON.parse(jsonString);
console.log(backToObj.name); // \"Subhajit\"`,
            explanation: "`JSON.stringify` converts a JS object into a string for transport (like an API call). `JSON.parse` converts it back into a usable object."
        },
        {
            code: `// 2. The Replacer & Reviver
const data = { date: new Date(), secret: \"password\" };

const filtered = JSON.stringify(data, (key, value) => {
  return key === \"secret\" ? undefined : value;
});

console.log(filtered); // \"{\\\"date\\\":\\\"2025-12-17T...\\\"}\"`,
            explanation: "You can pass a function to `stringify` to filter out properties (like passwords) or format data during serialization."
        },
        {
            code: `// 3. Deep Cloning Hack
const original = { a: 1, b: { c: 2 } };
const clone = JSON.parse(JSON.stringify(original));

clone.b.c = 99;
console.log(original.b.c); // 2 (Original is safe!)`,
            explanation: "While modern JS has `structuredClone()`, stringifying and parsing is a classic hack to deep-copy an object without maintaining references."
        }
    ],

    useCases: [
        "**APIs**: Sending and receiving data from web servers.",
        "**Storage**: Saving settings or state in `localStorage`.",
        "**Config**: Managing app settings in `.json` files.",
        "**Logging**: Sending structured event data to monitoring tools."
    ],

    memoryModel: `### **Parsing & Allocation**

**1. String to Object:**
- When \`JSON.parse()\` runs, the engine scans the string and builds a corresponding **Object Tree** in the **Heap**.
- This can be memory-intensive for large files.

**2. Serialization:**
- \`JSON.stringify()\` "walks" the object tree in memory and converts it into a **UTF-16 string** in the **RAM**.

**3. Performance:**
- JSON parsing is a "blocking" operation on the main thread. 
- **Rule:** For extremely large JSON objects (MBs), consider streaming the data or parsing it in a **Web Worker** to avoid freezing the **CPU** and UI.`,

    visualizationType: 'variables'
};

export default json;

