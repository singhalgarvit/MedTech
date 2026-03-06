import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../components/InputField";
import { doctorSchema } from "../schemas/doctorSchema";
import { registerAsDoctor } from "../services/doctorService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Register() {
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      availableDays: [],
      availableTime: { start: "", end: "" },
    },
  });

  const selectedDays = watch("availableDays") || [];

  const toggleDay = (day) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("availableDays", next, { shouldValidate: true });
  };

  const handleFileChange = (field, file) => {
    const label = field === "img" ? "Profile image" : "ID card image";
    clearErrors(field);
    if (!file) {
      setValue(field, null, { shouldValidate: true });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setValue(field, null, { shouldValidate: true });
      setError(field, {
        type: "maxSize",
        message: `${label} is too large (${formatFileSize(file.size)}). Maximum size is 2 MB.`,
      });
      return;
    }
    setValue(field, file, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setSubmitError("");
    setSubmitSuccess(false);
    if (data.img?.size > MAX_FILE_SIZE || data.doctorIdCard?.size > MAX_FILE_SIZE) {
      if (data.img?.size > MAX_FILE_SIZE) {
        setError("img", {
          type: "maxSize",
          message: `Profile image is too large (${formatFileSize(data.img.size)}). Maximum size is 2 MB.`,
        });
      }
      if (data.doctorIdCard?.size > MAX_FILE_SIZE) {
        setError("doctorIdCard", {
          type: "maxSize",
          message: `ID card image is too large (${formatFileSize(data.doctorIdCard.size)}). Maximum size is 2 MB.`,
        });
      }
      return;
    }
    const formData = new FormData();
    formData.append("img", data.img);
    formData.append("doctorIdCard", data.doctorIdCard);
    formData.append("specialization", data.specialization);
    formData.append("experience", String(data.experience));
    formData.append("qualification", data.qualification);
    formData.append("bio", data.bio);
    formData.append("clinicName", data.clinicName);
    formData.append("clinicAddress", data.clinicAddress);
    formData.append("clinicLocation", data.clinicLocation);
    formData.append("consultationFee", String(data.consultationFee));
    formData.append("availableDays", JSON.stringify(data.availableDays));
    formData.append("availableTime", JSON.stringify(data.availableTime));

    try {
      await registerAsDoctor(formData);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || "Registration failed");
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-2">Registration submitted</h1>
        <p className="text-gray-600">
          Your doctor registration is under review. An admin will verify your ID and approve your
          account. You will appear in the doctors list once approved.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Register as Doctor</h1>
      {submitError && (
        <p className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm">{submitError}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Profile image</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="border-2 px-2 py-1 rounded-md w-full"
            onChange={(e) => handleFileChange("img", e.target.files?.[0] ?? null)}
          />
          {errors.img && (
            <p className="text-red-500 text-sm mt-1">{errors.img.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">ID card image</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="border-2 px-2 py-1 rounded-md w-full"
            onChange={(e) =>
              handleFileChange("doctorIdCard", e.target.files?.[0] ?? null)
            }
          />
          {errors.doctorIdCard && (
            <p className="text-red-500 text-sm mt-1">{errors.doctorIdCard.message}</p>
          )}
        </div>

        <InputField
          label="Specialization"
          name="specialization"
          type="text"
          placeholder="e.g. General Physician"
          register={register}
          error={errors.specialization}
        />
        <InputField
          label="Experience (years)"
          name="experience"
          type="number"
          placeholder="0"
          register={register}
          error={errors.experience}
        />
        <InputField
          label="Qualification"
          name="qualification"
          type="text"
          placeholder="e.g. MBBS, MD"
          register={register}
          error={errors.qualification}
        />
        <div>
          <label className="block mb-1">Bio</label>
          <textarea
            className="border-2 px-2 py-1 rounded-md w-full min-h-[80px]"
            placeholder="Short bio"
            {...register("bio")}
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
        </div>
        <InputField
          label="Clinic name"
          name="clinicName"
          type="text"
          placeholder="Clinic name"
          register={register}
          error={errors.clinicName}
        />
        <InputField
          label="Clinic address"
          name="clinicAddress"
          type="text"
          placeholder="Full address"
          register={register}
          error={errors.clinicAddress}
        />
        <InputField
          label="Clinic location"
          name="clinicLocation"
          type="text"
          placeholder="City / area"
          register={register}
          error={errors.clinicLocation}
        />
        <InputField
          label="Consultation fee (₹)"
          name="consultationFee"
          type="number"
          placeholder="0"
          register={register}
          error={errors.consultationFee}
        />

        <div>
          <label className="block mb-2">Available days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <label key={day} className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
          {errors.availableDays && (
            <p className="text-red-500 text-sm">{errors.availableDays.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Available time (start)"
            name="availableTime.start"
            type="time"
            register={register}
            error={errors.availableTime?.start}
          />
          <InputField
            label="Available time (end)"
            name="availableTime.end"
            type="time"
            register={register}
            error={errors.availableTime?.end}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Submit registration"}
        </button>
      </form>
    </div>
  );
}

export default Register;
