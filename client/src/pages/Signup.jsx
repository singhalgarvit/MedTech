import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";
import {useAuth} from "../hooks/useAuth";
import {zodResolver} from "@hookform/resolvers/zod";
import {signupSchema} from "../schemas/authSchema";
import {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

function Signup() {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const {handleSignup} = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const submitForm = async (data) => {
    try {
      const res = await handleSignup(data);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setError("signupError", {message: errMsg});
      console.log(errMsg);
    }
  };

  return (
    <div>
      <FormWrapper>
        <h1 className="text-4xl text-center">Signup</h1>
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
            type="text"
            placeholder="John@example.com"
            register={register}
            error={errors.email}
          />
          <div className="relative">
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              register={register}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform translate-y-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            value="Signup"
            onclick={() => clearErrors()}
            className={"mt-4 w-full"}
          />
          {errors.signupError && (
            <p className="text-red-500 text-sm text-center">
              {errors.signupError.message}
            </p>
          )}
        </form>
        <p>
          Already Have An Account&nbsp;
          <Link to="/login" className="underline">
            Login Here
          </Link>
        </p>
      </FormWrapper>
    </div>
  );
}

export default Signup;
