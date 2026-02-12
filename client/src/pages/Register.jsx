import React from "react";
import InputField from "../components/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/authSchema";

function Register() {

    const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <>
      <div className="text-center p-8 ">
        <h1 className="text-3xl font-bold">Register Yourself</h1>
        <form onSubmit={()=>{}} className="p-6 flex flex-col md:flex-row  items-center gap-2">
            <InputField
            label="Email"
            name="email"
            type="file"
            placeholder="John@example.com"
            register={register}
            error={errors.email}
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
            label="Email"
            name="email"
            type="text"
            placeholder="John@example.com"
            register={register}
            error={errors.email}
          />
        </form>
      </div>
    </>
  );
}

export default Register;
