import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Phone, 
  GraduationCap, 
  Target, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  BookOpen, 
  HelpCircle, 
  Share2, 
  Compass, 
  Flame, 
  Layers, 
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Award,
  Calendar
} from 'lucide-react';
import { 
  ExamType, 
  PreparationLevel, 
  DifficultSubject, 
  PreparationChallenge, 
  ClassTiming, 
  DemoAttendance, 
  ReferralSource, 
  StudentLead, 
  ACADEMY_DATA 
} from '../types/form';
import { saveLead } from '../services/leadStorage';
import { saveLeadToFirebase } from '../services/firestoreService';

interface RegistrationFormProps {
  onSubmitSuccess: (lead: StudentLead) => void;
  onOpenGFormsSync?: () => void;
}

const EXAM_OPTIONS: { id: ExamType; label: string; badge: string; popular?: boolean }[] = [
  { id: 'ADRE', label: 'ADRE 2.0 (Grade III & IV)', badge: '🔥 Most Popular in Assam', popular: true },
  { id: 'SSC', label: 'SSC (CGL, CHSL, MTS, GD)', badge: 'Central Govt Exams' },
  { id: 'Banking', label: 'Banking (IBPS, SBI PO/Clerk, RRB)', badge: 'Speed & Quant Focus' },
  { id: 'Railway', label: 'Railway (RRB NTPC, Group D, ALP)', badge: 'Technical & Non-Tech' },
  { id: 'Assam Government Exams', label: 'Assam Government Exams (Police, Forest, APSC)', badge: 'State Services' },
  { id: 'Other', label: 'Other Government Exams', badge: 'Custom Guidance' },
];

const PREP_LEVELS: { id: PreparationLevel; label: string; desc: string }[] = [
  { id: 'Just Starting', label: 'Just Starting', desc: 'Planning to start syllabus from zero basics' },
  { id: 'Beginner', label: 'Beginner', desc: 'Know the syllabus, need foundational clarity' },
  { id: 'Preparing for a few months', label: 'Preparing for a few months', desc: 'Completed basic concepts, seeking strategy & speed' },
  { id: 'Already appearing for exams', label: 'Already appearing for exams', desc: 'Given prelims/mains, targeting final cutoff & rank' },
];

const SUBJECTS_LIST: { id: DifficultSubject; icon: string; highlight?: boolean }[] = [
  { id: 'Maths', icon: '📐', highlight: true },
  { id: 'Reasoning', icon: '🧩', highlight: true },
  { id: 'English', icon: '📖' },
  { id: 'GK', icon: '🌍' },
  { id: 'Current Affairs', icon: '📰' },
  { id: 'Assam GK', icon: '🦏', highlight: true },
  { id: 'CSAT', icon: '📊' },
];

const CHALLENGES_LIST: { id: PreparationChallenge; tip: string }[] = [
  { id: "Don't know where to start", tip: 'Need structured step-by-step roadmap' },
  { id: 'Lack of proper guidance', tip: 'Need direct mentor support & doubt clearance' },
  { id: 'Difficulty maintaining consistency', tip: 'Need scheduled daily offline/online routine' },
  { id: 'Weak in some subjects', tip: 'Need special basic-to-advanced subject modules' },
  { id: 'Need regular tests/practice', tip: 'Need weekly mock tests with Assam ranking' },
  { id: 'Time management', tip: 'Need calculation tricks and exam-hall time strategy' },
];

const TIMINGS_LIST: { id: ClassTiming; time: string; badge: string; icon?: string }[] = [
  { id: 'Morning', time: '8:00 AM – 11:00 AM', badge: 'Best for Fresh Focus', icon: '🌅' },
  { id: 'Afternoon', time: '12:00 PM – 3:00 PM', badge: 'Flexible College Slot', icon: '☀️' },
  { id: 'Evening', time: '4:00 PM – 7:00 PM', badge: 'Working/Post-College Slot', icon: '🌆' },
  { id: 'Custom Timing', time: 'Specific Time / Weekends', badge: 'Customizable Slot', icon: '⏱️' },
];

const CUSTOM_TIMING_SUGGESTIONS = [
  'Weekend Only (Sat-Sun 10 AM - 1 PM)',
  'Early Morning (6:30 AM - 8:00 AM)',
  'Late Evening (6:00 PM - 8:30 PM)',
  'Sunday Full Day Masterclass',
];

const DEMO_OPTIONS: { id: DemoAttendance; label: string; desc: string }[] = [
  { id: 'Yes, I want to attend', label: '✅ Yes, I want to attend FREE Demo Class', desc: 'Reserve my physical seat at Jorhat center' },
  { id: 'I want more information', label: 'ℹ️ I want more information first', desc: 'Request phone consultation & syllabus counseling' },
];

const SOURCES_LIST: ReferralSource[] = [
  'Facebook',
  'Instagram',
  'YouTube',
  'WhatsApp',
  'Friend/Student',
  'Other',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmitSuccess,
  onOpenGFormsSync,
}) => {
  // Mobile step state: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'wizard' | 'single'>('wizard');

  // Form Field State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [exam, setExam] = useState<ExamType>('ADRE');
  const [examOther, setExamOther] = useState('');
  const [prepLevel, setPrepLevel] = useState<PreparationLevel>('Beginner');
  const [difficultSubjects, setDifficultSubjects] = useState<DifficultSubject[]>(['Maths', 'Assam GK']);
  const [challenges, setChallenges] = useState<PreparationChallenge[]>(['Lack of proper guidance']);
  const [preferredTiming, setPreferredTiming] = useState<ClassTiming>('Morning');
  const [timingCustom, setTimingCustom] = useState('');
  const [demoAttendance, setDemoAttendance] = useState<DemoAttendance>('Yes, I want to attend');
  const [source, setSource] = useState<ReferralSource>('Facebook');
  const [sourceOther, setSourceOther] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSubject = (subject: DifficultSubject) => {
    if (difficultSubjects.includes(subject)) {
      if (difficultSubjects.length > 1) {
        setDifficultSubjects(difficultSubjects.filter(s => s !== subject));
      }
    } else {
      setDifficultSubjects([...difficultSubjects, subject]);
    }
  };

  const toggleChallenge = (challenge: PreparationChallenge) => {
    if (challenges.includes(challenge)) {
      if (challenges.length > 1) {
        setChallenges(challenges.filter(c => c !== challenge));
      }
    } else {
      setChallenges([...challenges, challenge]);
    }
  };

  const validateStep = (step: number) => {
    const errs: { [key: string]: string } = {};

    if (step === 1 || viewMode === 'single') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        errs.fullName = 'Please enter your full name (min 2 characters)';
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        errs.phone = 'Please enter a valid 10-digit WhatsApp number';
      }
    }

    if (step === 2 || viewMode === 'single') {
      if (exam === 'Other' && !examOther.trim()) {
        errs.examOther = 'Please specify the exam name';
      }
    }

    if (step === 3 || viewMode === 'single') {
      if (difficultSubjects.length === 0) {
        errs.difficultSubjects = 'Please choose at least one subject';
      }
      if (challenges.length === 0) {
        errs.challenges = 'Please select at least one challenge';
      }
    }

    if (step === 4 || viewMode === 'single') {
      if (preferredTiming === 'Custom Timing' && !timingCustom.trim()) {
        errs.timingCustom = 'Please specify your custom timing';
      }
      if (source === 'Other' && !sourceOther.trim()) {
        errs.sourceOther = 'Please specify where you heard about us';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Celebratory Confetti Burst
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#3b82f6', '#10b981'],
      });

      const newLeadData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        exam,
        ...(exam === 'Other' ? { examOther: examOther.trim() } : {}),
        prepLevel,
        difficultSubjects,
        challenges,
        preferredTiming,
        ...(preferredTiming === 'Custom Timing' ? { timingCustom: timingCustom.trim() } : {}),
        demoAttendance,
        source,
        ...(source === 'Other' ? { sourceOther: sourceOther.trim() } : {}),
      };

      const saved = saveLead(newLeadData);
      
      // Async write to Firestore cloud database
      saveLeadToFirebase(saved).catch((err) => {
        console.warn('Firestore sync status:', err);
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onSubmitSuccess(saved);
      }, 400);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const cleanDigits = phone.replace(/\D/g, '');

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
      
      {/* Google Form Style Main Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden transition-all">
        
        {/* Top Decorative Brand Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-7 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 bg-slate-950/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-amber-200 border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                <span>All In One Academy • Jorhat</span>
              </div>

              {/* View Mode Switcher for Mobile */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'wizard' ? 'single' : 'wizard')}
                className="text-[10px] sm:text-xs bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg font-bold text-amber-100 transition-colors"
              >
                {viewMode === 'wizard' ? '📄 Full Page View' : '⚡ Step-by-Step View'}
              </button>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight font-display leading-tight text-white">
              🎯 Government Exam Preparation – Free Demo Class Registration
            </h1>

            <p className="text-amber-50 text-xs sm:text-sm leading-relaxed opacity-95">
              Preparing for <strong>ADRE, SSC, Banking, Railway</strong> or other government exams? Register for our Free Demo Class and learn the right strategy, practice methods and preparation approach.
            </p>

            {/* Quick Venue Badge */}
            <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-amber-100">
              <span className="flex items-center gap-1">
                📍 {ACADEMY_DATA.landmark}, JB Road, Jorhat
              </span>
              <span className="font-bold text-amber-200">
                📞 9365562718 / 9954410525
              </span>
            </div>
          </div>
        </div>

        {/* Step Progress Bar (when in wizard mode) */}
        {viewMode === 'wizard' && (
          <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center">
                  {currentStep}
                </span>
                <span>
                  {currentStep === 1 && 'Step 1: Your Contact Info'}
                  {currentStep === 2 && 'Step 2: Target Exam & Prep Level'}
                  {currentStep === 3 && 'Step 3: Difficult Subjects & Challenges'}
                  {currentStep === 4 && 'Step 4: Batch Timing & Confirmation'}
                </span>
              </span>
              <span className="text-amber-700 text-[11px]">
                {currentStep} of 4 ({currentStep * 25}%)
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${currentStep * 25}%` }}
              ></div>
            </div>

            {/* Step Quick Jump Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mt-2.5">
              {[
                { step: 1, label: 'Contact' },
                { step: 2, label: 'Exam' },
                { step: 3, label: 'Subjects' },
                { step: 4, label: 'Slot' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.step}
                  onClick={() => {
                    if (s.step < currentStep || validateStep(currentStep)) {
                      setCurrentStep(s.step);
                    }
                  }}
                  className={`py-1 rounded-md text-[10px] font-bold text-center transition-all ${
                    currentStep === s.step
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : s.step < currentStep
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {s.label} {s.step < currentStep && '✓'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          
          {/* ================= STEP 1: CONTACT INFO ================= */}
          {(viewMode === 'single' || currentStep === 1) && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Question 1: Full Name */}
              <div className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                errors.fullName 
                  ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-200' 
                  : 'bg-slate-50/70 border-slate-200 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200'
              }`}>
                <label className="block text-slate-900 font-bold text-sm sm:text-base mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
                    <span>Full Name</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Short answer</span>
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 mb-2.5 ml-7 sm:ml-8">
                  Enter your name for the Demo Class Admit Pass
                </p>
                
                <div className="ml-0 sm:ml-8 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="e.g. Pranjal Saikia / Ananya Dutta"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-medium min-h-[48px]"
                    required
                  />
                </div>
                {errors.fullName && (
                  <p className="text-rose-600 text-xs font-semibold mt-2 ml-0 sm:ml-8 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Question 2: WhatsApp / Mobile Number */}
              <div className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                errors.phone 
                  ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-200' 
                  : 'bg-slate-50/70 border-slate-200 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200'
              }`}>
                <label className="block text-slate-900 font-bold text-sm sm:text-base mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
                    <span>WhatsApp / Mobile Number</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    cleanDigits.length === 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cleanDigits.length}/10 digits {cleanDigits.length === 10 && '✓'}
                  </span>
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 mb-2.5 ml-7 sm:ml-8">
                  For demo class confirmation & Jorhat center directions
                </p>
                
                <div className="ml-0 sm:ml-8 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 font-bold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    maxLength={10}
                    placeholder="10-digit WhatsApp number (e.g. 9365562718)"
                    className="w-full pl-14 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-medium tracking-wide min-h-[48px]"
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-rose-600 text-xs font-semibold mt-2 ml-0 sm:ml-8 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 2: EXAM TARGET & LEVEL ================= */}
          {(viewMode === 'single' || currentStep === 2) && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Question 3: Which government exam are you preparing for? */}
              <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="block text-slate-900 font-bold text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
                    <span>Which government exam are you preparing for?</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </span>
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 ml-7 sm:ml-8">
                  Tap to choose your primary exam aim
                </p>

                <div className="ml-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXAM_OPTIONS.map((item) => {
                    const isSelected = exam === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setExam(item.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-2 min-h-[54px] cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="exam"
                            checked={isSelected}
                            onChange={() => setExam(item.id)}
                            className="mt-1 text-amber-600 focus:ring-amber-500 h-4 w-4"
                          />
                          <div>
                            <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-amber-950' : 'text-slate-800'}`}>
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {exam === 'Other' && (
                  <div className="ml-0 sm:ml-8 mt-2">
                    <input
                      type="text"
                      value={examOther}
                      onChange={(e) => setExamOther(e.target.value)}
                      placeholder="Type exam name (e.g. APSC CCE, Forest Guard, Postal)"
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 min-h-[44px]"
                    />
                    {errors.examOther && (
                      <p className="text-rose-600 text-xs font-semibold mt-1">{errors.examOther}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Question 4: Current preparation level */}
              <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="block text-slate-900 font-bold text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
                    <span>What is your current preparation level?</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </span>
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 ml-7 sm:ml-8">
                  Helps Jorhat mentors adapt the demo class standard
                </p>

                <div className="ml-0 sm:ml-8 space-y-2">
                  {PREP_LEVELS.map((level) => {
                    const isSelected = prepLevel === level.id;
                    return (
                      <button
                        type="button"
                        key={level.id}
                        onClick={() => setPrepLevel(level.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 min-h-[48px] cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="prepLevel"
                            checked={isSelected}
                            onChange={() => setPrepLevel(level.id)}
                            className="text-amber-600 focus:ring-amber-500 h-4 w-4 flex-shrink-0"
                          />
                          <div>
                            <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-amber-950' : 'text-slate-800'}`}>
                              {level.label}
                            </span>
                            <span className="text-[10px] text-slate-500 block">{level.desc}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-600 font-bold flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: DIFFICULT SUBJECTS & CHALLENGES ================= */}
          {(viewMode === 'single' || currentStep === 3) && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Question 5: Which subjects are difficult for you? */}
              <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">5</span>
                    <span>Which subjects are difficult for you?</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Multi-select
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 ml-7 sm:ml-8">
                  Tap to select subjects where you need shortcut formulas & tricks
                </p>

                <div className="ml-0 sm:ml-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUBJECTS_LIST.map((sub) => {
                    const isSelected = difficultSubjects.includes(sub.id);
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => toggleSubject(sub.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between min-h-[48px] cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
                          <span>{sub.icon}</span>
                          <span>{sub.id}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-950 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {errors.difficultSubjects && (
                  <p className="text-rose-600 text-xs font-semibold ml-0 sm:ml-8">{errors.difficultSubjects}</p>
                )}
              </div>

              {/* Question 6: What is your biggest preparation challenge? */}
              <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">6</span>
                    <span>What is your biggest preparation challenge?</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Select challenges</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 ml-7 sm:ml-8">
                  Faculty will address these specific bottlenecks during the demo
                </p>

                <div className="ml-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHALLENGES_LIST.map((item) => {
                    const isSelected = challenges.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleChallenge(item.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 min-h-[48px] cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-amber-500 border-amber-600 text-slate-950 font-bold' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-amber-950' : 'text-slate-800'}`}>
                            {item.id}
                          </span>
                          <span className="text-[10px] text-slate-500 block">{item.tip}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.challenges && (
                  <p className="text-rose-600 text-xs font-semibold ml-0 sm:ml-8">{errors.challenges}</p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 4: TIMING & DEMO PREFERENCES ================= */}
          {(viewMode === 'single' || currentStep === 4) && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Question 7: Preferred class timing */}
              <div className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                errors.timingCustom
                  ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-slate-50/70 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">7</span>
                    <span>Preferred class timing:</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Customizable
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mb-3 ml-7 sm:ml-8">
                  Choose regular batch or customize your specific timing slot
                </p>

                <div className="ml-0 sm:ml-8 grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {TIMINGS_LIST.map((t) => {
                    const isSelected = preferredTiming === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => {
                          setPreferredTiming(t.id);
                          if (errors.timingCustom) setErrors({ ...errors, timingCustom: '' });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[72px] cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{t.icon}</span>
                          <span className={`font-bold text-xs ${isSelected ? 'text-amber-950' : 'text-slate-800'}`}>
                            {t.id}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-1">
                          {t.time}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Timing Input Box */}
                {preferredTiming === 'Custom Timing' && (
                  <div className="ml-0 sm:ml-8 mt-3 p-3.5 bg-white rounded-xl border border-amber-300 space-y-2.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Specify your custom timing / batch slot:</span>
                    </label>

                    <input
                      type="text"
                      value={timingCustom}
                      onChange={(e) => {
                        setTimingCustom(e.target.value);
                        if (errors.timingCustom) setErrors({ ...errors, timingCustom: '' });
                      }}
                      placeholder="e.g. Weekend Batch (Sat-Sun 10 AM) / After 6 PM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 min-h-[44px]"
                      autoFocus
                    />

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1">
                      {CUSTOM_TIMING_SUGGESTIONS.map((sug) => (
                        <button
                          type="button"
                          key={sug}
                          onClick={() => {
                            setTimingCustom(sug);
                            if (errors.timingCustom) setErrors({ ...errors, timingCustom: '' });
                          }}
                          className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                            timingCustom === sug
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                    {errors.timingCustom && (
                      <p className="text-rose-600 text-xs font-semibold">{errors.timingCustom}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Question 8: Would you like to attend a FREE Demo Class? */}
              <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="block text-slate-900 font-bold text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">8</span>
                    <span>Would you like to attend a FREE Demo Class?</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </span>
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 ml-7 sm:ml-8">
                  100% Free • Interactive classroom session at Jorhat center
                </p>

                <div className="ml-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_OPTIONS.map((opt) => {
                    const isSelected = demoAttendance === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setDemoAttendance(opt.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 min-h-[50px] cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="demoAttendance"
                          checked={isSelected}
                          onChange={() => setDemoAttendance(opt.id)}
                          className="mt-0.5 text-amber-600 focus:ring-amber-500 h-4 w-4 flex-shrink-0"
                        />
                        <div>
                          <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-amber-950' : 'text-slate-800'}`}>
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block">{opt.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 9: How did you hear about All In One Academy? */}
              <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="block text-slate-900 font-bold text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center flex-shrink-0">9</span>
                    <span>How did you hear about All In One Academy?</span>
                    <span className="text-rose-500 text-sm font-bold">*</span>
                  </span>
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 ml-7 sm:ml-8">
                  Helps us know where our students connect with us
                </p>

                <div className="ml-0 sm:ml-8 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SOURCES_LIST.map((src) => {
                    const isSelected = source === src;
                    return (
                      <button
                        type="button"
                        key={src}
                        onClick={() => setSource(src)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 min-h-[44px] cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 font-bold text-amber-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="source"
                          checked={isSelected}
                          onChange={() => setSource(src)}
                          className="text-amber-600 focus:ring-amber-500 h-4 w-4 flex-shrink-0"
                        />
                        <span className="text-xs font-semibold">{src}</span>
                      </button>
                    );
                  })}
                </div>

                {source === 'Other' && (
                  <div className="ml-0 sm:ml-8 mt-2">
                    <input
                      type="text"
                      value={sourceOther}
                      onChange={(e) => setSourceOther(e.target.value)}
                      placeholder="Tell us how you found us (e.g. Newspaper, Friend, Banner)"
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-slate-900 text-xs sm:text-sm min-h-[44px]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wizard Navigation / Submit Controls */}
          <div className="pt-3 border-t border-slate-200">
            {viewMode === 'wizard' ? (
              <div className="flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:bg-slate-50 min-h-[48px] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-6 rounded-xl shadow-lg text-xs sm:text-sm flex items-center gap-2 min-h-[48px] cursor-pointer"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/25 text-sm sm:text-base flex items-center justify-center gap-2 min-h-[50px] cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                        <span>Saving Entry Pass...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-slate-950" />
                        <span>Submit & Get Free Demo Pass</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              /* Single Page Submit Banner */
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-2xl text-slate-950 shadow-lg border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-base sm:text-lg font-display">
                    🎁 Register now for your FREE Demo Class!
                  </h4>
                  <p className="text-xs font-medium text-slate-900 mt-0.5">
                    Limited seats available. Our team will contact you with the class details.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3.5 rounded-xl shadow-xl text-sm sm:text-base font-display flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Submit Registration</span>
                </button>
              </div>
            )}
          </div>

          {/* Academy Contact Footer in Form */}
          <div className="text-center pt-2 text-[11px] text-slate-500 space-y-0.5">
            <p className="font-bold text-slate-700">
              {ACADEMY_DATA.name} • {ACADEMY_DATA.address}
            </p>
            <p>
              Helpline: <a href="tel:9365562718" className="text-amber-600 font-bold">9365562718</a> / <a href="tel:9954410525" className="text-amber-600 font-bold">9954410525</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
