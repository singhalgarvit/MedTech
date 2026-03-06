import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  getNotVerifiedDoctors,
  getNotVerifiedDoctorByEmail,
  getDoctors,
  verifyDoctor,
  rejectDoctor,
  deleteDoctor,
} from "../../services/doctorService";
import { TableSkeleton } from "../../components/Skeleton";

function ApproveDoctor() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailEmail, setDetailEmail] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [verifiedList, setVerifiedList] = useState([]);
  const [verifiedLoading, setVerifiedLoading] = useState(true);
  const [verifiedError, setVerifiedError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [openPending, setOpenPending] = useState(false);
  const [openVerified, setOpenVerified] = useState(false);

  const fetchList = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getNotVerifiedDoctors();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load list");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const fetchVerifiedDoctors = async () => {
    setVerifiedLoading(true);
    setVerifiedError("");
    try {
      const data = await getDoctors();
      setVerifiedList(Array.isArray(data) ? data : []);
    } catch (err) {
      setVerifiedError(err.message || "Failed to load doctors");
      setVerifiedList([]);
    } finally {
      setVerifiedLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedDoctors();
  }, []);

  const handleDeleteDoctor = async (doctor) => {
    if (
      !window.confirm(
        `Delete doctor "${doctor.name}" (${doctor.email})? All their appointments will be removed.`
      )
    )
      return;
    setDeletingId(doctor._id);
    setVerifiedError("");
    try {
      await deleteDoctor(doctor._id);
      setVerifiedList((prev) => prev.filter((d) => d._id !== doctor._id));
    } catch (err) {
      setVerifiedError(err.message || "Failed to delete doctor");
    } finally {
      setDeletingId(null);
    }
  };

  const openDetail = async (userEmail) => {
    setDetail(null);
    setDetailEmail(userEmail);
    try {
      const data = await getNotVerifiedDoctorByEmail(userEmail);
      setDetail(data);
    } catch (err) {
      setError(err.message || "Failed to load details");
    }
  };

  const closeDetail = () => {
    setDetail(null);
    setDetailEmail(null);
  };

  const handleVerify = async (userEmail) => {
    setActionLoading(userEmail);
    setError("");
    try {
      await verifyDoctor(userEmail);
      closeDetail();
      await fetchList();
    } catch (err) {
      setError(err.message || "Verify failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userEmail) => {
    if (!window.confirm("Reject this doctor registration? This cannot be undone.")) return;
    setActionLoading(userEmail);
    setError("");
    try {
      await rejectDoctor(userEmail);
      closeDetail();
      await fetchList();
    } catch (err) {
      setError(err.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {/* Approve / Reject section - collapsible */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenPending((o) => !o)}
          className="w-full flex items-center gap-2 p-4 text-left bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
        >
          <FaChevronDown
            className={`flex-shrink-0 text-gray-600 transition-transform duration-200 ${openPending ? "" : "-rotate-90"}`}
            size={18}
          />
          <h2 className="text-xl font-semibold">Approve / Reject Doctor Registrations</h2>
          {list.length > 0 && (
            <span className="text-sm font-normal text-gray-500">({list.length} pending)</span>
          )}
        </button>
        {openPending && (
          <div className="p-4">
            {error && (
              <p className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm">{error}</p>
            )}
            {loading ? (
              <TableSkeleton rows={4} cols={4} />
            ) : list.length === 0 ? (
              <p className="text-gray-600">No unverified doctor registrations.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-md overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2 border-b">Name</th>
                      <th className="text-left p-2 border-b">Email</th>
                      <th className="text-left p-2 border-b">Specialization</th>
                      <th className="text-left p-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((doc) => (
                      <tr key={doc.userEmail || doc._id} className="border-b border-gray-200">
                        <td className="p-2">{doc.name ?? "—"}</td>
                        <td className="p-2">{doc.userEmail ?? "—"}</td>
                        <td className="p-2">{doc.specialization ?? "—"}</td>
                        <td className="p-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openDetail(doc.userEmail)}
                            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVerify(doc.userEmail)}
                            disabled={actionLoading != null}
                            className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === doc.userEmail ? "…" : "Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(doc.userEmail)}
                            disabled={actionLoading != null}
                            className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            {actionLoading === doc.userEmail ? "…" : "Reject"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* All verified doctors - collapsible */}
      <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenVerified((o) => !o)}
          className="w-full flex items-center gap-2 p-4 text-left bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
        >
          <FaChevronDown
            className={`flex-shrink-0 text-gray-600 transition-transform duration-200 ${openVerified ? "" : "-rotate-90"}`}
            size={18}
          />
          <h3 className="text-lg font-semibold">All verified doctors</h3>
          {verifiedList.length > 0 && (
            <span className="text-sm font-normal text-gray-500">({verifiedList.length})</span>
          )}
        </button>
        {openVerified && (
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4">Delete a doctor to remove their profile and all their appointments.</p>
            {verifiedLoading && <TableSkeleton rows={5} cols={6} />}
            {verifiedError && (
              <p className="mb-2 p-2 rounded bg-red-100 text-red-700 text-sm">{verifiedError}</p>
            )}
            {!verifiedLoading && !verifiedError && verifiedList.length === 0 && (
              <p className="text-gray-500 text-sm">No verified doctors.</p>
            )}
            {!verifiedLoading && verifiedList.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Specialization</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Qualification</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {verifiedList.map((d) => (
                      <tr key={d._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{d.name ?? "—"}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{d.email ?? "—"}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{d.specialization ?? "—"}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{d.qualification ?? "—"}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{d.clinicLocation ?? "—"}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteDoctor(d)}
                            disabled={deletingId === d._id}
                            className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === d._id ? "Deleting…" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {detail && (
        <div className="mt-8 p-4 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Doctor details</h3>
            <button
              type="button"
              onClick={closeDetail}
              className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
          <div className="grid gap-3 text-sm">
            <p><span className="font-medium">Name:</span> {detail.name ?? "—"}</p>
            <p><span className="font-medium">Email:</span> {detail.userEmail ?? detail.email ?? "—"}</p>
            <p><span className="font-medium">Specialization:</span> {detail.specialization ?? "—"}</p>
            <p><span className="font-medium">Experience:</span> {detail.experience ?? "—"} years</p>
            <p><span className="font-medium">Qualification:</span> {detail.qualification ?? "—"}</p>
            <p><span className="font-medium">Clinic:</span> {detail.clinicName ?? "—"} — {detail.clinicAddress ?? ""}</p>
            <p><span className="font-medium">Consultation fee:</span> ₹{detail.consultationFee ?? "—"}</p>
            {detail.img && (
              <div>
                <span className="font-medium block mb-1">Profile image</span>
                <img src={detail.img} alt="Profile" className="max-w-[120px] rounded border" />
              </div>
            )}
            {detail.doctorIdCard && (
              <div>
                <span className="font-medium block mb-1">ID card</span>
                <img src={detail.doctorIdCard} alt="ID card" className="max-w-[200px] rounded border" />
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => handleVerify(detailEmail)}
              disabled={actionLoading != null}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading === detailEmail ? "…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => handleReject(detailEmail)}
              disabled={actionLoading != null}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading === detailEmail ? "…" : "Reject"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApproveDoctor;
