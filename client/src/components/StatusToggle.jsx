import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';

export const StatusToggle = ({ itemId, currentStatus, onStatusChange, compact = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    const nextStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';
    setIsUpdating(true);
    try {
      await onStatusChange(itemId, nextStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const isOpen = currentStatus === 'Open';

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        title={isOpen ? 'Mark as Resolved' : 'Reopen item'}
        className={`p-1.5 rounded-md border text-xs font-medium transition-all flex items-center gap-1 ${
          isOpen
            ? 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
        }`}
      >
        {isUpdating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isOpen ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Resolve</span>
          </>
        ) : (
          <>
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reopen</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
        isOpen
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm active:scale-95'
          : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-300 active:scale-95'
      }`}
    >
      {isUpdating ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isOpen ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Mark as Resolved
        </>
      ) : (
        <>
          <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
          Reopen Report
        </>
      )}
    </button>
  );
};
