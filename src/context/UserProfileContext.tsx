"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  type UserProfile,
  getStoredProfile,
  setStoredProfile,
} from "@/lib/storage";

interface UserProfileContextValue {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  isStaff: boolean;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(
  undefined,
);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  // Use lazy initialization to read from localStorage without triggering
  // a cascading render. Defaults to "public" for SSR hydration compatibility.
  const [profile, setProfileState] = useState<UserProfile>(() =>
    getStoredProfile(),
  );

  function setProfile(next: UserProfile) {
    setProfileState(next);
    setStoredProfile(next);
  }

  return (
    <UserProfileContext.Provider
      value={{ profile, setProfile, isStaff: profile === "staff" }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return ctx;
}
