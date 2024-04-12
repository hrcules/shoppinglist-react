import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../../services/firebase/firebase";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export type AuthContextProps = {
  user: User | null;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  signOut: () => void;
  signed: boolean;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadStoreAuth = () => {
      const sessionToken = Cookies.get("@AuthFirebase:token");
      const sessionUser = Cookies.get("@AuthFirebase:user");

      if (sessionToken && sessionUser) {
        setUser(JSON.parse(sessionUser));
      }
    };

    loadStoreAuth();
  }, []);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        setUser(user);

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          Cookies.set("@AuthFirebase:token", token!);
          Cookies.set("@AuthFirebase:user", JSON.stringify(user));
        } else {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            id: user.uid,
          });

          await setDoc(doc(db, "tasks", user.uid), {
            tasks: [],
          });

          Cookies.set("@AuthFirebase:token", token!);
          Cookies.set("@AuthFirebase:user", JSON.stringify(user));
        }
      })
      .catch(() => {
        console.error("Error login with Google");
      });
  };
  const loginWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        setUser(user);

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          Cookies.set("@AuthFirebase:token", token!);
          Cookies.set("@AuthFirebase:user", JSON.stringify(user));
        } else {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            id: user.uid,
          });

          await setDoc(doc(db, "tasks", user.uid), {
            tasks: [],
          });

          Cookies.set("@AuthFirebase:token", token!);
          Cookies.set("@AuthFirebase:user", JSON.stringify(user));
        }
      })
      .catch(() => {
        console.error("Error login with Github");
      });
  };

  const signOut = () => {
    Cookies.remove("@AuthFirebase:token");
    Cookies.remove("@AuthFirebase:user");

    setUser(null);
    return <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
