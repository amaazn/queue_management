import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiTrash2, FiArrowRight, FiInbox } from "react-icons/fi";
import { formatDate } from "../utils/formatDate.js";

export default function QueueCard({ queue, index = 0, onDelete }) {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="card group flex flex-col p-5 transition-shadow hover:shadow-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <FiInbox className="h-5 w-5" />
        </div>
        <button
          onClick={() => onDelete(queue)}
          className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-600"
          title="Delete queue"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">{queue.name}</h3>
      <p className="text-xs text-slate-400">Created {formatDate(queue.createdAt)}</p>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <FiUsers className="h-4 w-4 text-slate-400" />
        <span className="font-semibold text-slate-800">{queue.waitingCount}</span>
        waiting
      </div>

      <button
        onClick={() => navigate(`/queues/${queue._id}`)}
        className="btn-primary mt-5 w-full"
      >
        Open Queue
        <FiArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
