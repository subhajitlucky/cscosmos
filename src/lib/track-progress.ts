'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Unified Learning-Track progress store.
 *
 * ONE localStorage key holds progress for every track:
 *   cscosmos_track_progress_v1 -> { [trackSlug]: { [moduleId]: true } }
 *
 * This deliberately coexists with the per-engine progress keys used inside the
 * individual visualizers; it never reads or rewrites them.
 */
export const TRACK_PROGRESS_STORAGE_KEY = 'cscosmos_track_progress_v1';

// Fired on window whenever this tab writes progress (the native 'storage'
// event only fires in OTHER tabs), so every mounted hook stays in sync.
const TRACK_PROGRESS_EVENT = 'cscosmos:track-progress-changed';

export type TrackProgressState = Record<string, Record<string, boolean>>;
export type ModuleProgressMap = Record<string, boolean>;

function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

function sanitize(raw: unknown): TrackProgressState {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    return raw as TrackProgressState;
}

export function readTrackProgress(): TrackProgressState {
    if (!isBrowser()) return {};
    try {
        const raw = window.localStorage.getItem(TRACK_PROGRESS_STORAGE_KEY);
        if (!raw) return {};
        return sanitize(JSON.parse(raw));
    } catch {
        // Corrupt JSON or storage unavailable (private mode) - degrade to empty.
        return {};
    }
}

function writeTrackProgress(state: TrackProgressState): void {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(TRACK_PROGRESS_STORAGE_KEY, JSON.stringify(state));
        window.dispatchEvent(new CustomEvent(TRACK_PROGRESS_EVENT));
    } catch {
        // Storage full or blocked: progress is best-effort, ignore.
    }
}

export function getTrackProgress(trackSlug: string): ModuleProgressMap {
    return readTrackProgress()[trackSlug] ?? {};
}

export function isModuleDone(trackSlug: string, moduleId: string): boolean {
    return getTrackProgress(trackSlug)[moduleId] === true;
}

export function setModuleDone(trackSlug: string, moduleId: string, done: boolean): void {
    const state = readTrackProgress();
    const trackState = { ...(state[trackSlug] ?? {}) };
    if (done) {
        trackState[moduleId] = true;
    } else {
        delete trackState[moduleId];
    }
    writeTrackProgress({ ...state, [trackSlug]: trackState });
}

export function toggleModuleDone(trackSlug: string, moduleId: string): boolean {
    const next = !isModuleDone(trackSlug, moduleId);
    setModuleDone(trackSlug, moduleId, next);
    return next;
}

export function countDoneModules(trackSlug: string): number {
    return Object.values(getTrackProgress(trackSlug)).filter(Boolean).length;
}

export function clearTrackProgress(trackSlug: string): void {
    const state = readTrackProgress();
    if (!(trackSlug in state)) return;
    const next = { ...state };
    delete next[trackSlug];
    writeTrackProgress(next);
}

export interface UseTrackProgressResult {
    /** moduleId -> done, hydrated from localStorage after mount. */
    doneMap: ModuleProgressMap;
    doneCount: number;
    /** False during SSR and the very first client render (avoids hydration mismatch). */
    hydrated: boolean;
    isDone: (moduleId: string) => boolean;
    toggle: (moduleId: string) => void;
    reset: () => void;
}

/** React binding for the unified track-progress store. Client components only. */
export function useTrackProgress(trackSlug: string): UseTrackProgressResult {
    const [doneMap, setDoneMap] = useState<ModuleProgressMap>({});
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const sync = () => setDoneMap(getTrackProgress(trackSlug));
        sync();
        setHydrated(true);
        window.addEventListener(TRACK_PROGRESS_EVENT, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(TRACK_PROGRESS_EVENT, sync);
            window.removeEventListener('storage', sync);
        };
    }, [trackSlug]);

    const toggle = useCallback(
        (moduleId: string) => {
            toggleModuleDone(trackSlug, moduleId);
            setDoneMap(getTrackProgress(trackSlug));
        },
        [trackSlug],
    );

    const reset = useCallback(() => {
        clearTrackProgress(trackSlug);
        setDoneMap({});
    }, [trackSlug]);

    const isDone = useCallback((moduleId: string) => doneMap[moduleId] === true, [doneMap]);
    const doneCount = Object.values(doneMap).filter(Boolean).length;

    return { doneMap, doneCount, hydrated, isDone, toggle, reset };
}
