import React, { useEffect, useState } from "react";
import { getDoctorEarnings } from "../../services/appointmentService";

const statCardClass =
  "rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md";

function StatCard({ label, value }) {
  return (
    <div className={statCardClass}>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function formatRupee(n) {
  return n != null && !Number.isNaN(n) ? `₹${Number(n).toLocaleString("en-IN")}` : "₹0";
}

function DoctorEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getDoctorEarnings()
      .then((data) => {
        if (!cancelled) setEarnings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load earnings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 w-full bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Earnings</h2>
      <p className="text-gray-600 mb-6">Your earnings from completed consultations (day-wise, monthly, and total).</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Today" value={formatRupee(earnings?.today)} />
        <StatCard label="This month" value={formatRupee(earnings?.thisMonth)} />
        <StatCard label="Total" value={formatRupee(earnings?.total)} />
      </div>

      {earnings?.dayWise?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Day-wise (last 30 days)</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earnings.dayWise.map((row) => (
                  <tr key={row.date}>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.date}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatRupee(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {earnings?.monthly?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Monthly (last 12 months)</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Month</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earnings.monthly.map((row) => (
                  <tr key={row.month}>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.month}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatRupee(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(!earnings?.dayWise?.length && !earnings?.monthly?.length) && earnings?.total === 0 && (
        <p className="text-gray-500">No earnings yet. Earnings will appear here once you mark appointments as completed.</p>
      )}
    </div>
  );
}

export default DoctorEarnings;
