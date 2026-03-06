import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById } from "../services/doctorService";
import { AuthContext } from "../context/authContext";
import getRole from "../utils/getRole";
import getUserId from "../utils/getUserId";
import BookAppointmentModal from "../components/DoctorPage/BookAppointmentModal";
import { DoctorProfileSkeleton } from "../components/Skeleton";
import {
  HiOutlineArrowLeft,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
} from "react-icons/hi";

function InfoRow({ icon: Icon, label, value }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex gap-3 items-start">
      <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [doctor, setDoctor] = useState(null);
  const isOwnProfile = token && getRole() === "doctor" && getUserId() === id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getDoctorById(id);
        if (!cancelled) setDoctor(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load doctor");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleBookClick = () => {
    if (!token) {
      navigate("/login", { state: { from: `/doctors/${id}`, message: "Please login to book an appointment" } });
      return;
    }
    setShowBookModal(true);
  };

  if (loading) return <DoctorProfileSkeleton />;
  if (error || !doctor) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 max-w-md">
          <p className="text-red-700 font-medium">{error || "Doctor not found"}</p>
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-800 hover:bg-red-100 font-medium transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to doctors
          </button>
        </div>
      </div>
    );
  }

  const availableDays = Array.isArray(doctor.availableDays) ? doctor.availableDays.join(", ") : doctor.availableDays || "—";
  const timeRange = doctor.availableTime
    ? `${doctor.availableTime.start || ""} – ${doctor.availableTime.end || ""}`
    : "—";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-10">
      <button
        type="button"
        onClick={() => navigate("/doctors")}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-900 font-medium mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 rounded-lg px-2 py-1 -ml-2"
      >
        <HiOutlineArrowLeft className="w-5 h-5" />
        Back to doctors
      </button>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Top: image + name block */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 md:p-8">
          <div className="sm:w-48 flex-shrink-0">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
              <img
                src={doctor.img}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
              {doctor.specialization && (
                <span className="absolute bottom-2 left-2 right-2 text-center px-2 py-1 rounded-lg text-xs font-medium bg-white/95 text-gray-800 shadow-sm">
                  {doctor.specialization}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {doctor.name}
            </h1>
            {doctor.specialization && (
              <p className="mt-1 text-blue-900 font-medium">{doctor.specialization}</p>
            )}
            {doctor.consultationFee != null && (
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold text-gray-900">₹{doctor.consultationFee}</span>
                <span className="text-gray-500 text-sm">consultation fee</span>
              </p>
            )}
            {!isOwnProfile && (
              <button
                type="button"
                onClick={handleBookClick}
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-900 text-white font-semibold shadow-sm hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 transition-colors"
              >
                <HiOutlineCalendar className="w-5 h-5" />
                Book Appointment
              </button>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <InfoRow icon={HiOutlineAcademicCap} label="Qualification" value={doctor.qualification} />
            <InfoRow
              icon={HiOutlineBriefcase}
              label="Experience"
              value={doctor.experience != null ? `${doctor.experience} years` : null}
            />
            <InfoRow icon={HiOutlineCalendar} label="Available days" value={availableDays !== "—" ? availableDays : null} />
            <InfoRow icon={HiOutlineClock} label="Available time" value={timeRange !== "—" ? timeRange : null} />
          </div>

          {doctor.bio && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-5">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
                  <HiOutlineDocumentText className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">About</p>
                  <p className="text-gray-700 mt-1 leading-relaxed">{doctor.bio}</p>
                </div>
              </div>
            </div>
          )}

          {(doctor.clinicName || doctor.clinicAddress || doctor.clinicLocation) && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-5 space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
                  <HiOutlineOfficeBuilding className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Clinic</p>
                  {doctor.clinicName && <p className="text-gray-900 font-medium mt-1">{doctor.clinicName}</p>}
                </div>
              </div>
              {(doctor.clinicAddress || doctor.clinicLocation) && (
                <div className="flex gap-3 pl-12">
                  <HiOutlineLocationMarker className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-gray-600 text-sm space-y-0.5">
                    {doctor.clinicAddress && <p>{doctor.clinicAddress}</p>}
                    {doctor.clinicLocation && <p>{doctor.clinicLocation}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {isOwnProfile && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 font-medium">
              You cannot book an appointment with yourself.
            </div>
          )}
        </div>
      </div>

      {showBookModal && (
        <BookAppointmentModal
          doctor={doctor}
          onClose={() => setShowBookModal(false)}
          onSuccess={() => setShowBookModal(false)}
        />
      )}
    </div>
  );
}

export default DoctorProfile;
