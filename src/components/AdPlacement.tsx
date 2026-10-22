import React, { useEffect, useRef } from 'react';
import { Sparkles, Info } from 'lucide-react';

export type AdSlotType = 
  | 'banner-728x90'     // Leaderboard
  | 'banner-300x250'    // Medium Rectangle
  | 'banner-native'     // Native in-feed banner
  | 'sticky-bottom';    // Bottom anchor banner

interface AdPlacementProps {
  slotType: AdSlotType;
  adsterraKey?: string;
  adsenseClient?: string;
  adsenseSlot?: string;
  monetagZoneId?: string;
  className?: string;
  placeholderLabel?: string;
}

/**
 * Universal Comfortable Ad Component
 * Seamlessly integrates AdSense, Adsterra, or Monetag code tags
 * without breaking user experience, shifting layout, or blocking UI.
 */
export const AdPlacement: React.FC<AdPlacementProps> = ({
  slotType,
  adsterraKey,
  adsenseClient,
  adsenseSlot,
  monetagZoneId,
  className = '',
  placeholderLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // If real AdSense is present, push ad
  useEffect(() => {
    if (adsenseClient && adsenseSlot) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.debug('AdSense load queue:', e);
      }
    }
  }, [adsenseClient, adsenseSlot]);

  // Dimension styling based on ad format standard
  const getContainerDimensions = () => {
    switch (slotType) {
      case 'banner-728x90':
        return 'w-full max-w-[728px] min-h-[90px] mx-auto';
      case 'banner-300x250':
        return 'w-full max-w-[300px] min-h-[250px] mx-auto';
      case 'sticky-bottom':
        return 'w-full max-w-[728px] min-h-[60px] sm:min-h-[90px] mx-auto';
      case 'banner-native':
      default:
        return 'w-full min-h-[100px]';
    }
  };

  const isConfigured = Boolean(adsenseClient || adsterraKey || monetagZoneId);

  return (
    <div className={`ad-container relative my-4 flex flex-col items-center justify-center transition-all ${className}`}>
      {/* Friendly Sponsored Disclosure Header */}
      <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1">
        <span className="flex items-center gap-1 font-semibold">
          <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> Sponsored Space
        </span>
        <span className="text-[9px] hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer flex items-center gap-0.5">
          <Info className="w-2.5 h-2.5" /> Ad
        </span>
      </div>

      <div
        ref={containerRef}
        className={`${getContainerDimensions()} relative rounded-2xl bg-slate-100/70 dark:bg-slate-850/60 border border-dashed border-slate-250 dark:border-slate-750 flex flex-col items-center justify-center p-3 text-center overflow-hidden shadow-2xs backdrop-blur-xs`}
      >
        {/* Real AdSense Slot */}
        {adsenseClient && adsenseSlot ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={adsenseClient}
            data-ad-slot={adsenseSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : null}

        {/* Real Adsterra / Monetag Container Tag */}
        {adsterraKey ? (
          <div id={`at-tag-${adsterraKey}`} className="w-full h-full flex items-center justify-center" />
        ) : null}

        {/* Clean, Non-intrusive Fallback Placeholder (when no live script key is provided) */}
        {!isConfigured && (
          <div className="py-2.5 px-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{placeholderLabel || 'Adsterra / Monetag / Google AdSense Ready'}</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
              Non-intrusive container formatted for high CTR with 0% layout shift (CLS).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
