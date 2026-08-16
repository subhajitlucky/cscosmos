import { motion } from 'framer-motion';

interface ParticlePathProps {
  d: string;
  active: boolean;
  color?: string;
  reverse?: boolean;
}

export const ParticlePath: React.FC<ParticlePathProps> = ({ d, active, color = "var(--primary)", reverse = false }) => {
  if (!active) return null;

  return (
    <>
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 0.5 }}
      />
      {/* The Particle */}
      <motion.circle
        r="3"
        fill={color}
        initial={{ offsetDistance: reverse ? "100%" : "0%" }}
        animate={{ offsetDistance: reverse ? "0%" : "100%" }}
        style={{ offsetPath: `path('${d}')` }}
        transition={{ 
          duration: 1.5, 
          ease: "linear", 
          repeat: Infinity,
          repeatDelay: 0.2
        }}
      />
      {/* Trail 1 */}
      <motion.circle
        r="2"
        fill={color}
        initial={{ offsetDistance: reverse ? "100%" : "0%" }}
        animate={{ offsetDistance: reverse ? "0%" : "100%" }}
        style={{ offsetPath: `path('${d}')`, opacity: 0.6 }}
        transition={{ 
          duration: 1.5, 
          ease: "linear", 
          repeat: Infinity,
          repeatDelay: 0.2,
          delay: 0.1
        }}
      />
    </>
  );
};