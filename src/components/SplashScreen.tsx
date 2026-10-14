import React, { useEffect, useState } from 'react';
import { NEXORA_ASSETS } from '../data/mockData';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  autoAdvance?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, autoAdvance = true }) => {
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!autoAdvance) return;

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onEnter, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoAdvance, onEnter]);

  return (
    <div id="nexora-splash-screen" className="fixed inset-0 z-50 bg-[#fdf8f8] text-[#1c1b1b] overflow-hidden flex flex-col justify-between select-none">
      {/* Background Layer with Hero Image & Soft Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-fade-in transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url('${NEXORA_ASSETS.heroPlinth}')` }}
        />
        <div className="absolute inset-0 bg-[#fdf8f8]/60 backdrop-blur-[3px]" />
      </div>

      {/* Top Bar with Tag */}
      <div className="relative z-10 w-full flex items-center justify-between p-6 md:p-10">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#594047] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#8e004b]" />
          <span>Ayurvedic Hair Spa & Luxury Salons</span>
        </div>
        <button
          onClick={onEnter}
          className="text-xs uppercase tracking-[0.2em] text-[#8e004b] hover:text-[#e6007e] font-semibold flex items-center space-x-1.5 transition-colors group cursor-pointer"
        >
          <span>Skip to Salon</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Center Content Canvas: Logo & Tagline Cluster */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12">
        <div className="flex flex-col items-center">
          {/* Nexora Circular Emblem */}
          <div className="w-44 h-44 md:w-56 md:h-56 animate-logo-reveal rounded-full overflow-hidden bg-white border border-[#E8E8E8] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center mb-6 p-6 transition-transform hover:scale-105 duration-700">
            <img 
              alt="Nexora Monogram" 
              className="w-full h-full object-contain"
              src={NEXORA_ASSETS.logo}
            />
          </div>

          {/* Sub Brand Label */}
          <div className="text-xs md:text-sm uppercase tracking-[0.35em] text-[#8e004b] font-semibold mb-2 animate-tagline-fade">
            NEXORA
          </div>

          {/* Tagline */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8e004b] tracking-[0.04em] max-w-xl animate-tagline-fade leading-relaxed">
            Salon जा रहे हो? NEXORA किया क्या?
          </h1>
          
          <p className="mt-2 text-xs md:text-sm text-[#594047] max-w-md tracking-normal font-normal animate-tagline-fade opacity-85">
            Where authentic Ayurveda meets modern haircut styling & 100% original beauty products.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <button
              id="enter-sanctuary-btn"
              onClick={onEnter}
              className="px-8 py-3.5 bg-[#8e004b] hover:bg-[#b90064] text-white rounded-lg text-xs md:text-sm uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Enter Nexora Salon</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Indicator Area */}
      <div className="relative z-10 flex flex-col items-center justify-center pb-10 px-6">
        <div className="w-56 h-[2px] bg-[#E8E8E8] rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[#8e004b] transition-all duration-150 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-3 text-[11px] text-[#594047] uppercase tracking-[0.25em] font-medium animate-tagline-fade opacity-80">
          Loading Nexora... {progressPercent}%
        </p>
      </div>
    </div>
  );
};
