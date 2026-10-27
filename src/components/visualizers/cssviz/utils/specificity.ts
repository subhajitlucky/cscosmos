export type Specificity = {
  ids: number
  classes: number
  elements: number
}

const ZERO: Specificity = { ids: 0, classes: 0, elements: 0 }

// :is(), :not() and :has() take the specificity of their most specific argument.
const MAX_ARGUMENT_PSEUDO_CLASSES = new Set(['is', 'not', 'has', 'matches', '-webkit-any', '-moz-any'])
// :where() always contributes zero specificity and its arguments are ignored.
const ZERO_SPECIFICITY_PSEUDO_CLASSES = new Set(['where'])
// :nth-child(An+B of S) / :nth-last-child(An+B of S) contribute the pseudo-class *plus* S.
const NTH_OF_PSEUDO_CLASSES = new Set(['nth-child', 'nth-last-child'])
// Shadow-DOM functions that take a selector argument.
// ::slotted(S) is a pseudo-element plus S; :host(S) / :host-context(S) are a pseudo-class plus S.
const SLOTTED_PSEUDO_ELEMENT = 'slotted'
const HOST_PSEUDO_CLASSES = new Set(['host', 'host-context'])
// Single-colon spellings that CSS still accepts as pseudo-elements.
const LEGACY_PSEUDO_ELEMENTS = new Set(['before', 'after', 'first-line', 'first-letter'])

/**
 * The selector list following a top-level ` of ` inside an `:nth-child()` argument, or null
 * when there is none.
 *
 * `of` only counts as the keyword when it is a standalone word at nesting depth zero: the
 * `of` in `:nth-child(2 of :is(.a, .b))` is the keyword, while one inside a nested selector
 * or a string is not.
 */
const nthOfSelector = (argument: string): string | null => {
  let depth = 0
  let quote: string | null = null

  for (let i = 0; i < argument.length; i += 1) {
    const char = argument[i]
    if (quote) {
      if (char === '\\') i += 1
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (char === '\\') {
      i += 1
      continue
    }
    if (char === '(' || char === '[') {
      depth += 1
      continue
    }
    if (char === ')' || char === ']') {
      depth = Math.max(0, depth - 1)
      continue
    }
    if (depth !== 0 || !/\s/.test(char)) continue

    const match = /^\s+of\s+/i.exec(argument.slice(i))
    if (match) {
      const rest = argument.slice(i + match[0].length).trim()
      return rest || null
    }
  }

  return null
}

const add = (a: Specificity, b: Specificity): Specificity => ({
  ids: a.ids + b.ids,
  classes: a.classes + b.classes,
  elements: a.elements + b.elements,
})

// Specificity is compared as a tuple: ids first, then classes, then elements.
const compare = (a: Specificity, b: Specificity) =>
  a.ids - b.ids || a.classes - b.classes || a.elements - b.elements

// The strongest of a selector list is one whole tuple, never a per-column merge.
const strongest = (list: Specificity[]): Specificity =>
  list.reduce((best, current) => (compare(current, best) > 0 ? current : best), ZERO)

/** Splits on commas that are not nested inside (), [] or quotes. */
const splitTopLevel = (input: string): string[] => {
  const parts: string[] = []
  let current = ''
  let depth = 0
  let quote: string | null = null

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    if (quote) {
      current += char
      if (char === '\\') {
        current += input[i + 1] ?? ''
        i += 1
      } else if (char === quote) {
        quote = null
      }
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      current += char
      continue
    }
    if (char === '\\') {
      current += char + (input[i + 1] ?? '')
      i += 1
      continue
    }
    if (char === '(' || char === '[') depth += 1
    if (char === ')' || char === ']') depth = Math.max(0, depth - 1)
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += char
  }

  parts.push(current)
  return parts.map((part) => part.trim()).filter(Boolean)
}

const readIdentifier = (input: string, start: number): { name: string; end: number } => {
  let name = ''
  let i = start

  while (i < input.length) {
    const char = input[i]
    if (/[a-zA-Z0-9_\u00a0-\uffff-]/.test(char)) {
      name += char
      i += 1
      continue
    }
    if (char === '\\') {
      name += input[i + 1] ?? ''
      i += 2
      continue
    }
    break
  }

  return { name, end: i }
}

/** Index just past the ')' matching the '(' at `start`. */
const skipParens = (input: string, start: number): number => {
  let depth = 0
  let quote: string | null = null

  for (let i = start; i < input.length; i += 1) {
    const char = input[i]
    if (quote) {
      if (char === '\\') i += 1
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (char === '(') depth += 1
    else if (char === ')') {
      depth -= 1
      if (depth === 0) return i + 1
    }
  }

  return input.length
}

/** Index just past the ']' matching the '[' at `start`. */
const skipBrackets = (input: string, start: number): number => {
  let quote: string | null = null

  for (let i = start; i < input.length; i += 1) {
    const char = input[i]
    if (quote) {
      if (char === '\\') i += 1
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (char === ']') return i + 1
  }

  return input.length
}

const specificityOfComplexSelector = (input: string): Specificity => {
  let specificity: Specificity = { ...ZERO }
  let i = 0

  while (i < input.length) {
    const char = input[i]

    // Whitespace, combinators and namespace separators add nothing themselves.
    if (/\s/.test(char) || char === '>' || char === '+' || char === '~' || char === '|') {
      i += 1
      continue
    }

    // The universal selector and the nesting selector add nothing.
    if (char === '*' || char === '&') {
      i += 1
      continue
    }

    if (char === '#') {
      const { name, end } = readIdentifier(input, i + 1)
      if (name) specificity.ids += 1
      i = end
      continue
    }

    if (char === '.') {
      const { name, end } = readIdentifier(input, i + 1)
      if (name) specificity.classes += 1
      i = end
      continue
    }

    // Attribute selector, e.g. [type="text"] -> one class-level component.
    if (char === '[') {
      specificity.classes += 1
      i = skipBrackets(input, i)
      continue
    }

    if (char === ':') {
      const isPseudoElement = input[i + 1] === ':'
      const { name, end } = readIdentifier(input, i + (isPseudoElement ? 2 : 1))
      const lower = name.toLowerCase()
      const openParen = input[end] === '(' ? end : -1
      const afterParen = openParen === -1 ? end : skipParens(input, openParen)

      if (isPseudoElement) {
        // ::before, ::marker, ::part(x) -> element-level component. ::part()'s argument is an
        // identifier, not a selector, so it adds nothing further; ::slotted()'s is a selector.
        if (name) specificity.elements += 1
        if (lower === SLOTTED_PSEUDO_ELEMENT && openParen !== -1) {
          const args = input.slice(openParen + 1, Math.max(openParen + 1, afterParen - 1))
          specificity = add(specificity, strongest(splitTopLevel(args).map(specificityOfComplexSelector)))
        }
      } else if (ZERO_SPECIFICITY_PSEUDO_CLASSES.has(lower)) {
        // :where(...) adds nothing and its arguments are ignored entirely.
      } else if (MAX_ARGUMENT_PSEUDO_CLASSES.has(lower)) {
        // :is(), :not(), :has() -> specificity of their most specific argument.
        if (openParen !== -1) {
          const args = input.slice(openParen + 1, Math.max(openParen + 1, afterParen - 1))
          specificity = add(specificity, strongest(splitTopLevel(args).map(specificityOfComplexSelector)))
        }
      } else if (openParen === -1 && LEGACY_PSEUDO_ELEMENTS.has(lower)) {
        // :before, :after, :first-line, :first-letter -> element-level component.
        specificity.elements += 1
      } else if (name) {
        // Ordinary pseudo-class, e.g. :hover or :nth-child(2) -> class-level component.
        specificity.classes += 1
        if (openParen !== -1) {
          const args = input.slice(openParen + 1, Math.max(openParen + 1, afterParen - 1))
          if (NTH_OF_PSEUDO_CLASSES.has(lower)) {
            // `:nth-child(2n+1 of .item)` = the pseudo-class plus the specificity of `.item`;
            // the `An+B` part contributes nothing of its own.
            const ofSelector = nthOfSelector(args)
            if (ofSelector) {
              specificity = add(specificity, strongest(splitTopLevel(ofSelector).map(specificityOfComplexSelector)))
            }
          } else if (HOST_PSEUDO_CLASSES.has(lower)) {
            // `:host(.card)` / `:host-context(.dark)` = the pseudo-class plus its argument.
            specificity = add(specificity, strongest(splitTopLevel(args).map(specificityOfComplexSelector)))
          }
        }
      }

      i = afterParen
      continue
    }

    const { name, end } = readIdentifier(input, i)
    if (name) {
      // A namespace prefix such as `svg|circle` is not a type selector of its own.
      if (input[end] === '|' && input[end + 1] !== '=') {
        i = end + 1
        continue
      }
      // Type selector, e.g. ul, li, p -> element-level component.
      specificity.elements += 1
      i = end
      continue
    }

    i += 1
  }

  return specificity
}

/**
 * Specificity of a CSS selector as the (ids, classes, elements) triple.
 *
 * - IDs count in the first component.
 * - Classes, attributes and pseudo-classes (`:hover`, `:nth-child(2)`) count in the second.
 * - Type selectors and pseudo-elements (`::before`, `:before`) count in the third.
 * - `:where(...)` contributes zero and its arguments are ignored.
 * - `:is(...)`, `:not(...)` and `:has(...)` contribute the specificity of their most
 *   specific argument as a whole tuple.
 * - `:nth-child(An+B of S)` / `:nth-last-child(An+B of S)` contribute the pseudo-class plus
 *   the specificity of `S`; the `An+B` itself contributes nothing.
 * - `::slotted(S)` contributes a pseudo-element plus `S`; `:host(S)` and `:host-context(S)`
 *   contribute a pseudo-class plus `S`. `::part(x)` takes an identifier, so it is just a
 *   pseudo-element.
 * - For a selector list the strongest selector is returned.
 */
export const computeSpecificity = (selector: string): Specificity =>
  strongest(
    splitTopLevel(selector.replace(/\/\*[\s\S]*?\*\//g, ' ')).map(specificityOfComplexSelector),
  )
