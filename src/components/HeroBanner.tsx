import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onExplore: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore }) => {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 bg-slate-900">
      {/* Background Hero Image */}
      <img
        src="/src/assets/images/shopora_hero_banner_1792318411078.jpg"
        alt="Shopora Lifestyle Essentials"
        className="w-full h-64 sm:h-80 md:h-96 object-cover opacity-85 hover:scale-105 transition-transform duration-700"
        loading="eager"
      />

      {/* Measured Scrim for WCAG AA readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Curated Autumn Release
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Elegance in Every Detail.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mb-6 line-clamp-2 sm:line-clamp-none">
            Discover authenticated timepieces, contemporary fashion, and everyday audio essentials
            sourced from the FakeStore API collection.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:translate-y-[-1px]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
