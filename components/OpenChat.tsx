"use client";
export default function OpenChat({ children, className = "", voice = false, msg, label }: { children: React.ReactNode; className?: string; voice?: boolean; msg?: string; label?: string }) {
  return <button aria-label={label} className={className} onClick={() => window.dispatchEvent(voice ? new Event("open-voice") : new CustomEvent("open-chat", { detail: msg }))}>{children}</button>;
}
