'use client';

import React, { useState } from 'react';
import { ShieldCheck, Code2, AlertTriangle, CheckCircle2, RotateCcw, ArrowRight, Layers } from 'lucide-react';

interface SolidCase {
  id: string;
  name: string;
  principle: string;
  violationTitle: string;
  violationCode: string;
  violationSmell: string;
  refactoredTitle: string;
  refactoredCode: string;
  refactoredBenefit: string;
}

const SOLID_CASES: SolidCase[] = [
  {
    id: 'srp',
    name: 'Single Responsibility (SRP)',
    principle: 'A class should have one, and only one, reason to change.',
    violationTitle: 'God Class: OrderManager (Calculates + Saves DB + Sends Email)',
    violationCode: `class OrderManager {
  processOrder(order: Order) {
    // 1. Business Logic
    const total = order.items.reduce((s, i) => s + i.price, 0);
    
    // 2. Direct Database Persistence
    db.query("INSERT INTO orders VALUES (?)", [order.id, total]);
    
    // 3. Presentation / Email
    emailClient.send(order.userEmail, "Your receipt: $" + total);
  }
}`,
    violationSmell: 'Couples business math, raw SQL queries, and email transport in a single class. Changes to database schemas or email templates break order calculations.',
    refactoredTitle: 'Clean SRP: OrderCalculator + OrderRepository + NotificationService',
    refactoredCode: `// 1. Business Math
class OrderCalculator {
  calculateTotal(order: Order): number {
    return order.items.reduce((s, i) => s + i.price, 0);
  }
}

// 2. Persistence Layer
class OrderRepository {
  async save(orderId: string, total: number) {
    await db.orders.insert({ orderId, total });
  }
}

// 3. Notification Service
class EmailNotifier {
  async notify(email: string, total: number) {
    await emailClient.sendReceipt(email, total);
  }
}`,
    refactoredBenefit: 'Each class has exactly 1 reason to change. Unit testing business math requires 0 database or email mocks.'
  },
  {
    id: 'ocp',
    name: 'Open/Closed (OCP)',
    principle: 'Software entities should be open for extension, but closed for modification.',
    violationTitle: 'Brittle Switch: PaymentProcessor (Modifies class for every new payment method)',
    violationCode: `class PaymentProcessor {
  process(type: 'STRIPE' | 'PAYPAL' | 'CRYPTO', amount: number) {
    if (type === 'STRIPE') {
      stripeApi.charge(amount);
    } else if (type === 'PAYPAL') {
      payPalApi.makePayment(amount);
    } else if (type === 'CRYPTO') {
      cryptoWallet.transfer(amount);
    }
  }
}`,
    violationSmell: 'Adding ApplePay requires modifying existing if/else chains, risking regressions across all existing payment methods.',
    refactoredTitle: 'Polymorphic OCP: IPaymentMethod Strategy Pattern',
    refactoredCode: `interface IPaymentMethod {
  pay(amount: number): Promise<boolean>;
}

class StripePayment implements IPaymentMethod {
  async pay(amount: number) { return stripeApi.charge(amount); }
}

class CryptoPayment implements IPaymentMethod {
  async pay(amount: number) { return cryptoWallet.transfer(amount); }
}

// Open for extension: add ApplePay without touching PaymentProcessor!
class PaymentProcessor {
  async process(method: IPaymentMethod, amount: number) {
    return method.pay(amount);
  }
}`,
    refactoredBenefit: 'Add 100 new payment providers simply by creating new classes. PaymentProcessor never needs modification.'
  },
  {
    id: 'lsp',
    name: 'Liskov Substitution (LSP)',
    principle: 'Subtypes must be substitutable for their base types without breaking client invariants.',
    violationTitle: 'LSP Violation: Ostrich extends Bird (Throws Unexpected Exception)',
    violationCode: `class Bird {
  fly() { console.log("Flying through the sky..."); }
}

class Ostrich extends Bird {
  fly() {
    // Breaks client assumptions!
    throw new Error("Ostriches cannot fly!");
  }
}`,
    violationSmell: 'Subclass breaks base contract invariants by throwing runtime exceptions when fly() is invoked polymorphically.',
    refactoredTitle: 'Segregated Hierarchy: Bird -> FlyingBird & FlightlessBird',
    refactoredCode: `abstract class Bird {
  abstract eat(): void;
}

abstract class FlyingBird extends Bird {
  abstract fly(): void;
}

class Eagle extends FlyingBird {
  eat() { /*...*/ }
  fly() { console.log("Soaring high"); }
}

class Ostrich extends Bird {
  eat() { /*...*/ }
  run() { console.log("Running at 70 km/h"); }
}`,
    refactoredBenefit: 'Client code expecting FlyingBird is guaranteed never to trigger runtime flight exceptions.'
  },
  {
    id: 'isp',
    name: 'Interface Segregation (ISP)',
    principle: 'Clients should not be forced to depend upon interfaces that they do not use.',
    violationTitle: 'Fat Interface: IWorker (Forces Robot to implement eat() & sleep())',
    violationCode: `interface IWorker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class RobotWorker implements IWorker {
  work() { console.log("Welding auto parts..."); }
  eat() { throw new Error("Robots do not eat"); }
  sleep() { throw new Error("Robots do not sleep"); }
}`,
    violationSmell: 'Fat interface pollutes class with dummy implementations that throw errors or remain empty.',
    refactoredTitle: 'Segregated Role Interfaces: IWorkable + IFeedable',
    refactoredCode: `interface IWorkable {
  work(): void;
}

interface IFeedable {
  eat(): void;
}

class HumanWorker implements IWorkable, IFeedable {
  work() { /*...*/ }
  eat() { /*...*/ }
}

class RobotWorker implements IWorkable {
  work() { console.log("Working 24/7 with zero downtime"); }
}`,
    refactoredBenefit: 'Classes only implement role protocols they genuinely support.'
  },
  {
    id: 'dip',
    name: 'Dependency Inversion (DIP)',
    principle: 'Depend upon abstractions, not concretions.',
    violationTitle: 'Hardcoded Concrete: AppService creates MySQLConnection inside constructor',
    violationCode: `class AppService {
  private db: MySQLConnection;

  constructor() {
    // Hardcoded tight coupling!
    this.db = new MySQLConnection("localhost:3306");
  }

  getUser(id: string) {
    return this.db.query("SELECT * FROM users WHERE id = " + id);
  }
}`,
    violationSmell: 'High-level business service directly instantiates low-level infrastructure driver, making switching to PostgreSQL or mocking impossible.',
    refactoredTitle: 'Inverted Dependency Injection: IDatabase interface',
    refactoredCode: `interface IDatabase {
  query(sql: string, params?: any[]): Promise<any>;
}

class AppService {
  // Injected via constructor!
  constructor(private readonly db: IDatabase) {}

  async getUser(id: string) {
    return this.db.query("SELECT * FROM users WHERE id = ?", [id]);
  }
}`,
    refactoredBenefit: 'Seamlessly swap MySQL, PostgreSQL, or MockDatabase for unit tests in 1 line.'
  }
];

export function SolidLab() {
  const [selectedCase, setSelectedCase] = useState<SolidCase>(SOLID_CASES[0]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--lld-emerald)]/30 bg-[var(--lld-emerald)]/10 text-[var(--lld-emerald)] text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" /> Interactive SOLID Refactoring Lab
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--lld-text)]">
          SOLID Principle <span className="text-[var(--lld-primary)] lld-glow">Refactoring Studio</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--lld-muted)] max-w-2xl leading-relaxed">
          Inspect legacy anti-pattern code smells and compare them with clean, decoupled SOLID refactorings side-by-side.
        </p>
      </div>

      {/* Principle Tabs */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {SOLID_CASES.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedCase(sc)}
            className={`px-4 py-2.5 rounded-lg transition-all ${
              selectedCase.id === sc.id
                ? 'bg-[var(--lld-primary)] text-white font-bold shadow-md'
                : 'border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] text-[var(--lld-muted)] hover:text-[var(--lld-text)]'
            }`}
          >
            {sc.name}
          </button>
        ))}
      </div>

      {/* Principle Definition Banner */}
      <div className="p-6 rounded-2xl border border-[var(--lld-border)] bg-[var(--lld-surface)] font-mono text-xs space-y-2 shadow-xl">
        <span className="text-[10px] text-[var(--lld-primary)] uppercase tracking-wider font-bold">
          Principle Invariant:
        </span>
        <p className="text-base text-[var(--lld-text)] font-display font-bold">
          &ldquo;{selectedCase.principle}&rdquo;
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
        {/* Violation Code Card */}
        <div className="rounded-2xl border border-rose-500/40 bg-[var(--lld-surface)] overflow-hidden shadow-xl space-y-4">
          <div className="px-4 py-3 border-b border-rose-500/20 bg-rose-500/10 flex items-center justify-between text-rose-300 font-bold">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> BAD: {selectedCase.violationTitle}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">VIOLATION</span>
          </div>

          <div className="p-6 overflow-x-auto">
            <pre className="text-rose-200 leading-relaxed">
              <code>{selectedCase.violationCode}</code>
            </pre>
          </div>

          <div className="p-4 border-t border-rose-500/20 bg-rose-500/5 text-[11px] text-[var(--lld-muted)] leading-relaxed space-y-1">
            <span className="text-rose-400 font-bold text-[10px] uppercase tracking-wider block">Detected Code Smell:</span>
            <p>{selectedCase.violationSmell}</p>
          </div>
        </div>

        {/* Refactored Clean Code Card */}
        <div className="rounded-2xl border border-emerald-500/40 bg-[var(--lld-surface)] overflow-hidden shadow-xl space-y-4">
          <div className="px-4 py-3 border-b border-emerald-500/20 bg-emerald-500/10 flex items-center justify-between text-emerald-300 font-bold">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> CLEAN: {selectedCase.refactoredTitle}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">REFACTORED</span>
          </div>

          <div className="p-6 overflow-x-auto">
            <pre className="text-emerald-200 leading-relaxed">
              <code>{selectedCase.refactoredCode}</code>
            </pre>
          </div>

          <div className="p-4 border-t border-emerald-500/20 bg-emerald-500/5 text-[11px] text-[var(--lld-muted)] leading-relaxed space-y-1">
            <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block">Architectural Advantage:</span>
            <p>{selectedCase.refactoredBenefit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
