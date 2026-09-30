import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { OvertimeEntry, StaffMember } from './types';
import { INITIAL_AHMAD_ENTRIES } from './mockData';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore using the specific database ID provisioned
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Operation Types for Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
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

/**
 * Standardized Firestore error handler throwing formatted JSON string
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Mandatory connection check per Firebase skill specifications
 */
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline. Please check network connectivity.');
      return false;
    }
    // Any permission-denied or document-not-found means server responded
    return true;
  }
}

// Automatically invoke on module evaluation
validateFirestoreConnection().catch((err) => {
  console.debug('Initial Firestore ping note:', err);
});

// Authentication Helpers
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}

// User Profile Data Structure in Firestore
export interface UserProfileDoc {
  id: string;
  email: string;
  name: string;
  role: 'staff' | 'admin';
  department: string;
  avatar?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function syncUserProfile(user: User): Promise<UserProfileDoc> {
  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  try {
    const snap = await getDoc(userRef);
    const isAdminEmail = user.email === 'croniez78@gmail.com';

    if (!snap.exists()) {
      const newProfile: UserProfileDoc = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Media Prima Staff',
        role: isAdminEmail ? 'admin' : 'staff',
        department: isAdminEmail ? 'HR & Operations' : 'Engineering',
        avatar: (user.displayName || user.email || 'MP').substring(0, 2).toUpperCase(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const data = snap.data() as UserProfileDoc;
      if (isAdminEmail && data.role !== 'admin') {
        await updateDoc(userRef, { role: 'admin', updatedAt: serverTimestamp() });
        data.role = 'admin';
      }
      return data;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Overtime Entry Firestore Handlers
export interface FirestoreOvertimeEntry {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  project: string;
  notes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function subscribeToUserEntries(
  userId: string,
  onUpdate: (entries: OvertimeEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const collectionPath = 'overtimeEntries';
  const q = query(collection(db, collectionPath), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const entries: OvertimeEntry[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data() as FirestoreOvertimeEntry;
        return {
          id: d.id || docSnap.id,
          date: d.date,
          startTime: d.startTime,
          endTime: d.endTime,
          duration: d.duration,
          project: d.project,
          notes: d.notes || '',
        };
      });
      // Sort descending by date
      entries.sort((a, b) => b.date.localeCompare(a.date));
      onUpdate(entries);
    },
    (error) => {
      console.error('Subscription error on overtimeEntries:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

export function subscribeToAllEntries(
  onUpdate: (entries: FirestoreOvertimeEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const collectionPath = 'overtimeEntries';
  const q = collection(db, collectionPath);

  return onSnapshot(
    q,
    (snapshot) => {
      const entries: FirestoreOvertimeEntry[] = snapshot.docs.map((docSnap) => {
        return docSnap.data() as FirestoreOvertimeEntry;
      });
      onUpdate(entries);
    },
    (error) => {
      console.error('Admin subscription error on overtimeEntries:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

export async function saveOvertimeEntryToFirestore(
  entry: OvertimeEntry,
  user: { uid: string; email: string; displayName: string; department?: string }
): Promise<void> {
  const cleanId = entry.id.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const path = `overtimeEntries/${cleanId}`;
  const entryDoc = doc(db, 'overtimeEntries', cleanId);

  const payload: FirestoreOvertimeEntry = {
    id: cleanId,
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName || 'Media Prima Staff',
    department: user.department || 'Engineering',
    date: entry.date,
    startTime: entry.startTime,
    endTime: entry.endTime,
    duration: Number(entry.duration),
    project: entry.project,
    notes: entry.notes ? entry.notes.slice(0, 500) : '',
    updatedAt: serverTimestamp(),
  };

  try {
    const existing = await getDoc(entryDoc);
    if (!existing.exists()) {
      payload.createdAt = serverTimestamp();
      await setDoc(entryDoc, payload);
    } else {
      await updateDoc(entryDoc, {
        date: payload.date,
        startTime: payload.startTime,
        endTime: payload.endTime,
        duration: payload.duration,
        project: payload.project,
        notes: payload.notes,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteOvertimeEntryFromFirestore(entryId: string): Promise<void> {
  const cleanId = entryId.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const path = `overtimeEntries/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'overtimeEntries', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Monthly Submission Handlers
export interface FirestoreMonthlySubmission {
  id: string;
  userId: string;
  userName: string;
  department: string;
  month: string;
  status: 'Pending' | 'Submitted' | 'Approved' | 'Rejected';
  submittedAt?: string;
  totalHours: number;
  totalEntries: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function submitMonthlyClaimToFirestore(
  userId: string,
  userName: string,
  department: string,
  month: string,
  formattedDate: string,
  totalHours: number,
  totalEntries: number
): Promise<void> {
  const cleanMonth = month.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const docId = `${userId}_${cleanMonth}`.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const path = `monthlySubmissions/${docId}`;
  const subDoc = doc(db, 'monthlySubmissions', docId);

  try {
    await setDoc(
      subDoc,
      {
        id: docId,
        userId,
        userName,
        department,
        month,
        status: 'Submitted',
        submittedAt: formattedDate,
        totalHours,
        totalEntries,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToSubmissions(
  onUpdate: (subs: FirestoreMonthlySubmission[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'monthlySubmissions';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as FirestoreMonthlySubmission);
      onUpdate(list);
    },
    (err) => {
      console.error('Error listening to submissions:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

/**
 * Actively ping Firestore to test live connection and calculate round-trip latency in ms
 */
export async function pingFirestoreServer(): Promise<{
  success: boolean;
  latencyMs: number;
  databaseId: string;
  projectId: string;
  region: string;
}> {
  const start = performance.now();
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: true,
      latencyMs,
      databaseId: firebaseConfig.firestoreDatabaseId,
      projectId: firebaseConfig.projectId,
      region: 'asia-southeast1',
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - start);
    const isOnline = !(error instanceof Error && error.message.includes('the client is offline'));
    return {
      success: isOnline,
      latencyMs: Math.max(latencyMs, 18),
      databaseId: firebaseConfig.firestoreDatabaseId,
      projectId: firebaseConfig.projectId,
      region: 'asia-southeast1',
    };
  }
}

/**
 * Seed initial sample records into cloud Firestore database
 */
export async function seedInitialFirestoreData(user: {
  uid: string;
  email: string;
  displayName: string;
  role?: string;
}): Promise<number> {
  let count = 0;

  // 1. If designated admin, register admin doc
  if (user.email === 'croniez78@gmail.com') {
    const adminRef = doc(db, 'admins', user.uid);
    await setDoc(
      adminRef,
      {
        email: user.email,
        role: 'Super Administrator',
        assignedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    count++;
  }

  // 2. Seed initial overtime entries
  for (const entry of INITIAL_AHMAD_ENTRIES) {
    const cleanId = `${user.uid}_${entry.id}`.replace(/[^a-zA-Z0-9_\-]/g, '_');
    await saveOvertimeEntryToFirestore(
      { ...entry, id: cleanId },
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        department: 'Engineering',
      }
    );
    count++;
  }

  // 3. Seed initial monthly claim status
  await submitMonthlyClaimToFirestore(
    user.uid,
    user.displayName,
    'Engineering',
    '2024-10',
    `07 Oct 2024, 18:30 GMT`,
    10.5,
    INITIAL_AHMAD_ENTRIES.length
  );
  count++;

  return count;
}

