import React from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Smartphone,
  Monitor,
  Code2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenCodeViewer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  isDark,
  onToggleTheme,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenCodeViewer,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shopora
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        {!isMobileFrame && (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
                activeTab === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
                activeTab === 'catalog' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              Catalog & Search
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 ${
                activeTab === 'wishlist' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="text-[11px] font-semibold text-rose-500 tabular-nums">
                  ({wishlistCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 ${
                activeTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              Settings & Demo
            </button>
          </nav>
        )}

        {/* Actions Zone */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Flutter Code Explorer Button */}
          <button
            onClick={onOpenCodeViewer}
            title="Inspect Flutter/Dart Code"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flutter Code</span>
          </button>

          {/* Viewport Frame Toggle (Mobile simulator vs Desktop view) */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Switch to Full Web View' : 'Simulate Mobile Phone Frame'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 text-indigo-500" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Shopping Cart button with dynamic badge */}
          <button
            onClick={() => setActiveTab('cart')}
            title="Shopping Cart"
            className="relative p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-up shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
