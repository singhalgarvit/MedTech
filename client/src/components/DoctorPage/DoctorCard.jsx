import React from "react";
import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.slug || doctor._id}`}
      className="block w-[300px] group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 rounded-2xl"
    >
      <div className="h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-blue-100">
        {/* Image container with overlay */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={doctor.img}
            alt={doctor.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {doctor.specialization && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 text-gray-800 shadow-sm backdrop-blur-sm">
              {doctor.specialization}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 text-left">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight line-clamp-1">
            {doctor.name}
          </h2>
          {doctor.consultationFee != null && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
              <span className="font-medium text-blue-900">₹{doctor.consultationFee}</span>
              <span className="text-gray-400">consultation</span>
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-900 group-hover:gap-3 transition-all">
            View profile & book
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default DoctorCard;
