import React from 'react';
import { 
  BookOpen, 
  MapPin, 
  Phone, 
  Calendar, 
  Users, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles,
  Award,
  Lock,
  Unlock,
  ShieldCheck
} from 'lucide-react';
import { ACADEMY_DATA } from '../types/form';

interface HeaderProps {
  activeTab: 'form' | 'google-form' | 'crm' | 'about';
  setActiveTab: (tab: 'form' | 'google-form' | 'crm' | 'about') => void;
  leadCount: number;
  isGFormConnected?: boolean;
  isAdmin: boolean;
  onLockAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  leadCount,
  isGFormConnected,
  isAdmin,
  onLockAdmin,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      
      {/* Top Notification Bar - Mobile Optimized */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-slate-950 font-semibold text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="bg-slate-950 text-amber-400 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full inline-flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Free Demo
            </span>
            <span className="truncate text-[11px] sm:text-xs">
              Jorhat Offline Batches • Limited Free Demo Seats!
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-black flex-shrink-0">
            <a href="tel:9365562718" className="hover:underline flex items-center gap-1 bg-slate-950/10 px-2 py-0.5 rounded-md">
              <Phone className="w-3 h-3 text-slate-950" /> 9365562718
            </a>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand & Address */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl sm:text-2xl font-display flex-shrink-0 border-2 border-amber-300/30">
              AIO
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-2xl font-black tracking-tight text-white font-display">
                  {ACADEMY_DATA.name}
                </h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md">
                  Jorhat
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[240px] sm:max-w-md">
                <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">{ACADEMY_DATA.landmark}, JB Road, Jorhat</span>
              </p>
            </div>
          </div>

          {/* Admin Lock Status Button on Mobile */}
          {isAdmin && (
            <button
              onClick={onLockAdmin}
              className="md:hidden flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-1 rounded-lg"
              title="Lock Admin Portal"
            >
              <Unlock className="w-3 h-3 text-emerald-400" />
              <span>Admin</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center bg-slate-800/90 p-1 sm:p-1.5 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full w-full md:w-auto justify-start sm:justify-center no-scrollbar">
          {/* Tab 1: Student Registration (Public) */}
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'form'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Student Form</span>
          </button>

          {/* Tab 2: Google Forms Hub (Password Protected) */}
          <button
            onClick={() => setActiveTab('google-form')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'google-form'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Google Forms</span>
            {!isAdmin ? (
              <Lock className="w-3 h-3 text-amber-400 opacity-80" />
            ) : isGFormConnected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ) : null}
          </button>

          {/* Tab 3: Counselor CRM (Password Protected) */}
          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Leads CRM</span>
            {!isAdmin ? (
              <Lock className="w-3 h-3 text-amber-400 opacity-80" />
            ) : (
              <span className="bg-slate-900/80 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-500/30">
                {leadCount}
              </span>
            )}
          </button>

          {/* Tab 4: Academy Details (Public) */}
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Jorhat Center</span>
          </button>

          {/* Desktop Admin Lock/Unlock indicator */}
          {isAdmin && (
            <button
              onClick={onLockAdmin}
              className="hidden md:flex items-center gap-1.5 ml-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
              title="Click to lock admin session"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Unlocked</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
