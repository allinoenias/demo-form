import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { AdmitPassModal } from './components/AdmitPassModal';
import { GoogleFormsManager } from './components/GoogleFormsManager';
import { CounselorCRM } from './components/CounselorCRM';
import { AcademyHighlights } from './components/AcademyHighlights';
import { AdminLockModal } from './components/AdminLockModal';
import { Footer } from './components/Footer';
import { StudentLead, ACADEMY_DATA } from './types/form';
import { getStoredLeads, getSavedFormConfig } from './services/leadStorage';
import { initAuth } from './services/firebaseAuth';
import { subscribeToFirebaseLeads } from './services/firestoreService';
import { isAdminAuthenticated, lockAdmin } from './services/adminAuth';
import { Phone, MessageCircle, Calendar, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'google-form' | 'crm' | 'about'>('form');
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [currentAdmitPass, setCurrentAdmitPass] = useState<StudentLead | null>(null);
  const [isGFormConnected, setIsGFormConnected] = useState(false);
  
  // Admin Password Protection State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminAuthenticated());
  const [pendingAdminTab, setPendingAdminTab] = useState<'google-form' | 'crm' | null>(null);

  useEffect(() => {
    // 1. Load initial cached leads
    const stored = getStoredLeads();
    setLeads(stored);

    // 2. Connect to real-time Firebase Firestore database
    const unsubscribeFirestore = subscribeToFirebaseLeads((firestoreLeads) => {
      if (firestoreLeads && firestoreLeads.length > 0) {
        setLeads((prev) => {
          // Merge Firestore leads with any local-only leads
          const merged = [...firestoreLeads];
          prev.forEach((localLead) => {
            if (!merged.some((fl) => fl.id === localLead.id)) {
              merged.push(localLead);
            }
          });
          return merged;
        });
      }
    });

    // 3. Check Google Forms connection / Auth
    const savedConfig = getSavedFormConfig();
    if (savedConfig?.formId) {
      setIsGFormConnected(true);
    }

    const unsubscribeAuth = initAuth(
      (user) => {
        if (user) {
          setIsGFormConnected(true);
          // If logged in with academy Google email, auto-unlock admin
          setIsAdmin(true);
        }
      },
      () => {}
    );

    return () => {
      unsubscribeFirestore();
      unsubscribeAuth();
    };
  }, []);

  const handleTabSelect = (tab: 'form' | 'google-form' | 'crm' | 'about') => {
    // Student Form and About tabs are 100% public
    if (tab === 'form' || tab === 'about') {
      setActiveTab(tab);
      return;
    }

    // Google Forms and CRM tabs are password-protected for academy staff
    if (isAdmin) {
      setActiveTab(tab);
    } else {
      setPendingAdminTab(tab);
    }
  };

  const handleAdminUnlocked = () => {
    setIsAdmin(true);
    if (pendingAdminTab) {
      setActiveTab(pendingAdminTab);
      setPendingAdminTab(null);
    }
  };

  const handleLockAdmin = () => {
    lockAdmin();
    setIsAdmin(false);
    if (activeTab === 'crm' || activeTab === 'google-form') {
      setActiveTab('form');
    }
  };

  const handleFormSubmitted = (newLead: StudentLead) => {
    const updated = [newLead, ...leads.filter(l => l.id !== newLead.id)];
    setLeads(updated);
    setCurrentAdmitPass(newLead);
  };

  const handleRegisterAnother = () => {
    setCurrentAdmitPass(null);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-amber-500 selection:text-slate-950 pb-16 md:pb-0">
      
      {/* Academy Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        leadCount={leads.length}
        isGFormConnected={isGFormConnected}
        isAdmin={isAdmin}
        onLockAdmin={handleLockAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-3 sm:py-8 px-2 sm:px-4">
        {activeTab === 'form' && (
          <RegistrationForm
            onSubmitSuccess={handleFormSubmitted}
            onOpenGFormsSync={() => handleTabSelect('google-form')}
          />
        )}

        {activeTab === 'google-form' && (
          <GoogleFormsManager
            onSyncComplete={() => {
              setLeads(getStoredLeads());
            }}
          />
        )}

        {activeTab === 'crm' && (
          <CounselorCRM
            leads={leads}
            onLeadsUpdated={(updated) => setLeads(updated)}
          />
        )}

        {activeTab === 'about' && (
          <AcademyHighlights
            onRegisterClick={() => {
              setActiveTab('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Admit Pass Confirmation Modal */}
      {currentAdmitPass && (
        <AdmitPassModal
          lead={currentAdmitPass}
          onClose={() => setCurrentAdmitPass(null)}
          onRegisterAnother={handleRegisterAnother}
        />
      )}

      {/* Admin Password Unlock Modal */}
      {pendingAdminTab && (
        <AdminLockModal
          targetTabName={pendingAdminTab === 'crm' ? 'Counselor Leads CRM' : 'Google Forms Hub'}
          onSuccess={handleAdminUnlocked}
          onCancel={() => setPendingAdminTab(null)}
        />
      )}

      {/* Mobile Floating Quick Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 px-3 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={() => {
            setActiveTab('form');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'form'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Register Demo</span>
        </button>

        <a
          href="tel:9365562718"
          className="py-2 px-3 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1 border border-slate-700 hover:bg-slate-700"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/919365562718?text=${encodeURIComponent(
            'Hello All In One Academy Jorhat! I would like details about Free Demo Classes for ADRE & Competitive Exams.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
