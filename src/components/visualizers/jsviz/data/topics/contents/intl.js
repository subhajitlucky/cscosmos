const intl = {
    definition: "The **Intl** object is the namespace for the ECMAScript Internationalization API. it provides language-sensitive string comparison, number formatting, and date/time formatting, essential for building globally accessible applications.",

    syntax: `// 1. Number Formatting
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// 2. Date Formatting
new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' });

// 3. Relative Time (e.g., "2 days ago")
new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
`,

    examples: [
        {
            code: `// 1. Currency Formatting
const price = 1234.56;

const usFormat = new Intl.NumberFormat('en-US', { 
  style: 'currency', currency: 'USD' 
}).format(price);

const inFormat = new Intl.NumberFormat('en-IN', { 
  style: 'currency', currency: 'INR' 
}).format(price);

console.log(usFormat); // "$1,234.56"
console.log(inFormat); // "₹1,234.56"`,
            explanation: "`Intl.NumberFormat` handles decimal points, thousands separators, and currency symbols automatically based on the locale."
        },
        {
            code: `// 2. Full Date/Time
const now = new Date();
const formatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

console.log(formatter.format(now)); // "mercredi 17 décembre 2025"`,
            explanation: "Instead of complex regex or string hacking, `Intl` provides native, performant translation of date components."
        },
        {
            code: `// 3. Relative Time
const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' });

console.log(rtf.format(-1, 'day')); // "1 day ago"
console.log(rtf.format(5, 'minute')); // "in 5 min."`,
            explanation: "Relative time formatting is perfect for social media apps or news feeds where 'just now' or '2 days ago' is more useful than a raw date."
        }
    ],

    useCases: [
        "**E-commerce**: Showing prices in local currencies.",
        "**SaaS**: Formatting dates and numbers based on user browser settings.",
        "**Analytics**: Sorting strings correctly across different languages (using `Intl.Collator`).",
        "**UX**: Providing readable relative times for activity logs."
    ],

    memoryModel: `### **The Localization Engine**

**1. Heavy Built-in:**
- The \`Intl\` object is a massive subsystem in the engine. 
- It relies on the **ICU (International Components for Unicode)** library, which is a large binary stored in your browser's installation directory.

**2. Formatting Performance:**
- Creating an \`Intl\` formatter object is relatively expensive in terms of **CPU cycles**. 
- **Performance Tip:** If you're formatting thousands of numbers in a loop, create the formatter once and reuse it (\`const f = new Intl...\`) instead of creating a new one inside the loop.

**3. Locale Data:**
- Locales are loaded from **RAM** only when requested. The engine optimizes memory by keeping only the most common locale data resident.`,

    visualizationType: 'variables'
};

export default intl;

