import React from 'react';
import { MapPin, Phone, Mail, Award, ArrowUp, Sparkles, MessageCircle } from 'lucide-react';
import { ACADEMY_DATA } from '../types/form';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-slate-950 text-xl font-display">
                AIO
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display">
                  {ACADEMY_DATA.name}, Jorhat
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  Govt. Exam Preparation & Mentorship Center
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Empowering Upper Assam youth for ADRE, SSC CGL/CHSL, Banking (SBI/IBPS/RRB), Railway, and State Government competitive exams with top faculty, daily test practice, and personalized guidance.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-amber-300 font-semibold">
                <Sparkles className="w-3 h-3" /> Free Demo Class Registration
              </span>
            </div>
          </div>

          {/* Col 2: Exams Offered */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm font-display uppercase tracking-wider">
              Exam Batches
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-amber-400 cursor-pointer">🎯 ADRE 2.0 (Grade III & IV)</li>
              <li className="hover:text-amber-400 cursor-pointer">🏛️ SSC (CGL / CHSL / MTS / GD)</li>
              <li className="hover:text-amber-400 cursor-pointer">🏦 Banking (IBPS & SBI PO / Clerk)</li>
              <li className="hover:text-amber-400 cursor-pointer">🚆 Railway (RRB NTPC / Group D)</li>
              <li className="hover:text-amber-400 cursor-pointer">🦏 Assam Police & State Govt</li>
            </ul>
          </div>

          {/* Col 3: Contact & Center */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm font-display uppercase tracking-wider">
              Jorhat Center
            </h4>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>JB Road, Near IndusInd Bank, Malowali, Jorhat, Assam</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="tel:9365562718" className="hover:text-white font-semibold">9365562718</a> / 
                <a href="tel:9954410525" className="hover:text-white font-semibold">9954410525</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>aallinoneias@gmail.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {ACADEMY_DATA.name}, Jorhat. All rights reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
