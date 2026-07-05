import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  FiLayers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiAward,
} from "react-icons/fi";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import { LoadingScreen } from "../components/Spinner.jsx";
import { getDashboard } from "../services/dashboardService.js";

const axisProps = {
  tick: { fontSize: 12, fill: "#94a3b8" },
  axisLine: false,
  tickLine: false,
};
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 24px -8px rgba(15,23,42,0.15)",
  fontSize: 13,
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to load dashboard")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen label="Crunching the numbers..." />;
  if (!data) return null;

  const { stats, trend } = data;

  const cards = [
    { icon: FiLayers, label: "Total Queues", value: stats.totalQueues, accent: "brand" },
    { icon: FiClock, label: "Waiting Tokens", value: stats.waitingTokens, accent: "amber" },
    { icon: FiCheckCircle, label: "Served Today", value: stats.servedToday, accent: "emerald" },
    { icon: FiXCircle, label: "Cancelled Today", value: stats.cancelledToday, accent: "rose" },
    {
      icon: FiActivity,
      label: "Average Wait Time",
      value: stats.averageWaitTime.label,
      accent: "sky",
    },
    {
      icon: FiAward,
      label: "Longest Queue",
      value: stats.longestQueue ? stats.longestQueue.name : "—",
      hint: stats.longestQueue ? `${stats.longestQueue.count} waiting` : "No active queues",
      accent: "violet",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500">
          Live statistics across all your queues.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <StatCard key={c.label} index={i} {...c} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Queue Length Trend" subtitle="Tokens added per day (last 7 days)" index={0}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBrand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="added"
                name="Tokens added"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#gradBrand)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Wait Time Trend" subtitle="Minutes per day (served tokens)" index={1}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} unit="m" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} min`, "Avg wait"]} />
              <Area
                type="monotone"
                dataKey="avgWaitMin"
                name="Avg wait (min)"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fill="url(#gradSky)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Served Tokens" subtitle="Completed per day" index={2}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="served" name="Served" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Cancelled Tokens" subtitle="Cancelled per day" index={3}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
