function FormWrapper({children}) {
  return (
    <div className="flex flex-col max-w-2xl w-full justify-center mx-auto mt-2 items-center p-10 leading-10 rounded-2xl shadow-xl/20 border-1 border-gray-200">
      {children}
    </div>
  );
}

export default FormWrapper;
