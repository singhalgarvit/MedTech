import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { magicLinkSignupSchema } from "../schemas/authSchema";
import { useState } from "react";
import { sendSignupLink } from "../services/authService";

function Signup() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(magicLinkSignupSchema),
  });

  const [sent, setSent] = useState(false);

  const submitForm = async (data) => {
    try {
      await sendSignupLink({ name: data.name, email: data.email, password: data.password });
      setSent(true);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setError("root", { message: errMsg });
    }
  };

  if (sent) {
    return (
      <FormWrapper>
        <h1 className="text-2xl font-bold text-center mb-4">Check your email</h1>
        <p className="text-gray-600 text-center mb-4">
          We sent you a verification link. Click the link in the email to verify your account and finish signing up.
        </p>
        <p className="text-sm text-gray-500 text-center">
          Didn’t get it? Check spam or{" "}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-blue-600 hover:underline"
          >
            try again
          </button>
        </p>
        <p className="mt-6 text-center">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <h1 className="text-4xl text-center">Sign up</h1>
      <p className="text-gray-600 text-center text-sm mt-1 mb-4">
        Set your password, then we’ll send a verification link to your email.
      </p>
      <form onSubmit={handleSubmit(submitForm)}>
        <InputField
          label="Name"
          name="name"
          type="text"
          placeholder="John Doe"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          register={register}
          error={errors.password}
        />
        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          register={register}
          error={errors.confirmPassword}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          value={isSubmitting ? "Sending…" : "Send verification link"}
          className="mt-4 w-full"
        />
        {errors.root && (
          <p className="text-red-500 text-sm text-center mt-2">{errors.root.message}</p>
        )}
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="underline">Login</Link>
      </p>
    </FormWrapper>
  );
}

export default Signup;
