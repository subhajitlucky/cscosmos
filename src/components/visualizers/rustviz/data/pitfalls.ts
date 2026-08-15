export interface RustPitfall {
  id: string;
  code: string;
  title: string;
  category: 'Ownership' | 'Borrowing' | 'Lifetimes' | 'Concurrency' | 'Traits';
  difficulty: 'Common' | 'Tricky' | 'Advanced';
  summary: string;
  compilerDiagnostic: string;
  brokenCode: string;
  fixedCode: string;
  explanation: string;
  mentalModelTip: string;
}

export const rustPitfalls: RustPitfall[] = [
  {
    id: 'e0382-moved-value',
    code: 'E0382',
    title: 'Borrow / Use of Moved Value',
    category: 'Ownership',
    difficulty: 'Common',
    summary: 'Attempting to access a variable after its ownership has already been transferred to another variable or function.',
    compilerDiagnostic: `error[E0382]: borrow of moved value: \`data\`
  --> src/main.rs:5:20
   |
 2 |     let data = String::from("Rustacean");
   |         ---- move occurs because \`data\` has type \`String\`, which does not implement \`Copy\`
 3 |     process_data(data);
   |                  ---- value moved here
 4 |
 5 |     println!("{}", data);
   |                    ^^^^ value borrowed here after move`,
    brokenCode: `fn process_data(s: String) {
    println!("Processing: {}", s);
}

fn main() {
    let data = String::from("Rustacean");
    process_data(data); // Ownership is transferred!
    println!("Length: {}", data.len()); // E0382 error!
}`,
    fixedCode: `// Fix Option 1: Pass an immutable reference instead of full ownership
fn process_data(s: &str) {
    println!("Processing: {}", s);
}

fn main() {
    let data = String::from("Rustacean");
    process_data(&data); // Borrowing &data
    println!("Length: {}", data.len()); // Works perfectly!
}`,
    explanation: 'Heap-backed types in Rust do not implement Copy. Passing `data` by value moves ownership into the function, invalidating the original binding on the stack. Fix by borrowing (`&data`) or explicitly calling `.clone()` if duplicate heap allocation is desired.',
    mentalModelTip: 'Think of non-Copy types as physical objects with only one set of hands. If you hand it to someone else without taking a photo (&T), your hands are now empty.'
  },
  {
    id: 'e0502-borrow-mut-immut',
    code: 'E0502',
    title: 'Cannot Borrow as Mutable Because Also Borrowed as Immutable',
    category: 'Borrowing',
    difficulty: 'Common',
    summary: 'Violating the Aliasing XOR Mutability theorem by holding a read reference while attempting to mutate the underlying data.',
    compilerDiagnostic: `error[E0502]: cannot borrow \`items\` as mutable because it is also borrowed as immutable
  --> src/main.rs:6:5
   |
 3 |     let first = &items[0];
   |                  ----- immutable borrow occurs here
 4 |
 5 |     items.push(40);
   |     ^^^^^^^^^^^^^^ mutable borrow occurs here
 6 |
 7 |     println!("First: {}", first);
   |                           ----- immutable borrow later used here`,
    brokenCode: `fn main() {
    let mut items = vec![10, 20, 30];
    let first = &items[0]; // Immutable loan starts

    items.push(40); // Attempt to mutate (E0502!)

    println!("First was: {}", first); // Loan still active here!
}`,
    fixedCode: `fn main() {
    let mut items = vec![10, 20, 30];
    
    // Fix: Clone or copy the scalar value if it implements Copy
    let first = items[0]; // i32 is Copy!

    items.push(40); // Valid mutation!
    println!("First was: {}", first); // Valid!
}`,
    explanation: 'Modifying a vector via `.push()` might trigger a buffer reallocation to a new memory address. If `first` held a pointer to the old buffer, reading `first` would result in a dangling pointer / Use-After-Free bug. Rust prevents this at compile time.',
    mentalModelTip: 'Never rearrange the furniture in a room while someone is sitting on the couch.'
  },
  {
    id: 'e0499-multiple-mut-borrows',
    code: 'E0499',
    title: 'Cannot Borrow as Mutable More Than Once at a Time',
    category: 'Borrowing',
    difficulty: 'Common',
    summary: 'Attempting to create two overlapping mutable references to the same memory location.',
    compilerDiagnostic: `error[E0499]: cannot borrow \`buffer\` as mutable more than once at a time
  --> src/main.rs:4:18
   |
 3 |     let r1 = &mut buffer;
   |              ----------- first mutable borrow occurs here
 4 |     let r2 = &mut buffer;
   |              ^^^^^^^^^^^ second mutable borrow occurs here
 5 |     r1.push_str(" A");
 6 |     r2.push_str(" B");`,
    brokenCode: `fn main() {
    let mut buffer = String::from("Hello");
    let r1 = &mut buffer;
    let r2 = &mut buffer; // Error: second mutable borrow

    r1.push_str(" World");
    r2.push_str(" Rust");
}`,
    fixedCode: `fn main() {
    let mut buffer = String::from("Hello");
    
    {
        let r1 = &mut buffer;
        r1.push_str(" World");
    } // r1 borrow ends here

    let r2 = &mut buffer; // Valid: r1 is no longer live
    r2.push_str(" Rust");
}`,
    explanation: 'Exclusive access means strictly one writer. Having multiple `&mut` references to the same value in the same scope invites data races and aliasing bugs.',
    mentalModelTip: 'Only one person can hold the steering wheel of a car at any instant.'
  },
  {
    id: 'e0597-does-not-live-long-enough',
    code: 'E0597',
    title: 'Value Does Not Live Long Enough (Dangling Reference)',
    category: 'Lifetimes',
    difficulty: 'Tricky',
    summary: 'Creating a reference that outlives the memory stack frame of the value it points to.',
    compilerDiagnostic: `error[E0597]: \`short_lived\` does not live long enough
  --> src/main.rs:6:23
   |
 5 |     let r;
 6 |     {
 7 |         let short_lived = 42;
 8 |         r = &short_lived;
   |             ^^^^^^^^^^^^ borrowed value does not live long enough
 9 |     }
   |     - \`short_lived\` dropped here while still borrowed
10 |     println!("{}", r);`,
    brokenCode: `fn main() {
    let r;
    {
        let local_data = String::from("Temporary");
        r = &local_data; // Borrowing local
    } // local_data is dropped here!

    println!("Value: {}", r); // r points to freed memory!
}`,
    fixedCode: `fn main() {
    let local_data = String::from("Temporary");
    let r = &local_data; // local_data outlives r

    println!("Value: {}", r); // Safe!
}`,
    explanation: 'When the inner block exits, `local_data` is dropped and its stack frame deallocated. If `r` were accessed afterwards, it would read deallocated memory. Rust guarantees zero dangling pointers.',
    mentalModelTip: 'You cannot sign a lease on an apartment that is being demolished tomorrow.'
  },
  {
    id: 'e0515-returns-local-ref',
    code: 'E0515',
    title: 'Cannot Return Reference to Local Variable',
    category: 'Lifetimes',
    difficulty: 'Tricky',
    summary: 'Returning a pointer or reference to data allocated on the current stack frame, which is deallocated when the function returns.',
    compilerDiagnostic: `error[E0515]: cannot return reference to local variable \`msg\`
  --> src/main.rs:3:5
   |
 2 |     let msg = format!("Hello, {}", name);
   |         --- binding \`msg\` declared here
 3 |     &msg
   |     ^^^^ returns a reference to data owned by the current function`,
    brokenCode: `fn build_greeting(name: &str) -> &str {
    let msg = format!("Hello, {}", name);
    &msg // Error E0515: returning reference to stack local!
}`,
    fixedCode: `// Fix: Return full ownership of the String instead of a reference
fn build_greeting(name: &str) -> String {
    let msg = format!("Hello, {}", name);
    msg // Transferred ownership to caller
}`,
    explanation: 'Local variables live only for the duration of their function call. When the function returns, its stack frame is popped. Returning `&msg` would return a pointer to memory that no longer exists.',
    mentalModelTip: 'Never give someone a key to a room that will vanish the moment you step outside.'
  },
  {
    id: 'e0506-assign-while-borrowed',
    code: 'E0506',
    title: 'Cannot Assign to Variable Because It Is Borrowed',
    category: 'Borrowing',
    difficulty: 'Common',
    summary: 'Attempting to overwrite or move an owned variable while an active reference still points to its data.',
    compilerDiagnostic: `error[E0506]: cannot assign to \`val\` because it is borrowed
  --> src/main.rs:5:5
   |
 3 |     let ref_val = &val;
   |                   ---- borrow of \`val\` occurs here
 4 |
 5 |     val = 20;
   |     ^^^^^^^^ assignment to borrowed \`val\` occurs here
 6 |
 7 |     println!("ref: {}", ref_val);`,
    brokenCode: `fn main() {
    let mut val = 10;
    let ref_val = &val; // Immutable loan
    
    val = 20; // Attempt to overwrite

    println!("Value: {}", ref_val);
}`,
    fixedCode: `fn main() {
    let mut val = 10;
    let ref_val = &val;
    println!("Value: {}", ref_val); // Last use of ref_val!

    // Under NLL, ref_val loan ended above, so assignment is now valid:
    val = 20; 
    println!("New value: {}", val);
}`,
    explanation: 'A variable is locked in place while any reference to it is active. Overwriting the variable would invalidate what the reader is observing.',
    mentalModelTip: 'You cannot repaint a canvas while a gallery visitor is actively inspecting it.'
  },
  {
    id: 'e0277-trait-not-satisfied',
    code: 'E0277',
    title: 'Trait Bound Not Satisfied (`Send`, `Sync`, `Copy`)',
    category: 'Traits',
    difficulty: 'Advanced',
    summary: 'Passing a type to a generic function or thread spawn that fails to implement the required safety traits.',
    compilerDiagnostic: `error[E0277]: \`Rc<i32>\` cannot be sent between threads safely
  --> src/main.rs:7:5
   |
 7 |     std::thread::spawn(move || {
   |     ^^^^^^^^^^^^^^^^^^ \`Rc<i32>\` cannot be sent between threads safely
   |
   = help: the trait \`Send\` is not implemented for \`Rc<i32>\`
   = note: use \`Arc<i32>\` for thread-safe reference counting`,
    brokenCode: `use std::rc::Rc;
use std::thread;

fn main() {
    let state = Rc::new(100);
    let state_clone = Rc::clone(&state);

    thread::spawn(move || { // E0277: Rc is !Send
        println!("State: {}", state_clone);
    });
}`,
    fixedCode: `use std::sync::Arc; // Fix: Use Atomic Reference Counting
use std::thread;

fn main() {
    let state = Arc::new(100);
    let state_clone = Arc::clone(&state);

    let handle = thread::spawn(move || {
        println!("State: {}", state_clone); // Safe across threads!
    });
    handle.join().unwrap();
}`,
    explanation: '`Rc<T>` uses non-atomic reference counting. Sending it across threads would allow concurrent mutations to the count, creating race conditions. The compiler catches this by checking the `Send` trait bound at compile time.',
    mentalModelTip: 'Traits are contracts. If a tool requires electricity (Send + Sync), you cannot plug in a hand-crank device (Rc).'
  }
];
