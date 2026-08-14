export interface RedisCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    command: string;
    complexity: string;
    description: string;
    example: string;
  }[];
}

export const REDIS_CHEATSHEET: RedisCheatSheetSection[] = [
  {
    id: 'strings',
    title: 'Strings (Key-Value & Counters)',
    category: 'Data Structures',
    snippets: [
      {
        command: 'SET / GET',
        complexity: 'O(1)',
        description: 'Set and get key with optional expiration (EX seconds / PX milliseconds)',
        example: `SET session:token_abc "user_42" EX 3600\nGET session:token_abc`
      },
      {
        command: 'INCR / INCRBY',
        complexity: 'O(1)',
        description: 'Atomic integer increment (rate limiters, view counters)',
        example: `INCR rate:ip:192.168.1.1\nINCRBY user:42:points 50`
      },
      {
        command: 'MSET / MGET',
        complexity: 'O(N)',
        description: 'Multi-key get and set in a single network roundtrip',
        example: `MSET user:1 "Alice" user:2 "Bob"\nMGET user:1 user:2`
      }
    ]
  },
  {
    id: 'hashes',
    title: 'Hashes (Objects & Records)',
    category: 'Data Structures',
    snippets: [
      {
        command: 'HSET / HGET',
        complexity: 'O(1)',
        description: 'Set and get field value within a hash map',
        example: `HSET user:100 name "Alice" email "alice@test.com"\nHGET user:100 email`
      },
      {
        command: 'HGETALL',
        complexity: 'O(N)',
        description: 'Retrieve all fields and values in hash (use with caution for large hashes)',
        example: `HGETALL user:100`
      },
      {
        command: 'HINCRBY',
        complexity: 'O(1)',
        description: 'Increment specific numeric field within a hash',
        example: `HINCRBY user:100 login_count 1`
      }
    ]
  },
  {
    id: 'sorted-sets',
    title: 'Sorted Sets (ZSET - Leaderboards & Rankings)',
    category: 'Data Structures',
    snippets: [
      {
        command: 'ZADD',
        complexity: 'O(log N)',
        description: 'Add members with a floating point score',
        example: `ZADD leaderboard 1500 "Player_1" 2300 "Player_2"`
      },
      {
        command: 'ZREVRANGE',
        complexity: 'O(log N + M)',
        description: 'Get top ranked members from highest score to lowest',
        example: `ZREVRANGE leaderboard 0 9 WITHSCORES`
      },
      {
        command: 'ZREVRANK',
        complexity: 'O(log N)',
        description: 'Get 0-based rank of specific member',
        example: `ZREVRANK leaderboard "Player_1"`
      }
    ]
  },
  {
    id: 'administration',
    title: 'Server Admin & Memory Management',
    category: 'Operations',
    snippets: [
      {
        command: 'INFO',
        complexity: 'O(1)',
        description: 'Get server statistics, memory usage, connected clients, replication status',
        example: `INFO memory\nINFO clients`
      },
      {
        command: 'SCAN',
        complexity: 'O(1) per call',
        description: 'Safely iterate through keyspace without blocking event loop',
        example: `SCAN 0 MATCH user:* COUNT 100`
      },
      {
        command: 'MEMORY USAGE',
        complexity: 'O(N)',
        description: 'Reports the exact number of bytes allocated for a key',
        example: `MEMORY USAGE user:100`
      }
    ]
  }
];
