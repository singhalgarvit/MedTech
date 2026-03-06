const BASE = `${import.meta.env.VITE_BACKEND_URL}/chat`;
const getToken = () => localStorage.getItem("token");

/**
 * Fetch the current user's chat history. Use when loading the chatbot page.
 */
export const getChatHistory = async () => {
  const token = getToken();
  if (!token) return { messages: [] };
  const res = await fetch(`${BASE}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json", token },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load chat history");
  }
  const data = await res.json();
  return { messages: data.messages || [] };
};

/**
 * Save chat messages to the backend. Fire-and-forget: does not block the UI.
 * Call this after the user sees the assistant reply; errors are logged only.
 */
export const saveChatInBackground = (messages) => {
  const token = getToken();
  if (!token) return;
  fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token },
    body: JSON.stringify({ messages }),
  }).catch((err) => console.warn("Chat save failed:", err));
};

/** Admin only: fetch all users' chatbot queries and AI answers */
export const getChatLogsForAdmin = async () => {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${BASE}/admin/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json", token },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch chat logs");
  return Array.isArray(data) ? data : [];
};
