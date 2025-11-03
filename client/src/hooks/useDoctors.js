import {useContext} from "react";
import {DoctorContext} from "../context/doctorContext";
import {getDoctors} from "../services/doctorService";

export const useDoctors = () => {
  const {doctorsList, setDoctorsList} = useContext(DoctorContext);

  const getDoctorsList = async () => {
    if (doctorsList && doctorsList.length > 0) {
      return doctorsList;
    }

    try {
      const res = await getDoctors();
      setDoctorsList(res);
      return res;
    } catch (err) {
      // throw err;
      console.log(err.message)
    }
  };

  const addDoctor = (doctor) => {
    setDoctorsList([...doctorsList, doctor]);
  };

  const removeDoctor = (doctorId) => {
    setDoctorsList(doctorsList.filter((doctor) => doctor.id !== doctorId));
  };

  return {getDoctorsList, addDoctor, removeDoctor};
};
