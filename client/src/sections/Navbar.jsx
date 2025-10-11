import {useContext, useState} from "react";
import LogoutButton from "../components/LogoutButton";
import {Link} from "react-router-dom";
import {AuthContext} from "../context/authContext";
import {getFullName} from "../utils/getName";
import {CgProfile} from "react-icons/cg";
import Button from "../components/Button";
import {TiThMenuOutline} from "react-icons/ti";

function Navbar() {
  const {token} = useContext(AuthContext);
  const FullName = getFullName(token);
  const [open, setOpen] = useState(false);

  const data = [
    {name: "Home", link: "/"},
    {name: "Our Doctors", link: "/doctors"},
    {name: "Services", link: "/services"},
    {name: "Contact", link: "/contact"},
    {name: FullName, link: "/profile", icon: <CgProfile className="inline-block" size={25} />}
  ];

  return (
    <nav className="sticky top-0 flex justify-between items-center pl-2 py-2 md:p-4 bg-blue-800 text-white z-10">
      <h1 className="text-2xl font-bold">MedTech</h1>
      <div className="hidden md:flex space-x-6">
        {data.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="hover:bg-blue-950 p-3 rounded transition-all"
          >
            {item.icon} {item.name}
          </Link>
        ))}
        <LogoutButton />
      </div>

      <div className="md:hidden relative">
        <Button
          onclick={() => setOpen(!open)}
          className="outline-none border-0 w-fit p-2 bg-none"
          value=""
          icon={<TiThMenuOutline size={25} />}
        />
        {open && (
          <div className="absolute right-0 w-screen bg-white text-black rounded shadow-lg z-10 p-2">
            {data.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className="block px-4 py-2 hover:bg-gray-200"
              >
                {item.icon} {item.name}
              </Link>
            ))}
            <LogoutButton className="block w-full px-4 py-2 mt-2" />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
