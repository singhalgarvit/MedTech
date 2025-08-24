import { AuthContextProvider } from "./authContext"

const ContextProvider=({children})=> {
  return (
    <AuthContextProvider>
        {children}
    </AuthContextProvider>
  )
}

export default ContextProvider;