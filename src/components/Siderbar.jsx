
import { useAuth } from "../context/AuthContexts";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Settings,
  LogOut,
  X
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", path: "/calendar", icon: CalendarDays },
    { name: "Cycle Tracking", path: "/period-tracking", icon: ClipboardList },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-100
          bg-white h-screen flex flex-col justify-between py-6 px-4
          select-none transform transition-transform duration-300
          ease-in-out md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-12 rounded-xl flex items-center justify-center bg-rose-50/50 mx-auto">
                <img
                  src="/logocrop.jpg"
                  alt="Down There logo"
                  className="w-12 h-10 object-contain rounded-xl"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-rose-950">
                  Down There
                </h1>
                <p className="text-xs text-gray-400">
                  Understand your cycle
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-rose-600"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Menu
            </p>

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-rose-100 text-rose-700 font-semibold"
                        : "text-gray-500 hover:bg-rose-50 hover:text-rose-700"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
