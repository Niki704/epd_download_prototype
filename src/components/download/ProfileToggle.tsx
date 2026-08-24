"use client";

import { useUserProfile } from "@/context/UserProfileContext";

export default function ProfileToggle() {
  const { profile, setProfile } = useUserProfile();
  const isStaff = profile === "staff";

  return (
    <div
      role="group"
      aria-label="Viewing as"
      className="relative inline-grid grid-cols-2 items-center select-none rounded-full bg-black/20 p-0.5 backdrop-blur-sm ring-1 ring-white/15"
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-full bg-white transition-transform duration-300 ease-in-out ${
          isStaff ? "translate-x-full" : "translate-x-0"
        }`}
      />
      <button
        type="button"
        onClick={() => setProfile("public")}
        aria-pressed={!isStaff}
        className={`relative z-10 w-full rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide transition-colors duration-300 sm:px-3.5 sm:py-1.5 sm:text-[11.5px] ${
          !isStaff ? "text-primary" : "text-white/70 hover:text-white"
        }`}
      >
        Public
      </button>
      <button
        type="button"
        onClick={() => setProfile("staff")}
        aria-pressed={isStaff}
        className={`relative z-10 w-full rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide transition-colors duration-300 sm:px-3.5 sm:py-1.5 sm:text-[11.5px] ${
          isStaff ? "text-primary" : "text-white/70 hover:text-white"
        }`}
      >
        Staff
      </button>
    </div>
  );
}
