import React, { useEffect, useState } from "react";
import { getContactMessagesForAdmin } from "../../services/contactService";
import { TableSkeleton } from "../../components/Skeleton";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getContactMessagesForAdmin();
        if (!cancelled) setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load messages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact messages</h2>
      <p className="text-gray-600 mb-4">Messages submitted via the contact form</p>

      {loading && <TableSkeleton rows={5} cols={5} />}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p className="text-gray-500">No contact messages yet.</p>
      )}
      {!loading && !error && messages.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {formatDate(m.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{m.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <a href={`mailto:${m.email}`} className="text-blue-600 hover:underline">
                      {m.email ?? "—"}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{m.subject ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[280px]" title={m.message}>
                    <span className="line-clamp-2">{m.message || "—"}</span>
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

export default AdminMessages;
