import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

            progress: {
                completedTopics: [],
                solvedProblems: [],
            },

            markTopicCompleted: (topicId) => set((state) => ({
                progress: {
                    ...state.progress,
                    completedTopics: [...new Set([...state.progress.completedTopics, topicId])]
                }
            })),

            markProblemSolved: (problemId) => set((state) => ({
                progress: {
                    ...state.progress,
                    solvedProblems: [...new Set([...state.progress.solvedProblems, problemId])]
                }
            })),
        }),
        {
            name: 'jsviz-storage',
        }
    )
);

export default useStore;
