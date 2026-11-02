export interface MongoCheatSheetRecipe {
  title: string;
  description: string;
  code: string;
  pitfall?: string;
}

export interface MongoCheatSheetSection {
  id: string;
  title: string;
  subtitle: string;
  recipes: MongoCheatSheetRecipe[];
}

export const MONGO_CHEATSHEET: MongoCheatSheetSection[] = [
  {
    id: 'query-operators',
    title: '1. MQL Query & Filtering Operators',
    subtitle: 'High-frequency MQL filter expressions, nested dot notation, and array query operators.',
    recipes: [
      {
        title: 'Comparison & Logical Operators',
        description: 'Combine range checks with logical $and, $or, and $in sets.',
        code: `db.orders.find({
  $or: [
    { status: "completed", total: { $gte: 100, $lte: 500 } },
    { payment: { $in: ["wire", "crypto"] }, priority: "high" }
  ]
});`
      },
      {
        title: 'Nested Field & Subdocument Search',
        description: 'Query nested subdocument attributes using dot notation inside quotes.',
        code: `db.users.find({
  "contact.address.city": "Seattle",
  "preferences.notifications.email": true
});`
      },
      {
        title: 'Array Element Matching ($elemMatch)',
        description: 'Match documents where at least one array element satisfies ALL conditions simultaneously.',
        code: `db.orders.find({
  items: {
    $elemMatch: { price: { $gt: 50 }, quantity: { $gte: 2 } }
  }
});`,
        pitfall: 'Querying { "items.price": { $gt: 50 }, "items.quantity": { $gte: 2 } } matches if one item has high price and another item has high quantity!'
      }
    ]
  },
  {
    id: 'aggregation-pipeline',
    title: '2. Aggregation Pipeline & Transformations',
    subtitle: 'Multi-stage pipeline recipes for grouping, reshaping, unwinding, and joining collections.',
    recipes: [
      {
        title: 'Filter, Group, and Sort Pattern',
        description: 'The canonical analytical pipeline: filter early with $match, summarize with $group, sort with $sort.',
        code: `db.orders.aggregate([
  { $match: { status: "completed", created_at: { $gte: ISODate("2026-01-01") } } },
  { $group: { _id: "$category", totalRevenue: { $sum: "$total" }, orderCount: { $sum: 1 } } },
  { $sort: { totalRevenue: -1 } }
]);`
      },
      {
        title: 'Non-Destructive Field Injection ($set)',
        description: 'Append calculated fields without discarding other document attributes.',
        code: `db.products.aggregate([
  {
    $set: {
      totalInventoryValue: { $multiply: ["$price", "$stock"] },
      isLowStock: { $cond: [ { $lt: ["$stock", 10] }, true, false ] }
    }
  }
]);`
      },
      {
        title: 'Safe Array Flattening with $unwind',
        description: 'Deconstruct array elements while preserving documents with empty lists.',
        code: `db.orders.aggregate([
  {
    $unwind: {
      path: "$items",
      preserveNullAndEmptyArrays: true
    }
  },
  { $group: { _id: "$items.name", unitsSold: { $sum: "$items.quantity" } } }
]);`
      }
    ]
  },
  {
    id: 'index-optimization',
    title: '3. Index Optimization & The ESR Rule',
    subtitle: 'Compound index patterns, partial indexes, and preventing in-memory sort spills.',
    recipes: [
      {
        title: 'The ESR (Equality, Sort, Range) Pattern',
        description: 'Order compound indexes: Equality fields first, Sort fields second, Range fields last.',
        code: `// For query: .find({ tenant_id: 1, total: { $gt: 100 } }).sort({ date: -1 })
// Optimal Index:
db.orders.createIndex({ tenant_id: 1, date: -1, total: 1 });`,
        pitfall: 'Placing range total before sort date forces MongoDB to perform a blocking 100MB in-memory sort.'
      },
      {
        title: 'Partial Index for Skewed Datasets',
        description: 'Index only documents matching a specific status filter to save 90% of index RAM.',
        code: `db.orders.createIndex(
  { created_at: 1 },
  { partialFilterExpression: { status: "unprocessed" } }
);`
      },
      {
        title: 'Covered Query Pattern (Zero Document Fetches)',
        description: 'Satisfy filter and projection entirely from index B-Trees, suppressing _id: 0.',
        code: `// Index: { username: 1, email: 1 }
db.users.find(
  { username: "alice" },
  { _id: 0, username: 1, email: 1 }
);`
      }
    ]
  },
  {
    id: 'wiredtiger-tuning',
    title: '4. WiredTiger Storage & Memory Tuning',
    subtitle: 'Cache sizing, dirty page monitoring, and checkpoint latency controls.',
    recipes: [
      {
        title: 'Check Cache & Dirty Page Pressure',
        description: 'Verify if dirty pages are approaching the dangerous 20% threshold where client threads stall.',
        code: `const c = db.serverStatus().wiredTiger.cache;
const totalMb = c["bytes currently in the cache"] / 1024 / 1024;
const dirtyMb = c["tracked dirty bytes in the cache"] / 1024 / 1024;
print(\`Cache: \${totalMb.toFixed(0)}MB | Dirty: \${dirtyMb.toFixed(0)}MB (\${(dirtyMb/totalMb*100).toFixed(1)}%)\`);`
      },
      {
        title: 'WiredTiger Engine Configuration in mongod.conf',
        description: 'Set dedicated memory size in gigabytes leaving headroom for OS cache.',
        code: `storage:
  engine: wiredTiger
  wiredTiger:
    engineConfig:
      cacheSizeGB: 16
    collectionConfig:
      blockCompressor: zstd`
      }
    ]
  },
  {
    id: 'write-read-concerns',
    title: '5. Write & Read Concern Reference Matrix',
    subtitle: 'Balancing latency against durability, consistency, and election rollback safety.',
    recipes: [
      {
        title: 'Zero-Data-Loss Write Concern',
        description: 'Guarantees the write is replicated to a majority of voting nodes and flushed to disk journal.',
        code: `db.transactions.insertOne(
  { from: "A", to: "B", amount: 500 },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
);`,
        pitfall: 'Omitting wtimeout can cause client application connections to hang indefinitely during network splits.'
      },
      {
        title: 'Read Concern "majority" to Avoid Rollbacks',
        description: 'Read from in-memory WiredTiger snapshots committed by a majority of replica members.',
        code: `db.transactions.find({ status: "cleared" }).readConcern("majority");`
      }
    ]
  },
  {
    id: 'replica-sets',
    title: '6. Replica Set Administration & Failover',
    subtitle: 'Step-downs, reconfigurations, member priorities, and monitoring replication lag.',
    recipes: [
      {
        title: 'Graceful Primary Step-Down for Rolling Maintenance',
        description: 'Step down the active primary for 60 seconds to safely promote a secondary with zero downtime.',
        code: `rs.stepDown(60);`
      },
      {
        title: 'Check Secondary Replication Lag',
        description: 'Identify nodes lagging behind the primary in seconds.',
        code: `rs.printSecondaryReplicationInfo();`
      },
      {
        title: 'Configure Member Priority and Voting',
        description: 'Set priority: 0 to create a non-electable dedicated reporting node.',
        code: `const cfg = rs.conf();
cfg.members[2].priority = 0; // Cannot become primary
cfg.members[2].tags = { "role": "analytics" };
rs.reconfig(cfg);`
      }
    ]
  },
  {
    id: 'sharding-ops',
    title: '7. Sharding Operations & Chunk Management',
    subtitle: 'Enabling sharding, selecting hashed/range keys, and monitoring the balancer.',
    recipes: [
      {
        title: 'Hashed Sharding for Uniform Write Distribution',
        description: 'Distribute monotonically increasing IDs evenly across all cluster shards.',
        code: `sh.enableSharding("iot_db");
sh.shardCollection("iot_db.readings", { "sensor_id": "hashed" });`
      },
      {
        title: 'Check Chunk Balancer Status & Schedule Window',
        description: 'Restrict automatic chunk migrations to off-peak hours.',
        code: `sh.setBalancerState(true);
db.getSiblingDB("config").settings.updateOne(
  { _id: "balancer" },
  { $set: { activeWindow: { start: "02:00", stop: "05:00" } } },
  { upsert: true }
);`
      }
    ]
  },
  {
    id: 'profiler-and-explain',
    title: '8. Database Profiler, Slow Queries & explain()',
    subtitle: 'Capture slow queries exceeding thresholds and dissect query execution plans.',
    recipes: [
      {
        title: 'Enable Database Profiler for Queries > 50ms',
        description: 'Log slow operations into system.profile collection for diagnostic tuning.',
        code: `db.setProfilingLevel(1, { slowms: 50 });
// View recent slow queries:
db.system.profile.find({ millis: { $gt: 50 } }).sort({ ts: -1 }).limit(5);`
      },
      {
        title: 'Run explain("executionStats") for Plan Analysis',
        description: 'Inspect totalKeysExamined, totalDocsExamined, and detect COLLSCAN / in-memory SORT.',
        code: `const exp = db.orders.find({ status: "pending" })
  .sort({ created_at: -1 })
  .explain("executionStats");

print("Winning Stage: " + exp.executionStats.executionStages.stage);
print("Keys Examined: " + exp.executionStats.totalKeysExamined);
print("Docs Examined: " + exp.executionStats.totalDocsExamined);`
      }
    ]
  }
];
