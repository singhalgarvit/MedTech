import { useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import PatientProfileUpdate from "../../sections/PatientPage/PatientProfileUpdate";
import PatientOngoingAppointments from "../../sections/PatientPage/PatientOngoingAppointments";
import PatientPreviousAppointments from "../../sections/PatientPage/PatientPreviousAppointments";
import PatientPaymentHistory from "../../sections/PatientPage/PatientPaymentHistory";

const NAV_ITEMS = [
  { name: "My Profile", path: "/dashboard/profile", icon: HiOutlineUser },
  { name: "Ongoing Appointments", path: "/dashboard", icon: HiOutlineClock },
  { name: "Previous Appointments", path: "/dashboard/previous-appointments", icon: HiOutlineCalendar },
  { name: "Payment History", path: "/dashboard/payment-history", icon: HiOutlineCreditCard },
];

function NavList({ onItemClick }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {item.name}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

function PatientDashboard() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLabel =
    NAV_ITEMS.find((i) => i.path === location.pathname)?.name ?? "Ongoing Appointments";

  return (
    <div className="min-h-[70vh] flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-slate-200 md:bg-slate-50/60">
        <div className="sticky top-0 flex flex-col p-4">
          <div className="mb-6 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <HiOutlineUser className="h-5 w-5" />
            </div>
            <span className="font-semibold text-slate-800">Patient</span>
          </div>
          <nav className="flex-1">
            <NavList />
          </nav>
        </div>
      </aside>

      {/* Mobile header + menu trigger */}
      <div className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <HiOutlineMenu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{currentLabel}</h1>
        <div className="w-10" aria-hidden />
      </div>

      {/* Mobile slide-over menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
            aria-hidden
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="font-semibold text-slate-800">Patient Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close menu"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4">
              <NavList onItemClick={() => setMobileMenuOpen(false)} />
            </nav>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <header className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            {currentLabel}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage your medical appointments, history, and profile.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm md:shadow-none md:border-0 md:bg-transparent md:rounded-none">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 lg:p-8 shadow-sm">
            <Routes>
              <Route path="/" element={<PatientOngoingAppointments />} />
              <Route path="previous-appointments" element={<PatientPreviousAppointments />} />
              <Route path="payment-history" element={<PatientPaymentHistory />} />
              <Route path="profile" element={<PatientProfileUpdate />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;
