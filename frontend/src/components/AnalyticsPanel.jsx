import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AnalyticsPanel({ linkId, link }) {
  const { apiCall } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!linkId) return;
    fetchAnalytics();
  }, [linkId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const res = await apiCall(`/api/analytics/${linkId}`);
      console.log('Fetched Analytics:', res);  // Log the response for debugging

      setAnalytics(res.analytics || []);
      setStats(res.stats || null);
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (!linkId) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-6 mt-6">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm mt-6">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">{link?.shortCode}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <Stat label="Total Clicks" value={stats?.totalClicks || 0} />
        <Stat label="Unique Countries" value={stats?.countries || 0} />
        <Stat label="Browsers" value={stats?.browsers || 0} />
        <Stat label="Devices" value={stats?.devices || 0} />
      </div>

      <Section title="Countries">
        {stats?.countryStats?.map((c) => (
          <Row key={c._id} label={c._id} value={c.count} />
        ))}
      </Section>

      <Section title="Browsers">
        {stats?.browserStats?.map((b) => (
          <Row key={b._id} label={b._id} value={b.count} />
        ))}
      </Section>

      <Section title="Devices">
        {stats?.deviceStats?.map((d) => (
          <Row key={d._id} label={d._id} value={d.count} />
        ))}
      </Section>

      <div className="p-6 border-t">
        <h3 className="font-semibold mb-4">Recent Clicks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Time</th>
                <th>Country</th>
                <th>Browser</th>
                <th>Device</th>
                <th>OS</th>
              </tr>
            </thead>
            <tbody>
              {analytics.slice(0, 10).map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="py-2">{new Date(a.timestamp).toLocaleString()}</td>
                  <td>{a.country}</td>
                  <td>{a.browser}</td>
                  <td>{a.device}</td>
                  <td>{a.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="px-6 pb-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-2">{children?.length > 0 ? children : <p className="text-gray-400 text-sm">No data</p>}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded">
      <span>{label || "Unknown"}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
