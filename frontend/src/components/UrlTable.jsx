import { BarChart2 } from "lucide-react";

export default function UrlTable({
  links = [],
  loading = false,
  copyingId = null,
  onCopy = () => {},
  onAnalytics = () => {}, // NEW: analytics handler
}) {

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
        Loading links...
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
        No links created yet
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b font-semibold flex justify-between">
        <span>Your Links</span>
        <span className="text-sm text-gray-400">
          Total: {links.length}
        </span>
      </div>

      {/* Links List */}
      <ul>
        {links.map((link) => {

          const id = link._id || link.id;

          return (
            <li
              key={id}
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >

              <div className="flex justify-between items-center gap-4">

                {/* URL Info */}
                <div className="flex-1 min-w-0">

                  {/* Short URL */}
                  <p className="font-medium text-blue-600 truncate">
                    {link.shortUrl}
                  </p>

                  {/* Original URL */}
                  <p className="text-sm text-gray-500 truncate">
                    {link.originalUrl}
                  </p>

                  {/* Clicks */}
                  <div className="text-xs text-gray-400 mt-1">
                    Clicks: <span className="font-medium">{link.clicks || 0}</span>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">

                  {/* Copy */}
                  <button
                    onClick={() => onCopy(link.shortUrl, id)}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                  >
                    {copyingId === id ? "Copying..." : "Copy"}
                  </button>

                  {/* Open */}
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Open
                  </a>

                  {/* Analytics */}
                  <button
                    onClick={() => onAnalytics(id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm flex items-center gap-1"
                  >
                    <BarChart2 size={16} />
                    Analytics
                  </button>

                </div>

              </div>

            </li>
          );
        })}
      </ul>

    </div>
  );
}
