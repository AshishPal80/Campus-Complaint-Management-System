import React from 'react';
import { Compass, Plus, ShieldCheck, CheckCircle, User, Layers } from 'lucide-react';

export const Navbar = ({ onOpenPostModal, stats, currentRole = 'student', onSwitchRole }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-all shadow-xs">
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
              <span className={`text-[10px] font-mono-cap font-semibold px-2 py-0.5 rounded-full border ${
                currentRole === 'staff'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}>
                {currentRole === 'staff' ? 'Staff Portal' : 'Student View'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Centralized item tracking & instant automated matching
            </p>
          </div>
        </div>

        {/* Quick Stats Pill Banner */}
        {stats && (
          <div className="hidden lg:flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 px-3.5 py-1.5 rounded-full text-xs font-medium">
            <div className="flex items-center gap-1.5 text-zinc-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{stats.open || 0} Open Items</span>
            </div>
            <span className="text-zinc-300">|</span>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{stats.resolved || 0} Recovered</span>
            </div>
          </div>
        )}

        {/* Right Actions & Role Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Role Switcher Pill */}
          {onSwitchRole && (
            <div className="bg-zinc-100 p-1 rounded-full border border-zinc-200 flex items-center gap-1 text-xs">
              <button
                onClick={() => onSwitchRole('student')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  currentRole === 'student'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">Student</span>
              </button>
              <button
                onClick={() => onSwitchRole('staff')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  currentRole === 'staff'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Staff Portal</span>
              </button>
            </div>
          )}

          {/* Primary CTA Button for Student View */}
          {currentRole === 'student' && onOpenPostModal && (
            <button
              onClick={onOpenPostModal}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-vercel-sm hover:shadow-vercel-md active:scale-98 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report Item</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
