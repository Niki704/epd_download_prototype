import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { AlertTriangle, CircleAlert, Info } from "lucide-react";
import {
  isNotificationDismissed,
  getNotificationDismissedServerSnapshot,
  subscribeToNotificationDismissed,
  dismissNotification,
  clearNotificationDismissed,
  getNotificationDismissedUntil,
} from "@/lib/storage";

interface NotificationBarProps {
  message: string;
  icon?: ReactNode;
  accentClassName: string;
  borderClassName: string;
  iconClassName: string;
  showDismiss?: boolean;
}

function NotificationBar({
  message,
  icon,
  accentClassName,
  borderClassName,
  iconClassName,
  showDismiss = true,
}: NotificationBarProps) {
  // useSyncExternalStore guarantees one consistent snapshot (false, via
  // getNotificationDismissedServerSnapshot) for the entire hydration
  // pass, then swaps to the real persisted value afterward — avoiding
  // the tear/mismatch a plain useState+useEffect pair can hit under
  // selective/out-of-order hydration.
  const isDismissed = useSyncExternalStore(
    subscribeToNotificationDismissed,
    () => isNotificationDismissed(message),
    getNotificationDismissedServerSnapshot,
  );

  // Auto-restore notification the moment the 15 minute window elapses,
  // even if the user never reloads the page. This is a timer side
  // effect, not state derivation, so it stays in a useEffect.
  useEffect(() => {
    const expiresAt = getNotificationDismissedUntil(message);
    if (!expiresAt) return;

    const remainingMs = expiresAt - Date.now();
    const timer = setTimeout(() => {
      clearNotificationDismissed(message);
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [isDismissed, message]);

  // If dismissed, don't render
  if (isDismissed) {
    return null;
  }

  function handleDismiss() {
    dismissNotification(message);
  }

  return (
    <div
      className={`mx-auto mb-3 w-full max-w-5xl rounded-md border-l-4 px-4 py-2.5 ${borderClassName} ${accentClassName}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex shrink-0 items-center justify-center ${iconClassName}`}
          >
            {icon}
          </div>
          <p className="text-sm leading-5 text-current">{message}</p>
        </div>
        {showDismiss && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="shrink-0 text-xs font-medium transition-colors hover:opacity-70"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

export function InfoNotify({ message }: { message: string }) {
  return (
    <NotificationBar
      message={message}
      icon={<Info size={18} strokeWidth={2} />}
      accentClassName="bg-blue-50 text-blue-900"
      borderClassName="border-blue-400"
      iconClassName="text-blue-600"
      showDismiss={false}
    />
  );
}

export function WarningNotify({ message }: { message: string }) {
  return (
    <NotificationBar
      message={message}
      icon={<AlertTriangle size={18} strokeWidth={2} />}
      accentClassName="bg-amber-50 text-amber-900"
      borderClassName="border-amber-400"
      iconClassName="text-amber-600"
      showDismiss={true}
    />
  );
}

export function AlertNotify({ message }: { message: string }) {
  return (
    <NotificationBar
      message={message}
      icon={<CircleAlert size={18} strokeWidth={2} />}
      accentClassName="bg-red-50 text-red-900"
      borderClassName="border-red-400"
      iconClassName="text-red-600"
      showDismiss={true}
    />
  );
}
