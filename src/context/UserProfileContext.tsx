"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  type UserProfile,
  getStoredProfile,
  getProfileServerSnapshot,
  subscribeToProfile,
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
  // useSyncExternalStore guarantees React uses one consistent snapshot
  // ("public", via getProfileServerSnapshot) for the entire hydration
  // pass — even under selective/out-of-order hydration — then swaps to
  // the real localStorage value in a single tear-free update afterward.
  const profile = useSyncExternalStore(
    subscribeToProfile,
    getStoredProfile,
    getProfileServerSnapshot,
  );

  function setProfile(next: UserProfile) {
    setStoredProfile(next); // notifies subscribers, triggering a re-render
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
