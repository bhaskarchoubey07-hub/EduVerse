"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentProfile, ClassLevel, BoardCode, StreamType, UserRole } from "@/types";

interface AuthContextType {
  user: StudentProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (fullName: string, email: string) => Promise<boolean>;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  completeOnboarding: (onboardingData: {
    classLevel: ClassLevel;
    boardId: string;
    stream?: StreamType;
    academicSession: string;
    selectedSubjectIds: string[];
    preferredLanguage: "english" | "hinglish" | "hindi" | "punjabi";
    targetExamDate: string;
  }) => void;
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
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted profile from localStorage or initialize with demo student
    try {
      const stored = localStorage.getItem("eduverse_user_profile");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(DEFAULT_DEMO_STUDENT);
        localStorage.setItem("eduverse_user_profile", JSON.stringify(DEFAULT_DEMO_STUDENT));
      }
    } catch (e) {
      setUser(DEFAULT_DEMO_STUDENT);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, role: UserRole = "student"): Promise<boolean> => {
    setIsLoading(true);
    try {
      const updatedUser: StudentProfile = {
        ...DEFAULT_DEMO_STUDENT,
        email,
        fullName: email.split("@")[0].replace(".", " ").toUpperCase(),
        role: email.includes("admin") ? "admin" : role,
      };
      setUser(updatedUser);
      localStorage.setItem("eduverse_user_profile", JSON.stringify(updatedUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser: StudentProfile = {
        ...DEFAULT_DEMO_STUDENT,
        id: `student-${Date.now()}`,
        fullName,
        email,
        role: "student",
        selectedSubjectIds: [],
      };
      setUser(newUser);
      localStorage.setItem("eduverse_user_profile", JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduverse_user_profile");
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated, updatedAt: new Date().toISOString() };
    setUser(newProfile);
    localStorage.setItem("eduverse_user_profile", JSON.stringify(newProfile));
  };

  const completeOnboarding = (onboardingData: {
    classLevel: ClassLevel;
    boardId: string;
    stream?: StreamType;
    academicSession: string;
    selectedSubjectIds: string[];
    preferredLanguage: "english" | "hinglish" | "hindi" | "punjabi";
    targetExamDate: string;
  }) => {
    if (!user) return;
    const completed: StudentProfile = {
      ...user,
      ...onboardingData,
    };
    setUser(completed);
    localStorage.setItem("eduverse_user_profile", JSON.stringify(completed));
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
        login,
        logout,
        register,
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
