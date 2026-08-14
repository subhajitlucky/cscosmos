'use client';

import { Button } from "../components/ui/button";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { SqlInjectionSimulator } from "../components/visuals/SqlInjectionSimulator";

const sims = [
  {
    title: "SOP Visualizer",
    desc: "Visualize how browsers block cross-origin reads.",
    path: "/websecurity/browser-security",
    color: "bg-blue-500"
  },
  {
    title: "CORS Preflight",
    desc: "Simulate OPTIONS requests and server headers.",
    path: "/websecurity/cors",
    color: "bg-purple-500"
  },
  {
    title: "XSS Attack Flow",
    desc: "See how reflected scripts execute in the browser.",
    path: "/websecurity/xss",
    color: "bg-red-500"
  },
  {
    title: "CSRF Scenario",
    desc: "Watch how cookies are auto-attached to forged requests.",
    path: "/websecurity/csrf",
    color: "bg-yellow-500"
  },
  {
    title: "CSP Builder",
    desc: "Construct a security policy and test it against resources.",
    path: "/websecurity/csp",
    color: "bg-green-500"
  }
];

export default function Simulations() {
  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Interactive Security Simulations</h1>
        <p className="text-muted-foreground">Jump directly into any security simulation module below.</p>
      </div>

      {/* Embedded SQL Injection vs Parameterized Query Simulator */}
      <SqlInjectionSimulator />

      <div className="grid md:grid-cols-2 gap-6 pt-4">
        {sims.map((sim, i) => (
          <div key={i} className="border border-border/80 rounded-2xl p-6 bg-card space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${sim.color}`} />
              <h3 className="text-xl font-bold text-foreground">{sim.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{sim.desc}</p>
            <Link href={sim.path} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Launch Simulation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
