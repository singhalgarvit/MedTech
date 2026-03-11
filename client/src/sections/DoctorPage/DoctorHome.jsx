import React, { useEffect, useState } from "react";
import { getMyAppointmentsForDoctor } from "../../services/appointmentService";
import { getDoctorEarnings } from "../../services/appointmentService";
import { getMyDoctorProfile } from "../../services/doctorService";

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

function DoctorHome() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [profileRes, appointmentsRes, earningsRes] = await Promise.all([
          getMyDoctorProfile().catch(() => null),
          getMyAppointmentsForDoctor(),
          getDoctorEarnings(),
        ]);
        if (!cancelled) {
          setProfile(profileRes);
          setAppointments(Array.isArray(appointmentsRes) ? appointmentsRes : []);
          setEarnings(earningsRes);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-200" />
        ))}
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

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingCount = appointments.filter((a) => {
    const d = new Date(a.date);
    const aptDate = d.toISOString().slice(0, 10);
    return aptDate >= todayStr && (a.status === "confirmed" || a.status === "pending");
  }).length;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Upcoming appointments" value={upcomingCount} />
        <StatCard
          label="Earnings today"
          value={earnings?.today != null ? `₹${earnings.today}` : "₹0"}
        />
        <StatCard
          label="Earnings this month"
          value={earnings?.thisMonth != null ? `₹${earnings.thisMonth}` : "₹0"}
        />
        <StatCard
          label="Total earnings"
          value={earnings?.total != null ? `₹${earnings.total}` : "₹0"}
          sublabel="From completed consultations"
        />
      </div>
      {profile && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Welcome back, {profile.name}.</p>
          <p className="text-gray-700 mt-1">{profile.specialization} • {profile.clinicName}</p>
        </div>
      )}
    </div>
  );
}

export default DoctorHome;
