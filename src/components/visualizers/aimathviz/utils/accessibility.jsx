import { useEffect, useRef } from 'react';

// Skip Link Component for keyboard users
export function SkipLink({ targetId = 'main-content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary-600 focus:text-white focus:rounded-b-lg"
    >
      Skip to main content
    </a>
  );
}

// Hook to manage focus for accessibility
export function useFocusManagement() {
  const ref = useRef(null);

  useEffect(() => {
    // Focus main content on route change
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return ref;
}

// Hook for keyboard event handling
export function useKeyboardShortcut(key, callback, deps = []) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === key && !e.ctrlKey && !e.metaKey) {
        callback(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ...deps]);
}

// ARIA announcement utility
export function useAriaAnnouncement() {
  const ref = useRef(null);

  const announce = (message) => {
    if (ref.current) {
      ref.current.textContent = message;
    }
  };

  return { ref, announce };
}

export default { SkipLink, useFocusManagement, useKeyboardShortcut, useAriaAnnouncement };
