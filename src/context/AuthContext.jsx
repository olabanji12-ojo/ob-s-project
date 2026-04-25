// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sign up function
  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        
        // Update display name
        await updateProfile(user, {
          displayName: displayName
        });

        // Initialize user document in Firestore
        console.log("🏗️ AuthContext: Initializing profile in Firestore for", user.uid);
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            fullName: displayName,
            createdAt: serverTimestamp(),
            role: 'user' // Default role
          }, { merge: true });
          console.log("✅ AuthContext: Profile created successfully");
        } catch (dbErr) {
          console.error("❌ AuthContext: Failed to create profile in DB:", dbErr);
        }

        return user;
      });
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 🔹 Google Login
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("🚀 AuthContext: Starting Google Redirect Login...");
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google Redirect Error:", error);
      throw error;
    }
  };

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Listen for auth state changes
  useEffect(() => {
    // 1. Handle Redirect Result if coming back from Google
    const handleRedirect = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                const user = result.user;
                console.log("🏗️ AuthContext: Google Login detected, creating profile...", user.uid);
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    fullName: user.displayName,
                    createdAt: serverTimestamp(),
                }, { merge: true });
                console.log("✅ AuthContext: Google profile synced");
            }
        } catch (error) {
            console.error("Redirect Result Error:", error);
        }
    };
    handleRedirect();

    // 2. Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === 'admin');
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    signup,
    login,
    logout,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

