export interface Concept {
  id: string;
  title: string;
  category: string;
  shortDefinition: string;
  content: string;
  misconceptions: string[];
  tradeoffs: string[];
}

export const concepts: Concept[] = [
  // Phase 1: Cloud Fundamentals
  {
    id: 'cloud-computing',
    title: 'What is Cloud Computing',
    category: 'Cloud Fundamentals',
    shortDefinition: 'On-demand delivery of IT resources over the internet with pay-as-you-go pricing.',
    content: 'Cloud computing allows you to trade capital expense for variable expense, benefit from massive economies of scale, and stop guessing capacity. Instead of buying physical servers, you rent compute power, storage, and databases from providers like AWS.',
    misconceptions: [
      'The cloud is just someone else\'s computer (it\'s actually a massive automated orchestration layer)',
      'The cloud is always cheaper (it\'s about agility and opex, not always raw cost)'
    ],
    tradeoffs: [
      'Agility vs. Control',
      'Variable Cost vs. Predictable Capex'
    ]
  },
  {
    id: 'regions-azs',
    title: 'Regions & Availability Zones',
    category: 'Cloud Fundamentals',
    shortDefinition: 'Geographic locations (Regions) and isolated data centers (AZs) within those regions.',
    content: 'A Region is a physical location in the world where we have multiple Availability Zones. Availability Zones consist of one or more discrete data centers, each with redundant power, networking, and connectivity, housed in separate facilities.',
    misconceptions: [
      'A Region is just one data center',
      'Multi-AZ is the same as Multi-Region'
    ],
    tradeoffs: [
      'High Availability vs. Latency',
      'Cost vs. Durability'
    ]
  },

  // Phase 2: Networking & Traffic
  {
    id: 'vpc-concepts',
    title: 'Virtual Private Cloud (VPC)',
    category: 'Networking & Traffic',
    shortDefinition: 'A private, isolated section of the cloud where you can launch resources in a virtual network.',
    content: 'A VPC gives you full control over your virtual networking environment, including selection of your own IP address range, creation of subnets, and configuration of route tables and network gateways.',
    misconceptions: [
      'A VPC is a physical network',
      'All resources in a VPC are automatically public'
    ],
    tradeoffs: [
      'Security vs. Connectivity Ease',
      'Isolation vs. Shared Resources'
    ]
  },
  {
    id: 'subnets',
    title: 'Subnets',
    category: 'Networking & Traffic',
    shortDefinition: 'A range of IP addresses in your VPC.',
    content: 'Subnets allow you to group resources based on security and operational needs. Public subnets have a route to an Internet Gateway, while private subnets do not, making them ideal for databases and backend logic.',
    misconceptions: [
      'A subnet can span multiple Availability Zones (it is always tied to one AZ)',
      'Private subnets cannot reach the internet at all (they can via NAT Gateways)'
    ],
    tradeoffs: [
      'Security vs. Simplicity',
      'Network Segmentation vs. Routing Complexity'
    ]
  },
  {
    id: 'igw-vs-nat',
    title: 'Internet Gateway vs NAT',
    category: 'Networking & Traffic',
    shortDefinition: 'How resources connect to the internet.',
    content: 'An Internet Gateway (IGW) allows communication between your VPC and the internet. A NAT Gateway allows resources in a private subnet to connect to the internet while preventing the internet from initiating a connection with them.',
    misconceptions: [
      'IGW and NAT are the same thing',
      'NAT is used for public instances'
    ],
    tradeoffs: [
      'Bidirectional Access (IGW) vs. Outbound Only (NAT)',
      'Cost (NAT is usually more expensive)'
    ]
  },
  {
    id: 'load-balancers',
    title: 'Load Balancers',
    category: 'Networking & Traffic',
    shortDefinition: 'Distributes incoming application traffic across multiple targets.',
    content: 'Load balancing refers to efficiently distributing incoming network traffic across a group of backend servers. It ensure high availability and reliability by sending requests only to healthy instances.',
    misconceptions: [
      'Load balancers only handle traffic (they also perform health checks)',
      'LBs are a single point of failure'
    ],
    tradeoffs: [
      'Throughput vs. Latency',
      'Complexity vs. Reliability'
    ]
  },

  // Phase 3: Compute & Scaling
  {
    id: 'horizontal-scaling',
    title: 'Horizontal Scaling',
    category: 'Compute & Scaling',
    shortDefinition: 'Scaling by adding more instances to your pool of resources.',
    content: 'Horizontal scaling (scaling out) means adding more machines into your pool of resources. This is the primary way the cloud achieves "infinite" scale and high availability.',
    misconceptions: [
      'Scaling out is always better than scaling up',
      'Scaling happens instantly'
    ],
    tradeoffs: [
      'Elasticity vs. Consistency',
      'Complexity vs. Raw Power'
    ]
  },
  {
    id: 'vertical-scaling',
    title: 'Vertical Scaling',
    category: 'Compute & Scaling',
    shortDefinition: 'Scaling by increasing the power (CPU, RAM) of an existing instance.',
    content: 'Vertical scaling (scaling up) means upgrading the hardware specifications of a single machine. While simpler, it has a hard ceiling and usually requires downtime to change the instance type.',
    misconceptions: [
      'Vertical scaling is enough for modern apps',
      'You can scale up infinitely'
    ],
    tradeoffs: [
      'Simplicity vs. Hard Ceilings',
      'Cost vs. Availability (downtime during upgrade)'
    ]
  },
  {
    id: 'asg-concept',
    title: 'Auto Scaling Groups',
    category: 'Compute & Scaling',
    shortDefinition: 'Automatically adjusts instance counts based on demand metrics.',
    content: 'An ASG monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost.',
    misconceptions: [
      'ASG only scales up',
      'ASG is just for traffic spikes (it also handles self-healing)'
    ],
    tradeoffs: [
      'Cost vs. Responsiveness',
      'Over-provisioning vs. Under-provisioning'
    ]
  },
  {
    id: 'stateless-stateful',
    title: 'Stateless vs Stateful Services',
    category: 'Compute & Scaling',
    shortDefinition: 'Whether a service stores data between requests.',
    content: 'Stateless services treat each request as a new interaction. Stateful services remember previous interactions (sessions). Stateless services are significantly easier to scale horizontally.',
    misconceptions: [
      'Stateful is bad (it\'s just harder to scale)',
      'Stateless means no data is stored anywhere (it just means the *compute* layer doesn\'t store it)'
    ],
    tradeoffs: [
      'Scalability vs. Programming Simplicity',
      'Performance vs. Persistence'
    ]
  },
  {
    id: 'session-management',
    title: 'Session Management',
    category: 'Compute & Scaling',
    shortDefinition: 'How to track users across multiple requests in a distributed system.',
    content: 'In a scaled environment, users may hit different servers. Session management involves using external stores (like Redis) or "sticky sessions" to ensure the user\'s data is accessible regardless of which instance they hit.',
    misconceptions: [
      'Sticky sessions are the best way to handle sessions (they can lead to unbalanced load)',
      'Local server memory is fine for session storage'
    ],
    tradeoffs: [
      'User Experience vs. System Balance',
      'Centralized Store Latency vs. Local Speed'
    ]
  },

  // Phase 4: Storage & Databases
  {
    id: 'databases-rds',
    title: 'Databases (RDS Concept)',
    category: 'Storage & Databases',
    shortDefinition: 'Managed relational database services.',
    content: 'Relational databases use SQL and are optimized for complex queries and ACID compliance. Managed services like RDS handle patching, backups, and failover automatically.',
    misconceptions: [
      'Relational databases don\'t scale',
      'RDS is just a hosted VM'
    ],
    tradeoffs: [
      'Structure vs. Flexibility',
      'Vertical Scale vs. Horizontal Complexity'
    ]
  },
  {
    id: 'nosql-dynamodb',
    title: 'NoSQL (DynamoDB Concept)',
    category: 'Storage & Databases',
    shortDefinition: 'Non-relational databases built for massive scale.',
    content: 'NoSQL databases are optimized for specific data models and have flexible schemas. They provide consistent, low-latency performance at any scale, but often sacrifice complex query capabilities.',
    misconceptions: [
      'NoSQL is for "big data" only',
      'NoSQL means no structure'
    ],
    tradeoffs: [
      'Scalability vs. Query Flexibility',
      'Availability vs. Strict Consistency'
    ]
  },
  {
    id: 's3-concept',
    title: 'Object Storage (S3)',
    category: 'Storage & Databases',
    shortDefinition: 'Scalable storage for files and data objects.',
    content: 'Object storage treats files as discrete objects with metadata. It is highly durable and can store virtually unlimited amounts of data.',
    misconceptions: [
      'S3 is like a USB drive',
      'S3 is slow'
    ],
    tradeoffs: [
      'Cost vs. Access Frequency',
      'Durability vs. Immediate Consistency'
    ]
  },
  {
    id: 'read-replicas',
    title: 'Read Replicas',
    category: 'Storage & Databases',
    shortDefinition: 'Copies of your database to handle read traffic.',
    content: 'Read replicas allow you to scale the read-heavy part of your application by distributing traffic across multiple database copies.',
    misconceptions: [
      'Read replicas are for disaster recovery (they are for performance)',
      'Writes go to all replicas instantly'
    ],
    tradeoffs: [
      'Read Performance vs. Propagation Delay',
      'Cost vs. Scale'
    ]
  },
  {
    id: 'sharding',
    title: 'Sharding',
    category: 'Storage & Databases',
    shortDefinition: 'Splitting a large database into smaller, faster pieces.',
    content: 'Sharding is a method for distributing data across multiple machines. It allows for horizontal scaling of the data layer but adds significant complexity to the application logic.',
    misconceptions: [
      'Sharding is the first thing you should do',
      'Cloud providers shard everything automatically'
    ],
    tradeoffs: [
      'Scale vs. Operational Complexity',
      'Performance vs. Global Query Ease'
    ]
  },

  // Phase 5: Reliability & Availability
  {
    id: 'event-driven',
    title: 'Event-Driven Architecture',
    category: 'Reliability & Availability',
    shortDefinition: 'Systems that respond to events or state changes.',
    content: 'Event-driven systems use messages to trigger actions. This decouples services, allowing them to scale and fail independently.',
    misconceptions: [
      'Event-driven is always slower than REST',
      'Events are just for logging'
    ],
    tradeoffs: [
      'Decoupling vs. Observability Complexity',
      'Scalability vs. Immediate Feedback'
    ]
  },
  {
    id: 'queues-messaging',
    title: 'Queues & Messaging',
    category: 'Reliability & Availability',
    shortDefinition: 'Buffers for asynchronous communication between services.',
    content: 'Queues allow services to communicate without waiting for a response, protecting against traffic spikes and service outages.',
    misconceptions: [
      'Queues are just for emails',
      'Messages are never lost'
    ],
    tradeoffs: [
      'Throughput vs. Latency',
      'Reliability vs. Real-time Interaction'
    ]
  },
  {
    id: 'health-checks',
    title: 'Health Checks',
    category: 'Reliability & Availability',
    shortDefinition: 'Automated monitoring of resource status.',
    content: 'Load balancers and ASGs use health checks to determine if an instance is capable of handling traffic. If a check fails, the instance is removed from the rotation.',
    misconceptions: [
      'A ping is a sufficient health check',
      'Health checks fix the underlying bug'
    ],
    tradeoffs: [
      'Sensitivity vs. Flapping',
      'Safety vs. Speed of Recovery'
    ]
  },
  {
    id: 'high-availability',
    title: 'High Availability (HA)',
    category: 'Reliability & Availability',
    shortDefinition: 'Ensuring a system is accessible with minimal downtime.',
    content: 'HA is achieved through redundancy and automated failover. It ensures that if one component fails, another takes its place immediately.',
    misconceptions: [
      'HA is the same as Disaster Recovery',
      '100% availability is possible'
    ],
    tradeoffs: [
      'Reliability vs. Cost',
      'Complexity vs. Safety'
    ]
  },
  {
    id: 'fault-tolerance',
    title: 'Fault Tolerance',
    category: 'Reliability & Availability',
    shortDefinition: 'The ability of a system to continue operating despite failures.',
    content: 'Fault-tolerant systems are designed to handle failures without any impact on the user, often through active-active redundancy.',
    misconceptions: [
      'Fault tolerance is cheap',
      'It\'s the same as HA'
    ],
    tradeoffs: [
      'Zero Downtime vs. Extreme Cost',
      'Redundancy vs. Utilization'
    ]
  },
  {
    id: 'multi-az-arch',
    title: 'Multi-AZ Architecture',
    category: 'Reliability & Availability',
    shortDefinition: 'Deploying across multiple Availability Zones.',
    content: 'Multi-AZ provides protection against data center outages. It is the standard for high-availability cloud applications.',
    misconceptions: [
      'Multi-AZ is for global users',
      'It happens automatically for all services'
    ],
    tradeoffs: [
      'Availability vs. Inter-AZ Data Costs',
      'Safety vs. Minor Latency'
    ]
  },
  {
    id: 'multi-region-arch',
    title: 'Multi-Region Architecture',
    category: 'Reliability & Availability',
    shortDefinition: 'Deploying across multiple geographic regions.',
    content: 'Multi-Region provides protection against massive regional outages and improves performance for global users by putting data closer to them.',
    misconceptions: [
      'It\'s easy to keep data synced across regions',
      'Multi-Region is cheap'
    ],
    tradeoffs: [
      'Global Reach vs. Extreme Complexity',
      'Compliance vs. Centralization'
    ]
  },

  // Phase 6: Failure & Recovery
  {
    id: 'disaster-recovery',
    title: 'Disaster Recovery (DR)',
    category: 'Failure & Recovery',
    shortDefinition: 'Procedures to restore a system after a catastrophic failure.',
    content: 'DR focuses on RTO (Recovery Time Objective) and RPO (Recovery Point Objective) to get systems back online after a major outage (like a whole region failing).',
    misconceptions: [
      'Backups are a DR plan',
      'DR is only for natural disasters'
    ],
    tradeoffs: [
      'Recovery Speed vs. Preparation Cost',
      'Data Loss vs. Expense'
    ]
  },

  // Phase 7: Performance & Cost
  {
    id: 'caching-layers',
    title: 'Caching Layers',
    category: 'Performance & Cost',
    shortDefinition: 'Storing frequently accessed data in fast, temporary storage.',
    content: 'Caching improves performance by reducing the need to hit slower databases or external APIs. It can happen at the browser, CDN, Load Balancer, or Application levels.',
    misconceptions: [
      'Cache everything',
      'Cache invalidation is easy'
    ],
    tradeoffs: [
      'Speed vs. Data Freshness',
      'Cost (RAM) vs. Performance'
    ]
  },
  {
    id: 'async-processing',
    title: 'Asynchronous Processing',
    category: 'Performance & Cost',
    shortDefinition: 'Performing tasks in the background without blocking the user.',
    content: 'Async processing allows an application to handle heavy tasks (like image processing) without making the user wait for the result.',
    misconceptions: [
      'Async is always faster',
      'Everything should be async'
    ],
    tradeoffs: [
      'Responsiveness vs. Immediate Consistency',
      'Simplicity vs. Workflow Management'
    ]
  },
  {
    id: 'latency-consistency',
    title: 'Latency vs Consistency',
    category: 'Performance & Cost',
    shortDefinition: 'The CAP theorem trade-off in distributed systems.',
    content: 'In a distributed system, you often have to choose between getting the most recent data (consistency) or getting a response quickly (low latency).',
    misconceptions: [
      'You can have both perfectly at scale',
      'Consistency is always more important'
    ],
    tradeoffs: [
      'Data Accuracy vs. User Speed',
      'System Complexity vs. Performance'
    ]
  },
  {
    id: 'cost-performance',
    title: 'Cost vs Performance',
    category: 'Performance & Cost',
    shortDefinition: 'Balancing resource power with budget.',
    content: 'The cloud allows you to tune performance to your exact needs. However, the highest performing resources (more CPU, SSD, dedicated networking) always cost significantly more.',
    misconceptions: [
      'Cloud is infinite, so I don\'t need to optimize',
      'Auto-scaling solves all cost problems'
    ],
    tradeoffs: [
      'Speed vs. Budget',
      'Over-provisioning for Safety vs. Cost Efficiency'
    ]
  },
  {
    id: 'monolith-microservices',
    title: 'Monolith vs Microservices',
    category: 'Performance & Cost',
    shortDefinition: 'One large application vs. many small, specialized services.',
    content: 'Monoliths are easier to develop initially, while Microservices allow teams to scale and deploy parts of the system independently. In the cloud, microservices map well to serverless and containers.',
    misconceptions: [
      'Microservices are always better',
      'Microservices are easier to manage'
    ],
    tradeoffs: [
      'Development Speed vs. Deployment Flexibility',
      'Simplicity vs. Operational Complexity'
    ]
  }
];
