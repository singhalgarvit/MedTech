const BASE = import.meta.env.VITE_BACKEND_URL;
const token = () => localStorage.getItem("token");

export const submitContactMessage = async (data) => {
  const res = await fetch(`${BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to send message");
  return result;
};

export const getContactMessagesForAdmin = async () => {
  const res = await fetch(`${BASE}/contact/admin/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
  return data;
};
