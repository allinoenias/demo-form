import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  X, 
  Calendar, 
  Sparkles,
  Award,
  ChevronDown
} from 'lucide-react';
import { 
  StudentLead, 
  LeadStatus, 
  ExamType, 
  ACADEMY_DATA 
} from '../types/form';
import { 
  updateLeadStatus, 
  deleteLead, 
  exportLeadsToCSV, 
  saveLead 
} from '../services/leadStorage';
import { 
  updateLeadInFirebase, 
  deleteLeadFromFirebase,
  saveLeadToFirebase
} from '../services/firestoreService';

interface CounselorCRMProps {
  leads: StudentLead[];
  onLeadsUpdated: (leads: StudentLead[]) => void;
}

const STATUS_COLORS: { [key in LeadStatus]: { bg: string; text: string; border: string } } = {
  'New': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Contacted': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Demo Scheduled': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Attended Demo': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'Enrolled': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Follow Up': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

export const CounselorCRM: React.FC<CounselorCRMProps> = ({
  leads,
  onLeadsUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadExam, setNewLeadExam] = useState<ExamType>('ADRE');
  const [newLeadTiming, setNewLeadTiming] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');

  // Filter Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExam = selectedExam === 'ALL' || l.exam === selectedExam;
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;

    return matchesSearch && matchesExam && matchesStatus;
  });

  // Calculate Metrics
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const adreCount = leads.filter(l => l.exam === 'ADRE').length;
  const enrolledCount = leads.filter(l => l.status === 'Enrolled').length;

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const updated = updateLeadStatus(leadId, newStatus);
    onLeadsUpdated(updated);
    updateLeadInFirebase(leadId, newStatus).catch(err => console.warn('Firestore update:', err));
  };

  const handleSaveNotes = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    const status = lead?.status || 'New';
    const updated = updateLeadStatus(leadId, status, tempNotes);
    onLeadsUpdated(updated);
    setEditingNotesId(null);
    updateLeadInFirebase(leadId, status, tempNotes).catch(err => console.warn('Firestore notes:', err));
  };

  const handleDelete = (leadId: string) => {
    const updated = deleteLead(leadId);
    onLeadsUpdated(updated);
    setDeleteConfirmId(null);
    deleteLeadFromFirebase(leadId).catch(err => console.warn('Firestore delete:', err));
  };

  const handleCreateWalkInLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    const created = saveLead({
      fullName: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      exam: newLeadExam,
      prepLevel: 'Beginner',
      difficultSubjects: ['Maths', 'Assam GK'],
      challenges: ['Lack of proper guidance'],
      preferredTiming: newLeadTiming,
      demoAttendance: 'Yes, I want to attend',
      source: 'Friend/Student',
    });

    const updated = [created, ...leads];
    onLeadsUpdated(updated);
    setShowAddModal(false);
    setNewLeadName('');
    setNewLeadPhone('');
    saveLeadToFirebase(created).catch(err => console.warn('Firestore save walk-in:', err));
  };

  const sendWhatsAppInvite = (lead: StudentLead) => {
    const msg = encodeURIComponent(
      `Hello ${lead.fullName}! 📚 Greetings from All In One Academy, Jorhat.\n\n` +
      `We received your inquiry for *${lead.exam}* preparation. We would love to invite you for a *FREE Offline Demo Class* at our Jorhat center (JB Road, Near IndusInd Bank, Malowali).\n\n` +
      `⏰ Batch: ${lead.preferredTiming} slot\n` +
      `📞 Academy Helplines: 9365562718 / 9954410525\n\n` +
      `Shall we confirm your seat for this upcoming Saturday?`
    );
    window.open(`https://wa.me/91${lead.phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Counselor & Admission Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            Government Exam Leads CRM
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Track student inquiries, call/WhatsApp aspirants, schedule demo batches, and convert candidates for All In One Academy, Jorhat.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => exportLeadsToCSV(leads)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-in Lead</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">TOTAL LEADS</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
            {totalLeads}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <span>●</span> Live Database
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">NEW UNCONTACTED</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-display mt-1">
            {newLeadsCount}
          </div>
          <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
            <span>⚡</span> Needs immediate call
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">ADRE 2.0 ASPIRANTS</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-display mt-1">
            {adreCount}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Top target in Upper Assam
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">ENROLLED STUDENTS</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-display mt-1">
            {enrolledCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <span>🎓</span> Batch confirmed
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, WhatsApp number, or ID (e.g. Pranjal, 98640...)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Exam Filter */}
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Exams</option>
            <option value="ADRE">ADRE</option>
            <option value="SSC">SSC</option>
            <option value="Banking">Banking</option>
            <option value="Railway">Railway</option>
            <option value="Assam Government Exams">Assam Govt Exams</option>
            <option value="Other">Other Exams</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Demo Scheduled">Demo Scheduled</option>
            <option value="Attended Demo">Attended Demo</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Follow Up">Follow Up</option>
          </select>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing {filteredLeads.length} of {leads.length} student leads</span>
          {(searchTerm || selectedExam !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedExam('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="font-bold text-slate-700 text-base">No matching leads found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filter options.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const statusConfig = STATUS_COLORS[lead.status] || STATUS_COLORS['New'];
            const isEditingNotes = editingNotesId === lead.id;

            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                {/* Top Row: Name, Reg ID, Status Dropdown, Call/WhatsApp Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center font-display flex-shrink-0">
                      {lead.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base font-display">
                          {lead.fullName}
                        </h3>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {lead.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-slate-800">+91 {lead.phone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(lead.submittedAt).toLocaleDateString()} at {new Date(lead.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Selector */}
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Demo Scheduled">Demo Scheduled</option>
                      <option value="Attended Demo">Attended Demo</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Follow Up">Follow Up</option>
                    </select>

                    {/* Quick Call */}
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Call Student"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                    </a>

                    {/* Quick WhatsApp */}
                    <button
                      onClick={() => sendWhatsAppInvite(lead)}
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                      title="Send WhatsApp Invite"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                    </button>

                    {/* Delete Lead Button with Confirmation modal trigger */}
                    <button
                      onClick={() => setDeleteConfirmId(lead.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Exam & Prep Profile Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">TARGET EXAM</span>
                    <span className="font-bold text-amber-700 text-xs">
                      {lead.exam}{lead.examOther ? ` (${lead.examOther})` : ''}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">PREP LEVEL</span>
                    <span className="font-semibold text-slate-800 text-xs">{lead.prepLevel}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">PREFERRED TIMING</span>
                    <span className="font-semibold text-slate-800 text-xs truncate block" title={lead.preferredTiming === 'Custom Timing' && lead.timingCustom ? lead.timingCustom : lead.preferredTiming}>
                      {lead.preferredTiming === 'Custom Timing' && lead.timingCustom
                        ? `Custom: ${lead.timingCustom}`
                        : `${lead.preferredTiming} Batch`}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">SOURCE</span>
                    <span className="font-semibold text-slate-800 text-xs">{lead.source}</span>
                  </div>
                </div>

                {/* Difficult Subjects & Challenges */}
                <div className="space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-400 font-semibold text-[11px] mr-1">Needs Help In:</span>
                    {lead.difficultSubjects.map((s) => (
                      <span key={s} className="bg-amber-100/90 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-400 font-semibold text-[11px] mr-1">Main Challenges:</span>
                    {lead.challenges.map((c) => (
                      <span key={c} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Counselor Notes Section */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isEditingNotes ? (
                    <div className="w-full flex items-center gap-2">
                      <input
                        type="text"
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Add counselor remarks (e.g. Wants 9 AM offline batch, visited center)"
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNotes(lead.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="text-slate-500 hover:text-slate-700 text-xs px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between">
                      <p className="text-slate-600 italic">
                        {lead.notes ? `Note: "${lead.notes}"` : 'No counselor notes added yet.'}
                      </p>
                      <button
                        onClick={() => {
                          setEditingNotesId(lead.id);
                          setTempNotes(lead.notes || '');
                        }}
                        className="text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 hover:underline ml-2"
                      >
                        <Edit3 className="w-3 h-3" /> {lead.notes ? 'Edit Note' : 'Add Note'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal (Workspace Skill Requirement) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg font-display">Delete Lead Record?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to remove this student lead from the database? This action cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Walk-in Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg font-display">Add Walk-in Student Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkInLead} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Rahul Gogoi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Exam</label>
                  <select
                    value={newLeadExam}
                    onChange={(e) => setNewLeadExam(e.target.value as ExamType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="ADRE">ADRE</option>
                    <option value="SSC">SSC</option>
                    <option value="Banking">Banking</option>
                    <option value="Railway">Railway</option>
                    <option value="Assam Government Exams">Assam Govt</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Slot</label>
                  <select
                    value={newLeadTiming}
                    onChange={(e) => setNewLeadTiming(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Custom Timing">Custom Timing</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-xs text-slate-950 shadow-md shadow-amber-500/20"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
