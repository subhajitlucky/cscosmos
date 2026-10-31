topics = [
  # 21. RBAC: Role-Based Access Control
  {
    "id": "rbac-role-based-access",
    "title": "Role-Based Access Control (RBAC): Hierarchies, Permissions & Preventing Role Explosion",
    "category": "authz-rbac",
    "difficulty": "Beginner",
    "summary": "Role-Based Access Control (RBAC) groups granular permissions into administrative roles (e.g. Viewer, Editor, Admin, Owner) and assigns roles to users. Production systems enforce role hierarchies, map operations to discrete permission strings ('doc:read', 'doc:edit') rather than role names, and defend against 'role explosion'.",
    "whyExists": "Assigning permissions directly to individual users across thousands of corporate employees is an operational nightmare. When an employee switches departments or changes jobs, updating hundreds of individual access flags manually inevitably causes privilege accumulation and security breaches.",
    "mentalModel": "The Hospital Keycard Badges: Nurses get Blue Badges (access to patient rooms and basic medical charts). Surgeons get Red Badges (patient rooms + operating rooms + pharmacy). Hospital Directors get Gold Badges (all facilities + financial records). Nobody programs individual door access for each nurse.",
    "architectureDiagram": """[ User ] ──(Assigned)──► [ Role: 'Editor' ] ──(Inherits)──► [ Role: 'Viewer' ]
                              │                                  │
                              ├─► Permission: 'document:create'  ├─► Permission: 'document:read'
                              └─► Permission: 'document:update'  └─► Permission: 'comment:create'
                                                                 │
                                  ┌──────────────────────────────┘
                                  ▼
[ Enforcement Point ] ── checks: hasPermission('document:read') ──► ALLOWED!""",
    "cosmosAppStory": "CosmosApp organizes corporate team spaces using RBAC. Rather than hardcoding 'if (user.role === \"admin\")' in backend code, CosmosApp maps roles to fine-grained permissions (documents:write, billing:manage). When CosmosApp introduces a new 'BillingManager' role, developers don't have to touch document editing code.",
    "stepByStep": [
      "Step 1: Application defines discrete permission strings for every operation (e.g. 'project:create', 'project:delete').",
      "Step 2: Administrative roles are established, each grouping a collection of specific permissions.",
      "Step 3: Role hierarchies are configured where higher roles inherit all permissions of lower roles (Owner > Admin > Member > Viewer).",
      "Step 4: Users are assigned one or more roles within a tenant or organization context.",
      "Step 5: Incoming requests hit API route guards that evaluate hasPermission(requiredPermission).",
      "Step 6: Policy engine resolves user's assigned roles, expands inherited permissions, and grants or denies access (403 Forbidden)."
    ],
    "misconceptions": [
      "Checking role names directly in controllers is fine (Checking 'if role == admin' creates rigid code; always check specific permissions like 'canDeleteDocument').",
      "Creating a new role for every edge case is scalable (Creating 'BillingEditorWithReadOnlyReports' leads to role explosion; use ABAC for contextual modifiers)."
    ],
    "codeSnippet": """// CosmosApp Permission-Based RBAC Architecture:
const ROLE_PERMISSIONS: Record<string, string[]> = {
  viewer: ['doc:read', 'comment:create'],
  editor: ['doc:read', 'comment:create', 'doc:create', 'doc:update'],
  admin:  ['doc:read', 'comment:create', 'doc:create', 'doc:update', 'doc:delete', 'user:invite'],
};

export function hasPermission(userRoles: string[], requiredPermission: string): boolean {
  // Aggregate all permissions across assigned roles:
  const permissions = new Set<string>();
  for (const role of userRoles) {
    (ROLE_PERMISSIONS[role] || []).forEach((p) => permissions.add(p));
  }

  return permissions.has(requiredPermission);
}""",
    "takeaways": [
      "Check granular permissions in application code, never hardcoded role names.",
      "Implement role hierarchies to keep role definitions clean and maintainable.",
      "Guard against role explosion by combining RBAC with ABAC for contextual parameters."
    ],
    "commonPitfall": {
      "mistake": "Writing 'if (user.role === \"admin\")' throughout the codebase. Introducing a new 'Manager' role requires modifying dozens of files.",
      "fix": "Check permissions (e.g. 'can_delete_project') and define which roles possess that permission in a central mapping."
    },
    "knowledgeCheck": {
      "question": "What architectural problem is referred to as 'Role Explosion' in RBAC systems?",
      "answer": "The unmanageable proliferation of hundreds of hyper-specific custom roles created to handle minor variations in user permissions."
    },
    "nextTopicId": "abac-attribute-based-access"
  },
  # 22. ABAC: Attribute-Based Access Control
  {
    "id": "abac-attribute-based-access",
    "title": "Attribute-Based Access Control (ABAC): Policy Decision Points (PDP) & Contextual Rules",
    "category": "authz-rbac",
    "difficulty": "Advanced",
    "summary": "Attribute-Based Access Control (ABAC, NIST SP 800-162) evaluates dynamic attributes across four dimensions: Subject (user clearance, department), Resource (classification, owner, tenant), Action (read, sign, export), and Environment (time of day, client IP, device health). Decisions are calculated dynamically at Policy Decision Points (PDP).",
    "whyExists": "RBAC cannot express contextual rules such as: 'Employees can only edit financial spreadsheets from corporate VPNs during standard business hours (09:00–17:00), provided the document is not marked Classified'. Expressing this in RBAC would require creating thousands of combinatorial roles.",
    "mentalModel": "The Smart Security Gatekeeper: The gatekeeper doesn't just look at your badge title. They inspect whether your badge is active today, check the clock on the wall, verify that you are wearing a hard hat, and check whether the room you want to enter currently contains hazardous chemicals.",
    "architectureDiagram": """[ Subject Attributes ]      [ Resource Attributes ]
  • department: 'Finance'      • classification: 'Confidential'
  • clearance: Level 3         • owner_id: 'usr_99'
           │                           │
           └──────────────┬────────────┘
                          ▼
             [ Policy Decision Point (PDP) ] ◄── [ Environment Attributes ]
               Evaluates Policy:                  • time: 14:30 (Business Hours)
               IF subject.dept == resource.dept   • client_ip: corporate VPN range
               AND environment.is_business_hours
                          │
                          ├── Decision: PERMIT (200 OK)
                          └── Decision: DENY (403 Forbidden)""",
    "cosmosAppStory": "CosmosApp enterprise clients configure compliance policies: 'Only users in the legal department can download contracts, and only if accessed from a corporate-managed laptop within the EU geolocation zone.' CosmosApp evaluates these dynamic rules in its central PDP before issuing download URLs.",
    "stepByStep": [
      "Step 1: Client initiates an action on a target resource via API request.",
      "Step 2: Policy Enforcement Point (PEP) intercepts the request and gathers contextual attributes.",
      "Step 3: PEP collects Subject attributes (claims), Resource metadata (database), and Environment context (IP, headers, time).",
      "Step 4: PEP passes the authorization request context to the Policy Decision Point (PDP).",
      "Step 5: PDP evaluates active declarative policies (e.g. written in Rego/OPA or JSON policies).",
      "Step 6: PDP returns an explicit Permit or Deny; PEP enforces the decision."
    ],
    "misconceptions": [
      "ABAC completely replaces RBAC (In practice, modern systems use hybrid approaches where a user's role is simply one attribute evaluated by the ABAC engine).",
      "ABAC is too slow for production APIs (With indexed in-memory policy engines like Open Policy Agent, decisions evaluate in under 1 millisecond)."
    ],
    "codeSnippet": """// CosmosApp ABAC Policy Decision Point (PDP):
interface AbacContext {
  subject: { id: string; department: string; clearanceLevel: number };
  resource: { id: string; department: string; minClearance: number; isLocked: boolean };
  environment: { currentHourUtc: number; isCorporateVpn: boolean };
}

export function evaluateAbacPolicy(ctx: AbacContext): boolean {
  // 1. Department match requirement
  if (ctx.subject.department !== ctx.resource.department) return false;

  // 2. Clearance level evaluation
  if (ctx.subject.clearanceLevel < ctx.resource.minClearance) return false;

  // 3. Resource state check
  if (ctx.resource.isLocked) return false;

  // 4. Environmental constraint: Corporate VPN required
  if (!ctx.environment.isCorporateVpn) return false;

  return true;
}""",
    "takeaways": [
      "ABAC provides fine-grained, dynamic access control based on Subject, Resource, Action, and Environment.",
      "Decouple policy evaluation (Policy Decision Point) from policy execution (Policy Enforcement Point).",
      "Use tools like Open Policy Agent (OPA / Rego) for standardized declarative enterprise policy evaluation."
    ],
    "commonPitfall": {
      "mistake": "Scattering complex attribute conditional logic across dozens of controller functions and database queries.",
      "fix": "Consolidate authorization policies into a dedicated Policy Decision Point (PDP) or policy evaluation service."
    },
    "knowledgeCheck": {
      "question": "What are the four core categories of attributes evaluated by an Attribute-Based Access Control (ABAC) policy engine?",
      "answer": "Subject attributes, Resource attributes, Action attributes, and Environment attributes."
    },
    "nextTopicId": "rebac-relationship-based-access"
  },
  # 23. ReBAC: Relationship-Based Access Control
  {
    "id": "rebac-relationship-based-access",
    "title": "Relationship-Based Access Control (ReBAC): The Zanzibar Model & Graph Authorization",
    "category": "authz-rbac",
    "difficulty": "Expert",
    "summary": "Relationship-Based Access Control (ReBAC, pioneered by Google Zanzibar) models authorization as a directed graph of relationships between subjects, groups, and objects (tuples formatted as 'object#relation@subject'). Permissions are evaluated by traversing graph edges, supporting recursive group memberships and inherited object hierarchies.",
    "whyExists": "In modern collaborative software (Google Docs, Figma, CosmosApp), access is not just based on roles or attributes, but on relationships: 'User A is a member of Team B, which has editor access on Folder C, which contains Document D'. Computing nested folder permissions and shared document links cannot be modeled cleanly with static RBAC or ABAC.",
    "mentalModel": "The Social Circle & Family Tree: You don't have a badge saying 'Allowed into Bob's Wedding'. You are allowed in because you are the 'sibling of Alice', and Alice is a 'friend of Bob'. The venue checks the chain of family and friend relationships.",
    "architectureDiagram": """[ Relation Tuple Store (Zanzibar Graph) ]
  • (folder:marketing, parent, org:cosmos)
  • (doc:q4_strategy, parent, folder:marketing)
  • (folder:marketing, editor, team:growth)
  • (team:growth, member, user:alice)

[ Question: Can user:alice EDIT doc:q4_strategy? ]
       │
       ▼ (Graph Traversal Engine)
  doc:q4_strategy ──(parent)──► folder:marketing ──(editor)──► team:growth ──(member)──► user:alice
       │
       ▼ Graph path exists!
[ Decision: PERMIT ]""",
    "cosmosAppStory": "CosmosApp allows users to nest documents within multi-level folder hierarchies and share items with cross-functional project teams. CosmosApp implements ReBAC with relation tuples. When Alice attempts to read a document in the 'Engineering' folder, CosmosApp's graph engine resolves Alice's membership in the 'DevOps' team and confirms inherited read permissions.",
    "stepByStep": [
      "Step 1: Security relations are stored as canonical relation tuples (Object, Relation, Subject).",
      "Step 2: Client requests an action on an object (e.g. check(doc:10, 'write', user:alice)).",
      "Step 3: Graph engine checks for direct tuple existence: (doc:10, 'writer', user:alice).",
      "Step 4: If not found directly, engine expands relations: checks if user:alice is a member of any group that has 'writer' access.",
      "Step 5: Engine recursively traverses parent hierarchies (checking if doc:10 inherits from folder:5).",
      "Step 6: If a valid path connects user to permission, returns Allow; otherwise Deny."
    ],
    "misconceptions": [
      "ReBAC replaces all database joins (ReBAC is an authorization graph; domain business data remains in relational tables).",
      "Graph traversal is too slow for real-time APIs (Modern Zanzibar engines like SpiceDB use indexed adjacency lists and concurrent edge evaluation to resolve checks in < 5ms)."
    ],
    "codeSnippet": """// CosmosApp ReBAC Relation Tuple Representation:
interface RelationTuple {
  object: string;   // e.g. "document:q4_plan"
  relation: string; // e.g. "viewer"
  subject: string;  // e.g. "user:alice" or "team:finance#member"
}

export class SimpleZanzibarEngine {
  private tuples: RelationTuple[] = [];

  addTuple(tuple: RelationTuple) { this.tuples.push(tuple); }

  async check(object: string, relation: string, user: string): Promise<boolean> {
    // 1. Direct check
    const direct = this.tuples.some(
      (t) => t.object === object && t.relation === relation && t.subject === user
    );
    if (direct) return true;

    // 2. Expand group memberships
    const groups = this.tuples.filter((t) => t.object === object && t.relation === relation);
    for (const g of groups) {
      if (g.subject.includes('#')) {
        const [groupObj, groupRel] = g.subject.split('#');
        if (await this.check(groupObj, groupRel, user)) return true;
      }
    }

    return false;
  }
}""",
    "takeaways": [
      "ReBAC models authorization as a graph of relationships between users, groups, and resources.",
      "Ideal for collaborative tools with nested resource hierarchies (workspaces, folders, documents).",
      "Modern implementations (SpiceDB, Ory Keto) provide sub-5ms graph traversals with caching."
    ],
    "commonPitfall": {
      "mistake": "Writing endless recursive SQL CTE queries in application controllers to resolve folder hierarchies.",
      "fix": "Adopt a dedicated relationship graph model or ReBAC engine (Zanzibar model) to isolate authorization graph traversals."
    },
    "knowledgeCheck": {
      "question": "What is a 'relation tuple' in the Google Zanzibar / ReBAC authorization model?",
      "answer": "A standardized fact asserting that a specific subject has a specific relationship to a specific object (formatted as: object#relation@subject)."
    },
    "nextTopicId": "idor-bola-object-authorization"
  },
  # 24. IDOR / BOLA Prevention
  {
    "id": "idor-bola-object-authorization",
    "title": "Object-Level Authorization: Preventing IDOR (BOLA) & Multi-Tenant Data Breaches",
    "category": "authz-rbac",
    "difficulty": "Intermediate",
    "summary": "Insecure Direct Object References (IDOR), classified as Broken Object-Level Authorization (BOLA) in the OWASP API Security Top 10 (#1), occur when an application relies on client-supplied resource IDs without verifying that the authenticated user possesses authorization to access that specific object.",
    "whyExists": "Modern REST and GraphQL APIs expose object identifiers directly in URLs (e.g. GET /api/documents/1042). Attackers simply increment or tamper with the ID (to 1043) to read or manipulate records belonging to other tenants. Without mandatory object-level validation, authenticated users can access the entire database.",
    "mentalModel": "The Hotel Room Key that Turns Every Lock: You check in to Room 201 and receive a keycard. If the hotel lock system only checks that you are a registered hotel guest (Authentication) without checking if your keycard matches Room 201 specifically (Object Authorization), you can open Room 202, 203, and 204.",
    "architectureDiagram": """[ Malicious User (Tenant Acme, id: usr_1) ]
       │
       ▼ (1) Submits: GET /api/invoices/9924 (belongs to Tenant Beta!)
[ API Gateway ] ── Authenticated as usr_1 (AuthN OK)
       │
       ├── VULNERABLE CODE:
       │   SELECT * FROM invoices WHERE id = 9924;  <-- BREACH! Data leaked!
       │
       └── HARDENED COSMOSAPP CODE:
           SELECT * FROM invoices 
           WHERE id = 9924 AND organization_id = session.orgId;
           │
           ▼ Query returns 0 rows!
       [ Return HTTP 404 Not Found (Prevent Tenant Enumeration) ]""",
    "cosmosAppStory": "In CosmosApp, every database table contains an organization_id foreign key. When Alice requests GET /api/projects/:id, CosmosApp never executes a bare SELECT WHERE id = :id. Instead, it scopes every query to Alice's active organization ID: WHERE id = :id AND org_id = :orgId. If an attacker guesses another tenant's project ID, the database returns 0 rows.",
    "stepByStep": [
      "Step 1: User requests a specific resource by ID (e.g. GET /api/v1/invoices/:id).",
      "Step 2: Framework middleware authenticates caller and extracts user_id and tenant_id from the session.",
      "Step 3: Route handler passes both the requested resource ID and the trusted tenant_id to the data layer.",
      "Step 4: SQL query binds tenant_id directly into the WHERE clause (enforcing multi-tenant isolation at the database layer).",
      "Step 5: If zero rows are returned, the server responds with HTTP 404 Not Found (preventing attackers from confirming the resource exists).",
      "Step 6: If resource exists within the user's tenant, permissions are evaluated before returning data."
    ],
    "misconceptions": [
      "Using UUIDs instead of sequential integers eliminates IDOR (UUIDs make guessing IDs harder, but do not prevent IDOR; if an ID leaks via URLs, logs, or APIs, an unauthorized user can still access it).",
      "Authentication protects against IDOR (Authentication only proves who you are; it does not check if you own the specific object requested)."
    ],
    "codeSnippet": """// CosmosApp Multi-Tenant Scoped Database Access:
export async function getInvoice(invoiceId: string, userOrgId: string) {
  // CRITICAL: Always bind organization_id from the verified session!
  const query = `
    SELECT id, amount, customer_name, status
    FROM invoices
    WHERE id = $1 AND organization_id = $2
  `;

  const result = await db.query(query, [invoiceId, userOrgId]);

  if (result.rows.length === 0) {
    // Return 404 rather than 403 to prevent object existence enumeration:
    throw new NotFoundError('Invoice not found');
  }

  return result.rows[0];
}""",
    "takeaways": [
      "BOLA/IDOR is the #1 vulnerability on the OWASP API Security Top 10.",
      "Always enforce tenant boundaries at the database query level: WHERE id = $1 AND tenant_id = $2.",
      "Return HTTP 404 Not Found instead of 403 Forbidden to prevent resource ID enumeration."
    ],
    "commonPitfall": {
      "mistake": "Relying on UUIDs as 'security through obscurity' and executing queries without scoping by the caller's organization ID.",
      "fix": "Always include the authenticated user's organization/tenant ID in every SELECT, UPDATE, and DELETE query."
    },
    "knowledgeCheck": {
      "question": "Why is replacing auto-incrementing integer IDs with UUIDv4 insufficient on its own to prevent IDOR/BOLA vulnerabilities?",
      "answer": "Because UUIDs only make identifiers unguessable; if an attacker obtains a UUID (via logs, shared links, or API responses), the missing authorization check still allows unauthorized access."
    },
    "nextTopicId": "xss-csp-defense-in-depth"
  }
]
