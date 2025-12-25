import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ArrowRight, Maximize2 } from 'lucide-react';
import { Project } from '../types';

interface BrandGridShowcaseProps {
  project: Project;
}

// Section type definitions
type SectionType = 'identity' | 'colors' | 'typography' | 'patterns' | 'applications' | 'lifestyle' | 'other';

interface SectionTemplate {
  title: string;
  description: string;
  features: string[];
  emoji: string;
  keywords: string[];
  order: number;
}

interface Section {
  id: SectionType;
  title: string;
  description: string;
  features: string[];
  emoji: string;
  images: string[];
  order: number;
}

// Section templates with auto-detection keywords
const SECTION_TEMPLATES: Record<SectionType, SectionTemplate> = {
  identity: {
    title: "Logotype & Icon System",
    description: "Primary logo, variations, and icon set",
    features: ["Main Logo", "Logo Variations", "Icon Library", "B&W Versions"],
    emoji: "🎭",
    keywords: ['logo', 'logotype', 'icon', 'blackwhite', 'symbol', 'mark'],
    order: 1
  },
  colors: {
    title: "Color Palette",
    description: "Complete color system with primary, accent, and utility colors",
    features: ["Primary Colors", "Accent Shades", "Gradients", "Color Guidelines"],
    emoji: "🎨",
    keywords: ['color', 'palette', 'colour', 'swatch', 'gradient'],
    order: 2
  },
  typography: {
    title: "Typography System",
    description: "Font families, scales, and typographic hierarchy",
    features: ["Font Families", "Type Scale", "Hierarchy", "Usage Rules"],
    emoji: "📝",
    keywords: ['typography', 'type', 'font', 'typeface', 'text'],
    order: 3
  },
  patterns: {
    title: "Pattern Library",
    description: "Geometric patterns and textures for brand applications",
    features: ["Primary Patterns", "Texture Sets", "Scale Variations"],
    emoji: "✨",
    keywords: ['pattern', 'texture', 'background', 'geometric'],
    order: 4
  },
  applications: {
    title: "Brand Applications",
    description: "Real-world brand usage across digital and print mediums",
    features: ["Digital Mockups", "Print Materials", "Social Media", "Merchandise"],
    emoji: "🚀",
    keywords: ['app', 'application', 'web', 'social', 'mockup', 'victory', 'defeat', 'matchday', 'poster', 'website'],
    order: 5
  },
  lifestyle: {
    title: "Lifestyle & Presentation",
    description: "Brand in real-world context and environmental applications",
    features: ["Environmental", "Signage", "Real-world Usage"],
    emoji: "🌍",
    keywords: ['lifestyle', 'presentation', 'busstop', 'banner', 'outdoor', 'bag', 'packaging'],
    order: 6
  },
  other: {
    title: "Additional Assets",
    description: "Supplementary brand materials and guidelines",
    features: ["Supporting Materials"],
    emoji: "📦",
    keywords: [],
    order: 99
  }
};

// Fixed section order
const SECTION_ORDER: SectionType[] = ['identity', 'colors', 'typography', 'patterns', 'applications', 'lifestyle', 'other'];

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

// Helper: Extract filename from path
const getFileName = (path: string): string => {
  const parts = path.split('/');
  return parts[parts.length - 1].replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
};

// Helper: Categorize slide into section
const categorizeSlide = (slidePath: string): SectionType => {
  const fileName = getFileName(slidePath).toLowerCase();
  
  for (const sectionId of SECTION_ORDER) {
    if (sectionId === 'other') continue;
    const template = SECTION_TEMPLATES[sectionId];
    if (template.keywords.some(keyword => fileName.includes(keyword))) {
      return sectionId;
    }
  }
  
  return 'other';
};

// Helper: Group slides into sections
const groupSlidesIntoSections = (slides: string[], brandName: string): Section[] => {
  const groupedSlides: Record<SectionType, string[]> = {
    identity: [],
    colors: [],
    typography: [],
    patterns: [],
    applications: [],
    lifestyle: [],
    other: []
  };
  
  // Group each slide
  slides.forEach(slide => {
    const category = categorizeSlide(slide);
    groupedSlides[category].push(slide);
  });
  
  // Build sections array (only non-empty)
  const sections: Section[] = [];
  
  SECTION_ORDER.forEach(sectionId => {
    const images = groupedSlides[sectionId];
    if (images.length === 0) return;
    
    const template = SECTION_TEMPLATES[sectionId];
    sections.push({
      id: sectionId,
      title: template.title,
      description: `${template.description} for ${brandName}`,
      features: template.features.slice(0, Math.min(images.length + 1, 4)),
      emoji: template.emoji,
      images,
      order: template.order
    });
  });
  
  return sections.sort((a, b) => a.order - b.order);
};

// Section Card Component
interface SectionCardProps {
  image: string;
  sectionTitle: string;
  index: number;
  isHero?: boolean;
  isMobile: boolean;
  onClick: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ image, sectionTitle, index, isHero, isMobile, onClick }) => {
  const fileName = getFileName(image);
  
  return (
    <motion.div
      variants={cardVariants}
      className={`
        group relative overflow-hidden rounded-xl cursor-pointer
        bg-gradient-to-br from-stone-100 to-stone-200
        border border-stone-200 hover:border-stone-800
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:shadow-xl
        ${isHero ? 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2' : ''}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image Container */}
      <div className={`relative ${isHero ? 'aspect-[4/3] sm:aspect-square' : 'aspect-[4/3]'} overflow-hidden`}>
        <img
          src={image}
          alt={`${sectionTitle} - ${fileName}`}
          loading="lazy"
          className={`
            w-full h-full object-contain p-4
            transition-all duration-500 ease-out
            ${!isMobile ? 'grayscale group-hover:grayscale-0' : ''}
            group-hover:scale-105
          `}
        />
        
        {/* Gradient Overlay - slides in from right */}
        <div className="
          absolute inset-0 
          bg-gradient-to-l from-black/70 via-black/30 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300 ease-out
          flex items-center justify-end
          p-6
        ">
          <div className="flex flex-col items-end gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xs font-mono uppercase tracking-widest">
              View Full
            </span>
          </div>
        </div>
        
        {/* Index Badge */}
        <div className="
          absolute top-3 left-3 
          w-8 h-8 rounded-full 
          bg-white/90 backdrop-blur-sm 
          flex items-center justify-center 
          text-xs font-mono text-stone-800 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 
          shadow-md
        ">
          {index + 1}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4 bg-white border-t border-stone-100">
        <p className="text-sm text-stone-700 font-medium truncate group-hover:text-stone-900 transition-colors">
          {fileName}
        </p>
      </div>
    </motion.div>
  );
};

// Section Component
interface SectionComponentProps {
  section: Section;
  sectionIndex: number;
  isMobile: boolean;
  onImageClick: (image: string) => void;
  onExploreClick: (section: Section) => void;
}

const SectionComponent: React.FC<SectionComponentProps> = ({ 
  section, 
  sectionIndex, 
  isMobile, 
  onImageClick,
  onExploreClick 
}) => {
  // Determine grid layout based on section and number of images
  const getGridClass = () => {
    if (section.images.length === 1) {
      return 'grid-cols-1';
    }
    if (sectionIndex === 0 && section.images.length >= 3) {
      // Hero section - special layout
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <motion.section
      custom={sectionIndex}
      variants={sectionVariants}
      initial="hidden"
      animate="show"
      className={`
        relative
        ${sectionIndex > 0 ? 'pt-12 mt-12 border-t border-stone-200' : ''}
      `}
    >
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">{section.emoji}</span>
          <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            {section.title}
          </h3>
        </div>
        <p className="text-stone-600 text-base md:text-lg max-w-2xl">
          {section.description}
        </p>
      </div>
      
      {/* Images Grid */}
      <motion.div 
        className={`grid ${getGridClass()} gap-4 md:gap-6 mb-8`}
        initial="hidden"
        animate="show"
        variants={{
          show: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: sectionIndex * 0.2 + 0.1,
            }
          }
        }}
      >
        {section.images.map((image, imgIndex) => (
          <SectionCard
            key={image}
            image={image}
            sectionTitle={section.title}
            index={imgIndex}
            isHero={sectionIndex === 0 && imgIndex === 0 && section.images.length >= 3}
            isMobile={isMobile}
            onClick={() => onImageClick(image)}
          />
        ))}
      </motion.div>
      
      {/* Section Footer - Features & CTA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 bg-stone-50 rounded-xl">
        {/* Features */}
        <div className="flex flex-wrap gap-3">
          {section.features.map((feature, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm text-stone-700 border border-stone-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
              {feature}
            </span>
          ))}
        </div>
        
        {/* CTA Button */}
        {section.images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreClick(section);
            }}
            className="
              inline-flex items-center gap-2 
              px-6 py-3 
              border-2 border-stone-900 
              text-stone-900 
              text-xs font-mono uppercase tracking-widest
              rounded-full
              hover:bg-stone-900 hover:text-white
              transition-all duration-300
              whitespace-nowrap
            "
          >
            Explore {section.title.split(' ')[0]}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.section>
  );
};

// Main Component
export const BrandGridShowcase: React.FC<BrandGridShowcaseProps> = ({ project }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ESC key to close modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
        setSelectedSection(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Group slides into sections
  const sections = useMemo(() => {
    if (!project.slides) return [];
    return groupSlidesIntoSections(project.slides, project.title);
  }, [project.slides, project.title]);

  if (!project.slides || project.slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-stone-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-8 bg-stone-900 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Brand System
          </h2>
        </div>
        <p className="text-stone-600 text-lg max-w-3xl">
          Complete brand identity system for <span className="font-semibold text-stone-900">{project.title}</span>. 
          Explore the visual language, guidelines, and applications that make this brand unique.
        </p>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-stone-900">{sections.length}</span>
            <span className="text-sm text-stone-500 uppercase tracking-wider">Sections</span>
          </div>
          <div className="w-px h-8 bg-stone-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-stone-900">{project.slides.length}</span>
            <span className="text-sm text-stone-500 uppercase tracking-wider">Assets</span>
          </div>
          <div className="w-px h-8 bg-stone-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-stone-900">{project.year}</span>
            <span className="text-sm text-stone-500 uppercase tracking-wider">Year</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-0">
        {sections.map((section, index) => (
          <SectionComponent
            key={section.id}
            section={section}
            sectionIndex={index}
            isMobile={isMobile}
            onImageClick={setSelectedImage}
            onExploreClick={setSelectedSection}
          />
        ))}
      </div>

      {/* Single Image Modal */}
      <AnimatePresence>
        {selectedImage && !selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="
                  absolute top-4 right-4 z-10 
                  w-12 h-12 rounded-full 
                  bg-stone-100 hover:bg-stone-900 
                  text-stone-800 hover:text-white
                  transition-all duration-300 
                  flex items-center justify-center 
                  shadow-lg
                "
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 min-h-[50vh]">
                <img
                  src={selectedImage}
                  alt={`${project.title} - ${getFileName(selectedImage)}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-stone-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-stone-900">
                      {getFileName(selectedImage)}
                    </p>
                    <p className="text-sm text-stone-500">
                      {project.title} • {project.category}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-widest hidden md:block">
                    Press ESC or click outside to close
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Gallery Modal */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedSection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSection(null)}
                className="
                  absolute top-4 right-4 z-10 
                  w-12 h-12 rounded-full 
                  bg-stone-100 hover:bg-stone-900 
                  text-stone-800 hover:text-white
                  transition-all duration-300 
                  flex items-center justify-center 
                  shadow-lg
                "
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="p-8 border-b border-stone-200 bg-stone-50">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl">{selectedSection.emoji}</span>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight">
                    {selectedSection.title}
                  </h3>
                </div>
                <p className="text-stone-600 text-lg">
                  {selectedSection.description}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm font-mono text-stone-500">
                    {selectedSection.images.length} items
                  </span>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="p-8 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedSection.images.map((image, index) => (
                    <motion.div
                      key={image}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="
                        group relative aspect-[4/3] 
                        bg-gradient-to-br from-stone-100 to-stone-200 
                        rounded-xl overflow-hidden 
                        cursor-pointer
                        border border-stone-200 hover:border-stone-800
                        transition-all duration-300
                        hover:shadow-lg
                      "
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSection(null);
                        setTimeout(() => setSelectedImage(image), 100);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${selectedSection.title} - ${getFileName(image)}`}
                        loading="lazy"
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs font-mono text-stone-800 truncate">
                          {getFileName(image)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-stone-200 bg-stone-50">
                <div className="flex flex-wrap gap-3">
                  {selectedSection.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm text-stone-700 border border-stone-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandGridShowcase;
