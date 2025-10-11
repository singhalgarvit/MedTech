import React from 'react'

function DoctorCard({ doctor }) {
  return (
    <div className='doctor-card border w-[300px] p-4 rounded-lg shadow-md flex flex-col items-center gap-2'>
        <img src={doctor.img} className='w-[90%] h-60 object-cover hover:scale-105 transition-all rounded-md' alt={doctor.name} />
        <h2>{doctor.name}</h2>
        <p>Email: {doctor.email}</p>
    </div>
  )
}

export default DoctorCard