import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  isMobileFrame,
  onToggleFrame,
  children,
}) => {
  if (!isMobileFrame) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 transition-colors duration-200">
      {/* Mobile Frame Container */}
      <div className="relative w-full max-w-[420px] h-[880px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
        </div>

        {/* Screen Bezel */}
        <div className="relative flex-1 bg-slate-50 dark:bg-slate-950 rounded-[38px] overflow-hidden flex flex-col border border-slate-800">
          {/* Mobile Status Bar */}
          <div className="h-8 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between px-6 text-[11px] font-semibold text-slate-600 dark:text-slate-400 select-none z-30 shrink-0">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
                <div className="w-3 h-full bg-current rounded-xs" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto flex flex-col relative">
            {children}
          </div>

          {/* Bottom Home Indicator */}
          <div className="h-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
