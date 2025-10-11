const getDoctors = async () => {
  try {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/doctor`;
    const res = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch doctors");
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getDoctors:", error);
    throw error;
  }
};

export {getDoctors};
