// hooks/useAuth.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

// The simplified user object we will store
type SimpleUser = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
} | null;

type AuthContextType = {
  user: SimpleUser;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const USER_STORAGE_KEY = "userData";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SimpleUser>(null);
  const [loading, setLoading] = useState(true);

  // 🚀 App start → load from AsyncStorage only
  useEffect(() => {
    console.log("🔄 [Auth] useEffect mounted");

    const loadUser = async () => {
      console.log("📦 [Auth] Checking AsyncStorage...");

      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        console.log("📦 [Auth] Storage result:", storedUser);

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            console.log("✅ [Auth] User restored:", parsed);
          } catch (e) {
            console.warn("⚠️ [Auth] Failed to parse stored user, clearing it", e);
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
          }
        } else {
          setUser(null);
          console.log("❌ [Auth] No user in storage");
        }
      } catch (err) {
        console.error("💥 [Auth] Error loading user:", err);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("🏁 [Auth] Finished init → loading = false");
      }
    };

    loadUser();

    return () => {
      console.log("🛑 [Auth] useEffect unmounted");
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log("🔐 [Auth] Signing in...");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const simpleUser = {
        uid: result.user.uid,
        email: result.user.email ?? undefined,
        displayName: result.user.displayName ?? undefined,
        photoURL: result.user.photoURL ?? undefined,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(simpleUser));
      setUser(simpleUser);
      console.log("✅ [Auth] Sign in successful:", simpleUser);
    } catch (err) {
      console.error("❌ [Auth] Sign in error:", err);
      throw err;
    } finally {
      setLoading(false);
      console.log("🏁 [Auth] Sign in finished → loading=false");
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    console.log("📝 [Auth] Signing up...");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const simpleUser = {
        uid: result.user.uid,
        email: result.user.email ?? undefined,
        displayName: result.user.displayName ?? undefined,
        photoURL: result.user.photoURL ?? undefined,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(simpleUser));
      setUser(simpleUser);
      console.log("✅ [Auth] Sign up successful:", simpleUser);
    } catch (err) {
      console.error("❌ [Auth] Sign up error:", err);
      throw err;
    } finally {
      setLoading(false);
      console.log("🏁 [Auth] Sign up finished → loading=false");
    }
  };

  const logout = async () => {
    setLoading(true);
    console.log("🚪 [Auth] Logging out...");
    try {
      await signOut(auth).catch((e) => {
        console.warn("⚠️ [Auth] Firebase signOut failed (ignored):", e);
      });
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      console.log("✅ [Auth] Logged out, storage cleared");
    } catch (err) {
      console.error("❌ [Auth] Logout error:", err);
      throw err;
    } finally {
      setLoading(false);
      console.log("🏁 [Auth] Logout finished → loading=false");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
