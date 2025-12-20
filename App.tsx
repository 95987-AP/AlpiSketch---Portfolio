import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { ProjectRow } from './components/ProjectRow';
import { GlassCard } from './components/GlassCard';
import { Navigation } from './components/Navigation';
import { PROJECTS } from './constants';
import { MoveRight } from 'lucide-react';
import LogoSvg from './Logo.svg';

function App() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleProject = (id: string) => {
    setActiveProject(prev => prev === id ? null : id);
  };

  return (
    <div className="relative text-stone-900 selection:bg-stone-900 selection:text-white bg-[#EBEAE5]">
      
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-6 flex justify-between items-center z-50 pointer-events-none mix-blend-difference text-white">
        <div className="pointer-events-auto flex items-center gap-2">
           <img src={LogoSvg} alt="Logo" className="w-6 h-6" />
           <span className="font-bold tracking-tight text-xl">ALPISKETCH.</span>
        </div>
        <div className="pointer-events-auto">
          <button 
            onClick={() => setMenuOpen(true)}
            className="text-sm font-mono uppercase tracking-widest hover:underline decoration-1 underline-offset-4"
          >
            Menu
          </button>
        </div>
      </nav>

      {/* Navigation Menu */}
      <Navigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="relative z-10" id="home">
        <Hero />

        {/* Selected Works Header */}
        <section id="work" className="px-6 md:px-12 lg:px-24 pt-8 md:pt-12 pb-6 md:pb-8">
           <div className="flex items-center gap-4 mb-6 md:mb-8">
             <div className="h-[1px] w-12 bg-stone-900"></div>
             <h3 className="text-sm font-mono uppercase tracking-widest text-stone-900">Selected Works</h3>
           </div>
        </section>

        {/* Accordion List */}
        <section className="pb-16 md:pb-24 min-h-[50vh]">
          <div className="w-full">
            {PROJECTS.map((project) => (
              <ProjectRow 
                key={project.id} 
                project={project} 
                isOpen={activeProject === project.id}
                onClick={() => toggleProject(project.id)}
              />
            ))}
             <div className="border-t border-stone-400/50 w-full" />
          </div>
        </section>

        {/* Philosophy / About Section with Glass Card */}
        <section id="about" className="px-6 md:px-12 lg:px-24 py-20 md:py-32 bg-stone-200 relative overflow-hidden">
           {/* Decorative Background Blob */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-stone-300 rounded-full blur-[120px] opacity-60 pointer-events-none" />

           <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 md:gap-16 relative z-10 items-center justify-center">
              <GlassCard className="p-8 md:p-12 lg:p-16 aspect-auto flex flex-col justify-between min-h-[300px] md:min-h-[400px] max-w-2xl mx-auto">
                 <div className="space-y-6">
                    <div className="w-12 h-12 rounded-full border border-stone-800/20 flex items-center justify-center">
                       <span className="font-mono text-lg">AP</span>
                    </div>
                    <p className="text-xl md:text-2xl font-serif italic text-stone-700">
                       "Simplicity is the ultimate sophistication. It is not about lack of content, but about the abundance of clarity."
                    </p>
                 </div>
                 <div className="flex justify-between items-end mt-8 md:mt-0">
                    <div className="flex flex-col">
                       <span className="text-xs font-mono uppercase text-stone-500 mb-1">Aleksander Pietrzak</span>
                       <span className="font-bold text-stone-800">Warsaw, PL</span>
                    </div>
                    <MoveRight className="text-stone-800" />
                 </div>
              </GlassCard>
           </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="contact" className="bg-[#E5E4DE] text-stone-800 py-20 px-6 md:px-12 lg:px-24 border-t border-stone-300 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-12 mb-12 border-b border-stone-300">
            <div>
               <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-stone-800 mb-4">
                  Let's Talk.
               </h2>
               <p className="text-lg text-stone-600 font-light max-w-sm">
                  Have a project in mind? We are currently accepting new commissions.
               </p>
            </div>
            <div className="mt-8 md:mt-0">
                <a href="mailto:sketchalpi@gmail.com" className="text-xl md:text-2xl font-mono underline underline-offset-4 decoration-1 hover:decoration-2 transition-all">sketchalpi@gmail.com</a>
            </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs md:text-sm uppercase tracking-widest text-stone-500">
            <div className="flex flex-col gap-4">
               <span className="text-stone-800 font-bold mb-2">Socials</span>
               <a href="#" className="hover:text-stone-900 transition-colors">Instagram</a>
               <a href="#" className="hover:text-stone-900 transition-colors">Twitter / X</a>
               <a href="#" className="hover:text-stone-900 transition-colors">LinkedIn</a>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-stone-800 font-bold mb-2">Sitemap</span>
               <a href="#" className="hover:text-stone-900 transition-colors">Home</a>
               <a href="#" className="hover:text-stone-900 transition-colors">Work</a>
               <a href="#" className="hover:text-stone-900 transition-colors">Profile</a>
            </div>
            <div className="col-span-2 md:col-span-2 flex flex-col justify-end text-left md:text-right mt-8 md:mt-0">
               <span>© 2024 Aleksander Pietrzak / AlpiSketch Design. All Rights Reserved.</span>
            </div>
         </div>
      </footer>
    </div>
  );
}

export default App;