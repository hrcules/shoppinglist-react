import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../../services/firebase/firebase";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type AuthContextProps = {
  user: User | null;
  authLoading: boolean;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  signOut: () => void;
  signed: boolean;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth persists the user's session and restores it on app launch.
    // This is more reliable on installed mobile PWAs than relying on session cookies.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        setUser(user);

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            id: user.uid,
          });

          await setDoc(doc(db, "tasks", user.uid), {
            tasks: [],
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao entrar com Google:", error);
      });
  };

  const loginWithGithub = () => {
    const provider = new GithubAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        setUser(user);

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            id: user.uid,
          });

          await setDoc(doc(db, "tasks", user.uid), {
            tasks: [],
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao entrar com GitHub:", error);
      });
  };

  const signOut = () => {
    void firebaseSignOut(auth).catch((error) => {
      console.error("Erro ao sair da conta:", error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        loginWithGoogle,
        loginWithGithub,
        signed: !!user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
