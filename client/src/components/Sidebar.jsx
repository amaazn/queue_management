import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiGrid, FiLayers, FiInbox } from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/queues", label: "Queues", icon: FiLayers },
];

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col p-5">

      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
          <FiInbox className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight text-white">QueueFlow</p>
          <p className="text-xs text-slate-400">Queue Manager</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-white/5 p-3 text-xs text-slate-400">
        <p className="font-semibold text-slate-200">QueueFlow v1.0</p>
        <p className="mt-0.5">Manage queues & tokens in real time.</p>
      </div>
    </div>
  );
}

const SIDEBAR_BG =
  "bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/5";

export default function Sidebar({ open, onClose }) {
  return (
    <>

      <aside className={`hidden w-64 shrink-0 lg:block ${SIDEBAR_BG}`}>
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden ${SIDEBAR_BG}`}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
