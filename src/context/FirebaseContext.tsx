import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithGoogle as fbSignInWithGoogle,
  logOut as fbLogOut,
  syncUserProfile,
  UserProfileDoc,
  validateFirestoreConnection,
} from '../firebase';

interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfileDoc | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  firestoreReady: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  signInWithGoogle: async () => { throw new Error('Uninitialized'); },
  signOut: async () => {},
  firestoreReady: false,
});

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firestoreReady, setFirestoreReady] = useState<boolean>(false);

  useEffect(() => {
    // Validate Firestore connection on boot
    validateFirestoreConnection().then((connected) => {
      setFirestoreReady(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await syncUserProfile(currentUser);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error syncing user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User> => {
    try {
      const loggedInUser = await fbSignInWithGoogle();
      const profile = await syncUserProfile(loggedInUser);
      setUserProfile(profile);
      return loggedInUser;
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fbLogOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  };

  const isAdmin =
    userProfile?.role === 'admin' ||
    user?.email === 'croniez78@gmail.com';

  return (
    <FirebaseContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        signOut,
        firestoreReady,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
