/* eslint-disable */
const date = {
    definition: "The **Date** object represents a single moment in time in a platform-independent format. Dates are stored as the number of milliseconds since January 1, 1970, UTC (the Unix Epoch).",

    syntax: `// 1. Current Time
const now = new Date();

// 2. Specific Time
const day = new Date("2025-12-17");
const specific = new Date(2025, 11, 17, 10, 30); // Dec 17, 10:30

// 3. Static Methods
Date.now(); // Timestamp in ms
Date.parse(\"2025-12-17\");
`,

    examples: [
        {
            code: `// 1. The Month Pitfall
// Warning: Months are 0-indexed (0=Jan, 11=Dec)
const dec = new Date(2025, 11, 17);

console.log(dec.getMonth()); // 11
console.log(dec.getDate());  // 17
console.log(dec.getFullYear()); // 2025`,
            explanation: "One of the most common JS bugs: months start at 0, but dates start at 1. `new Date(2025, 11)` is December, not November."
        },
        {
            code: `// 2. Formatting Dates
const now = new Date();

console.log(now.toDateString()); // \"Wed Dec 17 2025\"
console.log(now.toISOString());  // \"2025-12-17T...\"
console.log(now.toLocaleDateString('en-GB')); // \"17/12/2025\"`,
            explanation: "JS provides several methods to format dates. `toISOString` is best for storage/APIs, while `toLocaleDateString` is best for displaying to users."
        },
        {
            code: `// 3. Calculating Time Difference
const start = new Date(\"2025-01-01\");
const end = new Date(\"2025-12-17\");

const diffMs = end - start; // Auto-converts to ms
const diffDays = diffMs / (1000 * 60 * 60 * 24);

console.log(Math.floor(diffDays)); // 350`,
            explanation: "Subtracting two dates returns the difference in **milliseconds**. You can then divide to get seconds, minutes, or days."
        }
    ],

    useCases: [
        "**Timestamps**: Recording when a message was sent or an order was placed.",
        "**Scheduling**: Calculating future dates for reminders or deadlines.",
        "**UI Display**: Showing human-readable dates like '2 hours ago'.",
        "**Logging**: Tracking system performance over time."
    ],

    memoryModel: `### **Time in Memory**

**1. Object Storage:**
- A Date is an object in the **Heap**.
- Internally, it holds a single **primitive number** (the 64-bit timestamp).

**2. Immutability:**
- Date objects are **mutable**. If you use \`setFullYear()\`, the object itself changes in memory.
- **Rule:** For safe logic, always create a copy of a date (\`new Date(oldDate)\`) before modifying it.

**3. Engine Precision:**
- Although Dates use milliseconds, modern CPUs and browser engines can provide microsecond-precision timing via \`performance.now()\`.
- Standard Dates are tied to the **System Clock** in RAM, while \`performance.now()\` is tied to the **Hardware High-Resolution Timer**.`,

    visualizationType: 'variables'
};

export default date;

