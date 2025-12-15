import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax transforms for background shapes
  // Shape 1 (Top Right): Moves down and rotates clockwise
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const rotate1 = useTransform(scrollY, [0, 1000], [0, 20]);
  
  // Shape 2 (Bottom Left): Moves up and rotates counter-clockwise
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const rotate2 = useTransform(scrollY, [0, 1000], [0, -15]);

  // Content Fade
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Word animation variants
  const wordVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12">
      
      {/* Background Abstract Shapes */}
      <motion.div 
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-b from-stone-300 to-stone-400 blur-[80px] opacity-40 z-0 will-change-transform"
      />
      <motion.div 
        style={{ y: y2, rotate: rotate2 }}
        className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-gray-300 to-stone-200 blur-[100px] opacity-40 z-0 will-change-transform"
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="border-b border-stone-400/60 pb-6 md:pb-8 mb-6 md:mb-8 flex justify-between items-end">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="font-mono text-stone-500 uppercase tracking-widest text-xs md:text-sm"
          >
            Portfolio [2024-2025]
          </motion.span>
          <motion.span 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="font-mono text-stone-500 uppercase tracking-widest text-xs md:text-sm text-right hidden md:block"
          >
            Digital Architecture <br /> & Visual Interaction
          </motion.span>
        </div>

        <motion.h1 
          className="text-[16vw] sm:text-[14vw] md:text-[12vw] leading-[0.9] md:leading-[0.85] font-black tracking-tighter text-stone-900 uppercase mix-blend-multiply"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
              }
            }
          }}
        >
          <motion.span className="inline-block" variants={wordVariants}>From</motion.span>{' '}
          <span className="italic font-serif font-light text-stone-600 inline">
            <motion.span className="inline-block" variants={wordVariants}>Sketch</motion.span>{' '}
            <motion.span className="inline-block" variants={wordVariants}>To</motion.span>
          </span>{' '}
          <motion.span className="inline-block" variants={wordVariants}>Reality</motion.span>
        </motion.h1>

      </div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-6 left-6 md:bottom-12 md:left-12 flex items-center gap-4 text-stone-500"
      >
        <div className="w-[1px] h-12 bg-stone-400 animate-pulse" />
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest">Scroll to explore</span>
      </motion.div>
    </section>
  );
};