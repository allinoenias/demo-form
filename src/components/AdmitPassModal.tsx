import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Printer, 
  Share2, 
  MessageCircle, 
  X, 
  Sparkles, 
  ShieldCheck,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { StudentLead, ACADEMY_DATA } from '../types/form';

interface AdmitPassModalProps {
  lead: StudentLead | null;
  onClose: () => void;
  onRegisterAnother: () => void;
}

export const AdmitPassModal: React.FC<AdmitPassModalProps> = ({
  lead,
  onClose,
  onRegisterAnother,
}) => {
  if (!lead) return null;

  const timingDisplay = lead.preferredTiming === 'Custom Timing'
    ? (lead.timingCustom || 'Custom Timing')
    : lead.preferredTiming === 'Morning'
    ? 'Morning (8:00 AM – 11:00 AM)'
    : lead.preferredTiming === 'Afternoon'
    ? 'Afternoon (12:00 PM – 3:00 PM)'
    : 'Evening (4:00 PM – 7:00 PM)';

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello All In One Academy Jorhat! 👋\n\nI just registered for the FREE Demo Class.\n\n` +
    `📋 *Pass ID:* ${lead.id}\n` +
    `👤 *Student Name:* ${lead.fullName}\n` +
    `📞 *Phone:* ${lead.phone}\n` +
    `🎯 *Target Exam:* ${lead.exam}${lead.examOther ? ` (${lead.examOther})` : ''}\n` +
    `⏰ *Preferred Timing:* ${timingDisplay}\n` +
    `📚 *Key Subjects Needed:* ${lead.difficultSubjects.join(', ')}\n\n` +
    `Please confirm my physical seat at your Jorhat Center (JB Road, Near IndusInd Bank, Malowali). Thank you!`
  );

  const whatsappUrl = `https://wa.me/919365562718?text=${whatsappMessage}`;

  const createGoogleCalendarLink = () => {
    const nextSaturday = new Date();
    nextSaturday.setDate(nextSaturday.getDate() + ((6 - nextSaturday.getDay() + 7) % 7 || 7));
    nextSaturday.setHours(lead.preferredTiming === 'Morning' ? 9 : lead.preferredTiming === 'Afternoon' ? 13 : 16, 0, 0);

    const startIso = nextSaturday.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endIso = new Date(nextSaturday.getTime() + 2 * 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(`All In One Academy Free Demo Class - ${lead.exam}`);
    const details = encodeURIComponent(
      `Free Demo Class for ${lead.exam} preparation.\nPass ID: ${lead.id}\nVenue: All In One Academy, JB Road, Near IndusInd Bank, Malowali, Jorhat.\nContact: 9365562718 / 9954410525`
    );
    const location = encodeURIComponent('All In One Academy, JB Road, Near IndusInd Bank, Malowali, Jorhat, Assam');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 sm:p-6 text-white text-center relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg shadow-emerald-950/20">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <span className="bg-emerald-950/40 text-emerald-200 border border-emerald-400/30 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Registration Successful
          </span>

          <h2 className="text-xl sm:text-2xl font-black font-display mt-1.5">
            Demo Class Entry Pass Confirmed!
          </h2>
          <p className="text-emerald-100 text-xs mt-1 max-w-md mx-auto">
            Your seat inquiry is recorded. Show this pass or WhatsApp message at Jorhat center reception.
          </p>
        </div>

        {/* Printable Pass Ticket Card */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1" id="printable-pass">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-gradient-to-b from-amber-50/50 to-white relative">
            
            {/* Header in Ticket */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">OFFICIAL DEMO PASS</span>
                <h3 className="font-black text-slate-900 text-lg font-display">{ACADEMY_DATA.name}</h3>
                <p className="text-[11px] text-slate-500">Jorhat Branch • Government Exam Division</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block">REGISTRATION NO.</span>
                <span className="font-mono font-black text-amber-600 text-base bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300 inline-block">
                  {lead.id}
                </span>
              </div>
            </div>

            {/* Candidate Details */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block text-[10px]">CANDIDATE NAME</span>
                <span className="font-bold text-slate-900 text-sm">{lead.fullName}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block text-[10px]">MOBILE / WHATSAPP</span>
                <span className="font-bold text-slate-900 text-sm">+91 {lead.phone}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block text-[10px]">TARGET EXAM</span>
                <span className="font-bold text-amber-700 text-sm">
                  {lead.exam}{lead.examOther ? ` (${lead.examOther})` : ''}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold block text-[10px]">PREFERRED SLOT</span>
                <span className="font-bold text-slate-900 text-xs truncate block" title={timingDisplay}>
                  {timingDisplay}
                </span>
              </div>
            </div>

            {/* Focus Subjects */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs mb-4">
              <span className="text-slate-400 font-semibold block text-[10px] mb-1">FOCUS / DIFFICULT SUBJECTS</span>
              <div className="flex flex-wrap gap-1.5">
                {lead.difficultSubjects.map((s) => (
                  <span key={s} className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Venue & Location */}
            <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block text-[11px] uppercase">Venue & Classroom Location:</span>
                <p className="text-slate-200 font-medium">{ACADEMY_DATA.address}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Helplines: 9365562718 / 9954410525</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* WhatsApp Confirmation Button (High Conversion) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Confirm Seat with Academy on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print / Save PDF</span>
              </button>

              <a
                href={createGoogleCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Add to Google Cal</span>
              </a>
            </div>
          </div>

          {/* Bottom links */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={onRegisterAnother}
              className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
            >
              ← Register Another Candidate
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
