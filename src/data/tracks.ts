/**
 * Learning Tracks - curated, free guided learning paths that sequence
 * existing interactive engines into a clear journey through the cosmos.
 * Engine ids MUST match a live topic slug in topics.ts (which mirrors the
 * top-level app route directories).
 */
export type TrackLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TrackModule {
    /** Stable id used as the progress key inside cscosmos_track_progress_v1. */
    id: string;
    title: string;
    /** Slug of an existing engine route (matches Topic.slug in topics.ts). */
    engineId: string;
}

export interface Track {
    slug: string;
    title: string;
    outcome: string;
    description: string;
    level: TrackLevel;
    estHours: number;
    engineIds: string[];
    modules: TrackModule[];
}

type TrackInput = Omit<Track, 'engineIds'>;

// engineIds is derived from modules so the two can never drift apart.
const createTrack = (input: TrackInput): Track => ({
    ...input,
    engineIds: Array.from(new Set(input.modules.map((m) => m.engineId))),
});

export const tracks: Track[] = [
    createTrack({
        slug: 'system-design-interview',
        title: 'System Design Interview Prep',
        outcome: 'Scope, scale, and defend any architecture under interview pressure.',
        description:
            'A focused path through the systems engines interviewers probe hardest: start with caching and sharding fundamentals, then layer on load balancing, asynchronous message queues, and microservice failure modes. Every module is an interactive visualizer, not a video.',
        level: 'advanced',
        estHours: 12,
        modules: [
            { id: 'system-design-foundations', title: 'System Design & Scalability (Caching, Sharding)', engineId: 'systemdesignviz' },
            { id: 'load-balancing', title: 'Load Balancing (Traffic Distribution)', engineId: 'loadbalancing' },
            { id: 'message-queues', title: 'Message Queues Visualizer (Pub/Sub, Retries)', engineId: 'mqviz' },
            { id: 'microservices-architecture', title: 'Microservices Architecture (Services, Failures)', engineId: 'microservicesviz' },
        ],
    }),
    createTrack({
        slug: 'api-backend-foundations',
        title: 'API & Backend Engineering',
        outcome: 'Ship production-grade APIs backed by solid storage and sync fundamentals.',
        description:
            'From REST and GraphQL contract design down to SQL query internals, then into the real-time world of CRDTs and operational transforms. The sequence mirrors how a backend feature actually travels: API surface -> data layer -> multi-client synchronization.',
        level: 'intermediate',
        estHours: 10,
        modules: [
            { id: 'api-design-fundamentals', title: 'API Design (REST, GraphQL)', engineId: 'apiviz' },
            { id: 'sql-query-fundamentals', title: 'SQL Visualizer (Queries, Indexes)', engineId: 'sqlcosmos' },
            { id: 'realtime-sync-crdts', title: 'Real-Time Sync Algorithms (CRDTs & OT)', engineId: 'synccosmos' },
        ],
    }),
    createTrack({
        slug: 'web-foundations',
        title: 'Web Foundations: From Code to Browser',
        outcome: 'Understand how a webpage actually works - from raw code to a rendered, secured, networked experience.',
        description:
            'The journey of every web app, in dependency order: how programs execute, then structure (HTML), style (CSS and Tailwind), behavior (JavaScript), the browser runtime that binds them, the HTTP protocol that delivers them, and the security model that protects them. Start here if the web feels like magic; leave able to name every layer.',
        level: 'beginner',
        estHours: 14,
        modules: [
            { id: 'programs-execute', title: 'How Programs Execute (CPU, Memory, I/O)', engineId: 'program-cosmos' },
            { id: 'html-accessibility', title: 'HTML & Accessibility (Semantics, ARIA)', engineId: 'html-cosmos' },
            { id: 'css-visualizer', title: 'CSS Visualizer (Box Model, Flexbox, Grid)', engineId: 'css-cosmos' },
            { id: 'tailwind-playground', title: 'TailwindCSS Playground (Utility-First CSS)', engineId: 'tailwindcosmos' },
            { id: 'javascript-execution', title: 'JavaScript Visualizer (Execution, Async, Memory)', engineId: 'jsviz' },
            { id: 'browser-internals', title: 'Browser Internals (DOM, Rendering, Storage)', engineId: 'browseruniverse' },
            { id: 'http-web-protocols', title: 'HTTP & Web Protocols (Headers, Caching)', engineId: 'webprotocols' },
            { id: 'web-security-model', title: 'Web Security (XSS, CSRF, CSP, CORS)', engineId: 'websecurity' },
        ],
    }),
];

export function getTrackBySlug(slug: string): Track | undefined {
    return tracks.find((t) => t.slug === slug);
}
