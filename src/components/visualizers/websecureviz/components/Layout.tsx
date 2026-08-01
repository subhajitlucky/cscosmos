'use client';
import { LearningPathNavigator } from './LearningPathNavigator';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <LearningPathNavigator />
      <main className="flex-1 md:ml-64 min-h-screen w-full">
        <div className="container mx-auto max-w-[1700px] w-full p-6 md:p-10 lg:p-12 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
