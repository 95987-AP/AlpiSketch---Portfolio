import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Project } from '../types';

interface BrandGridShowcaseProps {
  project: Project;
}

type CategoryType = 'all' | 'logotype' | 'colors' | 'typography' | 'patterns' | 'applications';

interface CategoryConfig {
  label: string;
  keywords: string[];
}

const CATEGORIES: Record<CategoryType, CategoryConfig> = {
  all: { label: 'All', keywords: [] },
  logotype: { label: 'Logotype', keywords: ['logo', 'logotype', 'blackwhite'] },
  colors: { label: 'Colors', keywords: ['color', 'palette', 'colour'] },
  typography: { label: 'Typography', keywords: ['typography', 'type', 'font'] },
  patterns: { label: 'Patterns', keywords: ['pattern'] },
  applications: { label: 'Applications', keywords: ['app', 'application', 'victory', 'defeat', 'matchday', 'showcase', 'website', 'poster', 'banner', 'bag', 'busstop', 'mockup'] },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Helper: Extract filename from path
const getFileName = (path: string): string => {
  const parts = path.split('/');
  return parts[parts.length - 1].replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
};

// Helper: Categorize slide based on filename
const categorizeSlide = (slidePath: string): CategoryType[] => {
  const fileName = getFileName(slidePath).toLowerCase();
  const categories: CategoryType[] = ['all'];
  
  (Object.keys(CATEGORIES) as CategoryType[]).forEach(cat => {
    if (cat === 'all') return;
    const config = CATEGORIES[cat];
    if (config.keywords.some(keyword => fileName.includes(keyword))) {
      categories.push(cat);
    }
  });
  
  // If no specific category found, add to applications as default
  if (categories.length === 1) {
    categories.push('applications');
  }
  
  return categories;
};

export const BrandGridShowcase: React.FC<BrandGridShowcaseProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<CategoryType>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedImage]);

  // Filter slides based on active tab
  const filteredSlides = useMemo(() => {
    if (!project.slides) return [];
    if (activeTab === 'all') return project.slides;
    
    return project.slides.filter(slide => {
      const categories = categorizeSlide(slide);
      return categories.includes(activeTab);
    });
  }, [project.slides, activeTab]);

  // Get available tabs (only show tabs that have items)
  const availableTabs = useMemo(() => {
    if (!project.slides) return ['all'] as CategoryType[];
    
    const tabs: Set<CategoryType> = new Set(['all']);
    project.slides.forEach(slide => {
      const categories = categorizeSlide(slide);
      categories.forEach(cat => tabs.add(cat));
    });
    
    return Array.from(tabs);
  }, [project.slides]);

  if (!project.slides || project.slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">Brand System</h3>
        <p className="text-sm font-mono text-stone-500 uppercase tracking-widest">
          Explore the complete identity system
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 pb-2">
          {(Object.keys(CATEGORIES) as CategoryType[])
            .filter(cat => availableTabs.includes(cat))
            .map(category => (
              <button
                key={category}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(category);
                }}
                className={`
                  px-4 py-2 rounded-full text-xs md:text-sm font-mono uppercase tracking-widest
                  transition-all duration-300 whitespace-nowrap
                  ${activeTab === category 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }
                `}
                aria-label={`Filter by ${CATEGORIES[category].label}`}
              >
                {CATEGORIES[category].label}
              </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredSlides.map((slide, index) => (
            <motion.div
              key={slide}
              variants={itemVariants}
              className="group relative bg-stone-100 rounded-lg overflow-hidden cursor-pointer
                         border-2 border-transparent hover:border-stone-800
                         transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedImage(slide);
              }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
                <img
                  src={slide}
                  alt={`${project.title} - ${getFileName(slide)}`}
                  loading="lazy"
                  className={`
                    w-full h-full object-contain p-3 md:p-4
                    transition-all duration-500
                    ${!isMobile ? 'grayscale group-hover:grayscale-0' : ''}
                    group-hover:scale-105
                  `}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Index Badge */}
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm 
                                flex items-center justify-center text-xs font-mono text-stone-800 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  {index + 1}
                </div>
              </div>
              
              {/* Label */}
              <div className="p-3 md:p-4 bg-white border-t border-stone-200">
                <p className="text-xs md:text-sm text-stone-600 font-mono truncate group-hover:text-stone-900 transition-colors">
                  {getFileName(slide)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Stats */}
      <div className="mt-10 flex items-center justify-center gap-8 text-center">
        <div>
          <div className="text-3xl md:text-4xl font-bold text-stone-800">
            {activeTab === 'all' ? project.slides.length : filteredSlides.length}
          </div>
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mt-1">
            {activeTab === 'all' ? 'Total Items' : `${CATEGORIES[activeTab].label}`}
          </div>
        </div>
        <div className="w-px h-12 bg-stone-300" />
        <div>
          <div className="text-3xl md:text-4xl font-bold text-stone-800">{project.year}</div>
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mt-1">Year</div>
        </div>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-6xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-stone-200/90 backdrop-blur-sm
                           hover:bg-stone-900 hover:text-white transition-all duration-300 
                           flex items-center justify-center shadow-lg"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="p-6 md:p-10 flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
                <img
                  src={selectedImage}
                  alt={`${project.title} - ${getFileName(selectedImage)}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              </div>

              {/* Footer */}
              <div className="p-4 md:p-6 border-t border-stone-200 bg-white text-center">
                <p className="text-sm md:text-base font-mono text-stone-800 mb-1">
                  {getFileName(selectedImage)}
                </p>
                <p className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                  {project.title} • {project.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandGridShowcase;
