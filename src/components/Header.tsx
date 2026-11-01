import React from 'react';
import { Sparkles, BarChart3, HelpCircle, ExternalLink } from 'lucide-react';
import { getGoogleSheetUrl } from '../services/sheetService.ts';

interface HeaderProps {
  currentTab: 'survey' | 'tracker';
  onSelectTab: (tab: 'survey' | 'tracker') => void;
  onOpenGuide: () => void;
  isLiveConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenGuide,
  isLiveConnected,
}) => {
  const sheetUrl = getGoogleSheetUrl();

  return (
    <header className="sticky top-0 z-30 bg-[#FBF5EE]/90 backdrop-blur-md border-b border-[#DADFD3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Slogan */}
        <div 
          onClick={() => onSelectTab('survey')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#CE9893] text-[#1F1F1D] flex items-center justify-center font-serif text-xl font-bold shadow-sm transition-transform group-hover:scale-105">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#1F1F1D]">
                ELOT
              </span>
              <span className="text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#EAD4D2] text-[#713D38] font-medium hidden sm:inline-block">
                Homewear
              </span>
            </div>
            <p className="text-xs text-[#713D38] hidden sm:block">
              Khảo sát phong cách đồ bộ độc quyền
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          <button
            onClick={() => onSelectTab('survey')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'survey'
                ? 'bg-[#CE9893] text-[#1F1F1D] shadow-sm'
                : 'text-[#505B3E] hover:bg-[#EBEEE8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Khảo sát</span>
          </button>

          <button
            onClick={() => onSelectTab('tracker')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative ${
              currentTab === 'tracker'
                ? 'bg-[#819266] text-white shadow-sm'
                : 'text-[#505B3E] hover:bg-[#EBEEE8]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">Theo dõi</span>
            <span className="inline xs:hidden">Số liệu</span>
            {isLiveConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-ping" />
            )}
          </button>

          <button
            onClick={onOpenGuide}
            title="Hướng dẫn gắn Google Sheet & Deploy"
            className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#505B3E] hover:bg-[#EBEEE8] border border-[#DADFD3] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#819266]" />
            <span className="hidden md:inline">Cài đặt Sheets</span>
          </button>

          {sheetUrl && sheetUrl !== 'https://docs.google.com/spreadsheets' && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Mở Google Sheet dữ liệu"
              className="p-2 rounded-xl text-[#505B3E] hover:bg-[#EBEEE8] border border-[#DADFD3] transition-colors hidden lg:flex items-center"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
