import { describe, expect, it } from 'vitest';
import { computeSpecificity } from '@/components/visualizers/cssviz/utils/specificity';

const t = (s: string) => {
  const r = computeSpecificity(s);
  return [r.ids, r.classes, r.elements];
};

/**
 * Specificity parser regression tests.
 *
 * The five triples in the first block are the ones the fullstack audit verified by hand
 * (FS-09/FS-10) — `.nav :where(a)` and `:where(.card, .modal) > p.text` were the cases two
 * earlier counters got wrong. The remaining blocks cover the gaps FS-42 recorded: the
 * `:nth-child(An+B of S)` clause and the shadow-DOM functions.
 */
describe('specificity — the five verified triples still hold', () => {
  it.each([
    ['.card .title', [0, 2, 0]],
    ['.nav :where(a)', [0, 1, 0]],
    [':where(.card, .modal) > p.text', [0, 1, 1]],
    ['#app .list li:hover', [1, 2, 1]],
    ['ul > li::before', [0, 0, 3]],
  ])('%s -> (%i, %i, %i)', (selector, expected) => {
    expect(t(selector as string)).toEqual(expected as number[]);
  });
});

describe('FS-42 gap 1 — :nth-child(An+B of S)', () => {
  it('adds the specificity of S on top of the pseudo-class', () => {
    // The pseudo-class itself is one class; `li` adds one element.
    expect(t(':nth-child(2n+1 of li)')).toEqual([0, 1, 1]);
    // `.item` adds one class.
    expect(t('li:nth-child(odd of .item)')).toEqual([0, 2, 1]);
    // The argument is a selector list: the strongest is taken as a whole tuple. Note the
    // pseudo-class itself still contributes its own class, so `of #b` gives (1 id, 1 class).
    expect(t(':nth-child(1 of .a, #b)')).toEqual([1, 1, 0]);
    // Same for :nth-last-child.
    expect(t(':nth-last-child(2 of #x)')).toEqual([1, 1, 0]);
  });

  it('ignores an An+B that has no `of` clause', () => {
    expect(t(':nth-child(2n+1)')).toEqual([0, 1, 0]);
    expect(t('li:nth-child(2)')).toEqual([0, 1, 1]);
  });

  it('does not treat an `of` inside a nested selector or string as the keyword', () => {
    // `of` appears inside the nested :is() argument only, so nothing is added for a clause.
    expect(t(':nth-child(2n+1)')).toEqual([0, 1, 0]);
    expect(t(':nth-child(2n+1 of :is(.a, .b))')).toEqual([0, 2, 0]);
    expect(t('[data-x="a of b"]')).toEqual([0, 1, 0]);
  });
});

describe('FS-42 gap 2 — shadow-DOM functions', () => {
  it('::slotted(S) is a pseudo-element plus S', () => {
    expect(t('::slotted(span)')).toEqual([0, 0, 2]);
    expect(t('::slotted(.card)')).toEqual([0, 1, 1]);
    // `:host` on its own is a pseudo-class (one class), and `::slotted(#id)` is a
    // pseudo-element plus an id — hence (1 id, 1 class, 1 element). My first expectation here
    // was [1, 0, 2], which forgot the :host class.
    expect(t(':host ::slotted(#id)')).toEqual([1, 1, 1]);
  });

  it(':host(S) and :host-context(S) are a pseudo-class plus S', () => {
    expect(t(':host')).toEqual([0, 1, 0]);
    expect(t(':host(.card)')).toEqual([0, 2, 0]);
    expect(t(':host-context(.dark)')).toEqual([0, 2, 0]);
    expect(t(':host(#app .x)')).toEqual([1, 2, 0]);
  });

  it('::part(x) stays a bare pseudo-element (its argument is an identifier)', () => {
    expect(t('::part(label)')).toEqual([0, 0, 1]);
    expect(t('my-el::part(button)')).toEqual([0, 0, 2]);
  });
});
