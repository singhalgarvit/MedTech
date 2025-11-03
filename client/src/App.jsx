import "./App.css";
import {useLocation} from "react-router-dom";
import Routers from "./Routers";
import Footer from "./sections/Footer";
import Navbar from "./sections/Navbar";
import ChatbotIcon from "./components/ChatbotIcon";

function App() {
  const location = useLocation();
  const hideFooterRoutes = ["/chat"];
  return (
    <>
      <Navbar />
      <Routers />
      {!hideFooterRoutes.includes(location.pathname) && <ChatbotIcon />}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
