function FormWrapper({children}) {
  return (
    <div className="flex flex-col max-w-2xl w-full justify-center mx-auto items-center p-10 leading-10 rounded-2xl shadow-xl/20">
      {children}
    </div>
  );
}

export default FormWrapper;
