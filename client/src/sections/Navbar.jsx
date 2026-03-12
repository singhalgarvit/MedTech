import { useContext, useState, useEffect, useRef } from "react";
import LogoutButton from "../components/LogoutButton";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { getFullName, getNameInitials } from "../utils/getName";
import getRole from "../utils/getRole";
import getUserId from "../utils/getUserId";
import { CgProfile } from "react-icons/cg";
import Button from "../components/Button";
import { TiThMenuOutline } from "react-icons/ti";
import { BiHomeSmile } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { RiUserSettingsLine, RiContactsBook2Line } from "react-icons/ri";
import { getDoctorById } from "../services/doctorService";

function Navbar() {
  const { token, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = token ? getRole() : null;
  const fullName = token ? getFullName(token) : "";
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Attempt to parse the token to get user data natively if context `userData` is not passed
  let profileImg = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      profileImg = payload.img || (userData && userData.img) || null;
    } catch (e) {
      profileImg = null; // fallback
    }
  }

  const profileRefDesktop = useRef(null);
  const profileRefMobile = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      const inside =
        profileRefDesktop.current?.contains(e.target) ||
        profileRefMobile.current?.contains(e.target);
      if (!inside) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navData = [
    { name: "Home", link: "/", icon: <BiHomeSmile className="inline-block" size={25} /> },
    { name: "Our Doctors", link: "/doctors", icon: <FiUsers className="inline-block" size={22} /> },
    ...(role !== "doctor" && role !== "admin"
      ? [{ name: "Register", link: "/register", icon: <RiUserSettingsLine className="inline-block" size={22} /> }]
      : []),
    { name: "Contact", link: "/contact", icon: <RiContactsBook2Line className="inline-block" size={25} /> },
  ];

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <nav className="sticky top-0 flex justify-between items-center pl-2 py-2 md:p-4 bg-blue-900 text-white z-10">
      <h1 className="text-2xl font-bold">MedTech</h1>
      <div className="hidden md:flex gap-6 items-center">
        {navData.map((item, index) => (
          <NavLink
            to={item.link}
            key={index}
            className={({ isActive }) =>
              `flex flex-row items-center gap-1 p-3 rounded transition-all duration-300 ${
                isActive ? "bg-gray-400 text-black" : "hover:bg-blue-950"
              }`
            }
          >
            <div>{item.icon}</div>
            <div>{item.name}</div>
          </NavLink>
        ))}
        {token ? (
          <div className="relative" ref={profileRefDesktop}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-white/80 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Profile menu"
            >
              {profileImg ? (
                <img src={profileImg} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="bg-blue-700 text-white font-semibold text-sm flex items-center justify-center w-full h-full">
                  {fullName ? getNameInitials(fullName) : <CgProfile size={22} />}
                </span>
              )}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-900 rounded-lg shadow-xl py-2 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold truncate">{fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{roleLabel}</p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </button>
                <div className="px-4 py-2 border-t border-gray-100 mt-1">
                  <LogoutButton className="block w-full text-center" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex flex-row items-center gap-1 p-3 rounded transition-all duration-300 ${
                isActive ? "bg-gray-400 text-black" : "hover:bg-blue-950"
              }`
            }
          >
            <CgProfile className="inline-block" size={25} />
            <span>Login</span>
          </NavLink>
        )}
      </div>

      <div className="md:hidden relative flex items-center gap-2">
        {token && (
          <div className="relative" ref={profileRefMobile}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/80"
              aria-label="Profile menu"
            >
              {profileImg ? (
                <img src={profileImg} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="bg-blue-700 text-white font-semibold text-xs flex items-center justify-center w-full h-full">
                  {fullName ? getNameInitials(fullName) : <CgProfile size={20} />}
                </span>
              )}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white text-gray-900 rounded-lg shadow-xl py-2 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold truncate">{fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{roleLabel}</p>
                </div>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </button>
                <div className="px-4 py-2 border-t border-gray-100 mt-1">
                  <LogoutButton className="block w-full text-center" />
                </div>
              </div>
            )}
          </div>
        )}
        <Button
          onclick={() => setOpen(!open)}
          className="outline-none border-0 w-fit p-2 bg-transparent"
          value=""
          icon={<TiThMenuOutline size={25} />}
        />
        {open && (
          <div className="absolute right-0 top-12 w-screen bg-white text-black rounded shadow-lg z-99 p-2">
            {navData.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className="flex flex-row items-center gap-2 px-4 py-2 active:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                <div>{item.icon}</div>
                <div>{item.name}</div>
              </Link>
            ))}
            {!token && (
              <Link
                to="/login"
                className="flex flex-row items-center gap-2 px-4 py-2 active:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                <CgProfile size={22} />
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
