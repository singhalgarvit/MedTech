const BASE = import.meta.env.VITE_BACKEND_URL;
const token = () => localStorage.getItem("token");

/** Admin dashboard: fetch stats (total patients, doctors, appointments, AI searches, new users). */
export const getAdminStats = async () => {
  const res = await fetch(`${BASE}/user/admin/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch admin stats");
  return data;
};

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

export const getMyPatientProfile = async () => {
  const res = await fetch(`${BASE}/user/profile`, {
    method: "GET",
    headers: { "Content-Type": "application/json", token: token() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
  return data;
};

export const updateMyPatientProfile = async (formData) => {
  const res = await fetch(`${BASE}/user/profile`, {
    method: "PUT",
    headers: { token: token() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update profile");
  return data;
};
