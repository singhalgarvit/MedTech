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
    const jsonRes = await res.json();

    if (!res.ok) {
      throw new Error(jsonRes.error ||"Something Went Wrong");
    }
    return jsonRes;
  } catch (error) {
    throw error;
  }
};

export {getDoctors};
