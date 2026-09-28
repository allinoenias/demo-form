export type ExamType = 
  | 'ADRE' 
  | 'SSC' 
  | 'Banking' 
  | 'Railway' 
  | 'Assam Government Exams' 
  | 'Other';

export type PreparationLevel = 
  | 'Just Starting' 
  | 'Beginner' 
  | 'Preparing for a few months' 
  | 'Already appearing for exams';

export type DifficultSubject = 
  | 'Maths' 
  | 'Reasoning' 
  | 'English' 
  | 'GK' 
  | 'Current Affairs' 
  | 'Assam GK' 
  | 'CSAT';

export type PreparationChallenge = 
  | "Don't know where to start" 
  | 'Lack of proper guidance' 
  | 'Difficulty maintaining consistency' 
  | 'Weak in some subjects' 
  | 'Need regular tests/practice' 
  | 'Time management';

export type ClassTiming = 'Morning' | 'Afternoon' | 'Evening' | 'Custom Timing';

export type DemoAttendance = 'Yes, I want to attend' | 'I want more information';

export type ReferralSource = 
  | 'Facebook' 
  | 'Instagram' 
  | 'YouTube' 
  | 'WhatsApp' 
  | 'Friend/Student' 
  | 'Other';

export type LeadStatus = 'New' | 'Contacted' | 'Demo Scheduled' | 'Attended Demo' | 'Enrolled' | 'Follow Up';

export interface StudentLead {
  id: string;
  fullName: string;
  phone: string;
  exam: ExamType;
  examOther?: string;
  prepLevel: PreparationLevel;
  difficultSubjects: DifficultSubject[];
  challenges: PreparationChallenge[];
  preferredTiming: ClassTiming;
  timingCustom?: string;
  demoAttendance: DemoAttendance;
  source: ReferralSource;
  sourceOther?: string;
  submittedAt: string; // ISO string
  status: LeadStatus;
  notes?: string;
  googleFormSynced?: boolean;
}

export interface GoogleFormConfig {
  formId?: string;
  responderUri?: string;
  editUri?: string;
  title?: string;
  lastSyncedAt?: string;
}

export interface AcademyInfo {
  name: string;
  city: string;
  address: string;
  landmark: string;
  phones: string[];
  email: string;
  tagline: string;
  badge: string;
}

export const ACADEMY_DATA: AcademyInfo = {
  name: "All In One Academy",
  city: "Jorhat, Assam",
  address: "JB Road, Near IndusInd Bank, Malowali, Jorhat, Assam - 785001",
  landmark: "Near IndusInd Bank, Malowali",
  phones: ["9365562718", "9954410525"],
  email: "aallinoneias@gmail.com",
  tagline: "Top Coaching for ADRE, SSC, Banking, Railway & Assam State Exams in Upper Assam",
  badge: "Premier Govt Exam Training Center in Jorhat"
};
