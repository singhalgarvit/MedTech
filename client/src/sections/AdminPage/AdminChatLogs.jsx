import React, { useEffect, useState } from "react";
import { getChatLogsForAdmin } from "../../services/chatService";
import { TableSkeleton } from "../../components/Skeleton";

function AdminChatLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getChatLogsForAdmin();
        if (!cancelled) setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load chat logs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chatbot logs</h2>
      <p className="text-gray-600 mb-4">
        Queries users asked the AI and the answers they received.
      </p>

      {loading && <TableSkeleton rows={5} cols={3} />}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && !error && logs.length === 0 && (
        <p className="text-gray-500">No chatbot activity yet.</p>
      )}
      {!loading && !error && logs.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Query
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  AI answer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={`${log.userId}-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    <div>{log.userName ?? "—"}</div>
                    <a
                      href={`mailto:${log.userEmail}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {log.userEmail ?? "—"}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 max-w-[320px]" title={log.query}>
                    <span className="line-clamp-3">{log.query || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[400px]" title={log.answer}>
                    <span className="line-clamp-3">{log.answer || "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminChatLogs;
