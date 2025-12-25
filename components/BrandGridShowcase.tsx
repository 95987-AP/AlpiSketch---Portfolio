import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface BrandGridShowcaseProps {
  project: Project;
}

// Flat slide item interface
interface SlideItem {
  filepath: string;
  slideNumber: number;
  index: number;
}

// Modal state interface
interface ModalState {
  isOpen: boolean;
  imageIndex: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.05,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
  },
};

// Parse filenames and sort by slide number (flat list, no grouping)
const parseAndSortSlides = (slides: string[]): SlideItem[] => {
  let fallbackNumber = 900;

  const items: SlideItem[] = slides.map((filepath, originalIndex) => {
    const filename = filepath.split('/').pop() || '';
    const match = filename.match(/Slide(\d+)/i);
    const slideNum = match ? parseInt(match[1], 10) : fallbackNumber++;

    return {
      filepath,
      slideNumber: slideNum,
      index: originalIndex,
    };
  });

  // Sort by slide number to keep same-numbered slides adjacent
  return items.sort((a, b) => a.slideNumber - b.slideNumber);
};

// Determine grid span classes based on position
const getGridClasses = (index: number): string => {
  // Pattern for visual interest - mostly 1x1, some wider/taller
  const patterns = [
    'col-span-1 row-span-1',                    // 0: normal
    'col-span-1 row-span-1',                    // 1: normal
    'col-span-1 md:col-span-2 row-span-1',      // 2: wider
    'col-span-1 row-span-1',                    // 3: normal
    'col-span-1 row-span-1 md:row-span-2',      // 4: taller
    'col-span-1 row-span-1',                    // 5: normal
    'col-span-1 row-span-1',                    // 6: normal
    'col-span-1 md:col-span-2 row-span-1',      // 7: wider
  ];
  
  return patterns[index % patterns.length];
};

export default function BrandGridShowcase({ project }: BrandGridShowcaseProps) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    imageIndex: 0,
  });

  // Parse and sort slides (flat list)
  const slideItems = useMemo(() => {
    return parseAndSortSlides(project.slides || []);
  }, [project.slides]);

  // Open modal
  const openModal = (imageIndex: number) => {
    setModal({ isOpen: true, imageIndex });
  };

  // Close modal
  const closeModal = () => {
    setModal({ isOpen: false, imageIndex: 0 });
  };

  // Navigate between images
  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (modal.imageIndex + 1) % slideItems.length
      : (modal.imageIndex - 1 + slideItems.length) % slideItems.length;
    
    setModal({ isOpen: true, imageIndex: newIndex });
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modal.isOpen) return;
      
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal, slideItems]);

  // Current modal image
  const currentImage = slideItems[modal.imageIndex]?.filepath;

  return (
    <div className="w-full">
      {/* Unified Masonry Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-4 auto-rows-[280px] md:auto-rows-[320px]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {slideItems.map((item, index) => (
          <motion.div
            key={`slide-${item.slideNumber}-${index}`}
            className={`
              ${getGridClasses(index)}
              relative rounded-lg overflow-hidden
              bg-stone-100 border border-stone-200
              cursor-pointer
              transition-all duration-300
              hover:border-stone-400 hover:shadow-xl hover:scale-[1.02]
            `}
            variants={itemVariants}
            custom={index}
            onClick={() => openModal(index)}
          >
            <img
              src={item.filepath}
              alt={`Slide ${item.slideNumber}`}
              className="
                w-full h-full object-contain p-3
                transition-all duration-300
              "
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal.isOpen && currentImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/95 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-6xl max-h-[90vh] w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="
                  absolute -top-12 right-0
                  p-2 rounded-full
                  bg-white/10 hover:bg-white/20
                  text-white
                  transition-colors duration-200
                  z-10
                "
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <img
                src={currentImage}
                alt={`Slide ${slideItems[modal.imageIndex]?.slideNumber}`}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />

              {/* Navigation arrows */}
              {slideItems.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="
                      absolute left-4 top-1/2 -translate-y-1/2
                      p-3 rounded-full
                      bg-white/10 hover:bg-white/20
                      text-white
                      transition-colors duration-200
                    "
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      p-3 rounded-full
                      bg-white/10 hover:bg-white/20
                      text-white
                      transition-colors duration-200
                    "
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-stone-800/80 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                  {modal.imageIndex + 1} / {slideItems.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
