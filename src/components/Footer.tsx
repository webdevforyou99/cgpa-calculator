import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Grade<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
            <span className="text-xs text-slate-400">• High-Performance Academic Engine for GitHub Pages</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              Client-Side & Offline Ready <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </span>
            <span>•</span>
            <span>Privacy Guaranteed (Zero Cloud Tracking)</span>
            <span>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
