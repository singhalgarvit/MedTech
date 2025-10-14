function FormWrapper({children,className}) {
  return (
    <div className={`max-w-md mx-auto m-10 leading-10 p-6 border-2 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export default FormWrapper;
