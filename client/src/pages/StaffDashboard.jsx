import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { AnalyticsSummary } from '../components/AnalyticsSummary';
import { ItemTable } from '../components/ItemTable';
import { api } from '../services/api';
import { saveStoredItems, getStoredItems } from '../services/mockData';
import { 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  User, 
  ShieldAlert, 
  Filter, 
  Layers,
  Compass,
  FileSpreadsheet
} from 'lucide-react';

export const StaffDashboard = ({ onSwitchRole }) => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0, open: 0 });
  const [loading, setLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load items and statistics
  const loadData = async () => {
    setLoading(true);
    try {
      const itemsRes = await api.getItems({});
      const statsRes = await api.getStats();

      setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      setStats(statsRes.data || {});
      setIsMockData(Boolean(itemsRes.isMock));
    } catch (err) {
      console.error('StaffDashboard failed to load data:', err);
      setItems([]);
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle single status update
  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await api.updateStatus(itemId, newStatus);
      showToast(`Item ${itemId} status updated to "${newStatus}"`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to update item status', 'error');
    }
  };

  // Handle bulk status resolution
  const handleBulkResolve = async (itemIds = []) => {
    if (!itemIds || itemIds.length === 0) return;
    try {
      for (const id of itemIds) {
        await api.updateStatus(id, 'Resolved');
      }
      showToast(`Successfully marked ${itemIds.length} item(s) as Resolved!`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to perform bulk resolution', 'error');
    }
  };

  // Handle item removal / flag spam
  const handleFlagRemove = (itemId, itemTitle) => {
    if (window.confirm(`Are you sure you want to flag and remove "${itemTitle}" from campus records?`)) {
      try {
        const stored = getStoredItems();
        const updated = stored.filter(i => i._id !== itemId);
        saveStoredItems(updated);
        showToast(`Item "${itemTitle}" removed from moderation records.`, 'info');
        loadData();
      } catch (err) {
        showToast('Failed to remove item', 'error');
      }
    }
  };

  // Export CSV Simulation
  const handleExportCSV = () => {
    if (items.length === 0) {
      showToast('No items available to export', 'error');
      return;
    }

    const headers = ['ID', 'Title', 'Type', 'Category', 'Location', 'Date', 'Contact', 'Status'];
    const rows = items.map(i => [
      i._id,
      `"${(i.title || '').replace(/"/g, '""')}"`,
      i.type,
      i.category,
      `"${(i.location || '').replace(/"/g, '""')}"`,
      i.date,
      `"${(i.contactInfo || '').replace(/"/g, '""')}"`,
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_lost_found_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Campus Lost & Found CSV Audit report downloaded!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Toast Notification Floating Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
          <div className={`px-4 py-3 rounded-xl shadow-vercel-lg border flex items-center gap-3 text-sm font-medium ${
            toast.type === 'success' 
              ? 'bg-zinc-900 text-white border-zinc-800' 
              : toast.type === 'info'
              ? 'bg-indigo-900 text-white border-indigo-800'
              : 'bg-rose-900 text-white border-rose-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Staff Header Bar */}
      <header className="sticky top-0 z-30 bg-zinc-900 text-white border-b border-zinc-800 transition-all shadow-vercel-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Staff Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Campus Lost & Found
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono-cap font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Staff / Security Desk Portal
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Campus-wide administration, audit feed & resolution metrics
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
              title="Export report CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export Audit CSV</span>
            </button>

            {onSwitchRole && (
              <button
                onClick={() => onSwitchRole('student')}
                className="bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-zinc-700" />
                <span>Switch to Student View</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Vercel Mesh Background */}
      <section className="mesh-gradient-bg border-b border-zinc-200/80 py-8 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Mock API indicator */}
          {isMockData && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono-cap mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Staff Administrative Mode (Standalone Fallback Enabled)</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-none mb-2">
                Staff Moderation & Campus Analytics.
              </h1>
              <p className="text-sm text-zinc-600 max-w-2xl font-normal">
                Monitor open lost items, resolve recovered goods delivered to the campus security desk, and review hotspot metrics.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={loadData}
                className="px-3.5 py-2 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs font-semibold rounded-lg shadow-vercel-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                <span>Refresh Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Staff Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Section 1: Overview Analytics Summary Cards & Charts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900 font-mono-cap uppercase tracking-wider">
              Real-Time Campus Analytics
            </h2>
            <span className="text-xs text-zinc-400 font-mono-cap">
              Member 2 Staff Metric Engine
            </span>
          </div>
          <AnalyticsSummary items={items} stats={stats} />
        </section>

        {/* Section 2: Global Item Audit Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900 font-mono-cap uppercase tracking-wider">
              Global Item Moderation
            </h2>
            <span className="text-xs text-zinc-500 font-mono-cap">
              Click row dropdown for complete details & reporter contact
            </span>
          </div>
          <ItemTable
            items={items}
            onStatusChange={handleStatusChange}
            onBulkResolve={handleBulkResolve}
            onFlagRemove={handleFlagRemove}
            onRefresh={loadData}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-800" />
            <span className="font-semibold text-zinc-800">Campus Staff & Security Administration Portal</span>
          </div>
          <p className="font-mono-cap text-[11px] text-zinc-400">
            Vercel UI Design Standard • Member 2 Administration Module
          </p>
        </div>
      </footer>
    </div>
  );
};
