function FormWrapper({children}) {
  return (
    <div className="max-w-md mx-auto mt-10 leading-10 p-6 border-2 rounded-lg shadow-lg">
      {children}
    </div>
  );
}

export default FormWrapper;
