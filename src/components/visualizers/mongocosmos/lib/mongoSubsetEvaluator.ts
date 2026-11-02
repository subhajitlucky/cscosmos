// In-memory MQL (MongoDB Query Language) and Aggregation Pipeline Evaluator
// Evaluates MongoDB queries and aggregations against in-memory BSON-like document collections.

export type MongoDoc = Record<string, any>;

export interface MongoExplainPlan {
  stage: 'COLLSCAN' | 'IXSCAN';
  indexName?: string;
  nReturned: number;
  docsExamined: number;
  keysExamined: number;
  isCovered: boolean;
  executionTimeMillis: number;
  winningPlan: {
    stage: string;
    inputStage?: {
      stage: string;
      indexName?: string;
    };
  };
}

export interface MongoExecutionResult {
  documents: MongoDoc[];
  count: number;
  explain: MongoExplainPlan;
  collection: string;
  queryType: 'find' | 'aggregate';
  error?: string;
}

export const MOCK_COLLECTIONS: Record<string, MongoDoc[]> = {
  users: [
    { _id: 'u1', name: 'Alice Chen', email: 'alice@cloud.io', role: 'admin', country: 'US', age: 29, status: 'active', tags: ['lead', 'infra'], score: 95 },
    { _id: 'u2', name: 'Bob Martinez', email: 'bob@cloud.io', role: 'developer', country: 'CA', age: 34, status: 'active', tags: ['backend', 'go'], score: 88 },
    { _id: 'u3', name: 'Charlie Kim', email: 'charlie@cloud.io', role: 'developer', country: 'US', age: 26, status: 'pending', tags: ['frontend', 'react'], score: 72 },
    { _id: 'u4', name: 'Diana Prince', email: 'diana@cloud.io', role: 'designer', country: 'UK', age: 31, status: 'active', tags: ['ui', 'ux'], score: 91 },
    { _id: 'u5', name: 'Evan Wright', email: 'evan@cloud.io', role: 'developer', country: 'DE', age: 40, status: 'inactive', tags: ['backend', 'db'], score: 65 },
    { _id: 'u6', name: 'Fiona Gallagher', email: 'fiona@cloud.io', role: 'manager', country: 'US', age: 37, status: 'active', tags: ['lead', 'product'], score: 84 },
    { _id: 'u7', name: 'George Clark', email: 'george@cloud.io', role: 'developer', country: 'CA', age: 28, status: 'active', tags: ['mobile', 'ios'], score: 79 },
    { _id: 'u8', name: 'Hannah Abbott', email: 'hannah@cloud.io', role: 'designer', country: 'UK', age: 25, status: 'pending', tags: ['graphics'], score: 68 },
  ],

  orders: [
    { _id: 'o101', user_id: 'u1', product: 'MacBook Pro M3', category: 'Hardware', total: 2499, status: 'completed', quantity: 1, payment: 'wire', created_at: '2026-01-15' },
    { _id: 'o102', user_id: 'u2', product: 'Mechanical Keyboard', category: 'Accessories', total: 180, status: 'completed', quantity: 2, payment: 'card', created_at: '2026-01-20' },
    { _id: 'o103', user_id: 'u3', product: '4K UltraWide Monitor', category: 'Displays', total: 850, status: 'shipped', quantity: 1, payment: 'card', created_at: '2026-02-01' },
    { _id: 'o104', user_id: 'u1', product: 'Ergonomic Desk Chair', category: 'Furniture', total: 650, status: 'completed', quantity: 1, payment: 'wire', created_at: '2026-02-10' },
    { _id: 'o105', user_id: 'u5', product: 'Noise Cancelling Headphones', category: 'Audio', total: 350, status: 'cancelled', quantity: 1, payment: 'card', created_at: '2026-02-14' },
    { _id: 'o106', user_id: 'u2', product: 'Thunderbolt Dock', category: 'Accessories', total: 280, status: 'completed', quantity: 1, payment: 'card', created_at: '2026-02-18' },
    { _id: 'o107', user_id: 'u6', product: 'Studio Microphone', category: 'Audio', total: 220, status: 'completed', quantity: 1, payment: 'paypal', created_at: '2026-02-22' },
    { _id: 'o108', user_id: 'u4', product: 'Drawing Tablet Pro', category: 'Hardware', total: 750, status: 'completed', quantity: 1, payment: 'card', created_at: '2026-03-01' },
  ],

  products: [
    { _id: 'p1', name: 'MacBook Pro M3', category: 'Hardware', price: 2499, stock: 15, rating: 4.9, active: true, specs: { ram: 36, cpu: 'M3 Pro' } },
    { _id: 'p2', name: 'Mechanical Keyboard', category: 'Accessories', price: 180, stock: 85, rating: 4.7, active: true, specs: { switch: 'Brown', wireless: true } },
    { _id: 'p3', name: '4K UltraWide Monitor', category: 'Displays', price: 850, stock: 24, rating: 4.8, active: true, specs: { refreshRate: 144, panel: 'IPS' } },
    { _id: 'p4', name: 'Ergonomic Desk Chair', category: 'Furniture', price: 650, stock: 12, rating: 4.6, active: true, specs: { lumbarSupport: true } },
    { _id: 'p5', name: 'Noise Cancelling Headphones', category: 'Audio', price: 350, stock: 45, rating: 4.5, active: true, specs: { batteryHours: 30 } },
    { _id: 'p6', name: 'Thunderbolt Dock', category: 'Accessories', price: 280, stock: 32, rating: 4.4, active: true, specs: { ports: 11, powerDelivery: 96 } },
    { _id: 'p7', name: 'Studio Microphone', category: 'Audio', price: 220, stock: 50, rating: 4.6, active: false, specs: { polarPattern: 'Cardioid' } },
    { _id: 'p8', name: 'Drawing Tablet Pro', category: 'Hardware', price: 750, stock: 18, rating: 4.9, active: true, specs: { penPressure: 8192 } },
  ],

  customers: [
    { _id: 'c1', name: 'Acme Corp', tier: 'Enterprise', creditLimit: 50000, country: 'US', contact: { email: 'ops@acme.com', phone: '+1-555-010' }, active: true },
    { _id: 'c2', name: 'Globex Ltd', tier: 'Growth', creditLimit: 25000, country: 'DE', contact: { email: 'billing@globex.de', phone: '+49-30-020' }, active: true },
    { _id: 'c3', name: 'Soylent Inc', tier: 'Enterprise', creditLimit: 80000, country: 'US', contact: { email: 'finance@soylent.com', phone: '+1-555-030' }, active: false },
    { _id: 'c4', name: 'Initech Systems', tier: 'Starter', creditLimit: 5000, country: 'CA', contact: { email: 'peter@initech.ca', phone: '+1-416-040' }, active: true },
    { _id: 'c5', name: 'Umbrella Health', tier: 'Enterprise', creditLimit: 120000, country: 'UK', contact: { email: 'security@umbrella.co.uk', phone: '+44-20-050' }, active: true },
  ],

  servers: [
    { _id: 'srv-01', hostname: 'prod-api-01', region: 'us-east', status: 'active', cores: 32, ramGb: 64, tags: ['k8s', 'api'], loadAvg: 0.42 },
    { _id: 'srv-02', hostname: 'prod-api-02', region: 'us-east', status: 'active', cores: 32, ramGb: 64, tags: ['k8s', 'api'], loadAvg: 0.38 },
    { _id: 'srv-03', hostname: 'prod-db-01', region: 'us-east', status: 'active', cores: 64, ramGb: 256, tags: ['mongo', 'primary'], loadAvg: 0.81 },
    { _id: 'srv-04', hostname: 'prod-db-02', region: 'us-west', status: 'active', cores: 64, ramGb: 256, tags: ['mongo', 'secondary'], loadAvg: 0.65 },
    { _id: 'srv-05', hostname: 'prod-cache-01', region: 'eu-west', status: 'maintenance', cores: 16, ramGb: 32, tags: ['redis'], loadAvg: 0.12 },
    { _id: 'srv-06', hostname: 'prod-worker-01', region: 'eu-west', status: 'active', cores: 16, ramGb: 32, tags: ['celery', 'jobs'], loadAvg: 0.55 },
  ]
};

// Known indexed fields in the virtual collections
const INDEXED_FIELDS: Record<string, string[]> = {
  users: ['_id', 'email', 'role', 'status'],
  orders: ['_id', 'user_id', 'category', 'status', 'created_at'],
  products: ['_id', 'category', 'price', 'active'],
  customers: ['_id', 'tier', 'country', 'active'],
  servers: ['_id', 'region', 'status', 'hostname']
};

/**
 * Safely resolves nested property paths (e.g. 'contact.email' or 'specs.ram')
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  if (path in obj) return obj[path];
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr === null || curr === undefined || typeof curr !== 'object') return undefined;
    curr = curr[part];
  }
  return curr;
}

/**
 * Evaluates aggregation expressions ($multiply, $cond, $add, etc.) against a document
 */
export function evaluateExpression(expr: any, doc: MongoDoc): any {
  if (expr === null || expr === undefined) return expr;
  if (typeof expr === 'string') {
    if (expr.startsWith('$')) {
      return getNestedValue(doc, expr.slice(1));
    }
    return expr;
  }
  if (typeof expr === 'number' || typeof expr === 'boolean') {
    return expr;
  }
  if (Array.isArray(expr)) {
    return expr.map((e) => evaluateExpression(e, doc));
  }
  if (typeof expr === 'object') {
    const keys = Object.keys(expr);
    if (keys.length === 0) return expr;
    const op = keys[0];
    const val = expr[op];

    switch (op) {
      case '$multiply': {
        const [a, b] = Array.isArray(val) ? val : [0, 0];
        const valA = Number(evaluateExpression(a, doc)) || 0;
        const valB = Number(evaluateExpression(b, doc)) || 0;
        return valA * valB;
      }
      case '$add': {
        const arr = Array.isArray(val) ? val : [];
        return arr.reduce((acc: number, item: any) => acc + (Number(evaluateExpression(item, doc)) || 0), 0);
      }
      case '$subtract': {
        const [a, b] = Array.isArray(val) ? val : [0, 0];
        return (Number(evaluateExpression(a, doc)) || 0) - (Number(evaluateExpression(b, doc)) || 0);
      }
      case '$divide': {
        const [a, b] = Array.isArray(val) ? val : [0, 1];
        const denom = Number(evaluateExpression(b, doc)) || 1;
        return (Number(evaluateExpression(a, doc)) || 0) / denom;
      }
      case '$cond': {
        let ifCond: any;
        let thenVal: any;
        let elseVal: any;
        if (Array.isArray(val)) {
          [ifCond, thenVal, elseVal] = val;
        } else if (val && typeof val === 'object') {
          ifCond = val.if;
          thenVal = val.then;
          elseVal = val.else;
        }
        const condMet = evaluateComparisonExpression(ifCond, doc);
        return condMet ? evaluateExpression(thenVal, doc) : evaluateExpression(elseVal, doc);
      }
      case '$toUpper': {
        const str = String(evaluateExpression(val, doc) ?? '');
        return str.toUpperCase();
      }
      case '$toLower': {
        const str = String(evaluateExpression(val, doc) ?? '');
        return str.toLowerCase();
      }
      case '$concat': {
        const parts = Array.isArray(val) ? val : [val];
        return parts.map((p) => String(evaluateExpression(p, doc) ?? '')).join('');
      }
      default:
        return expr;
    }
  }
  return expr;
}

/**
 * Evaluates conditional expressions in $cond (e.g. { $gte: ["$price", 500] })
 */
function evaluateComparisonExpression(cond: any, doc: MongoDoc): boolean {
  if (typeof cond === 'boolean') return cond;
  if (!cond || typeof cond !== 'object') return Boolean(cond);
  const op = Object.keys(cond)[0];
  const args = cond[op];
  if (!Array.isArray(args) || args.length < 2) return false;
  const left = evaluateExpression(args[0], doc);
  const right = evaluateExpression(args[1], doc);
  switch (op) {
    case '$eq': return left === right;
    case '$ne': return left !== right;
    case '$gt': return left > right;
    case '$gte': return left >= right;
    case '$lt': return left < right;
    case '$lte': return left <= right;
    default: return false;
  }
}

/**
 * Evaluates a single MQL condition on a document field
 */
function evaluateCondition(docVal: any, condVal: any): boolean {
  if (condVal === null) {
    return docVal === null || docVal === undefined;
  }

  // Primitive equality or RegExp object
  if (typeof condVal !== 'object' || condVal instanceof RegExp) {
    if (condVal instanceof RegExp) {
      if (Array.isArray(docVal)) {
        return docVal.some((v) => condVal.test(String(v ?? '')));
      }
      return condVal.test(String(docVal ?? ''));
    }
    if (Array.isArray(docVal)) {
      return docVal.includes(condVal);
    }
    return docVal === condVal;
  }

  // Object condition with operators ($gt, $in, $regex, etc.)
  for (const op of Object.keys(condVal)) {
    const target = condVal[op];

    switch (op) {
      case '$eq':
        if (docVal !== target) return false;
        break;
      case '$ne':
        if (docVal === target) return false;
        break;
      case '$gt':
        if (!(docVal > target)) return false;
        break;
      case '$gte':
        if (!(docVal >= target)) return false;
        break;
      case '$lt':
        if (!(docVal < target)) return false;
        break;
      case '$lte':
        if (!(docVal <= target)) return false;
        break;
      case '$in':
        if (!Array.isArray(target)) return false;
        if (Array.isArray(docVal)) {
          if (!docVal.some((v) => target.includes(v))) return false;
        } else if (!target.includes(docVal)) {
          return false;
        }
        break;
      case '$nin':
        if (!Array.isArray(target)) return false;
        if (Array.isArray(docVal)) {
          if (docVal.some((v) => target.includes(v))) return false;
        } else if (target.includes(docVal)) {
          return false;
        }
        break;
      case '$exists': {
        const exists = docVal !== undefined;
        if (exists !== Boolean(target)) return false;
        break;
      }
      case '$regex': {
        const pattern = typeof target === 'string' ? target : (target instanceof RegExp ? target.source : String(target));
        const options = condVal.$options || (target instanceof RegExp ? target.flags : '');
        const rx = new RegExp(pattern, options);
        if (Array.isArray(docVal)) {
          if (!docVal.some((v) => rx.test(String(v ?? '')))) return false;
        } else if (!rx.test(String(docVal ?? ''))) {
          return false;
        }
        break;
      }
      case '$options':
        // Evaluated alongside $regex
        break;
      case '$all':
        if (!Array.isArray(docVal) || !Array.isArray(target)) return false;
        if (!target.every((item) => docVal.includes(item))) return false;
        break;
      case '$size':
        if (!Array.isArray(docVal) || docVal.length !== Number(target)) return false;
        break;
      default:
        // Nested sub-document exact match
        if (typeof target === 'object' && docVal && typeof docVal === 'object') {
          if (!matchesFilter(docVal, { [op]: target })) return false;
        } else if (docVal?.[op] !== target) {
          return false;
        }
    }
  }

  return true;
}

/**
 * Evaluates whether a document matches an MQL filter object
 */
export function matchesFilter(doc: MongoDoc, filter: Record<string, any>): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const key of Object.keys(filter)) {
    const val = filter[key];

    if (key === '$and') {
      if (!Array.isArray(val)) return false;
      if (!val.every((clause) => matchesFilter(doc, clause))) return false;
      continue;
    }

    if (key === '$or') {
      if (!Array.isArray(val)) return false;
      if (!val.some((clause) => matchesFilter(doc, clause))) return false;
      continue;
    }

    if (key === '$nor') {
      if (!Array.isArray(val)) return false;
      if (val.some((clause) => matchesFilter(doc, clause))) return false;
      continue;
    }

    const docVal = getNestedValue(doc, key);
    if (!evaluateCondition(docVal, val)) {
      return false;
    }
  }

  return true;
}

/**
 * Projects fields in a document according to a projection spec
 */
export function applyProjection(doc: MongoDoc, projection?: Record<string, any>): MongoDoc {
  if (!projection || Object.keys(projection).length === 0) {
    return { ...doc };
  }

  const keys = Object.keys(projection);
  const isInclusion = keys.some((k) => k !== '_id' && Boolean(projection[k]));

  if (isInclusion) {
    const result: MongoDoc = {};
    if (projection._id !== 0 && '_id' in doc) {
      result._id = doc._id;
    }
    for (const key of keys) {
      if (key === '_id' && projection._id === 0) continue;
      if (projection[key]) {
        if (typeof projection[key] === 'object' && projection[key] !== null) {
          result[key] = evaluateExpression(projection[key], doc);
        } else {
          const val = getNestedValue(doc, key);
          if (val !== undefined) {
            result[key] = val;
          }
        }
      }
    }
    return result;
  } else {
    // Exclusion mode
    const result = { ...doc };
    for (const key of keys) {
      if (!projection[key]) {
        delete result[key];
      }
    }
    return result;
  }
}

/**
 * Parses MQL query string (e.g. `db.users.find({ role: 'developer' }).sort({ age: -1 })`)
 */
export function parseMongoQueryString(queryStr: string): {
  collection: string;
  op: 'find' | 'aggregate';
  args: any[];
  chain: Array<{ method: string; args: any[] }>;
} {
  const clean = queryStr.trim().replace(/;+$/, '');

  const prefixMatch = clean.match(/^db\.([a-zA-Z0-9_]+)\.(find|aggregate)\s*\(/);

  if (!prefixMatch) {
    // Try raw JSON parse as a fallback find query
    try {
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed)) {
        return { collection: 'users', op: 'aggregate', args: [parsed], chain: [] };
      }
      return { collection: 'users', op: 'find', args: [parsed], chain: [] };
    } catch {
      throw new Error('Invalid MQL syntax. Format must be `db.<collection>.find(...)` or `db.<collection>.aggregate([...])`');
    }
  }

  const collection = prefixMatch[1];
  const op = prefixMatch[2] as 'find' | 'aggregate';
  const startIdx = prefixMatch[0].length - 1;

  // Scan for matching closing parenthesis
  let depth = 0;
  let inString: string | null = null;
  let endIdx = -1;

  for (let i = startIdx; i < clean.length; i++) {
    const ch = clean[i];
    const prev = i > 0 ? clean[i - 1] : '';
    if (inString) {
      if (ch === inString && prev !== '\\') {
        inString = null;
      }
    } else {
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = ch;
      } else if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
  }

  if (endIdx === -1) {
    throw new Error('Unclosed parenthesis in db.' + collection + '.' + op + '(...)');
  }

  const rawArgs = clean.slice(startIdx + 1, endIdx);
  const chainedStr = clean.slice(endIdx + 1).trim();

  // Parse inner arguments using safe Function evaluation
  let args: any[] = [];
  if (rawArgs.trim().length > 0) {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return [${rawArgs}];`);
      args = fn();
    } catch {
      try {
        args = [JSON.parse(rawArgs)];
      } catch {
        throw new Error('Could not parse arguments inside db.' + collection + '.' + op + '(...)');
      }
    }
  }

  // Parse chained methods like .sort({ price: -1 }).limit(5)
  const chain: Array<{ method: string; args: any[] }> = [];
  let rest = chainedStr;

  while (rest.length > 0) {
    const methodMatch = rest.match(/^\.([a-zA-Z0-9_]+)\s*\(/);
    if (!methodMatch) break;
    const method = methodMatch[1];
    const mStart = methodMatch[0].length - 1;
    let mDepth = 0;
    let mInStr: string | null = null;
    let mEnd = -1;

    for (let j = mStart; j < rest.length; j++) {
      const c = rest[j];
      const p = j > 0 ? rest[j - 1] : '';
      if (mInStr) {
        if (c === mInStr && p !== '\\') mInStr = null;
      } else {
        if (c === '"' || c === "'" || c === '`') {
          mInStr = c;
        } else if (c === '(') {
          mDepth++;
        } else if (c === ')') {
          mDepth--;
          if (mDepth === 0) {
            mEnd = j;
            break;
          }
        }
      }
    }

    if (mEnd === -1) break;
    const mArgsRaw = rest.slice(mStart + 1, mEnd).trim();
    let mArgs: any[] = [];
    if (mArgsRaw.length > 0) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`return [${mArgsRaw}];`);
        mArgs = fn();
      } catch {
        mArgs = [JSON.parse(mArgsRaw)];
      }
    }
    chain.push({ method, args: mArgs });
    rest = rest.slice(mEnd + 1).trim();
  }

  return { collection, op, args, chain };
}

/**
 * Executes an in-memory aggregation pipeline
 */
export function executeAggregationPipeline(
  docs: MongoDoc[],
  pipeline: Record<string, any>[],
  allDb: Record<string, MongoDoc[]> = MOCK_COLLECTIONS
): MongoDoc[] {
  let currentDocs = docs.map((d) => ({ ...d }));

  for (const stage of pipeline) {
    const stageName = Object.keys(stage)[0];
    const stageVal = stage[stageName];

    switch (stageName) {
      case '$match': {
        currentDocs = currentDocs.filter((d) => matchesFilter(d, stageVal));
        break;
      }
      case '$project': {
        currentDocs = currentDocs.map((d) => applyProjection(d, stageVal));
        break;
      }
      case '$set':
      case '$addFields': {
        currentDocs = currentDocs.map((d) => {
          const next = { ...d };
          for (const k of Object.keys(stageVal)) {
            next[k] = evaluateExpression(stageVal[k], d);
          }
          return next;
        });
        break;
      }
      case '$sort': {
        const sortKeys = Object.keys(stageVal);
        currentDocs.sort((a, b) => {
          for (const key of sortKeys) {
            const dir = stageVal[key] >= 0 ? 1 : -1;
            const valA = getNestedValue(a, key);
            const valB = getNestedValue(b, key);
            if (valA === valB) continue;
            if (valA === undefined) return 1 * dir;
            if (valB === undefined) return -1 * dir;
            return valA > valB ? dir : -dir;
          }
          return 0;
        });
        break;
      }
      case '$limit': {
        currentDocs = currentDocs.slice(0, Number(stageVal));
        break;
      }
      case '$skip': {
        currentDocs = currentDocs.slice(Number(stageVal));
        break;
      }
      case '$count': {
        currentDocs = [{ [String(stageVal)]: currentDocs.length }];
        break;
      }
      case '$unwind': {
        const path = typeof stageVal === 'string' ? stageVal.replace(/^\$/, '') : stageVal.path.replace(/^\$/, '');
        const newDocs: MongoDoc[] = [];
        for (const doc of currentDocs) {
          const arr = getNestedValue(doc, path);
          if (Array.isArray(arr) && arr.length > 0) {
            for (const item of arr) {
              const copy = { ...doc };
              copy[path] = item;
              newDocs.push(copy);
            }
          } else if (stageVal && typeof stageVal === 'object' && stageVal.preserveNullAndEmptyArrays) {
            newDocs.push({ ...doc, [path]: null });
          }
        }
        currentDocs = newDocs;
        break;
      }
      case '$lookup': {
        const from = stageVal.from;
        const localField = stageVal.localField;
        const foreignField = stageVal.foreignField;
        const asField = stageVal.as;
        const foreignDocs = (allDb && allDb[from]) ? allDb[from] : [];
        currentDocs = currentDocs.map((doc) => {
          const localVal = getNestedValue(doc, localField);
          const matches = foreignDocs.filter((fDoc) => {
            const fVal = getNestedValue(fDoc, foreignField);
            return fVal === localVal;
          });
          return { ...doc, [asField]: matches };
        });
        break;
      }
      case '$facet': {
        const facetKeys = Object.keys(stageVal);
        const facetOut: MongoDoc = {};
        for (const fKey of facetKeys) {
          const subStages = stageVal[fKey];
          facetOut[fKey] = executeAggregationPipeline(currentDocs, subStages, allDb);
        }
        currentDocs = [facetOut];
        break;
      }
      case '$bucket': {
        const groupBy = stageVal.groupBy;
        const boundaries: number[] = stageVal.boundaries || [];
        const outputSpec = stageVal.output || { count: { $sum: 1 } };
        const buckets: Array<{ id: number; docs: MongoDoc[] }> = [];

        for (let i = 0; i < boundaries.length - 1; i++) {
          buckets.push({ id: boundaries[i], docs: [] });
        }

        for (const doc of currentDocs) {
          const numVal = Number(evaluateExpression(groupBy, doc));
          for (let i = 0; i < boundaries.length - 1; i++) {
            const low = boundaries[i];
            const high = boundaries[i + 1];
            if (numVal >= low && numVal < high) {
              buckets[i].docs.push(doc);
              break;
            }
          }
        }

        const bucketOut: MongoDoc[] = [];
        for (const b of buckets) {
          if (b.docs.length === 0) continue;
          const row: MongoDoc = { _id: b.id };
          for (const outKey of Object.keys(outputSpec)) {
            const accSpec = outputSpec[outKey];
            const accOp = Object.keys(accSpec)[0];
            const expr = accSpec[accOp];
            if (accOp === '$sum') {
              if (expr === 1) {
                row[outKey] = b.docs.length;
              } else {
                row[outKey] = b.docs.reduce((acc, d) => acc + (Number(evaluateExpression(expr, d)) || 0), 0);
              }
            } else if (accOp === '$avg') {
              const sum = b.docs.reduce((acc, d) => acc + (Number(evaluateExpression(expr, d)) || 0), 0);
              row[outKey] = b.docs.length ? Math.round((sum / b.docs.length) * 100) / 100 : 0;
            }
          }
          bucketOut.push(row);
        }
        currentDocs = bucketOut;
        break;
      }
      case '$group': {
        const idExpr = stageVal._id;
        const groups = new Map<any, MongoDoc[]>();

        // Partition into groups
        for (const doc of currentDocs) {
          let groupId: any = null;
          if (idExpr === null) {
            groupId = null;
          } else if (typeof idExpr === 'string' && idExpr.startsWith('$')) {
            groupId = getNestedValue(doc, idExpr.slice(1));
          } else {
            groupId = idExpr;
          }

          const key = JSON.stringify(groupId);
          if (!groups.has(key)) {
            groups.set(key, []);
          }
          groups.get(key)!.push(doc);
        }

        // Aggregate accumulators
        const outDocs: MongoDoc[] = [];
        const accumulators = Object.keys(stageVal).filter((k) => k !== '_id');

        for (const [serializedKey, groupItems] of groups.entries()) {
          const actualId = serializedKey === 'null' ? null : JSON.parse(serializedKey);
          const outRow: MongoDoc = { _id: actualId };

          for (const accKey of accumulators) {
            const accSpec = stageVal[accKey];
            const accOp = Object.keys(accSpec)[0];
            const expr = accSpec[accOp];

            if (accOp === '$sum') {
              if (expr === 1) {
                outRow[accKey] = groupItems.length;
              } else if (typeof expr === 'string' && expr.startsWith('$')) {
                const field = expr.slice(1);
                outRow[accKey] = groupItems.reduce((acc, item) => acc + (Number(getNestedValue(item, field)) || 0), 0);
              } else {
                outRow[accKey] = groupItems.length * (Number(expr) || 0);
              }
            } else if (accOp === '$avg') {
              if (typeof expr === 'string' && expr.startsWith('$')) {
                const field = expr.slice(1);
                const sum = groupItems.reduce((acc, item) => acc + (Number(getNestedValue(item, field)) || 0), 0);
                outRow[accKey] = groupItems.length ? Math.round((sum / groupItems.length) * 100) / 100 : 0;
              }
            } else if (accOp === '$min') {
              if (typeof expr === 'string' && expr.startsWith('$')) {
                const field = expr.slice(1);
                outRow[accKey] = Math.min(...groupItems.map((item) => Number(getNestedValue(item, field)) || 0));
              }
            } else if (accOp === '$max') {
              if (typeof expr === 'string' && expr.startsWith('$')) {
                const field = expr.slice(1);
                outRow[accKey] = Math.max(...groupItems.map((item) => Number(getNestedValue(item, field)) || 0));
              }
            } else if (accOp === '$first') {
              if (groupItems.length > 0) {
                outRow[accKey] = evaluateExpression(expr, groupItems[0]);
              }
            } else if (accOp === '$last') {
              if (groupItems.length > 0) {
                outRow[accKey] = evaluateExpression(expr, groupItems[groupItems.length - 1]);
              }
            } else if (accOp === '$push') {
              if (typeof expr === 'string' && expr.startsWith('$')) {
                const field = expr.slice(1);
                outRow[accKey] = groupItems.map((item) => getNestedValue(item, field));
              }
            } else if (accOp === '$addToSet') {
              if (typeof expr === 'string' && expr.startsWith('$')) {
                const field = expr.slice(1);
                outRow[accKey] = Array.from(new Set(groupItems.map((item) => getNestedValue(item, field))));
              }
            }
          }

          outDocs.push(outRow);
        }

        currentDocs = outDocs;
        break;
      }
      default:
        // Pass through unsupported stage gracefully
        break;
    }
  }

  return currentDocs;
}

/**
 * Computes an execution plan summary (IXSCAN vs COLLSCAN) based on query and schema
 */
export function generateExplainPlan(
  collection: string,
  filter: Record<string, any>,
  totalDocs: number,
  returnedDocs: number,
  isCovered = false
): MongoExplainPlan {
  const collectionIndexes = INDEXED_FIELDS[collection] || ['_id'];
  const filterKeys = Object.keys(filter);

  // Check if any filter keys match a known index
  const usedIndex = collectionIndexes.find((idx) => filterKeys.includes(idx));

  if (usedIndex) {
    const keysExamined = Math.max(returnedDocs, 1);
    const docsExamined = isCovered ? 0 : returnedDocs;
    return {
      stage: 'IXSCAN',
      indexName: `${usedIndex}_1`,
      nReturned: returnedDocs,
      docsExamined,
      keysExamined,
      isCovered,
      executionTimeMillis: Math.max(1, Math.round(keysExamined * 0.4)),
      winningPlan: {
        stage: isCovered ? 'PROJECTION_COVERED' : 'FETCH',
        inputStage: {
          stage: 'IXSCAN',
          indexName: `${usedIndex}_1`,
        },
      },
    };
  }

  return {
    stage: 'COLLSCAN',
    nReturned: returnedDocs,
    docsExamined: totalDocs,
    keysExamined: 0,
    isCovered: false,
    executionTimeMillis: Math.max(2, Math.round(totalDocs * 1.2)),
    winningPlan: {
      stage: 'COLLSCAN',
    },
  };
}

/**
 * Main evaluation entry point: parses and executes an MQL query string
 */
export function executeMqlQuery(
  queryString: string,
  customDb: Record<string, MongoDoc[]> = MOCK_COLLECTIONS
): MongoExecutionResult {
  const tStart = performance.now();
  const parsed = parseMongoQueryString(queryString);
  const collectionName = parsed.collection;
  const rawDocs = customDb[collectionName] || [];

  if (!customDb[collectionName]) {
    throw new Error(`Collection "db.${collectionName}" does not exist. Available collections: ${Object.keys(customDb).join(', ')}`);
  }

  if (parsed.op === 'aggregate') {
    const pipeline = parsed.args[0] || [];
    if (!Array.isArray(pipeline)) {
      throw new Error('Aggregation pipeline argument must be an array of stages, e.g. db.orders.aggregate([ { $match: ... } ])');
    }
    const resultDocs = executeAggregationPipeline(rawDocs, pipeline, customDb);
    const duration = Math.max(1, Math.round(performance.now() - tStart));

    const explain: MongoExplainPlan = {
      stage: 'COLLSCAN',
      nReturned: resultDocs.length,
      docsExamined: rawDocs.length,
      keysExamined: 0,
      isCovered: false,
      executionTimeMillis: duration,
      winningPlan: {
        stage: 'PIPELINE_STAGES',
      },
    };

    return {
      documents: resultDocs,
      count: resultDocs.length,
      explain,
      collection: collectionName,
      queryType: 'aggregate',
    };
  }

  // Handle db.<collection>.find(filter, projection)
  const filter = parsed.args[0] || {};
  const projection = parsed.args[1];

  let matched = rawDocs.filter((d) => matchesFilter(d, filter));

  // Process chained calls (.sort, .limit, .skip)
  for (const step of parsed.chain) {
    if (step.method === 'sort' && step.args[0]) {
      const sortSpec = step.args[0];
      const keys = Object.keys(sortSpec);
      matched.sort((a, b) => {
        for (const k of keys) {
          const dir = sortSpec[k] >= 0 ? 1 : -1;
          const valA = getNestedValue(a, k);
          const valB = getNestedValue(b, k);
          if (valA === valB) continue;
          if (valA === undefined) return 1 * dir;
          if (valB === undefined) return -1 * dir;
          return valA > valB ? dir : -dir;
        }
        return 0;
      });
    } else if (step.method === 'skip' && typeof step.args[0] === 'number') {
      matched = matched.slice(step.args[0]);
    } else if (step.method === 'limit' && typeof step.args[0] === 'number') {
      matched = matched.slice(0, step.args[0]);
    }
  }

  // Apply projections
  const finalDocs = projection ? matched.map((d) => applyProjection(d, projection)) : matched;

  const isCovered = Boolean(
    projection &&
    projection._id === 0 &&
    Object.keys(projection).every((k) => (INDEXED_FIELDS[collectionName] || []).includes(k))
  );

  const explain = generateExplainPlan(collectionName, filter, rawDocs.length, finalDocs.length, isCovered);

  return {
    documents: finalDocs,
    count: finalDocs.length,
    explain,
    collection: collectionName,
    queryType: 'find',
  };
}
