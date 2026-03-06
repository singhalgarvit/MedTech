import React, { useEffect, useState } from "react";
import { getAdminStats } from "../../services/patientService";
import { AdminHomeSkeleton } from "../../components/Skeleton";

const statCardClass =
  "rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md";

function StatCard({ label, value, sublabel }) {
  return (
    <div className={statCardClass}>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sublabel != null && <p className="mt-0.5 text-xs text-gray-500">{sublabel}</p>}
    </div>
  );
}

function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getAdminStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load stats");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <AdminHomeSkeleton />;

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Total patients" value={stats.totalPatients} />
        <StatCard label="Total doctors" value={stats.totalDoctors} sublabel="Verified" />
        <StatCard label="Appointments today" value={stats.appointmentsToday} />
        <StatCard label="Appointments this month" value={stats.appointmentsThisMonth} />
        <StatCard label="Total AI searches" value={stats.totalAiSearches} sublabel="Chatbot queries" />
        <StatCard label="New users today" value={stats.newUsersToday} />
        <StatCard label="New users this month" value={stats.newUsersThisMonth} />
      </div>
    </div>
  );
}

export default AdminHome;
