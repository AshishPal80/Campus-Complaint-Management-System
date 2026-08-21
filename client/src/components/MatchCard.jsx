import React from 'react';
import { TypeBadge, CategoryBadge, StatusBadge } from './Badge';
import { MapPin, Calendar, Mail, Phone, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

export const MatchCard = ({ match, onResolveItem }) => {
  const { item, score, reasons } = match;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-vercel-sm hover:shadow-vercel-md transition-all space-y-3 relative overflow-hidden group">
      {/* Top Banner: Match Score & Reasons */}
      <div className="flex items-center justify-between gap-2 bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-lg text-emerald-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {score}%
          </div>
          <div>
            <span className="text-xs font-semibold tracking-tight text-emerald-950 block">
              Match Confidence
            </span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {reasons.map((reason, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-emerald-100/80 text-emerald-800 px-1.5 py-0.2 rounded font-mono-cap"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
      </div>

      {/* Item Title & Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TypeBadge type={item.type} />
            <CategoryBadge category={item.category} />
          </div>
          <h4 className="text-sm font-semibold text-zinc-900 tracking-tight leading-snug">
            {item.title}
          </h4>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* Location & Date Metadata */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Reported {item.date}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 leading-relaxed">
        {item.description}
      </p>

      {/* Contact Info & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-zinc-100">
        <div className="text-xs text-zinc-700 font-mono-cap truncate max-w-[240px]">
          <span className="text-zinc-400 uppercase text-[10px] block font-medium">Contact Finder / Reporter:</span>
          <span className="font-semibold text-zinc-800">{item.contactInfo || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(item.contactInfo || '').includes('@') && (
            <a
              href={`mailto:${(item.contactInfo || '').split('|')[0].trim()}`}
              className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-md flex items-center gap-1 transition-colors"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5 text-zinc-600" />
              <span>Email</span>
            </a>
          )}

          {item.status === 'Open' && onResolveItem && (
            <button
              onClick={() => onResolveItem(item._id)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-md flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Claim & Recover</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
