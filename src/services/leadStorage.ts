import { StudentLead, LeadStatus } from '../types/form';

const STORAGE_KEY = 'all_in_one_academy_leads_v1';
const SAVED_FORM_KEY = 'all_in_one_academy_gform_config_v1';

const INITIAL_DEMO_LEADS: StudentLead[] = [
  {
    id: 'AIO-2026-081',
    fullName: 'Pranjal Saikia',
    phone: '9864012345',
    exam: 'ADRE',
    prepLevel: 'Preparing for a few months',
    difficultSubjects: ['Maths', 'Assam GK'],
    challenges: ['Need regular tests/practice', 'Weak in some subjects'],
    preferredTiming: 'Morning',
    demoAttendance: 'Yes, I want to attend',
    source: 'Facebook',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'New',
    notes: 'Graduation complete from JB College. Wants morning 8 AM ADRE batch.'
  },
  {
    id: 'AIO-2026-082',
    fullName: 'Ananya Dutta',
    phone: '9435098765',
    exam: 'Banking',
    prepLevel: 'Beginner',
    difficultSubjects: ['Reasoning', 'English', 'CSAT'],
    challenges: ['Time management', 'Lack of proper guidance'],
    preferredTiming: 'Evening',
    demoAttendance: 'Yes, I want to attend',
    source: 'Instagram',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'Demo Scheduled',
    notes: 'Aiming for SBI PO & IBPS Clerk. Demo scheduled for Saturday evening batch.'
  },
  {
    id: 'AIO-2026-083',
    fullName: 'Bhaskar Jyoti Borah',
    phone: '7002345678',
    exam: 'SSC',
    prepLevel: 'Just Starting',
    difficultSubjects: ['Maths', 'English', 'GK'],
    challenges: ["Don't know where to start", 'Difficulty maintaining consistency'],
    preferredTiming: 'Morning',
    demoAttendance: 'Yes, I want to attend',
    source: 'Friend/Student',
    submittedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'Contacted',
    notes: 'Friend recommended All In One Academy. Called and explained syllabus.'
  },
  {
    id: 'AIO-2026-084',
    fullName: 'Dimpi Hazarika',
    phone: '9957812340',
    exam: 'Assam Government Exams',
    prepLevel: 'Already appearing for exams',
    difficultSubjects: ['Assam GK', 'Current Affairs', 'Maths'],
    challenges: ['Need regular tests/practice'],
    preferredTiming: 'Afternoon',
    demoAttendance: 'Yes, I want to attend',
    source: 'WhatsApp',
    submittedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    status: 'Enrolled',
    notes: 'Joined offline weekend test series & Assam GK masterclass.'
  }
];

export const getStoredLeads = (): StudentLead[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
      return INITIAL_DEMO_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read leads from localStorage:', e);
    return INITIAL_DEMO_LEADS;
  }
};

export const saveLead = (lead: Omit<StudentLead, 'id' | 'submittedAt' | 'status'>): StudentLead => {
  const current = getStoredLeads();
  const idNumber = Math.floor(100 + Math.random() * 900);
  const newLead: StudentLead = {
    ...lead,
    id: `AIO-2026-${idNumber}`,
    submittedAt: new Date().toISOString(),
    status: 'New',
  };

  const updated = [newLead, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newLead;
};

export const updateLeadStatus = (leadId: string, status: LeadStatus, notes?: string): StudentLead[] => {
  const current = getStoredLeads();
  const updated = current.map(item => {
    if (item.id === leadId) {
      return {
        ...item,
        status,
        ...(notes !== undefined ? { notes } : {}),
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteLead = (leadId: string): StudentLead[] => {
  const current = getStoredLeads();
  const updated = current.filter(item => item.id !== leadId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getSavedFormConfig = () => {
  try {
    const raw = localStorage.getItem(SAVED_FORM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveFormConfig = (config: any) => {
  localStorage.setItem(SAVED_FORM_KEY, JSON.stringify(config));
};

export const exportLeadsToCSV = (leads: StudentLead[]) => {
  const headers = [
    'Registration ID',
    'Full Name',
    'WhatsApp / Mobile',
    'Exam Target',
    'Preparation Level',
    'Difficult Subjects',
    'Key Challenges',
    'Preferred Timing',
    'Demo Preference',
    'Referral Source',
    'Submitted At',
    'Status',
    'Counselor Notes',
  ];

  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${l.fullName.replace(/"/g, '""')}"`,
    `"${l.phone}"`,
    `"${l.exam}${l.examOther ? ` (${l.examOther})` : ''}"`,
    `"${l.prepLevel}"`,
    `"${l.difficultSubjects.join(', ')}"`,
    `"${l.challenges.join(', ')}"`,
    `"${l.preferredTiming === 'Custom Timing' && l.timingCustom ? `Custom (${l.timingCustom})` : l.preferredTiming}"`,
    `"${l.demoAttendance}"`,
    `"${l.source}${l.sourceOther ? ` (${l.sourceOther})` : ''}"`,
    `"${new Date(l.submittedAt).toLocaleString()}"`,
    `"${l.status}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `All_In_One_Academy_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
