import {useEffect, useState} from "react";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";
import { getDoctors } from "../services/doctorService";
import DoctorCard from "../components/DoctorPage/DoctorCard";

function Doctors() {
    const [doctorList, setDoctorList] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctors();
        console.log(response);
        setDoctorList(response);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);
  return (
    <>
      <div className="text-center p-8 ">
        <h1 className="text-3xl font-bold">Meet Our Doctors</h1>
      </div> 
      {doctorList && doctorList.length > 0 ? (
        <div className="doctor-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8 text-center p-8 content-evenly justify-items-center">
          {doctorList.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <p>No doctors found.</p>
      )}
    </>
  );
}

export default Doctors;
