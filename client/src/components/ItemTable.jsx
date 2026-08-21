import React, { useState } from 'react';
import { 
  TypeBadge, 
  CategoryBadge, 
  StatusBadge 
} from './Badge';
import { StatusToggle } from './StatusToggle';
import { CATEGORIES, LOCATIONS } from '../services/mockData';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Eye, 
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  MapPin,
  X
} from 'lucide-react';

export const ItemTable = ({ 
  items = [], 
  onStatusChange, 
  onBulkResolve,
  onFlagRemove,
  onRefresh
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sorting State
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'title-asc'

  // Table Selection State for Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Expanded Row state
  const [expandedId, setExpandedId] = useState(null);

  // Copy Contact Feedback
  const [copiedId, setCopiedId] = useState(null);

  // Filter logic
  const filteredItems = safeItems.filter(item => {
    if (!item) return false;

    if (typeFilter !== 'All' && item.type !== typeFilter) return false;
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (locationFilter !== 'All' && item.location !== locationFilter) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const loc = (item.location || '').toLowerCase();
      const contact = (item.contactInfo || '').toLowerCase();
      const id = (item._id || '').toLowerCase();
      return title.includes(term) || desc.includes(term) || loc.includes(term) || contact.includes(term) || id.includes(term);
    }

    return true;
  });

  // Sorting logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
    }
    if (sortBy === 'date-asc') {
      return new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0);
    }
    if (sortBy === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(sortedItems.map(i => i._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCopyContact = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isAllSelected = sortedItems.length > 0 && selectedIds.length === sortedItems.length;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl shadow-vercel-sm overflow-hidden transition-all">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-zinc-200/80 space-y-4 bg-zinc-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
              <span>Campus Audit & Moderation Feed</span>
              <span className="bg-zinc-100 text-zinc-700 text-xs font-mono-cap px-2.5 py-0.5 rounded-full border border-zinc-200">
                {sortedItems.length} items
              </span>
            </h3>
            <p className="text-xs text-zinc-500">
              Manage reports across all campus locations, resolve claimed items, and audit contacts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh item list"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Sort Select Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-zinc-800 outline-none cursor-pointer text-xs"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, location, or student details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-medium outline-none focus:border-zinc-900"
          >
            <option value="All">All Types (Lost & Found)</option>
            <option value="Lost">Lost Only</option>
            <option value="Found">Found Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-medium outline-none focus:border-zinc-900"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 font-medium outline-none focus:border-zinc-900"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open Only</option>
            <option value="Resolved">Resolved Only</option>
          </select>
        </div>

        {/* Floating / Active Bulk Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-zinc-900 text-white p-3 rounded-lg flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-200 font-mono-cap flex items-center justify-center font-bold">
                {selectedIds.length}
              </span>
              <span>item(s) selected for bulk moderation</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onBulkResolve(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Selected as Resolved</span>
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-md transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-100/70 border-b border-zinc-200 text-[11px] font-mono-cap font-semibold text-zinc-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4">Item & Description</th>
              <th className="py-3 px-4">Type & Category</th>
              <th className="py-3 px-4">Location & Date</th>
              <th className="py-3 px-4">Student Contact</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80 text-xs">
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-zinc-500">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-semibold text-zinc-800">No items match your moderation filters</p>
                  <p className="text-xs text-zinc-500 mt-1">Try resetting search parameters or selecting "All Statuses".</p>
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => {
                const isSelected = selectedIds.includes(item._id);
                const isExpanded = expandedId === item._id;

                return (
                  <React.Fragment key={item._id}>
                    <tr className={`hover:bg-zinc-50/80 transition-colors ${isSelected ? 'bg-zinc-50' : ''}`}>
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item._id)}
                          className="rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Item Details */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-xs">
                          <span className="font-semibold text-zinc-900 text-sm block tracking-tight line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-zinc-500 line-clamp-1 font-mono-cap">
                            ID: {item._id}
                          </span>
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <TypeBadge type={item.type} />
                          <CategoryBadge category={item.category} />
                        </div>
                      </td>

                      {/* Location & Date */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 text-zinc-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate max-w-[140px] font-medium">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono-cap">
                            <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 max-w-[180px]">
                          <span className="truncate text-zinc-700 font-medium" title={item.contactInfo}>
                            {item.contactInfo}
                          </span>
                          <button
                            onClick={() => handleCopyContact(item._id, item.contactInfo)}
                            className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors shrink-0"
                            title="Copy Contact Details"
                          >
                            {copiedId === item._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <StatusToggle
                            itemId={item._id}
                            currentStatus={item.status}
                            onStatusChange={onStatusChange}
                            compact={true}
                          />

                          <button
                            onClick={() => setExpandedId(isExpanded ? null : item._id)}
                            className="p-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
                            title={isExpanded ? 'Collapse' : 'View full report details'}
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => onFlagRemove(item._id, item.title)}
                            className="p-1.5 rounded-md border border-zinc-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                            title="Flag or delete spam item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Details Sub-row */}
                    {isExpanded && (
                      <tr className="bg-zinc-50/90 border-b border-zinc-200/80">
                        <td colSpan="7" className="p-4 sm:p-5">
                          <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                              <span className="text-xs font-mono-cap font-semibold text-zinc-500 uppercase">
                                Full Report Breakdown & Description
                              </span>
                              <span className="text-[11px] text-zinc-400 font-mono-cap">
                                Registered: {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.date}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-800 leading-relaxed font-normal">
                              {item.description || 'No detailed description provided by reporter.'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-600 border-t border-zinc-100">
                              <div>
                                <span className="font-semibold text-zinc-900 block mb-0.5">Location Note:</span>
                                <span>{item.location}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-zinc-900 block mb-0.5">Reporter Contact:</span>
                                <span className="font-mono-cap text-zinc-800">{item.contactInfo}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Stats */}
      <div className="p-4 border-t border-zinc-200/80 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
        <span className="font-mono-cap">
          Showing {sortedItems.length} of {safeItems.length} total items
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {safeItems.filter(i => i.status === 'Resolved').length} Resolved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {safeItems.filter(i => i.status === 'Open').length} Open
          </span>
        </div>
      </div>
    </div>
  );
};
