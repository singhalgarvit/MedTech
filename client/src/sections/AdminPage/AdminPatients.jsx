import React, { useEffect, useState } from "react";
import { getPatientsForAdmin, deletePatient } from "../../services/patientService";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPatientsForAdmin();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load patients");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (patient) => {
    if (!window.confirm(`Delete patient "${patient.name}" (${patient.email})? This will also remove their appointments.`)) {
      return;
    }
    setDeletingId(patient._id);
    setError("");
    try {
      await deletePatient(patient._id);
      setPatients((prev) => prev.filter((p) => p._id !== patient._id));
    } catch (err) {
      setError(err.message || "Failed to delete patient");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Patients</h2>
      <p className="text-gray-600 mb-4">Registered patients. Deleting a patient also removes their appointments.</p>

      {loading && <p className="text-gray-500">Loading patients...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && !error && patients.length === 0 && (
        <p className="text-gray-500">No patients in the system.</p>
      )}
      {!loading && !error && patients.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{p.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.email ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      disabled={deletingId === p._id}
                      className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === p._id ? "Deleting..." : "Delete"}
                    </button>
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

export default AdminPatients;
