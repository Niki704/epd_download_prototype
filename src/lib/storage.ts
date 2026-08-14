/**
 * Thin localStorage wrappers used for client-only, non-sensitive UI state:
 *  - which "profile" (public/staff) view is active
 *  - whether the search-suggestion chips have been dismissed, with a 15
 *    minute expiry after which they should reappear automatically
 *
 * All reads/writes are guarded for SSR (window undefined during server
 * render) and for corrupt/missing values, so callers never need try/catch.
 */

export type UserProfile = "public" | "staff";

const PROFILE_KEY = "epd:user-profile";
const SUGGESTIONS_DISMISSED_KEY = "epd:search-suggestions-dismissed-until";
const SUGGESTIONS_DISMISS_TTL_MS = 15 * 60 * 1000; // 15 minutes

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/* ---------------------------- user profile ---------------------------- */

export function getStoredProfile(): UserProfile {
  if (!isBrowser()) return "public";
  return window.localStorage.getItem(PROFILE_KEY) === "staff"
    ? "staff"
    : "public";
}

export function setStoredProfile(profile: UserProfile): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROFILE_KEY, profile);
}

/* ------------------------ search suggestions TTL ------------------------ */

/**
 * Returns the expiry timestamp (ms epoch) if suggestions are currently
 * dismissed, or null if they're not dismissed / the dismissal has expired.
 * Expired entries are cleaned up as a side effect.
 */
export function getSuggestionsDismissedUntil(): number | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(SUGGESTIONS_DISMISSED_KEY);
  if (!raw) return null;

  const expiresAt = Number(raw);
  if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) {
    window.localStorage.removeItem(SUGGESTIONS_DISMISSED_KEY);
    return null;
  }

  return expiresAt;
}

/** Marks suggestions as dismissed for the next 15 minutes. */
export function dismissSuggestions(): void {
  if (!isBrowser()) return;
  const expiresAt = Date.now() + SUGGESTIONS_DISMISS_TTL_MS;
  window.localStorage.setItem(SUGGESTIONS_DISMISSED_KEY, String(expiresAt));
}

/** Clears the dismissal immediately (used once the TTL timer fires). */
export function clearSuggestionsDismissed(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SUGGESTIONS_DISMISSED_KEY);
}
