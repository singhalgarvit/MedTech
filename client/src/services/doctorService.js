const BASE = import.meta.env.VITE_BACKEND_URL;
const token = () => localStorage.getItem("token");

const getDoctors = async (params = {}) => {
  const sp = new URLSearchParams();
  if (params.search) sp.set("search", params.search);
  if (params.location) sp.set("location", params.location);
  if (params.qualification) sp.set("qualification", params.qualification);
  const qs = sp.toString();
  const url = `${BASE}/doctor${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const jsonRes = await res.json();
  if (!res.ok) throw new Error(jsonRes.error || "Something Went Wrong");
  return jsonRes;
};

const getDoctorFilterOptions = async () => {
  const res = await fetch(`${BASE}/doctor/filters`, {
    method: "GET",
    headers: { "Content-Type": "application/json", token: token() },
  });
  const jsonRes = await res.json();
  if (!res.ok) throw new Error(jsonRes.error || "Failed to load filters");
  return jsonRes;
};

const getDoctorById = async (id) => {
  const res = await fetch(`${BASE}/doctor/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", token: token() },
  });
  const jsonRes = await res.json();
  if (!res.ok) throw new Error(jsonRes.error || "Doctor not found");
  return jsonRes;
};

const registerAsDoctor = async (formData) => {
  const res = await fetch(`${BASE}/doctor/register`, {
    method: "POST",
    headers: {
      token: token(),
    },
    body: formData,
  });
  const jsonRes = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(jsonRes.error || "Registration failed");
  return jsonRes;
};

const getNotVerifiedDoctors = async () => {
  const res = await fetch(`${BASE}/doctor/notverified/view`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const jsonRes = await res.json();
  if (!res.ok) throw new Error(jsonRes.error || "Failed to fetch");
  return jsonRes;
};

const getNotVerifiedDoctorByEmail = async (userEmail) => {
  const res = await fetch(
    `${BASE}/doctor/notverified/view/${encodeURIComponent(userEmail)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token(),
      },
    }
  );
  const jsonRes = await res.json();
  if (!res.ok) throw new Error(jsonRes.error || "Failed to fetch");
  return jsonRes;
};

const verifyDoctor = async (userEmail) => {
  const res = await fetch(
    `${BASE}/doctor/verifydoctor/${encodeURIComponent(userEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token(),
      },
    }
  );
  const jsonRes = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(jsonRes.error || "Verify failed");
  return jsonRes;
};

const rejectDoctor = async (userEmail) => {
  const res = await fetch(
    `${BASE}/doctor/rejectdoctor/${encodeURIComponent(userEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token(),
      },
    }
  );
  const jsonRes = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(jsonRes.error || "Reject failed");
  return jsonRes;
};

const deleteDoctor = async (doctorId) => {
  const res = await fetch(`${BASE}/doctor/admin/${doctorId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to delete doctor");
  return data;
};

/** Doctor: get my profile (current logged-in doctor) */
const getMyDoctorProfile = async () => {
  const res = await fetch(`${BASE}/doctor/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
  return data;
};

/** Doctor: update my profile (name, clinicLocation, experience, optional img file) */
const updateMyDoctorProfile = async (formData) => {
  const res = await fetch(`${BASE}/doctor/me`, {
    method: "PUT",
    headers: {
      token: token(),
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update profile");
  return data;
};

export {
  getDoctors,
  getDoctorById,
  getDoctorFilterOptions,
  registerAsDoctor,
  getNotVerifiedDoctors,
  getNotVerifiedDoctorByEmail,
  verifyDoctor,
  rejectDoctor,
  deleteDoctor,
  getMyDoctorProfile,
  updateMyDoctorProfile,
};
