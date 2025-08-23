import {useForm} from "react-hook-form";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const submitForm = (data) => {
    console.log(data);
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
            register={register}
            error={errors.email}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password}
          />
          <Button type="submit" value="Login"/>
        </form>
      </FormWrapper>
    </div>
  );
}

export default Login;
