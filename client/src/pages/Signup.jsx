import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";
import {useAuth} from "../hooks/useAuth";

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    formState: {errors, isSubmitting},
  } = useForm();

  const {handleSignup} = useAuth();

  const submitForm = async (data) => {
    try {
      const res = await handleSignup(data);
      console.log(res);
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
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Password"
            register={register}
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            value="Signup"
            onclick={() => clearErrors()}
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
