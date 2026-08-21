"use client";

import { useUserProfile } from "@/context/UserProfileContext";

export default function ProfileToggle() {
  const { profile, setProfile } = useUserProfile();
  const isStaff = profile === "staff";

  return (
    <div
      role="group"
      aria-label="Viewing as"
      className="inline-flex items-center rounded-full bg-black/20 p-0.5 backdrop-blur-sm ring-1 ring-white/15"
    >
      <button
        type="button"
        onClick={() => setProfile("public")}
        aria-pressed={!isStaff}
        className={`rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide transition-colors sm:px-3.5 sm:py-1.5 sm:text-[11.5px] ${
          !isStaff
            ? "animate-chip-pop bg-white text-primary"
            : "text-white/70 hover:text-white"
        }`}
      >
        Public
      </button>
      <button
        type="button"
        onClick={() => setProfile("staff")}
        aria-pressed={isStaff}
        className={`rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide transition-colors sm:px-3.5 sm:py-1.5 sm:text-[11.5px] ${
          isStaff
            ? "animate-chip-pop bg-white text-primary"
            : "text-white/70 hover:text-white"
        }`}
      >
        Staff
      </button>
    </div>
  );
}
