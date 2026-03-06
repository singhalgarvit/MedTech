import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schemas/authSchema";
import { useState, useEffect } from "react";
import { verifyResetToken, resetPassword } from "../services/authService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const token = searchParams.get("token");
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true/false

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    verifyResetToken(token)
      .then(() => setTokenValid(true))
      .catch(() => setTokenValid(false));
  }, [token]);

  const submitForm = async (data) => {
    if (!token) return;
    try {
      const res = await resetPassword(token, data.newPassword);
      const jwt = res.data?.token;
      if (jwt) {
        setToken(jwt);
        localStorage.setItem("token", jwt);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError("root", { message: err.response?.data?.error || err.message || "Failed to reset password." });
    }
  };

  if (tokenValid === null) {
    return (
      <FormWrapper>
        <p className="text-center text-gray-600">Checking link…</p>
      </FormWrapper>
    );
  }

  if (tokenValid === false) {
    return (
      <FormWrapper>
        <p className="text-center text-red-600 font-medium">Invalid or expired link.</p>
        <p className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-600 hover:underline">Request a new link</a>
        </p>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <h1 className="text-4xl text-center">Set new password</h1>
      <form onSubmit={handleSubmit(submitForm)}>
        <InputField
          label="New password"
          name="newPassword"
          type="password"
          placeholder="At least 6 characters"
          register={register}
          error={errors.newPassword}
        />
        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          register={register}
          error={errors.confirmPassword}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          value={isSubmitting ? "Saving…" : "Reset password"}
          className="mt-4 w-full"
        />
        {errors.root && (
          <p className="text-red-500 text-sm text-center mt-2">{errors.root.message}</p>
        )}
      </form>
      <p className="mt-4 text-center">
        <a href="/login" className="underline">Back to login</a>
      </p>
    </FormWrapper>
  );
}

export default ResetPassword;
