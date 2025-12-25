import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface BrandGridShowcaseProps {
  project: Project;
}

// Slide item with layout info
interface SlideItem {
  filepath: string;
  slideNumber: number;
  layoutType: 'full' | 'half' | 'tall' | 'logo';
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
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
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

// Determine layout type based on filename keywords
const getLayoutType = (filepath: string): 'full' | 'half' | 'tall' | 'logo' => {
  const filename = filepath.toLowerCase();
  
  // LogoShowcase and similar large logo displays - full width
  if (filename.includes('logoshowcase')) {
    return 'full';
  }
  
  // Logo images - small, paired
  if (filename.includes('logo')) {
    return 'logo';
  }
  
  // PaperBag - centered full width
  if (filename.includes('paperbag') || filename.includes('bag')) {
    return 'full';
  }
  
  // Pattern images and posters are tall (vertical) - pair them
  if (filename.includes('pattern') || 
      filename.includes('poster') || 
      filename.includes('busstop')) {
    return 'tall';
  }
  
  // Matchday, Victory, Defeat are half-width (2 per row)
  if (filename.includes('matchday') || 
      filename.includes('victory') || 
      filename.includes('vicotry') || 
      filename.includes('defeat')) {
    return 'half';
  }
  
  // Everything else is full width
  return 'full';
};

// Parse and organize slides
const parseSlides = (slides: string[]): SlideItem[] => {
  let fallbackNumber = 900;

  return slides.map((filepath) => {
    const filename = filepath.split('/').pop() || '';
    const match = filename.match(/Slide(\d+)/i);
    const slideNum = match ? parseInt(match[1], 10) : fallbackNumber++;

    return {
      filepath,
      slideNumber: slideNum,
      layoutType: getLayoutType(filepath),
    };
  });
};

export default function BrandGridShowcase({ project }: BrandGridShowcaseProps) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    imageIndex: 0,
  });

  // Parse slides
  const slideItems = useMemo(() => {
    return parseSlides(project.slides || []);
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

  // Group slides into rows for rendering
  const renderSlides = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < slideItems.length) {
      const item = slideItems[i];
      
      if (item.layoutType === 'full') {
        // Full width item with max-height
        elements.push(
          <motion.div
            key={`full-${i}`}
            className="w-full flex justify-center"
            variants={itemVariants}
          >
            <div
              className="
                relative rounded-lg overflow-hidden
                cursor-pointer
                transition-all duration-300
                hover:shadow-2xl
                max-w-4xl w-full
              "
              onClick={() => openModal(i)}
            >
              <img
                src={item.filepath}
                alt={`Slide ${item.slideNumber}`}
                className="w-full h-auto object-contain max-h-[70vh]"
                loading="lazy"
              />
            </div>
          </motion.div>
        );
        i++;
      } else if (item.layoutType === 'half') {
        // Check if next item is also half
        const nextItem = slideItems[i + 1];
        if (nextItem && nextItem.layoutType === 'half') {
          // Two half items side by side
          elements.push(
            <motion.div
              key={`half-row-${i}`}
              className="w-full grid grid-cols-2 gap-4 max-w-4xl mx-auto"
              variants={itemVariants}
            >
              <div
                className="
                  relative rounded-lg overflow-hidden
                  cursor-pointer
                  transition-all duration-300
                  hover:shadow-2xl
                "
                onClick={() => openModal(i)}
              >
                <img
                  src={item.filepath}
                  alt={`Slide ${item.slideNumber}`}
                  className="w-full h-auto object-contain max-h-[50vh]"
                  loading="lazy"
                />
              </div>
              <div
                className="
                  relative rounded-lg overflow-hidden
                  cursor-pointer
                  transition-all duration-300
                  hover:shadow-2xl
                "
                onClick={() => openModal(i + 1)}
              >
                <img
                  src={nextItem.filepath}
                  alt={`Slide ${nextItem.slideNumber}`}
                  className="w-full h-auto object-contain max-h-[50vh]"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
          i += 2;
        } else {
          // Single half item (treat as full but smaller)
          elements.push(
            <motion.div
              key={`half-single-${i}`}
              className="w-full flex justify-center"
              variants={itemVariants}
            >
              <div
                className="
                  relative rounded-lg overflow-hidden
                  cursor-pointer
                  transition-all duration-300
                  hover:shadow-2xl
                  max-w-2xl w-full
                "
                onClick={() => openModal(i)}
              >
                <img
                  src={item.filepath}
                  alt={`Slide ${item.slideNumber}`}
                  className="w-full h-auto object-contain max-h-[50vh]"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
          i++;
        }
      } else if (item.layoutType === 'tall') {
        // Check if next item is also tall
        const nextItem = slideItems[i + 1];
        if (nextItem && nextItem.layoutType === 'tall') {
          // Two tall items side by side
          elements.push(
            <motion.div
              key={`tall-row-${i}`}
              className="w-full grid grid-cols-2 gap-4 max-w-5xl mx-auto"
              variants={itemVariants}
            >
              <div
                className="
                  relative rounded-lg overflow-hidden
                  cursor-pointer
                  transition-all duration-300
                  hover:shadow-2xl
                "
                onClick={() => openModal(i)}
              >
                <img
                  src={item.filepath}
                  alt={`Slide ${item.slideNumber}`}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  loading="lazy"
                />
              </div>
              <div
                className="
                  relative rounded-lg overflow-hidden
                  cursor-pointer
                  transition-all duration-300
                  hover:shadow-2xl
                "
                onClick={() => openModal(i + 1)}
              >
                <img
                  src={nextItem.filepath}
                  alt={`Slide ${nextItem.slideNumber}`}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
          i += 2;
        } else {
          // Single tall item - center it
          elements.push(
            <motion.div
              key={`tall-single-${i}`}
              className="w-full flex justify-center"
              variants={itemVariants}
            >
              <div
                className="
                  relative rounded-lg overflow-hidden
                  cursor-pointer
                  transition-all duration-300
                  hover:shadow-2xl
                  max-w-lg w-full
                "
                onClick={() => openModal(i)}
              >
                <img
                  src={item.filepath}
                  alt={`Slide ${item.slideNumber}`}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
          i++;
        }
      } else if (item.layoutType === 'logo') {
        // Collect all consecutive logo items
        const logoItems: { item: SlideItem; index: number }[] = [];
        let j = i;
        while (j < slideItems.length && slideItems[j].layoutType === 'logo') {
          logoItems.push({ item: slideItems[j], index: j });
          j++;
        }
        
        // Render logos in a row (2 per row)
        for (let k = 0; k < logoItems.length; k += 2) {
          const logo1 = logoItems[k];
          const logo2 = logoItems[k + 1];
          
          if (logo2) {
            // Two logos side by side
            elements.push(
              <motion.div
                key={`logo-row-${logo1.index}`}
                className="w-full grid grid-cols-2 gap-4 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                <div
                  className="
                    relative rounded-lg overflow-hidden
                    cursor-pointer
                    transition-all duration-300
                    hover:shadow-2xl
                    p-8
                  "
                  onClick={() => openModal(logo1.index)}
                >
                  <img
                    src={logo1.item.filepath}
                    alt={`Logo ${logo1.item.slideNumber}`}
                    className="w-full h-auto object-contain max-h-[200px]"
                    loading="lazy"
                  />
                </div>
                <div
                  className="
                    relative rounded-lg overflow-hidden
                    cursor-pointer
                    transition-all duration-300
                    hover:shadow-2xl
                    p-8
                  "
                  onClick={() => openModal(logo2.index)}
                >
                  <img
                    src={logo2.item.filepath}
                    alt={`Logo ${logo2.item.slideNumber}`}
                    className="w-full h-auto object-contain max-h-[200px]"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            );
          } else {
            // Single logo
            elements.push(
              <motion.div
                key={`logo-single-${logo1.index}`}
                className="w-full flex justify-center"
                variants={itemVariants}
              >
                <div
                  className="
                    relative rounded-lg overflow-hidden
                    cursor-pointer
                    transition-all duration-300
                    hover:shadow-2xl
                    p-8
                    max-w-sm w-full
                  "
                  onClick={() => openModal(logo1.index)}
                >
                  <img
                    src={logo1.item.filepath}
                    alt={`Logo ${logo1.item.slideNumber}`}
                    className="w-full h-auto object-contain max-h-[200px]"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            );
          }
        }
        
        i = j;
      } else {
        i++;
      }
    }

    return elements;
  };

  return (
    <div className="w-full">
      {/* Vertical Stack Layout */}
      <motion.div
        className="flex flex-col gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {renderSlides()}
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
