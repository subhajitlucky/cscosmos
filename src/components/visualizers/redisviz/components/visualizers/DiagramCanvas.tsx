'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface DiagramCanvasProps {
    children: ReactNode;
    width?: number;
    height?: number;
    viewBox?: string;
    className?: string;
    title?: string;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
    children,
    width,
    height,
    viewBox = "0 0 800 400",
    className,
    title
}) => {
    return (
        <div className={cn("relative rounded-xl border-2 border-border/50 bg-muted/20 overflow-hidden shadow-inner", className)}>
            {title && (
                <div className="absolute top-4 left-4 z-10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{title}</h4>
                </div>
            )}
            <svg
                width={width}
                height={height}
                viewBox={viewBox}
                className="w-full h-auto drop-shadow-2xl"
                preserveAspectRatio="xMidYMid meet"
            >
                {children}
            </svg>
        </div>
    );
};

export const DiagramNode: React.FC<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    icon?: ReactNode;
    color?: string;
    className?: string;
    delay?: number;
}> = ({ x, y, width, height, label, icon, color = "bg-primary", className, delay = 0 }) => {
    return (
        <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
        >
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={12}
                className={cn("fill-background stroke-2", className)}
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
            />
            <rect
                x={x}
                y={y}
                width={8}
                height={height}
                rx={4}
                className={color}
            />
            <foreignObject x={x + 15} y={y} width={width - 20} height={height}>
                <div className="flex flex-col items-start justify-center h-full px-2 overflow-hidden">
                    {icon && <div className="text-muted-foreground mb-1">{icon}</div>}
                    <span className="text-sm font-bold truncate w-full">{label}</span>
                </div>
            </foreignObject>
        </motion.g>
    );
};

export const DiagramEdge: React.FC<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    label?: string;
    animated?: boolean;
    delay?: number;
}> = ({ fromX, fromY, toX, toY, label, animated = false, delay = 0.5 }) => {
    const path = `M ${fromX} ${fromY} L ${toX} ${toY}`;

    return (
        <g>
            <motion.path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay, duration: 0.8 }}
            />
            {animated && (
                <motion.circle
                    r="4"
                    fill="currentColor"
                    className="text-redis"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{
                        delay: delay + 0.8,
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        offsetPath: `path("${path}")`,
                    }}
                />
            )}
            {label && (
                <motion.foreignObject
                    x={(fromX + toX) / 2 - 40}
                    y={(fromY + toY) / 2 - 10}
                    width={80}
                    height={20}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.5 }}
                >
                    <div className="flex items-center justify-center h-full">
                        <span className="text-[10px] bg-background border border-border px-1.5 rounded-full font-semibold whitespace-nowrap text-muted-foreground">
                            {label}
                        </span>
                    </div>
                </motion.foreignObject>
            )}
        </g>
    );
};

export default DiagramCanvas;
