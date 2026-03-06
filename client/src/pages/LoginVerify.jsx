import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { verifyLogin } from "../services/authService";
import FormWrapper from "../components/FormWrapper";

function LoginVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid link. No token provided.");
      return;
    }
    (async () => {
      try {
        const res = await verifyLogin(token);
        const jwt = res.data?.token;
        if (jwt) {
          setToken(jwt);
          localStorage.setItem("token", jwt);
          setStatus("success");
          setTimeout(() => navigate("/", { replace: true }), 1500);
        } else {
          setStatus("error");
          setMessage("Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || err.message || "Invalid or expired link.");
      }
    })();
  }, [searchParams, setToken, navigate]);

  return (
    <FormWrapper>
      {status === "verifying" && (
        <p className="text-center text-gray-600">Logging you in…</p>
      )}
      {status === "success" && (
        <p className="text-center text-green-700 font-medium">Login successful! Redirecting…</p>
      )}
      {status === "error" && (
        <>
          <p className="text-center text-red-600 font-medium">{message}</p>
          <p className="text-center mt-4">
            <a href="/login" className="text-blue-600 hover:underline">Back to login</a>
          </p>
        </>
      )}
    </FormWrapper>
  );
}

export default LoginVerify;
