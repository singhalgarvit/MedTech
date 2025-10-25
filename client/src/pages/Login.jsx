import {useForm} from "react-hook-form";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";
import {Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "../schemas/authSchema";
import {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {handleLogin} = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const submitForm = async (data) => {
    try {
      const res = await handleLogin(data);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setError("loginError", {message: errMsg});
      console.log(errMsg);
    }
  };

  return (
    <div>
      <FormWrapper>
        <h1 className="text-4xl text-center">Login</h1>
        <form onSubmit={handleSubmit(submitForm)}>
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
              placeholder="Enter Password"
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
            value="Login"
            onclick={() => clearErrors()}
            className={"mt-4 w-full"}
          />
          {errors.loginError && (
            <p className="text-red-500 text-sm text-center">
              {errors.loginError.message}
            </p>
          )}
        </form>
        <p>
          Don't Have An Account&nbsp;
          <Link to="/signup" className="underline">
            Register Here
          </Link>
        </p>
      </FormWrapper>
    </div>
  );
}

export default Login;
