"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentProfile, ClassLevel, BoardCode, StreamType, UserRole } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface RegisterParams {
  fullName: string;
  email: string;
  password?: string;
  classLevel?: ClassLevel;
  boardId?: string;
  preferredLanguage?: "english" | "hinglish" | "hindi" | "punjabi";
}

interface AuthResponse {
  success: boolean;
  error?: string;
  requiresEmailVerification?: boolean;
}

interface AuthContextType {
  user: StudentProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  isSupabaseActive: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (params: RegisterParams) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (newPassword: string) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  updateProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  completeOnboarding: (onboardingData: {
    classLevel: ClassLevel;
    boardId: string;
    stream?: StreamType;
    academicSession: string;
    selectedSubjectIds: string[];
    preferredLanguage: "english" | "hinglish" | "hindi" | "punjabi";
    targetExamDate: string;
  }) => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_DEMO_STUDENT: StudentProfile = {
  id: "demo-student-001",
  email: "aarav.sharma@eduverse.ai",
  fullName: "Aarav Sharma",
  role: "student",
  boardId: "cbse",
  classLevel: 10,
  stream: "general_10th",
  academicSession: "2026-2027",
  selectedSubjectIds: ["cbse-10-sci", "cbse-10-math", "cbse-10-sst", "cbse-10-eng"],
  preferredLanguage: "hinglish",
  targetExamDate: "2027-02-15",
  dailyGoalMinutes: 60,
  streakDays: 7,
  lastActiveDate: new Date().toISOString().split("T")[0],
  createdAt: "2026-08-01T10:00:00Z",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  useEffect(() => {
    const supabaseReady = isSupabaseConfigured();
    setIsSupabaseActive(supabaseReady);

    if (supabaseReady) {
      // 1. Initial session check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user);
        } else {
          loadLocalFallback();
        }
      });

      // 2. Auth state subscription
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await fetchSupabaseProfile(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("eduverse_user_profile");
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      loadLocalFallback();
    }
  }, []);

  const loadLocalFallback = () => {
    try {
      const stored = localStorage.getItem("eduverse_user_profile");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(DEFAULT_DEMO_STUDENT);
        localStorage.setItem("eduverse_user_profile", JSON.stringify(DEFAULT_DEMO_STUDENT));
      }
    } catch {
      setUser(DEFAULT_DEMO_STUDENT);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupabaseProfile = async (authUser: any) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profile && !error) {
        const studentProfile: StudentProfile = {
          id: profile.id,
          email: profile.email || authUser.email,
          fullName: profile.full_name || authUser.user_metadata?.full_name || "Student",
          role: profile.role || "student",
          boardId: profile.board || "cbse",
          classLevel: profile.class_level || 10,
          stream: profile.stream || "general_10th",
          academicSession: "2026-2027",
          selectedSubjectIds: ["cbse-10-sci", "cbse-10-math"],
          preferredLanguage: profile.preferred_language || "english",
          targetExamDate: "2027-02-15",
          dailyGoalMinutes: 60,
          streakDays: 5,
          lastActiveDate: new Date().toISOString().split("T")[0],
          createdAt: profile.created_at || authUser.created_at,
          avatarUrl: profile.avatar_url,
        };
        setUser(studentProfile);
        localStorage.setItem("eduverse_user_profile", JSON.stringify(studentProfile));
      } else {
        // Fallback to metadata
        const metadataProfile: StudentProfile = {
          ...DEFAULT_DEMO_STUDENT,
          id: authUser.id,
          email: authUser.email,
          fullName: authUser.user_metadata?.full_name || authUser.email.split("@")[0],
        };
        setUser(metadataProfile);
      }
    } catch (err) {
      console.warn("Error fetching Supabase profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIN METHOD
  const login = async (
    email: string,
    password?: string,
    role: UserRole = "student"
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          await fetchSupabaseProfile(data.user);
          return { success: true };
        }
      }

      // Demo/Fallback login
      const updatedUser: StudentProfile = {
        ...DEFAULT_DEMO_STUDENT,
        email,
        fullName: email.split("@")[0].replace(".", " ").toUpperCase(),
        role: email.includes("admin") ? "admin" : role,
      };
      setUser(updatedUser);
      localStorage.setItem("eduverse_user_profile", JSON.stringify(updatedUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to sign in." };
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER METHOD
  const register = async (params: RegisterParams): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && params.password) {
        const { data, error } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: {
            data: {
              full_name: params.fullName,
              class_level: params.classLevel || 10,
              board: params.boardId || "cbse",
              preferred_language: params.preferredLanguage || "english",
              role: "student",
            },
            emailRedirectTo: `${window.location.origin}/auth/login`,
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        // Check if email confirmation is required
        if (data.user && !data.session) {
          return {
            success: true,
            requiresEmailVerification: true,
          };
        }

        if (data.user) {
          await fetchSupabaseProfile(data.user);
          return { success: true };
        }
      }

      // Local demo registration
      const newUser: StudentProfile = {
        ...DEFAULT_DEMO_STUDENT,
        id: `student-${Date.now()}`,
        fullName: params.fullName,
        email: params.email,
        classLevel: params.classLevel || 10,
        boardId: params.boardId || "cbse",
        role: "student",
        selectedSubjectIds: ["cbse-10-sci", "cbse-10-math"],
      };
      setUser(newUser);
      localStorage.setItem("eduverse_user_profile", JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create account." };
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT METHOD
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } finally {
      setUser(null);
      localStorage.removeItem("eduverse_user_profile");
      setIsLoading(false);
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (error) return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send reset link." };
    }
  };

  // RESET PASSWORD
  const resetPassword = async (newPassword: string): Promise<AuthResponse> => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update password." };
    }
  };

  // RESEND VERIFICATION
  const resendVerification = async (email: string): Promise<AuthResponse> => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
        });
        if (error) return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to resend confirmation." };
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (updated: Partial<StudentProfile>): Promise<void> => {
    if (!user) return;
    const newProfile = { ...user, ...updated, updatedAt: new Date().toISOString() };
    setUser(newProfile);
    localStorage.setItem("eduverse_user_profile", JSON.stringify(newProfile));

    if (isSupabaseConfigured() && user.id && !user.id.startsWith("demo-")) {
      try {
        await supabase
          .from("profiles")
          .update({
            full_name: newProfile.fullName,
            class_level: newProfile.classLevel,
            board: newProfile.boardId,
            preferred_language: newProfile.preferredLanguage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (err) {
        console.warn("Supabase profile sync warning:", err);
      }
    }
  };

  // ONBOARDING
  const completeOnboarding = async (onboardingData: {
    classLevel: ClassLevel;
    boardId: string;
    stream?: StreamType;
    academicSession: string;
    selectedSubjectIds: string[];
    preferredLanguage: "english" | "hinglish" | "hindi" | "punjabi";
    targetExamDate: string;
  }): Promise<void> => {
    if (!user) return;
    const completed: StudentProfile = {
      ...user,
      ...onboardingData,
    };
    setUser(completed);
    localStorage.setItem("eduverse_user_profile", JSON.stringify(completed));

    if (isSupabaseConfigured() && user.id && !user.id.startsWith("demo-")) {
      try {
        await supabase
          .from("profiles")
          .update({
            class_level: onboardingData.classLevel,
            board: onboardingData.boardId,
            stream: onboardingData.stream,
            preferred_language: onboardingData.preferredLanguage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (err) {
        console.warn("Supabase onboarding sync warning:", err);
      }
    }
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem("eduverse_user_profile", JSON.stringify(updated));
  };

  const isOnboarded = Boolean(
    user &&
    user.boardId &&
    user.classLevel &&
    user.selectedSubjectIds &&
    user.selectedSubjectIds.length > 0
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        isSupabaseActive,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        resendVerification,
        updateProfile,
        completeOnboarding,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
