import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { apiCall, logout } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [formData, setFormData] = useState({ originalUrl: '', customAlias: '' });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch user's links on mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await apiCall('/api/links');
        setLinks(data.links || []);
        setFetchError(null);
      } catch (err) {
        console.error('Failed to load links:', err);
        setFetchError('Could not load your links. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [apiCall]);

  // Fetch AI suggestions when user types a URL (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.originalUrl.length > 10) {
        setSuggestLoading(true);
        setAiSuggestions([]); // clear old suggestions
        try {
          const res = await apiCall('/api/ai/suggest-aliases', {
            method: 'POST',
            body: JSON.stringify({ originalUrl: formData.originalUrl }),
          });
          setAiSuggestions(res.aliases || []);
        } catch (err) {
          console.log('AI suggestion failed:', err);
          toast.error('Could not generate AI suggestions');
        } finally {
          setSuggestLoading(false);
        }
      } else {
        setAiSuggestions([]);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [formData.originalUrl, apiCall]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const data = await apiCall('/api/links', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      toast.success('Link created successfully!');
      setLinks([data.link, ...links]); // optimistic UI update
      setFormData({ originalUrl: '', customAlias: '' });
      setAiSuggestions([]);
    } catch (err) {
      // error already shown by apiCall
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {fetchError}
          </div>
        )}

        {/* Create Link Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Short Link</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long URL
              </label>
              <input
                type="url"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/very/long/url"
                required
              />
              {suggestLoading && (
                <p className="mt-2 text-sm text-gray-500">Generating AI suggestions...</p>
              )}
              {aiSuggestions.length > 0 && !suggestLoading && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 font-medium">AI Suggestions:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aiSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, customAlias: sug })}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Alias (optional)
              </label>
              <input
                type="text"
                value={formData.customAlias}
                onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="my-custom-link"
              />
            </div>

            <button
              type="submit"
              disabled={creating || loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Shorten URL'}
            </button>
          </form>
        </div>

        {/* Links List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Links</h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading your links...
            </div>
          ) : fetchError ? (
            <div className="p-10 text-center text-red-600">
              {fetchError}
            </div>
          ) : links.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No links yet. Create one above!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {links.map((link) => (
                <li key={link.id || link._id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {link.shortUrl}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        → {link.originalUrl}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>Clicks: {link.clicks}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                        {link.category && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {link.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}