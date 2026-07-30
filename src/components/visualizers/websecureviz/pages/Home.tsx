'use client';

import { Button } from "../components/ui/button";
import Link from "next/link";
import { ArrowRight, Shield, Globe, Lock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4 py-10 lg:py-20">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Web Security Visualized
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A premium, interactive journey through the core concepts of web security. 
          Understand XSS, CORS, CSRF, and CSP through visual simulations, not just text.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/websecurity/browser-security">
            <Button size="lg" className="gap-2">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/websecurity/about">
            <Button size="lg" variant="outline">About Project</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Globe, title: "CORS", desc: "Cross-Origin Resource Sharing boundaries" },
          { icon: AlertTriangle, title: "XSS", desc: "Cross-Site Scripting injection vectors" },
          { icon: Lock, title: "CSRF", desc: "Cross-Site Request Forgery protection" },
          { icon: Shield, title: "CSP", desc: "Content Security Policy enforcement" },
        ].map((item, i) => (
          <Card key={i} className="border-muted/40 bg-card/50">
            <CardHeader>
              <item.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border rounded-xl bg-card p-8 lg:p-12 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-foreground">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
           <div className="space-y-2">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
             <h3 className="font-semibold text-foreground">Visual First</h3>
             <p className="text-sm text-muted-foreground">Every concept is explained with an interactive diagram or animation. No walls of text.</p>
           </div>
           <div className="space-y-2">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
             <h3 className="font-semibold text-foreground">Safe Simulations</h3>
             <p className="text-sm text-muted-foreground">Execute "attacks" in a safe, sandboxed frontend environment to see how they work.</p>
           </div>
           <div className="space-y-2">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
             <h3 className="font-semibold text-foreground">Interactive Exercises</h3>
             <p className="text-sm text-muted-foreground">Test your knowledge with conceptual security challenges and policy builders.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
