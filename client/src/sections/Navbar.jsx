import {useContext, useState} from "react";
import LogoutButton from "../components/LogoutButton";
import {Link, NavLink} from "react-router-dom";
import {AuthContext} from "../context/authContext";
import {getFullName} from "../utils/getName";
import {CgProfile} from "react-icons/cg";
import Button from "../components/Button";
import {TiThMenuOutline} from "react-icons/ti";
import {BiHomeSmile} from "react-icons/bi";
import {FiUsers} from "react-icons/fi";
import {RiUserSettingsLine, RiContactsBook2Line} from "react-icons/ri";

function Navbar() {
  const {token} = useContext(AuthContext);
  let FullName;
  if (!token) {
    FullName = "";
  } else {
    FullName = getFullName(token);
  }
  const [open, setOpen] = useState(false);

  const data = [
    {
      name: "Home",
      link: "/",
      icon: <BiHomeSmile className="inline-block" size={25} />,
    },
    {
      name: "Our Doctors",
      link: "/doctors",
      icon: <FiUsers className="inline-block" size={22} />,
    },
    {
      name: "Services",
      link: "/services",
      icon: <RiUserSettingsLine className="inline-block" size={22} />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <RiContactsBook2Line className="inline-block" size={25} />,
    },
    {
      name: token ? FullName : "Login",
      link: token ? "/dashboard" : "/login",
      icon: <CgProfile className="inline-block" size={25} />,
    },
  ];

  return (
    <nav className="sticky top-0 flex justify-between items-center pl-2 py-2 md:p-4 bg-blue-900 text-white z-10">
      <h1 className="text-2xl font-bold">MedTech</h1>
      <div className="hidden md:flex gap-6">
        {data.map((item, index) => (
          <NavLink
            to={item.link}
            key={index}
            className={({isActive}) =>
              `flex flex-row items-center gap-1  p-3 rounded transition-all duration-300 ${
                isActive ? "bg-gray-400 text-black" : "hover:bg-blue-950"
              }`
            }
          >
            <div>{item.icon}</div>
            <div>{item.name}</div>
          </NavLink>
        ))}
        {token && <LogoutButton />}
      </div>

      <div className="md:hidden relative">
        <Button
          onclick={() => setOpen(!open)}
          className="outline-none border-0 w-fit p-2 bg-transparent"
          value=""
          icon={<TiThMenuOutline size={25} />}
        />
        {open && (
          <div className="absolute right-0 w-screen bg-white text-black rounded shadow-lg z-10 p-2">
            {data.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className="flex flex-row items-center gap-2 px-4 py-2 active:bg-gray-200"
              >
                <div>{item.icon}</div>
                <div>{item.name}</div>
              </Link>
            ))}
            {token && <LogoutButton className="block w-full px-4 py-2 mt-2" />}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
