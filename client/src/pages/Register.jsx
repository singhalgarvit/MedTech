import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import { doctorSchema } from "../schemas/doctorSchema";
import { registerAsDoctor } from "../services/doctorService";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileDropZone({ label, hint, file, error, onFileChange, accept }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChange(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    onFileChange(f);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl min-h-[100px] flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/80"}
          ${isDragOver ? "border-teal-400 bg-teal-50/80 scale-[1.01]" : ""}
          ${file ? "border-teal-300 bg-teal-50/50" : ""}
          hover:border-teal-300 hover:bg-slate-100/80
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleInputChange}
        />
        {file ? (
          <div className="flex flex-col items-center gap-1 px-4 py-2">
            <span className="text-sm font-medium text-teal-800 truncate max-w-[200px]">
              {file.name}
            </span>
            <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
            <span className="text-xs text-teal-600">Click or drop to replace</span>
          </div>
        ) : (
          <div className="text-center px-4 py-2">
            <p className="text-sm text-slate-600">{hint}</p>
            <p className="text-xs text-slate-400 mt-0.5">JPEG, PNG or WebP · max 2 MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
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

  const profileFile = watch("img");
  const idCardFile = watch("doctorIdCard");
  const selectedDays = watch("availableDays") || [];

  const toggleDay = (shortDay) => {
    const idx = DAYS.indexOf(shortDay);
    const day = DAYS_FULL[idx];
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
      setValue(field, file, { shouldValidate: false });
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
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Registration submitted</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Your doctor registration is under review. An admin will verify your ID and approve your
            account. You’ll appear in the doctors list once approved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] p-6 md:p-10 pb-16">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Register as Doctor
          </h1>
          <p className="text-slate-600 mt-2">
            Complete your profile to join our network and reach more patients.
          </p>
          <p className="text-slate-600 mt-2 font-semibold">
            Note: All fields are required.
          </p>
        </header>

        {submitError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
          >
            <span className="shrink-0 mt-0.5" aria-hidden>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Profile & ID */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Your profile
            </h2>
            <p className="text-sm text-slate-500 mb-5">Upload a photo and your ID for verification.</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <FileDropZone
                label="Profile photo"
                hint="Drop image or click to upload"
                file={profileFile}
                error={errors.img?.message}
                onFileChange={(file) => handleFileChange("img", file)}
                accept="image/jpeg,image/jpg,image/png,image/webp"
              />
              <FileDropZone
                label="ID card"
                hint="Drop ID image or click to upload"
                file={idCardFile}
                error={errors.doctorIdCard?.message}
                onFileChange={(file) => handleFileChange("doctorIdCard", file)}
                accept="image/jpeg,image/jpg,image/png,image/webp"
              />
            </div>
          </section>

          {/* Professional details */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">
                2
              </span>
              Professional details
            </h2>
            <p className="text-sm text-slate-500 mb-5">Specialization, experience and qualifications.</p>
            <div className="flex flex-col gap-4">
              <InputField
                label="Specialization"
                name="specialization"
                type="text"
                placeholder="e.g. General Physician"
                register={register}
                error={errors.specialization}
              />
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  id="bio"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 min-h-[100px] placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                  placeholder="A short bio for your profile"
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Clinic */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">
                3
              </span>
              Clinic information
            </h2>
            <p className="text-sm text-slate-500 mb-5">Where patients can find you.</p>
            <div className="flex flex-col gap-4">
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
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="City / area"
                  name="clinicLocation"
                  type="text"
                  placeholder="City or area"
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
              </div>
            </div>
          </section>

          {/* Availability */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">
                4
              </span>
              Availability
            </h2>
            <p className="text-sm text-slate-500 mb-5">When you’re available for consultations.</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Available days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((shortDay) => {
                  const idx = DAYS.indexOf(shortDay);
                  const day = DAYS_FULL[idx];
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(shortDay)}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${isSelected
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
                      `}
                    >
                      {shortDay}
                    </button>
                  );
                })}
              </div>
              {errors.availableDays && (
                <p className="text-red-500 text-sm mt-1">{errors.availableDays.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="From"
                name="availableTime.start"
                type="time"
                register={register}
                error={errors.availableTime?.start}
              />
              <InputField
                label="To"
                name="availableTime.end"
                type="time"
                register={register}
                error={errors.availableTime?.end}
              />
            </div>
          </section>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <p className="text-sm text-slate-500">
              By submitting, you agree to verification of your documents by our team.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting…
                </span>
              ) : (
                "Submit registration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
