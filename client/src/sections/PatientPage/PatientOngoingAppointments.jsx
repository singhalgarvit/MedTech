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

function PatientOngoingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMyAppointmentsForPatient();
        if (!cancelled) {
          const ongoing = (Array.isArray(data) ? data : []).filter(
            (apt) => apt.status === "pending" || apt.status === "confirmed"
          );
          setAppointments(ongoing);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load appointments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <TableSkeleton rows={5} cols={5} />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (appointments.length === 0) return <p className="text-gray-500">No ongoing appointments.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ongoing Appointments</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Doctor
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
                  <div className="font-medium">{apt.doctor?.name ?? "—"}</div>
                  <div className="text-xs text-gray-500">{apt.doctor?.specialization ?? ""}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div>{formatDate(apt.date)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div>{apt.timeSlot ?? "—"}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      apt.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
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
    </div>
  );
}

export default PatientOngoingAppointments;
