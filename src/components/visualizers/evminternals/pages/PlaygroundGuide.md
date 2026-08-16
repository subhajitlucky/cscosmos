# EVM Playground Guide

The EVM Playground is a hands-on sandbox for understanding how the Ethereum Virtual Machine executes bytecode. This guide walks you through what to observe and learn.

---

## What Is This?

The EVM Playground simulates smart contract execution in your browser. It takes raw bytecode (hexadecimal opcodes) and shows you exactly how the EVM processes each instruction—step by step.

**No external dependencies.** Everything runs locally. No RPC, no network, no gas costs.

---

## The Interface

```
┌─────────────────────────────────────────────────────────────┐
│  Bytecode Input    [ 604260005260206000f3  ]  [ Reset ]     │
│                              [ Undo ]  [ Step ]             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Opcodes     │  │    Stack     │  │                  │  │
│  │  (Current    │  │  (LIFO       │  │     Memory       │  │
│  │   instruction│  │   data)      │  │   (32-byte       │  │
│  │   + program  │  │              │  │    words)        │  │
│  │   counter)   │  └──────────────┘  │                  │  │
│  ├──────────────┤  ┌──────────────┐  │                  │  │
│  │  Gas Meter   │  │   Storage    │  │                  │  │
│  │  (Cost per   │  │  (Persistent │  │                  │  │
│  │   step)      │  │   key-value) │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Smart Assistant: "Tip: ADD pops 2 items, pushes 1 result" │
└─────────────────────────────────────────────────────────────┘
```

---

## What to Observe

### 1. Program Counter (PC)

The PC shows **which instruction is about to execute**. It starts at 0 and increments (or jumps) after each step.

**Watch for:**
- PC advancing sequentially for most opcodes
- PC jumping to a new position (JUMP/JUMPI)
- Invalid jumps causing errors (no JUMPDEST at destination)

### 2. The Stack

The stack is a **Last-In, First-Out (LIFO)** data structure. Every 256-bit word.

**Watch for:**
- `PUSH` operations adding items to the top
- `POP` operations removing items
- `ADD`, `SUB`, `MUL` etc. consuming 2 items, producing 1
- Stack growing and shrinking with each operation

**Key insight:** The stack is your "workbench"—temporary calculations live here.

### 3. Memory

Memory is a **byte-addressable, linear space** that expands in 32-byte chunks.

**Watch for:**
- `MSTORE` writing data to specific offsets
- `MLOAD` reading data from offsets
- Memory expansion costs (gas increases)
- How data is padded to 32 bytes

**Key insight:** Memory is volatile—cleared after execution. Use it for temporary data.

### 4. Storage

Storage is a **persistent key-value store** that lives on the blockchain.

**Watch for:**
- `SSTORE` writing to storage slots
- `SLOAD` reading from storage slots
- How the same slot can be updated
- Gas cost differences (first write vs. update)

**Key insight:** Storage is expensive. Every node stores it forever.

### 5. Gas

Gas measures computational effort. Every opcode has a cost.

**Watch for:**
- `ADD` costing 3 gas (cheap)
- `SSTORE` costing 20,000+ gas (expensive)
- Memory expansion quadratic costs
- Running out of gas (execution halts)

---

## Learning Path: Try These Examples

### Level 1: Simple Math

**Bytecode:** `6005600402600301`

This calculates `(5 * 4) + 3 = 23`.

**What to observe:**
1. `PUSH1 05` → Stack: `[5]`
2. `PUSH1 04` → Stack: `[5, 4]`
3. `MUL` → Stack: `[20]` (5 × 4)
4. `PUSH1 03` → Stack: `[20, 3]`
5. `ADD` → Stack: `[23]` (20 + 3)

---

### Level 2: Memory Operations

**Bytecode:** `604260005260206000f3`

This stores `42` at memory offset 0, then returns it.

**Steps:**
1. `PUSH1 42` → Value to store
2. `PUSH1 00` → Memory offset 0
3. `MSTORE` → Stores 42 at bytes 0-31
4. `PUSH1 20` → Return size (32 bytes)
5. `PUSH1 00` → Return offset (0)
6. `RETURN` → Output 32 bytes from memory

**Observe:**
- Memory visualization shows 32-byte word
- Gas cost for MSTORE
- RETURN doesn't use stack items directly

---

### Level 3: Storage Persistence

**Bytecode:** `60ff600055`

This stores `255` at storage slot 0.

**Steps:**
1. `PUSH1 ff` → Value 255
2. `PUSH1 00` → Storage slot 0
3. `SSTORE` → Persist to blockchain state

**Observe:**
- Storage visualization shows key-value pair
- High gas cost (20,000 for new slot)
- Data persists even after execution

---

### Level 4: Control Flow

**Bytecode:** `600a60015760006000fd5b6042600052`

This conditionally jumps based on a value.

**Logic:** If top of stack is `10`, jump to position 8 (JUMPDEST), else continue.

**Steps:**
1. `PUSH1 0a` → Push 10
2. `PUSH1 00` → Push 0
3. `JUMPI` → If stack[0] != 0, jump to stack[1]
   - Since 10 != 0, jump to PC 7 (0x5b = JUMPDEST)
4. Execute code at jumpdest
5. `RETURN` → Return results

**Watch for:**
- PC jumping instead of incrementing
- JUMPDEST marker (0x5b) as valid jump target
- What happens with JUMPI when condition is 0

---

## Common Patterns to Practice

### Swapping Two Stack Items

```
PUSH1 a     // Stack: [a]
PUSH1 b     // Stack: [a, b]
SWAP1       // Stack: [b, a]
```

### Duplicating Top Item

```
PUSH1 x     // Stack: [x]
DUP1        // Stack: [x, x]
```

### Dropping Top Item

```
PUSH1 x     // Stack: [x]
POP         // Stack: []
```

---

## Tips for Effective Learning

1. **Start small.** Begin with 2-3 opcodes, then add more.

2. **Step slowly.** Don't rush—watch how the stack changes after each opcode.

3. **Predict before stepping.** Ask yourself: "What will ADD do to these two numbers?"

4. **Use examples.** Click the preset examples to see common patterns.

5. **Break things.** Intentionally create errors to understand failure modes.

6. **Connect to Solidity.** When you see `PUSH1 00` + `SSTORE`, remember: this is how Solidity stores `uint256 private x = 0;`.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Step forward |
| `Ctrl+Enter` | Reset |

---

## What's Next?

Once you're comfortable:

1. **Learn the full opcode set** → See evm.codes
2. **Write assembly** → Use evm-code.com/editor
3. **Understand gas** → Practice optimizing storage writes
4. **Study security** → See how reentrancy and overflow work

---

## Debugging Tips

**"Out of gas"**
→ Reduce memory expansion or simplify logic

**"Invalid jump"**
→ Ensure destination is a JUMPDEST (0x5b)

**"Stack underflow"**
→ You tried to pop more than available items

**"Revert"**
→ Execution failed—check requirements or conditions

---

## The Big Picture

```
┌─────────────────────────────────────────┐
│            Your Transaction             │
├─────────────────────────────────────────┤
│    Bytecode → EVM → State Change        │
│                                          │
│  ┌─────────┐    ┌─────────┐             │
│  │  Stack  │ ←→ │ Memory  │  ← Volatile │
│  └─────────┘    └─────────┘             │
│                                          │
│  ┌─────────┐                            │
│  │Storage  │  ← Persistent (expensive)  │
│  └─────────┘                            │
└─────────────────────────────────────────┘
```

The EVM is a state machine. Every transaction transforms state:
- Stack: ephemeral calculations
- Memory: temporary workspace
- Storage: permanent blockchain state

Understanding these three—and how gas limits computation—is the foundation of smart contract development.
