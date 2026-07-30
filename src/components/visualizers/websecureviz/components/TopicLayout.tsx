'use client';

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useProgress } from "../hooks/useProgress";
import { learningPath } from "../data/learningPath";
import Link from "next/link";

interface TopicLayoutProps {
  stepNumber: number;
  title: string;
  description: string;
  children: React.ReactNode;
  nextPath?: string;
  prevPath?: string;
}

export function TopicLayout({ 
  stepNumber, 
  title, 
  description, 
  children,
  nextPath
}: TopicLayoutProps) {
  const { markComplete, isComplete } = useProgress();
  const stepInfo = learningPath.steps.find(s => s.step === stepNumber);

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-widest font-semibold">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded">Step {stepNumber}</span>
          <span>{stepInfo?.estimatedTime}</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
           {children}
        </div>
        
        <div className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="text-lg">Mastery Goals</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground mb-4">{stepInfo?.masteryGoal}</p>
               <ul className="space-y-2">
                 {stepInfo?.topics.map((topic, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm">
                     <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                     <span>{topic}</span>
                   </li>
                 ))}
               </ul>
             </CardContent>
           </Card>

           <div className="bg-muted/30 p-6 rounded-lg border border-border/80 flex flex-col items-center text-center space-y-4">
              <h3 className="font-semibold text-foreground">Ready to move on?</h3>
              <p className="text-sm text-muted-foreground">
                Mark this section as complete to track your progress through the curriculum.
              </p>
              <Button 
                className="w-full" 
                size="lg"
                variant={isComplete(stepNumber) ? "outline" : "default"}
                onClick={() => markComplete(stepNumber)}
              >
                {isComplete(stepNumber) ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                  </>
                ) : "Mark as Complete"}
              </Button>
              
              {nextPath && (
                <Link href={nextPath} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline pt-2">
                  Next Topic <ArrowRight className="h-4 w-4" />
                </Link>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
