import React from 'react';
import { Compass, Plus, ShieldAlert, CheckCircle, UserCheck } from 'lucide-react';

export const Navbar = ({ onOpenPostModal, stats }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-vercel-sm">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-zinc-900">
                Campus Lost & Found
              </span>
              <span className="bg-zinc-100 text-zinc-700 text-[10px] font-mono-cap font-semibold px-2 py-0.5 rounded-full border border-zinc-200">
                Student View
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Centralized item tracking & instant automated matching
            </p>
          </div>
        </div>

        {/* Quick Stats Pill Banner */}
        {stats && (
          <div className="hidden md:flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 px-3 py-1.5 rounded-full text-xs font-medium">
            <div className="flex items-center gap-1 text-zinc-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{stats.open || 0} Open</span>
            </div>
            <span className="text-zinc-300">|</span>
            <div className="flex items-center gap-1 text-emerald-700">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{stats.resolved || 0} Recovered</span>
            </div>
          </div>
        )}

        {/* Right CTA Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPostModal}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-vercel-sm hover:shadow-vercel-md active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Item</span>
          </button>
        </div>
      </div>
    </header>
  );
};
