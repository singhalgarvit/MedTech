import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyAppointmentsForPatient } from "../../services/appointmentService";
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

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMyAppointmentsForPatient();
        if (!cancelled) setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load appointments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-6 md:p-12">
      <h1 className="text-2xl font-bold text-center mb-2">Patient Dashboard</h1>
      <p className="text-center text-gray-600 mb-6">Your booked appointments with doctors</p>

      {loading && <TableSkeleton rows={5} cols={7} />}
      {error && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}
      {!loading && !error && appointments.length === 0 && (
        <p className="text-center text-gray-500">No appointments yet. Book one from the Doctors page.</p>
      )}
      {!loading && !error && appointments.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {apt.doctor?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {apt.doctor?.specialization ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(apt.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {apt.timeSlot ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : apt.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : apt.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {apt.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate" title={apt.notes}>
                    {apt.notes || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {apt.doctor?._id ? (
                      <Link
                        to={`/doctors/${apt.doctor.slug || apt.doctor._id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View doctor
                      </Link>
                    ) : (
                      "—"
                    )}
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

export default PatientDashboard;
