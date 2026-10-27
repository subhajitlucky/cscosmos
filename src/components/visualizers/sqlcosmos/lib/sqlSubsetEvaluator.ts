/**
 * A deliberately small — but real — SQL evaluator for the in-browser scratchpad.
 *
 * It genuinely parses and evaluates the subset of SQL the presets teach:
 *
 *   SELECT * | col | alias.col [AS name] [, ...]
 *   FROM users|orders [AS alias]
 *   [INNER JOIN users|orders [AS alias] ON a.x = b.y]
 *   WHERE col (= | != | <> | > | < | >= | <=) 'text'|number [AND ...]
 *
 * Everything outside that subset (aggregates, GROUP BY, ORDER BY, LEFT JOIN,
 * subqueries, OR, ...) is refused with an explanation. Nothing here ever
 * invents rows: a statement is either evaluated, or reported as unsupported.
 */

export type SqlValue = string | number;
export type SqlRow = Record<string, SqlValue>;

export interface SqlTable {
  columns: string[];
  rows: SqlRow[];
}

export interface SqlResult {
  status: 'ok' | 'unsupported';
  columns: string[];
  rows: SqlRow[];
  /** Present only when the statement was refused; explains why. */
  note?: string;
}

export const SUPPORTED_SQL_SCOPE =
  'SELECT * or a column list, FROM users/orders (with optional alias), one INNER JOIN ... ON a.x = b.y, and WHERE conditions (= != <> > < >= <=) joined by AND.';

const TABLES: Record<string, SqlTable> = {
  users: {
    columns: ['id', 'name', 'email', 'role', 'country'],
    rows: [
      { id: 1, name: 'Alice', email: 'alice@test.com', role: 'admin', country: 'US' },
      { id: 2, name: 'Bob', email: 'bob@test.com', role: 'developer', country: 'CA' },
      { id: 3, name: 'Charlie', email: 'charlie@test.com', role: 'developer', country: 'US' },
      { id: 4, name: 'Diana', email: 'diana@test.com', role: 'designer', country: 'UK' },
    ],
  },
  orders: {
    columns: ['id', 'user_id', 'product', 'total'],
    rows: [
      { id: 101, user_id: 1, product: 'MacBook Pro', total: 2499.0 },
      { id: 102, user_id: 1, product: 'Magic Mouse', total: 99.0 },
      { id: 103, user_id: 2, product: 'Mechanical Keyboard', total: 150.0 },
      { id: 104, user_id: 3, product: '4K Monitor', total: 450.0 },
    ],
  },
};

export const TABLE_NAMES = Object.keys(TABLES);

/** Thrown for every statement this evaluator does not model. */
class Unsupported extends Error {}

/* ------------------------------------------------------------------ parsing */

const TOKEN_RE = /'(?:[^']|'')*'|[\w.]+|[<>=!]+|[*(),;]/g;

const CLAUSE_KEYWORDS = new Set([
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'NATURAL', 'WHERE', 'ON',
  'AND', 'OR', 'GROUP', 'ORDER', 'LIMIT', 'OFFSET', 'HAVING', 'UNION', 'AS',
]);

const UNSUPPORTED_CLAUSES: Record<string, string> = {
  GROUP: 'GROUP BY / aggregate functions are not supported by this scratchpad.',
  ORDER: 'ORDER BY is not supported by this scratchpad.',
  LIMIT: 'LIMIT / OFFSET are not supported by this scratchpad.',
  OFFSET: 'LIMIT / OFFSET are not supported by this scratchpad.',
  HAVING: 'HAVING is not supported by this scratchpad.',
  UNION: 'UNION / INTERSECT / EXCEPT are not supported by this scratchpad.',
  DISTINCT: 'SELECT DISTINCT is not supported by this scratchpad.',
  WITH: 'Common table expressions (WITH) are not supported by this scratchpad.',
};

interface Ref { qualifier?: string; column: string }
interface Condition { ref: Ref; op: string; value: SqlValue }
interface Source { table: string; alias: string }
interface JoinSpec { source: Source; left: Ref; right: Ref }
interface Query {
  projections: Ref[] | null; // null means SELECT *
  aliases: (string | undefined)[];
  from: Source;
  join?: JoinSpec;
  where: Condition[];
}

function unsupportedChar(chunk: string): never {
  throw new Unsupported(`Unsupported character "${chunk.trim()[0]}" in the statement — ${SUPPORTED_SQL_SCOPE}`);
}

function tokenize(sql: string): string[] {
  const src = sql.replace(/--[^\n]*/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ');
  const tokens: string[] = [];
  const re = new RegExp(TOKEN_RE.source, 'g');
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src)) !== null) {
    if (src.slice(last, match.index).trim() !== '') unsupportedChar(src.slice(last, match.index));
    tokens.push(match[0]);
    last = match.index + match[0].length;
  }
  if (src.slice(last).trim() !== '') unsupportedChar(src.slice(last));
  if (tokens.length === 0) throw new Unsupported('Enter a SELECT statement to evaluate.');
  return tokens;
}

function parseQuery(sql: string): Query {
  const t = tokenize(sql);
  let i = 0;
  const peek = (): string | undefined => t[i]?.toUpperCase();
  const take = (): string | undefined => t[i++];

  const ident = (what: string): string => {
    const tok = take();
    if (!tok || !/^[A-Za-z_][\w.]*$/.test(tok)) {
      throw new Unsupported(`Expected ${what}${tok ? `, found "${tok}"` : ''} — ${SUPPORTED_SQL_SCOPE}`);
    }
    return tok.toLowerCase();
  };

  const ref = (what: string): Ref => {
    const parts = ident(what).split('.');
    if (parts.length > 2) throw new Unsupported(`"${parts.join('.')}" is not a valid column reference.`);
    return parts.length === 2 ? { qualifier: parts[0], column: parts[1] } : { column: parts[0] };
  };

  const source = (): Source => {
    const table = ident('a table name');
    if (!TABLES[table]) {
      throw new Unsupported(`Unknown table "${table}" — this scratchpad only holds ${TABLE_NAMES.join(' and ')}.`);
    }
    if (peek() === 'AS') {
      take();
      return { table, alias: ident('a table alias') };
    }
    const tok = t[i];
    if (tok && /^[A-Za-z_]/.test(tok) && !CLAUSE_KEYWORDS.has(tok.toUpperCase())) {
      return { table, alias: ident('a table alias') };
    }
    return { table, alias: table };
  };

  const value = (): SqlValue => {
    const tok = take();
    if (tok === undefined) throw new Unsupported('The condition is missing a value.');
    if (tok.startsWith("'")) return tok.slice(1, -1).replace(/''/g, "'");
    if (/^\d+(\.\d+)?$/.test(tok)) return Number(tok);
    throw new Unsupported(`"${tok}" is not a value — write text in single quotes ('developer') or use a number.`);
  };

  if (peek() === 'WITH') throw new Unsupported(UNSUPPORTED_CLAUSES.WITH);
  if (peek() !== 'SELECT') throw new Unsupported('Only SELECT statements are supported by this scratchpad.');

  take();
  let projections: Ref[] | null = null;
  const aliases: (string | undefined)[] = [];
  if (peek() === '*') {
    take();
  } else {
    projections = [];
    for (;;) {
      const keyword = peek();
      if (keyword && UNSUPPORTED_CLAUSES[keyword]) throw new Unsupported(UNSUPPORTED_CLAUSES[keyword]);
      projections.push(ref('a column name'));
      if (peek() === '(') {
        throw new Unsupported('Function calls such as COUNT() or SUM() are not supported by this scratchpad.');
      }
      let alias: string | undefined;
      if (peek() === 'AS') {
        take();
        alias = ident('a column alias');
      }
      aliases.push(alias);
      if (peek() === ',') {
        take();
        continue;
      }
      break;
    }
  }

  if (peek() !== 'FROM') {
    throw new Unsupported(`Expected FROM in the statement${peek() ? `, found "${peek()}"` : ''} — ${SUPPORTED_SQL_SCOPE}`);
  }
  take();
  const from = source();

  let join: JoinSpec | undefined;
  if (peek() === 'INNER') take();
  for (const bad of ['LEFT', 'RIGHT', 'FULL', 'CROSS', 'NATURAL']) {
    if (peek() === bad) throw new Unsupported(`${bad} JOIN is not supported — this scratchpad only models INNER JOIN.`);
  }
  if (peek() === 'JOIN') {
    take();
    const joined = source();
    if (peek() !== 'ON') throw new Unsupported('A JOIN needs an ON condition (ON a.x = b.y).');
    take();
    const left = ref('the left join column');
    if (take() !== '=') throw new Unsupported('Only equality joins (ON a.x = b.y) are supported.');
    join = { source: joined, left, right: ref('the right join column') };
  }

  const where: Condition[] = [];
  if (peek() === 'WHERE') {
    take();
    for (;;) {
      const column = ref('a column in the WHERE clause');
      const op = take();
      if (!op || !['=', '!=', '<>', '>', '<', '>=', '<='].includes(op)) {
        throw new Unsupported(`Unsupported WHERE operator "${op ?? 'end of statement'}" — use =, !=, <>, >, <, >= or <=.`);
      }
      where.push({ ref: column, op, value: value() });
      if (peek() === 'AND') {
        take();
        continue;
      }
      if (peek() === 'OR') throw new Unsupported('OR is not supported — this scratchpad evaluates AND-joined conditions only.');
      break;
    }
  }

  if (peek() === ';') take();
  if (i < t.length) {
    const rest = t.slice(i).join(' ');
    const keyword = t[i].toUpperCase();
    throw new Unsupported(UNSUPPORTED_CLAUSES[keyword] ?? `Unsupported SQL "${rest}" — ${SUPPORTED_SQL_SCOPE}`);
  }

  return { projections, aliases, from, join, where };
}

/* --------------------------------------------------------------- evaluating */

function ambiguousColumns(sources: Source[]): Set<string> {
  const counts: Record<string, number> = {};
  for (const source of sources) {
    for (const column of TABLES[source.table].columns) counts[column] = (counts[column] ?? 0) + 1;
  }
  return new Set(Object.keys(counts).filter((column) => counts[column] > 1));
}

/** Flattens one row per source into `alias.col`, `table.col` and (when unambiguous) `col` keys. */
function scopeOf(sources: Source[], picks: SqlRow[], ambiguous: Set<string>): SqlRow {
  const scope: SqlRow = {};
  sources.forEach((source, index) => {
    for (const [column, value] of Object.entries(picks[index])) {
      scope[`${source.alias}.${column}`] = value;
      scope[`${source.table}.${column}`] = value;
      if (!ambiguous.has(column)) scope[column] = value;
    }
  });
  return scope;
}

function lookup(scope: SqlRow, ref: Ref): SqlValue {
  const key = ref.qualifier ? `${ref.qualifier}.${ref.column}` : ref.column;
  if (!(key in scope)) {
    throw new Unsupported(
      `Column "${key}" is not available here — qualify it with a table alias (e.g. "u.${ref.column}"). Known columns: ${Object.keys(scope).join(', ')}.`
    );
  }
  return scope[key];
}

const ORDER_OPS: Record<string, (a: number, b: number) => boolean> = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
};

function matches(scope: SqlRow, condition: Condition): boolean {
  const left = lookup(scope, condition.ref);
  if (condition.op === '=') return left === condition.value;
  if (condition.op === '!=' || condition.op === '<>') return left !== condition.value;
  const compare = ORDER_OPS[condition.op];
  if (!compare) throw new Unsupported(`Unsupported operator "${condition.op}".`);
  const a = typeof left === 'number' ? left : Number(left);
  const b = typeof condition.value === 'number' ? condition.value : Number(condition.value);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new Unsupported(`"${condition.op}" compares numbers — one side of this condition is text.`);
  }
  return compare(a, b);
}

export function evaluateSql(sql: string): SqlResult {
  try {
    const query = parseQuery(sql);
    const sources: Source[] = query.join ? [query.from, query.join.source] : [query.from];

    for (let a = 0; a < sources.length; a++) {
      for (let b = a + 1; b < sources.length; b++) {
        const used = new Set([sources[a].alias, sources[a].table]);
        const clash = [sources[b].alias, sources[b].table].find((name) => used.has(name));
        if (clash) throw new Unsupported(`"${clash}" names two different tables — give each joined table its own alias.`);
      }
    }

    const ambiguous = ambiguousColumns(sources);
    let combinations: SqlRow[][] = TABLES[query.from.table].rows.map((row) => [row]);

    if (query.join) {
      const { source: joined, left, right } = query.join;
      const pairs: SqlRow[][] = [];
      for (const combination of combinations) {
        for (const rightRow of TABLES[joined.table].rows) {
          const candidate = [...combination, rightRow];
          const scope = scopeOf(sources, candidate, ambiguous);
          if (lookup(scope, left) === lookup(scope, right)) pairs.push(candidate);
        }
      }
      combinations = pairs;
    }

    if (query.where.length > 0) {
      const conditions = query.where;
      combinations = combinations.filter((combination) => {
        const scope = scopeOf(sources, combination, ambiguous);
        return conditions.every((condition) => matches(scope, condition));
      });
    }

    const projections = query.projections;
    let columns: string[];

    if (projections) {
      columns = projections.map((projection, index) => query.aliases[index] ?? projection.column);
      if (new Set(columns).size !== columns.length) {
        throw new Unsupported('Two selected columns would share a name — add AS to rename one of them.');
      }
      const rows = combinations.map((combination) => {
        const scope = scopeOf(sources, combination, ambiguous);
        const row: SqlRow = {};
        projections.forEach((projection, index) => {
          row[columns[index]] = lookup(scope, projection);
        });
        return row;
      });
      return { status: 'ok', columns, rows };
    }

    columns = sources.length === 1
      ? [...TABLES[sources[0].table].columns]
      : sources.flatMap((source) => TABLES[source.table].columns.map((column) => `${source.alias}.${column}`));

    const rows = combinations.map((combination) => {
      const scope = scopeOf(sources, combination, ambiguous);
      const row: SqlRow = {};
      for (const column of columns) row[column] = scope[column];
      return row;
    });
    return { status: 'ok', columns, rows };
  } catch (error) {
    if (error instanceof Unsupported) {
      return { status: 'unsupported', columns: [], rows: [], note: error.message };
    }
    return {
      status: 'unsupported',
      columns: [],
      rows: [],
      note: `This statement could not be evaluated by the built-in subset evaluator. ${SUPPORTED_SQL_SCOPE}`,
    };
  }
}
