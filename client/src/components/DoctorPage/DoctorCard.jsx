import React from "react";
import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  return (
    <Link to={`/doctors/${doctor._id}`} className="block">
      <div className="doctor-card border w-[300px] p-4 rounded-lg shadow-md flex flex-col items-center gap-2 hover:shadow-lg transition-shadow">
        <img
          src={doctor.img}
          className="w-[90%] h-60 object-cover hover:scale-105 transition-all rounded-md"
          alt={doctor.name}
        />
        <h2 className="font-semibold">{doctor.name}</h2>
        {doctor.specialization && <p className="text-sm text-gray-600">{doctor.specialization}</p>}
        {doctor.consultationFee != null && <p className="text-sm">₹{doctor.consultationFee} consultation</p>}
        <p className="text-sm text-gray-500">View profile & book</p>
      </div>
    </Link>
  );
}

export default DoctorCard