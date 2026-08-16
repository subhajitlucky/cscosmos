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
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-foreground/20 hover:shadow-lg flex flex-col justify-between"
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className={cn("mb-4 h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-sm font-black text-sm", domain.color)}>
                    <span>{domain.name.substring(0, 2).toUpperCase()}</span>
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">{domain.name}</h3>
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed flex-grow">{domain.description}</p>

                <div className="mt-auto flex items-center text-sm font-semibold text-foreground group-hover:underline">
                    Explore Topics <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}
