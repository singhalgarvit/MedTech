import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { getDoctorById } from "../services/doctorService";
import { AuthContext } from "../context/authContext";
import getRole from "../utils/getRole";
import getUserId from "../utils/getUserId";
import BookAppointmentModal from "../components/DoctorPage/BookAppointmentModal";
import { DoctorProfileSkeleton } from "../components/Skeleton";

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
      <div className="p-8 text-center">
        <p className="text-red-600">{error || "Doctor not found"}</p>
        <button type="button" onClick={() => navigate("/doctors")} className="mt-2 text-blue-600 underline">
          Back to doctors
        </button>
      </div>
    );
  }

  const availableDays = Array.isArray(doctor.availableDays) ? doctor.availableDays.join(", ") : doctor.availableDays || "—";
  const timeRange = doctor.availableTime
    ? `${doctor.availableTime.start || ""} - ${doctor.availableTime.end || ""}`
    : "—";

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <button
        type="button"
        onClick={() => navigate("/doctors")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to doctors
      </button>

      <div className="flex flex-col md:flex-row gap-8 border rounded-lg shadow-md p-6 bg-white">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={doctor.img}
            alt={doctor.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="md:w-2/3 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{doctor.name}</h1>
          <p className="text-gray-600">{doctor.specialization}</p>
          {doctor.qualification && <p><span className="font-medium">Qualification:</span> {doctor.qualification}</p>}
          {doctor.experience != null && <p><span className="font-medium">Experience:</span> {doctor.experience} years</p>}
          <p><span className="font-medium">Consultation fee:</span> ₹{doctor.consultationFee}</p>
          {doctor.bio && <p className="text-gray-700">{doctor.bio}</p>}
          {doctor.clinicName && (
            <div>
              <p><span className="font-medium">Clinic:</span> {doctor.clinicName}</p>
              {doctor.clinicAddress && <p className="text-gray-600">{doctor.clinicAddress}</p>}
              {doctor.clinicLocation && <p className="text-gray-600">{doctor.clinicLocation}</p>}
            </div>
          )}
          <p><span className="font-medium">Available days:</span> {availableDays}</p>
          <p><span className="font-medium">Available time:</span> {timeRange}</p>

          {isOwnProfile ? (
            <p className="mt-4 px-6 py-3 bg-gray-200 text-gray-600 rounded-lg inline-block font-medium">
              You cannot book an appointment with yourself.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleBookClick}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Book Appointment
            </button>
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
