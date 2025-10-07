
function InputField({label, name, type, register, error,placeholder}) {
  return (
    <>
      <label htmlFor={name} className="block">
        {label}:
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="border-2 px-2 py-1 rounded-md w-full"
        {...register(name, {required: `${label} is required`})}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
}

export default InputField;
