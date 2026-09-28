import React from 'react';
import { 
  Award, 
  MapPin, 
  Phone, 
  BookOpen, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Compass,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { ACADEMY_DATA } from '../types/form';

interface AcademyHighlightsProps {
  onRegisterClick: () => void;
}

export const AcademyHighlights: React.FC<AcademyHighlightsProps> = ({
  onRegisterClick,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-amber-500/20">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3.5 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Premier Competitive Exam Institute • Jorhat, Assam</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
            {ACADEMY_DATA.name}, Jorhat
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Specialized coaching center providing result-oriented training for <strong>ADRE 2.0 (Grade III & IV), SSC CGL/CHSL, Banking (IBPS/SBI), Railway (RRB)</strong> and Assam State Government examinations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>JB Road, Near IndusInd Bank, Malowali, Jorhat</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>9365562718 / 9954410525</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onRegisterClick}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 text-sm font-display flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Your Free Demo Class Seat Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose All In One Academy Jorhat */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Why Students Choose Us</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Built Specifically for Assam Government Exam Aspirants
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg font-display">ADRE & Assam GK Mastery</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In-depth Assam History, Geography, Culture, Polity, and Current Affairs designed strictly per Assam Direct Recruitment exam blueprints.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg font-display">Fast Maths & Reasoning Tricks</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn Vedic speed calculations and logical shortcut tricks to solve 25 quantitative aptitude questions in under 15 minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg font-display">OMR & Offline Mock Test Lab</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Weekly offline OMR mock tests at our Jorhat center simulating real exam pressure with instant performance analysis and state ranking.
            </p>
          </div>
        </div>
      </div>

      {/* Batch Timings & Location Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Class Schedule & Slots</span>
          <h3 className="text-2xl font-bold text-slate-900 font-display">
            Flexible Daily Batches at Malowali, Jorhat
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Whether you are a full-time student at JB College / DCB Girls / CKB College or a working professional, we have dedicated morning and evening slots.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">🌅 Morning Batch</span>
              <span className="font-semibold text-amber-700">8:00 AM – 11:00 AM</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">☀️ Afternoon Batch</span>
              <span className="font-semibold text-amber-700">12:00 PM – 3:00 PM</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">🌆 Evening Batch</span>
              <span className="font-semibold text-amber-700">4:00 PM – 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Location Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <MapPin className="w-5 h-5" />
            <span>Classroom & Center Address</span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-100 text-sm">{ACADEMY_DATA.name}</p>
            <p className="text-slate-300">JB Road, Near IndusInd Bank, Malowali</p>
            <p className="text-slate-300">Jorhat, Assam - 785001</p>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs space-y-2">
            <span className="text-slate-400 block">Counselor Direct Lines:</span>
            <div className="flex flex-wrap gap-2">
              <a href="tel:9365562718" className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg font-bold">
                📞 9365562718
              </a>
              <a href="tel:9954410525" className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg font-bold">
                📞 9954410525
              </a>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://maps.google.com/?q=JB+Road+Near+IndusInd+Bank+Malowali+Jorhat+Assam"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
