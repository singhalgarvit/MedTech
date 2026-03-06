import { useContext, useEffect, useState } from "react";
import DoctorCard from "../components/DoctorPage/DoctorCard";
import { useDoctors } from "../hooks/useDoctors";
import { DoctorContext } from "../context/doctorContext";
import { getDoctorFilterOptions } from "../services/doctorService";

function Doctors() {
  const { getDoctorsList } = useDoctors();
  const { doctorsList } = useContext(DoctorContext);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [qualification, setQualification] = useState("");
  const [filterOptions, setFilterOptions] = useState({ qualifications: [], locations: [] });
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const opts = await getDoctorFilterOptions();
        if (!cancelled) setFilterOptions(opts);
      } catch (_) {
        if (!cancelled) setFilterOptions({ qualifications: [], locations: [] });
      } finally {
        if (!cancelled) setLoadingFilters(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingDoctors(true);
    getDoctorsList({
      search: search.trim() || undefined,
      location: location.trim() || undefined,
      qualification: qualification.trim() || undefined,
    }).finally(() => {
      if (!cancelled) setLoadingDoctors(false);
    });
    return () => { cancelled = true; };
  }, [search, location, qualification]);

  return (
    <>
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold">Meet Our Doctors</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-6 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="doctor-search" className="sr-only">Search by name or qualification</label>
          <input
            id="doctor-search"
            type="text"
            placeholder="Search by name, qualification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none bg-white min-w-[140px]"
            disabled={loadingFilters}
          >
            <option value="">All locations</option>
            {filterOptions.locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none bg-white min-w-[140px]"
            disabled={loadingFilters}
          >
            <option value="">All qualifications</option>
            {filterOptions.qualifications.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>

      {loadingDoctors ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" aria-hidden="true" />
          <span className="sr-only">Loading doctors...</span>
        </div>
      ) : doctorsList && doctorsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-center p-8 content-evenly justify-items-center">
          {doctorsList.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 p-8">No doctors found.</p>
      )}
    </>
  );
}

export default Doctors;
