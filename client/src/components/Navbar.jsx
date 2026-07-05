import { useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";

const titleForPath = (pathname) => {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/queues/")) return "Queue Details";
  if (pathname.startsWith("/queues")) return "Queues";
  return "QueueFlow";
};

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Navbar({ onMenuClick }) {
  const { manager, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-6">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">
          {titleForPath(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials(manager?.name)}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">
              {manager?.name}
            </p>
            <p className="text-xs text-slate-400">{manager?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary"
          title="Log out"
        >
          <FiLogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
