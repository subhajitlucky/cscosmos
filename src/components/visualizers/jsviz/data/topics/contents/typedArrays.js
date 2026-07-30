const typedArrays = {
    definition: "**Typed Arrays** (introduced in ES6) are array-like objects that provide a mechanism for reading and writing raw binary data in memory buffers. They are essential for high-performance tasks like processing image data, audio, or interacting with GPUs.",

    syntax: `// 1. Create a Buffer (Fixed size in bytes)
const buffer = new ArrayBuffer(16); // 16 bytes

// 2. Create a View
const int32 = new Int32Array(buffer);
const uint8 = new Uint8Array(buffer);

// 3. Shorthand
const direct = new Float64Array([1.5, 2.5]);
`,

    examples: [
        {
            code: `// 1. Efficient Fixed-Type Storage
const pixelData = new Uint8ClampedArray(4); // RGBA

pixelData[0] = 255; // Red
pixelData[1] = 0;   // Green
pixelData[2] = 0;   // Blue
pixelData[3] = 255; // Alpha

console.log(pixelData); // [255, 0, 0, 255]`,
            explanation: "Unlike regular arrays, Typed Arrays only store one type of data (e.g., unsigned 8-bit integers). This allows the CPU to process them much faster."
        },
        {
            code: `// 2. Multiple Views on One Buffer
const buf = new ArrayBuffer(4);
const view1 = new Uint8Array(buf);
const view2 = new Uint16Array(buf);

view1[0] = 255;
view1[1] = 1;

console.log(view2[0]); // 511 (The binary result of 255 + 1<<8)`,
            explanation: "You can point different 'Views' at the same raw memory buffer. Changing one view automatically changes the others because they are looking at the same bytes."
        },
        {
            code: `// 3. Overflow Behavior
const tiny = new Uint8Array(1);
tiny[0] = 256; 

console.log(tiny[0]); // 0 (It wrapped around!)`,
            explanation: "Typed Arrays have strict bounds. If you try to store a number larger than the type allows (e.g., >255 for Uint8), it 'wraps around' (modulo math)."
        }
    ],

    useCases: [
        "**WebGL/WebGPU**: Sending vertex data directly to the graphics card.",
        "**Audio API**: Processing raw audio waveforms in real-time.",
        "**WebSockets**: Handling binary data streams from servers.",
        "**Performance Math**: Calculations where memory cache locality is critical."
    ],

    memoryModel: `### **The Raw Metal**

**1. Contiguous Allocation:**
- Regular Arrays are objects in the **Heap** and can be fragmented.
- Typed Arrays allocate a **single contiguous block** of memory in the **RAM**.

**2. CPU Cache Locality:**
- Because the data is sequential and fixed-size, the **CPU** can load it into its **L1 Cache** much more efficiently.
- This results in O(1) access time that is significantly faster than standard JS arrays.

**3. Zero-Copy:**
- \`ArrayBuffer\` data can be passed between the **Main Thread** and **Web Workers** using "Transferables." 
- This moves the memory ownership without copying the bytes, saving **RAM** and avoiding main-thread blocking.`,

    visualizationType: 'arrays'
};

export default typedArrays;

