import React, { useEffect, useState } from "react";
import { getMyAppointmentsForDoctor } from "../../services/appointmentService";
import { TableSkeleton } from "../../components/Skeleton";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusClass(s) {
  switch (s) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "no_show":
      return "bg-amber-100 text-amber-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    case "confirmed":
    case "pending":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function DoctorPreviousAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMyAppointmentsForDoctor()
      .then((data) => {
        if (!cancelled) setAppointments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load appointments");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const previous = appointments.filter((a) => {
    const aptDate = new Date(a.date).toISOString().slice(0, 10);
    return aptDate < todayStr || ["completed", "rejected", "no_show", "cancelled"].includes(a.status);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Previous patient appointments</h2>
      <p className="text-gray-600 mb-4">View past appointments and their status.</p>

      {loading && <TableSkeleton rows={5} cols={6} />}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && !error && previous.length === 0 && (
        <p className="text-gray-500">No previous appointments.</p>
      )}
      {!loading && !error && previous.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {previous.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{apt.patient?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.patient?.email ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(apt.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.timeSlot ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusClass(apt.status)}`}>
                      {apt.status === "no_show" ? "Did not come" : (apt.status ?? "—")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate" title={apt.notes}>{apt.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorPreviousAppointments;
