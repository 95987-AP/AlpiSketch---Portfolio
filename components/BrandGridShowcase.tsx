import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface BrandGridShowcaseProps {
  project: Project;
}

// Slide group interface
interface SlideGroup {
  slideNumber: number;
  files: string[];
  isGrouped: boolean;
  displayAs: 'solo' | 'group';
}

// Modal state interface
interface ModalState {
  isOpen: boolean;
  groupIndex: number;
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

// Parse filenames and group by slide number
const parseAndGroupSlides = (slides: string[]): SlideGroup[] => {
  const groups = new Map<number, SlideGroup>();
  let fallbackNumber = 900;

  slides.forEach((filepath) => {
    // Extract slide number from filename: "NameSlide8.jpg" → 8
    const filename = filepath.split('/').pop() || '';
    const match = filename.match(/Slide(\d+)/i);
    const slideNum = match ? parseInt(match[1], 10) : fallbackNumber++;

    if (!groups.has(slideNum)) {
      groups.set(slideNum, {
        slideNumber: slideNum,
        files: [],
        isGrouped: false,
        displayAs: 'solo',
      });
    }

    groups.get(slideNum)!.files.push(filepath);
  });

  // Mark grouped items and sort
  const result = Array.from(groups.values());
  result.forEach((group) => {
    group.isGrouped = group.files.length > 1;
    group.displayAs = group.isGrouped ? 'group' : 'solo';
  });

  // Sort by slide number
  return result.sort((a, b) => a.slideNumber - b.slideNumber);
};

// Get display name from filename
const getDisplayName = (filepath: string): string => {
  const filename = filepath.split('/').pop() || '';
  return filename
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '')
    .replace(/Slide\d+/i, '')
    .replace(/([A-Z])/g, ' $1')
    .trim() || 'Image';
};

// Determine grid span classes based on position
const getGridClasses = (index: number, isGrouped: boolean): string => {
  if (isGrouped) {
    // Grouped items always 1x1 but contain multiple images
    return 'col-span-1 row-span-1';
  }
  
  // Solo items get varied spans for visual interest
  // Pattern: mostly 1x1, some 2x1 (wider), some 1x2 (taller)
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
    groupIndex: 0,
    imageIndex: 0,
  });

  // Parse and group slides
  const slideGroups = useMemo(() => {
    return parseAndGroupSlides(project.slides || []);
  }, [project.slides]);

  // Open modal
  const openModal = (groupIndex: number, imageIndex: number = 0) => {
    setModal({ isOpen: true, groupIndex, imageIndex });
  };

  // Close modal
  const closeModal = () => {
    setModal({ isOpen: false, groupIndex: 0, imageIndex: 0 });
  };

  // Navigate within grouped images
  const navigateImage = (direction: 'prev' | 'next') => {
    const group = slideGroups[modal.groupIndex];
    if (!group) return;
    
    const newIndex = direction === 'next' 
      ? (modal.imageIndex + 1) % group.files.length
      : (modal.imageIndex - 1 + group.files.length) % group.files.length;
    
    setModal(prev => ({ ...prev, imageIndex: newIndex }));
  };

  // Navigate between groups
  const navigateGroup = (direction: 'prev' | 'next') => {
    const newGroupIndex = direction === 'next'
      ? (modal.groupIndex + 1) % slideGroups.length
      : (modal.groupIndex - 1 + slideGroups.length) % slideGroups.length;
    
    setModal({ isOpen: true, groupIndex: newGroupIndex, imageIndex: 0 });
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modal.isOpen) return;
      
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') {
        const group = slideGroups[modal.groupIndex];
        if (group?.isGrouped) navigateImage('prev');
        else navigateGroup('prev');
      }
      if (e.key === 'ArrowRight') {
        const group = slideGroups[modal.groupIndex];
        if (group?.isGrouped) navigateImage('next');
        else navigateGroup('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal, slideGroups]);

  // Current modal image
  const currentGroup = slideGroups[modal.groupIndex];
  const currentImage = currentGroup?.files[modal.imageIndex];

  return (
    <div className="w-full">
      {/* Unified Masonry Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-4 auto-rows-[280px] md:auto-rows-[320px]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {slideGroups.map((group, index) => (
          group.isGrouped ? (
            // GROUPED: Multiple files with same slide number
            <motion.div
              key={`group-${group.slideNumber}`}
              className={`
                ${getGridClasses(index, true)}
                relative rounded-lg overflow-hidden
                bg-stone-100 border border-stone-200
                p-2 md:p-3
                group cursor-pointer
                transition-all duration-300
                hover:border-stone-400 hover:shadow-xl
              `}
              variants={itemVariants}
              custom={index}
            >
              {/* Group container with side-by-side images */}
              <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.files.map((file, fileIndex) => (
                  <div
                    key={file}
                    className="relative w-full h-full rounded overflow-hidden"
                    onClick={() => openModal(index, fileIndex)}
                  >
                    <img
                      src={file}
                      alt={`Slide ${group.slideNumber} - Image ${fileIndex + 1}`}
                      className="
                        w-full h-full object-cover
                        filter grayscale group-hover:grayscale-0
                        transition-all duration-300
                      "
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              
              {/* Hover overlay for entire group */}
              <div className="
                absolute inset-0 
                bg-gradient-to-t from-stone-900/70 via-transparent to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                pointer-events-none
                flex items-end justify-center pb-4
              ">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Eye size={18} />
                  <span>VIEW ({group.files.length})</span>
                </div>
              </div>
            </motion.div>
          ) : (
            // SOLO: Single file
            <motion.div
              key={`solo-${group.slideNumber}`}
              className={`
                ${getGridClasses(index, false)}
                relative rounded-lg overflow-hidden
                bg-stone-100 border border-stone-200
                group cursor-pointer
                transition-all duration-300
                hover:border-stone-400 hover:shadow-xl hover:scale-[1.02]
              `}
              variants={itemVariants}
              custom={index}
              onClick={() => openModal(index, 0)}
            >
              <img
                src={group.files[0]}
                alt={`Slide ${group.slideNumber}`}
                className="
                  w-full h-full object-cover
                  filter grayscale group-hover:grayscale-0
                  transition-all duration-300
                "
                loading="lazy"
              />
              
              {/* Hover overlay */}
              <div className="
                absolute inset-0 
                bg-gradient-to-t from-stone-900/70 via-transparent to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                flex items-end justify-center pb-4
              ">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Eye size={18} />
                  <span>VIEW</span>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal.isOpen && currentGroup && currentImage && (
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
                alt={getDisplayName(currentImage)}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />

              {/* Image info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                {currentGroup.isGrouped && (
                  <div className="bg-stone-800/80 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                    Image {modal.imageIndex + 1} of {currentGroup.files.length}
                  </div>
                )}
              </div>

              {/* Navigation arrows for grouped items */}
              {currentGroup.isGrouped && currentGroup.files.length > 1 && (
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

              {/* Navigation for solo items */}
              {!currentGroup.isGrouped && slideGroups.length > 1 && (
                <>
                  <button
                    onClick={() => navigateGroup('prev')}
                    className="
                      absolute left-4 top-1/2 -translate-y-1/2
                      p-3 rounded-full
                      bg-white/10 hover:bg-white/20
                      text-white
                      transition-colors duration-200
                    "
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={() => navigateGroup('next')}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      p-3 rounded-full
                      bg-white/10 hover:bg-white/20
                      text-white
                      transition-colors duration-200
                    "
                    aria-label="Next slide"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
