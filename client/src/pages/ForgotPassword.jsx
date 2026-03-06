import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { magicLinkEmailSchema } from "../schemas/authSchema";
import { useState } from "react";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(magicLinkEmailSchema),
  });

  const [sent, setSent] = useState(false);

  const submitForm = async (data) => {
    try {
      await forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setError("root", { message: err.response?.data?.error || err.message });
    }
  };

  if (sent) {
    return (
      <FormWrapper>
        <h1 className="text-2xl font-bold text-center mb-4">Check your email</h1>
        <p className="text-gray-600 text-center mb-4">
          If an account exists for that email, we sent a link to reset your password.
        </p>
        <p className="text-center">
          <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
        </p>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <h1 className="text-4xl text-center">Forgot password</h1>
      <p className="text-gray-600 text-center text-sm mt-1 mb-4">
        Enter your email and we’ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit(submitForm)}>
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          value={isSubmitting ? "Sending…" : "Send reset link"}
          className="mt-4 w-full"
        />
        {errors.root && (
          <p className="text-red-500 text-sm text-center mt-2">{errors.root.message}</p>
        )}
      </form>
      <p className="mt-4 text-center">
        <Link to="/login" className="underline">Back to login</Link>
      </p>
    </FormWrapper>
  );
}

export default ForgotPassword;
