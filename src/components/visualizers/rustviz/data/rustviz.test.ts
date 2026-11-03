import { describe, expect, it } from 'vitest';
import { rustConcepts, rustCategories } from './concepts';
import { rustPitfalls } from './pitfalls';
import { rustFlashcards } from './flashcards';
import { ownershipScenarios } from './simulations';
import { rustCheatSheet } from './cheatsheet';

describe('RustViz Data Integrity', () => {
  it('validates all 100 architectural concepts', () => {
    expect(rustConcepts.length).toBe(100);
    
    // Validate sequential 1-100 numbering
    rustConcepts.forEach((concept, idx) => {
      expect(concept.number).toBe(idx + 1);
      expect(concept.id).toBeTruthy();
      expect(concept.title).toBeTruthy();
      expect(concept.slug).toBeTruthy();
      expect(concept.summary).toBeTruthy();
      expect(concept.keyTakeaways.length).toBeGreaterThan(0);
      expect(rustCategories).toContain(concept.category);
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(concept.difficulty);
    });

    // Validate first 5 concepts are live, rest are marked coming soon
    const liveConcepts = rustConcepts.filter((c) => !c.isComingSoon);
    const comingSoonConcepts = rustConcepts.filter((c) => c.isComingSoon);
    expect(liveConcepts.length).toBe(5);
    expect(comingSoonConcepts.length).toBe(95);
  });

  it('validates 7 compiler pitfall diagnostics', () => {
    expect(rustPitfalls.length).toBe(7);
    for (const pitfall of rustPitfalls) {
      expect(pitfall.id).toBeTruthy();
      expect(pitfall.title).toBeTruthy();
      expect(pitfall.code).toMatch(/^E\d{4}$/);
      expect(pitfall.brokenCode).toBeTruthy();
      expect(pitfall.fixedCode).toBeTruthy();
      expect(pitfall.explanation).toBeTruthy();
    }
  });

  it('validates 10 spaced-repetition flashcards', () => {
    expect(rustFlashcards.length).toBe(10);
    for (const card of rustFlashcards) {
      expect(card.id).toBeTruthy();
      expect(card.question).toBeTruthy();
      expect(card.answer).toBeTruthy();
      expect(card.category).toBeTruthy();
    }
  });

  it('validates simulation scenarios and cheatsheet sections', () => {
    expect(ownershipScenarios.length).toBeGreaterThan(0);
    for (const scenario of ownershipScenarios) {
      expect(scenario.steps.length).toBeGreaterThan(0);
    }
    expect(rustCheatSheet.length).toBeGreaterThan(0);
  });
});
