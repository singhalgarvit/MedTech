import {useState} from "react";
import FormWrapper from "../../components/FormWrapper";
import InputField from "../../components/InputField";
import {useForm} from "react-hook-form";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import {IoPersonAdd} from "react-icons/io5";
import Doctors from "../../pages/Doctors";

function CreateDoctor() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = useForm();

  const submitForm = async (data) => {
    try {
      //   const res = await handleLogin(data);
      console.log(data);
    } catch (err) {
      setError("loginError", {message: err.message});
      console.log(err.message);
    }
  };

  return (
    <>
      <Button
        value=""
        disabled={false}
        icon={<IoPersonAdd />}
        className="w-fit p-2"
        onclick={() => setIsModalOpen(!isModalOpen)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormWrapper className="max-w-md mx-auto">
          <h1 className="text-3xl text-center">Create Doctor</h1>
          <form onSubmit={handleSubmit(submitForm)}>
            <InputField
              label="Name"
              name="name"
              type="text"
              placeholder="Enter doctor's name"
              register={register}
              error={errors.name}
            />
            <InputField
              label="Specialization"
              name="specialization"
              type="text"
              placeholder="Enter specialization"
              register={register}
              error={errors.specialization}
            />
            <InputField
              label="Experience"
              name="experience"
              type="number"
              placeholder="Enter years of experience"
              register={register}
              error={errors.experience}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              value="Create Doctor"
              onclick={() => clearErrors()}
              className={"mt-4 w-full"}
            />
          </form>
        </FormWrapper>
      </Modal>
      <Doctors />
    </>
  );
}

export default CreateDoctor;
