import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { TypeBadge, CategoryBadge, StatusBadge, CategoryIcon } from '../components/Badge';
import { StatusToggle } from '../components/StatusToggle';
import { PostItemModal } from '../components/PostItemModal';
import { MatchCard } from '../components/MatchCard';
import { api } from '../services/api';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  User, 
  Search, 
  Plus, 
  Layers, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Compass
} from 'lucide-react';

export const StudentDashboard = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0, open: 0 });
  const [loading, setLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    category: 'All',
    location: 'All',
    status: 'Open'
  });

  // Active Tab: 'feed' (All Campus Items) vs 'my-items' (Student's items)
  const [activeTab, setActiveTab] = useState('feed');

  // Modals & Drawers State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedMatchItem, setSelectedMatchItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Toast Feedback State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load items and stats
  const loadData = async () => {
    setLoading(true);
    try {
      const itemsRes = await api.getItems(filters);
      const statsRes = await api.getStats();

      setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      setStats(statsRes.data || {});
      setIsMockData(Boolean(itemsRes.isMock));
    } catch (err) {
      console.error('Failed to load data:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // Handle Post Item Submit
  const handlePostItem = async (newItemData) => {
    try {
      const res = await api.createItem(newItemData);
      showToast(`Successfully reported "${newItemData.title}"!`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to post item. Please try again.', 'error');
    }
  };

  // Handle Status Toggle
  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await api.updateStatus(itemId, newStatus);
      showToast(`Item status updated to ${newStatus}`, 'info');
      loadData();
      
      // If updating status inside matches modal, update matches as well
      if (selectedMatchItem && selectedMatchItem._id === itemId) {
        setSelectedMatchItem({ ...selectedMatchItem, status: newStatus });
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Handle View Matches
  const handleViewMatches = async (item) => {
    setSelectedMatchItem(item);
    setLoadingMatches(true);
    try {
      const matchRes = await api.getMatches(item._id);
      setMatches(Array.isArray(matchRes.data) ? matchRes.data : []);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Reset all search & filter options
  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      category: 'All',
      location: 'All',
      status: 'Open'
    });
  };

  const safeItems = Array.isArray(items) ? items : [];
  // Student's items (In MVP, filtered by contact or lost type)
  const myItems = safeItems.filter(i => {
    if (!i) return false;
    const contact = (i.contactInfo || '').toLowerCase();
    return contact.includes('ashish') || contact.includes('student') || i.type === 'Lost';
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Navbar */}
      <Navbar onOpenPostModal={() => setIsPostModalOpen(true)} stats={stats} />

      {/* Toast Notification Floating Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
          <div className={`px-4 py-3 rounded-xl shadow-vercel-lg border flex items-center gap-3 text-sm font-medium ${
            toast.type === 'success' ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-rose-900 text-white border-rose-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section with Atmospheric Vercel Mesh Gradient */}
      <section className="mesh-gradient-bg border-b border-zinc-200/80 py-10 md:py-14 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          {/* Mock Mode Notice Pill if backend server is not connected */}
          {isMockData && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono-cap mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Running with Local Campus Mock API (Express Backend Offline)</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-mono-cap mb-3 font-medium shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Automated Matcher Enabled
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-none mb-3">
                Campus Lost & Found Portal.
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 max-w-2xl font-normal leading-relaxed">
                Report lost items, browse campus recovery feeds, and receive automated match recommendations based on category, location, and key descriptors.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/80 p-3 rounded-xl shadow-vercel-sm text-center">
                <span className="block text-2xl font-bold text-zinc-900 tracking-tight">{stats.open || 0}</span>
                <span className="text-[11px] font-mono-cap text-zinc-500 font-medium uppercase">Open Items</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/80 p-3 rounded-xl shadow-vercel-sm text-center">
                <span className="block text-2xl font-bold text-emerald-600 tracking-tight">{stats.resolved || 0}</span>
                <span className="text-[11px] font-mono-cap text-zinc-500 font-medium uppercase">Recovered</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/80 p-3 rounded-xl shadow-vercel-sm text-center">
                <span className="block text-2xl font-bold text-rose-600 tracking-tight">{stats.lost || 0}</span>
                <span className="text-[11px] font-mono-cap text-zinc-500 font-medium uppercase">Lost Items</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs (Campus Feed vs My Reported Items) */}
        <div className="flex items-center justify-between border-b border-zinc-200 mb-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('feed')}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'feed'
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Campus Feed</span>
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-zinc-100 text-zinc-700 font-mono-cap">
                {safeItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('my-items')}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                activeTab === 'my-items'
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Reports</span>
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-zinc-100 text-zinc-700 font-mono-cap">
                {myItems.length}
              </span>
            </button>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-zinc-900 text-white px-3 py-1.5 rounded-lg shadow-xs hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Item</span>
          </button>
        </div>

        {/* Search & Filter Component */}
        <SearchFilterBar
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Loading Spinner State */}
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-7 h-7 text-zinc-400 animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-500 font-mono-cap">Fetching campus items...</p>
          </div>
        ) : (
          <>
            {/* Displaying Items Grid */}
            {activeTab === 'feed' ? (
              /* Global Campus Feed Grid */
              safeItems.length === 0 ? (
                <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center max-w-md mx-auto shadow-vercel-sm my-8">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-1">No items found</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    No reported items matched your current search filters or category.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {safeItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm hover:shadow-vercel-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <TypeBadge type={item.type} />
                            <CategoryBadge category={item.category} />
                          </div>
                          <StatusBadge status={item.status} />
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-zinc-900 tracking-tight leading-snug mb-2 group-hover:text-zinc-800">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-zinc-600 line-clamp-3 mb-4 leading-relaxed bg-zinc-50/70 p-2.5 rounded-lg border border-zinc-100">
                          {item.description}
                        </p>
                      </div>

                      <div>
                        {/* Location & Date Footer */}
                        <div className="space-y-1.5 pt-3 border-t border-zinc-100 text-xs text-zinc-500 font-medium mb-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>Date: {item.date}</span>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2">
                          <StatusToggle
                            itemId={item._id}
                            currentStatus={item.status}
                            onStatusChange={handleStatusChange}
                            compact={true}
                          />

                          {item.type === 'Lost' && item.status === 'Open' && (
                            <button
                              onClick={() => handleViewMatches(item)}
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Matches</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* My Reported Items Tab */
              myItems.length === 0 ? (
                <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center max-w-md mx-auto shadow-vercel-sm my-8">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-1">No reported items yet</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    You haven't posted any lost or found item reports yet.
                  </p>
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Report an Item Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <TypeBadge type={item.type} />
                          <CategoryBadge category={item.category} />
                          <StatusBadge status={item.status} />
                        </div>
                        <h3 className="text-base font-semibold text-zinc-900">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-600 max-w-2xl">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {item.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        <StatusToggle
                          itemId={item._id}
                          currentStatus={item.status}
                          onStatusChange={handleStatusChange}
                        />

                        {item.type === 'Lost' && item.status === 'Open' && (
                          <button
                            onClick={() => handleViewMatches(item)}
                            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Check Matches</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Post Item Modal Form */}
      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmitSuccess={handlePostItem}
      />

      {/* Automated Matches Modal / Drawer */}
      {selectedMatchItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fadeIn">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-vercel-lg flex flex-col max-h-[85vh]">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-semibold text-zinc-900">
                    Automated Match Recommendations
                  </h3>
                </div>
                <p className="text-xs text-zinc-500">
                  Matching potential found items for: <span className="font-semibold text-zinc-800">"{selectedMatchItem.title}"</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedMatchItem(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {loadingMatches ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-6 h-6 text-zinc-400 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-zinc-500 font-mono-cap">Running similarity matcher...</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-8 text-center">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-zinc-900 mb-1">No strong matches found yet</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    We couldn't find an existing found item report matching this category and location. New reports are scanned automatically.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-zinc-500 font-mono-cap">
                    Found {matches.length} matching report(s) ordered by score confidence:
                  </p>
                  {matches.map((match, idx) => (
                    <MatchCard
                      key={idx}
                      match={match}
                      onResolveItem={(id) => handleStatusChange(selectedMatchItem._id, 'Resolved')}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1 font-mono-cap">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Matches updated in real time
              </span>
              <button
                onClick={() => setSelectedMatchItem(null)}
                className="px-4 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-zinc-800" />
            <span className="font-semibold text-zinc-800">Campus Lost & Found System</span>
          </div>
          <p className="font-mono-cap text-[11px] text-zinc-400">
            Designed with Vercel UI guidelines • Independent Member 1 Module
          </p>
        </div>
      </footer>
    </div>
  );
};
