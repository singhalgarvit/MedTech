const BASE = import.meta.env.VITE_BACKEND_URL;
const token = () => localStorage.getItem("token");

export const getPatientsForAdmin = async () => {
  const res = await fetch(`${BASE}/user/admin/patients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch patients");
  return data;
};

export const deletePatient = async (patientId) => {
  const res = await fetch(`${BASE}/user/admin/patients/${patientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to delete patient");
  return data;
};
