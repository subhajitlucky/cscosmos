export interface Topic {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: 'active' | 'coming-soon';
  description: string;
  analogy: string;
}

export interface Path {
  id: string;
  name: string;
  topics: Topic[];
}

export const learningPath: Path[] = [
  {
    id: 'fundamentals',
    name: 'MongoDB Fundamentals',
    topics: [
      { id: 'bson', name: 'BSON Format', slug: 'bson', domain: 'fundamentals', status: 'active', description: 'Binary JSON: The high-performance storage format of MongoDB.', analogy: 'A suitcase packed precisely to fit more items than a loose bag.' },
      { id: 'docs-cols', name: 'Documents vs Collections', slug: 'docs-cols', domain: 'fundamentals', status: 'active', description: 'Understanding the hierarchical container model.', analogy: 'A folder (Collection) containing many individual loose-leaf sheets (Documents).' }
    ]
  },
  {
    id: 'modeling',
    name: 'Data Modeling',
    topics: [
      { id: 'embed-ref', name: 'Embedding vs Referencing', slug: 'embed-ref', domain: 'modeling', status: 'active', description: 'The two core strategies for relating data.', analogy: 'Keeping a recipe in your cookbook (Embedding) vs keeping a library card that points to the book (Referencing).' },
      { id: 'schema-design', name: 'Schema Design Principles', slug: 'schema-design', domain: 'modeling', status: 'coming-soon', description: 'Application-driven modeling for maximum performance.', analogy: 'Building a house based on how you live, not just standard blueprints.' }
    ]
  },
  {
    id: 'indexes',
    name: 'Indexes & Performance',
    topics: [
      { id: 'btree', name: 'Index Internals (B-Tree)', slug: 'btree', domain: 'indexes', status: 'active', description: 'The data structure that enables lightning-fast searches.', analogy: 'The alphabetical index at the back of a massive textbook.' },
      { id: 'comp-index', name: 'Compound Indexes', slug: 'comp-index', domain: 'indexes', status: 'coming-soon', description: 'Optimizing for queries with multiple filters.', analogy: 'A phone book sorted by Last Name, then First Name.' }
    ]
  },
  {
    id: 'aggregation',
    name: 'Aggregation Framework',
    topics: [
      { id: 'agg-pipeline', name: 'Pipeline Architecture', slug: 'agg-pipeline', domain: 'aggregation', status: 'active', description: 'Transforming data through a sequence of stages.', analogy: 'An assembly line in a factory where each station modifies the product.' },
      { id: 'agg-stages', name: '$match, $group, $project', slug: 'agg-stages', domain: 'aggregation', status: 'coming-soon', description: 'The workhorses of the aggregation framework.', analogy: 'Filtering bad parts, grouping similar parts, and painting the final product.' }
    ]
  },
  {
    id: 'scaling',
    name: 'Sharding & Scaling',
    topics: [
      { id: 'sharding-basics', name: 'Sharding Basics', slug: 'sharding-basics', domain: 'scaling', status: 'active', description: 'Horizontally partitioning data across multiple servers.', analogy: 'Splitting a massive library into several smaller buildings to serve more people.' },
      { id: 'shard-keys', name: 'Shard Keys & Distribution', slug: 'shard-keys', domain: 'scaling', status: 'coming-soon', description: 'How MongoDB decides where to put your data.', analogy: 'Sorting mail into bins based on Zip Code to balance the load among mailmen.' }
    ]
  }
];
