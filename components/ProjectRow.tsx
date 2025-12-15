import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Project } from '../types';
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectRowProps {
  project: Project;
  isOpen: boolean;
  onClick: () => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({ project, isOpen, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  
  const hasSlides = project.slides && project.slides.length > 0;
  const hasLogoGrid = project.logoGrid && project.logoGrid.length > 0;
  const hasPosterGrid = project.posterGrid && project.posterGrid.length > 0;
  const totalSlides = hasSlides ? project.slides.length : 0;

  const nextSlide = () => {
    if (hasSlides) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (hasSlides) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  return (
    <div ref={ref} className="relative group border-t border-stone-400/50 last:border-b transition-colors duration-500 hover:border-stone-800">
      
      {/* Clickable Header Area */}
      <button 
        onClick={onClick}
        className="w-full text-left py-10 md:py-16 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 focus:outline-none"
      >
        <div className="flex items-baseline gap-6 md:gap-12">
          <span className="text-xs md:text-sm font-mono text-stone-500 group-hover:text-stone-800 transition-colors duration-300">
            [{project.number}]
          </span>
          <h2 className={`text-3xl md:text-6xl font-bold tracking-tighter transition-all duration-500 ${isOpen ? 'text-black translate-x-4' : 'text-stone-800 group-hover:translate-x-4'}`}>
            {project.title}
          </h2>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-sm uppercase tracking-widest text-stone-500 hidden md:block">
            {project.category}
          </span>
          <div className={`p-3 rounded-full border border-stone-400 transition-all duration-500 ${isOpen ? 'bg-black text-white rotate-180' : 'bg-transparent text-stone-800 group-hover:bg-stone-800 group-hover:text-white'}`}>
             <ArrowDownRight size={16} className="md:w-5 md:h-5" />
          </div>
        </div>
        
        {/* Subtle hover background */}
        <div className="absolute inset-0 bg-stone-300/20 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out -z-10" />
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-12 md:pb-16 px-4 md:px-8 flex flex-col lg:flex-row gap-8 md:gap-12">
              
              {/* Poster Grid Section */}
              {hasPosterGrid ? (
                <div className="w-full relative">
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">Poster Collection</h3>
                    <p className="text-sm font-mono text-stone-500 uppercase tracking-widest">Click any poster to view in detail</p>
                  </div>
                  
                  {/* Larger Grid Layout for Posters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {project.posterGrid.map((poster, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.08 }}
                        className="group relative bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 border border-stone-300 hover:border-stone-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedPoster(poster);
                        }}
                      >
                        <img 
                          src={poster} 
                          alt={`Poster ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 block"
                        />
                        
                        {/* Hover Overlay with Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/0 to-stone-900/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Index Badge */}
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-mono text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          {index + 1}
                        </div>

                        {/* View Detail Label */}
                        <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                          View Detail
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-10 flex items-center justify-center gap-8 text-center">
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-stone-800">{project.posterGrid.length}</div>
                      <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mt-1">Total Posters</div>
                    </div>
                    <div className="w-px h-12 bg-stone-300" />
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-stone-800">{project.year}</div>
                      <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mt-1">Year</div>
                    </div>
                  </div>
                </div>
              ) : hasLogoGrid ? (
                <div className="w-full relative">
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">Logo Collection</h3>
                    <p className="text-sm font-mono text-stone-500 uppercase tracking-widest">Click any logo to view in detail</p>
                  </div>
                  
                  {/* Bento Grid Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {project.logoGrid.map((logo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="group relative aspect-square bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border border-stone-300 hover:border-stone-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedLogo(logo);
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <img 
                            src={logo} 
                            alt={`Logo ${index + 1}`} 
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-all duration-300" />
                        
                        {/* Index Badge */}
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[10px] font-mono text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-8 flex items-center justify-center gap-8 text-center">
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-stone-800">{project.logoGrid.length}</div>
                      <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mt-1">Total Designs</div>
                    </div>
                    <div className="w-px h-12 bg-stone-300" />
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-stone-800">{project.year}</div>
                      <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mt-1">Year</div>
                    </div>
                  </div>
                </div>
              ) : hasSlides ? (
                <div className="lg:w-full relative">
                  <div className="relative w-full flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full flex items-center justify-center"
                      >
                        <img 
                          src={project.slides[currentSlide]} 
                          alt={`${project.title} - Slide ${currentSlide + 1}`} 
                          className="w-full h-[60vh] object-contain"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          prevSlide();
                        }}
                        className="p-3 rounded-full border border-stone-400 bg-white hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {project.slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentSlide(index);
                            }}
                            className={`transition-all ${
                              index === currentSlide 
                                ? 'w-8 h-2 bg-stone-800' 
                                : 'w-2 h-2 bg-stone-400 hover:bg-stone-600'
                            } rounded-full`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          nextSlide();
                        }}
                        className="p-3 rounded-full border border-stone-400 bg-white hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all"
                        aria-label="Next slide"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Slide Counter */}
                    <div className="text-center mt-4">
                      <span className="text-sm font-mono text-stone-500">
                        {currentSlide + 1} / {totalSlides}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:w-7/12 relative overflow-hidden rounded-sm">
                  <motion.div
                     initial={{ scale: 1.2, filter: 'blur(10px)' }}
                     animate={{ scale: 1, filter: 'blur(0px)' }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="relative aspect-video lg:aspect-[16/10] overflow-hidden"
                  >
                     <img 
                       src={project.imageUrl} 
                       alt={project.title} 
                       className="w-full h-full object-cover grayscale scale-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform"
                     />
                     
                     {/* Glass Badge on Image */}
                     <div className="absolute bottom-6 left-6 backdrop-blur-2xl bg-gradient-to-r from-white/30 to-white/10 border border-white/20 px-6 py-3 text-white text-[10px] md:text-xs uppercase tracking-widest shadow-lg rounded-full">
                        {project.year} • {project.category}
                     </div>
                  </motion.div>
                </div>
              )}

              {/* Detail Content - Only show when not in slideshow, logo grid, or poster grid mode */}
              {!hasSlides && !hasLogoGrid && !hasPosterGrid && (
                <div className="lg:w-5/12 flex flex-col justify-between">
                  <div>
                     <h3 className="text-lg font-mono text-stone-500 mb-6 uppercase tracking-wider">Project Brief</h3>
                     <p className="text-lg md:text-2xl font-light text-stone-800 leading-relaxed">
                       {project.description}
                     </p>
                     
                     <div className="mt-8 md:mt-12 flex flex-wrap gap-3">
                       {project.tags.map((tag, i) => (
                         <span key={i} className="px-4 py-2 rounded-full border border-stone-800 text-stone-800 text-xs md:text-sm uppercase font-medium hover:bg-stone-800 hover:text-white transition-colors cursor-default">
                           {tag}
                         </span>
                       ))}
                     </div>
                  </div>

                  <div className="mt-8 md:mt-12 pt-8 border-t border-stone-300">
                     <button className="flex items-center gap-2 text-stone-800 font-bold uppercase tracking-wide hover:gap-4 transition-all group/btn text-sm md:text-base">
                       View Case Study <ArrowUpRight className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Detail Modal */}
      <AnimatePresence>
        {selectedLogo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLogo(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full bg-white rounded-lg p-8 md:p-12 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLogo(null);
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-800 hover:text-white transition-all flex items-center justify-center text-xl font-light"
                aria-label="Close"
              >
                ×
              </button>
              
              <div className="flex items-center justify-center min-h-[60vh]">
                <img 
                  src={selectedLogo} 
                  alt="Logo detail" 
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm font-mono text-stone-500 uppercase tracking-widest">
                  Click outside or press × to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poster Detail Modal */}
      <AnimatePresence>
        {selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/95 backdrop-blur-lg"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPoster(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl w-full bg-white rounded-xl p-6 md:p-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPoster(null);
                }}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-stone-200 hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center text-2xl font-light z-10 shadow-lg"
                aria-label="Close"
              >
                ×
              </button>
              
              <div className="flex items-center justify-center">
                <img 
                  src={selectedPoster} 
                  alt="Poster detail" 
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
                />
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm font-mono text-stone-500 uppercase tracking-widest">
                  Click outside or press × to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};