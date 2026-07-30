const arrays = {
    definition: "Arrays are ordered lists of values. In JavaScript, arrays are **objects** with built-in methods for traversal, transformation, and manipulation. They can hold values of any type.",

    syntax: `// 1. Creation
const nums = [1, 2, 3];
const mixed = ["A", 42, true];

// 2. Access
nums[0]; // 1
nums.length; // 3

// 3. Transformation (Returns new array)
nums.map(x => x * 2);
nums.filter(x => x > 1);

// 4. Reduction (Returns single value)
nums.reduce((sum, x) => sum + x, 0);
`,

    examples: [
        {
            code: `// 1. Map, Filter, Reduce
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

const total = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(total); // 15`,
            explanation: "`map` transforms every element. `filter` removes elements that don't match. `reduce` combines everything into one result."
        },
        {
            code: `// 2. Splice vs Slice
const arr = ['a', 'b', 'c', 'd'];

const slice = arr.slice(1, 3); // Copy from index 1 up to (not including) 3
console.log(slice); // ['b', 'c']
console.log(arr);   // ['a', 'b', 'c', 'd'] (Original unchanged)

arr.splice(1, 2, 'X'); // Start at 1, remove 2, add 'X'
console.log(arr);   // ['a', 'X', 'd'] (Original MUTATED)`,
            explanation: "`slice` is non-mutating (pure). `splice` modifies the original array. Use `slice` whenever possible to avoid side effects."
        },
        {
            code: `// 3. Array Destructuring & Spread
const [first, second, ...rest] = [10, 20, 30, 40];
console.log(first, second, rest); // 10, 20, [30, 40]

const copy = [...rest]; // Clone array
const combined = [...rest, 50, 60]; // [30, 40, 50, 60]`,
            explanation: "Spread operator `...` is the modern way to clone and combine arrays without mutation."
        }
    ],

    useCases: [
        "**Lists**: Storing products, user messages, or search results.",
        "**Queues/Stacks**: Using `push/pop` or `shift/unshift` for processing tasks.",
        "**Data Transformation**: Cleaning up API data before rendering it in the UI.",
        "**Iteration**: Performing an action for every item in a list."
    ],

    memoryModel: `### **Arrays in Memory**

**1. Object Nature:**
- Under the hood, JS arrays are **objects** where indices (0, 1, 2) are keys.
- They are stored in the **Heap**.

**2. Dynamic Resizing:**
- Unlike C++ or Java, JS arrays don't have a fixed size.
- The Engine automatically reallocates memory in the **Heap** as the array grows.

**3. Performance:**
- **Push/Pop** are fast (O(1)) because they happen at the end.
- **Shift/Unshift** are slow (O(n)) because they require re-indexing every single item in memory.
- **Sparse Arrays:** If you do \`arr[100] = 5\`, the engine doesn't allocate 100 empty slots; it stores it efficiently using a "dictionary mode."`,

    visualizationType: 'arrays'
};

export default arrays;

