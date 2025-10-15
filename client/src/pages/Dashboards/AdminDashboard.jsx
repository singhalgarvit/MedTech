import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CreateDoctor from "../../sections/AdminPage/CreateDoctor";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const listItems = [
    {name: "Home", path: "/dashboard"},
    {name: "Doctors", path: "/dashboard/doctors"},
    {name: "Patients", path: "/dashboard/patients"},
    {name: "Appointments", path: "/dashboard/appointments"},
    {name: "Settings", path: "/dashboard/settings"},
  ];

  return (
    <div className="p-6 md:p-12">
      <h1 className="text-2xl font-bold text-center mb-2">Admin DashBoard</h1>

      {/* Desktop Navigation */}
      <ul className="hidden sm:flex flex-row gap-3 w-fit border-0 py-2 px-4 shadow-[inset_0_0px_4px_rgba(0,0,0,0.6)] rounded-md">
        {listItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end
            className={({isActive}) =>
              `border-0 py-1 px-2 rounded-md transition-all ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-500 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </ul>

      {/* Mobile Dropdown */}
      <div className="sm:hidden mt-4 text-center">
        <select
          value={currentPath}
          onChange={(e) => navigate(e.target.value)}
          className="w-3/4 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {listItems.map((item, index) => (
            <option key={index} value={item.path}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content Area */}
      <div className="sm:shadow-[inset_0_0px_4px_rgba(0,0,0,0.6)] rounded-md p-1 md:p-4 my-6">
        <Routes>
          <Route path="/" element={<div>Admin Home</div>} />
          <Route path="doctors" element={<CreateDoctor />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
