import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div 
      className={`backdrop-blur-2xl bg-gradient-to-br from-white/50 via-white/20 to-white/10 border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 rounded-2xl pointer-events-none" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};