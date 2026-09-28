import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';
import { StudentLead, LeadStatus } from '../types/form';
import { auth } from './firebaseAuth';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
}

const COLLECTION_PATH = 'student_leads';

/**
 * Save new student lead to Firebase Firestore
 */
export const saveLeadToFirebase = async (lead: StudentLead): Promise<boolean> => {
  try {
    const leadDocRef = doc(db, COLLECTION_PATH, lead.id);
    
    // Clean payload without undefined values
    const payload: any = {
      id: lead.id,
      fullName: lead.fullName,
      phone: lead.phone,
      exam: lead.exam,
      prepLevel: lead.prepLevel,
      difficultSubjects: lead.difficultSubjects || [],
      challenges: lead.challenges || [],
      preferredTiming: lead.preferredTiming,
      demoAttendance: lead.demoAttendance,
      source: lead.source,
      submittedAt: lead.submittedAt,
      status: lead.status || 'New',
    };

    if (lead.examOther) payload.examOther = lead.examOther;
    if (lead.timingCustom) payload.timingCustom = lead.timingCustom;
    if (lead.sourceOther) payload.sourceOther = lead.sourceOther;
    if (lead.notes) payload.notes = lead.notes;

    await setDoc(leadDocRef, payload);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_PATH}/${lead.id}`);
    return false;
  }
};

/**
 * Real-time listener for student leads from Firestore
 */
export const subscribeToFirebaseLeads = (onLeadsUpdate: (leads: StudentLead[]) => void) => {
  try {
    const q = collection(db, COLLECTION_PATH);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreLeads: StudentLead[] = [];
        snapshot.forEach((docSnap) => {
          firestoreLeads.push(docSnap.data() as StudentLead);
        });

        if (firestoreLeads.length > 0) {
          // Sort newest first
          firestoreLeads.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          onLeadsUpdate(firestoreLeads);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, COLLECTION_PATH);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_PATH);
    return () => {};
  }
};

/**
 * Update lead status / notes in Firestore
 */
export const updateLeadInFirebase = async (leadId: string, status: LeadStatus, notes?: string) => {
  try {
    const leadDocRef = doc(db, COLLECTION_PATH, leadId);
    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;

    await updateDoc(leadDocRef, updateData);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_PATH}/${leadId}`);
    return false;
  }
};

/**
 * Delete lead from Firestore
 */
export const deleteLeadFromFirebase = async (leadId: string) => {
  try {
    const leadDocRef = doc(db, COLLECTION_PATH, leadId);
    await deleteDoc(leadDocRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_PATH}/${leadId}`);
    return false;
  }
};
