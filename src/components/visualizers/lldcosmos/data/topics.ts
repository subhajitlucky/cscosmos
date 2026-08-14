export interface LldTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'SOLID Principles' | 'Creational Patterns' | 'Structural Patterns' | 'Behavioral Patterns' | 'LLD Case Studies';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  codeSnippet: string;
  outputDescription: string;
  related: string[];
}

export interface LldTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: LldTopic[];
}

export const lldTopics: LldTopic[] = [
  // 1. SOLID Principles
  {
    id: 'solid-principles-clean-code',
    title: 'The SOLID Principles of Object-Oriented Design',
    kicker: 'Foundations / 01',
    group: 'SOLID Principles',
    difficulty: 'starter',
    summary: 'The five architectural pillars (SRP, OCP, LSP, ISP, DIP) that transform brittle spaghetti code into flexible, decoupled class hierarchies.',
    definition: 'SOLID represents five design principles: Single Responsibility Principle (one reason to change), Open/Closed Principle (open for extension, closed for modification via polymorphism), Liskov Substitution Principle (subtypes must be substitutable for base types without breaking invariants), Interface Segregation Principle (clients should not depend on unused interfaces), and Dependency Inversion Principle (depend on abstractions, not concrete classes).',
    analogy: 'A modular power socket system: any standard plug (LSP) can connect to the wall socket abstraction (DIP) without redesigning the electrical grid (OCP), and individual socket adapters handle specific voltages without bundling unrelated plumbing features (SRP/ISP).',
    steps: [
      'Single Responsibility: Separate business logic, persistence, and presentation into distinct classes',
      'Open/Closed: Introduce interfaces/abstract classes so new features are added via new implementations rather than modifying existing if/else chains',
      'Liskov Substitution: Ensure derived classes never throw unexpected exceptions or strengthen preconditions',
      'Interface Segregation: Break bloated fat interfaces into role-specific, focused protocols',
      'Dependency Inversion: Inject abstract interfaces via constructor dependency injection'
    ],
    mistakes: [
      'Creating God Classes that handle database queries, business calculations, and UI rendering in a single 2,000-line file',
      'Violating LSP by throwing NotImplementedException in subclasses for inherited base methods'
    ],
    optimization: 'Applying Dependency Inversion with Interface Segregation allows 100% isolated unit testing with fast mock objects.',
    codeSnippet: `// Dependency Inversion & Single Responsibility Example
// 1. Abstraction (DIP)
export interface IPaymentGateway {
  charge(amount: number, currency: string): Promise<boolean>;
}

// 2. High-Level Business Domain (SRP & OCP)
export class OrderProcessor {
  constructor(private readonly paymentGateway: IPaymentGateway) {}

  async processOrder(orderId: string, amount: number): Promise<boolean> {
    console.log(\`Processing order \${orderId}...\`);
    const success = await this.paymentGateway.charge(amount, 'USD');
    if (!success) throw new Error('Payment failed');
    return true;
  }
}

// 3. Concrete Low-Level Implementation
export class StripeGateway implements IPaymentGateway {
  async charge(amount: number, currency: string): Promise<boolean> {
    // Invoke Stripe API
    return true;
  }
}`,
    outputDescription: 'Decoupled domain class depending strictly on interface abstractions.',
    related: ['strategy-state-patterns', 'factory-builder-patterns', 'adapter-decorator-patterns']
  },

  // 2. Creational Patterns
  {
    id: 'factory-builder-patterns',
    title: 'Creational Patterns: Factory Method, Builder & Singleton',
    kicker: 'Creational / 01',
    group: 'Creational Patterns',
    difficulty: 'intermediate',
    summary: 'Decoupling object instantiation mechanisms from consuming clients using Factory Method, Abstract Factory, and fluent Builders.',
    definition: 'Creational design patterns abstract the instantiation process. The Factory Method defines an interface for creating an object while letting subclasses decide which class to instantiate. The Builder pattern constructs complex objects step-by-step with method chaining, avoiding telescoping constructors. Singleton ensures a class has only one instance with global access.',
    analogy: 'A custom burger kitchen: instead of forcing customers into the kitchen to assemble raw patties and sauces, the customer specifies preferences to a Builder ("addCheese()", "doublePatty()", "build()"), which constructs the exact burger cleanly.',
    steps: [
      'Identify complex constructors with 5+ arguments or branching instantiation logic',
      'Encapsulate object creation inside dedicated Factory classes or fluent Builder interfaces',
      'Define return types as common abstract interfaces',
      'Builder pattern validates required attributes before returning immutable instance via build()',
      'Clients invoke factory methods without knowing underlying concrete classes'
    ],
    mistakes: [
      'Overusing Singleton for mutable state (creates hidden global dependencies that make concurrent unit testing impossible)',
      'Creating factories for trivial objects with only 1 or 2 primitive fields'
    ],
    optimization: 'Fluent Builders enforce immutability by returning frozen objects, preventing partial-state corruption in concurrent environments.',
    codeSnippet: `// Fluent Builder Pattern with Type Validation
export class HttpRequest {
  public readonly url: string;
  public readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  public readonly headers: Record<string, string>;
  public readonly body?: string;

  constructor(builder: HttpRequestBuilder) {
    this.url = builder.url;
    this.method = builder.method;
    this.headers = builder.headers;
    this.body = builder.body;
  }
}

export class HttpRequestBuilder {
  public url: string = '';
  public method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
  public headers: Record<string, string> = {};
  public body?: string;

  setUrl(url: string) { this.url = url; return this; }
  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE') { this.method = method; return this; }
  addHeader(k: string, v: string) { this.headers[k] = v; return this; }
  setBody(body: string) { this.body = body; return this; }

  build(): HttpRequest {
    if (!this.url) throw new Error('URL is required');
    return new HttpRequest(this);
  }
}`,
    outputDescription: 'Constructs complex immutable objects with clean method chaining.',
    related: ['solid-principles-clean-code', 'adapter-decorator-patterns', 'strategy-state-patterns']
  },

  // 3. Structural Patterns
  {
    id: 'adapter-decorator-patterns',
    title: 'Structural Patterns: Adapter, Decorator & Facade',
    kicker: 'Structural / 01',
    group: 'Structural Patterns',
    difficulty: 'intermediate',
    summary: 'Composing objects into larger structures using Adapters for incompatible interfaces, Decorators for dynamic behavior wrapping, and Facades for simplified APIs.',
    definition: 'Structural design patterns organize relationships between entities. The Adapter pattern converts the interface of a class into another interface clients expect. The Decorator pattern attaches additional responsibilities to an object dynamically without subclassing. The Facade pattern provides a unified, high-level interface to a complex subsystem.',
    analogy: 'An international power travel adapter (Adapter) converting a European plug to US socket, wrapped in a waterproof protective casing (Decorator), operated by a simple one-click master power switch (Facade).',
    steps: [
      'Adapter: Wrap legacy or 3rd-party class inside an adapter class implementing your target domain interface',
      'Decorator: Wrap component class inside a decorator implementing the same interface, delegating calls while adding pre/post behavior',
      'Facade: Bundle complex multi-class orchestrations into a single streamlined gateway method'
    ],
    mistakes: [
      'Creating deep decorator nesting chains (e.g. 10 nested wrapper classes) that make stack traces difficult to debug',
      'Confusing Adapter (changes interface) with Decorator (enhances behavior while preserving interface)'
    ],
    optimization: 'Decorators follow the Open/Closed Principle by adding caching, logging, or metrics wrappers without altering core domain business logic.',
    codeSnippet: `// Decorator Pattern: Adding Logging & Caching to Data Service
export interface IDataService {
  fetchData(id: string): Promise<string>;
}

export class CoreDataService implements IDataService {
  async fetchData(id: string): Promise<string> {
    return \`DataPayload for \${id}\`;
  }
}

// Decorator adding Logging & Telemetry dynamically
export class LoggingDataDecorator implements IDataService {
  constructor(private readonly inner: IDataService) {}

  async fetchData(id: string): Promise<string> {
    console.log(\`[LOG] Fetching data for id: \${id}\`);
    const start = Date.now();
    const result = await this.inner.fetchData(id);
    console.log(\`[LOG] Completed in \${Date.now() - start}ms\`);
    return result;
  }
}`,
    outputDescription: 'Wraps core functionality with transparent logging behavior.',
    related: ['solid-principles-clean-code', 'strategy-state-patterns', 'lld-parking-lot-case-study']
  },

  // 4. Behavioral Patterns
  {
    id: 'strategy-state-patterns',
    title: 'Behavioral Patterns: Strategy, Observer, State & Command',
    kicker: 'Behavioral / 01',
    group: 'Behavioral Patterns',
    difficulty: 'advanced',
    summary: 'Managing runtime algorithm switching (Strategy), pub/sub event broadcasting (Observer), and state-dependent class behavior (State).',
    definition: 'Behavioral patterns identify common communication patterns between objects. Strategy defines a family of interchangeable algorithms selected at runtime. State allows an object to alter its behavior when its internal state changes. Observer defines a 1-to-N subscription dependency. Command encapsulates a request as an object, enabling undo/redo history.',
    analogy: 'A GPS navigation app: you choose your travel Strategy (Fastest Highway vs Scenic Walk vs Bicycle Path), while the navigation voice acts as an Observer broadcasting turn updates to your smartwatch and car display.',
    steps: [
      'Strategy: Define algorithm interface (e.g. IRouteStrategy), inject concrete strategy into Navigator context',
      'Observer: Subject maintains subscriber list; notifies all observers via onUpdate() event callbacks',
      'State: Context delegates behavior to current State object; transitions state upon events without massive switch cases',
      'Command: Encapsulate actions with execute() and undo() methods for transaction journals'
    ],
    mistakes: [
      'Using giant 50-case switch statements instead of polymorphic State or Strategy patterns',
      'Forgetting to unregister Observers, causing memory leaks in long-lived applications'
    ],
    optimization: 'Strategy and State eliminate cyclomatic complexity ($O(1)$ polymorphic dispatch vs $O(N)$ nested conditional branches).',
    codeSnippet: `// Strategy Pattern: Dynamic Sorting Algorithm Strategy
export interface ISortStrategy<T> {
  sort(items: T[]): T[];
}

export class QuickSort<T> implements ISortStrategy<T> {
  sort(items: T[]): T[] { return [...items].sort(); }
}

export class ReverseSort<T> implements ISortStrategy<T> {
  sort(items: T[]): T[] { return [...items].sort().reverse(); }
}

export class SorterContext<T> {
  constructor(private strategy: ISortStrategy<T>) {}

  setStrategy(strategy: ISortStrategy<T>) { this.strategy = strategy; }
  executeSort(data: T[]): T[] { return this.strategy.sort(data); }
}`,
    outputDescription: 'Interchanges runtime algorithms polymorphically with zero branching.',
    related: ['solid-principles-clean-code', 'lld-parking-lot-case-study', 'factory-builder-patterns']
  },

  // 5. LLD Case Studies
  {
    id: 'lld-parking-lot-case-study',
    title: 'Machine Coding Case Study: Smart Parking Lot & Elevator',
    kicker: 'Case Study / 01',
    group: 'LLD Case Studies',
    difficulty: 'expert',
    summary: 'End-to-end Low-Level Design of a multi-floor Parking Lot and Elevator scheduling system using Clean Architecture and Design Patterns.',
    definition: 'Machine Coding interview problems test the holistic synthesis of SOLID principles and GoF patterns. Designing a Smart Parking Lot requires modeling Spot hierarchies (Compact, Large, Handicapped), dynamic fee calculation strategies (Hourly, Flat, Peak pricing via Strategy pattern), entry/exit gate state machines, and concurrency-safe spot allocation locks.',
    analogy: 'A hotel front-desk management system: rooms of different categories (Spot hierarchy) are assigned by booking rules (Strategy), bills are computed by pricing models (Decorator), and room keys are minted at check-in (Factory).',
    steps: [
      'Clarify functional and non-functional requirements (Capacity, spot types, payment methods, concurrency)',
      'Identify core domain entities (ParkingLot, Floor, ParkingSpot, Vehicle, Ticket, Payment)',
      'Apply Factory pattern for Vehicle & Ticket instantiation',
      'Apply Strategy pattern for parking spot allocation algorithms (Nearest-to-entrance, Best-fit)',
      'Apply Observer pattern to update real-time LED display boards across all floors upon parking/unparking'
    ],
    mistakes: [
      'Coupling spot allocation logic directly into the Vehicle class',
      'Failing to handle race conditions when two vehicles attempt to claim the last remaining spot simultaneously'
    ],
    optimization: 'Using concurrent read-write locks per Floor rather than locking the entire Parking Lot allows thousands of cars to park simultaneously across multiple levels.',
    codeSnippet: `// LLD Parking Lot Domain Implementation
export enum VehicleType { MOTORCYCLE, COMPACT, TRUCK }
export enum SpotType { TWO_WHEELER, COMPACT, LARGE }

export abstract class Vehicle {
  constructor(public readonly license: string, public readonly type: VehicleType) {}
}

export class ParkingSpot {
  private occupiedVehicle: Vehicle | null = null;

  constructor(public readonly id: string, public readonly type: SpotType) {}

  isFree(): boolean { return this.occupiedVehicle === null; }
  park(v: Vehicle) { this.occupiedVehicle = v; }
  unpark() { this.occupiedVehicle = null; }
}

export interface IParkingStrategy {
  findSpot(spots: ParkingSpot[], v: Vehicle): ParkingSpot | null;
}

export class NearestFirstStrategy implements IParkingStrategy {
  findSpot(spots: ParkingSpot[], v: Vehicle): ParkingSpot | null {
    return spots.find(s => s.isFree()) || null;
  }
}`,
    outputDescription: 'Models clean, extensible Low-Level Design structure for real-world interview systems.',
    related: ['strategy-state-patterns', 'solid-principles-clean-code', 'factory-builder-patterns']
  }
];

export const lldTopicGroups: LldTopicGroup[] = [
  {
    id: 'solid',
    name: 'SOLID Principles & Clean Architecture',
    description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: lldTopics.filter(t => t.group === 'SOLID Principles')
  },
  {
    id: 'creational',
    name: 'Creational Patterns',
    description: 'Factory Method, Abstract Factory, Builder with fluent chaining, Singleton, and Prototype.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: lldTopics.filter(t => t.group === 'Creational Patterns')
  },
  {
    id: 'structural',
    name: 'Structural Patterns',
    description: 'Adapter for interface translation, Decorator for dynamic behavior wrapping, and Facade gateways.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: lldTopics.filter(t => t.group === 'Structural Patterns')
  },
  {
    id: 'behavioral',
    name: 'Behavioral Patterns',
    description: 'Strategy for dynamic algorithms, State machines, Observer pub/sub, and Command history.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: lldTopics.filter(t => t.group === 'Behavioral Patterns')
  },
  {
    id: 'case-studies',
    name: 'LLD Machine Coding Case Studies',
    description: 'Smart Multi-Floor Parking Lot, Elevator System, Rate Limiter, and Notification Dispatcher.',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    topics: lldTopics.filter(t => t.group === 'LLD Case Studies')
  }
];

export const getLldTopic = (id: string) => lldTopics.find(t => t.id === id);
