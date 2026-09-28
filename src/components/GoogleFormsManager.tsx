import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Share2, 
  Eye, 
  Link as LinkIcon,
  HelpCircle,
  Clock,
  Send,
  Database
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logout, getAccessToken, initAuth } from '../services/firebaseAuth';
import { createAcademyGoogleForm, fetchGoogleFormResponses, CreatedGoogleForm } from '../services/googleFormsService';
import { getSavedFormConfig, saveFormConfig } from '../services/leadStorage';
import { ACADEMY_DATA } from '../types/form';

interface GoogleFormsManagerProps {
  onSyncComplete?: (count: number) => void;
}

export const GoogleFormsManager: React.FC<GoogleFormsManagerProps> = ({
  onSyncComplete,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [isFetchingResponses, setIsFetchingResponses] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [formConfig, setFormConfig] = useState<CreatedGoogleForm | null>(null);
  const [responsesCount, setResponsesCount] = useState<number | null>(null);
  const [customFormUrl, setCustomFormUrl] = useState('');
  const [previewTab, setPreviewTab] = useState<'info' | 'embed' | 'questions'>('info');

  useEffect(() => {
    // Check saved form config in local cache
    const saved = getSavedFormConfig();
    if (saved) {
      setFormConfig(saved);
    }

    // Initialize Auth Listener
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setSuccessMsg(`Signed in successfully as ${result.user.email}`);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setErrorMsg(err.message || 'Google Sign-in failed. Please verify popup permissions.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setSuccessMsg(null);
  };

  const handleCreateGoogleForm = async () => {
    setIsCreatingForm(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const created = await createAcademyGoogleForm();
      setFormConfig(created);
      saveFormConfig(created);
      setSuccessMsg('Official Google Form successfully generated and synced with your Google Drive!');
      if (onSyncComplete) onSyncComplete(1);
    } catch (err: any) {
      console.error('Failed to create Google Form:', err);
      setErrorMsg(
        err.message || 'Unable to create form automatically via Google Forms API. Please check permissions.'
      );
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleFetchResponses = async () => {
    if (!formConfig?.formId) return;
    setIsFetchingResponses(true);
    setErrorMsg(null);

    try {
      const responses = await fetchGoogleFormResponses(formConfig.formId);
      setResponsesCount(responses.length);
      setSuccessMsg(`Fetched ${responses.length} response(s) from live Google Form.`);
      if (onSyncComplete) onSyncComplete(responses.length);
    } catch (err: any) {
      console.error('Failed to fetch responses:', err);
      setErrorMsg(err.message || 'Could not fetch live responses.');
    } finally {
      setIsFetchingResponses(false);
    }
  };

  const handleCopy = (text: string, type: 'link' | 'embed') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  const handleLinkExistingForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFormUrl.trim()) return;

    let extractedId = customFormUrl.trim();
    const match = customFormUrl.match(/\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      extractedId = match[1];
    }

    const linkedConfig: CreatedGoogleForm = {
      formId: extractedId,
      title: '🎯 Government Exam Preparation – Free Demo Class Registration',
      description: 'Connected Google Form for All In One Academy Jorhat',
      responderUri: customFormUrl.includes('http') ? customFormUrl : `https://docs.google.com/forms/d/e/${extractedId}/viewform`,
      editUri: `https://docs.google.com/forms/d/${extractedId}/edit`,
    };

    setFormConfig(linkedConfig);
    saveFormConfig(linkedConfig);
    setSuccessMsg('Google Form connected successfully!');
  };

  const defaultPublicUrl = formConfig?.responderUri || 'https://docs.google.com/forms/d/e/all-in-one-academy-demo-class/viewform';
  const embedIframeCode = `<iframe src="${defaultPublicUrl}?embedded=true" width="640" height="900" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-300" />
              <span>Official Google Workspace Integration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Google Forms & Drive Hub
            </h2>
            <p className="text-indigo-200 text-sm max-w-2xl mt-1">
              Create, sync, and publish the official Google Form for <strong>All In One Academy, Jorhat</strong>. Collect student leads into your Google Forms and Google Drive workspace.
            </p>
          </div>

          {/* User Sign-In Widget */}
          <div className="bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-indigo-400/20 flex flex-col items-start md:items-end gap-2.5">
            {user ? (
              <div className="space-y-2 text-right">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs text-emerald-300 font-bold">Google Connected</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {user.displayName || 'Academy Admin'}
                  <div className="text-[11px] text-slate-400">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 hover:underline ml-auto"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-indigo-200 mb-2 font-medium">
                  Sign in to create form in your Google Account:
                </p>
                {/* Official Material Button specified in Skill */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="gsi-material-button"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 p-4 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-700 hover:text-rose-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: 1-Click Google Forms Creator */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              1-Click Form Generator
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Automatically constructs the complete 9-question Google Form (ADRE, SSC, Banking, Timing, Subject Challenges) in your connected Google account.
            </p>
          </div>

          <button
            onClick={user ? handleCreateGoogleForm : handleGoogleLogin}
            disabled={isCreatingForm}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-purple-600/20 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
          >
            {isCreatingForm ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Generating in Google Drive...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                <span>{formConfig ? 'Re-Sync Google Form' : 'Generate Google Form Now'}</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Live Responses Sync */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Sync Google Form Leads
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Pull incoming submissions from Google Forms API directly into your Academy CRM dashboard for immediate follow-up.
            </p>
          </div>

          <button
            onClick={handleFetchResponses}
            disabled={!formConfig?.formId || isFetchingResponses}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-600/20 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetchingResponses ? 'animate-spin' : ''}`} />
            <span>Sync Live Responses {responsesCount !== null ? `(${responsesCount})` : ''}</span>
          </button>
        </div>

        {/* Card 3: Link Existing Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Link Existing Form URL
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">
              Already have an existing Google Form? Paste your link here to connect.
            </p>
          </div>

          <form onSubmit={handleLinkExistingForm} className="space-y-2">
            <input
              type="text"
              value={customFormUrl}
              onChange={(e) => setCustomFormUrl(e.target.value)}
              placeholder="https://docs.google.com/forms/d/..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg text-xs"
            >
              Connect Form URL
            </button>
          </form>
        </div>
      </div>

      {/* Active Form Details & Links */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Connected Form Details</span>
            <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
              🎯 Government Exam Preparation – Free Demo Class Registration
            </h3>
            <p className="text-xs text-slate-500">
              All In One Academy, Jorhat • JB Road, Near IndusInd Bank, Malowali
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPreviewTab('info')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewTab === 'info' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Share Links
            </button>
            <button
              onClick={() => setPreviewTab('questions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewTab === 'questions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 9 Questions
            </button>
            <button
              onClick={() => setPreviewTab('embed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewTab === 'embed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Embed Preview
            </button>
          </div>
        </div>

        {/* Tab 1: Share Links */}
        {previewTab === 'info' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Public Link */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Student Public Form Link</span>
                <p className="text-xs font-mono text-slate-600 truncate bg-white p-2 rounded-lg border border-slate-200">
                  {formConfig?.responderUri || defaultPublicUrl}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleCopy(formConfig?.responderUri || defaultPublicUrl, 'link')}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={formConfig?.responderUri || defaultPublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Form</span>
                  </a>
                </div>
              </div>

              {/* Edit / Counselor Link */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Google Drive Editor & Response Link</span>
                <p className="text-xs font-mono text-slate-600 truncate bg-white p-2 rounded-lg border border-slate-200">
                  {formConfig?.editUri || 'https://docs.google.com/forms/u/0/'}
                </p>
                <div className="flex gap-2 pt-1">
                  <a
                    href={formConfig?.editUri || 'https://docs.google.com/forms/u/0/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Edit Form in Google Drive</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Share to Socials */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span className="font-semibold text-amber-950">
                  Promote on WhatsApp Groups, Instagram Bio, & Jorhat Student Communities
                </span>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🎯 All In One Academy Jorhat - FREE Demo Class Registration for ADRE, SSC, Banking & Railway!\n\nRegister your free seat here:\n${formConfig?.responderUri || defaultPublicUrl}\n\nVenue: JB Road, Near IndusInd Bank, Malowali, Jorhat.\nCall: 9365562718 / 9954410525`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <span>Share to WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: All 9 Questions Blueprint */}
        {previewTab === 'questions' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500 mb-2">The Google Form includes these 9 structured questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">1. Full Name</span> (Short Answer • Required)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">2. WhatsApp/Mobile Number</span> (Short Answer • Required)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">3. Target Exam</span> (ADRE, SSC, Banking, Railway, Assam Govt, Other)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">4. Current Prep Level</span> (Just Starting, Beginner, Few months, Appearing)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">5. Difficult Subjects</span> (Maths, Reasoning, English, GK, Assam GK, CSAT)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">6. Biggest Challenge</span> (Guidance, Consistency, Tests, Time mgmt)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">7. Preferred Timing</span> (Morning, Afternoon, Evening)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">8. FREE Demo Attendance</span> (Yes, want to attend / Want info)
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                <span className="font-bold text-slate-800">9. Referral Source</span> (Facebook, Instagram, YouTube, WhatsApp, Friend/Student, Other)
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Embed Code & Preview */}
        {previewTab === 'embed' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto relative">
              <button
                onClick={() => handleCopy(embedIframeCode, 'embed')}
                className="absolute right-3 top-3 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1"
              >
                {copiedEmbed ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmbed ? 'Copied' : 'Copy Code'}</span>
              </button>
              <code>{embedIframeCode}</code>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 text-center p-8">
              <p className="text-xs text-slate-500 mb-3">Google Forms iframe embed preview:</p>
              <a
                href={formConfig?.responderUri || defaultPublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-amber-600 shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Google Form Fullscreen in New Window</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
