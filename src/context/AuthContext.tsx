import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { Role, UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  activeOrgId: string | null;
  currentRole: Role;
  isDemoUser: boolean;
  setActiveOrgId: (orgId: string | null) => void;
  setCurrentRole: (role: Role) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  startQuickDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(() => localStorage.getItem('payrollezy_active_org'));
  const [currentRole, setCurrentRole] = useState<Role>(() => (localStorage.getItem('payrollezy_role') as Role) || 'owner');
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => localStorage.getItem('payrollezy_demo_mode') === 'true');

  useEffect(() => {
    if (isDemoUser) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            if (data.defaultOrgId && !activeOrgId) {
              setActiveOrgId(data.defaultOrgId);
            }
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('User profile fetch note:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoUser, activeOrgId]);

  useEffect(() => {
    if (activeOrgId) {
      localStorage.setItem('payrollezy_active_org', activeOrgId);
    } else {
      localStorage.removeItem('payrollezy_active_org');
    }
  }, [activeOrgId]);

  useEffect(() => {
    localStorage.setItem('payrollezy_role', currentRole);
  }, [currentRole]);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsDemoUser(false);
    localStorage.removeItem('payrollezy_demo_mode');
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string, fullName: string) => {
    setIsDemoUser(false);
    localStorage.removeItem('payrollezy_demo_mode');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', cred.user.uid);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName: fullName,
      createdAt: new Date().toISOString()
    };
    await setDoc(userDocRef, newProfile);
    setUserProfile(newProfile);
  };

  const loginWithGoogle = async () => {
    setIsDemoUser(false);
    localStorage.removeItem('payrollezy_demo_mode');
    await signInWithPopup(auth, googleProvider);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    if (isDemoUser) {
      setIsDemoUser(false);
      localStorage.removeItem('payrollezy_demo_mode');
      setActiveOrgId(null);
      return;
    }
    await firebaseSignOut(auth);
    setUserProfile(null);
    setActiveOrgId(null);
  };

  const startQuickDemo = () => {
    setIsDemoUser(true);
    localStorage.setItem('payrollezy_demo_mode', 'true');
    setCurrentRole('owner');
    setActiveOrgId('demo_apex_technologies');
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        activeOrgId,
        currentRole,
        isDemoUser,
        setActiveOrgId,
        setCurrentRole,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
        startQuickDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
