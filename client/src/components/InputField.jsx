function InputField({ label, name, type, register, error, placeholder, inputClassName }) {
  const defaultInputClass =
    "border-2 border-slate-200 rounded-xl px-4 py-3 w-full placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all";
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={inputClassName ?? defaultInputClass}
        {...register(name, { required: `${label} is required` })}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default InputField;
