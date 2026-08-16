export type StorageVariable = {
    name: string;
    type: string;
    value: string;
    bytes: number;
    color: string;
}

export type StorageSlot = {
    id: number;
    items: StorageVariable[]; // Items packed in this slot, ordered from right-to-left (lowest order byte)
    remainingBytes: number;
}

const TYPE_SIZES: Record<string, number> = {
    "uint256": 32,
    "address": 20,
    "uint128": 16,
    "uint64": 8,
    "uint32": 4,
    "uint8": 1,
    "bool": 1,
    "bytes32": 32,
}

const COLORS = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-fuchsia-500", "bg-pink-500", "bg-rose-500"
];

export function calculateLayout(variables: { name: string, type: string, value: string }[]): StorageSlot[] {
    const slots: StorageSlot[] = [];
    let currentSlot: StorageSlot = { id: 0, items: [], remainingBytes: 32 };

    variables.forEach((v, idx) => {
        const size = TYPE_SIZES[v.type] || 32;

        // If it fits, pack it
        if (size <= currentSlot.remainingBytes) {
            currentSlot.items.unshift({ ...v, bytes: size, color: COLORS[idx % COLORS.length] }); // Unshift to visualize right-to-left filling
            currentSlot.remainingBytes -= size;
        } else {
            // Push current full slot
            slots.push(currentSlot);

            // Start new slot
            currentSlot = { id: slots.length, items: [], remainingBytes: 32 };
            currentSlot.items.unshift({ ...v, bytes: size, color: COLORS[idx % COLORS.length] });
            currentSlot.remainingBytes -= size;
        }
    });

    // Push the last slot
    slots.push(currentSlot);

    return slots;
}
