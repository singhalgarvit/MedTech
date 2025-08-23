import {useForm} from "react-hook-form";
import InputField from "../components/InputField";
import FormWrapper from "../components/FormWrapper";
import Button from "../components/Button";

function Signup() {
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
        <h1 className="text-4xl text-center">Signup</h1>
        <form onSubmit={handleSubmit(submitForm)}>
          <InputField
            label="Name"
            name="name"
            type="text"
            register={register}
            error={errors.name}
          />
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
          <Button type="submit" value="Signup"/>
        </form>
      </FormWrapper>
    </div>
  );
}

export default Signup;
