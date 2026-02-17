import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { LogOut, Plus, Sparkles, X, BarChart3, RefreshCw, Link2 } from "lucide-react";

import StatCard from "../components/StatCard";
import UrlTable from "../components/UrlTable";

export default function Dashboard() {
  const { user, apiCall, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [selectedLink, setSelectedLink] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  const [formData, setFormData] = useState({
    originalUrl: "",
    customAlias: "",
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [copyingId, setCopyingId] = useState(null);

  // ── Fetch links ────────────────────────────────────────────────
  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await apiCall("/api/links");
      setLinks(res?.links || []);
    } catch (err) {
      const message = err.message || "Failed to load your links";
      setFetchError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (user) fetchLinks();
  }, [fetchLinks, user]);

  // ── AI suggestions ─────────────────────────────────────────────
  useEffect(() => {
    if (formData.originalUrl.length < 12 || !formData.originalUrl.startsWith("http")) {
      setAiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const res = await apiCall("/api/ai/suggest-aliases", {
          method: "POST",
          body: JSON.stringify({ originalUrl: formData.originalUrl.trim() }),
        });
        setAiSuggestions(res?.aliases || []);
      } catch {
        // silent
      } finally {
        setSuggestLoading(false);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [formData.originalUrl, apiCall]);

  // ── Create link ────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.originalUrl.trim()) {
      setCreateError("Please enter a valid URL");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      const data = await apiCall("/api/links", {
        method: "POST",
        body: JSON.stringify({
          originalUrl: formData.originalUrl.trim(),
          customAlias: formData.customAlias.trim() || undefined,
        }),
      });
      toast.success("Link created! ✨");
      setLinks((prev) => [data.link, ...prev]);
      setFormData({ originalUrl: "", customAlias: "" });
      setAiSuggestions([]);
    } catch (err) {
      const message = err.message || "Failed to create short link";
      setCreateError(message);
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  // ── Copy link ──────────────────────────────────────────────────
  const copyToClipboard = async (url, id) => {
    try {
      setCopyingId(id);
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy failed");
    } finally {
      setCopyingId(null);
    }
  };

  // ── Analytics ──────────────────────────────────────────────────
  const handleAnalytics = async (linkId) => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      const res = await apiCall(`/api/links/analytics/${linkId}`);
      setAnalyticsData(res);
      const link = links.find((l) => l._id === linkId);
      setSelectedLink(link);
    } catch (err) {
      const message = err.message || "Failed to load analytics";
      setAnalyticsError(message);
      toast.error(message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const closeAnalytics = () => {
    setSelectedLink(null);
    setAnalyticsData(null);
    setAnalyticsError(null);
  };

  // ── Logout ─────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    //toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/70 to-purple-50/60">
      {/* Header – premium glass effect */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md">
              <Link2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
              IntelliLink Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97]"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        {/* Error banner */}
        {fetchError && (
          <div className="mb-10 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <svg className="h-7 w-7 text-red-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-lg font-semibold text-red-800">{fetchError}</p>
                <button
                  onClick={fetchLinks}
                  className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create card – elevated & glowing */}
        <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-8 md:p-10 mb-14 overflow-hidden">
          {/* Subtle glow overlay */}
          <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-30 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-800 bg-clip-text text-transparent">
                Create Short Link
              </h2>
            </div>

            {createError && (
              <div className="mb-6 bg-red-50/80 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-base shadow-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 pl-1">Long URL</label>
                <input
                  type="url"
                  required
                  value={formData.originalUrl}
                  onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                  placeholder="https://example.com/very/long/link/..."
                  className="w-full px-6 py-4 bg-white/70 border border-gray-300/80 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/40 outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>

              {suggestLoading && (
                <div className="flex items-center gap-3 text-indigo-600 text-sm font-medium">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
                  Generating smart suggestions...
                </div>
              )}

              {aiSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, customAlias: s })}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-full text-sm font-medium text-indigo-700 transition-all hover:shadow-sm hover:scale-[1.02]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 pl-1">Custom Alias (optional)</label>
                <input
                  type="text"
                  value={formData.customAlias}
                  onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
                  placeholder="your-custom-name"
                  className="w-full px-6 py-4 bg-white/70 border border-gray-300/80 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/40 outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <button
                disabled={creating || !formData.originalUrl.trim()}
                className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Creating...
                  </span>
                ) : (
                  "Create Short Link"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Table & Stats */}
        <UrlTable
          links={links}
          loading={loading}
          copyingId={copyingId}
          onCopy={copyToClipboard}
          onAnalytics={handleAnalytics}
        />

        {selectedLink && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAnalytics} />

            <div className="
              relative w-full max-w-4xl max-h-[92vh] overflow-y-auto
              bg-white/95 backdrop-blur-2xl border border-white/50
              rounded-3xl shadow-2xl p-8 sm:p-12
            ">
              <button
                onClick={closeAnalytics}
                className="absolute top-6 right-6 p-3 rounded-full hover:bg-gray-100/80 transition-all"
              >
                <X size={28} className="text-gray-700 hover:text-gray-900" />
              </button>

              <div className="flex items-center gap-5 mb-10">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-2xl shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-800 to-purple-900 bg-clip-text text-transparent">
                    /{selectedLink.shortCode || selectedLink._id?.slice(-8)}
                  </h2>
                  <p className="text-gray-600 mt-2 truncate max-w-2xl font-medium">
                    {selectedLink.originalUrl}
                  </p>
                </div>
              </div>

              {analyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="animate-spin h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-6" />
                  <p className="text-xl text-gray-700 font-medium">Loading analytics...</p>
                </div>
              ) : analyticsError ? (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 p-10 rounded-2xl text-center my-12 shadow-inner">
                  <p className="text-xl font-semibold text-red-800 mb-4">Failed to load analytics</p>
                  <p className="text-red-700 mb-8">{analyticsError}</p>
                  <button
                    onClick={() => handleAnalytics(selectedLink._id)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw size={20} />
                    Try Again
                  </button>
                </div>
              ) : analyticsData ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatBox label="Total Clicks" value={analyticsData.totalClicks || 0} color="indigo" />
                    <StatBox label="Unique Visitors" value={analyticsData.uniqueVisitors || 0} color="purple" />
                    {/* Add more beautiful stat boxes here */}
                  </div>

                  <div className="bg-gradient-to-br from-gray-50/70 to-white/70 p-8 rounded-2xl border border-gray-200/80 shadow-inner">
                    <h4 className="text-xl font-bold text-gray-800 mb-6">Detailed Analytics</h4>
                    <pre className="text-sm bg-gray-900/5 p-6 rounded-xl overflow-auto max-h-96 font-mono">
                      {JSON.stringify(analyticsData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-24 text-gray-700">
                  <BarChart3 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                  <p className="text-2xl font-semibold">No data yet</p>
                  <p className="text-lg mt-3 text-gray-600">Share your link and get clicks to see beautiful stats here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && links.length > 0 && <StatCard links={links} />}
      </main>
    </div>
  );
}

// StatBox component (enhanced)
function StatBox({ label, value, color }) {
  const colors = {
    indigo: "from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-200 shadow-indigo-100/50",
    purple: "from-purple-50 to-purple-100 text-purple-800 border-purple-200 shadow-purple-100/50",
  };

  return (
    <div className={`
      p-8 rounded-2xl border bg-gradient-to-br ${colors[color]}
      shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]
    `}>
      <p className="text-sm font-medium opacity-80 mb-2">{label}</p>
      <p className="text-4xl md:text-5xl font-extrabold">{value.toLocaleString()}</p>
    </div>
  );
}