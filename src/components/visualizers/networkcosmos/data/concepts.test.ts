import { describe, expect, it } from 'vitest';
import { CONCEPTS, PHASES, getConcept, type Concept } from './concepts';

describe('network concept catalog', () => {
  it('has exactly 50 concepts with unique sequential slugs and numbers', () => {
    expect<Concept[]>(CONCEPTS).toHaveLength(50);
    expect(new Set(CONCEPTS.map((c) => c.slug)).size).toBe(50);
    CONCEPTS.forEach((c, i) => expect(c.number).toBe(i + 1));
  });

  it('covers all seven phases with the approved counts', () => {
    expect(PHASES.map((p) => p.concepts.length)).toEqual([7, 8, 7, 10, 8, 6, 4]);
  });

  it('every concept has complete lesson copy and a valid widget config', () => {
    for (const c of CONCEPTS) {
      expect(c.title.length).toBeGreaterThan(3);
      expect(c.why.length).toBeGreaterThan(80);
      expect(c.onTheWire.length).toBeGreaterThan(80);
      expect(c.whenItBreaks.length).toBeGreaterThan(80);
      expect(c.widget).toMatch(/^(bits|frame|subnet|lpm|state|window|capture|handshake|route|header|queue|timer)$/);
      expect(getConcept(c.slug)).toBe(c);
    }
  });
});
