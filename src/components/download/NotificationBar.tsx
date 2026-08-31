import type { ReactNode } from "react";
import { AlertTriangle, CircleAlert, Info } from "lucide-react";

interface NotificationBarProps {
  message: string;
  icon?: ReactNode;
  accentClassName: string;
  borderClassName: string;
  iconClassName: string;
}

function NotificationBar({
  message,
  icon,
  accentClassName,
  borderClassName,
  iconClassName,
}: NotificationBarProps) {
  return (
    <div
      className={`mx-auto mb-4 w-full max-w-5xl rounded-lg border px-4 py-3 shadow-sm ${borderClassName} ${accentClassName}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          {icon}
        </div>
        <p className="text-sm leading-6 text-current">{message}</p>
      </div>
    </div>
  );
}

export function InfoNotify({ message }: { message: string }) {
  return (
    <NotificationBar
      message={message}
      icon={<Info size={15} />}
      accentClassName="border-blue-200 bg-blue-50 text-blue-900"
      borderClassName="border-blue-200"
      iconClassName="bg-blue-100 text-blue-700"
    />
  );
}

export function WarningNotify({ message }: { message: string }) {
  return (
    <NotificationBar
      message={message}
      icon={<AlertTriangle size={15} />}
      accentClassName="border-yellow-200 bg-yellow-50 text-yellow-900"
      borderClassName="border-yellow-200"
      iconClassName="bg-yellow-100 text-yellow-700"
    />
  );
}

export function AlertNotify({ message }: { message: string }) {
  return (
    <NotificationBar
      message={message}
      icon={<CircleAlert size={15} />}
      accentClassName="border-red-200 bg-red-50 text-red-900"
      borderClassName="border-red-200"
      iconClassName="bg-red-100 text-red-700"
    />
  );
}
