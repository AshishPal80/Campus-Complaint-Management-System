import React from 'react';
import { Search, X, Filter, MapPin, Tag } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../services/mockData';

export const SearchFilterBar = ({ filters, onFilterChange, onReset }) => {
  const handleTypeChange = (type) => {
    onFilterChange({ ...filters, type });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'All' ||
    filters.category !== 'All' ||
    filters.location !== 'All' ||
    filters.status !== 'Open';

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-vercel-sm space-y-4 mb-6 transition-all">
      {/* Top Row: Search Input & Location Dropdown & Active Filter Reset */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search items by keyword (e.g. wallet, earbuds, room 102)..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
          <select
            value={filters.location || 'All'}
            onChange={handleLocationChange}
            className="w-full text-xs py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-zinc-800 font-medium transition-all"
          >
            <option value="All">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 shrink-0 underline transition-colors px-1"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      {/* Second Row: Type & Status Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100">
        {/* Type Filter Pills (All / Lost / Found) */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <span className="text-[11px] font-mono-cap uppercase text-zinc-400 px-2 font-medium">Type:</span>
          {['All', 'Lost', 'Found'].map((t) => {
            const isActive = (filters.type || 'All') === t;
            return (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Status Filter Pills (Open / Resolved / All) */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <span className="text-[11px] font-mono-cap uppercase text-zinc-400 px-2 font-medium">Status:</span>
          {['Open', 'Resolved', 'All'].map((s) => {
            const isActive = (filters.status || 'Open') === s;
            return (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Third Row: Scrollable Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar scroll-smooth">
        <span className="text-[11px] font-mono-cap uppercase text-zinc-400 shrink-0 font-medium mr-1">Category:</span>
        {['All', ...CATEGORIES].map((cat) => {
          const isActive = (filters.category || 'All') === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 transition-all border ${
                isActive
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
