const mapSet = {
    definition: "**Map** and **Set** (ES6) are specialized collection objects. **Map** stores key-value pairs (where keys can be any type), and **Set** stores unique values. They offer better performance and features than standard Objects and Arrays for specific tasks.",

    syntax: `// 1. Set (Unique Values)
const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
set.add(4);
set.has(2); // true

// 2. Map (Key-Value)
const map = new Map();
map.set('a', 1);
map.set({id: 1}, 'user'); // Object as key!
map.get('a'); // 1

// 3. WeakMap / WeakSet
const wm = new WeakMap(); // Keys MUST be objects
`,

    examples: [
        {
            code: `// 1. Removing Duplicates
const raw = [1, 5, 2, 1, 5, 3];
const unique = [...new Set(raw)];

console.log(unique); // [1, 5, 2, 3]`,
            explanation: "Converting an array to a `Set` and back to an array is the fastest way to remove duplicates in modern JavaScript."
        },
        {
            code: `// 2. Objects as Map Keys
const user = { name: "Subhajit" };
const metadata = new Map();

metadata.set(user, { lastLogin: "2025-12-17" });

console.log(metadata.get(user)); // { lastLogin: ... }`,
            explanation: "In a regular Object, keys are converted to strings. A `Map` allows you to use actual objects as keys, which is powerful for associating metadata without modifying the original object."
        },
        {
            code: `// 3. WeakMap for Private Data
const privates = new WeakMap();

class User {
  constructor(id) {
    privates.set(this, { id });
  }
  getId() {
    return privates.get(this).id;
  }
}

const me = new User(42);
console.log(me.getId()); // 42`,
            explanation: "`WeakMap` doesn't prevent its keys from being **Garbage Collected**. If the `User` instance is deleted, the private data in the `WeakMap` is automatically removed from memory."
        }
    ],

    useCases: [
        "**Set**: Maintaining a list of active users, selected IDs, or unique tags.",
        "**Map**: High-performance lookups, caching results (memoization), or mapping UI elements to state objects.",
        "**WeakMap**: Storing truly private data or metadata for DOM elements in a way that avoids memory leaks.",
        "**WeakSet**: Tracking 'visited' objects in recursive algorithms."
    ],

    memoryModel: `### **Hash Table Internals**

**1. Hash Maps:**
- \`Map\` and \`Set\` use **Hash Tables** in the **Heap** for O(1) average time complexity for access.
- Standard Objects also use hash tables, but \`Map\` is optimized for frequent additions/removals.

**2. Garbage Collection (Weak Variants):**
- **Strong Reference:** A standard \`Map\` keeps its keys alive in the **RAM** as long as the map exists.
- **Weak Reference:** A \`WeakMap\` holds a "weak" reference. If no other code points to the key object, the **Garbage Collector** can reclaim that memory even if it's still in the map.

**3. Memory Overhead:**
- Each \`Map\` entry requires more memory than a standard Object property due to the complexity of the Hash Table structure.`,

    visualizationType: 'mapset'
};

export default mapSet;

