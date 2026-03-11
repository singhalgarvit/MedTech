const BASE = import.meta.env.VITE_BACKEND_URL;
const token = () => localStorage.getItem("token");

export const getSlots = async (doctorId, date) => {
  const res = await fetch(
    `${BASE}/appointment/slots/${doctorId}?date=${encodeURIComponent(date)}`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch slots");
  return data;
};

export const createOrder = async (doctorId, date, timeSlot, notes = "") => {
  const res = await fetch(`${BASE}/appointment/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
    body: JSON.stringify({ doctorId, date, timeSlot, notes }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create order");
  return data;
};

export const verifyPayment = async (orderId, paymentId, razorpaySignature) => {
  const res = await fetch(`${BASE}/appointment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
    body: JSON.stringify({
      orderId,
      paymentId,
      razorpaySignature,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Payment verification failed");
  return data;
};

/** For doctor dashboard: fetch all appointments for the logged-in doctor with patient details */
export const getMyAppointmentsForDoctor = async () => {
  const res = await fetch(`${BASE}/appointment/doctor/my-appointments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch appointments");
  return data;
};

/** For patient dashboard: fetch all appointments for the logged-in patient with doctor details */
export const getMyAppointmentsForPatient = async () => {
  const res = await fetch(`${BASE}/appointment/patient/my-appointments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch appointments");
  return data;
};

/** For admin dashboard: fetch all appointments with patient and doctor details */
export const getAllAppointmentsForAdmin = async () => {
  const res = await fetch(`${BASE}/appointment/admin/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch appointments");
  return data;
};

/** Doctor: update appointment status to completed | rejected | no_show */
export const updateAppointmentStatus = async (appointmentId, status) => {
  const res = await fetch(`${BASE}/appointment/${appointmentId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data;
};

/** Doctor: fetch earnings (today, thisMonth, total, dayWise, monthly) */
export const getDoctorEarnings = async () => {
  const res = await fetch(`${BASE}/appointment/doctor/earnings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch earnings");
  return data;
};
