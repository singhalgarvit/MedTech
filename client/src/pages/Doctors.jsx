import {useContext, useEffect, useState} from "react";
import DoctorCard from "../components/DoctorPage/DoctorCard";
import { useDoctors } from "../hooks/useDoctors";
import { DoctorContext } from "../context/doctorContext";

function Doctors() {

  const { getDoctorsList } = useDoctors();
  const {doctorsList} = useContext(DoctorContext);

  useEffect(() => {
    getDoctorsList();
  }, []);

  return (
    <>
      <div className="text-center p-8 ">
        <h1 className="text-3xl font-bold">Meet Our Doctors</h1>
      </div> 
      {doctorsList && doctorsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8 text-center p-8 content-evenly justify-items-center">
          {doctorsList.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <p>No doctors found.</p>
      )}
    </>
  );
}

export default Doctors;
