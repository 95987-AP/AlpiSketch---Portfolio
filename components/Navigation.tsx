import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-[90]"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-[#EBEAE5] z-[100] shadow-2xl"
          >
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-6 md:p-8 border-b border-stone-300">
                <div className="flex items-center gap-2">
                  <img src="/Logos/Alpisketchlogo.png" alt="Logo" className="w-8 h-8" />
                  <span className="font-bold tracking-tight text-xl text-stone-900">MENU</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-stone-300 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-stone-900" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-8 md:p-12">
                <ul className="space-y-6">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                    >
                      <button
                        onClick={() => handleClick(item.href)}
                        className="group text-4xl md:text-5xl font-bold tracking-tighter text-stone-900 hover:text-stone-600 transition-colors duration-300 flex items-center gap-4"
                      >
                        <span className="text-sm font-mono text-stone-500 group-hover:text-stone-900 transition-colors">
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-8 md:p-12 border-t border-stone-300">
                <div className="space-y-4">
                  <p className="text-sm font-mono uppercase tracking-widest text-stone-500">
                    Get in Touch
                  </p>
                  <a
                    href="mailto:sketchalpi@gmail.com"
                    className="text-lg font-medium text-stone-900 hover:underline block"
                  >
                    sketchalpi@gmail.com
                  </a>
                  <div className="flex gap-4 pt-4">
                    <a
                      href="#"
                      className="text-sm font-mono uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="text-sm font-mono uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="#"
                      className="text-sm font-mono uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      Behance
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
