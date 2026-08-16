import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 0.2, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const showTooltip = () => {
    updatePosition();
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  // Update position on scroll or resize when visible
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <div 
        ref={triggerRef}
        className={className || "relative inline-block"}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-90%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-100%" }}
              exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-90%" }}
              transition={{ duration: 0.15, delay }}
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                marginTop: '-8px' // Gap between element and tooltip
              }}
              className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs rounded-lg shadow-xl whitespace-nowrap z-[9999] pointer-events-none"
            >
              {content}
              {/* Little triangle pointer */}
              <div 
                className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-4 border-transparent border-t-neutral-900 dark:border-t-white" 
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
