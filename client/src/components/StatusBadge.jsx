import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

const CONFIG = {
  WAITING: {
    label: "Waiting",
    className: "bg-amber-100 text-amber-700",
    Icon: FiClock,
  },
  SERVED: {
    label: "Served",
    className: "bg-emerald-100 text-emerald-700",
    Icon: FiCheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose-100 text-rose-700",
    Icon: FiXCircle,
  },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || CONFIG.WAITING;
  const { Icon } = cfg;
  return (
    <span className={`badge ${cfg.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}
