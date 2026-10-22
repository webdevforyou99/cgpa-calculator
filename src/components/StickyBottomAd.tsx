import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface StickyBottomAdProps {
  adsenseClient?: string;
  adsenseSlot?: string;
  adsterraKey?: string;
  monetagZoneId?: string;
}

export const StickyBottomAd: React.FC<StickyBottomAdProps> = ({
  adsenseClient,
  adsenseSlot,
  adsterraKey: _adsterraKey,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Ad Space */}
        <div className="flex-1 flex items-center justify-center min-h-[50px] sm:min-h-[60px] text-center overflow-hidden">
          {adsenseClient && adsenseSlot ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '728px', height: '60px' }}
              data-ad-client={adsenseClient}
              data-ad-slot={adsenseSlot}
            />
          ) : (
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 py-1">
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                SPONSORED
              </span>
              <p className="font-medium text-xs">
                🎓 Study Abroad & Graduate Scholarships: Find Universities accepting Bangladesh UGC & Global CGPA.
              </p>
              <a
                href="#target-planner"
                className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Close Button with comfort tooltip */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Dismiss ad banner"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
