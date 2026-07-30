'use client';

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Domain } from "../data/domains"
import { cn } from "../lib/utils"

interface DomainCardProps {
    domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
    return (
        <Link
            href={domain.path}
            className={cn(
                "group relative overflow-hidden rounded-2xl glass-card p-6 card-hover border-t-4 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.65)]",
                "border-white/5 dark:border-white/8" 
            )}
        >
            <div className={cn("absolute top-0 left-0 right-0 h-1", domain.color)} />
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent group-hover:from-primary/10 transition-all" />
            <div className={cn("absolute -top-16 -right-24 h-40 w-40 rounded-full blur-3xl opacity-40", domain.color)} />

            <div className="relative z-10 flex flex-col h-full">
                <div className={cn("mb-4 h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-md", domain.color)}>
                    <span className="text-lg font-bold">{domain.name.substring(0, 2)}</span>
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-tight">{domain.name}</h3>
                <p className="mb-6 text-muted-foreground flex-grow">{domain.description}</p>

                <div className="mt-auto flex items-center text-sm font-medium text-primary group-hover:underline">
                    Explore Topics <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}
