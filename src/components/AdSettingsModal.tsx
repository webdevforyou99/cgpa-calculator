import React from 'react';
import { DollarSign, Shield } from 'lucide-react';

interface AdSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adsenseClient: string;
  setAdsenseClient: (val: string) => void;
  adsterraKey: string;
  setAdsterraKey: (val: string) => void;
  monetagZoneId: string;
  setMonetagZoneId: (val: string) => void;
  showAds: boolean;
  setShowAds: (val: boolean) => void;
}

export const AdSettingsModal: React.FC<AdSettingsModalProps> = ({
  isOpen,
  onClose,
  adsenseClient,
  setAdsenseClient,
  adsterraKey,
  setAdsterraKey,
  monetagZoneId,
  setMonetagZoneId,
  showAds,
  setShowAds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Ad Network & Monetization Setup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comfortably display Google AdSense, Adsterra, or Monetag
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="my-5 space-y-4">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Enable Ad Containers
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Toggle comfortable, non-intrusive ad zones throughout the website
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAds}
                onChange={(e) => setShowAds(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-750 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Google AdSense */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Google AdSense Publisher ID (e.g. ca-pub-1234567890123456)
            </label>
            <input
              type="text"
              value={adsenseClient}
              onChange={(e) => setAdsenseClient(e.target.value)}
              placeholder="ca-pub-xxxxxxxxxxxxxxxx"
              className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Adsterra */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Adsterra Banner / Native Key / Tag ID
            </label>
            <input
              type="text"
              value={adsterraKey}
              onChange={(e) => setAdsterraKey(e.target.value)}
              placeholder="e.g. 9f4b82c18002a7b8e"
              className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Monetag */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Monetag Zone ID / Tag ID
            </label>
            <input
              type="text"
              value={monetagZoneId}
              onChange={(e) => setMonetagZoneId(e.target.value)}
              placeholder="e.g. 7843912"
              className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Comfort Policy Card */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
              <Shield className="w-4 h-4" /> Comfort & Performance Architecture:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300 pl-1">
              <li><strong>Zero CLS (Cumulative Layout Shift):</strong> Pre-reserved aspect ratio boxes prevent page jumping.</li>
              <li><strong>Dismissible sticky bottom bar:</strong> Allows students to close bottom banners immediately.</li>
              <li><strong>Print-Safe:</strong> All advertisements are automatically hidden when saving PDF or printing transcripts.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
