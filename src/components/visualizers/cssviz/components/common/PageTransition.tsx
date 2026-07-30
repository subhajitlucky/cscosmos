'use client';
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

export default PageTransition

