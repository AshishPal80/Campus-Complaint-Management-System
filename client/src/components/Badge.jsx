import React from 'react';
import { 
  Laptop, 
  BookOpen, 
  CreditCard, 
  Briefcase, 
  Sparkles, 
  Key, 
  HelpCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const CategoryIcon = ({ category, className = "w-3.5 h-3.5" }) => {
  switch (category) {
    case 'Electronics':
      return <Laptop className={className} />;
    case 'Books':
      return <BookOpen className={className} />;
    case 'ID Cards':
      return <CreditCard className={className} />;
    case 'Bags':
      return <Briefcase className={className} />;
    case 'Accessories':
      return <Sparkles className={className} />;
    case 'Keys':
      return <Key className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

export const TypeBadge = ({ type }) => {
  const isLost = type === 'Lost';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-tight ${
        isLost
          ? 'bg-rose-50 text-rose-700 border-rose-200/80 shadow-xs'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
      {type}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const isOpen = status === 'Open';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${
        isOpen
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-zinc-100 text-zinc-700 border-zinc-300'
      }`}
    >
      {isOpen ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Open
        </>
      ) : (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
          Resolved
        </>
      )}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200/70">
      <CategoryIcon category={category} className="w-3.5 h-3.5 text-zinc-600" />
      {category}
    </span>
  );
};
