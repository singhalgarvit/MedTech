import React, { useEffect, useState } from "react";
import { getMyAppointmentsForDoctor, updateAppointmentStatus } from "../../services/appointmentService";
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

const STATUS_OPTIONS = [
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "no_show", label: "Did not come", color: "bg-amber-100 text-amber-800" },
];

function DoctorUpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      const data = await getMyAppointmentsForDoctor();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter((a) => {
    const aptDate = new Date(a.date).toISOString().slice(0, 10);
    return aptDate >= todayStr && ["confirmed", "pending"].includes(a.status);
  });

  const handleStatusChange = async (aptId, status) => {
    setUpdatingId(aptId);
    setError("");
    try {
      await updateAppointmentStatus(aptId, status);
      await load();
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Upcoming patient appointments</h2>
      <p className="text-gray-600 mb-4">Mark appointments as completed, rejected, or did not come.</p>

      {error && (
        <p className="mb-4 text-red-600 text-sm">{error}</p>
      )}

      {loading && <TableSkeleton rows={5} cols={6} />}
      {!loading && !error && upcoming.length === 0 && (
        <p className="text-gray-500">No upcoming appointments.</p>
      )}
      {!loading && !error && upcoming.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcoming.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{apt.patient?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.patient?.email ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(apt.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.timeSlot ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate" title={apt.notes}>{apt.notes || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={updatingId === apt._id}
                          onClick={() => handleStatusChange(apt._id, opt.value)}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${opt.color} hover:opacity-90 disabled:opacity-50`}
                        >
                          {updatingId === apt._id ? "…" : opt.label}
                        </button>
                      ))}
                    </div>
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

export default DoctorUpcomingAppointments;
