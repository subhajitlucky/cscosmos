import { NavLink } from '@/components/visualizers/shared/RouterShim';
import { cn } from '../lib/utils';

const groups = [
  {
    title: "Fundamentals",
    items: [
      { name: "What is Load Balancing", slug: "what-is-load-balancing" },
      { name: "Why it's Needed", slug: "why-needed" },
      { name: "Layer 4 vs Layer 7", slug: "l4-l7" },
    ]
  },
  {
    title: "Algorithms",
    items: [
      { name: "Round Robin", slug: "round-robin" },
      { name: "Least Connections", slug: "least-connections" },
      { name: "Consistent Hashing", slug: "consistent-hashing" },
    ]
  },
  {
    title: "Advanced",
    items: [
      { name: "Health Checks", slug: "health-checks" },
      { name: "Retries & Timeouts", slug: "retries" },
      { name: "Circuit Breaker", slug: "circuit-breaker" },
    ]
  }
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto p-6 hidden lg:block">
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.slug}
                  to={`/concepts/${item.slug}`}
                  className={({ isActive }: { isActive: boolean }) => cn(
                    "block px-3 py-2 text-sm rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};