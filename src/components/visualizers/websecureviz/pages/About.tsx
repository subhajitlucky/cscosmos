'use client';

import { Button } from "../components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <Link href="/websecurity" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to WebSecurity Home
      </Link>
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">About WebSecureViz</h1>
        <p className="text-muted-foreground">
           This project is an educational microsite focused on core web security concepts. 
           It is designed to make complex topics like XSS, CSRF, and CORS intuitive for beginners through visual learning.
        </p>
        <p className="text-muted-foreground">
           Everything you see here is a frontend-only simulation. No real attacks are executed, and no data leaves your browser.
        </p>
      </div>
    </div>
  );
}
