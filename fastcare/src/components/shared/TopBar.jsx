"use client";
import { Menu, Bell } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function TopBar({ title, subtitle, onMenuToggle }) {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-textmuted hover:text-textprimary hover:bg-surface2 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-textprimary font-semibold text-base lg:text-lg truncate">{title}</h1>
        {subtitle && (
          <p className="text-textmuted text-xs truncate">{subtitle}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-sm font-medium">{session?.user?.name || session?.user?.email}</span>
          <button onClick={() => signOut()} className="text-xs border px-3 py-1 rounded text-red-400 border-red-800 hover:bg-red-900/30">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
