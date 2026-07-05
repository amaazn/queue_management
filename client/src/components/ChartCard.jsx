import { motion } from "framer-motion";

export default function ChartCard({ title, subtitle, children, index = 0 }) {
  return (
    <motion.div
      className="card p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className="h-64 w-full">{children}</div>
    </motion.div>
  );
}
